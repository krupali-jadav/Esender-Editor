import {
    Row,
    Col,
    Card,
    Progress,
    Typography,
    Space,
    Select,
    Table,
    Button,
    Avatar,
    Flex,
} from "antd";
import {
    TeamOutlined,
    ClockCircleOutlined,
    FolderOutlined,
    StarOutlined,
    WarningOutlined,
    RocketOutlined,
    DownOutlined,
    MailOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { PageContainer } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";

const { Title, Text, Link } = Typography;

const sessionTrendData = [
    { day: "Mon", sessions: 30 },
    { day: "Tue", sessions: 55 },
    { day: "Wed", sessions: 38 },
    { day: "Thu", sessions: 72 },
    { day: "Fri", sessions: 100 },
    { day: "Sat", sessions: 48 },
    { day: "Sun", sessions: 42 },
];

const recentTemplates = [
    {
        key: "1",
        name: "Welcome Series - Onboarding 1",
        id: "tpl_8f29x",
        modified: "Oct 24, 2023",
        icon: <MailOutlined />,
    },
    {
        key: "2",
        name: "Monthly Invoice Notification",
        id: "tpl_4a9bc",
        modified: "Oct 12, 2023",
        icon: <FileTextOutlined />,
    },
];

const templateColumns = [
    {
        title: "Template Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <Space>
                <Avatar shape="square" size="small" icon={record.icon} />
                <Text strong>{text}</Text>
            </Space>
        ),
    },
    {
        title: "ID",
        dataIndex: "id",
        key: "id",
        render: (id) => <Text code>{id}</Text>,
    },
    {
        title: "Last Modified",
        dataIndex: "modified",
        key: "modified",
    },
];

const usageStats = [
    {
        title: "MONTHLY EDITOR USERS",
        value: "1.2k",
        total: "5k",
        percent: 24,
        icon: <TeamOutlined />,
        color: "#20A6CE",
    },
    {
        title: "MONTHLY SESSIONS",
        value: "4.8k",
        total: "20k",
        percent: 24,
        icon: <ClockCircleOutlined />,
        color: "#13c2c2",
    },
    {
        title: "TEMPLATE STORAGE",
        value: "45",
        total: "100",
        percent: 45,
        icon: <FolderOutlined />,
        color: "#1677FF",
        description: "* Sum of all template file sizes",
    },
    {
        title: "AI CREDITS",
        value: "120",
        total: "500",
        percent: 24,
        icon: <StarOutlined />,
        color: "#20A6CE",
    },
];

export default function Usage() {
    const theme = useSelector((state) => state?.app?.theme);
    return (
        <PageContainer title={false}>
            <AppPageHeader
                title="Usage"
                description="Keep track of your monthly editor users, sessions, template storage. Stay informed about resource alerts and optimize your usage."
            />
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                {/* Stat Cards */}
                <Row gutter={[16, 16]}>
                    {usageStats.map((stat) => (
                        <Col xs={24} sm={12} lg={6} key={stat.title}>
                            <Card style={{ height: "100%" }}>
                                <Flex justify="space-between" >
                                    <Text type="secondary">{stat.title}</Text>

                                    <span style={{ color: stat.color, fontSize: 20 }}>
                                        {stat.icon}
                                    </span>
                                </Flex>

                                <Title level={3}>
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
                        </Col>
                    ))}
                </Row>

                {/* Session trend + Resource alerts */}
                <Row gutter={16} >
                    <Col xs={24} lg={11}>
                        <Card
                            title="Session Trend"
                            extra={
                                <Select
                                    defaultValue="30"
                                    suffixIcon={<DownOutlined />}
                                    options={[
                                        { value: "7", label: "Last 7 Days" },
                                        { value: "30", label: "Last 30 Days" },
                                        { value: "90", label: "Last 90 Days" },
                                    ]}
                                />
                            }
                            style={{ height: "100%" }}
                        >
                            <Column
                                data={sessionTrendData}
                                xField="day"
                                yField="sessions"
                                height={260}
                                style={{
                                    maxWidth: 50,
                                    fill: "#adc6ff",
                                    radiusTopLeft: 4,
                                    radiusTopRight: 4,
                                }}
                                axis={{
                                    x: { line: false, tickLine: false },
                                    y: { grid: { line: { style: { stroke: "#f0f0f0" } } }, label: false },
                                }}
                                tooltip={false}
                            />
                        </Card>
                    </Col>

                    <Col xs={24} lg={13}>
                        <Card
                            title={
                                <Space>
                                    <WarningOutlined style={{ color: "#cf1322" }} />
                                    Resource Alerts
                                </Space>
                            }
                            style={{ height: "100%" }}
                        >
                            <Text type="secondary">
                                The following resources have exceeded 75% of their allocated
                                capacity.
                            </Text>

                            <div style={{ marginTop: 20 }}>
                                <Space
                                    style={{ width: "100%", justifyContent: "space-between" }}
                                >
                                    <Text strong>API Requests</Text>
                                    <Text strong style={{ color: "#b81220" }}>
                                        88%
                                    </Text>
                                </Space>
                                <Progress
                                    percent={88}
                                    showInfo={false}
                                    strokeColor="#b81220"
                                />
                                <Space
                                    style={{ width: "100%", justifyContent: "space-between" }}
                                >
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        WARNING
                                    </Text>
                                    <Text type="secondary" >
                                        88,000 / 100,000
                                    </Text>
                                </Space>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <Space
                                    style={{ width: "100%", justifyContent: "space-between" }}
                                >
                                    <Text strong>Database Connections</Text>
                                    <Text strong style={{ color: "#b81220" }}>
                                        94%
                                    </Text>
                                </Space>
                                <Progress
                                    percent={94}
                                    showInfo={false}
                                    strokeColor="#b81220"
                                    style={{ margin: "8px 0 4px" }}
                                />
                                <Space
                                    style={{ width: "100%", justifyContent: "space-between" }}
                                >
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        CRITICAL
                                    </Text>
                                    <Text type="secondary" >
                                        470 / 500
                                    </Text>
                                </Space>
                            </div>

                            <Button
                                type="primary"
                                icon={<RocketOutlined />}
                                block
                                style={{
                                    marginTop: 24,
                                    background: theme ? "#0A1622" : "#21415e",
                                }}
                            >
                                Upgrade Plan
                            </Button>
                        </Card>
                    </Col>
                </Row>


                {/* Recently updated templates */}
                <Card
                    title="Recently Updated Templates"
                    extra={<Link>View All →</Link>}
                    styles={{ body: { padding: 0 } }}
                >
                    <Table
                        columns={templateColumns}
                        dataSource={recentTemplates}
                        pagination={false}
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
            </Space>
        </PageContainer>
    );
}
