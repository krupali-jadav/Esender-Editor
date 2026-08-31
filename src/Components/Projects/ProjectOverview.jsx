import {
    Card,
    Col,
    ConfigProvider,
    Flex,
    Progress,
    Row,
    Space,
    Statistic,
    Tag,
    Typography,
    theme as antdTheme,
    Button,
    Divider,
} from "antd";

import {
    ArrowRightOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CodeOutlined,
    FileTextOutlined,
    GlobalOutlined,
    KeyOutlined,
    SettingOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
const PRIMARY_COLOR = "#20A6CE";

export default function ProjectOverview({ setActiveTab }) {
    const theme = useSelector((state) => state?.app?.theme);
    const isDark = !!theme;
    const navigate = useNavigate();

    const project = {
        name: "testing",
        environment: "test",
        id: "prj_0fb3d...",
        createdAt: "31 Aug 2026",
        status: "active",
    };

    const templates = [
        {
            id: 1,
            name: "Welcome Template",
            status: "published",
            updatedAt: "31 Aug 2026",
        },
        {
            id: 2,
            name: "Birthday Template",
            status: "draft",
            updatedAt: "29 Aug 2026",
        },
        {
            id: 3,
            name: "Marketing Template",
            status: "published",
            updatedAt: "27 Aug 2026",
        },
        {
            id: 4,
            name: "Product Update",
            status: "draft",
            updatedAt: "25 Aug 2026",
        },
    ];

    const domains = 2;
    const credentials = 3;
    const totalTemplates = templates.length;
    const publishedTemplates = templates.filter((item) => item.status === "published").length;
    const draftTemplates = templates.filter((item) => item.status === "draft").length;

    const publishedPercentage =
        totalTemplates > 0
            ? Math.round(
                (publishedTemplates / totalTemplates) * 100
            )
            : 0;

    const draftPercentage =
        totalTemplates > 0
            ? Math.round(
                (draftTemplates / totalTemplates) * 100
            )
            : 0;

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,

                token: {
                    colorPrimary: PRIMARY_COLOR,

                    colorBgBase: isDark
                        ? "#081521"
                        : "#F5F7FA",

                    colorBgLayout: isDark
                        ? "#081521"
                        : "#F5F7FA",

                    colorBgContainer: isDark
                        ? "#102638"
                        : "#FFFFFF",

                    colorBorder: isDark
                        ? "#203B4D"
                        : "#E5E7EB",

                    borderRadius: 8,
                },
            }}
        >
            <div
                style={{
                    minHeight: "100vh",
                    background: isDark
                        ? "#081521"
                        : "#F5F7FA",
                    padding: 24,
                }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable>
                            <Statistic
                                title="Templates"
                                value={totalTemplates}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: PRIMARY_COLOR, }}
                            />

                            <Text type="secondary" style={{ fontSize: 12, }}>
                                Total templates
                            </Text>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable>
                            <Statistic
                                title="Published"
                                value={publishedTemplates}
                                prefix={<CheckCircleOutlined />}
                                valueStyle={{ color: "#52c41a", }}
                            />

                            <Text type="secondary" style={{ fontSize: 12, }}>Ready templates</Text>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable>
                            <Statistic
                                title="Domains"
                                value={domains}
                                prefix={<GlobalOutlined />}
                                valueStyle={{ color: PRIMARY_COLOR, }}
                            />

                            <Text type="secondary" style={{ fontSize: 12 }}>Project domains</Text>
                        </Card>
                    </Col>

                    <Col xs={24} sm={12} lg={6}>
                        <Card hoverable>
                            <Statistic
                                title="Credentials"
                                value={credentials}
                                prefix={<KeyOutlined />}
                                valueStyle={{ color: PRIMARY_COLOR, }}
                            />

                            <Text type="secondary" style={{ fontSize: 12, }}>Project credentials</Text>
                        </Card>
                    </Col>
                </Row>

                <Row
                    gutter={[16, 16]}
                    style={{ marginTop: 16, }}>

                    <Col xs={24} lg={16}>
                        <Card
                            title={
                                <Space>
                                    <FileTextOutlined style={{ color: PRIMARY_COLOR, }} />
                                    <span>Recent Templates</span>
                                </Space>
                            }
                            extra={
                                <Button type="link" onClick={() => setActiveTab("templates")}>
                                    View All{" "}<ArrowRightOutlined />
                                </Button>
                            }
                        >
                            <Space
                                direction="vertical"
                                size={0}
                                style={{ width: "100%", }}
                            >
                                {templates.map((template, index) => (
                                    <div key={template.id}>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            gap={16}
                                            style={{ padding: "14px 4px", }}
                                        >
                                            <Space align="center" size={12}>
                                                <Flex
                                                    align="center"
                                                    justify="center"
                                                    style={{
                                                        width: 42,
                                                        height: 42,
                                                        borderRadius: 8,
                                                        background: "rgba(32,166,206,0.10)",
                                                    }}
                                                >
                                                    <FileTextOutlined style={{ fontSize: 20, color: PRIMARY_COLOR, }} />
                                                </Flex>

                                                <Space direction="vertical" size={2}>
                                                    <Text strong>
                                                        {template.name}
                                                    </Text>

                                                    <Space size={6}>
                                                        <ClockCircleOutlined />
                                                        <Text type="secondary" style={{ fontSize: 12, }}> Updated{" "}
                                                            {template.updatedAt}
                                                        </Text>
                                                    </Space>
                                                </Space>
                                            </Space>

                                            <Space>
                                                <Tag color={template.status === "published" ? "success" : "warning"}>
                                                    {template.status.toUpperCase()}
                                                </Tag>

                                                <Button type="text"
                                                    icon={<ArrowRightOutlined />}
                                                    onClick={() => setActiveTab("templates")}
                                                />
                                            </Space>
                                        </Flex>
                                        {index < templates.length - 1 && (<Divider style={{ margin: 0, }} />)}
                                    </div>
                                ))}
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card style={{ height: '100%' }}
                            title={
                                <Space><FileTextOutlined style={{ color: PRIMARY_COLOR, }} />
                                    <span>Template Summary</span>
                                </Space>
                            }
                        >
                            <Space direction="vertical" size={20} style={{ width: "100%", }}>
                                <Flex justify="space-between" align="center">
                                    <Space>
                                        <CheckCircleOutlined style={{ color: "#52c41a", }} />
                                        <Text>Published</Text>
                                    </Space>

                                    <Text strong>
                                        {publishedTemplates}
                                    </Text>
                                </Flex>

                                <Progress
                                    percent={publishedPercentage}
                                    strokeColor={PRIMARY_COLOR}
                                    showInfo={false}
                                />

                                <Flex justify="space-between" align="center">
                                    <Space>
                                        <ClockCircleOutlined />
                                        <Text>Drafts</Text>
                                    </Space>
                                    <Text strong>{draftTemplates}</Text>
                                </Flex>
                                <Progress percent={draftPercentage} showInfo={false} />

                                <Divider />

                                <Flex justify="space-between" style={{ fontSize: 14,marginTop: 28,}}>
                                    <Text type="secondary"> Total Templates</Text>
                                    <Text strong>{totalTemplates}</Text>
                                </Flex>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col xs={24} lg={12}>
                        <Card style={{ height: '100%' }}
                            title={
                                <Space>
                                    <SettingOutlined style={{ color: PRIMARY_COLOR, }} />
                                    <span>Project Information</span>
                                </Space>
                            }
                        >
                            <Space direction="vertical" size={18} style={{ width: "100%", }}>
                                <Flex justify="space-between" align="center">
                                    <Text type="secondary">Project Name</Text>
                                    <Text strong>{project.name}</Text>
                                </Flex>

                                <Divider style={{ margin: 0, }} />

                                <Flex justify="space-between" align="center">
                                    <Text type="secondary">Environment</Text>
                                    <Tag color="cyan">
                                        {project.environment.toUpperCase()}
                                    </Tag>
                                </Flex>

                                <Divider style={{ margin: 0, }} />

                                <Flex justify="space-between" align="center">
                                    <Text type="secondary">Created</Text>

                                    <Space size={6}>
                                        <CalendarOutlined />
                                        <Text>{project.createdAt}
                                        </Text>
                                    </Space>
                                </Flex>

                                <Divider style={{ margin: 0, }} />

                                <Flex justify="space-between" align="center">
                                    <Text type="secondary">Status</Text>

                                    <Tag color="success" icon={<CheckCircleOutlined />}>
                                        Active
                                    </Tag>
                                </Flex>
                            </Space>
                        </Card>
                    </Col>

                    <Col xs={24} lg={12}>
                        <Card
                            title={
                                <Space>
                                    <GlobalOutlined style={{ color: PRIMARY_COLOR, }} />
                                    <span>Project Configuration</span>
                                </Space>
                            }
                        >
                            <Row gutter={[12, 12]}>
                                <Col span={12}>
                                    <Card size="small" hoverable onClick={() => setActiveTab("templates")}>
                                        <Space direction="vertical" size={8}>
                                            <FileTextOutlined style={{ fontSize: 22, color: PRIMARY_COLOR, }} />
                                            <Text strong>Templates</Text>
                                            <Text type="secondary" style={{ fontSize: 12, }}>
                                                Manage project templates
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card size="small" hoverable onClick={() => setActiveTab("domains")}>
                                        <Space direction="vertical" size={8}>
                                            <GlobalOutlined style={{ fontSize: 22, color: PRIMARY_COLOR, }} />

                                            <Text strong>Domains</Text>

                                            <Text type="secondary" style={{ fontSize: 12, }}>
                                                Manage project domains
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card size="small" hoverable onClick={() => setActiveTab("credentials")}>
                                        <Space direction="vertical" size={8}>
                                            <KeyOutlined style={{ fontSize: 22, color: PRIMARY_COLOR, }} />
                                            <Text strong>Credentials</Text>

                                            <Text type="secondary" style={{ fontSize: 12, }}>
                                                Manage project credentials
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card size="small" hoverable onClick={() => setActiveTab("integration")}>
                                        <Space direction="vertical" size={8}>
                                            <CodeOutlined style={{ fontSize: 22, color: PRIMARY_COLOR, }} />
                                            <Text strong>Integration</Text>
                                            <Text type="secondary" style={{ fontSize: 12, }}>
                                                View project integration details
                                            </Text>
                                        </Space>
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                <Card style={{ marginTop: 16, }}>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
                        <Space>
                            <CheckCircleOutlined style={{ fontSize: 22, color: "#52c41a", }} />
                            <Space direction="vertical" size={0}>
                                <Text strong>Project is ready</Text>
                                <Text type="secondary">Your project is configured and ready for template management.</Text>
                            </Space>
                        </Space>

                        <Button type="primary" icon={<FileTextOutlined />} onClick={() => navigate("/templates")}>
                            Manage Templates
                        </Button>
                    </Flex>
                </Card>
            </div>
        </ConfigProvider >
    );
}