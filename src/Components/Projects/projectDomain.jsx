import { useEffect, useState } from 'react'
import {
    Row,
    Col,
    Card,
    Table,
    Tag,
    Button,
    Typography,
    Input,
    Space,
    Dropdown,
    Flex,
    Badge,
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
import { getDomains, validateProjectDomain } from './ProjectsApi'
import { t } from 'i18next'

const { Title, Text, Paragraph } = Typography

function ProjectDomain() {
    const [originUrl, setOriginUrl] = useState('')
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [validationResult, setValidationResult] = useState(null);
    const [addDomainOpen, setAddDomainOpen] = useState(false);
    const [editingDomain, setEditingDomain] = useState(null);
    const [domains, setDomains] = useState([]);
    const [domainsLoading, setDomainsLoading] = useState(false);
    const theme = useSelector((state) => state?.app?.theme);
    const selectedProject = useSelector((state) => state?.app?.selectedProject);


    const fetchDomains = async () => {
        if (!selectedProject?._id) return;

        try {
            setDomainsLoading(true);

            const response = await getDomains(selectedProject._id);

            if (response?.status) {
                setDomains(response?.domains || []);
            } else {
                setDomains([]);
            }
        } catch (error) {
            console.error("FETCH DOMAINS ERROR:", error);
            setDomains([]);
        } finally {
            setDomainsLoading(false);
        }
    };
    const handleVerifyOrigin = async () => {
        if (!originUrl.trim()) {
            return;
        }

        if (!selectedProject?._id) {
            return;
        }

        try {
            setVerifyLoading(true);

            const payload = {
                origin: originUrl.trim(),
            };

            const data = await validateProjectDomain(
                selectedProject._id,
                payload
            );

            if (data?.status) {
                setValidationResult(data);
            }
        } catch (error) {
            console.error("VERIFY ORIGIN ERROR:", error);
        } finally {
            setVerifyLoading(false);
        }
    };

    useEffect(() => {
        fetchDomains();
    }, [selectedProject?._id]);
    const columns = [
        {
            title: t('Domain', { defaultValue: 'Domain' }),
            dataIndex: 'domain',
            key: 'domain',
            width: 200,
            render: (text, record) => (
                <Space size={8}>
                    {record.type === 'Wildcard' ? (
                        <CodeOutlined style={{ fontSize: 17, display: "flex", alignItems: "center" }} />
                    ) : (
                        <GlobalOutlined style={{ fontSize: 17, display: "flex", alignItems: "center" }} />
                    )}
                    <Text code>
                        {text}
                    </Text>
                </Space>
            ),
        },
        {
            title: t('Type', { defaultValue: 'Type' }),
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
            title: t("Status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (status) => (
                <Badge
                    status={
                        status === "active"
                            ? "success"
                            : "warning"
                    }
                    text={status}
                />
            ),
        },
        {
            title: t('actions', { defaultValue: 'Actions' }),
            key: 'actions',
            width: 120,
            align: 'center',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Edit",
                            },
                            {
                                key: "delete",
                                label: "Delete",
                                danger: true,
                            },
                        ],
                        onClick: ({ key }) => {
                            if (key === "edit") {
                                setEditingDomain(record);
                                setAddDomainOpen(true);
                            }
                        },
                    }}
                    trigger={["click"]}
                >
                    <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
            ),
        },
    ]
    return (
        <div style={{ padding: 24 }}>
            <Row gutter={[16, 16]}>
                {/* Left: Allowed Domains */}
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Card styles={{ header: { padding: "18px", }, body: { padding: 0, } }}

                            title={
                                <Flex vertical gap={4}>
                                    <Title level={5} style={{ margin: 0, whiteSpace: "normal", }}>
                                        {t('allowed.domains', { defaultValue: 'Allowed Domains' })}
                                    </Title>

                                    <Text type="secondary" style={{ whiteSpace: "normal", }}>
                                        {t('manage.origins.permitted.to.send.requests.accepts.patterns.like', { defaultValue: 'Manage origins permitted to send requests. Accepts patterns like' })}{" "}
                                        <Text code>{t('app.example.com', { defaultValue: 'app.example.com' })}</Text>,{" "}
                                        <Text code>{t('*.example.com', { defaultValue: '*.example.com' })}</Text>, and{" "}
                                        <Text code>{t('localhost', { defaultValue: 'localhost' })}</Text>.
                                    </Text>
                                </Flex>
                            }
                            extra={
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setEditingDomain(null);
                                        setAddDomainOpen(true);
                                    }}
                                    style={{ background: "#20A6CE", }}
                                >
                                    {t('Add.Domain', { defaultValue: 'Add Domain' })}
                                </Button>
                            }
                        />

                        <Card styles={{ body: { padding: 0, }, }}>
                            <Table
                                rowKey="domain"
                                columns={columns}
                                dataSource={domains}
                                loading={domainsLoading}
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
                                <span>{t('local.validation.only', { defaultValue: 'Local Validation Only' })}</span>
                            </Space>
                        }
                        style={{ height: 450 }}
                    >
                        <Paragraph type="secondary">
                            {t('enter.a.url.to.verify.if.it.matches.your.current.domain.rules', { defaultValue: 'Enter a URL to verify if it matches your current domain rules.' })}
                        </Paragraph>

                        <Space direction='vertical' size="middle" style={{ width: "100%" }}>
                            <Text strong>
                                {t('origin.url', { defaultValue: 'Origin URL' })}
                            </Text>
                            <Input
                                placeholder={t('https://my-app.com', { defaultValue: 'https://my-app.com' })}
                                value={originUrl}
                                onChange={(e) => setOriginUrl(e.target.value)}
                            />

                            <Button
                                type="default"
                                block
                                loading={verifyLoading}
                                onClick={handleVerifyOrigin}
                            >
                                {t('verify.origin', { defaultValue: 'Verify Origin' })}
                            </Button>
                        </Space>
                        <div
                            style={{
                                backgroundColor: validationResult
                                    ? validationResult.allowed
                                        ? "#F6FFED"
                                        : "#FFF2F0"
                                    : "#D3F5FFE1",
                                borderRadius: 6,
                                padding: "10px 12px",
                                textAlign: "center",
                                marginTop: "20%",
                            }}
                        >
                            {!validationResult ? (
                                <Text type="secondary">
                                    {t('awaiting.input', { defaultValue: 'Awaiting input...' })}
                                </Text>
                            ) : validationResult.allowed ? (
                                <Space direction="vertical" size={2}>
                                    <Text type="success" strong>
                                        {t('domain.allowed', { defaultValue: 'Domain Allowed' })}
                                    </Text>

                                    <Text type="secondary">
                                        {t('matched.rule', { defaultValue: 'Matched rule:' })}{" "}
                                        <Text code style={{ color: theme ? "#171A2B" : "#171A2B" }}>
                                            {validationResult.matchedRule}
                                        </Text>
                                    </Text>
                                </Space>
                            ) : (
                                <Space direction="vertical" size={2}>
                                    <Text type="danger" strong>
                                        {t('domain.not.allowed', { defaultValue: 'Domain Not Allowed' })}
                                    </Text>

                                    <Text type="secondary">
                                        {t('no.matching.domain.rule.found', { defaultValue: 'No matching domain rule found.' })}
                                    </Text>
                                </Space>
                            )}
                        </div>
                    </Card>
                </Col>
            </Row>
            <AddDomain
                open={addDomainOpen}
                projectId={selectedProject?._id}
                editingDomain={editingDomain}
                onClose={() => {
                    setAddDomainOpen(false);
                    setEditingDomain(null);
                }}
                onSuccess={fetchDomains}
            />
        </div>
    )
}

export default ProjectDomain
