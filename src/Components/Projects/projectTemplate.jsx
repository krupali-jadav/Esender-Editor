import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Col,
    Flex,
    Input,
    Modal,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
} from 'antd'

import {
    SearchOutlined,
    PlusOutlined,
    FileTextOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    FolderOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAllTemplates } from "../Templates/TemplateApi";
import EmptyState from '../Styles/EmptyState';
import { useDebounce } from '../../util/useDebounce';
import { useSelector } from 'react-redux';
import { formatDate } from '../../util/commom.utils';
import { t } from 'i18next';
const { Text } = Typography

const statusColors = {
    published: "success",
    draft: "warning",
    archived: "default",
};


function ProjectTemplate() {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredTemplate, setHoveredTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);
    const selectedProject = useSelector(
        (state) => state?.app?.selectedProject
    );
    const theme = useSelector((state) => state?.app?.theme);
    const projectId = selectedProject?._id;

    const fetchTemplates = async (projectId) => {
        if (!projectId) {
            return;
        }

        try {
            setLoading(true);
            const payload = {
                projectId: projectId,
                search: debouncedSearch,
            };

            const response = await getAllTemplates(payload);

            setTemplates(response?.templates || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!projectId) return;
        fetchTemplates(projectId);
    }, [projectId, debouncedSearch]);

    return (
        <Flex vertical gap="middle" style={{ padding: 24 }}>
            {/* Top Actions */}
            <Flex justify="space-between" align="center" gap="middle">
                <Input
                    placeholder="Search templates..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 340 }}
                />

                <Button style={{ background: '#20A6CE', color: '#fff', height: 40, borderRadius: 9 }} icon={<PlusOutlined />}
                    onClick={() => navigate("/templates/create-template")}>
                    {t('new.template', { defaultValue: 'New Template' })}
                </Button>
            </Flex>

            {/* Template Cards */}
            <Row gutter={[16, 16]}>
                {loading ? (
                    <Col span={24}>
                        <Flex justify="center" style={{ padding: 40 }}>
                            <Spin />
                        </Flex>
                    </Col>
                ) : templates.length === 0 ? (
                    <Col span={24}>
                        <EmptyState
                            icon={<FileTextOutlined />}
                            title={t('no.templates.found', { defaultValue: 'No templates found' })}
                            description={t('no.templates.description', { defaultValue: 'There are no templates available for this project.' })}
                        />
                    </Col>
                ) : (
                    templates.map((template) => (
                        <Col key={template._id} xs={22} sm={12} md={8} lg={8} xl={6}>
                            <Card size="small" hoverable
                                style={{ background: theme ? "#0F2233" : "#e1e4e6", }}
                                cover={
                                    <div
                                        style={{
                                            position: "relative",
                                            height: 200,
                                            background: "#dcdfe4",
                                            borderBottom: "1px solid #f0f0f0",
                                            overflow: "hidden",

                                        }}
                                        onMouseEnter={() => setHoveredTemplate(template._id)}
                                        onMouseLeave={() => setHoveredTemplate(null)}
                                    >
                                        {/* Template HTML Preview */}
                                        {template.HTML?.trim() ? (
                                            <iframe
                                                title={`template-${template._id}`}
                                                srcDoc={template.HTML}
                                                scrolling="no"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    border: "none",
                                                    pointerEvents: "none",
                                                    background: "#fff",
                                                }}
                                            />
                                        ) : template.text?.trim() ? (
                                            <Flex align="center" justify="center" style={{ height: "100%", padding: 16, }}>
                                                <Text type="secondary">
                                                    {template.text}
                                                </Text>
                                            </Flex>
                                        ) : (
                                            <Flex align="center" justify="center" style={{ height: "100%", }}>
                                                <FileTextOutlined style={{ fontSize: 32, color: "#bfbfbf", }} />
                                            </Flex>
                                        )}

                                        {/* Hover Eye */}
                                        {hoveredTemplate === template._id && (
                                            <Flex justify="center" align="center"
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    background: "rgba(0,0,0,0.4)",
                                                }}
                                            >
                                                <Button
                                                    shape="circle"
                                                    icon={<EyeOutlined />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewTemplate(template);
                                                    }}
                                                />
                                            </Flex>
                                        )}
                                    </div>
                                }
                            >
                                <Space style={{ width: "100%", justifyContent: "space-between", }} align="start">
                                    <Space>
                                        <Text strong ellipsis style={{ maxWidth: 130 }}>
                                            {template.name}
                                        </Text>
                                    </Space>

                                    <Tag color={statusColors[template.status]}>
                                        {template.status}
                                    </Tag>
                                </Space>


                                <div style={{ marginTop: 5 }}>
                                    <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                        <Space size={6}>
                                            <FolderOutlined style={{ color: "#20A6CE" ,fontSize: 17}} />
                                            <Text style={{color: "#8c8e91", fontWeight: 600 }}>
                                                {template.project}  Marketing
                                            </Text>
                                        </Space>
                                    </Space>
                                </div>

                                <Row justify="space-between" align="middle" style={{ marginTop: 8 }}>
                                    <Space size={6}>
                                        <ClockCircleOutlined style={{ color: "#20A6CE" }} />
                                         <Text style={{color: "#8c8e91", fontWeight: 600 }}>
                                            {formatDate(template.updatedAt)}
                                        </Text>
                                    </Space>

                                    <Row>

                                        <Tag variant="filled" style={{ background: theme ? "#0A1622" : "#F5F8FA", }} >
                                            {template.HTML?.trim() ? t('html', { defaultValue: 'HTML' }) : t('text', { defaultValue: 'TEXT' })}
                                        </Tag>
                                    </Row>
                                </Row>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            <Modal
                open={!!previewTemplate}
                onCancel={() => setPreviewTemplate(null)}
                footer={null}
                centered
                width={500}
                title={previewTemplate?.name}
                styles={{ body: { padding: 0, height: "55vh", }, }}
            >
                {previewTemplate?.HTML?.trim() ? (
                    <iframe
                        title={`preview-${previewTemplate._id}`}
                        srcDoc={previewTemplate.HTML}
                        style={{
                            width: "100%",
                            height: "55vh",
                            border: "none",
                            background: "#fff",
                        }}
                    />
                ) : previewTemplate?.text?.trim() ? (
                    <Flex align="center" justify="center" style={{ height: "55vh", padding: 24, }}>
                        <Text>{previewTemplate.text}</Text>
                    </Flex>
                ) : (
                    <Flex align="center" justify="center" style={{ height: "70vh", }}>
                        <FileTextOutlined style={{ fontSize: 48, color: "#bfbfbf", }} />
                    </Flex>
                )}
            </Modal>
        </Flex>
    )
}

export default ProjectTemplate