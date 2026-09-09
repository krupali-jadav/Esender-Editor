import { useEffect, useRef, useState } from "react";
import {
    Modal, Radio, Space, Typography, Table, Tag, Divider, Button, Alert, Spin, Flex, Result,
} from "antd";
import { CheckCircleFilled, CloseCircleFilled, ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { getQuote, checkout, getOrderStatus } from "./SubscriptionApi";
import { featureLabel, limitLabel, formatLimit, money } from "./planLabels";

const { Text, Title } = Typography;

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

// A confirmation modal that loads the SERVER quote, shows the comparison and the
// exact price breakdown, lets the user pick only the modes/gateways the server
// allows, then checks out and polls the authenticated order status. A gateway
// redirect is NEVER treated as success — only a verified `paid` status is.
export default function PlanChangeModal({ open, plan, billingInterval, currency, onClose, onSettled }) {
    const [quote, setQuote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState(null);
    const [gateway, setGateway] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [phase, setPhase] = useState("quote"); // quote | pending | verified | failed | abandoned
    const pollRef = useRef(null);
    const startedRef = useRef(0);

    const stopPolling = () => {
        if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };

    useEffect(() => () => stopPolling(), []);

    useEffect(() => {
        if (!open || !plan) return;
        setPhase("quote");
        setQuote(null);
        (async () => {
            setLoading(true);
            const res = await getQuote({
                planId: plan._id || plan.id,
                billingInterval,
                currency,
            });
            setLoading(false);
            if (res?.status) {
                setQuote(res.quote);
                setMode(res.quote.defaultMode || (res.quote.allowedModes || [])[0] || null);
                setGateway((res.quote.allowedGateways || [])[0]?.name || null);
            }
        })();
    }, [open, plan, billingInterval, currency]);

    // Re-quote when the mode changes (price/expiry depend on it).
    const selected = quote?.modes?.find((m) => m.mode === mode) || quote;

    const pollStatus = (orderId) => {
        startedRef.current = Date.now();
        setPhase("pending");
        stopPolling();
        pollRef.current = setInterval(async () => {
            if (Date.now() - startedRef.current > POLL_TIMEOUT_MS) {
                stopPolling();
                setPhase("abandoned");
                return;
            }
            const s = await getOrderStatus(orderId);
            if (!s) return;
            if (s.paid) {
                stopPolling();
                setPhase("verified");
                onSettled?.();
            } else if (s.orderStatus === "failed") {
                stopPolling();
                setPhase("failed");
            }
        }, POLL_INTERVAL_MS);
    };

    const onConfirm = async () => {
        setSubmitting(true);
        const res = await checkout({
            planId: plan._id || plan.id,
            billingInterval,
            mode,
            currency,
            gateway,
            returnUrl: window.location.href,
        });
        setSubmitting(false);
        if (!res?.status) return;

        if (res.free) {
            setPhase("verified");
            onSettled?.();
            return;
        }
        if (res.paymentUrl) {
            window.open(res.paymentUrl, "_blank", "noopener");
            pollStatus(res.orderId);
        }
    };

    const featureRows = (quote?.comparison?.features || []).filter((f) => f.direction !== "same" || f.to);
    const limitRows = quote?.comparison?.limits || [];

    const dirTag = (d) =>
        d === "up" ? <Tag color="green" icon={<ArrowUpOutlined />}>{t("upgrade", { defaultValue: "Upgrade" })}</Tag>
            : d === "down" ? <Tag color="orange" icon={<ArrowDownOutlined />}>{t("lower", { defaultValue: "Lower" })}</Tag>
                : <Tag>{t("same", { defaultValue: "Same" })}</Tag>;

    return (
        <Modal
            open={open}
            onCancel={() => { stopPolling(); onClose?.(); }}
            title={plan ? `${quote?.changeType ? quote.changeType.toUpperCase() : ""} — ${plan.name}` : ""}
            width={720}
            footer={
                phase === "quote" ? (
                    <Space>
                        <Button onClick={onClose}>{t("cancel", { defaultValue: "Cancel" })}</Button>
                        <Button
                            type="primary"
                            loading={submitting}
                            disabled={!quote || selected?.blocked || (selected?.total > 0 && !gateway)}
                            onClick={onConfirm}
                        >
                            {selected?.total > 0
                                ? t("proceed.to.payment", { defaultValue: "Proceed to payment" })
                                : t("confirm", { defaultValue: "Confirm" })}
                        </Button>
                    </Space>
                ) : null
            }
        >
            {loading ? (
                <Flex justify="center" style={{ padding: 40 }}><Spin /></Flex>
            ) : !quote ? (
                <Alert type="error" showIcon message={t("could.not.load.quote", { defaultValue: "Could not load the quote. Please try again." })} />
            ) : phase === "verified" ? (
                <Result status="success" title={t("payment.verified", { defaultValue: "Payment verified" })}
                    subTitle={t("your.plan.is.now.active", { defaultValue: "Your plan is now active." })}
                    extra={<Button type="primary" onClick={onClose}>{t("done", { defaultValue: "Done" })}</Button>} />
            ) : phase === "failed" ? (
                <Result status="error" title={t("payment.failed", { defaultValue: "Payment failed" })}
                    subTitle={t("no.charge.was.made", { defaultValue: "No change was made to your subscription." })}
                    extra={<Button onClick={() => setPhase("quote")}>{t("try.again", { defaultValue: "Try again" })}</Button>} />
            ) : phase === "abandoned" ? (
                <Result status="warning" title={t("still.waiting.for.payment", { defaultValue: "Still waiting for payment" })}
                    subTitle={t("if.you.completed.payment.it.may.take.a.moment", { defaultValue: "If you completed payment it may take a moment to verify. You can close this and refresh shortly." })}
                    extra={<Button onClick={onClose}>{t("close", { defaultValue: "Close" })}</Button>} />
            ) : phase === "pending" ? (
                <Flex vertical align="center" gap={12} style={{ padding: 24 }}>
                    <Spin size="large" />
                    <Text>{t("waiting.for.payment.confirmation", { defaultValue: "Waiting for payment confirmation…" })}</Text>
                    <Text type="secondary">{t("complete.payment.in.the.opened.tab", { defaultValue: "Complete the payment in the opened tab. This verifies automatically." })}</Text>
                </Flex>
            ) : (
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                    {selected?.blocked && (
                        <Alert type="warning" showIcon
                            message={t("downgrade.blocked", { defaultValue: "This change can't apply immediately" })}
                            description={(selected.blockers || []).map((b) => `${limitLabel(b.key)}: ${b.used} used > ${b.limit} allowed`).join("; ")} />
                    )}

                    {/* Start date + change mode */}
                    {(quote.allowedModes || []).length > 0 && (
                        <div>
                            <Text strong>{t("when.to.apply", { defaultValue: "When to apply" })}</Text>
                            <div style={{ marginTop: 8 }}>
                                <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <Space direction="vertical">
                                        {quote.allowedModes.map((m) => (
                                            <Radio key={m} value={m}>
                                                {m === "immediate"
                                                    ? t("immediately", { defaultValue: "Immediately" })
                                                    : t("at.end.of.current.term", { defaultValue: "At the end of the current term" })}
                                            </Radio>
                                        ))}
                                    </Space>
                                </Radio.Group>
                            </div>
                        </div>
                    )}

                    {/* Comparison */}
                    {(featureRows.length > 0 || limitRows.length > 0) && (
                        <>
                            <Divider style={{ margin: "6px 0" }}>{t("what.changes", { defaultValue: "What changes" })}</Divider>
                            <Table
                                size="small" pagination={false} rowKey="key"
                                dataSource={limitRows}
                                columns={[
                                    { title: t("limit", { defaultValue: "Limit" }), dataIndex: "key", render: (k) => limitLabel(k) },
                                    { title: t("current", { defaultValue: "Current" }), dataIndex: "from", render: (v, r) => formatLimit(r.key, v) },
                                    { title: t("new", { defaultValue: "New" }), dataIndex: "to", render: (v, r) => formatLimit(r.key, v) },
                                    { title: "", dataIndex: "direction", render: (d) => dirTag(d) },
                                ]}
                            />
                            <Space wrap>
                                {featureRows.map((f) => (
                                    <Tag key={f.key} color={f.to ? "green" : "default"}
                                        icon={f.to ? <CheckCircleFilled /> : <CloseCircleFilled />}>
                                        {featureLabel(f.key)}{f.dropped ? ` (${t("removed", { defaultValue: "removed" })})` : ""}
                                    </Tag>
                                ))}
                            </Space>
                        </>
                    )}

                    {/* Gateway */}
                    {selected?.total > 0 && (quote.allowedGateways || []).length > 0 && (
                        <div>
                            <Text strong>{t("payment.method", { defaultValue: "Payment method" })}</Text>
                            <div style={{ marginTop: 8 }}>
                                <Radio.Group value={gateway} onChange={(e) => setGateway(e.target.value)}>
                                    {quote.allowedGateways.map((g) => (
                                        <Radio.Button key={g.name} value={g.name} style={{ textTransform: "capitalize" }}>{g.name}</Radio.Button>
                                    ))}
                                </Radio.Group>
                            </div>
                        </div>
                    )}

                    {/* Price breakdown */}
                    <Divider style={{ margin: "6px 0" }}>{t("summary", { defaultValue: "Summary" })}</Divider>
                    <Row label={t("base.price", { defaultValue: "Base price" })} value={money(selected?.basePrice, quote.currency)} />
                    {selected?.discount > 0 && <Row label={t("credit.proration", { defaultValue: "Credit / proration" })} value={`− ${money(selected.discount, quote.currency)}`} />}
                    {selected?.gatewayFee > 0 && <Row label={t("gateway.fee", { defaultValue: "Gateway fee" })} value={money(selected.gatewayFee, quote.currency)} />}
                    {selected?.tax > 0 && <Row label={t("tax", { defaultValue: "Tax" })} value={money(selected.tax, quote.currency)} />}
                    <Divider style={{ margin: "6px 0" }} />
                    <Flex justify="space-between">
                        <Title level={5} style={{ margin: 0 }}>{t("total", { defaultValue: "Total" })}</Title>
                        <Title level={5} style={{ margin: 0 }}>{money(selected?.total, quote.currency)}</Title>
                    </Flex>
                    {selected?.startsAt && (
                        <Text type="secondary">
                            {selected.takesEffectImmediately
                                ? t("starts.immediately", { defaultValue: "Starts immediately" })
                                : `${t("starts.on", { defaultValue: "Starts on" })} ${new Date(selected.startsAt).toLocaleDateString()}`}
                        </Text>
                    )}
                </Space>
            )}
        </Modal>
    );
}

function Row({ label, value }) {
    return (
        <Flex justify="space-between">
            <Text type="secondary">{label}</Text>
            <Text>{value}</Text>
        </Flex>
    );
}
