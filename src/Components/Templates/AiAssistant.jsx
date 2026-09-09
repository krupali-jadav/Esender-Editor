import { useEffect, useState } from "react";
import {
    Card, Button, Space, Modal, Input, Select, Typography, Tag, message, Alert, Flex, Tooltip,
} from "antd";
import { RobotOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useNavigate } from "react-router-dom";
import {
    getAiCapabilities, aiGenerateSubject, aiGenerateText, aiRewriteText, aiTranslateText,
    aiGenerateDescription, newIdempotencyKey,
} from "../../util/AiApi";

const { Text, Paragraph } = Typography;

const TONES = ["professional", "friendly", "promotional", "concise"];

// Each AI action: the plan feature it needs, its API call, and where the result
// goes ("subject"/"text" form fields, or "body" = the editor canvas via loadHtml).
const ACTIONS = {
    subject: { feature: "aiSubject", api: aiGenerateSubject, target: "subject", label: "Generate subject", needsInput: false },
    text: { feature: "aiText", api: aiGenerateText, target: "text", label: "Generate text", needsInput: false },
    rewrite: { feature: "aiRewrite", api: aiRewriteText, target: "text", label: "Rewrite text", needsInput: true },
    translate: { feature: "aiTranslate", api: aiTranslateText, target: "text", label: "Translate text", needsInput: true, needsLanguage: true },
    body: { feature: "aiText", api: aiGenerateDescription, target: "body", label: "Generate body draft", needsInput: false },
};

const escapeHtml = (s) =>
    String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Wrap escaped plain text into simple, safe paragraph HTML for the canvas.
const textToHtml = (text) =>
    String(text || "").split(/\n{2,}/).map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`).join("");

export default function AiAssistant({ projectId, templateId, form, editorRef, theme }) {
    const navigate = useNavigate();
    const [caps, setCaps] = useState(null);
    const [action, setAction] = useState(null);
    const [instructions, setInstructions] = useState("");
    const [tone, setTone] = useState("professional");
    const [language, setLanguage] = useState("Spanish");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [prevJson, setPrevJson] = useState(null);

    const loadCaps = async () => {
        const res = await getAiCapabilities(projectId);
        setCaps(res && res.status ? res : { configured: !!res?.configured, features: {}, credits: { remaining: 0, limit: 0 } });
    };
    useEffect(() => { if (projectId) loadCaps(); }, [projectId]);

    if (!caps) return null;
    if (!caps.configured) return null; // AI not configured on the server — hide silently.

    const remaining = caps.credits?.remaining ?? 0;
    const limit = caps.credits?.limit ?? 0;

    const featureOk = (a) => Boolean(caps.features?.[ACTIONS[a].feature]);
    const cost = (a) => caps.costs?.[apiActionName(a)] ?? 1;

    const open = (a) => {
        setAction(a);
        setInstructions("");
        setResult(null);
    };
    const close = () => { setAction(null); setResult(null); };

    const run = async () => {
        const cfg = ACTIONS[action];
        const currentText = form.getFieldValue("text") || "";
        const currentSubject = form.getFieldValue("subject") || "";

        // Resolve the input the action operates on.
        let input = "";
        if (action === "rewrite" || action === "translate") input = currentText;
        else if (action === "subject") input = currentSubject;
        else if (action === "text") input = currentText;

        if (cfg.needsInput && !input.trim()) {
            message.warning(t("add.some.text.first", { defaultValue: "Add some text first." }));
            return;
        }

        setLoading(true);
        const payload = {
            projectId,
            ...(templateId ? { templateId } : {}),
            field: cfg.target === "subject" ? "subject" : "text",
            input,
            instructions,
            tone,
            ...(cfg.needsLanguage ? { language } : {}),
        };
        const res = await cfg.api(payload, { idempotencyKey: newIdempotencyKey() });
        setLoading(false);

        if (!res?.status) {
            handleCode(res);
            return;
        }
        // Trust the server's returned balance — never guess locally.
        if (res.credits && caps.credits) {
            setCaps((c) => ({ ...c, credits: { ...c.credits, remaining: res.credits.remaining ?? c.credits.remaining, used: res.credits.used } }));
        }
        setResult(res.text || "");
    };

    const handleCode = (res) => {
        const code = res?.code;
        if (code === "AI_CREDITS_EXHAUSTED" || code === "SUBSCRIPTION_REQUIRED" || code === "AI_FEATURE_NOT_INCLUDED") {
            Modal.confirm({
                title: t("upgrade.required", { defaultValue: "Upgrade required" }),
                content: res.message,
                okText: t("view.plans", { defaultValue: "View plans" }),
                onOk: () => navigate("/plans"),
            });
        } else {
            message.error(res?.message || t("ai.request.failed", { defaultValue: "AI request failed" }));
        }
    };

    const applyText = (mode) => {
        const cfg = ACTIONS[action];
        if (cfg.target === "subject") {
            form.setFieldsValue({ subject: result });
        } else {
            const existing = form.getFieldValue("text") || "";
            form.setFieldsValue({ text: mode === "append" && existing ? `${existing}\n\n${result}` : result });
        }
        message.success(t("applied", { defaultValue: "Applied" }));
        close();
    };

    const applyBody = () => {
        if (!editorRef.current?.loadHtml) {
            message.error(t("editor.not.ready", { defaultValue: "Editor is not ready." }));
            return;
        }
        try { setPrevJson(editorRef.current.getJson?.() || null); } catch { /* ignore */ }
        editorRef.current.loadHtml(textToHtml(result));
        message.success(t("inserted.into.canvas", { defaultValue: "Inserted into the canvas." }));
        close();
    };

    const undoBody = () => {
        if (prevJson && editorRef.current?.loadJson) {
            editorRef.current.loadJson(prevJson, false);
            setPrevJson(null);
            message.info(t("restored.previous.design", { defaultValue: "Restored the previous design." }));
        }
    };

    const copyResult = async () => {
        try { await navigator.clipboard.writeText(result); message.success(t("copied", { defaultValue: "Copied" })); }
        catch { message.error(t("copy.failed", { defaultValue: "Copy failed" })); }
    };

    const cfg = action ? ACTIONS[action] : null;
    const isBody = action === "body";

    return (
        <Card
            size="small"
            style={{ background: theme ? "#0F2233" : "#fff" }}
            title={<Space><RobotOutlined style={{ color: "#20A6CE" }} />{t("ai.assistant", { defaultValue: "AI Assistant" })}</Space>}
            extra={
                <Tag color={remaining > 0 ? "cyan" : "default"}>
                    {limit > 0 ? `${remaining} ${t("credits.left", { defaultValue: "credits left" })}` : t("not.included", { defaultValue: "Not included" })}
                </Tag>
            }
        >
            {prevJson && (
                <Alert style={{ marginBottom: 10 }} type="info" showIcon
                    message={t("canvas.replaced.by.ai", { defaultValue: "The canvas was replaced by AI-generated HTML." })}
                    action={<Button size="small" onClick={undoBody}>{t("undo", { defaultValue: "Undo" })}</Button>} />
            )}
            <Space wrap>
                {Object.keys(ACTIONS).map((a) => {
                    const allowed = featureOk(a);
                    return (
                        <Tooltip key={a} title={allowed ? `${cost(a)} ${t("credit", { defaultValue: "credit" })}` : t("not.in.your.plan", { defaultValue: "Not in your plan" })}>
                            <Button
                                icon={<ThunderboltOutlined />}
                                disabled={!allowed}
                                onClick={() => open(a)}
                            >
                                {t(`ai.${a}`, { defaultValue: ACTIONS[a].label })}
                            </Button>
                        </Tooltip>
                    );
                })}
            </Space>
            {Object.keys(ACTIONS).some((a) => !featureOk(a)) && (
                <div style={{ marginTop: 8 }}>
                    <Button type="link" size="small" onClick={() => navigate("/plans")}>
                        {t("upgrade.for.more.ai", { defaultValue: "Upgrade for more AI features" })}
                    </Button>
                </div>
            )}

            <Modal
                open={!!action}
                onCancel={close}
                title={cfg ? t(`ai.${action}`, { defaultValue: cfg.label }) : ""}
                footer={
                    result === null ? (
                        <Space>
                            <Button onClick={close}>{t("cancel", { defaultValue: "Cancel" })}</Button>
                            <Button type="primary" loading={loading} onClick={run}>
                                {t("generate", { defaultValue: "Generate" })} ({cfg ? cost(action) : 1})
                            </Button>
                        </Space>
                    ) : null
                }
            >
                {result === null ? (
                    <Space direction="vertical" style={{ width: "100%" }}>
                        {cfg?.needsLanguage && (
                            <div>
                                <Text type="secondary">{t("target.language", { defaultValue: "Target language" })}</Text>
                                <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Spanish" />
                            </div>
                        )}
                        <div>
                            <Text type="secondary">{t("tone", { defaultValue: "Tone" })}</Text>
                            <Select value={tone} onChange={setTone} style={{ width: "100%" }}
                                options={TONES.map((x) => ({ value: x, label: x }))} />
                        </div>
                        <div>
                            <Text type="secondary">{t("instructions.optional", { defaultValue: "Instructions (optional)" })}</Text>
                            <Input.TextArea rows={3} value={instructions} onChange={(e) => setInstructions(e.target.value)}
                                placeholder={t("what.should.it.say", { defaultValue: "What should it say?" })} />
                        </div>
                        {isBody && (
                            <Alert type="warning" showIcon
                                message={t("body.replace.warning", { defaultValue: "Generating a body draft replaces the canvas with raw HTML, which can reduce block-level editability. Your current design is preserved so you can undo." })} />
                        )}
                    </Space>
                ) : (
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Card size="small" style={{ maxHeight: 260, overflow: "auto", whiteSpace: "pre-wrap" }}>
                            <Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>{result}</Paragraph>
                        </Card>
                        <Flex justify="flex-end" gap={8} wrap>
                            <Button onClick={close}>{t("cancel", { defaultValue: "Cancel" })}</Button>
                            <Button onClick={copyResult}>{t("copy", { defaultValue: "Copy" })}</Button>
                            {isBody ? (
                                <Button type="primary" onClick={applyBody}>{t("insert.into.canvas", { defaultValue: "Insert into canvas" })}</Button>
                            ) : (
                                <>
                                    {cfg?.target === "text" && <Button onClick={() => applyText("append")}>{t("append", { defaultValue: "Append" })}</Button>}
                                    <Button type="primary" onClick={() => applyText("replace")}>{t("replace", { defaultValue: "Replace" })}</Button>
                                </>
                            )}
                        </Flex>
                    </Space>
                )}
            </Modal>
        </Card>
    );
}

// Map the internal action key to the server action name (for cost lookup).
function apiActionName(a) {
    return {
        subject: "generate-template-subject",
        text: "generate-text",
        rewrite: "rewrite-text",
        translate: "translate-text",
        body: "generate-template-description",
    }[a];
}
