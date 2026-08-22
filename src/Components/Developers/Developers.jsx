import {
    Row,
    Col,
    Card,
    Button,
    Segmented,
    Table,
    Tag,
    Badge,
    Progress,
    Space,
    Typography,
    Avatar,
    Flex,
} from "antd";
import {
    HistoryOutlined,
    KeyOutlined,
    RocketOutlined,
    ReadOutlined,
    AppstoreOutlined,
    ThunderboltOutlined,
    LockOutlined,
    ArrowRightOutlined,
    CopyOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import AppPageHeader from "../Styles/AppHeader";
import { useSelector } from "react-redux";

const { Title, Text, Link, Paragraph } = Typography;

const featureCards = [
    {
        key: "quickstart",
        icon: <RocketOutlined />,
        bg: "#f0edff",
        color: "#7b61ff",
        title: "Quick Start",
        desc: "Get your first request running in under 5 minutes with our guided tutorial.",
        action: "Start Building",
    },
    {
        key: "apiref",
        icon: <ReadOutlined />,
        bg: "#e6f4ff",
        color: "#1677ff",
        title: "API Reference",
        desc: "Complete documentation of all REST endpoints, models, and error codes.",
        action: "View Specs",
    },
    {
        key: "sdk",
        icon: <AppstoreOutlined />,
        bg: "#fff1f0",
        color: "#f5222d",
        title: "SDK Integration",
        desc: "Official libraries for Node.js, Python, Go, and Ruby to speed up development.",
        action: "Download SDKs",
    },
    {
        key: "webhooks",
        icon: <ThunderboltOutlined />,
        bg: "#e6fffb",
        color: "#13c2c2",
        title: "Webhooks",
        desc: "Subscribe to real-time events and manage payload delivery endpoints securely.",
        action: "Manage Hooks",
    },
];

const configuredWebhooks = [
    {
        key: "1",
        url: "https://api.acme.corp/webhooks/canvas",
        status: "ok",
        note: "Listening to: canvas.updated",
    },
    {
        key: "2",
        url: "https://hooks.acme.corp/fail-ever",
        status: "error",
        note: "Failing (Last 4 attempts)",
    },
];

const sessionFailures = [
    {
        key: "1",
        timestamp: "Today, 14:23:81 UTC",
        eventId: "req_8f92a1b3",
        endpoint: "/v2/auth/token",
        errorCode: "401_UNAUTHORIZED",
    },
    {
        key: "2",
        timestamp: "Today, 12:05:44 UTC",
        eventId: "req_7c81d0e4",
        endpoint: "/v2/canvas/render",
        errorCode: "429_TOO_MANY_REQUESTS",
    },
    {
        key: "3",
        timestamp: "Yesterday, 09:11:22 UTC",
        eventId: "req_3a29b8c7",
        endpoint: "/v2/webhooks/trigger",
        errorCode: "500_INTERNAL_ERROR",
    },
];

const failureColumns = [
    {
        title: "Timestamp",
        dataIndex: "timestamp",
        key: "timestamp",
        width: 190,
    },
    {
        title: "Event ID",
        dataIndex: "eventId",
        key: "eventId",
        width: 150,
        render: (id) => <Text code>{id}</Text>,
    },
    {
        title: "Endpoint",
        dataIndex: "endpoint",
        key: "endpoint",
        width: 180,
    },
    {
        title: "Error Code",
        dataIndex: "errorCode",
        key: "errorCode",
        width: 210,
        render: (code) => <Tag color="error">{code}</Tag>,
    },
];

const codeSample = `import { BitBeast } from '@bitbeast/sdk';

// Initialize the client with your secret key
const client = new BitBeast(process.env.BITBEAST_API_KEY, {
  environment: 'production',
  timeout: 5000
});

async function authenticateSession(userId) {
  try {
    const session = await client.auth.createToken({
      subject: userId,
      scope: ['read:data', 'write:canvas']
    });
    return session.token;
  } catch (error) {
    console.error('Auth failure:', error.message);
  }
}`;

export default function Developers() {
    const theme = useSelector((state) => state?.app?.theme);

    return (
        <PageContainer title={false}>
            {/* Header */}
            <Flex
                vertical
                gap={16}
                style={{ marginBottom: 16 }}
            >
                <Row
                    gutter={[16, 16]}
                    align="middle"
                    justify="space-between"
                >
                    <Col xs={24} lg={18}>
                        <AppPageHeader
                            title="Developers"
                            description="Manage your API keys, monitor integration health, and access comprehensive technical resources to build on the BitBeast platform."
                        />
                    </Col>

                    <Col xs={24} lg={6}>
                        <Flex
                            gap={8}
                            justify="flex-end"
                            wrap="wrap"
                        >
                            <Button icon={<HistoryOutlined />}>
                                Audit Logs
                            </Button>

                            <Button
                                type="primary"
                                icon={<KeyOutlined />}
                            >
                                Generate Token
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </Flex>

            {/* Feature Cards */}
            <Row gutter={[16, 16]}>
                {featureCards.map((f) => (
                    <Col key={f.key} xs={24} sm={12} lg={6}>
                        <Card
                            style={{ height: "100%" }}
                            styles={{
                                body: {
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                },
                            }}
                        >
                            <Avatar
                                shape="square"
                                size={40}
                                style={{
                                    background: f.bg,
                                    color: f.color,
                                }}
                                icon={f.icon}
                            />

                            <Title
                                level={5}
                                style={{
                                    margin: "12px 0 4px",
                                }}
                            >
                                {f.title}
                            </Title>

                            <Paragraph type="secondary"style={{marginBottom: 12,}}>
                                {f.desc}
                            </Paragraph>

                            <Link>
                                {f.action} <ArrowRightOutlined />
                            </Link>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Main Content */}
            <Row
                gutter={[16, 16]}
                style={{ marginTop: 16 }}
            >
                {/* Left */}
                <Col xs={24} lg={16}>
                    <Space
                        direction="vertical"
                        size={16}
                        style={{ width: "100%" }}
                    >
                        {/* Authentication */}
                        <Card
                            title={
                                <Space>
                                    <LockOutlined />
                                    Authentication Sequence
                                </Space>
                            }
                            extra={
                                <Segmented
                                    size="small"
                                    defaultValue="Node.js"
                                    options={[
                                        "Node.js",
                                        "Python",
                                        "Go",
                                    ]}
                                />
                            }
                        >
                            <pre
                                style={{
                                    background: theme? "#141414": "#f8f8f8",
                                    color: theme ? "#d9d9d9": "#585858",
                                    padding: 16,
                                    borderRadius: 8,
                                    overflowX: "auto",
                                    fontSize: 13,
                                    lineHeight: 1.7,
                                    margin: 0,
                                    maxWidth: "100%",
                                }}
                            >
                                <code>{codeSample}</code>
                            </pre>
                        </Card>

                        {/* Session Failures */}
                        <Card
                            title="Recent Session Failures"
                            extra={
                                <Link>
                                    VIEW ALL
                                </Link>
                            }
                            styles={{
                                body: {
                                    padding: 0,
                                },
                            }}
                        >
                            <Table
                                columns={failureColumns}
                                dataSource={sessionFailures}
                                pagination={false}
                                scroll={{ x: 730 }}
                                size="small"
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
                </Col>

                {/* Right */}
                <Col xs={24} lg={8}>
                    <Space
                        direction="vertical"
                        size={16}
                        style={{ width: "100%" }}
                    >
                        {/* License */}
                        <Card title="License & Project Health">
                            <Space
                                direction="vertical"
                                size={16}
                                style={{ width: "100%" }}
                            >
                                <Row
                                    justify="space-between"
                                    align="middle"
                                    gutter={[8, 8]}
                                >
                                    <Col>
                                        <Text type="secondary">
                                            Production API Key
                                        </Text>
                                    </Col>

                                    <Col>
                                        <Badge
                                            status="success"
                                            text="Active"
                                        />
                                    </Col>
                                </Row>

                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={8}
                                >
                                    <Text
                                        code
                                        ellipsis
                                        style={{ minWidth: 0 }}
                                    >
                                        sk_live_...9f82
                                    </Text>

                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined />}
                                    />
                                </Flex>

                                <Row
                                    justify="space-between"
                                    align="middle"
                                    gutter={[8, 8]}
                                >
                                    <Col>
                                        <Text type="secondary">
                                            Test API Key
                                        </Text>
                                    </Col>

                                    <Col>
                                        <Badge
                                            status="success"
                                            text="Active"
                                        />
                                    </Col>
                                </Row>

                                <Flex
                                    justify="space-between"
                                    align="center"
                                    gap={8}
                                >
                                    <Text
                                        code
                                        ellipsis
                                        style={{ minWidth: 0 }}
                                    >
                                        sk_test_...3b21
                                    </Text>

                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<CopyOutlined />}
                                    />
                                </Flex>

                                <div>
                                    <Row
                                        justify="space-between"
                                        align="middle"
                                    >
                                        <Col>
                                            <Text type="secondary">
                                                Monthly API Requests
                                            </Text>
                                        </Col>

                                        <Col>
                                            <Text strong>84%</Text>
                                        </Col>
                                    </Row>

                                    <Progress
                                        percent={84}
                                        showInfo={false}
                                    />

                                    <Text type="secondary">
                                        842,019 / 1,000,000
                                    </Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Webhooks */}
                        <Card title="Configured Webhooks">
                            <Space
                                direction="vertical"
                                size={12}
                                style={{ width: "100%" }}
                            >
                                {configuredWebhooks.map((w) => (
                                    <Flex
                                        key={w.key}
                                        align="flex-start"
                                        gap={8}
                                    >
                                        {w.status === "ok" ? (
                                            <CheckCircleFilled
                                                style={{
                                                    color: "#52c41a",
                                                    marginTop: 4,
                                                }}
                                            />
                                        ) : (
                                            <CloseCircleFilled
                                                style={{
                                                    color: "#f5222d",
                                                    marginTop: 4,
                                                }}
                                            />
                                        )}

                                        <div style={{ minWidth: 0 }}>
                                            <Text
                                                style={{
                                                    wordBreak:
                                                        "break-word",
                                                }}
                                            >
                                                {w.url}
                                            </Text>

                                            <br />

                                            <Text
                                                type={
                                                    w.status === "ok"
                                                        ? "secondary"
                                                        : "danger"
                                                }
                                            >
                                                {w.note}
                                            </Text>
                                        </div>
                                    </Flex>
                                ))}
                            </Space>
                        </Card>
                    </Space>
                </Col>
            </Row>
        </PageContainer>
    );
}