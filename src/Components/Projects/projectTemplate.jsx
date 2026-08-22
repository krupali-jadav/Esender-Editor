import React from 'react'
import {
    Button,
    Card,
    Col,
    ConfigProvider,
    Dropdown,
    Flex,
    Input,
    Row,
    Space,
    Tag,
    Typography,
} from 'antd'

import {
    SearchOutlined,
    PlusOutlined,
    MailOutlined,
    NotificationOutlined,
    FileTextOutlined,
    MoreOutlined,
    EditOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const TEMPLATE_DATA = [
    {
        key: '1',
        name: 'Welcome Series - Introduction',
        status: 'Published',
        version: 'v2.1.8',
        updated: '2h ago',
        icon: <MailOutlined />,
    },
    {
        key: '2',
        name: 'Monthly Newsletter',
        status: 'Draft',
        version: 'v1.3.0',
        updated: '1d ago',
        icon: <NotificationOutlined />,
    },
    {
        key: '3',
        name: 'Order Confirmation',
        status: 'Published',
        version: 'v1.0.4',
        updated: '2w ago',
        icon: <FileTextOutlined />,
    },
    {
        key: '4',
        name: 'Order Confirmation',
        status: 'Published',
        version: 'v1.0.4',
        updated: '2w ago',
        icon: <FileTextOutlined />,
    },
    {
        key: '5',
        name: 'Order Confirmation',
        status: 'Published',
        version: 'v1.0.4',
        updated: '2w ago',
        icon: <FileTextOutlined />,
    },
]

function ProjectTemplate() {
    const navigate = useNavigate();

    const handleEdit = (template) => {
        console.log('Edit template:', template)
    }

    return (
        <Flex vertical gap="middle" style={{ padding: 24 }}>
            {/* Top Actions */}
            <Flex justify="space-between" align="center" gap="middle">
                <Input
                    placeholder="Search templates..."
                    prefix={<SearchOutlined />}
                    style={{ width: 340 }}
                />

                <Button style={{ background: '#20A6CE', color: '#fff', height: 40, borderRadius: 9 }} icon={<PlusOutlined />}
                    onClick={() => navigate("/templates/create-template")}>
                    New Template
                </Button>
            </Flex>

            {/* Template Cards */}
            <Row gutter={[16, 16]}>
                {TEMPLATE_DATA.map((template) => (
                    <Col key={template.key} xs={22} sm={12} md={8} lg={8} xl={6}>
                        <Card
                            size="small"
                            cover={
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: 200,
                                        background: '#dcdfe4',
                                        fontSize: 24,
                                        color: '#b6b9be',
                                    }}
                                >
                                    {template.icon}
                                </div>
                            }
                        >
                            <Card.Meta
                                title={
                                    <Flex justify="space-between" align="center" gap="small">
                                        <Text strong ellipsis style={{ maxWidth: '85%', }}>
                                            {template.name}
                                        </Text>

                                        <Dropdown
                                            menu={{
                                                items: [
                                                    {
                                                        key: 'edit',
                                                        label: 'Edit',
                                                        icon: <EditOutlined />,
                                                        onClick: () =>
                                                            handleEdit(template),
                                                    },
                                                    {
                                                        key: 'delete',
                                                        label: 'Delete',
                                                        danger: true,
                                                    },
                                                ],
                                            }}
                                            trigger={['click']}
                                        >
                                            <MoreOutlined
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ cursor: 'pointer', }}
                                            />
                                        </Dropdown>
                                    </Flex>
                                }
                                description={
                                    <Space size="small">
                                        <Tag
                                            bordered={false}
                                            color={template.status === 'Published' ? 'success' : 'warning'}
                                        >
                                            {template.status}
                                        </Tag>

                                        <Text type="secondary" code>
                                            {template.version}
                                        </Text>
                                    </Space>
                                }
                            />

                            {/* Updated + Edit */}
                            <Flex justify="space-between" align="center" style={{ marginTop: 12, }}>
                                <Text type="secondary" style={{ fontSize: 13, }}>
                                    Updated {template.updated}
                                </Text>

                                <EditOutlined
                                    onClick={() => handleEdit(template)}
                                    style={{ color: '#aeb5c8', cursor: 'pointer', fontSize: 16, }}
                                />
                            </Flex>
                        </Card>
                    </Col>
                ))}

                {/* Create Blank Template */}
                <Col xs={22} sm={12} md={8} lg={8} xl={6}>
                    <Card
                        hoverable
                        variant="dashed"
                        onClick={() => navigate("/templates/create-template")}
                    >
                        <Flex vertical justify="center" align="center" gap="small" style={{ minHeight: 250 }}>
                            <Button shape="circle" icon={<PlusOutlined />} />
                            <Text type="secondary">Create Blank Template</Text>
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </Flex>
    )
}

export default ProjectTemplate