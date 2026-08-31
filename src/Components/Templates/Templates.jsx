import { Row, Col, Card, Input, Button, Select, Segmented, Tag, Typography, Space, Flex, Spin, Switch, message, Modal, Pagination, } from "antd";
import { SearchOutlined, PlusOutlined, FilterOutlined, ClockCircleOutlined, FolderOutlined, FileImageOutlined, DownOutlined, DeleteOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import AppPageHeader from "../Styles/AppHeader";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changeTemplateStatus, deleteTemplate, getAllTemplates } from "./TemplateApi";
import { useEffect, useState } from "react";
import EmptyState from "../Styles/EmptyState";
import { formatDate } from "../../util/commom.utils";
import { useDebounce } from "../../util/useDebounce";
import { staticModal } from "../../util/staticFn";
import DeleteModal from "../Styles/DeleteModel";
const { Text } = Typography;
const statusColors = {
    published: "success",
    draft: "warning",
    archived: "default",
};

export default function Templates() {

    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("created-at");
    const [hoveredTemplate, setHoveredTemplate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusLoading, setStatusLoading] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [totalTemplates, setTotalTemplates] = useState(0);
    const theme = useSelector((state) => state?.app?.theme);
    const debouncedSearch = useDebounce(search, 700);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTemplateRecord, setDeleteTemplateRecord] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const isEmptyEditorHtml = (html) =>
        !html ||
        html.trim() === "" ||
        html.includes("Drag Content Block Here");

    const fetchTemplates = async () => {
        try {
            setLoading(true);

            const payload = {
                search: debouncedSearch,
                sort_by: sortBy,
                filter_by: {
                    enable: true,
                },
                page: currentPage - 1,
                limit: pageSize,
            };

            const data = await getAllTemplates(payload);

            if (data?.status) {
                setTemplates(data?.templates || []);
                setTotalTemplates(data?.total || 0);
            } else {
                setTemplates([]);
                setTotalTemplates(0);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [debouncedSearch, sortBy, currentPage, pageSize]);

    const handleDeleteTemplate = (template) => {
        setDeleteTemplateRecord(template);
        setDeleteModalOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (!deleteTemplateRecord) return;

        try {
            setDeleteLoading(true);

            const data = await deleteTemplate({
                id: deleteTemplateRecord._id,
            });

            if (data?.status) {
                setTemplates((prev) =>
                    prev.filter(
                        (item) => item._id !== deleteTemplateRecord._id
                    )
                );

                message.success(
                    data?.message || "Template deleted successfully"
                );

                setDeleteModalOpen(false);
                setDeleteTemplateRecord(null);
            } else {
                message.error(
                    data?.message || "Failed to delete template"
                );
            }
        } catch (error) {
            console.error(error);
            message.error(
                error?.message || "Failed to delete template"
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleChangeStatus = async (template, enable) => {
        try {
            setStatusLoading(template._id);

            const data = await changeTemplateStatus(
                template._id,
                enable
            );

            if (data?.status) {
                setTemplates((prev) =>
                    prev.map((item) =>
                        item._id === template._id ? { ...item, enable, } : item
                    )
                );
                message.success(enable ? "Template enabled successfully" : "Template disabled successfully");
            } else {
                message.error(data?.message || "Failed to change template status");
            }
        } catch (error) {
            console.error(error);
            message.error(error?.message || "Failed to change template status");
        } finally {
            setStatusLoading(null);
        }
    };

    return (
        <PageContainer title={false}  >
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} lg={14}>
                        <AppPageHeader
                            title={t("templates.library", {
                                defaultValue: "Template Library",
                            })}
                            description={t("templates.description", {
                                defaultValue: "Manage and discover email templates across your workspace.",
                            })}
                        />
                    </Col>

                    <Col xs={24} lg={10}>
                        <Flex gap={8} justify="end" wrap>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate("/templates/create-template")}
                            >
                                {t('new.template', { defaultValue: 'New Template' })}
                            </Button>
                        </Flex>
                    </Col>
                </Row>

                {/* Filters bar */}
                <Card size="small" styles={{ body: { padding: "12px 16px" } }}>
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
                            <Space size={8}>
                                <Text type="secondary">{t('project', { defaultValue: 'Project' })}:</Text>

                                <Select
                                    defaultValue="all"
                                    variant="borderless"
                                    suffixIcon={<DownOutlined />}
                                    style={{
                                        width: 130,
                                        background: theme ? "#0A1622" : "#F5F8FA",
                                        borderRadius: 8,
                                    }}
                                    options={[
                                        { value: "all", label: t('all.projects', { defaultValue: 'All Projects' }) },
                                        { value: "marketing", label: t('marketing.hub', { defaultValue: 'Marketing Hub' }) },
                                        { value: "internal", label: t('internal.comms', { defaultValue: 'Internal Comms' }) },
                                        { value: "transactional", label: t('transactional', { defaultValue: 'Transactional' }) },
                                    ]}
                                />
                            </Space>

                            <Space size={4}>
                                <FilterOutlined />
                                <Text strong>{t('filters', { defaultValue: 'FILTERS' })}</Text>
                            </Space>

                            <Space size={8}>
                                <Text type="secondary">{t('status', { defaultValue: 'Status' })}:</Text>
                                <Segmented
                                    defaultValue="All"
                                    options={[
                                        t('all', { defaultValue: 'All' }),
                                        t('published', { defaultValue: 'Published' }),
                                        t('draft', { defaultValue: 'Draft' })
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
                                    style={{
                                        width: 150,
                                        background: theme ? "#0A1622" : "#F5F8FA",
                                        borderRadius: 8,
                                    }}
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

                {/* Template cards */}
                <Row gutter={[16, 16]}>
                    {loading ? (
                        <Col span={24}>
                            <Flex align="center" justify="center" style={{ height: "40vh" }}>
                                <Spin size="default" />
                            </Flex>
                        </Col>
                    ) : templates.length > 0 ? (
                        templates.map((tpl) => (
                            <Col key={tpl._id} xs={24} sm={12} lg={6}
                            >
                                <Card
                                    hoverable
                                    styles={{ body: { padding: 16 } }}
                                    style={{ background: theme ? "#0F2233" : "#e1e4e6", }}
                                    cover={
                                        <div
                                            style={{ position: "relative", height: 200, background: "#dcdfe4", borderBottom: "1px solid #f0f0f0", overflow: "hidden", }}
                                            onMouseEnter={() => setHoveredTemplate(tpl._id)}
                                            onMouseLeave={() => setHoveredTemplate(null)}
                                        >
                                            {!isEmptyEditorHtml(tpl.HTML) ? (
                                                <iframe
                                                    title={`template-${tpl._id}`}
                                                    srcDoc={tpl.HTML}
                                                    scrolling="no"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        border: "none",
                                                        pointerEvents: "none",
                                                        background: "#fff",
                                                    }}
                                                />
                                            ) : tpl.text?.trim() ? (
                                                <Flex
                                                    align="center"
                                                    justify="center"
                                                    style={{
                                                        height: "100%",
                                                        padding: 16,
                                                    }}
                                                >
                                                    <Text style={{ color: "#000" }}>
                                                        {tpl.text.replace(/{{\s*[^}]+\s*}}/g, "{{name}}")}
                                                    </Text>
                                                </Flex>
                                            ) : (
                                                <Flex align="center" justify="center" style={{ height: "100%", }}>
                                                    <FileImageOutlined
                                                        style={{ fontSize: 28, color: "#bfbfbf", }}
                                                    />
                                                </Flex>
                                            )}

                                            {/* Delete button */}
                                            {hoveredTemplate === tpl._id && (
                                                <Flex justify="center" align="center" gap={10}
                                                    style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", }}
                                                >
                                                    <Button
                                                        shape="circle"
                                                        icon={<EyeOutlined />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setPreviewTemplate(tpl);
                                                        }}
                                                    />
                                                    <Button
                                                        shape="circle"
                                                        icon={<EditOutlined />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/templates/edit-template/${tpl._id}`);
                                                        }}
                                                    />

                                                    <Button
                                                        danger
                                                        shape="circle"
                                                        icon={<DeleteOutlined />}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteTemplate(tpl);
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
                                                {tpl.name}
                                            </Text>
                                        </Space>

                                        <Tag color={statusColors[tpl.status]}>
                                            {tpl.status}
                                        </Tag>
                                    </Space>

                                    <div style={{ marginTop: 5 }}>
                                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                            <Space size={6}>
                                                <FolderOutlined style={{ color: "#20A6CE", fontSize: 17 }} />
                                                <Text style={{ color: "#8c8e91", fontWeight: 600 }}>
                                                    {tpl.project}
                                                </Text>
                                            </Space>
                                        </Space>
                                    </div>

                                    <Row justify="space-between" align="middle" style={{ marginTop: 8 }}>
                                        <Space size={6}>
                                            <ClockCircleOutlined style={{ color: "#20A6CE" }} />
                                            <Text style={{ color: "#8c8e91", fontWeight: 600 }}>
                                                {formatDate(tpl.updatedAt)}
                                            </Text>
                                        </Space>

                                        <Row>
                                            <Switch
                                                size="small"
                                                checked={tpl.enable}
                                                loading={statusLoading === tpl._id}
                                                onChange={(checked) =>
                                                    handleChangeStatus(tpl, checked)
                                                }
                                                style={{ marginRight: 4, transform: "scale(0.85)", }}
                                            />
                                            <Tag variant="filled" style={{ background: theme ? "#0A1622" : "#F5F8FA", }} >
                                                {tpl.HTML?.trim() ? "HTML" : "TEXT"}
                                            </Tag>
                                        </Row>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <EmptyState
                                title={t('no.templates.found', { defaultValue: 'No templates found' })}
                                description={t('create.first.template', { defaultValue: 'Create your first email template to get started.' })}
                                action={
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() => navigate("/templates/create-template")}
                                    >
                                        {t('create.template', { defaultValue: 'Create Template' })}
                                    </Button>
                                }
                            />
                        </Col>
                    )}
                </Row>

                {!loading && templates.length > 0 && (
                    <Flex justify="space-between" align="center" style={{ marginTop: 16 }}>
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
            </Space>

            <Modal
                open={!!previewTemplate}
                onCancel={() => setPreviewTemplate(null)}
                footer={null}
                centered
                width={500}
                title={previewTemplate?.name}
                styles={{ body: { padding: 0, height: "55vh" } }}
            >
                {!isEmptyEditorHtml(previewTemplate?.HTML) ? (
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
                    <Flex align="center" justify="center" style={{ height: "75vh" }}>
                        <FileImageOutlined style={{ fontSize: 48, color: "#bfbfbf", }} />
                    </Flex>
                )}
            </Modal>
            <DeleteModal
                open={deleteModalOpen}
                record={deleteTemplateRecord}
                selectedRowKeys={[]}
                loading={deleteLoading}
                itemName="Template"
                itemNamePlural="Templates"
                onCancel={() => {
                    if (!deleteLoading) {
                        setDeleteModalOpen(false);
                        setDeleteTemplateRecord(null);
                    }
                }}
                onConfirm={handleConfirmDelete}
            />
        </PageContainer>
    );
}
