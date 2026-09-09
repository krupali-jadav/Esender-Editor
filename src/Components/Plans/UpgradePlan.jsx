import { Modal, Row, Col, Card, Typography, Flex, Divider, Button, Space, Tag, Badge } from "antd";
import { useEffect, useState } from "react";
import { t } from "i18next";
import {CheckCircleFilled, CloseCircleFilled, CreditCardOutlined, ThunderboltFilled, ProjectOutlined,FileTextOutlined, TeamOutlined, DatabaseOutlined, CalendarOutlined,} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { CURRENCIES_SYMBOL } from "../../util/commom.utils";

const { Title, Text } = Typography;
const PRIMARY = "#20A6CE";

const Item = ({ label, value }) => (
    <Flex justify="space-between" align="center" style={{ minHeight: 34 }}>
        <Text type="secondary">{label}</Text>
        <Text strong>{value}</Text>
    </Flex>
);

const StatCard = ({ icon, label, value, colors }) => (
    <Col span={12}>
        <Card size="small" style={{ background: colors.cardSecondary, borderColor: colors.border }}>
            <Space>
                {icon}
                <Flex vertical>
                    <Text type="secondary" style={{ fontSize: 11 }}>{label}</Text>
                    <Text strong>{value}</Text>
                </Flex>
            </Space>
        </Card>
    </Col>
);

function UpgradePlan({ open, onCancel, quote, theme, loading = false, onContinue }) {
    const [selectedGateway, setSelectedGateway] = useState(null);
    const isDark = !!theme;
    const currency = useSelector((state) => state.app.currency);

    const colors = {
        page: isDark ? "#102638" : "#F5F7FA",
        card: isDark ? "#0F2233" : "#FFFFFF",
        cardSecondary: isDark ? "#102638" : "#F8FAFC",
        border: isDark ? "#1D3A4D" : "#E5E7EB",
        text: isDark ? "#F1F5F9" : "#17202A",
        secondary: isDark ? "#91A4B7" : "#667085",
        muted: isDark ? "#6F8495" : "#98A2B3",
    };

    useEffect(() => {
        setSelectedGateway(open ? quote?.defaultMode || quote?.allowedGateways?.[0]?.name || null : null);
    }, [open, quote]);

    if (!quote) return null;

    const plan = quote?.plan;
    const formatNumber = (v) => Number(v || 0).toLocaleString("en-IN");
    const formatStorage = (bytes) => (bytes ? `${(bytes / 1024 ** 3).toFixed(0)} GB` : "0 GB");

    const features = Object.entries(plan?.features || {}).map(([key, enabled]) => ({
        key,
        label: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
        enabled,
    }));
    const enabledFeatures = features.filter((f) => f.enabled);
    const disabledFeatures = features.filter((f) => !f.enabled);

    const handleContinue = () => selectedGateway && onContinue?.({ quote, gateway: selectedGateway });

    const cardStyle = { background: colors.card, borderColor: colors.border };

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={900}
            centered
            // destroyOnClose
            styles={{
                content: { padding: 0, overflow: "hidden", background: colors.page, borderRadius: 14 },
                header: { margin: 0, padding: "18px 24px", background: colors.card, borderBottom: `1px solid ${colors.border}` },
                body: { padding: 20, maxHeight: "78vh", overflowY: "auto" },
                mask: { backgroundColor: "rgba(0, 0, 0, 0.55)" },
            }}
            title={
                <Space size={10}>
                    <Flex align="center" justify="center" style={{ width: 34, height: 34, borderRadius: 8, background: `${PRIMARY}18` }}>
                        <ThunderboltFilled style={{ color: PRIMARY, fontSize: 18 }} />
                    </Flex>
                    <div>
                        <Text strong style={{ display: "block", color: colors.text, fontSize: 17 }}>
                            {t("upgrade.plan", { defaultValue: "Upgrade Plan" })}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>{t("review.your.plan.before.continuing", { defaultValue: "Review your plan before continuing" })}</Text>
                    </div>
                </Space>
            }
        >
            <Space direction="vertical" size={14} style={{ width: "100%" }}>
                {/* PLAN HERO */}
                <Card size="small" style={{ ...cardStyle, borderColor: `${PRIMARY}55` }} styles={{ body: { padding: 20 } }}>
                    <Row gutter={[20, 16]} align="middle">
                        <Col flex="1">
                            <Space direction="vertical" size={8}>
                                <Space size={8}>
                                    <Title level={3} style={{ margin: 0, color: colors.text }}>{plan?.name || "Plan"}</Title>
                                    {plan?.isRecommended && (
                                        <Tag color={PRIMARY} bordered={false} style={{ margin: 0, fontWeight: 600 }}>{t("recommended", { defaultValue: "RECOMMENDED" })}</Tag>
                                    )}
                                </Space>

                                <Text type="secondary" style={{ maxWidth: 520, display: "block" }}>
                                    {plan?.description || t("upgrade.your.subscription.to.unlock.more.features.and.limits", { defaultValue: "Upgrade your subscription to unlock more features and limits." })}
                                </Text>

                                <Space size={6} wrap>
                                    <Tag bordered={false} style={{ background: isDark ? "#163548" : "#EAF7FB", color: PRIMARY }}>
                                        {quote?.billingInterval === "yearly" ? t("yearly", { defaultValue: "Yearly" }) : t("monthly", { defaultValue: "Monthly" })}
                                    </Tag>
                                    <Tag bordered={false} style={{ background: isDark ? "#172B3B" : "#F2F4F7", color: colors.secondary }}>
                                        {quote?.validDays || 30} {t("days", { defaultValue: "days" })}
                                    </Tag>
                                    {quote?.takesEffectImmediately && <Tag bordered={false} color="success">{t("starts.immediately", { defaultValue: "Starts immediately" })}</Tag>}
                                </Space>
                            </Space>
                        </Col>

                        <Col>
                            <Flex vertical align="end" gap={2}>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("total", { defaultValue: "Total" })}</Text>
                                <Title level={2} style={{ margin: 0, color: PRIMARY }}>
                                    {CURRENCIES_SYMBOL[currency]} {Number(quote?.total || 0).toFixed(2)}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 12 }}>{t("per", { defaultValue: "per" })} {quote?.billingInterval === "yearly" ? t("year", { defaultValue: "year" }) : t("month", { defaultValue: "month" })}</Text>
                            </Flex>
                        </Col>
                    </Row>
                </Card>

                {/* PLAN + LIMITS */}
                <Row gutter={[14, 14]}>
                    <Col xs={24} md={12}>
                        <Card size="small" title={<Text strong>{t("plan.details", { defaultValue: "Plan Details" })}</Text>} style={{ height: "100%", ...cardStyle }}>
                            <Space direction="vertical" size={4} style={{ width: "100%" }}>
                                <Item label={t("plan.name", { defaultValue: "Plan Name" })} value={plan?.name || "N/A"} />
                                <Item label={t("slug", { defaultValue: "Slug" })} value={plan?.slug || "N/A"} />
                                <Item label={t("billing.interval", { defaultValue: "Billing Interval" })} value={quote?.billingInterval === "yearly" ? t("yearly", { defaultValue: "Yearly" }) : t("monthly", { defaultValue: "Monthly" })} />
                                <Item label={t("validity", { defaultValue: "Validity" })} value={`${quote?.validDays || 0} ${t("days", { defaultValue: "days" })}`} />
                                <Item label={t("effective", { defaultValue: "Effective" })} value={quote?.takesEffectImmediately ? t("immediately", { defaultValue: "Immediately" }) : t("next.billing.period", { defaultValue: "Next billing period" })} />
                                <Item label={t("currency", { defaultValue: "Currency" })} value={quote?.currency || "INR"} />
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} md={12}>
                        <Card size="small" title={<Text strong>{t("plan.limits", { defaultValue: "Plan Limits" })}</Text>} style={{ height: "100%", ...cardStyle }}>
                            <Row gutter={[8, 10]}>
                                <StatCard colors={colors} icon={<ProjectOutlined style={{ color: PRIMARY }} />} label={t("projects", { defaultValue: "Projects" })} value={plan?.limits?.maxProjects} />
                                <StatCard colors={colors} icon={<FileTextOutlined style={{ color: PRIMARY }} />} label={t("templates", { defaultValue: "Templates" })} value={formatNumber(plan?.limits?.maxTemplates)} />
                                <StatCard colors={colors} icon={<TeamOutlined style={{ color: PRIMARY }} />} label={t("editor.users", { defaultValue: "Editor Users" })} value={formatNumber(plan?.limits?.maxEditorUsers)} />
                                <StatCard colors={colors} icon={<DatabaseOutlined style={{ color: PRIMARY }} />} label={t("storage", { defaultValue: "Storage" })} value={formatStorage(plan?.limits?.storageBytes)} />
                                <StatCard colors={colors} icon={<DatabaseOutlined style={{ color: PRIMARY }} />} label={t("monthly.sessions", { defaultValue: "Monthly Sessions" })} value={formatNumber(plan?.limits?.maxMonthlySessions)} />
                                <StatCard colors={colors} icon={<DatabaseOutlined style={{ color: PRIMARY }} />} label={t("ai.credits", { defaultValue: "AI Credits" })} value={formatNumber(plan?.limits?.maxMonthlyAiCredits)} />
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* FEATURES */}
                <Card
                    size="small"
                    style={cardStyle}
                    title={
                        <Flex justify="space-between" align="center">
                            <Space size={8}>
                                <CheckCircleFilled style={{ color: PRIMARY }} />
                                <Text strong>{t("included.features", { defaultValue: "Included Features" })}</Text>
                            </Space>
                            <Text type="secondary" style={{ fontSize: 12 }}>{enabledFeatures.length} {t("included", { defaultValue: "included" })}</Text>
                        </Flex>
                    }
                >
                    <Row gutter={[8, 8]}>
                        {[...enabledFeatures, ...disabledFeatures].map(({ key, label, enabled }) => (
                            <Col xs={24} sm={12} md={8} key={key}>
                                <Flex
                                    align="center"
                                    gap={8}
                                    style={{ padding: "7px 9px", borderRadius: 6, background: enabled ? colors.cardSecondary : undefined, opacity: enabled ? 1 : 0.5 }}
                                >
                                    {enabled ? (
                                        <CheckCircleFilled style={{ color: PRIMARY, fontSize: 15 }} />
                                    ) : (
                                        <CloseCircleFilled style={{ color: colors.muted, fontSize: 15 }} />
                                    )}
                                    <Text type={enabled ? undefined : "secondary"} style={{ fontSize: 12 }}>{label}</Text>
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </Card>

                {/* PAYMENT */}
                <Card size="small" style={cardStyle} title={<Space size={8}><CreditCardOutlined style={{ color: PRIMARY }} /><Text strong>{t("payment.method", { defaultValue: "Payment Method" })}</Text></Space>}>
                    <Space wrap>
                        {quote?.allowedGateways?.map((gateway) => {
                            const selected = selectedGateway === gateway.name;

                            const gatewayLabel =
                                gateway.name === "razorpay"
                                    ? "Razorpay"
                                    : gateway.name === "paypal"
                                        ? "PayPal"
                                        : gateway.name;

                            return (
                                <Button
                                    key={gateway.name}
                                    type={selected ? "primary" : "default"}
                                    onClick={() => setSelectedGateway(gateway.name)}
                                    icon={<CreditCardOutlined />}
                                    style={{
                                        height: 42,
                                        padding: "0 16px",
                                        ...(selected
                                            ? {
                                                background: PRIMARY,
                                                borderColor: PRIMARY,
                                            }
                                            : {}),
                                    }}
                                >
                                    {gatewayLabel}
                                    {gateway.charge > 0 && ` (${gateway.charge}%)`}
                                </Button>
                            );
                        })}
                    </Space>
                </Card>

                {/* PRICE SUMMARY */}
                <Card size="small" style={cardStyle}>
                    <Flex justify="space-between" align="center" style={{ marginBottom: 14 }}>
                        <Space size={8}>
                            <CalendarOutlined style={{ color: PRIMARY }} />
                            <Text strong>{t("payment.summary", { defaultValue: "Payment Summary" })}</Text>
                        </Space>
                        <Tag bordered={false} style={{ color: PRIMARY, background: `${PRIMARY}18` }}>
                            {quote?.billingInterval === "yearly" ? t("tearly", { defaultValue: "YEARLY" }) : t("monthly", { defaultValue: "MONTHLY" })}
                        </Tag>
                    </Flex>

                    <Item label={t("base.plan.amount", { defaultValue: "Base plan amount" })} value={`${CURRENCIES_SYMBOL[currency]} ${Number(quote?.basePrice || 0).toFixed(2)}`} />
                    <Item label={t("discount", { defaultValue: "Discount" })} value={`- ${CURRENCIES_SYMBOL[currency]} ${Number(quote?.discount || 0).toFixed(2)}`} />
                    <Item label={t("prorated.credit", { defaultValue: "Prorated Credit" })} value={`- ${CURRENCIES_SYMBOL[currency]} ${Number(quote?.proratedCredit || 0).toFixed(2)}`} />
                    <Item label={t("gateway.fee", { defaultValue: "Gateway Fee" })} value={`${CURRENCIES_SYMBOL[currency]} ${Number(quote?.gatewayFee || 0).toFixed(2)}`} />
                    <Item label={t("tax", { defaultValue: "Tax" })} value={`${CURRENCIES_SYMBOL[currency]} ${Number(quote?.tax || 0).toFixed(2)}`} />

                    <Divider style={{ margin: "10px 0" }} />
                    <Flex justify="space-between" align="center">
                        <div>
                            <Text strong style={{ fontSize: 16 }}>{t("total", { defaultValue: "Total" })}</Text>
                            <Text type="secondary" style={{ display: "block", fontSize: 11 }}>{t("amount.payable", { defaultValue: "Amount payable" })}</Text>
                        </div>
                        <Title level={3} style={{ margin: 0, color: PRIMARY }}>{CURRENCIES_SYMBOL[currency]} {Number(quote?.total || 0).toFixed(2)}</Title>
                    </Flex>
                </Card>

                {/* BLOCKED */}
                {quote?.blocked && quote?.blockers?.length > 0 && (
                    <Card size="small" style={{ borderColor: "#ff4d4f", background: isDark ? "#291719" : "#fff2f0" }}>
                        <Space direction="vertical" size={4}>
                            <Badge status="error" text={t("this.plan.cannot.be.selected", { defaultValue: "This plan cannot be selected" })} />
                            {quote.blockers.map((blocker, i) => (
                                <Text type="danger" key={i} style={{ fontSize: 12 }}>{blocker}</Text>
                            ))}
                        </Space>
                    </Card>
                )}

                {/* FOOTER */}
                <Flex justify="space-between" align="center" gap={12} style={{ paddingTop: 2 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>{t("by.continuing.you.agree.to.the.selected.billing.plan", { defaultValue: "By continuing, you agree to the selected billing plan." })}</Text>
                    <Space size={8}>
                        <Button onClick={onCancel} style={{ minWidth: 90 }}>
                            {t("cancel", { defaultValue: "Cancel" })}
                        </Button>
                        <Button
                            type="primary"
                            loading={loading}
                            disabled={!selectedGateway || quote?.blocked}
                            onClick={handleContinue}
                            style={{ minWidth: 170, background: PRIMARY, borderColor: PRIMARY, fontWeight: 600 }}
                        >
                            {t("continue.to.payment", { defaultValue: "Continue to Payment" })}
                        </Button>
                    </Space>
                </Flex>
            </Space>
        </Modal>
    );
}

export default UpgradePlan;
