import {
    Card,
    Input,
    Button,
    Typography,
    Space,
    Divider,
    Row,
    Alert,
} from "antd";

import {
    GlobalOutlined,
    InfoCircleOutlined,
    WarningOutlined,
    ArrowRightOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph, Link } = Typography;

export default function StepConnectDomain({
    onNext,
    onBack,
    onSkip,
}) {
    return (
        <Card
            style={{ width: "100%" }}
            styles={{ body: { padding: 24, borderTop: "3px solid #20A6CE", } }}
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

            <Paragraph type="secondary">
                Link a custom hostname to your Signal Canvas environment.
                This enables custom tracking links and branded editor access.
            </Paragraph>

            <Text strong style={{ fontSize: 12 }}>
                HOSTNAME
            </Text>

            <Input
                prefix={
                    <GlobalOutlined style={{ color: "#98A2B3" }} />
                }
                placeholder="app.example.com"
                style={{
                    marginTop: 6,
                    marginBottom: 16,
                }}
            />

            <Alert
                type="info"
                showIcon
                icon={<InfoCircleOutlined />}
                message="Wildcard Domains Supported"
                description={
                    <>
                        You can use a wildcard, for example{" "}
                        <Text code>*.example.com</Text> to route all
                        subdomains automatically. SSL certificates will be
                        provisioned via Let&apos;s Encrypt.
                    </>
                }
                style={{ marginBottom: 12 }}
            />

            <Alert
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                message="Live Project Requirements"
                description="For production environments, ensure your DNS provider supports CNAME flattening or ALIAS records if mapping a root domain."
                style={{ marginBottom: 20 }}
            />

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
                        Continue
                    </Button>
                </Space>
            </Row>
        </Card>
    );
}