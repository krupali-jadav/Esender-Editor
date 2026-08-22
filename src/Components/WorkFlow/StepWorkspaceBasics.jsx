import { useState } from "react";
import {
    Card,
    Input,
    Select,
    Button,
    Typography,
    Divider,
    Row,
    Col,
} from "antd";
import {
    FileTextOutlined,
    MailOutlined,
    ToolOutlined,
    MoreOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";
import SelectTile from "./SelectTile";

const { Title, Text, Link } = Typography;

export default function StepWorkspaceBasics({ onNext }) {
    const [useCase, setUseCase] = useState("transactional");

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

    return (
        <>
            <div style={{ textAlign: "center", marginBottom: 24, }}>

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

                <Text strong style={{ fontSize: 13 }}>
                    Workspace / Company Name
                </Text>

                <Input
                    placeholder="e.g. Acme Corp"
                    style={{
                        marginTop: 6,
                        marginBottom: 20,
                    }}
                />

                <Text strong style={{ fontSize: 13 }}>
                    Primary Intended Use
                </Text>

                <Row
                    gutter={[12, 12]}
                    style={{
                        marginTop: 8,
                        marginBottom: 20,
                    }}
                >
                    {useCases.map((item) => (
                        <Col xs={24} sm={12} key={item.key}>
                            <SelectTile
                                selected={useCase === item.key}
                                onClick={() => setUseCase(item.key)}
                                icon={item.icon}
                                title={item.title}
                                desc={item.desc}
                            />
                        </Col>
                    ))}
                </Row>

                <Text strong style={{ fontSize: 13 }}>
                    Your Role (For tailored guidance)
                </Text>

                <Select
                    placeholder="Select your role..."
                    style={{
                        width: "100%",
                        marginTop: 6,
                        marginBottom: 20,
                    }}
                    options={[
                        { value: "founder", label: "Founder / Owner" },
                        { value: "engineer", label: "Engineer" },
                        { value: "marketer", label: "Marketer" },
                        { value: "other", label: "Other" },
                    ]}
                />

                <Divider style={{ margin: "0 0 20px" }} />

                <Row justify="end">
                    <Button type="primary" onClick={onNext}>
                        Next
                        <ArrowRightOutlined />
                    </Button>
                </Row>
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