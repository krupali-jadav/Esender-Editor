import { Row, Col, Card, Badge, Progress, Typography, Space, Button, Flex, Spin, Empty, Divider, Avatar, } from "antd";
import { CreditCardOutlined, WarningOutlined, CheckCircleFilled, CloseCircleFilled, ProjectOutlined, FileTextOutlined, TeamOutlined, ThunderboltOutlined, DatabaseOutlined, RobotOutlined, CalendarOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { getPlans, getSubscriptionPlans } from "./PlanApi";
import EmptyState from "../Styles/EmptyState";



export default function Plans() {
    const { Title, Text, Paragraph } = Typography;
    const theme = useSelector((state) => state?.app?.theme);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [subscriptionLoading, setSubscriptionLoading] = useState(false);

    const fetchPlans = async () => {
        try {
            setPlansLoading(true);
            const response = await getPlans();

            if (response?.status) {
                setPlans(response?.plans || []);
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error("FETCH PLANS ERROR:", error);
            setPlans([]);
        } finally {
            setPlansLoading(false);
        }
    };
    const fetchSubscription = async () => {
        try {
            setSubscriptionLoading(true);

            const response = await getSubscriptionPlans();

            if (response?.status) {
                setSubscription(response?.subscription || response);
            } else {
                setSubscription(null);
            }
        } catch (error) {
            console.error("FETCH SUBSCRIPTION ERROR:", error);
            setSubscription(null);
        } finally {
            setSubscriptionLoading(false);
        }
    };
    useEffect(() => {
        fetchPlans();
        fetchSubscription();
    }, []);
    const currentPlanSlug = subscription?.planSlug;
    const currentPlanName = subscription?.planName;
    return (

        <PageContainer title={false}>
            <AppPageHeader
                title={t("plans", { defaultValue: "Plans" })}
                description={t("plans.description", { defaultValue: "Manage your subscription, payment methods, and view your plans history." })}
            />
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {/* Current Subscription */}
                <Row gutter={[16, 16]}>
                    <Col xs={24}>
                        <Card
                            loading={subscriptionLoading}
                            styles={{ body: { padding: 24 }, }}>
                            {/* Header */}
                            <Flex
                                justify="space-between"
                                align="center"
                                wrap="wrap"
                                gap={12}
                            >
                                <Space size={12}>
                                    <Avatar
                                        shape="square"
                                        size={42}
                                        icon={<CreditCardOutlined />}
                                        style={{
                                            background: "rgba(32, 166, 206, 0.12)",
                                            color: "#20A6CE",
                                        }}
                                    />

                                    <div>
                                        <Title level={5} style={{ margin: 0, }}>
                                            {t("current.Subscription", { defaultValue: "Current Subscription", })}
                                        </Title>

                                        <Text type="secondary">
                                            {t("your.current.billing.plan", { defaultValue: "Your current billing plan" })}
                                        </Text>
                                    </div>
                                </Space>

                                <Badge
                                    status={
                                        subscription?.status === "active"
                                            ? "success"
                                            : "warning"
                                    }
                                    text={
                                        subscription?.status || "No Subscription"
                                    }
                                />
                            </Flex>

                            <Divider style={{ margin: "22px 0" }} />

                            {/* Subscription Details */}
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <Card
                                        size="small"
                                        style={{
                                            height: "100%",
                                            background: "rgba(32, 166, 206, 0.04)",
                                        }}
                                    >
                                        <Space
                                            direction="vertical"
                                            size={4}
                                        >
                                            <Text type="secondary">
                                                {t("plan", {
                                                    defaultValue: "Plan",
                                                })}
                                            </Text>

                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 18,
                                                }}
                                            >
                                                {subscription?.planName || "-"}
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card
                                        size="small"
                                        style={{
                                            height: "100%",
                                        }}
                                    >
                                        <Space
                                            direction="vertical"
                                            size={4}
                                        >
                                            <Space size={6}>
                                                <CalendarOutlined
                                                    style={{
                                                        color: "#20A6CE",
                                                    }}
                                                />

                                                <Text type="secondary">
                                                    {t("renewalDate", {
                                                        defaultValue:
                                                            "Renewal Date",
                                                    })}
                                                </Text>
                                            </Space>

                                            <Text strong>
                                                {subscription?.renewalDate
                                                    ? new Date(
                                                        subscription.renewalDate
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>

                                <Col xs={24} md={8}>
                                    <Card
                                        size="small"
                                        style={{ height: "100%", }}>
                                        <Space direction="vertical" size={4}>
                                            <Space size={6}>
                                                <CreditCardOutlined style={{ color: "#20A6CE", }}/>

                                                <Text type="secondary">
                                                    {t("paymentMethod", {defaultValue:"Payment Method",})}
                                                </Text>
                                            </Space>

                                            <Text strong>
                                                {subscription?.paymentMethod ||"Not available"}
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>

                            <Divider style={{ margin: "22px 0 18px" }} />

                            {/* Footer */}
                            <Flex
                                justify="space-between"
                                align="center"
                                wrap="wrap"
                                gap={12}
                            >
                                <Space direction="vertical" size={0}>
                                    <Text strong>
                                        {t("need.To.Update.Subscription", {defaultValue:"Need to update your subscription?"})}
                                    </Text>

                                    <Text type="secondary">
                                        {t("manage.Plan.Payment", {defaultValue:"Manage your plan and payment details."})}
                                    </Text>
                                </Space>

                                <Button
                                    type="primary"
                                    icon={<CreditCardOutlined />}
                                >
                                    {t("manage.Billing", {defaultValue: "Manage Billing",})}
                                </Button>
                            </Flex>
                        </Card>
                    </Col>
                </Row>

                {/* Available Plans */}
                <Card
                    style={{
                        marginBottom: 60,
                        background: "transparent",
                        border: "none",
                        boxShadow: "none",
                    }}
                    styles={{ body: { padding: 0, }, }}
                >
                    {/* Heading */}
                    <div style={{ textAlign: "center", marginTop: 50, }}>
                        <Title
                            level={2}
                            style={{
                                margin: 0,
                                color: theme ? "#FFFFFF" : "#1F2937",
                                fontWeight: 700,
                            }}
                        >
                            {t("available.Plans", { defaultValue: "Available Plans" })}
                        </Title>

                        <Paragraph
                            style={{
                                marginTop: 8,
                                fontSize: 14,
                                color: theme ? "#98A2B3" : "#667085",
                            }}
                        >
                            {t("upgrade.To.Unlock.Features", { defaultValue: "Upgrade to unlock more features and higher limits." })}
                        </Paragraph>
                    </div>

                    {plansLoading ? (
                        <Flex
                            justify="center"
                            align="center"
                            style={{ minHeight: 300 }}
                        >
                            <Spin size="middle" />
                        </Flex>
                    ) : plans.length === 0 ? (
                        <EmptyState
                            icon={<FileTextOutlined />}
                            title={t('no.plans.found', { defaultValue: 'No Plans found' })}
                            description={t('no.plans.description', { defaultValue: 'There are no plans available    .' })}
                        />
                    ) : (
                        <Row
                            gutter={[32, 60]}
                            justify="center"
                        >
                            {plans.map((plan, index) => {
                                const isCurrentPlan = plan.slug === currentPlanSlug || plan.name?.toLowerCase() === currentPlanName?.toLowerCase();
                                const planColors = [
                                    {
                                        start: "#22C1DC",
                                        end: "#1677FF",
                                    },
                                    {
                                        start: "#14B8A6",
                                        end: "#0F766E",
                                    },
                                    {
                                        start: "#6366F1",
                                        end: "#4338CA",
                                    },
                                    {
                                        start: "#A855F7",
                                        end: "#7C3AED",
                                    },
                                ];
                                const color =
                                    planColors[index % planColors.length];

                                const features = Object.entries(plan.features || {}).map(
                                    ([key, enabled]) => ({
                                        key,
                                        label: key
                                            .replace(/([A-Z])/g, " $1")
                                            .replace(/^./, (char) => char.toUpperCase()),
                                        enabled,
                                    })
                                );

                                return (
                                    <Col xs={24} sm={12} md={8} lg={6} key={plan._id}>
                                        <div
                                            style={{
                                                position: "relative",
                                                paddingTop: 42,
                                            }}
                                        >
                                            {/* PRICE CIRCLE */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    zIndex: 3,
                                                    width: 105,
                                                    height: 105,
                                                    borderRadius: "50%",
                                                    background: `linear-gradient(135deg,${color.start},${color.end})`,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    /** Theme-aware border*/
                                                    border: `8px solid ${theme ? "#0A101C" : "#EEF3FA"}`,
                                                    boxShadow: theme
                                                        ? "0 8px 25px rgba(0,0,0,0.45)"
                                                        : "0 8px 25px rgba(30,50,80,0.15)",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "flex-start",
                                                        color: "#FFFFFF",
                                                    }}
                                                >
                                                    <span style={{ fontSize: 14, marginTop: 4, }}>₹</span>

                                                    <span style={{ fontSize: 32, lineHeight: 1, fontWeight: 700, }}>
                                                        {plan.price}
                                                    </span>
                                                </div>

                                                <span
                                                    style={{
                                                        color: "rgba(255,255,255,0.9)",
                                                        fontSize: 10,
                                                    }}
                                                >
                                                    /{plan.billingInterval}
                                                </span>
                                            </div>

                                            {/* MAIN CARD */}
                                            <Card
                                                bordered={false}
                                                style={{
                                                    borderRadius: "14px 14px 18px 18px",
                                                    background: theme
                                                        ? "#152A3C"
                                                        : "#FFFFFF",

                                                    boxShadow: theme
                                                        ? "0 12px 35px rgba(0,0,0,0.35)"
                                                        : "0 12px 35px rgba(30,50,80,0.12)",

                                                    overflow: "hidden",

                                                    border: theme
                                                        ? "1px solid rgba(255,255,255,0.08)"
                                                        : "1px solid rgba(30,50,80,0.08)",
                                                }}
                                                styles={{
                                                    body: {
                                                        padding: "82px 28px 0",
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    },
                                                }}
                                            >
                                                {/* PLAN NAME */}
                                                <Title
                                                    level={3}
                                                    style={{
                                                        textAlign: "center",
                                                        margin: 0,
                                                        color: theme
                                                            ? "#FFFFFF"
                                                            : "#1D2939",

                                                        fontSize: 22,
                                                        letterSpacing: 1,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {plan.name.toUpperCase()}
                                                </Title>

                                                {/* DIVIDER */}
                                                <div
                                                    style={{
                                                        width: 70,
                                                        height: 2,
                                                        background: color.end,
                                                        margin: "18px auto 20px",
                                                    }}
                                                />
                                                <Row gutter={[8, 8]} style={{ marginBottom: 20 }}>
                                                    {[
                                                        {
                                                            label: t("projects", { defaultValue: "Projects" }),
                                                            value: plan.limits?.maxProjects ?? 0,
                                                            icon: <ProjectOutlined />,
                                                        },
                                                        {
                                                            label: t("templates", { defaultValue: "Templates" }),
                                                            value: plan.limits?.maxTemplates ?? 0,
                                                            icon: <FileTextOutlined />,
                                                        },
                                                        {
                                                            label: t("editor.Users", { defaultValue: "Editor Users" }),
                                                            value: plan.limits?.maxEditorUsers ?? 0,
                                                            icon: <TeamOutlined />,
                                                        },
                                                        {
                                                            label: t("monthly.Sessions", { defaultValue: "Monthly Sessions" }),
                                                            value: plan.limits?.maxMonthlySessions?.toLocaleString() ?? 0,
                                                            icon: <ThunderboltOutlined />,
                                                        },
                                                        {
                                                            label: t("storage", { defaultValue: "Storage" }),
                                                            value: `${(
                                                                (plan.limits?.storageBytes ?? 0) /
                                                                (1024 * 1024 * 1024)
                                                            ).toFixed(0)} GB`,
                                                            icon: <DatabaseOutlined />,
                                                        },
                                                        {
                                                            label: t("ai.Credits", { defaultValue: "AI Credits" }),
                                                            value: plan.limits?.maxMonthlyAiCredits ?? 0,
                                                            icon: <RobotOutlined />,
                                                        },
                                                    ].map((limit) => (
                                                        <Col span={8} key={limit.label}>
                                                            <Card
                                                                size="small"
                                                                styles={{ body: { padding: "8px 4px", }, }}
                                                                style={{
                                                                    textAlign: "center",
                                                                    background: theme ? "rgba(255,255,255,0.025)" : "#F8FAFC",
                                                                    borderColor: theme ? "rgba(255,255,255,0.10)" : "#E4E7EC",
                                                                }}
                                                            >
                                                                <Flex wrap vertical align="center" gap={2}>
                                                                    <span
                                                                        style={{
                                                                            color: color.end,
                                                                            fontSize: 16,
                                                                        }}
                                                                    >
                                                                        {limit.icon}
                                                                    </span>

                                                                    <Text
                                                                        strong
                                                                        style={{ fontSize: 14, color: theme ? "#FFFFFF" : "#1D2939", }}
                                                                    >
                                                                        {limit.value}
                                                                    </Text>

                                                                    <Text
                                                                        type="secondary"
                                                                        style={{ fontSize: 11 }}
                                                                    >
                                                                        {limit.label}
                                                                    </Text>
                                                                </Flex>
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                                {/* FEATURES */}
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 8,
                                                        marginTop: 4,
                                                    }}
                                                >
                                                    {features.map(({ key, label, enabled }) => (
                                                        <div
                                                            key={key}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "center",
                                                                gap: 8,
                                                                minHeight: 20,
                                                            }}
                                                        >
                                                            {enabled ? (
                                                                <CheckCircleFilled
                                                                    style={{
                                                                        color: "#20A6CE",
                                                                        fontSize: 16,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                            ) : (
                                                                <CloseCircleFilled
                                                                    style={{
                                                                        color: theme
                                                                            ? "#667085"
                                                                            : "#98A2B3",
                                                                        fontSize: 16,
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                            )}

                                                            <Text
                                                                style={{
                                                                    fontSize: 14,
                                                                    lineHeight: "18px",
                                                                    color: theme
                                                                        ? "#D0D5DD"
                                                                        : "#475467",
                                                                }}
                                                            >
                                                                {label}
                                                            </Text>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* BUTTON */}
                                                <div style={{ marginTop: "20px" }}>
                                                    <Button
                                                        type="primary"
                                                        block
                                                        disabled={isCurrentPlan}
                                                        style={{
                                                            height: 38,
                                                            marginBottom: 18,
                                                            border: "none",
                                                            borderRadius: 8,
                                                            background: isCurrentPlan
                                                                ? undefined
                                                                : `linear-gradient(90deg,${color.start},${color.end})`,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            boxShadow: theme
                                                                ? "0 5px 15px rgba(0,0,0,0.35)"
                                                                : "0 5px 12px rgba(0,0,0,0.12)",
                                                        }}
                                                    >
                                                        {isCurrentPlan
                                                            ? "CURRENT PLAN"
                                                            : `CHOOSE ${plan.name.toUpperCase()}`}
                                                    </Button>
                                                </div>
                                            </Card>
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </Card>

            </Space>

        </PageContainer>
    );
}
