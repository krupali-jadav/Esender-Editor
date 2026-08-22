import {
    Row,
    Col,
    Card,
    Badge,
    Progress,
    Typography,
    Space,
    Button,
    Tag,
    Table,
} from "antd";
import {CreditCardOutlined, WarningOutlined, CheckCircleOutlined, FilePdfOutlined,} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";

const { Title, Text, Link, Paragraph } = Typography;

const proFeatures = ["20 Workspace Users", "50 Projects", "Standard Support"];
const businessFeatures = [
    "Unlimited Workspace Users",
    "Unlimited Projects",
    "White-labeling",
    "Priority 24/7 Support",
];

const invoices = [
    {
        key: "1",
        id: "INV-2823-09",
        date: "Sep 24, 2023",
        amount: "$49.00",
        status: "Paid",
    },
    {
        key: "2",
        id: "INV-2823-08",
        date: "Aug 24, 2023",
        amount: "$49.00",
        status: "Paid",
    },
];

const invoiceColumns = [
    {
        title: "Invoice ID",
        dataIndex: "id",
        key: "id",
        render: (id) => <Text underline strong>{id}</Text>,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => <Tag color="success">{status}</Tag>,
    },
    {
        title: "Action",
        key: "action",
        align: "right",
        render: () => (
            <Link>
                <FilePdfOutlined /> View PDF
            </Link>
        ),
    },
];

export default function Billing() {
    const theme = useSelector((state) => state?.app?.theme);
    return (
        <PageContainer title={false}>
            <AppPageHeader
                title="Billing"
                description="Manage your subscription, payment methods, and view your billing history."
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
                                    Current Subscription
                                </Title>
                                <Badge status="success" text="Active" />
                            </Space>

                            <Space direction="vertical" style={{ width: "100%" }} size={15}>
                                <Row justify="space-between" >
                                    <Text type="secondary">Plan</Text>
                                    <Text strong>Pro Plan</Text>
                                </Row>
                                <Row justify="space-between" >
                                    <Text type="secondary">Renewal Date</Text>
                                    <Text strong>Oct 24, 2024</Text>
                                </Row>
                                <Row justify="space-between" align="top">
                                    <Text type="secondary">Payment Method</Text>
                                    <Space size={4}>
                                        <CreditCardOutlined />
                                        <Text strong>Visa ending in 4242</Text>
                                    </Space>
                                </Row>
                                <Button block >
                                    Manage Billing
                                </Button>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={16}>
                        <Card title="Usage Quotas" style={{ height: "100%" }}>
                            <Row gutter={32}>
                                <Col span={12}>
                                    <Text type="secondary">Total Workspace Users</Text>
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
                                        <Text type="secondary">
                                            60%
                                        </Text>
                                    </Row>
                                </Col>

                                <Col span={12}>
                                    <Text type="secondary">Total Project Count</Text>
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
                                            90%
                                        </Text>
                                    </Row>
                                    <Text type="danger" style={{ fontSize: 12 }}>
                                        <WarningOutlined /> Approaching limit
                                    </Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Available Plans */}
                <Card
                    style={{
                        marginBottom: 16,
                        background: theme ? "#0f2435" : "#fff",
                    }}
                >
                    {/* Section Header */}
                    <div style={{ textAlign: "center", marginBottom: 24,}}>
                        <Title level={3} >
                            Available Plans
                        </Title>

                        <Paragraph type="secondary">
                            Upgrade to unlock more features and higher limits.
                        </Paragraph>
                    </div>

                    {/* Plans */}
                    <Row gutter={[16, 16]}>
                        {/* Pro Plan */}
                        <Col xs={24} md={12}>
                            <Card
                                style={{
                                    height: "100%",
                                    background: theme ? "#10283a" : "#fff",
                                    border: theme
                                        ? "1px solid #1d3a4e"
                                        : "1px solid #e6e6e6",
                                }}
                            >
                                <Space
                                    direction="vertical"
                                    size={4}
                                >
                                    <Tag style={{ color: theme ? "#20A6CE" : "#4797af", }}>
                                        Current Plan
                                    </Tag>

                                    <Title level={2} style={{ margin: "12px 0 0" }}>
                                        Pro
                                    </Title>

                                    <Text type="secondary" style={{ fontSize: 16, fontWeight: 600, }}>
                                        $49 <Text type="secondary">/mo</Text>
                                    </Text>
                                </Space>

                                <Space
                                    direction="vertical"
                                    size={12}
                                    style={{
                                        marginTop: 24,
                                        width: "100%",
                                        flex: 1,
                                    }}
                                >
                                    {proFeatures.map((feature) => (
                                        <Space key={feature} size={10}>
                                            <CheckCircleOutlined
                                            />
                                            <Text type="secondary">
                                                {feature}
                                            </Text>
                                        </Space>
                                    ))}
                                </Space>

                                <Button
                                    block
                                    size="large"
                                    icon={<CreditCardOutlined />}
                                    style={{
                                        marginTop: 28,
                                        borderRadius: 24,
                                        fontWeight: 600,
                                    }}
                                >
                                    Renew Plan
                                </Button>
                            </Card>
                        </Col>

                        {/* Business Plan */}
                        <Col xs={24} md={12}>
                            <Card
                                style={{
                                    height: "100%",
                                    background: theme ? "#0e1c29" : "#f5fcff",
                                    border: theme
                                        ? "1px solid #1d3a4e"
                                        : "1px solid #d6eef5",
                                }}

                            >
                                <Space
                                    direction="vertical"
                                    size={4}
                                >
                                    <Title level={2} style={{ margin: 0, }}>
                                        Business
                                    </Title>

                                    <Text style={{ fontSize: 18, fontWeight: 600, }}>
                                        $199{" "}
                                        <Text type="secondary">
                                            /mo
                                        </Text>
                                    </Text>
                                </Space>

                                <Space
                                    direction="vertical"
                                    size={12}
                                    style={{
                                        marginTop: 24,
                                        width: "100%",
                                        flex: 1,
                                    }}
                                >
                                    {businessFeatures.map((feature) => (
                                        <Space key={feature} size={10}>
                                            <CheckCircleOutlined style={{ color: "#20A6CE" }} />
                                            <Text strong>
                                                {feature}
                                            </Text>
                                        </Space>
                                    ))}
                                </Space>

                                <Button
                                    type="primary"
                                    block
                                    size="large"
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                        marginTop: 28,
                                        background: theme
                                            ? "#17708b"
                                            : "#4797af",
                                        borderColor: theme
                                            ? "#17708b"
                                            : "#4797af",
                                        borderRadius: 24,
                                        fontWeight: 600,
                                    }}
                                >
                                    Upgrade to Business
                                </Button>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Space>

            {/* Invoice History */}
            <Card title="Invoice History"
                styles={{ body: { padding: 0 } }}
            >
                <Table
                    columns={invoiceColumns}
                    dataSource={invoices}
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
        </PageContainer>
    );
}
