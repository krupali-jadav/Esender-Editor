import React, { useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
    Button,
    Card,
    Col,
    Divider,
    Flex,
    Form,
    Input,
    Radio,
    Row,
    Select,
    Typography,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    FileTextOutlined,
    RocketOutlined,
    SafetyOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import { createEditorApiKey } from "./ProjectsApi";

const { Title, Text } = Typography;

function CreateEditorKey() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const environment = Form.useWatch("environment", form);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                name: values.name,
                environment: values.environment,
                expiresInDays: values.expiresInDays,
            };

            const response = await createEditorApiKey(
                projectId,
                payload
            );

            if (response?.status) {
                message.success(
                    t("editor.key.created", {
                        defaultValue: "Editor API key created successfully",
                    })
                );

                navigate(`/projects/${projectId}/credentials`);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageContainer title={false}>
            <Card>
                <div style={{ maxWidth: 900, margin: "0 auto" }}>
                    <Text type="secondary">
                        {t("credentials", {
                            defaultValue: "PROJECT CREDENTIALS",
                        })}
                    </Text>

                    <Title level={2} style={{ marginTop: 8 }}>
                        {t("create.editor.key", {
                            defaultValue: "Create Editor API Key",
                        })}
                    </Title>

                    <Text type="secondary">
                        {t("create.editor.key.description", {
                            defaultValue:
                                "Create an API key to authenticate your Editor integration.",
                        })}
                    </Text>

                    <Divider />

                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            environment: "test",
                            expiresInDays: 365,
                        }}
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label={t("key.name", {
                                defaultValue: "KEY NAME",
                            })}
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: t("key.name.required", {
                                        defaultValue:
                                            "Please enter a key name",
                                    }),
                                },
                            ]}
                        >
                            <Input
                                size="large"
                                prefix={<FileTextOutlined />}
                                placeholder={t("key.name.placeholder", {
                                    defaultValue:
                                        "e.g., Website Widget",
                                })}
                            />
                        </Form.Item>

                        <Form.Item
                            label={t("environment", {
                                defaultValue: "ENVIRONMENT",
                            })}
                            name="environment"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select an environment",
                                },
                            ]}
                        >
                            <Radio.Group style={{ width: "100%" }}>
                                <Row gutter={[16, 16]}>
                                    <Col xs={24} md={12}>
                                        <Card
                                            size="small"
                                            hoverable
                                            onClick={() =>
                                                form.setFieldValue(
                                                    "environment",
                                                    "test"
                                                )
                                            }
                                            style={{
                                                height: "100%",
                                                border:
                                                    environment === "test"
                                                        ? "2px solid #1677ff"
                                                        : undefined,
                                            }}
                                        >
                                            <Flex
                                                justify="space-between"
                                                align="start"
                                            >
                                                <Flex gap={12}>
                                                    <FileTextOutlined
                                                        style={{
                                                            fontSize: 18,
                                                        }}
                                                    />

                                                    <div>
                                                        <Text strong>
                                                            {t("test", {
                                                                defaultValue:
                                                                    "Test",
                                                            })}
                                                        </Text>

                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            <Text type="secondary">
                                                                {t(
                                                                    "test.environment.description",
                                                                    {
                                                                        defaultValue:
                                                                            "Use this key for testing and development.",
                                                                    }
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Flex>

                                                <Radio value="test" />
                                            </Flex>
                                        </Card>
                                    </Col>

                                    <Col xs={24} md={12}>
                                        <Card
                                            size="small"
                                            hoverable
                                            onClick={() =>
                                                form.setFieldValue(
                                                    "environment",
                                                    "live"
                                                )
                                            }
                                            style={{
                                                height: "100%",
                                                border:
                                                    environment === "live"
                                                        ? "2px solid #1677ff"
                                                        : undefined,
                                            }}
                                        >
                                            <Flex
                                                justify="space-between"
                                                align="start"
                                            >
                                                <Flex gap={12}>
                                                    <RocketOutlined
                                                        style={{
                                                            fontSize: 18,
                                                        }}
                                                    />

                                                    <div>
                                                        <Text strong>
                                                            {t("live", {
                                                                defaultValue:
                                                                    "Live",
                                                            })}
                                                        </Text>

                                                        <div
                                                            style={{
                                                                marginTop: 8,
                                                            }}
                                                        >
                                                            <Text type="secondary">
                                                                {t(
                                                                    "live.environment.description",
                                                                    {
                                                                        defaultValue:
                                                                            "Use this key for your production environment.",
                                                                    }
                                                                )}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </Flex>

                                                <Radio value="live" />
                                            </Flex>
                                        </Card>
                                    </Col>
                                </Row>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label={t("expiration", {
                                defaultValue: "EXPIRATION",
                            })}
                            name="expiresInDays"
                            rules={[
                                {
                                    required: true,
                                    message:
                                        "Please select an expiration period",
                                },
                            ]}
                        >
                            <Select
                                size="large"
                                options={[
                                    {
                                        value: 30,
                                        label: "30 Days",
                                    },
                                    {
                                        value: 90,
                                        label: "90 Days",
                                    },
                                    {
                                        value: 180,
                                        label: "180 Days",
                                    },
                                    {
                                        value: 365,
                                        label: "1 Year",
                                    },
                                    {
                                        value: 730,
                                        label: "2 Years",
                                    },
                                ]}
                            />
                        </Form.Item>

                        <Card
                            size="small"
                            style={{ marginTop: 24 }}
                        >
                            <Flex gap={12} align="start">
                                <SafetyOutlined
                                    style={{ fontSize: 18 }}
                                />

                                <div>
                                    <Text strong>
                                        {t("api.key.security", {
                                            defaultValue:
                                                "Keep your API key secure",
                                        })}
                                    </Text>

                                    <div style={{ marginTop: 4 }}>
                                        <Text type="secondary">
                                            {t(
                                                "api.key.security.description",
                                                {
                                                    defaultValue:
                                                        "Do not expose your API key in public repositories or client-side code.",
                                                }
                                            )}
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </Card>

                        <Divider />

                        <Flex
                            justify="space-between"
                            align="center"
                            wrap="wrap"
                            gap={16}
                        >
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() =>
                                    navigate(
                                        `/projects/${projectId}/credentials`
                                    )
                                }
                            >
                                {t("back", {
                                    defaultValue: "Back",
                                })}
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<CheckOutlined />}
                            >
                                {t("create", {
                                    defaultValue: "Create Editor Key",
                                })}
                            </Button>
                        </Flex>

                        <Flex
                            justify="center"
                            style={{ marginTop: 24 }}
                        >
                            <Text type="secondary">
                                <SafetyOutlined />{" "}
                                {t("data.secure", {
                                    defaultValue:
                                        "Your data is secure and encrypted.",
                                })}
                            </Text>
                        </Flex>
                    </Form>
                </div>
            </Card>
        </PageContainer>
    );
}

export default CreateEditorKey;