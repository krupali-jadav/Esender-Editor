import { useState } from "react";
import { Button, Card, Col, Divider, Flex, Form, Input, Modal, Radio, Row, Select, Space, Typography, message, } from "antd";
import { FileTextOutlined, RocketOutlined, SafetyOutlined, } from "@ant-design/icons";
import { t } from "i18next";
import { createEditorApiKey } from "./ProjectsApi";
const { Text } = Typography;

function CreateEditorKey({ open, onClose, projectId, onSuccess, }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [environment, setEnvironment] = useState("test");

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const payload = {
                name: values.name,
                environment: environment,
                expiresInDays: values.expiresInDays,
            };

            const response = await createEditorApiKey(
                projectId,
                payload
            );

            if (response?.status) {
                message.success(response?.message || t("editor.key.created", { defaultValue: "Editor API key created successfully", }));
                form.resetFields();
                onClose();
                onSuccess?.();
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message || "Failed to create Editor API key");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            width={700}
            centered
            title={t("create.editor.key", { defaultValue: "Create Editor API Key", })}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel", })}
                </Button>,

                <Button key="create" type="primary" loading={loading} onClick={() => form.submit()}>
                    {t("create", { defaultValue: "Create Editor Key", })}
                </Button>,
            ]}
        >
            <Text type="secondary">
                {t("create.editor.key.description", { defaultValue: "Create an API key to authenticate your Editor integrations.", })}
            </Text>

            <Divider />

            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label={t("key.name", { defaultValue: "Key Name", })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: t("key.name.required", { defaultValue: "Please enter a key name", }),
                        },
                    ]}
                >
                    <Input
                        size="middle"
                        prefix={<FileTextOutlined />}
                        placeholder={t("key.name.placeholder", { defaultValue: "e.g., Website Widget", })}
                    />
                </Form.Item>

                <Form.Item
                    label={t("environment", { defaultValue: "Environment", })}
                    name="environment"
                    rules={[
                        {
                            required: true,
                            message: t("environment.required", { defaultValue: "Please select an environment", }),
                        },
                    ]}
                >
                    <Radio.Group
                        value={environment}
                        onChange={(e) => {
                            setEnvironment(e.target.value);
                            form.setFieldValue("environment", e.target.value);
                        }}
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} md={12}>
                                <Card
                                    size="small"
                                    hoverable
                                    onClick={() => {
                                        setEnvironment("test");
                                        form.setFieldValue("environment", "test");
                                    }}
                                    style={{ height: "100%", border: environment === "test" ? "2px solid #1677ff" : undefined, }}
                                >
                                    <Flex justify="space-between" align="start">
                                        <Flex gap={12}>
                                            <FileTextOutlined style={{ fontSize: 18, }} />

                                            <Space direction="vertical" size="small">
                                                <Text strong>
                                                    {t("test", { defaultValue: "Test", })}
                                                </Text>

                                                <Text type="secondary">
                                                    {t("test.environment.description", { defaultValue: "Use this key for testing and development.", })}
                                                </Text>
                                            </Space>
                                        </Flex>

                                        <Radio value="test" />
                                    </Flex>
                                </Card>
                            </Col>

                            <Col xs={24} md={12}>
                                <Card
                                    size="small"
                                    hoverable
                                    onClick={() => {
                                        setEnvironment("live");
                                        form.setFieldValue("environment", "live");
                                    }}
                                    style={{ height: "100%", border: environment === "live" ? "2px solid #1677ff" : undefined, }}>
                                    <Flex justify="space-between" align="start">
                                        <Flex gap={12}>
                                            <RocketOutlined style={{ fontSize: 18, }} />

                                            <Space direction="vertical" size="small">
                                                <Text strong>
                                                    {t("live", { defaultValue: "Live", })}
                                                </Text>

                                                <Text type="secondary">
                                                    {t("live.environment.description", { defaultValue: "Use this key for your production environment.", })}
                                                </Text>
                                            </Space>
                                        </Flex>

                                        <Radio value="live" />
                                    </Flex>
                                </Card>
                            </Col>
                        </Row>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label={t("expiration", { defaultValue: "Expiration", })}
                    name="expiresInDays"
                    rules={[
                        {
                            required: true,
                            message: t("expiration.required", { defaultValue: "Please select an expiration period", }),
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

                <Card size="small" style={{ marginTop: 24 }}>
                    <Flex gap={12} align="start">
                        <SafetyOutlined style={{ fontSize: 18 }} />

                        <div>
                            <Text strong>
                                {t("api.key.security", { defaultValue: "Keep your API key secure", })}
                            </Text>

                            <div style={{ marginTop: 4 }}>
                                <Text type="secondary">
                                    {t("api.key.security.description", { defaultValue: "Do not expose your API key in public repositories or client-side code.", })}
                                </Text>
                            </div>
                        </div>
                    </Flex>
                </Card>

                <Divider />

                <Flex justify="center">
                    <Text type="secondary">
                        <SafetyOutlined />{" "}
                        {t("data.secure", { defaultValue: "Your data is secure and encrypted.", })}
                    </Text>
                </Flex>
            </Form>
        </Modal>
    );
}

export default CreateEditorKey;