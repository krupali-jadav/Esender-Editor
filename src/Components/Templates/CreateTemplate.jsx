import { PageContainer } from "@ant-design/pro-components";
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Space,
    Typography,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Package from "esender-email-editor";
import AppPageHeader from "../Styles/AppHeader";
import { useSelector } from "react-redux";

const { Text } = Typography;

function CreateTemplates() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [form] = Form.useForm();
    const theme = useSelector((state) => state?.app?.theme);

    const handleSubmit = (values) => {
        const html = editorRef.current?.getHtml?.();
        const text = values.text?.trim();

        const hasHtml =
            html &&
            html.replace(/<[^>]*>/g, "").trim().length > 0;

        if (!hasHtml && !text) {
            message.warning(
                "Add email content or a plain text version before saving."
            );
            return;
        }

        // UI only
        console.log("Template values:", {
            name: values.templateName,
            subject: values.subject,
            text,
            html,
        });

        message.success("Template saved successfully");
    };

    return (
        <PageContainer title={false} breadcrumb={false}>
            <Flex justify="space-between" align="center" >
                {/* Header */}
                <AppPageHeader
                    title="Create Template"
                    description="Create and design your email template."
                />
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/templates")}
                >
                    Back to Templates
                </Button>
            </Flex>

            <Space
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
            >
                {/* Template Details */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <div
                        style={{
                            background: theme ? "#0F2233" : "#fff",
                            borderRadius: 10,
                            padding: 20,
                        }}
                    >
                        <Row gutter={16} align="bottom">
                            <Col xs={24} md={11}>
                                <Form.Item
                                    label="Template Name"
                                    name="templateName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter template name",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter template name" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={11}>
                                <Form.Item
                                    label="Subject"
                                    name="subject"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                "Please enter subject",
                                        },
                                    ]}
                                >
                                    <Input placeholder="Enter subject" />
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={2}>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                    >
                                        Create
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={
                                <>
                                    Plain text version{" "}
                                    <Text type="secondary">
                                        (Optional)
                                    </Text>
                                </>
                            }
                            name="text"
                            tooltip="Fallback text shown by clients that cannot render HTML."
                            style={{ marginBottom: 0 }}
                        >
                            <Input.TextArea
                                rows={3}
                                placeholder="Enter a plain text version of your email"
                            />
                        </Form.Item>
                    </div>
                </Form>

                {/* Email Editor */}
                <div
                    style={{
                        background: theme ? "#0F2233" : "#fff",
                        borderRadius: 10,
                        minHeight: 600,
                        overflow: "hidden",
                    }}
                >
                    <Package
                        ref={editorRef}
                        apiKey="eed_live_9a24888b38c2ac94f5f55a37ff190d8752e2ced121449e7c"
                    />
                </div>
            </Space>
        </PageContainer>
    );
}

export default CreateTemplates;