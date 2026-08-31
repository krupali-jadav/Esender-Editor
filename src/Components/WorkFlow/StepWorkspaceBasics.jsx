import { useState } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
    Divider,
    Row,
    Col,
    message,
    Form,
    Space,
} from "antd";
import {
    FileTextOutlined,
    MailOutlined,
    ToolOutlined,
    MoreOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import SelectTile from "./SelectTile";
import { saveProfile } from "../Profile/ProfileApi";
import { t } from "i18next";

const { Title, Text, Link } = Typography;

export default function StepWorkspaceBasics({ onNext }) {
    const [form] = Form.useForm();
    const [useCase, setUseCase] = useState("transactional");
    const [loading, setLoading] = useState(false);

    const useCases = [
        {
            key: "transactional",
            icon: <FileTextOutlined style={{ color: "#20A6CE" }} />,
            title: t('transactional', { defaultValue: 'Transactional' }),
            desc: t('receipts.passwords.alerts', { defaultValue: 'Receipts, passwords, alerts.' }),
        },
        {
            key: "marketing",
            icon: <MailOutlined style={{ color: "#20A6CE" }} />,
            title: t('marketing', { defaultValue: 'Marketing' }),
            desc: t('newsletters.promos.drips', { defaultValue: 'Newsletters, promos, drips.' }),
        },
        {
            key: "internal",
            icon: <ToolOutlined style={{ color: "#20A6CE" }} />,
            title: t('internal', { defaultValue: 'Internal Tool' }),
            desc: t('system.notifications.reports', { defaultValue: 'System notifications, reports.' }),
        },
        {
            key: "other",
            icon: <MoreOutlined style={{ color: "#20A6CE" }} />,
            title: t('other', { defaultValue: 'Other' }),
            desc: t('describe.your.use.case', { defaultValue: 'Describe your use case.' }),
        },
    ];

    const onSave = async (values) => {
        try {
            setLoading(true);

            const payload = {
                name: values.name,
                email: values.email,
                useCase,
            };
            const data = await saveProfile(payload);

            if (data?.status) {
                message.success(
                    data?.message || "Profile saved successfully"
                );
                onNext();
            } else {
                message.error(
                    data?.message || "Failed to save profile"
                );
            }
        } catch (error) {
            message.error(
                error?.response?.data?.message ||
                "Failed to save profile"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div style={{ textAlign: "center",}}>
                <Text type="secondary">
                    {t('let.s.set.up.your.workspace', { defaultValue: "Let's set up your workspace." })}
                </Text>
            </div>

            <Card
                style={{
                    width: "100%",
                    borderTop: "3px solid #20A6CE",
                }}
                styles={{ body: { padding: 24 } }}
            >
                <Text
                    strong
                    style={{
                        color: "#20A6CE",
                        fontSize: 12,
                        letterSpacing: 0.5, 
                    }}
                >
                    {t('step.1.of.4', { defaultValue: 'STEP 1 OF 4' })}
                </Text>

                <Title level={4} style={{ margin: "4px 0 16px" }}>
                    {t('workspace.basics', { defaultValue: 'Workspace Basics' })}
                </Title>

                <Divider style={{ margin: "0 0 20px" }} />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSave}
                >
                    <Form.Item
                        label={t('workspace.company.name', { defaultValue: 'Workspace / Company Name' })}
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: t('please.enter.workspace.company.name', { defaultValue: 'Please enter workspace/company name' }),
                            },
                        ]}
                    >
                        <Input placeholder="e.g. Acme Corp" />
                    </Form.Item>

                    <Form.Item
                        label={t('working.email.address', { defaultValue: 'Working Email Address (Optional)' })}
                        name="email"
                        rules={[
                            {
                                type: "email",
                                message: t('please.enter.valid.email', { defaultValue: 'Please enter a valid email' }),
                            },
                        ]}
                    >
                        <Input placeholder="e.g. example@company.com" />
                    </Form.Item>

                    <Form.Item label={t('primary.intended.use', { defaultValue: 'Primary Intended Use' })}>
                        <Row gutter={[12, 12]}>
                            {useCases.map((item) => (
                                <Col xs={24} sm={12} key={item.key}>
                                    <SelectTile
                                        selected={useCase === item.key}
                                        onClick={() =>
                                            setUseCase(item.key)
                                        }
                                        icon={item.icon}
                                        title={item.title}
                                        desc={item.desc}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Form.Item>

                    <Row justify="end">
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
            </Card>

            <div
                style={{
                    textAlign: "center",
                }}
            >
                <Text type="secondary">
                    {t('need.help', { defaultValue: 'Need help?' })} <Link>{t('read.the.setup.guide', { defaultValue: 'Read the setup guide.' })}</Link>
                </Text>
            </div>
        </Space>
    );
}