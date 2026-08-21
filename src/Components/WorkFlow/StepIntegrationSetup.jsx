import {
    Card,
    Button,
    Typography,
    Divider,
    Row,
    Alert,
} from "antd";

import {
    CopyOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph, Link } = Typography;

const appTsxCode = `import { SignalProvider } from "@signalcanvas/react";

export default function App() {
  return (
    <SignalProvider
      publishableKey="pk_test_a1b2c3d4e5f6g7h8i9j0"
    >
      <YourApp />
    </SignalProvider>
  );
}`;

const serverJsCode = `const crypto = require("crypto");

function signIdentity(userId) {
  return crypto
    .createHmac(
      "sha256",
      process.env.SIGNAL_SECRET_KEY
    )
    .update(userId)
    .digest("hex");
}`;

export default function StepIntegrationSetup({
    onBack,
    onComplete,
}) {
    return (
        <Card
            style={{ width: "100%", borderTop: "3px solid #20A6CE", }}
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
                STEP 4 OF 4
            </Text>

            <Title level={4} style={{ margin: "4px 0" }}>
                Integration Setup
            </Title>

            <Paragraph type="secondary">
                Connect your frontend and backend to complete your
                workspace setup.
            </Paragraph>

            <Divider />

            <Title level={5}>
                Frontend Integration
            </Title>

            <CodeBlock code={appTsxCode} />

            <Title level={5} style={{ marginTop: 20 }}>
                Backend Identity Signing
            </Title>

            <CodeBlock code={serverJsCode} />

            <Alert
                type="success"
                showIcon
                message="Your integration is ready"
                description="Add the integration code to your application and complete the setup."
                style={{ marginTop: 20 }}
            />

            <Divider style={{ margin: "20px 0" }} />

            <Row justify="space-between" align="middle">
                <Link onClick={onBack}>Back</Link>

                <Button
                    type="primary"
                    icon={<CopyOutlined />}
                    onClick={onComplete}
                >
                    Complete Setup
                </Button>
            </Row>
        </Card>
    );
}

function CodeBlock({ code }) {
    return (
        <Card
            size="small"
            styles={{
                body: {
                    padding: 16,
                },
            }}
        >
            <pre
                style={{
                    margin: 0,
                    whiteSpace: "pre-wrap",
                    overflowX: "auto",
                }}
            >
                {code}
            </pre>
        </Card>
    );
}