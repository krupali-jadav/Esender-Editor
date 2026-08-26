import { Row, Col, Card, Badge, Progress, Typography, Space, Button, Flex, Spin, Empty, } from "antd";
import { CreditCardOutlined, WarningOutlined, CheckCircleFilled, CloseCircleFilled, ProjectOutlined, FileTextOutlined, TeamOutlined, ThunderboltOutlined, DatabaseOutlined, RobotOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { getPlans } from "./PlanApi";
import EmptyState from "../Styles/EmptyState";



export default function Billing() {
    const { Title, Text, Paragraph } = Typography;
    const theme = useSelector((state) => state?.app?.theme);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);

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
    useEffect(() => {
        fetchPlans();
    }, []);

    return (
        <PageContainer title={false}>
            <AppPageHeader
                title={t("billing.title", { defaultValue: "Billing" })}
                description={t("billing.description", { defaultValue: "Manage your subscription, payment methods, and view your billing history." })}
            />
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {/* Current Subscription + Usage Quotas */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={8}>
                        <Card style={{ height: "100%" }}>
                            <Space
                                style={{ width: "100%", justifyContent: "space-between" }}
                                align="start"
                            >
                                <Title level={5} >
                                    {t("current.Subscription", { defaultValue: "Current Subscription" })}
                                </Title>
                                <Badge status="success" text="Active" />
                            </Space>

                            <Space direction="vertical" style={{ width: "100%" }} size={15}>
                                <Row justify="space-between" >
                                    <Text type="secondary">{t("plan", { defaultValue: "Plan" })}</Text>
                                    <Text strong>{t("pro.Plan", { defaultValue: "Pro Plan" })}</Text>
                                </Row>
                                <Row justify="space-between" >
                                    <Text type="secondary">{t("renewalDate", { defaultValue: "Renewal Date" })}</Text>
                                    <Text strong>{t("renewal.Date", { defaultValue: "Oct 24, 2024" })}</Text>
                                </Row>
                                <Row justify="space-between" align="top">
                                    <Text type="secondary">{t("paymentMethod", { defaultValue: "Payment Method" })}</Text>
                                    <Space size={4}>
                                        <CreditCardOutlined />
                                        <Text strong>{t("payment.method", { defaultValue: "Visa ending in 4242" })}</Text>
                                    </Space>
                                </Row>
                                <Button block >{t("manage.Billing", { defaultValue: "Manage Billing" })}</Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card title={t("billing.usageQuotas", { defaultValue: "Usage Quotas" })} style={{ height: "100%" }}>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <Text type="secondary">{t("billing.totalWorkspaceUsers", { defaultValue: "Total Workspace Users" })}</Text>
                                    <Row justify="space-between" align="bottom">
                                        <Title level={3} style={{ margin: "4px 0" }}>
                                            12 <Text type="secondary" >/ 20</Text>
                                        </Title>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Progress
                                            percent={60}
                                            showInfo={false}
                                            style={{ width: "85%" }}
                                        />
                                        <Text type="secondary">{t("billing.percentage", { defaultValue: "60%" })}</Text>
                                    </Row>
                                </Col>

                                <Col span={12}>
                                    <Text type="secondary">{t("billing.totalProjectCount", { defaultValue: "Total Project Count" })}</Text>
                                    <Row justify="space-between" align="bottom">
                                        <Title level={3} style={{ margin: "4px 0" }}>
                                            45 <Text type="secondary" >/ 50</Text>
                                        </Title>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Progress
                                            percent={90}
                                            showInfo={false}
                                            strokeColor="#cf1322"
                                            style={{ width: "85%" }}
                                        />
                                        <Text type="secondary" >
                                            {t("billing.percentage", { defaultValue: "90%" })}
                                        </Text>
                                    </Row>
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        <WarningOutlined /> {t("approaching.Limit", { defaultValue: "Approaching limit" })}
                                    </Text>
                                </Col>
                            </Row>
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
                                const isFree = plan.price === 0;

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
                                                            label: t("projects",{defaultValue: "Projects"}),
                                                            value: plan.limits?.maxProjects ?? 0,
                                                            icon: <ProjectOutlined />,
                                                        },
                                                        {
                                                            label: t("templates",{defaultValue: "Templates"}),
                                                            value: plan.limits?.maxTemplates ?? 0,
                                                            icon: <FileTextOutlined />,
                                                        },
                                                        {
                                                            label: t("editor.Users",{defaultValue: "Editor Users"}),
                                                            value: plan.limits?.maxEditorUsers ?? 0,
                                                            icon: <TeamOutlined />,
                                                        },
                                                        {
                                                            label: t("monthly.Sessions",{defaultValue: "Monthly Sessions"}),
                                                            value: plan.limits?.maxMonthlySessions?.toLocaleString() ?? 0,
                                                            icon: <ThunderboltOutlined />,
                                                        },
                                                        {
                                                            label: t("storage",{defaultValue: "Storage"}),
                                                            value: `${(
                                                                (plan.limits?.storageBytes ?? 0) /
                                                                (1024 * 1024 * 1024)
                                                            ).toFixed(0)} GB`,
                                                            icon: <DatabaseOutlined />,
                                                        },
                                                        {
                                                            label: t("ai.Credits",{defaultValue: "AI Credits"}),
                                                            value: plan.limits?.maxMonthlyAiCredits ?? 0,
                                                            icon: <RobotOutlined />,
                                                        },
                                                    ].map((limit) => (
                                                        <Col span={8} key={limit.label}>
                                                            <Card
                                                                size="small"
                                                                styles={{body: {padding: "8px 4px",},}}
                                                                style={{
                                                                    textAlign: "center",
                                                                    background: theme? "rgba(255,255,255,0.025)": "#F8FAFC",
                                                                    borderColor: theme? "rgba(255,255,255,0.10)": "#E4E7EC",
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
                                                                        style={{fontSize: 14,color: theme ? "#FFFFFF" : "#1D2939",}}
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
                                                        style={{
                                                            height: 38,
                                                            marginBottom: 18,
                                                            border: "none",
                                                            borderRadius: 8,
                                                            background: `linear-gradient(90deg,${color.start},${color.end})`,
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            boxShadow: theme
                                                                ? "0 5px 15px rgba(0,0,0,0.35)"
                                                                : "0 5px 12px rgba(0,0,0,0.12)",
                                                        }}
                                                    >
                                                        {isFree
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
