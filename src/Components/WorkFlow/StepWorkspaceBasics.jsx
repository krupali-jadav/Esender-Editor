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

const { Title, Text, Link } = Typography;

export default function StepWorkspaceBasics({ onNext }) {
    const [form] = Form.useForm();
    const [useCase, setUseCase] = useState("transactional");
    const [loading, setLoading] = useState(false);

    const useCases = [
        {
            key: "transactional",
            icon: <FileTextOutlined style={{ color: "#20A6CE" }} />,
            title: "Transactional",
            desc: "Receipts, passwords, alerts.",
        },
        {
            key: "marketing",
            icon: <MailOutlined style={{ color: "#20A6CE" }} />,
            title: "Marketing",
            desc: "Newsletters, promos, drips.",
        },
        {
            key: "internal",
            icon: <ToolOutlined style={{ color: "#20A6CE" }} />,
            title: "Internal Tool",
            desc: "System notifications, reports.",
        },
        {
            key: "other",
            icon: <MoreOutlined style={{ color: "#20A6CE" }} />,
            title: "Other",
            desc: "",
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
        <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
                <Text type="secondary">
                    Let&apos;s set up your workspace.
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
                    STEP 1 OF 4
                </Text>

                <Title level={4} style={{ margin: "4px 0 16px" }}>
                    Workspace Basics
                </Title>

                <Divider style={{ margin: "0 0 20px" }} />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSave}
                >
                    <Form.Item
                        label="Workspace / Company Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter workspace/company name",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. Acme Corp" />
                    </Form.Item>

                    <Form.Item
                        label="Working Email Address (Optional)"
                        name="email"
                        rules={[
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                        ]}
                    >
                        <Input placeholder="e.g. example@company.com" />
                    </Form.Item>

                    <Form.Item label="Primary Intended Use">
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
                            Next
                        </Button>
                    </Row>
                </Form>
            </Card>

            <div
                style={{
                    textAlign: "center",
                    marginTop: 16,
                }}
            >
                <Text type="secondary">
                    Need help? <Link>Read the setup guide.</Link>
                </Text>
            </div>
        </>
    );
}