import { PageContainer } from "@ant-design/pro-components";
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Space,
    Spin,
    Typography,
    message,
} from "antd";
import {
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Package from "esender-email-editor";
import AppPageHeader from "../Styles/AppHeader";
import { useSelector } from "react-redux";
import { createTemplate, getTemplateById, updateTemplate } from "./TemplateApi";
const { Text } = Typography;

function CreateTemplates() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [templateData, setTemplateData] = useState(null);
    const { templateId } = useParams();
    const [editorLoading, setEditorLoading] = useState(!!templateId);
    const theme = useSelector((state) => state?.app?.theme);
    const selectedProject = useSelector(
        (state) => state?.app?.selectedProject
    );

    const projectId = selectedProject?._id;

    const fetchTemplate = async () => {
        try {
            setEditorLoading(true);

            const data = await getTemplateById(templateId);

            if (data?.status) {
                setTemplateData(data.template);
            } else {
                message.error(data?.message || "Failed to load template");
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message || "Failed to load template");
        } finally {
            setEditorLoading(false);
        }
    };

    useEffect(() => {
        if (templateId) {
            fetchTemplate();
        }
    }, [templateId]);

    useEffect(() => {
        if (!templateData) return;

        form.setFieldsValue({
            templateName: templateData.name,
            subject: templateData.subject || "",
            text: templateData.text || "",

        });
    }, [templateData, form]);

    useEffect(() => {
        if (!templateData?.JSON) return;
        if (!editorRef.current?.loadJson) return;

        const timer = setTimeout(() => {
            try {
                const json =
                    typeof templateData.JSON === "string"
                        ? JSON.parse(templateData.JSON)
                        : templateData.JSON;

                editorRef.current.loadJson(json, false);

            } catch (error) {
                console.error(error);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [templateData]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            const html = editorRef.current?.getHtml?.()?.trim() || "";
            const text = values.text?.trim() || "";
            const hasHtmlContent = html && html.replace(/<[^>]*>/g, "").trim().length > 0;

            if (!hasHtmlContent && !text) {
                message.warning("Add email content or a plain text version before saving.");
                return;
            }

            const json = editorRef.current?.getJson?.() || {
                body: { rows: [], },
            };

            const payload = {
                name: values.templateName,
                subject: values.subject,
                HTML: html,
                text: text,
                JSON: json,
            };

            let data;

            // edit
            if (templateId) {
                data = await updateTemplate({
                    id: templateId,
                    ...payload,
                });
            }

            // create
            else {
                data = await createTemplate({
                    projectId: projectId,
                    ...payload,
                });
            }

            if (data?.status) {
                message.success(data?.message || (templateId ? "Template updated successfully" : "Template created successfully"));
                form.resetFields();
                navigate("/templates");
            } else {
                message.error(data?.message || (templateId ? "Failed to update template" : "Failed to create template"));
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message || (templateId ? "Failed to update template" : "Failed to create template"));
        } finally {
            setLoading(false);
        }
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

            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                {/* Template Details */}
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <div style={{ background: theme ? "#0F2233" : "#fff", borderRadius: 10, padding: 20, }}>
                        <Row gutter={16} align="bottom">
                            <Col xs={24} md={11}>
                                <Form.Item
                                    label="Template Name"
                                    name="templateName"
                                    rules={[
                                        {
                                            required: true,
                                            message: "Please enter template name",
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
                                            message: "Please enter subject",
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
                                        loading={loading}
                                        block
                                    >
                                        {templateId ? "Save" : "Create"}
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label={<>Plain text version{" "}<Text type="secondary">(Optional)</Text></>}
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
                <div style={{ background: theme ? "#0F2233" : "#fff", borderRadius: 10, minHeight: 600, overflow: "hidden", }}>
                    <Spin spinning={editorLoading}>
                        <Package
                            ref={editorRef}
                            apiKey="eed_live_9a24888b38c2ac94f5f55a37ff190d8752e2ced121449e7c"
                        />
                    </Spin>
                </div>
            </Space>
        </PageContainer>
    );
}

export default CreateTemplates;