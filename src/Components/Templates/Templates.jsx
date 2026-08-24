import { Row, Col, Card, Input, Button, Select, Segmented, Tag, Typography, Space, Empty, Flex, Spin, Switch, message, Modal, Pagination, } from "antd";
import { SearchOutlined, PlusOutlined, FilterOutlined, ClockCircleOutlined, FolderOutlined, FileImageOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";
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
    const [totalTemplates, setTotalTemplates] = useState(0);
    const theme = useSelector((state) => state?.app?.theme);
    const debouncedSearch = useDebounce(search, 700);

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
            message.error(error?.response?.data?.message || error?.message || "Failed to load templates");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, [debouncedSearch, sortBy, currentPage, pageSize]);

    const handleDeleteTemplate = (template) => {
        Modal.confirm({
            title: "Delete Template",
            content: (<>Are you sure you want to delete{" "} <strong> {template.name}</strong>?</>),
            okText: "Delete",
            okType: "danger",
            cancelText: "Cancel",

            onOk: async () => {
                try {
                    setLoading(true);

                    const payload = {
                        id: template._id,
                    };
                    const data = await deleteTemplate(payload);
                    if (data?.status) {
                        setTemplates((prev) =>
                            prev.filter(
                                (item) => item._id !== template._id
                            )
                        );
                        message.success("Template deleted successfully");
                    } else {
                        message.error(data?.message || "Failed to delete template");
                    }
                } catch (error) {
                    console.error(error);
                    message.error(error?.response?.data?.message || error?.message || "Failed to delete template");
                } finally {
                    setLoading(false);
                }
            },
        });
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
            message.error(error?.response?.data?.message || error?.message || "Failed to change template status");
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
                            description="Manage and discover email templates across your workspace."
                        />
                    </Col>

                    <Col xs={24} lg={10}>
                        <Flex
                            gap={8}
                            justify="end"
                            wrap
                        >

                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => navigate("/templates/create-template")}
                            >
                                New Template
                            </Button>
                        </Flex>
                    </Col>
                </Row>

                {/* Filters bar */}
                <Card
                    size="small"
                    styles={{ body: { padding: "12px 16px" } }}
                >
                    <Flex
                        gap={24}
                        justify="space-between"
                        align="center"
                        wrap="wrap"
                    >
                        {/* Search */}
                        <Input
                            placeholder="Search templates..."
                            prefix={<SearchOutlined />}
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                flex: 1,
                                width: "100%",
                                maxWidth: 500,
                                minWidth: 200,
                            }}
                        />

                        {/* Filters */}
                        <Flex
                            gap={16}
                            justify="end"
                            wrap="wrap"
                        >
                            <Space size={8}>
                                <Text type="secondary">Project:</Text>

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
                                        { value: "all", label: "All Projects" },
                                        { value: "marketing", label: "Marketing Hub" },
                                        { value: "internal", label: "Internal Comms" },
                                        { value: "transactional", label: "Transactional" },
                                    ]}
                                />
                            </Space>

                            <Space size={4}>
                                <FilterOutlined />
                                <Text strong>FILTERS</Text>
                            </Space>

                            <Space size={8}>
                                <Text type="secondary">Status:</Text>

                                <Segmented
                                    defaultValue="All"
                                    options={["All", "Published", "Draft"]}
                                />
                            </Space>

                            <Space size={8}>
                                <Text type="secondary">Sort:</Text>
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
                                            label: "Sort by Created At",
                                        },
                                        {
                                            value: "name",
                                            label: "Sort by Name",
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
                            <Flex
                                align="center"
                                justify="center"
                                style={{ height: "40vh" }}
                            >
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
                                    cover={
                                        <div
                                            style={{
                                                position: "relative",
                                                height: 200,
                                                background: "#dcdfe4",
                                                borderBottom: "1px solid #f0f0f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            onMouseEnter={() => setHoveredTemplate(tpl._id)} onMouseLeave={() => setHoveredTemplate(null)}
                                        >
                                            <FileImageOutlined
                                                style={{
                                                    fontSize: 28,
                                                    color: "#bfbfbf",
                                                }}
                                            />

                                            {/* Delete button - visible only on hover */}
                                            {hoveredTemplate === tpl._id && (
                                                <Flex justify="center" align="center" gap={8}
                                                    style={{
                                                        position: "absolute",
                                                        inset: 0,
                                                        height: 200,
                                                        background: "rgba(0,0,0,0.4)",
                                                    }}
                                                >
                                                    {/* Delete */}
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
                                    <Space
                                        style={{
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                        align="start"
                                    >
                                        <Space>
                                            <Text
                                                strong
                                                ellipsis
                                                style={{ maxWidth: 130 }}
                                            >
                                                {tpl.name}
                                            </Text>
                                        </Space>

                                        <Tag color={statusColors[tpl.status]}>
                                            {tpl.status}
                                        </Tag>
                                    </Space>

                                    <div style={{ marginTop: 8 }}>
                                        <Space style={{ width: "100%", justifyContent: "space-between" }}>
                                            <Space size={4}>
                                                <FolderOutlined style={{ color: "#8c8c8c" }} />

                                                <Text type="secondary">
                                                    {tpl.project}
                                                </Text>
                                            </Space>
                                        </Space>
                                    </div>

                                    <Row
                                        justify="space-between"
                                        align="middle"
                                        style={{ marginTop: 16 }}
                                    >
                                        <Space size={4}>
                                            <ClockCircleOutlined
                                                style={{ color: "#8c8c8c" }}
                                            />

                                            <Text type="secondary">
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
                                                style={{
                                                    marginRight: 4,
                                                    transform: "scale(0.85)",
                                                }}
                                            />
                                            <Tag
                                                variant="filled"
                                                style={{
                                                    background: theme
                                                        ? "#0A1622"
                                                        : "#F5F8FA",
                                                }}
                                            >
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
                                title="No templates found"
                                description="Create your first email template to get started."
                                action={
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        onClick={() =>
                                            navigate("/templates/create-template")
                                        }
                                    >
                                        Create Template
                                    </Button>
                                }
                            />
                        </Col>
                    )}
                </Row>

                {!loading && templates.length > 0 && (
                    <Flex justify="space-between" align="center" style={{ marginTop: 16 }}>
                        <strong>
                            Total: {totalTemplates} templates
                        </strong>
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

        </PageContainer>
    );
}
