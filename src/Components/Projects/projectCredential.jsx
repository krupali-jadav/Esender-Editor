import { Alert, Button, Card, Flex, Popconfirm, Space, Tag, Typography, message, } from 'antd'
import { SafetyCertificateOutlined, ReloadOutlined, } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCredentials, rotateLicense, rotateSecrets } from './ProjectsApi';
import { t } from 'i18next';

const { Text, Title } = Typography

function ProjectCredential() {
    const [credentials, setCredentials] = useState(null);
    const [credentialsLoading, setCredentialsLoading] = useState(false);
    const selectedProject = useSelector((state) => state?.app?.selectedProject);

    const fetchCredentials = async () => {
        if (!selectedProject?._id) return;

        try {
            setCredentialsLoading(true);

            const response = await getCredentials(selectedProject._id);

            if (response?.status) {
                setCredentials(response?.credentials);
                message.success(response?.message);
            } else {
                setCredentials();
            }
        } catch (error) {
            console.error( error);
            setCredentials(null);
        } finally {
            setCredentialsLoading(false);
        }
    };
    useEffect(() => {
        fetchCredentials();
    }, [selectedProject?._id]);
    const handleRotateLicense = async () => {
        if (!selectedProject?._id) return;

        try {
            const response = await rotateLicense(selectedProject._id);

            if (response?.status) {
                setCredentials((prev) => ({
                    ...prev,
                    ...response.credentials,
                }));

                message.success(response.message);
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message);
        }   
    };
    const handleRotateSecret = async () => {
        if (!selectedProject?._id) return;

        try {
            const response = await rotateSecrets(selectedProject._id);

            if (response?.status) {
                setCredentials((prev) => ({
                    ...prev,
                    ...response.credentials,
                }));

                message.success(response.message);
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message);
        }
    };

    return (
        <>
            <div style={{ padding: 24, width: '100%' }}>
                <Space direction="vertical" size="large" style={{ width: '100%', }}>

                    <Alert
                        type="info"
                        showIcon
                        icon={<SafetyCertificateOutlined />}
                        message="One-Time Reveal Policy"
                        description={
                            <Text type="secondary">
                                {t("one.time.reveal.policy", {
                                    defaultValue:
                                        "For your security, secret keys are only displayed once upon creation or rotation. If lost, you must rotate the key to generate a new one. We do not store plain-text keys.",
                                })}
                            </Text>
                        }
                    />

                    <Card
                        loading={credentialsLoading}
                        title={
                            <Space direction="vertical" size={0}>
                                <Title level={5} style={{ margin: 0 }}>{t("api.keys", { defaultValue: "API Keys" })}</Title>
                                <Text type="secondary">
                                    {t("manage.api.keys", { defaultValue: "Manage your project's API keys for authentication." })}
                                </Text>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%', }}>
                            <Card size="small" loading={credentialsLoading}>
                                <Text type="secondary">{t("public.project.id", { defaultValue: "Public Project ID:" })}{" "}
                                    <Flex justify="space-between" align="center">
                                        <Text code>
                                            {credentials?.publicProjectId || "N/A"}
                                        </Text>
                                        <Text copyable={{ text: credentials?.publicProjectId || "", }} />
                                    </Flex>
                                </Text>
                            </Card>

                            {/* License Key */}
                            <Card size="small" loading={credentialsLoading} >
                                <Text type="secondary">{t("license.key", { defaultValue: "License Key:" })}{" "}</Text>
                                <Flex justify="space-between" align="center">
                                    <Text code>
                                        {credentials?.licenseKeyPrefix || "N/A"}
                                    </Text>
                                    <Flex gap="middle" align="center">
                                        <Button icon={<ReloadOutlined />} onClick={handleRotateLicense}>
                                            {t("rotate.license", { defaultValue: "Rotate License" })}
                                        </Button>
                                        <Text copyable={{ text: credentials?.licenseKeyPrefix || "", }} />
                                    </Flex>
                                </Flex>
                            </Card>
                        </Space>
                    </Card>

                    {/* Signing Secrets */}
                    <Card
                        title={
                            <Space direction="vertical" size={0}>
                                <Title level={5} style={{ margin: 0 }}>
                                    {t("signing.secrets", { defaultValue: "Signing Secrets" })}
                                </Title>

                                <Text type="secondary">
                                    {t("used.to.verify.webhook.payloads", {
                                        defaultValue:
                                            "Used to cryptographically verify webhook payloads sent to your endpoints.",
                                    })}
                                </Text>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%', }}>

                            <Card size="small">
                                <Flex vertical gap="small">
                                    <Space size="small">
                                        <Text type="secondary">
                                            {t("primary.secret", { defaultValue: "Primary Secret", })}
                                        </Text>

                                        <Tag color="blue">
                                            {credentials?.signingSecretVersion || "N/A"}
                                        </Tag>
                                    </Space>

                                    <Flex justify="space-between" align="center" gap="large" style={{ width: "100%" }}>
                                        <Text code style={{ flex: 1 }}>
                                            {credentials?.Secrets || "N/A"}
                                        </Text>

                                        <Space size="middle">
                                            <Button
                                                icon={<ReloadOutlined />}
                                                onClick={handleRotateSecret}
                                            >
                                                {t("rotate.license", {
                                                    defaultValue: "Rotate License",
                                                })}
                                            </Button>
                                            <Text copyable={{ text: credentials?.Secrets || "", }}
                                            />
                                        </Space>
                                    </Flex>
                                </Flex>
                            </Card>

                            {/* Rotate Signing Secret */}
                            <Alert type="error" title="Rotate Signing Secret"
                                description={
                                    <Text>
                                        {t("rotating.will.instantiate.current.secret.warning.any.webhooks.sent.with.old.signature.will.fail.verification.until.your.backend.is.updated", {
                                            defaultValue:
                                                "Rotating will immediately invalidate the current secret. Warning: any webhooks sent with the old signature will fail verification until your backend is updated.",
                                        })}
                                    </Text>
                                }
                                action={
                                    <Popconfirm
                                        title={t("rotate.signing.secret", { defaultValue: "Rotate Signing Secret?" })}
                                        description={t("current.signing.secret.will.be.invalidated.immediately", { defaultValue: "The current signing secret will be invalidated immediately." })}
                                        okText={t("rotate", { defaultValue: "Rotate" })}
                                        cancelText={t("cancel", { defaultValue: "Cancel" })}
                                        okButtonProps={{
                                            danger: true,
                                        }}
                                        onConfirm={handleRotateSecret}
                                    >
                                        <Button
                                            danger
                                            type="primary"
                                            icon={<ReloadOutlined />}
                                        >
                                            {t("confirm.and.rotate.secret", { defaultValue: "Confirm & Rotate Secret" })}
                                        </Button>
                                    </Popconfirm>
                                }
                            />
                        </Space>
                    </Card>
                </Space>
            </div >
        </>
    )
}
export default ProjectCredential