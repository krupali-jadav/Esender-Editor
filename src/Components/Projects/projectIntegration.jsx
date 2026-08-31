import {
    Alert,
    Avatar,
    Badge,
    Button,
    Card,
    ConfigProvider,
    Descriptions,
    Divider,
    List,
    Row,
    Col,
    Space,
    Steps,
    Tag,
    Typography,
} from "antd";
import {
    ApiOutlined,
    CodeOutlined,
    FileTextOutlined,
    PlayCircleOutlined,
    QuestionCircleOutlined,
    ReadOutlined,
    SettingOutlined,
    WarningOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const resourceItems = [
    { icon: <ReadOutlined />, color: "#6758ff", title: "Documentation", description: "Comprehensive guides and concepts." },
    { icon: <ApiOutlined />, color: "#25b9dd", title: "API Reference", description: "Detailed endpoint specifications." },
    { icon: <FileTextOutlined />, color: "#ff6c62", title: "SDK Changelog", description: "Latest updates and release notes." },
];

const frontendSteps = [
    {
        title: "Install SDK",
        description: <Text code>npm install @bitbeast/editor-sdk</Text>,
    },
    {
        title: "Mount Editor",
        description: (
            <Text code style={{ whiteSpace: "pre-wrap", display: "block", width: 320 }}>
                {`import { BitBeastEditor } from '@bitbeast/editor-sdk' return (<BitBeastEditorprojectId={'prj_live_8823'}token={token}/>)`}
            </Text>
        ),
    },
];

const backendSteps = [
    {
        title: "Generate Token",
        description: (
            <>
                <Paragraph type="secondary" >
                    Sign requests using your one-time secret.
                </Paragraph>
                <Text code style={{ whiteSpace: "pre-wrap", display: "block", width: 400 }}>
                    {`const mac = crypto.createHmac('sha256', secret).update(payload)return mac.digest('hex')`}
                </Text>
            </>
        ),
    },
];

function ProjectIntegration() {
    return (
        <ConfigProvider theme={{ token: { colorPrimary: "#6758ff", borderRadius: 8 } }}>
            <div style={{ /* background: "#f5f7fb", */ minHeight: "100vh", padding: 24 }}>
                <Row gutter={[16, 16]} style={{ maxWidth: 1700, margin: "0 auto" }}>

                    <Col xs={24} lg={16}>
                        <Card
                            title="Quick Start Guide"
                            extra={<Text type="secondary">Integrate the SDK in three steps</Text>}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Space size="small" style={{ marginBottom: 12 }}>
                                        <CodeOutlined style={{ color: "#6758ff" }} />
                                        <Text strong>Frontend Integration</Text>
                                    </Space>
                                    <Steps direction="vertical" size="small" current={-1} items={frontendSteps} />
                                </Col>

                                <Col xs={24} md={12}>
                                    <Space size="small" style={{ marginBottom: 12 }}>
                                        <SettingOutlined style={{ color: "#159db7" }} />
                                        <Text strong>Backend Signing</Text>
                                    </Space>
                                    <Steps direction="vertical" size="small" current={-1} initial={2} items={backendSteps} />
                                    <Alert
                                        type="error"
                                        showIcon
                                        icon={<WarningOutlined />}
                                        message="Security Warning"
                                        description="Never expose your signing secret in frontend code."
                                        style={{ marginTop: 16 }}
                                    />
                                </Col>
                            </Row>
                        </Card>

                        <Card style={{ marginTop: 16 }} title="Connection Status"
                            extra={
                                <Button type="primary" icon={<PlayCircleOutlined />}>
                                    Run Test
                                </Button>
                            }
                        >
                            <Text type="secondary">
                                Verify your integration is correctly communicating with BitBeast.
                            </Text>
                            <Divider style={{ margin: "12px 0" }} />
                            <Descriptions column={3} size="small">
                                <Descriptions.Item label="Current Status">
                                    <Badge status="processing" text="Awaiting connection..." />
                                </Descriptions.Item>
                                <Descriptions.Item label="Project ID">
                                    <Text code>prj_live_8823</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Ping">
                                    <Tag>-- ms</Tag>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Card title="Developer Resources">
                            <List
                                itemLayout="horizontal"
                                dataSource={resourceItems}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={item.icon} style={{ backgroundColor: item.color }} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>

                        <Card style={{ marginTop: 16, backgroundColor: '#e9e7f7' }}>
                            <Space>
                                <QuestionCircleOutlined style={{ color: "#6758ff" }} />
                                <Text strong style={{ color: "#000" }}>Need Help?</Text>
                            </Space>
                            <Paragraph type="secondary" style={{ marginTop: 8 }}>
                                Our developer success team is available to assist with complex integration scenarios.
                            </Paragraph>
                            <Button block>Contact Support</Button>
                        </Card>
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    );
}

export default ProjectIntegration;  