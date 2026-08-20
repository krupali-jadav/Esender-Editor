import React, { useState } from 'react'
import {
    Row,
    Col,
    Card,
    Table,
    Tag,
    Button,
    Typography,
    Input,
    Alert,
    Space,
    Dropdown,
} from 'antd'
import {
    GlobalOutlined,
    CodeOutlined,
    MoreOutlined,
    SafetyCertificateOutlined,
    PlusOutlined,
    LoadingOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography

const DOMAIN_DATA = [
    { key: '1', domain: 'app.acme.com', domain: 'app.acme.com', type: 'Exact' },
    { key: '2', domain: '*.acme.com', type: 'Wildcard' },
    { key: '3', domain: 'localhost:3000', type: 'Exact' },
]

const columns = [
    {
        title: 'Domain',
        dataIndex: 'domain',
        key: 'domain',
        width: 200,
        render: (text, record) => (
            <Space size={8}>
                {record.type === 'Wildcard' ? (
                    <CodeOutlined style={{ color: '#8c8c8c' }} />
                ) : (
                    <GlobalOutlined style={{ color: '#8c8c8c' }} />
                )}
                <Text code style={{ background: 'transparent' }}>
                    {text}
                </Text>
            </Space>
        ),
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 140,
        render: (type) => (
            <Tag color={type === 'Wildcard' ? 'purple' : 'default'} bordered={false}>
                {type}
            </Tag>
        ),
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 140,
        render: (type) => (
            <Tag color={type === 'Wildcard' ? '#20A6CE' : 'default'} bordered={false}>
                {type}
            </Tag>
        ),
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 140,
        render: (type) => (
            <Tag color={type === 'Wildcard' ? 'purple' : 'default'} bordered={false}>
                {type}
            </Tag>
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        width: 120,
        align: 'center',
        render: () => (
            <Dropdown
                menu={{
                    items: [
                        { key: 'edit', label: 'Edit' },
                        { key: 'delete', label: 'Delete', danger: true },
                    ],
                }}
                trigger={['click']}
            >
                <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
        ),
    },
]

function ProjectDomain() {
    const [originUrl, setOriginUrl] = useState('')

    return (
        <div style={{ padding: 24, background: '#f5f5f5' }}>
            <Row gutter={16} style={{ maxWidth: 1700 }}>
                {/* Left: Allowed Domains */}
                <Col xs={24} lg={16}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Card
                            styles={{
                                header: { padding: '16px 16px 0', border: 'none' },
                            }}
                            title={
                                <div>
                                    <Title level={5} style={{ margin: 0 }}>
                                        Allowed Domains
                                    </Title>
                                    <Text type="secondary" style={{ fontWeight: 400, fontSize: 13 }}>
                                        Manage origins permitted to send requests. Accepts patterns
                                        like{' '}
                                        <Text code style={{ fontSize: 12 }}>app.example.com</Text>,{' '}
                                        <Text code style={{ fontSize: 12 }}>*.example.com</Text>, and{' '}
                                        <Text code style={{ fontSize: 12 }}>localhost</Text>.
                                    </Text>
                                </div>
                            }
                            extra={
                                <Button style={{ background: '#20A6CE', color: '#fff', height: 40, borderRadius: 9 }} icon={<PlusOutlined />}>
                                    Add Domain
                                </Button>
                            }
                        >

                        </Card>
                        <Card styles={{ body: { padding: 0 }, }}>
                            <Table
                                columns={columns}
                                dataSource={DOMAIN_DATA}
                                pagination={false}
                                size="middle"
                            />
                        </Card>

                    </Space>
                </Col>

                {/* Right: Local Validation Only */}
                <Col xs={24} lg={8}>
                    <Card
                        title={
                            <Space color=''>
                                <SafetyCertificateOutlined style={{ color: '#722ed1' }} />
                                <span>Local Validation Only</span>
                            </Space>
                        }
                        style={{ height: 500 }}
                    >
                        <Paragraph type="secondary" style={{ fontSize: 13 }}>
                            Enter a URL to verify if it matches your current domain rules.
                        </Paragraph>

                        <Alert
                            type="error"
                            showIcon
                            message="Real enforcement occurs during session creation."
                            style={{ marginBottom: 16, fontSize: 12 }}
                        />

                        <Text strong style={{ fontSize: 13 }}>
                            Origin URL
                        </Text>
                        <Input
                            placeholder="https://my-app.com"
                            value={originUrl}
                            onChange={(e) => setOriginUrl(e.target.value)}
                            style={{ margin: '8px 0 16px' }}
                        />

                        <Button type="default" block style={{ marginBottom: 16 }}>
                            Verify Origin
                        </Button>

                        <div
                            style={{
                                background: '#f5f3ff',
                                borderRadius: 6,
                                padding: '10px 12px',
                                textAlign: 'center',
                                marginTop: "30%",
                            }}
                        >
                            <Space size={6}>
                                <LoadingOutlined style={{ color: '#8c8c8c' }} />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Awaiting input...
                                </Text>
                            </Space>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProjectDomain
