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
import { useSelector } from "react-redux";

const { Title, Text, Paragraph, Link } = Typography;

const appTsxCode = `import { BitBeastEditor } from '@bitbeast/editor-sdk';;

export function Editor({ token }) {
  return (
    <BitBeastEditor
      projectId="prj_test_8823"
      token={token}
    />
  );
}`;

const serverJsCode = `// Keep license key and signing secret on your server.
// Your backend creates the signed request, then calls:
POST /api/v1/editor-sessions`;

export default function StepIntegrationSetup({
    onBack,
    onComplete,
}) {
    return (
        <Card
            style={{ width: "100%", borderTop: "3px solid #20A6CE", }}>
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
                Connect your frontend and backend to complete your workspace setup.
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
    const theme = useSelector((state) => state?.app?.theme);
    return (
        <Card
            size="small"
           style={{
            background: theme ? "#142b42" : "#F5F7FA",
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