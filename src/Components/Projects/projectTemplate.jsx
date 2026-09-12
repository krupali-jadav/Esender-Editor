import { useEffect, useState } from 'react'
import {
    Button,
    Card,
    Col,
    Flex,
    Input,
    message,
    Modal,
    Pagination,
    Row,
    Segmented,
    Select,
    Space,
    Spin,
    Switch,
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
    DownOutlined,
    FilterOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { changeTemplateStatus, getAllTemplates } from "../Templates/TemplateApi";
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
    const [totalTemplates, setTotalTemplates] = useState(0);
    const [sortBy, setSortBy] = useState("created-at");
    const [status, setStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusLoading, setStatusLoading] = useState(null);
    const [isApplyFilter, setIsApplyFilter] = useState(false);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 700);
    const selectedProject = useSelector(
        (state) => state?.app?.selectedProject
    );
    const theme = useSelector((state) => state?.app?.theme);
    const projectId = selectedProject?._id;

    const isEmptyEditorHtml = (html) =>
        !html ||
        html.trim() === "" ||
        html.includes(t("drag.content.block.here", { defaultValue: "Drag Content Block Here" }));

    const fetchTemplates = async (projectId) => {
        if (!projectId) {
            return;
        }

        try {
            setLoading(true);
            const payload = {
                projectId: projectId,
                search: debouncedSearch,
                sort_by: sortBy,
                filter_by: {
                    enable: true,
                    ...(status !== "all" && { status }),
                },
                page: currentPage - 1,
                limit: pageSize,
            };

            const response = await getAllTemplates(payload);

            if (response?.status) {
                setTemplates(response?.templates || []);
                setTotalTemplates(response?.total || 0);
            } else {
                setTemplates([]);
                setTotalTemplates(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async (template, checked) => {
        try {
            setStatusLoading(template._id);

            const status = checked ? "published" : "draft";

            const data = await changeTemplateStatus(
                template._id,
                status
            );

            if (data?.status) {
                setTemplates((prev) =>
                    prev.map((item) =>
                        item._id === template._id
                            ? {
                                ...item,
                                status,
                                enable: checked,
                            } : item
                    )
                );
                message.success(data?.message);
            } else {
                message.error(data?.message);
            }
        } catch (error) {
            console.error(error);
            message.error(error?.message);
        } finally {
            setStatusLoading(null);
        }
    };

    useEffect(() => {
        if (!projectId) return;
        fetchTemplates(projectId);
    }, [projectId, debouncedSearch, sortBy, status, currentPage, pageSize]);

    return (
        <Flex vertical gap="middle" style={{ padding: 24 }}>
            {/* Top Actions */}
            <Card size="small">
                <Flex gap={24} justify="space-between" align="center" wrap="wrap" >
                    {/* Search */}
                    <Input
                        placeholder="Search templates..."
                        prefix={<SearchOutlined />}
                        allowClear
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ flex: 1, width: "100%", maxWidth: 500, minWidth: 200, }}
                    />

                    {/* Filters */}
                    <Flex gap={16} justify="end" wrap="wrap">
                        <Space size={4}>
                            <FilterOutlined />
                            <Text strong>{t('filters', { defaultValue: 'FILTERS' })}</Text>
                        </Space>

                        <Space size={8}>
                            <Text type="secondary">{t('status', { defaultValue: 'Status' })}:</Text>
                            <Segmented
                                value={status}
                                onChange={(value) => {
                                    setStatus(value);
                                    setIsApplyFilter(value !== "all");
                                    setCurrentPage(1);
                                }}
                                options={[
                                    {
                                        label: t('all', { defaultValue: 'All' }),
                                        value: "all",
                                    },
                                    {
                                        label: t('published', { defaultValue: 'Published' }),
                                        value: "published",
                                    },
                                    {
                                        label: t('draft', { defaultValue: 'Draft' }),
                                        value: "draft",
                                    },
                                ]}
                            />
                        </Space>

                        <Space size={8}>
                            <Text type="secondary">{t('sort', { defaultValue: 'Sort' })}:</Text>
                            <Select
                                value={sortBy}
                                onChange={(value) => setSortBy(value)}
                                variant="borderless"
                                suffixIcon={<DownOutlined />}
                                style={{ width: 150, background: theme ? "#0A1622" : "#F5F8FA", borderRadius: 8, }}
                                options={[
                                    {
                                        value: "created-at",
                                        label: t('sort.created.at', { defaultValue: 'Sort by Created At' }),
                                    },
                                    {
                                        value: "name",
                                        label: t('sort.name', { defaultValue: 'Sort by Name' }),
                                    },
                                ]}
                            />
                        </Space>
                    </Flex>
                </Flex>
            </Card>

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
                            title={
                                isApplyFilter || search
                                    ? t("no.templates.match.filters", { defaultValue: "No templates match your filters", })
                                    : t("no.templates.available", { defaultValue: "No templates available", })
                            }
                            description={
                                isApplyFilter || search
                                    ? t("try.adjusting.or.clearing.your.search.and.filters", { defaultValue: "Try adjusting or clearing your search and filters.", })
                                    : t("create.your.first.template.to.start.designing.campaigns", { defaultValue: "Create your first template to start designing campaigns.", })
                            }
                            action={
                                <Button
                                    type='primary'
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate("/templates/create-template")}
                                >
                                    {t('create.template', { defaultValue: 'Create Template' })}
                                </Button>
                            }
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
                                        {!isEmptyEditorHtml(template.HTML) ? (
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
                                                <Text style={{ color: "#000" }}>
                                                    {template.text}
                                                </Text>
                                            </Flex>
                                        ) : (
                                            <Flex align="center" justify="center" style={{ height: "100%", }}>
                                                <FileTextOutlined style={{ fontSize: 32, color: "#bfbfbf", }} />
                                            </Flex>
                                        )}

                                        {hoveredTemplate === template._id && (
                                            <Flex justify="center" align="center" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} >
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
                                <Space direction="vertical" style={{ width: "100%" }} size="small">
                                    <Space style={{ width: "100%", justifyContent: "space-between", }} align="start">
                                        <Space>
                                            <Text strong ellipsis>
                                                {template.name}
                                            </Text>
                                        </Space>

                                        <Tag color={statusColors[template.status]}>
                                            {template.status}
                                        </Tag>
                                    </Space>


                                    <div>
                                        <Space size={6}>
                                            <FolderOutlined style={{ color: "#20A6CE", fontSize: 17 }} />
                                            <Text style={{ color: "#8c8e91", fontWeight: 600 }}>
                                                {template.project}
                                            </Text>
                                        </Space>
                                    </div>

                                    <Row justify="space-between" align="middle">
                                        <Space size={6}>
                                            <ClockCircleOutlined style={{ color: "#20A6CE" }} />
                                            <Text style={{ color: "#8c8e91", fontWeight: 600 }}>
                                                {formatDate(template.updatedAt)}
                                            </Text>
                                        </Space>

                                        <Row>
                                            <Switch
                                                size="small"
                                                checked={template.status === "published"}
                                                loading={statusLoading === template._id}
                                                onChange={(checked) => handleChangeStatus(template, checked)}
                                                style={{ marginRight: 4, transform: "scale(0.85)", }}
                                            />
                                            <Tag variant="filled" style={{ background: theme ? "#0A1622" : "#F5F8FA", }} >
                                                {template.HTML?.trim() ? t('html', { defaultValue: 'HTML' }) : t('text', { defaultValue: 'TEXT' })}
                                            </Tag>
                                        </Row>
                                    </Row>
                                </Space>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>

            {!loading && templates.length > 0 && (
                <Flex justify="space-between" align="center">
                    <strong> {t('total.templates', { defaultValue: 'Total' })}: {totalTemplates} {t('templates', { defaultValue: 'templates' })} </strong>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalTemplates}
                        pageSizeOptions={[10, 20, 50]}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                    />
                </Flex>
            )}

            <Modal
                open={!!previewTemplate}
                onCancel={() => setPreviewTemplate(null)}
                footer={null}
                centered
                width={500}
                title={previewTemplate?.name}
                styles={{ body: { padding: 0, height: "55vh" } }}
            >
                {!isEmptyEditorHtml(previewTemplate?.HTML?.trim()) ? (
                    <iframe
                        title={`preview-${previewTemplate._id}`}
                        srcDoc={previewTemplate.HTML}
                        style={{ width: "100%", height: "55vh", border: "none", background: "#fff", }}
                    />
                ) : previewTemplate?.text?.trim() ? (
                    <Flex style={{ height: "55vh", padding: 24, background: "#fff", overflowY: "auto", border: "none", }}>
                        <Text style={{ color: "#000", whiteSpace: "pre-wrap", }}>
                            {previewTemplate.text.replace(/{{\s*[^}]+\s*}}/g, "{{name}}")}
                        </Text>
                    </Flex>
                ) : (
                    <Flex align="center" justify="center" style={{ height: "55vh" }}>
                        <FileTextOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
                    </Flex>
                )}
            </Modal>

        </Flex>
    )
}

export default ProjectTemplate