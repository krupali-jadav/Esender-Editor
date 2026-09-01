import {
    Row,
    Col,
    Card,
    Progress,
    Tag,
    Typography,
    Table,
    List,
    Space,
    Avatar,
    Button,
    Select,
    Badge,
    Flex,
} from "antd";

import {
    CreditCardOutlined,
    FolderOpenOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    FileTextOutlined,
    CodeOutlined,
    CustomerServiceOutlined,
    DownOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";

import { PageContainer } from "@ant-design/pro-components";
import AppPageHeader from "../Styles/AppHeader";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getDashboardOverview } from "./OverviewApi";
import { Column } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../util/commom.utils";

const { Title, Text, Link } = Typography;

const quickActions = [
    { title: "API Docs", icon: <FileTextOutlined /> },
    { title: "SDK Snippets", icon: <CodeOutlined /> },
    { title: "Support Center", icon: <CustomerServiceOutlined /> },
];

export default function Overview() {
    const navigate = useNavigate();
    const theme = useSelector((state) => state?.app?.theme);
    const [range, setRange] = useState(7);
    const [loading, setLoading] = useState(false);

    const [overview, setOverview] = useState({
        subscription: null,
        stats: null,
        usageTrend: [],
        recentProjects: [],
    });

    const fetchOverview = async (selectedRange = range) => {
        try {
            setLoading(true);

            const response = await getDashboardOverview(selectedRange);

            if (response?.status) {
                setOverview({
                    subscription: response.subscription || null,
                    stats: response.stats || null,
                    usageTrend: response.usageTrend || [],
                    recentProjects: response.recentProjects || [],
                });
            }
        } catch (error) {
            console.log(error);

            setOverview({
                subscription: null,
                stats: null,
                usageTrend: [],
                recentProjects: [],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverview(range);
    }, [range]);

    const handleRangeChange = (value) => {
        setRange(Number(value));
    };

    const stats = overview.stats;
    const subscription = overview.subscription;

    const projectPercent =
        stats?.projectsLimit > 0
            ? (stats.projectsUsed / stats.projectsLimit) * 100
            : 0;

    const editorUsersPercent =
        stats?.monthlyEditorUsersLimit > 0
            ? (stats.monthlyEditorUsersUsed /
                stats.monthlyEditorUsersLimit) *
            100
            : 0;

    const sessionsPercent =
        stats?.monthlySessionsLimit > 0
            ? (stats.monthlySessionsUsed / stats.monthlySessionsLimit) * 100
            : 0;

    const projectColumns = [
        {
            title: t("name", { defaultValue: "Name" }),
            dataIndex: "name",
            key: "name",
            render: (text) => (
                <Space>
                    <Avatar shape="square" size="small">
                        {text?.charAt(0)}
                    </Avatar>
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: t("environment", { defaultValue: "Environment" }),
            dataIndex: "environment",
            key: "environment",
            render: (environment) => (
                <Tag color={environment === "live"? "blue": "default"}>
                    {environment}
                </Tag>
            ),
        },
        {
            title: t("publicId", { defaultValue: "Public ID" }),
            dataIndex: "publicProjectId",
            key: "publicProjectId",
            render: (id) => (
                <Text code copyable={{ text: id }}>
                    {id}
                </Text>
            ),
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge
                    status={
                        status === "active"
                            ? "success"
                            : "warning"
                    }
                    text={status}
                />
            ),
        },
        {
            title: t("createdAt", { defaultValue: "Created At" }),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => (<Text>{formatDate(date)}</Text>),
        },
    ];


    return (
        <PageContainer title={false}>
            <Flex justify="space-between" align="center">
                <AppPageHeader title={t("overview", { defaultValue: "Overview", })}
                    description={t("overview.description", { defaultValue: "Good morning, Alex. Here's what's happening with your workspace." })}
                />

                <Select
                    value={String(range)}
                    loading={loading}
                    style={{ width: 160 }}
                    suffixIcon={<DownOutlined />}
                    onChange={handleRangeChange}
                    options={[
                        {
                            value: "7",
                            label: t("last7Days", { defaultValue: "Last 7 Days" }),
                        },
                        // {
                        //     value: "15",
                        //     label: t("last15Days", { defaultValue: "Last 15 Days" }),
                        // },
                        // {
                        //     value: "30",
                        //     label: t("last30Days", { defaultValue: "Last 30 Days" }),
                        // },
                    ]}
                />
            </Flex>

            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                {/* Stat Cards */}
                <Row gutter={[16, 16]} >
                    {/* Subscription */}
                    <Col xs={24} sm={12} lg={6}>
                        <Card loading={loading}>
                            <Space style={{ width: "100%", justifyContent: "space-between", }} align="start">
                                <Text type="secondary">
                                    {t("subscription", { defaultValue: "SUBSCRIPTION" })}
                                </Text>

                                <CreditCardOutlined
                                    style={{
                                        color: "#20A6CE",
                                        fontSize: 20,
                                    }}
                                />
                            </Space>

                            <Title level={3} style={{ margin: "8px 0" }}>
                                {subscription?.planName || "-"}
                            </Title>

                            <Tag color="cyan">
                                {subscription?.status || "-"}
                            </Tag>
                        </Card>
                    </Col>

                    {/* Projects */}
                    <Col xs={24} sm={12} lg={6}>
                        <Card loading={loading}>
                            <Space
                                style={{ width: "100%", justifyContent: "space-between", }} align="start">
                                <Text type="secondary">
                                    {t("projects", { defaultValue: "PROJECTS" })}
                                </Text>

                                <FolderOpenOutlined style={{ color: "#1677ff", fontSize: 20, }} />
                            </Space>

                            <Title level={3} style={{ margin: "8px 0" }}>
                                {stats
                                    ? `${stats.projectsUsed} / ${stats.projectsLimit}`
                                    : "-"}
                            </Title>

                            <Progress
                                percent={projectPercent}
                                showInfo={false}
                                strokeColor="#1677ff"

                            />
                        </Card>
                    </Col>

                {/* Monthly Editor Users */}
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Space style={{ width: "100%", justifyContent: "space-between", }} align="start">
                            <Text type="secondary">
                                {t("monthly.Editor.Users", { defaultValue: "MONTHLY EDITOR USERS" })}
                            </Text>

                            <TeamOutlined style={{ color: "#20A6CE", fontSize: 20, }} />
                        </Space>

                        <Title level={3} style={{ margin: "8px 0" }}>
                            {stats ? `${stats.monthlyEditorUsersUsed} / ${stats.monthlyEditorUsersLimit}` : "-"}
                        </Title>

                        <Progress
                            percent={editorUsersPercent}
                            showInfo={false}
                            strokeColor="#20A6CE"
                        />
                    </Card>
                </Col>

                {/* Monthly Sessions */}
                <Col xs={24} sm={12} lg={6}>
                    <Card loading={loading}>
                        <Space style={{ width: "100%", justifyContent: "space-between", }} align="start">
                            <Text type="secondary">
                                {t("monthly.Sessions", { defaultValue: "MONTHLY SESSIONS" })}
                            </Text>

                            <ThunderboltOutlined style={{ color: "#52c41a", fontSize: 20, }} />
                        </Space>

                        <Title level={3} style={{ margin: "8px 0" }}>
                            {stats ? `${stats.monthlySessionsUsed} / ${stats.monthlySessionsLimit}` : "-"}
                        </Title>

                        <Progress
                            percent={sessionsPercent}
                            showInfo={false}
                            strokeColor="#52c41a"
                        />
                    </Card>
                </Col>
            </Row>

            {/* Usage Trend + Quick Actions */}
            {/* <Row
                gutter={[16, 16]}
                style={{ marginBottom: 16 }}
            > */}

                {/* Usage Trend + Quick Actions */}
                <Row
                    gutter={[16, 16]}
                >
                    <Col xs={24} lg={16}>
                        <Card
                            title={t("session.Trend", { defaultValue: "Session Trend" })}
                            extra={
                                <Select
                                    value={String(range)}
                                    onChange={(value) => setRange(Number(value))}
                                    loading={loading}
                                    suffixIcon={<DownOutlined />}
                                    options={[
                                        { value: "7", label: t("last.7.Days", { defaultValue: "Last 7 Days" }) },
                                        // { value: "15", label: t("last.15.Days", { defaultValue: "Last 15 Days" }) },
                                        // { value: "30", label: t("last.30.Days", { defaultValue: "Last 30 Days" }) },
                                    ]}
                                />
                            }
                            style={{ height: "100%" }}
                        >
                            <div>
                                <Column
                                    key={`${theme ? "dark" : "light"}-${range}`}
                                    data={overview.usageTrend.map((item) => ({
                                        day: new Date(item.date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        }),
                                        sessions: item.sessions || 0,
                                    }))}
                                    xField="day"
                                    yField="sessions"
                                    height={230}
                                    style={{
                                        maxWidth: 50,
                                        fill: "#adc6ff",
                                        radiusTopLeft: 4,
                                        radiusTopRight: 4,
                                    }}
                                    theme={{
                                        type: theme ? "dark" : "light",
                                        axis: {
                                            x: {
                                                labelFill: theme ? "#a6b4c3" : "#8c8c8c",
                                                labelFontSize: 12,
                                                tickStroke: theme ? "#243746" : "#d9d9d9",
                                                lineStroke: theme ? "#243746" : "#d9d9d9",
                                            },
                                        },
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
                                    tooltip={{
                                        items: [
                                            {
                                                channel: "y",
                                                name: t("sessions", { defaultValue: "Sessions" }),
                                            },
                                        ],
                                    }}
                                />

                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card title={t("quick.Actions", { defaultValue: "Quick Actions" })} style={{ height: "100%" }}>
                            <List
                                dataSource={quickActions}
                                renderItem={(item) => (
                                    <List.Item style={{ padding: "8px 0", }}>
                                        <Button
                                            type="text"
                                            icon={item.icon}
                                            block
                                            style={{textAlign: "left",}}>
                                            {item.title}
                                            {item.description && <Text type="secondary">{item.description}</Text>}
                                        </Button>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>


                {/* Recent Projects*/}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={24}>
                        <Card
                            title={t("recent.Projects", { defaultValue: "Recent Projects" })}
                            extra={<Link onClick={() => navigate("/select-project")}>
                                {t("view.All", { defaultValue: "View All" })} <ArrowRightOutlined />
                            </Link>}
                            loading={loading}
                            styles={{ body: { padding: 0, }, }}
                        >
                            <Table
                                columns={projectColumns}
                                dataSource={overview.recentProjects.map(
                                    (project) => ({
                                        ...project,
                                        key: project._id,
                                    })
                                )}
                                pagination={false}
                                locale={{
                                    emptyText: t("no.Recent.Projects", { defaultValue: "No recent projects" }),
                                }}
                                scroll={{ x: "max-content" }}
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
                    </Col>
                </Row>
            </Space>
        </PageContainer>
    );
}