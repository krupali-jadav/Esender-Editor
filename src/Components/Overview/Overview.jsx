import { Row, Col, Card, Progress, Tag, Typography, Table, List, Checkbox, Space, Avatar, Button, Select, Empty, Badge, Flex, } from "antd";
import { CreditCardOutlined, FolderOpenOutlined, TeamOutlined, ThunderboltOutlined, BarChartOutlined, FileTextOutlined, CodeOutlined, CustomerServiceOutlined, DownOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import AppPageHeader from "../Styles/AppHeader";
import { t } from "i18next";
import { useSelector } from "react-redux";
import EmptyState from "../Styles/EmptyState";

const { Title, Text, Link } = Typography;
const setupChecklist = [
    { title: "Create Project", done: true },
    { title: "Save Credentials", done: false },
    { title: "Add Domain", done: false },
    { title: "Run Connection Test", done: false },
    { title: "Create Template", done: false },
];

const quickActions = [
    { title: "API Docs", icon: <FileTextOutlined /> },
    { title: "SDK Snippets", icon: <CodeOutlined /> },
    { title: "Support Center", icon: <CustomerServiceOutlined /> },
];

const recentProjects = [
    {
        key: "1",
        name: "Marketing Emails",
        env: "Live",
        id: "prj_live_8821",
        domains: 12,
        status: "Active",
    },
    {
        key: "2",
        name: "Transactional",
        env: "Test",
        id: "prj_test_4412",
        domains: 4,
        status: "Pending",
    },
];

const projectColumns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text) => (
            <Space>
                <Avatar shape="square" size="small">
                    {text.charAt(0)}
                </Avatar>
                <Text strong>{text}</Text>
            </Space>
        ),
    },
    {
        title: "Environment",
        dataIndex: "env",
        key: "env",
        render: (env) => (
            <Tag color={env === "Live" ? "blue" : "default"}>{env}</Tag>
        ),
    },
    {
        title: "Public ID",
        dataIndex: "id",
        key: "id",
        render: (id) => <Text code copyable>{id}</Text>,
    },
    {
        title: "Domain Count",
        dataIndex: "domains",
        key: "domains",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <Badge
                status={status === "Active" ? "success" : "warning"}
                text={status}
            />
        ),
    },
];

export default function Overview() {
    const theme = useSelector((state) => state?.app?.theme);
    return (
        <PageContainer title={false}>
            <Flex justify="space-between" align="center">
                <AppPageHeader
                    title={t("overview", { defaultValue: "Overview" })}
                    description=" Good morning, Alex. Here's what's happening with your workspace."
                />
                <Col>
                    <Select
                        defaultValue="30"
                        style={{ width: 160 }}
                        suffixIcon={<DownOutlined />}
                        options={[
                            { value: "7", label: "Last 7 Days" },
                            { value: "30", label: "Last 30 Days" },
                            { value: "90", label: "Last 90 Days" },
                        ]}
                    />
                </Col>
            </Flex>
            {/* Stat cards */}
            <Row gutter={16} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} lg={6} >
                    <Card>
                        <Space
                            style={{ width: "100%", justifyContent: "space-between" }}
                            align="start"
                        >
                            <Text type="secondary">SUBSCRIPTION</Text>
                            <CreditCardOutlined style={{ color: "#20A6CE", fontSize: 20 }} />
                        </Space>
                        <Title level={3} style={{ margin: "8px 0" }}>
                            Active
                        </Title>
                        <Tag color="cyan">Pro Plan</Tag>
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Space
                            style={{ width: "100%", justifyContent: "space-between" }}
                            align="start"
                        >
                            <Text type="secondary">PROJECTS</Text>
                            <FolderOpenOutlined style={{ color: "#1677ff", fontSize: 20 }} />
                        </Space>
                        <Title level={3} style={{ margin: "8px 0" }}>
                            2 / 5
                        </Title>
                        <Progress percent={40} showInfo={false} strokeColor="#1677ff" />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Space
                            style={{ width: "100%", justifyContent: "space-between" }}
                            align="start"
                        >
                            <Text type="secondary">MONTHLY EDITOR USERS</Text>
                            <TeamOutlined style={{ color: "#20A6CE", fontSize: 20 }} />
                        </Space>
                        <Title level={3} style={{ margin: "8px 0" }}>
                            1.2k / 5k
                        </Title>
                        <Progress percent={24} showInfo={false} strokeColor="#20A6CE" />
                    </Card>
                </Col>

                <Col xs={24} sm={12} lg={6}>
                    <Card>
                        <Space
                            style={{ width: "100%", justifyContent: "space-between" }}
                            align="start"
                        >
                            <Text type="secondary">MONTHLY SESSIONS</Text>
                            <ThunderboltOutlined style={{ color: "#52c41a", fontSize: 20 }} />
                        </Space>
                        <Title level={3} style={{ margin: "8px 0" }}>
                            4.8k / 20k
                        </Title>
                        <Progress percent={24} showInfo={false} strokeColor="#52c41a" />
                    </Card>
                </Col>
            </Row>

            {/* Usage trend + Setup checklist */}
            <Row gutter={[16,16]} style={{ marginBottom: 16 }}>
                <Col xs={24} lg={16}>
                    <Card
                        title="Usage Trend"
                        extra={
                            <Space size="middle">
                                <Space size={4}>
                                    <Badge color="blue" /> Sessions
                                </Space>
                                <Space size={4}>
                                    <Badge color="purple" /> Users
                                </Space>
                            </Space>
                        }
                        style={{ height: "100%" }}
                    >
                        <EmptyState
                            icon={<FileTextOutlined />}
                            title={t('usage.history.unavailable', { defaultValue: 'Usage history unavailable' })}
                            description={t('connect.first.project', { defaultValue: 'Connect your first project to see analytics' })}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Setup Checklist" style={{ height: "100%" }}>
                        <Text type="secondary">Get up and running in minutes.</Text>
                        <Progress
                            percent={20}
                            showInfo={false}
                            style={{ margin: "12px 0" }}
                        />
                        <List
                            dataSource={setupChecklist}
                            renderItem={(item) => (
                                <List.Item style={{ border: "none", padding: "6px 0" }}>
                                    <Checkbox checked={item.done}>
                                        <Text delete={item.done} type={item.done ? "secondary" : undefined}>
                                            {item.title}
                                        </Text>
                                    </Checkbox>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Recent projects + Quick actions */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card
                        title="Recent Projects"
                        extra={<Link>View All</Link>}
                        styles={{ body: { padding: 0 } }}
                    >
                        <Table
                            columns={projectColumns}
                            dataSource={recentProjects}
                            pagination={false}
                            scroll={{ x: "max-content" }}
                            components={{
                                header: {
                                    cell: (props) => (
                                        <th
                                            {...props}
                                            style={{
                                                ...props.style,
                                                background: theme ? "#0e1c29" : "#f0f0f0",
                                            }}
                                        />
                                    ),
                                },
                            }}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card title="Quick Actions">
                        <List
                            dataSource={quickActions}
                            renderItem={(item) => (
                                <List.Item style={{ padding: "8px 0" }}>
                                    <Button type="text" icon={item.icon} block style={{ textAlign: "left" }}>
                                        {item.title}
                                    </Button>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
}
