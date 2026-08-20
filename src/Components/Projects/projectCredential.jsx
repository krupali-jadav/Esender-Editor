import React from 'react'
import {
    Alert,
    Button,
    Card,
    Flex,
    Popconfirm,
    Space,
    Tag,
    Typography,
    message,
} from 'antd'

import {
    SafetyCertificateOutlined,
    CopyOutlined,
    ReloadOutlined,
} from '@ant-design/icons'

const { Text, Title } = Typography

function projectCredential() {
    const [messageApi, contextHolder] = message.useMessage()

    const handleCopy = async (value, label) => {
        try {
            await navigator.clipboard.writeText(value)
            messageApi.success(`${label} copied`)
        } catch (error) {
            messageApi.error(`Unable to copy ${label}`)
        }
    }

    const handleRotateLicense = () => {
        console.log('Rotate License')
    }

    const handleRotateSecret = () => {
        console.log('Rotate Signing Secret')
    }

    return (
        <>
            <div style={{ padding: 24, background: '#fafafa', width: '100%' }}>
                {contextHolder}
                <Space direction="vertical" size="large" style={{ width: '100%', }}>

                    <Alert
                        type="info"
                        showIcon
                        icon={<SafetyCertificateOutlined />}
                        message="One-Time Reveal Policy"
                        description={
                            <Text type="secondary">
                                For your security, secret keys are only displayed once upon creation or rotation. If lost, you must rotate the key to generate a new one. We do not store plain-text keys.
                            </Text>
                        }
                    />

                    <Card
                        title={
                            <Space direction="vertical" size={0} style={{ padding: "15px 0" }}>
                                <Title level={5}>API Keys</Title>
                                <Text type="secondary">
                                    Manage your project's API keys for authentication.
                                </Text>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="middle" style={{ width: '100%', }}>
                            <Card size="small">
                                <Flex justify="space-between" align="center" gap="middle">
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">
                                            Public Project ID
                                        </Text>

                                        <Text code>
                                            prj_live_8823
                                        </Text>
                                    </Space>

                                    <Button
                                        icon={<CopyOutlined />}
                                        onClick={() =>
                                            handleCopy(
                                                'prj_live_8823',
                                                'Public Project ID'
                                            )
                                        }
                                    >
                                        Copy
                                    </Button>
                                </Flex>
                            </Card>

                            {/* License Key */}
                            <Card size="small">
                                <Flex justify="space-between" align="center" gap="middle">
                                    <Space direction="vertical" size={0}>
                                        <Text type="secondary">
                                            License Key
                                        </Text>

                                        <Text code>
                                            bb_live_••••••••••••••••••••••••abcd
                                        </Text>
                                    </Space>

                                    <Space>
                                        <Button icon={<ReloadOutlined />} onClick={handleRotateLicense}>
                                            Rotate License
                                        </Button>

                                        <Button
                                            icon={<CopyOutlined />}
                                            onClick={() =>
                                                handleCopy(
                                                    'bb_live_••••••••••••••••••••••••abcd',
                                                    'License Key'
                                                )
                                            }
                                        >
                                            Copy
                                        </Button>
                                    </Space>
                                </Flex>
                            </Card>
                        </Space>
                    </Card>

                    {/* Signing Secrets */}
                    <Card
                        title={
                            <Space direction="vertical" size={0} style={{ padding: "15px 0" }}>
                                <Title level={5}>Signing Secrets</Title>

                                <Text type="secondary">
                                    Used to cryptographically verify webhook payloads sent to your endpoints.
                                </Text>
                            </Space>
                        }
                    >
                        <Space direction="vertical" size="large" style={{ width: '100%', }}>

                            <Card size="small">
                                <Flex justify="space-between" align="center" gap="middle">
                                    <Space direction="vertical" size={0}>
                                        <Space size="small">
                                            <Text type="secondary">
                                                Primary Secret
                                            </Text>

                                            <Tag color="blue">
                                                v2
                                            </Tag>
                                        </Space>

                                        <Text code> whsec_•••••••••••••••••••• </Text>
                                    </Space>

                                    <Button
                                        icon={<CopyOutlined />}
                                        onClick={() =>
                                            handleCopy(
                                                'whsec_••••••••••••••••••••',
                                                'Primary Secret'
                                            )
                                        }
                                    >
                                        Copy
                                    </Button>
                                </Flex>
                            </Card>

                            {/* Rotate Signing Secret */}
                            <Alert type="error" message="Rotate Signing Secret"
                                description={
                                    <Text>
                                        Rotating will immediately invalidate the current secret. Warning: any webhooks sent with the old signature will fail verification until your backend is updated.
                                    </Text>
                                }
                                action={
                                    <Popconfirm
                                        title="Rotate Signing Secret?"
                                        description="The current signing secret will be invalidated immediately."
                                        okText="Rotate"
                                        cancelText="Cancel"
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
                                            Confirm & Rotate Secret
                                        </Button>
                                    </Popconfirm>
                                }
                            />
                        </Space>
                    </Card>
                </Space>
            </div>
        </>
    )
}
export default projectCredential