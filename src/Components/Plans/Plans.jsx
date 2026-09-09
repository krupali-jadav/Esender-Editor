import { useEffect, useMemo, useState } from "react";
import {
    Row, Col, Card, Badge, Typography, Space, Button, Flex, Spin, Divider, Avatar,
    Segmented, Select, Tag, Progress, Popconfirm, message, Alert,
} from "antd";
import {
    CreditCardOutlined, CheckCircleFilled, CloseCircleFilled, CalendarOutlined,
    RobotOutlined, CrownOutlined, GiftOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import { t } from "i18next";
import AppPageHeader from "../Styles/AppHeader";
import EmptyState from "../Styles/EmptyState";
import { getPlans } from "./PlanApi";
import {
    getCurrentSubscription, getApp, startTrial, cancelSubscription, cancelScheduledChange,
} from "./SubscriptionApi";
import { featureLabel, formatLimit, limitLabel, money, clampPct } from "./planLabels";
import PlanChangeModal from "./PlanChangeModal";
import BillingHistory from "./BillingHistory";

const { Title, Text, Paragraph } = Typography;

const planBilling = (plan, interval) => {
    const opt = (plan.billingOptions || []).find((o) => o.interval === interval);
    if (opt) return { price: opt.price, available: true };
    if ((plan.billingInterval || "monthly") === interval) return { price: plan.price, available: true };
    return { price: 0, available: false };
};

export default function Plans() {
    const theme = useSelector((state) => state?.app?.theme);
    const [plans, setPlans] = useState([]);
    const [sub, setSub] = useState(null);
    const [trial, setTrial] = useState(null);
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [interval, setIntervalState] = useState("monthly");
    const [currency, setCurrency] = useState("INR");
    const [modalPlan, setModalPlan] = useState(null);
    const [busy, setBusy] = useState(false);

    const refresh = async () => {
        const [p, c, a] = await Promise.all([getPlans(), getCurrentSubscription(), getApp()]);
        if (p?.status) setPlans(p.plans || []);
        if (c?.status) { setSub(c.subscription); setTrial(c.trial); }
        if (a?.status && a.app) {
            setApp(a.app);
            setCurrency(a.app.baseCurrency || "INR");
        }
        setLoading(false);
    };
    useEffect(() => { refresh(); }, []);

    const rates = app?.exchangeRates || {};
    const toDisplay = (base) => (currency === (app?.baseCurrency || "INR") ? base : base * (Number(rates[currency]) || 1));

    const hasYearly = useMemo(() => plans.some((p) => (p.billingOptions || []).some((o) => o.interval === "yearly")), [plans]);
    const currencyOptions = useMemo(() => {
        const codes = new Set([app?.baseCurrency || "INR"]);
        (app?.currencies || []).forEach((c) => c.code && codes.add(c.code));
        return [...codes].map((c) => ({ value: c, label: c }));
    }, [app]);

    const onTrial = async () => {
        setBusy(true);
        const res = await startTrial();
        setBusy(false);
        if (res?.status) { message.success(t("trial.started", { defaultValue: "Trial started" })); refresh(); }
        else if (res) message.error(res.message);
    };
    const onCancel = async () => {
        const res = await cancelSubscription();
        if (res?.status) { message.success(res.message); refresh(); }
    };
    const onCancelScheduled = async () => {
        const res = await cancelScheduledChange();
        if (res?.status) { message.success(res.message); refresh(); }
    };

    const isCurrent = (plan) =>
        sub && (String(sub.planId) === String(plan._id) || (sub.planSlug && sub.planSlug === plan.slug)) && sub.billingInterval === interval;

    const aiUsed = sub?.usage?.aiCreditsUsed ?? 0;
    const aiLimit = sub?.usage?.aiCreditsLimit ?? 0;

    return (
        <PageContainer title={false}>
            <AppPageHeader
                title={t("plans", { defaultValue: "Plans" })}
                description={t("plans.description", { defaultValue: "Manage your subscription, payment methods, and view your billing history." })}
            />

            {loading ? (
                <Flex justify="center" style={{ minHeight: 300 }} align="center"><Spin /></Flex>
            ) : (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    {/* Current subscription */}
                    <Card styles={{ body: { padding: 24 } }}>
                        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                            <Space size={12}>
                                <Avatar shape="square" size={42} icon={<CreditCardOutlined />}
                                    style={{ background: "rgba(32,166,206,0.12)", color: "#20A6CE" }} />
                                <div>
                                    <Title level={5} style={{ margin: 0 }}>{t("current.Subscription", { defaultValue: "Current Subscription" })}</Title>
                                    <Text type="secondary">{t("your.current.billing.plan", { defaultValue: "Your current billing plan" })}</Text>
                                </div>
                            </Space>
                            <Badge status={sub?.status === "active" || sub?.status === "trialing" ? "success" : "warning"}
                                text={sub?.status || t("no.subscription", { defaultValue: "No subscription" })} />
                        </Flex>

                        {sub?.cancelAtPeriodEnd && (
                            <Alert style={{ marginTop: 16 }} type="warning" showIcon
                                message={t("subscription.will.not.renew", { defaultValue: "Your subscription will not renew" })}
                                description={`${t("access.continues.until", { defaultValue: "Access continues until" })} ${sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "—"}`} />
                        )}
                        {sub?.scheduledChange && (
                            <Alert style={{ marginTop: 16 }} type="info" showIcon
                                message={`${t("scheduled.change", { defaultValue: "Scheduled change" })}: ${sub.scheduledChange.planName} (${sub.scheduledChange.billingInterval})`}
                                description={`${t("starts.on", { defaultValue: "Starts on" })} ${new Date(sub.scheduledChange.startsAt).toLocaleDateString()}`}
                                action={<Button size="small" onClick={onCancelScheduled}>{t("cancel", { defaultValue: "Cancel" })}</Button>} />
                        )}

                        <Divider style={{ margin: "18px 0" }} />

                        <Row gutter={[16, 16]}>
                            <Detail label={t("plan", { defaultValue: "Plan" })} value={sub ? `${sub.planName} · ${sub.billingInterval}` : "—"} />
                            <Detail icon={<CalendarOutlined />} label={t("renewalDate", { defaultValue: "Renewal Date" })}
                                value={sub?.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : "N/A"} />
                            <Detail icon={<CreditCardOutlined />} label={t("paymentMethod", { defaultValue: "Payment Method" })}
                                value={sub?.paymentMethod || "—"} />
                        </Row>

                        {sub && (
                            <div style={{ marginTop: 16 }}>
                                <Flex justify="space-between">
                                    <Space size={6}><RobotOutlined style={{ color: "#20A6CE" }} />
                                        <Text type="secondary">{t("ai.credits", { defaultValue: "AI credits" })}</Text></Space>
                                    <Text strong>{aiLimit > 0 ? `${aiUsed} / ${aiLimit}` : t("not.included", { defaultValue: "Not included" })}</Text>
                                </Flex>
                                {aiLimit > 0 && <Progress percent={clampPct((aiUsed / aiLimit) * 100)} showInfo={false} strokeColor="#20A6CE" />}
                            </div>
                        )}

                        <Divider style={{ margin: "18px 0" }} />
                        <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                            <div>
                                <Text strong style={{ display: "block" }}>{t("need.to.update.your.subscription", { defaultValue: "Need to update your subscription?" })}</Text>
                                <Text type="secondary">{t("choose.a.plan.below.to.upgrade.or.downgrade", { defaultValue: "Choose a plan below to upgrade or downgrade." })}</Text>
                            </div>
                            <Space wrap>
                                {trial?.available && (
                                    <Button icon={<GiftOutlined />} loading={busy} onClick={onTrial}>
                                        {t("start.free.trial", { defaultValue: "Start free trial" })}
                                    </Button>
                                )}
                                {sub && !sub.cancelAtPeriodEnd && sub.type !== "trial" && (
                                    <Popconfirm title={t("cancel.subscription", { defaultValue: "Cancel subscription?" })}
                                        description={t("access.continues.until.period.end", { defaultValue: "Access continues until the period ends." })}
                                        onConfirm={onCancel} okText={t("yes", { defaultValue: "Yes" })} cancelText={t("no", { defaultValue: "No" })}>
                                        <Button danger>{t("cancel.subscription", { defaultValue: "Cancel subscription" })}</Button>
                                    </Popconfirm>
                                )}
                            </Space>
                        </Flex>
                    </Card>

                    {/* Controls */}
                    <Flex justify="center" align="center" gap={16} wrap style={{ marginTop: 24 }}>
                        {hasYearly && (
                            <Segmented value={interval} onChange={setIntervalState}
                                options={[
                                    { label: t("monthly", { defaultValue: "Monthly" }), value: "monthly" },
                                    { label: t("yearly", { defaultValue: "Yearly" }), value: "yearly" },
                                ]} />
                        )}
                        <Select value={currency} onChange={setCurrency} options={currencyOptions} style={{ width: 110 }} />
                    </Flex>

                    {/* Plans grid */}
                    {plans.length === 0 ? (
                        <EmptyState title={t("no.plans.found", { defaultValue: "No Plans found" })}
                            description={t("no.plans.description", { defaultValue: "There are no plans available." })} />
                    ) : (
                        <Row gutter={[24, 24]} justify="center">
                            {plans.map((plan) => {
                                const { price, available } = planBilling(plan, interval);
                                const current = isCurrent(plan);
                                const features = Object.entries(plan.features || {});
                                const limitKeys = ["maxProjects", "maxTemplates", "maxEditorUsers", "maxMonthlySessions", "storageBytes", "maxMonthlyAiCredits"];
                                return (
                                    <Col xs={24} sm={12} lg={6} key={plan._id}>
                                        <Card
                                            style={{
                                                height: "100%",
                                                border: plan.isRecommended ? "2px solid #20A6CE" : undefined,
                                                background: theme ? "#152A3C" : "#fff",
                                            }}
                                            styles={{ body: { display: "flex", flexDirection: "column", height: "100%" } }}
                                        >
                                            <Flex justify="space-between" align="center">
                                                <Title level={4} style={{ margin: 0 }}>{plan.name}</Title>
                                                <Space size={4}>
                                                    {plan.isRecommended && <Tag color="cyan" icon={<CrownOutlined />}>{t("recommended", { defaultValue: "Recommended" })}</Tag>}
                                                    {plan.isTrial && <Tag color="green">{t("trial", { defaultValue: "Trial" })}</Tag>}
                                                </Space>
                                            </Flex>
                                            {plan.description && <Paragraph type="secondary" style={{ marginTop: 6 }}>{plan.description}</Paragraph>}

                                            <div style={{ margin: "10px 0" }}>
                                                {available ? (
                                                    <>
                                                        <Text style={{ fontSize: 30, fontWeight: 700 }}>{money(toDisplay(price), currency)}</Text>
                                                        <Text type="secondary"> / {interval}</Text>
                                                    </>
                                                ) : (
                                                    <Text type="secondary">{t("not.available.on.this.interval", { defaultValue: "Not available on this interval" })}</Text>
                                                )}
                                            </div>

                                            <Divider style={{ margin: "10px 0" }} />
                                            <Space direction="vertical" size={4} style={{ marginBottom: 10 }}>
                                                {limitKeys.map((k) => (
                                                    <Flex key={k} justify="space-between">
                                                        <Text type="secondary" style={{ fontSize: 13 }}>{limitLabel(k)}</Text>
                                                        <Text style={{ fontSize: 13 }}>{formatLimit(k, plan.limits?.[k])}</Text>
                                                    </Flex>
                                                ))}
                                            </Space>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                                                {features.map(([key, enabled]) => (
                                                    <Flex key={key} align="center" gap={8}>
                                                        {enabled ? <CheckCircleFilled style={{ color: "#20A6CE" }} />
                                                            : <CloseCircleFilled style={{ color: theme ? "#667085" : "#98A2B3" }} />}
                                                        <Text style={{ fontSize: 13, color: enabled ? undefined : (theme ? "#667085" : "#98A2B3") }}>{featureLabel(key)}</Text>
                                                    </Flex>
                                                ))}
                                            </div>

                                            <Button
                                                type={current ? "default" : "primary"} block style={{ marginTop: 16 }}
                                                disabled={!available || plan.isTrial}
                                                onClick={() => setModalPlan(plan)}
                                            >
                                                {current
                                                    ? t("renew", { defaultValue: "Renew" })
                                                    : plan.isTrial
                                                        ? t("trial.plan", { defaultValue: "Trial plan" })
                                                        : sub
                                                            ? t("choose.plan", { defaultValue: "Choose plan" })
                                                            : t("get.started", { defaultValue: "Get started" })}
                                            </Button>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}

                    <BillingHistory />
                </Space>
            )}

            <PlanChangeModal
                open={!!modalPlan}
                plan={modalPlan}
                billingInterval={interval}
                currency={currency}
                onClose={() => setModalPlan(null)}
                onSettled={() => { refresh(); }}
            />
        </PageContainer>
    );
}

function Detail({ icon, label, value }) {
    return (
        <Col xs={24} md={8}>
            <Card size="small" style={{ height: "100%" }}>
                <Space direction="vertical" size={4}>
                    <Space size={6}>{icon}<Text type="secondary">{label}</Text></Space>
                    <Text strong style={{ fontSize: 16 }}>{value}</Text>
                </Space>
            </Card>
        </Col>
    );
}
