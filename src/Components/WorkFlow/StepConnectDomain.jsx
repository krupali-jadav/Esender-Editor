import {
    Card,
    Input,
    Button,
    Typography,
    Space,
    Divider,
    Row,
    Alert,
    message,
} from "antd";

import {
    InfoCircleOutlined,
    ArrowRightOutlined,
    CopyOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Title, Text, Link } = Typography;

export default function StepConnectDomain({
    onNext,
    onBack,
    onSkip,
    publicProjectId = "prj_test_8823",
}) {
    const theme = useSelector((state) => state?.app?.theme);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicProjectId);
        message.success("Copied to clipboard");
    };

    return (
        <Card
            style={{ width: "100%", borderTop: "3px solid #20A6CE" }}
        >
            <Text
                strong
                style={{
                    color: "#20A6CE",
                    fontSize: 12,
                    letterSpacing: 0.5,
                }}
            >
                STEP 3 OF 4
            </Text>

            <Title level={4} style={{ margin: "4px 0" }}>
                Connect your domain
            </Title>

            <Alert
                type="warning"
                showIcon
                message="One-time credentials should be shown before this step. Require the user to copy the license key and signing secret before continuing."
                style={{ marginBottom: 20 }}
            />

            <div
                style={{
                    background: theme ? "#142b42" : "#FAFAFA",
                    borderRadius: 8,
                    padding: "12px 16px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <Text strong style={{ fontSize: 12, display: "block" }}>
                        PUBLIC PROJECT ID
                    </Text>
                    <Text code style={{ background: "transparent" }}>
                        {publicProjectId}
                    </Text>
                </div>

                <Button icon={<CopyOutlined />} onClick={handleCopy}>
                    Copy
                </Button>
            </div>

            <Text strong style={{ fontSize: 12 }}>
                ALLOWED DOMAIN
            </Text>

            <Input
                placeholder="localhost:3000"
                style={{
                    marginTop: 6,
                    marginBottom: 16,
                }}
            />

            <Alert
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                message={
                    <>
                        Wildcards are supported. Use{" "}
                        <Text code>*.example.com</Text> for subdomains, or
                        add a local host during test setup.
                    </>
                }
                style={{ marginBottom: 20 }}
            />

            <div
                style={{
                    // background: "#F5F7FA",
                    borderRadius: 8,
                    padding: "10px 16px",
                    marginBottom: 20,
                    display: "flex",
                    alignItems: "center",
                    gap: 24,
                }}
            >
                <Text
                    strong
                    style={{ color: "#20A6CE", fontSize: 12, minWidth: 40 }}
                >
                    PUT
                </Text>
                <Text code style={{ background: "transparent" }}>
                    /api/projects/:projectId/domains
                </Text>
            </div>

            <Divider style={{ margin: "0 0 20px" }} />

            <Row justify="space-between" align="middle">
                <Link onClick={onBack}>Back</Link>

                <Space>
                    <Link onClick={onSkip}>
                        Skip for now
                    </Link>

                    <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        iconPosition="end"
                        onClick={onNext}
                    >
                        Next
                    </Button>
                </Space>
            </Row>
        </Card>
    );
}