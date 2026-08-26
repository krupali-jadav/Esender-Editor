import { useState } from 'react'
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
    Flex,
} from 'antd'
import {
    GlobalOutlined,
    CodeOutlined,
    MoreOutlined,
    SafetyCertificateOutlined,
    PlusOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import AddDomain from './AddDomain'

const { Title, Text, Paragraph } = Typography

const DOMAIN_DATA = [
    { key: '1', domain: 'app.acme.com', type: 'Exact' },
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
                    <CodeOutlined style={{ fontSize: 17,display:"flex",alignItems:"center" }} />
                ) : (
                    <GlobalOutlined style={{ fontSize: 17,display:"flex",alignItems:"center" }} />
                )}
                <Text code>
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
            <Tag color={type === 'Wildcard' ? 'cyan' : 'default'} bordered={false}>
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
            <Tag color={type === 'Wildcard' ? 'cyan' : 'default'} bordered={false}>
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
            <Tag color={type === 'Wildcard' ? 'cyan' : 'default'} bordered={false}>
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
    const [addDomainOpen, setAddDomainOpen] = useState(false)
    const theme = useSelector((state) => state?.app?.theme);

    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16,16]}>
                {/* Left: Allowed Domains */}
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Card styles={{ header: { padding: "18px", }, body: { padding: 0, } }}

                            title={
                                <Flex vertical gap={4}>
                                    <Title level={5} style={{ margin: 0, whiteSpace: "normal", }}>
                                        Allowed Domains
                                    </Title>

                                    <Text type="secondary" style={{ whiteSpace: "normal", }}>
                                        Manage origins permitted to send requests. Accepts
                                        patterns like{" "}
                                        <Text code>app.example.com</Text>,{" "}
                                        <Text code>*.example.com</Text>, and{" "}
                                        <Text code>localhost</Text>.
                                    </Text>
                                </Flex>
                            }
                            extra={
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => setAddDomainOpen(true)}
                                    style={{ background: "#20A6CE", }}
                                >
                                    Add Domain
                                </Button>
                            }
                        />

                        <Card styles={{ body: { padding: 0, }, }}>
                            <Table
                                columns={columns}
                                dataSource={DOMAIN_DATA}
                                pagination={false}
                                size="middle"
                                scroll={{ x: "max-content" }}
                                components={{
                                    header: {
                                        cell: (props) => (
                                            <th
                                                {...props}
                                                style={{
                                                    ...props.style,
                                                    background: theme
                                                        ? "#0E1C29"
                                                        : "#F0F0F0",
                                                }}
                                            />
                                        ),
                                    },
                                }}
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
                        style={{ height: 515 }}
                    >
                        <Paragraph type="secondary">
                            Enter a URL to verify if it matches your current domain rules.
                        </Paragraph>

                        <Alert
                            type="error"
                            showIcon
                            message="Real enforcement occurs during session creation."
                            style={{ marginBottom: 16, fontSize: 12 }}
                        />

                        <Space direction='vertical' size="middle" style={{ width: "100%" }}>
                            <Text strong>
                                Origin URL
                            </Text>
                            <Input
                                placeholder="https://my-app.com"
                                value={originUrl}
                                onChange={(e) => setOriginUrl(e.target.value)}
                            />

                            <Button type="default" block>
                                Verify Origin
                            </Button>
                        </Space>
                        <div
                            style={{
                                backgroundColor: "#D3F5FFE1",
                                borderRadius: 6,
                                padding: '10px 12px',
                                textAlign: 'center',
                                marginTop: "30%",
                            }}
                        >
                            <Text type="secondary" style={{ color: "#000" }}>
                                Awaiting input...
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
            <AddDomain
                open={addDomainOpen}
                onClose={() => setAddDomainOpen(false)}
            />
        </div>
    )
}

export default ProjectDomain
