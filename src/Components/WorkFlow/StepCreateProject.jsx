import { useState } from "react";
import {
    Card,
    Input,
    Radio,
    Button,
    Typography,
    Space,
    Divider,
    Row,
    Col,
    Form,
    message,
} from "antd";
import {
    FolderOutlined,
    FileTextOutlined,
    RocketOutlined,
    ArrowRightOutlined,
    LockOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { createProject } from "./WorkFlowApi";

const { Title, Text, Paragraph, Link } = Typography;

export default function StepCreateProject({ onNext, onBack }) {
    const [form] = Form.useForm();
    const [env, setEnv] = useState("test");
    const [loading, setLoading] = useState(false);

    const theme = useSelector((state) => state?.app?.theme);

    const handleCreateProject = async (values) => {
        try {
            setLoading(true);

            const payload = {
                name: values.projectName,
                environment: env,
            };
            const data = await createProject(payload);

            if (data?.status) {
                message.success(data.message);
                onNext(data?.project?.id);
            }
        } catch (error) {
            console.log("CREATE PROJECT ERROR:", error);
            message.error("Failed to create project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            style={{
                width: "100%",
                borderTop: "3px solid #20A6CE",
            }}
        >
            <Text
                strong
                style={{
                    color: "#20A6CE",
                    fontSize: 12,
                    letterSpacing: 0.5,
                }}
            >
                STEP 2 OF 4
            </Text>

            <Title level={4} style={{ margin: "4px 0" }}>
                Create First Project
            </Title>

            <Paragraph type="secondary">
                Let&apos;s set up your primary workspace. You can always
                create more projects later.
            </Paragraph>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateProject}
            >
                <Form.Item
                    label="PROJECT NAME"
                    name="projectName"
                    rules={[
                        {
                            required: true,
                            message: "Please enter project name",
                        },
                    ]}
                >
                    <Input
                        prefix={
                            <FolderOutlined
                                style={{ color: "#98A2B3" }}
                            />
                        }
                        placeholder="e.g., Internal Tools, Marketing App"
                    />
                </Form.Item>

                <Text strong style={{ fontSize: 12 }}>
                    INITIAL ENVIRONMENT
                </Text>

                <Row
                    gutter={[16, 16]}
                    style={{
                        marginTop: 8,
                        marginBottom: 24,
                    }}
                >
                    <Col xs={24} sm={12}>
                        <EnvironmentCard
                            selected={env === "test"}
                            onClick={() => setEnv("test")}
                            icon={<FileTextOutlined />}
                            title="Test"
                            description="Recommended for new accounts. Keep experimental data separate from production."
                            recommended
                        />
                    </Col>

                    <Col xs={24} sm={12}>
                        <EnvironmentCard
                            selected={env === "live"}
                            onClick={() => setEnv("live")}
                            icon={<RocketOutlined />}
                            title="Live"
                            description="Ready to go. Data here will affect live users and active integrations immediately."
                        />
                    </Col>

                    <Col xs={24}>
                        <div
                            style={{
                                background: theme
                                    ? "#142b42"
                                    : "#F5F7FA",
                                borderRadius: 8,
                                padding: "10px 16px",
                                marginBottom: 12,
                                display: "flex",
                                alignItems: "center",
                                gap: 24,
                            }}
                        >
                            <Text strong
                                style={{
                                    color: "#20A6CE",
                                    fontSize: 12,
                                    minWidth: 40,
                                }}
                            >
                                POST
                            </Text>

                            <Text code style={{ background: "transparent" }}>
                                /api/projects
                            </Text>
                        </div>

                        <div
                            style={{
                                background: theme
                                    ? "#142b42"
                                    : "#F5F7FA",
                                borderRadius: 8,
                                padding: "10px 16px",
                                marginBottom: 24,
                                display: "flex",
                                alignItems: "center",
                                gap: 24,
                            }}
                        >
                            <Text
                                strong
                                style={{
                                    color: "#20A6CE",
                                    fontSize: 12,
                                    minWidth: 40,
                                }}
                            >
                                RETURNS
                            </Text>

                            <Text>
                                project id, public project id, license key,
                                signing secret
                            </Text>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ margin: "0 0 20px" }} />

                <Row justify="space-between" align="middle">
                    <Link onClick={onBack}>
                        Back
                    </Link>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                    >
                        Next
                    </Button>
                </Row>
            </Form>

            <div
                style={{
                    textAlign: "center",
                    marginTop: 16,
                }}
            >
                <Text type="secondary">
                    <LockOutlined /> Your data is secure and encrypted.
                </Text>
            </div>
        </Card>
    );
}

function EnvironmentCard({
    selected,
    onClick,
    icon,
    title,
    description,
    recommended,
}) {
    const theme = useSelector((state) => state?.app?.theme);

    return (
        <div
            onClick={onClick}
            style={{
                width: "100%",
                minHeight: 150,
                boxSizing: "border-box",
                border: theme
                    ? `1px solid ${selected ? "#142b42" : "#2b313b"}`
                    : `1px solid ${selected ? "#20A6CE" : "#E7E9F0"}`,
                background: theme
                    ? selected
                        ? "#2b313b"
                        : "#142b42"
                    : selected
                        ? "#F4FBFD"
                        : "#FFFFFF",
                borderRadius: 8,
                padding: 16,
                cursor: "pointer",
            }}
        >
            <Row justify="space-between" align="middle">
                <Space>
                    {icon}
                    <Text strong>{title}</Text>
                </Space>

                <Radio checked={selected} />
            </Row>

            <Paragraph
                type="secondary"
                style={{
                    fontSize: 13,
                    margin: "8px 0",
                }}
            >
                {description}
            </Paragraph>

            {recommended && (
                <Text
                    style={{
                        background: "#E6F7FB",
                        color: "#20A6CE",
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                    }}
                >
                    Recommended
                </Text>
            )}
        </div>
    );
}