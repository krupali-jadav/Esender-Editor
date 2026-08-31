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
import { t } from "i18next";

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
                onNext(data?.project);
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
                {t('step.2.of.4', { defaultValue: 'STEP 2 OF 4' })}
            </Text>

            <Title level={4} style={{ margin: "4px 0" }}>
                {t('create.first.project', { defaultValue: 'Create First Project' })}
            </Title>

            <Paragraph type="secondary">
                {t('let.s.set.up.your.primary.workspace.you.can.always.create.more.projects.later', { defaultValue: "Let's set up your primary workspace. You can always create more projects later." })}
            </Paragraph>

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleCreateProject}
                >
                    <Form.Item
                        label={t('project.name', { defaultValue: 'PROJECT NAME' })}
                        name="projectName"
                        rules={[
                            {
                                required: true,
                                message: t('please.enter.project.name', { defaultValue: 'Please enter project name' }),
                            },
                        ]}
                    >
                        <Input
                            prefix={
                                <FolderOutlined
                                    style={{ color: "#98A2B3" }}
                                />
                            }
                            placeholder={t('e.g.internal.tools.marketing.app', { defaultValue: 'e.g., Internal Tools, Marketing App' })}
                        />
                    </Form.Item>

                    <Space direction="vertical" size="small" style={{ width: "100%" }}>
                        <Text strong style={{ fontSize: 12 }}>
                            {t('initial.environment', { defaultValue: 'INITIAL ENVIRONMENT' })}
                        </Text>

                        <Row
                            gutter={[16, 16]}>
                            <Col xs={24} sm={12}>
                                <EnvironmentCard
                                    selected={env === "test"}
                                    onClick={() => setEnv("test")}
                                    icon={<FileTextOutlined />}
                                    title={t('test', { defaultValue: 'Test' })}
                                    description={t('recommended.for.new.accounts', { defaultValue: 'Recommended for new accounts. Keep experimental data separate from production.' })}
                                    recommended
                                />
                            </Col>

                            <Col xs={24} sm={12}>
                                <EnvironmentCard
                                    selected={env === "live"}
                                    onClick={() => setEnv("live")}
                                    icon={<RocketOutlined />}
                                    title={t('live', { defaultValue: 'Live' })}
                                    description={t('ready.to.go', { defaultValue: 'Ready to go. Data here will affect live users and active integrations immediately.' })}
                                />
                            </Col>

                            <Col xs={24}>
                                <Space direction="vertical" size="small" style={{ width: "100%" }}>
                                    <div
                                        style={{
                                            background: theme
                                                ? "#142b42"
                                                : "#F5F7FA",
                                            borderRadius: 8,
                                            padding: "10px 16px",
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
                                            {t('post', { defaultValue: 'POST' })}
                                        </Text>

                                        <Text code style={{ background: "transparent" }}>
                                            {t('api.projects', { defaultValue: '/api/projects' })}
                                        </Text>
                                    </div>

                                    <div
                                        style={{
                                            background: theme
                                                ? "#142b42"
                                                : "#F5F7FA",
                                            borderRadius: 8,
                                            padding: "10px 16px",
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
                                            {t('returns', { defaultValue: 'RETURNS' })}
                                        </Text>

                                        <Text>
                                            {t('project.id', { defaultValue: 'project id' })}, {t('public.project.id', { defaultValue: 'public project id' })}, {t('license.key', { defaultValue: 'license key' })}, {t('signing.secret', { defaultValue: 'signing secret' })}
                                        </Text>
                                    </div>
                                </Space>
                            </Col>
                        </Row>
                    </Space>

                    <Divider style={{ margin: "20px 0 20px" }} />

                    <Row justify="space-between" align="middle">
                        <Link onClick={onBack}>
                            {t('back', { defaultValue: 'Back' })}
                        </Link>

                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<ArrowRightOutlined />}
                            iconPosition="end"
                        >
                            {t('next', { defaultValue: 'Next' })}
                        </Button>
                    </Row>
                </Form>

                <div
                    style={{
                        textAlign: "center",
                    }}
                >
                    <Text type="secondary">
                        <LockOutlined /> {t('your.data.is.secure.and.encrypted', { defaultValue: 'Your data is secure and encrypted.' })}
                    </Text>
                </div>
            </Space>
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
                    {t('recommended', { defaultValue: 'Recommended' })}
                </Text>
            )}
        </div>
    );
}