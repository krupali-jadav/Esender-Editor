import {
    Row,
    Col,
    Card,
    Progress,
    Typography,
    Space,
    Select,
    Table,
    Avatar,
    Flex,
    Spin,
    Badge,
    Button,
    Tag,
} from "antd";
import {
    TeamOutlined,
    ClockCircleOutlined,
    FolderOutlined,
    StarOutlined,
    WarningOutlined,
    DownOutlined,
    MailOutlined,
    ArrowRightOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { PageContainer } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";
import { useEffect, useState } from "react";
import { getUsageAlerts, getUsageSummary, getUsageTrend } from "./UsageApi";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { formatDate } from "../../util/commom.utils";
import EmptyState from "../Styles/EmptyState";

const { Title, Text, Link } = Typography;

export default function Usage() {
    const navigate = useNavigate();
    const [sessionTrendData, setSessionTrendData] = useState([]);
    const [trendRange, setTrendRange] = useState(7);
    const [trendLoading, setTrendLoading] = useState(false);
    const [usageSummary, setUsageSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [alerts, setAlerts] = useState([]);
    const [alertsLoading, setAlertsLoading] = useState(false);
    const theme = useSelector((state) => state?.app?.theme);
    const selectedProject = useSelector((state) => state?.app?.selectedProject);

    const templateColumns = [
        {
            title: t('template.name', { defaultValue: 'Template Name' }),
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Space>
                    <Avatar shape="square" size="small" icon={<MailOutlined />} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: t('id', { defaultValue: 'ID' }),
            dataIndex: "_id",
            key: "id",
            render: (id) => <Text code copyable>{id}</Text>,
        },
        {
            title: t('project_name', { defaultValue: 'Project Name' }),
            dataIndex: "projectName",
            key: "projectName",
        },  
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge
                    status={status === "draft" ? "warning" : "success"}
                    text={status}
                />
            ),
        },
        {
            title: t('updatedAt', { defaultValue: 'Updated At' }),
            dataIndex: "updatedAt",
            key: "updatedAt",
            render: (date) => (<Text>{formatDate(date)}</Text>),
        },

    ];
    const usageStats = usageSummary
        ? [
            {
                title: t('projects', { defaultValue: 'PROJECTS' }),
                value: usageSummary.projectsUsed,
                total: usageSummary.projectsLimit,
                percent: usageSummary.projectsLimit
                    ? Math.round(
                        (usageSummary.projectsUsed / usageSummary.projectsLimit) * 100
                    )
                    : 0,
                icon: <FolderOutlined />,
                color: "#20A6CE",
            },
            {
                title: t('monthly.editor.users', { defaultValue: 'MONTHLY EDITOR USERS' }),
                value: usageSummary.monthlyEditorUsersUsed,
                total: usageSummary.monthlyEditorUsersLimit,
                percent: usageSummary.monthlyEditorUsersLimit
                    ? Math.round(
                        (usageSummary.monthlyEditorUsersUsed /
                            usageSummary.monthlyEditorUsersLimit) *
                        100
                    )
                    : 0,
                icon: <TeamOutlined />,
                color: "#20A6CE",
            },
            {
                title: t('monthly.sessions', { defaultValue: 'MONTHLY SESSIONS' }),
                value: usageSummary.monthlySessionsUsed,
                total: usageSummary.monthlySessionsLimit,
                percent: usageSummary.monthlySessionsLimit
                    ? Math.round(
                        (usageSummary.monthlySessionsUsed /
                            usageSummary.monthlySessionsLimit) *
                        100
                    )
                    : 0,
                icon: <ClockCircleOutlined />,
                color: "#13c2c2",
            },
            {
                title: t('template.storage', { defaultValue: 'TEMPLATE STORAGE' }),
                value: usageSummary.templateStorageUsed,
                total: usageSummary.templateStorageLimit,
                percent: usageSummary.templateStorageLimit
                    ? Math.round(
                        (usageSummary.templateStorageUsed /
                            usageSummary.templateStorageLimit) *
                        100
                    )
                    : 0,
                icon: <FolderOutlined />,
                color: "#1677FF",
                description: "* Sum of all template file sizes",
            },
            {
                title: t('ai.credits', { defaultValue: 'AI CREDITS' }),
                value: usageSummary.aiCreditsUsed,
                total: usageSummary.aiCreditsLimit,
                percent: usageSummary.aiCreditsLimit
                    ? Math.round(
                        (usageSummary.aiCreditsUsed /
                            usageSummary.aiCreditsLimit) *
                        100
                    )
                    : 0,
                icon: <StarOutlined />,
                color: "#20A6CE",
            },
        ]
        : [];

    const fetchUsageTrend = async () => {
        if (!selectedProject?._id) return;

        try {
            setTrendLoading(true);

            const response = await getUsageTrend(
                selectedProject._id,
                trendRange
            );

            if (response?.status) {
                setSessionTrendData(
                    (response.usageTrend || []).map((item) => ({
                        day: item.date,
                        sessions: item.sessions,
                    }))

                );
            } else {
                setSessionTrendData([]);
            }
        } catch (error) {
            console.error(error);
            setSessionTrendData([]);
        } finally {
            setTrendLoading(false);
        }
    };
    const fetchUsageAlerts = async () => {
        if (!selectedProject?._id) return;

        try {
            setAlertsLoading(true);

            const response = await getUsageAlerts(selectedProject._id);

            if (response?.status) {
                setAlerts(response?.alerts || []);
            } else {
                setAlerts([]);
            }
        } catch (error) {
            console.error(error);
            setAlerts([]);
        } finally {
            setAlertsLoading(false);
        }
    };
    const fetchUsageSummary = async () => {
        if (!selectedProject?._id) return;

        try {
            setSummaryLoading(true);

            const response = await getUsageSummary(
                selectedProject._id,
                trendRange
            );

            if (response?.status) {
                setUsageSummary({
                    ...(response.stats || {}),
                    recentTemplates: response.recentTemplates || [],
                });
            } else {
                setUsageSummary(null);
            }
        } catch (error) {
            console.error(error);
            setUsageSummary(null);
        } finally {
            setSummaryLoading(false);
        }
    };
    useEffect(() => {
        fetchUsageTrend();
        fetchUsageAlerts();
        fetchUsageSummary();
    }, [selectedProject?._id, trendRange]);
    return (
        <PageContainer title={false}>
            <AppPageHeader
                title="Usage"
                description={t('keep.track.of.your.monthly.editor.users.sessions.template.storage.stay.informed.about.resource.alerts.and.optimize.your.usage', { defaultValue: 'Keep track of your monthly editor users, sessions, template storage. Stay informed about resource alerts and optimize your usage.' })}
            />
            {summaryLoading || trendLoading ? (
                <Col span={24}>
                    <Flex align="center" justify="center" style={{ height: "40vh" }}>
                        <Spin size="default" />
                    </Flex>
                </Col>
            ) : (
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                    {/* Stat Cards */}
                    <Flex
                        gap={16}
                        wrap
                        style={{ width: "100%" }}
                    >
                        {usageStats.map((stat) => (
                            <Card
                                key={stat.title}
                                style={{ flex: "1 1 180px", minWidth: 180, }}
                            >
                                <Flex justify="space-between" align="center">
                                    <Text type="secondary">{stat.title}</Text>

                                    <span style={{ color: stat.color, fontSize: 20, }}>
                                        {stat.icon}
                                    </span>
                                </Flex>

                                <Title level={3} style={{ margin: "12px 0" }}>
                                    {stat.value}{" "}
                                    <Text type="secondary">
                                        / {stat.total}
                                    </Text>
                                </Title>

                                <Progress
                                    percent={stat.percent}
                                    showInfo={false}
                                    strokeColor={stat.color}
                                />

                                {stat.description && (
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {stat.description}
                                    </Text>
                                )}
                            </Card>
                        ))}
                    </Flex>

                    {/* Session trend + Resource alerts */}
                    <Row gutter={[16, 16]} >
                        <Col xs={24} lg={13}>
                            <Card
                                title={t('session.trend', { defaultValue: 'Session Trend' })}
                                extra={
                                    <Select
                                        value={String(trendRange)}
                                        onChange={(value) => setTrendRange(Number(value))}
                                        suffixIcon={<DownOutlined />}
                                        options={[
                                            { value: "7", label: t('last.7.days', { defaultValue: 'Last 7 Days' }) },
                                            // { value: "30", label: t('last.30.days', { defaultValue: 'Last 30 Days' }) },
                                            // { value: "90", label: t('last.90.days', { defaultValue: 'Last 90 Days' }) },
                                        ]}
                                    />
                                }
                                style={{ height: "100%" }}
                            >
                                <Column
                                    key={`${theme ? "dark" : "light"}-${trendRange}`}
                                    data={sessionTrendData}
                                    xField="day"
                                    yField="sessions"
                                    height={260}
                                    theme={{
                                        type: theme ? "dark" : "light",
                                        axis: {
                                            x: {
                                                labelFill: theme ? "#FFFFFF" : "#8C8C8C",
                                                labelFontSize: 12,
                                                tickStroke: theme ? "#FFFFFF" : "#8C8C8C",
                                                lineStroke: theme ? "#243746" : "#D9D9D9",
                                            },
                                        },
                                    }}
                                    style={{
                                        maxWidth: 50,
                                        fill: "#adc6ff",
                                        radiusTopLeft: 4,
                                        radiusTopRight: 4,
                                    }}
                                    axis={{
                                        x: {
                                            line: false,
                                            tickLine: false,
                                        },
                                        y: {
                                            label: false,
                                            grid: {
                                                line: {
                                                    style: {
                                                        stroke: theme ? "#243746" : "#f0f0f0",
                                                    },
                                                },
                                            },
                                        },
                                    }}
                                    tooltip={false}
                                />
                            </Card>
                        </Col>

                        <Col xs={24} lg={11}>
                            <Card
                                title={
                                    <Space>
                                        <WarningOutlined style={{ color: "#cf1322" }} />
                                        {t('resource.alerts', { defaultValue: 'Resource Alerts' })}
                                    </Space>
                                }
                                style={{ height: "100%" }}
                            >

                                {alertsLoading ? (
                                    <Flex justify="center" align="center" style={{ minHeight: 180 }}>
                                        <Spin />
                                    </Flex>
                                ) : alerts.length === 0 ? (
                                    <Flex justify="center" align="center" style={{ minHeight: 180 }}>
                                        <Text type="secondary">{t('no.resource.alerts', { defaultValue: 'No resource alerts' })}</Text>
                                    </Flex>
                                ) : (
                                    alerts.map((alert, index) => (
                                        <div key={index} style={{ marginTop: 20 }}>
                                            <Space style={{ width: "100%", justifyContent: "space-between", }}>
                                                <Text strong>{alert.resource}</Text>

                                                <Text strong type="danger">
                                                    {alert.percent}%
                                                </Text>
                                            </Space>

                                            <Progress
                                                percent={alert.percent}
                                                showInfo={false}
                                                status="exception"
                                            />

                                            <Space
                                                style={{
                                                    width: "100%",
                                                    justifyContent: "space-between",
                                                }}
                                            >
                                                <Text type="danger" style={{ fontSize: 12 }}>
                                                    {alert.level || "WARNING"}
                                                </Text>

                                                <Text type="secondary">
                                                    {alert.used?.toLocaleString()} /{" "}
                                                    {alert.limit?.toLocaleString()}
                                                </Text>
                                            </Space>
                                        </div>
                                    ))
                                )}
                            </Card>
                        </Col>
                    </Row>


                    {/* Recently updated templates */}
                    <Card
                        title={t("recentlyUpdatedTemplates", { defaultValue: "Recently Updated Templates" })}
                        extra={<Link onClick={() => navigate("/templates")}>
                            {t('view.all', { defaultValue: 'View All' })} <ArrowRightOutlined />
                        </Link>}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table
                            rowKey="_id"
                            loading={summaryLoading}
                            columns={templateColumns}
                            dataSource={usageSummary?.recentTemplates || []}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            locale={{
                                emptyText: (
                                    <EmptyState
                                        icon={<FileTextOutlined />}
                                        title={t("no.templates.found", { defaultValue: "No Templates found" })}
                                        description={t("no.templates.description", { defaultValue: "There are no Templates available.", })}
                                        action={
                                            <Button type="primary" onClick={() => navigate("/templates/create-template")}>
                                                {t("create.template", { defaultValue: "Create Template" })}
                                            </Button>
                                        }
                                    />
                                ),
                            }}
                            components={{
                                header: {
                                    cell: (props) => (
                                        <th
                                            {...props}
                                            style={{
                                                ...props.style,
                                                background: theme
                                                    ? "#0e1c29"
                                                    : "#f0f0f0",
                                            }}
                                        />
                                    ),
                                },
                            }}
                        />
                    </Card>
                </Space>
            )}
        </PageContainer>
    );
}
