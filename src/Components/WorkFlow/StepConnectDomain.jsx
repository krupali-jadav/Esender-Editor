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
    CopyOutlined,
} from "@ant-design/icons";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProject, updateProjectDomains } from "./WorkFlowApi";

const { Title, Text, Link } = Typography;

export default function StepConnectDomain({
    onBack,
    onComplete,
    projectId,
}) {
    const theme = useSelector((state) => state?.app?.theme);

    const [domain, setDomain] = useState("");
    const [publicProjectId, setPublicProjectId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(publicProjectId);
        message.success("Copied to clipboard");
    };
    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;

            try {
                console.log("GET PROJECT USING ID:", projectId);

                const data = await getProject(projectId);

                console.log("GET PROJECT RESPONSE:", data);

                if (data?.status) {
                    setPublicProjectId(
                        data?.project?.publicProjectId || ""
                    );
                } else {
                    message.error(
                        data?.message || "Failed to get project"
                    );
                }
            } catch (error) {
                console.error("GET PROJECT ERROR:", error);

                message.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to fetch project details"
                );
            }
        };

        fetchProject();
    }, [projectId]);
    const handleComplete = async () => {
        if (!domain.trim()) {
            message.warning("Please enter a domain");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                allowedDomains: [domain.trim()],
            };

            const data = await updateProjectDomains(projectId, payload);

            if (data?.status) {
                message.success(
                    data?.message || "Domain connected successfully"
                );

                onComplete();
            }
        } catch (error) {
            console.error("DOMAIN UPDATE ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card style={{ width: "100%", borderTop: "3px solid #20A6CE" }}>
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
                message="One-time credentials should be shown before this step."
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
                        {publicProjectId || "Loading..."}
                    </Text>
                </div>

                <Button
                    icon={<CopyOutlined />}
                    onClick={handleCopy}
                >
                    Copy
                </Button>
            </div>

            <Text strong style={{ fontSize: 12 }}>
                ALLOWED DOMAIN
            </Text>

            <Input
                placeholder="localhost:3000"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
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
                        <Text code>*.example.com</Text> for subdomains.
                    </>
                }
                style={{ marginBottom: 20 }}
            />

            <Divider style={{ margin: "0 0 20px" }} />

            <Row justify="space-between" align="middle">
                <Link onClick={onBack}>Back</Link>

                <Space>
                    <Link onClick={onComplete}>
                        Skip for now
                    </Link>

                    <Button
                        type="primary"
                        loading={loading}
                        icon={<CopyOutlined />}
                        onClick={handleComplete}
                    >
                        Complete Setup
                    </Button>
                </Space>
            </Row>
        </Card>
    );
}