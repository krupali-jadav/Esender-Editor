import { Row, Col, Card, Input, Button, Select, Segmented, Tag, Typography, Space, Empty, Flex,} from "antd";
import { SearchOutlined, PlusOutlined, FilterOutlined, ClockCircleOutlined, FolderOutlined, FileImageOutlined, DownOutlined} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import AppPageHeader from "../Styles/AppHeader";
import { t } from "i18next";
import { useSelector } from "react-redux";

const { Text } = Typography;

const statusColors = {
    Published: "success",
    Draft: "warning",
    Archived: "default",
};

const templates = [
    {
        key: "1",
        name: "Welcome ...",
        status: "Published",
        project: "Marketing Hub",
        updated: "2 hrs ago",
        format: "HTML",
        thumb: true,
    },
    {
        key: "2",
        name: "Monthly Upda...",
        status: "Draft",
        project: "Internal Comms",
        updated: "1 day ago",
        format: "MJML",
        thumb: true,
    },
    {
        key: "3",
        name: "Password ...",
        status: "Published",
        project: "Transactional",
        updated: "5 days ago",
        format: "React",
        thumb: true,
    },
    {
        key: "4",
        name: "Legacy Invi...",
        status: "Archived",
        project: "Marketing Hub",
        updated: "1 year ago",
        format: "HTML",
        thumb: false,
    },
];

export default function Templates() {
    const theme = useSelector((state) => state?.app?.theme);
    return (
        <PageContainer title={false}  >
            <Flex justify="space-between" align="center" >
                <AppPageHeader
                    title={t("templates.library", { defaultValue: "Template Library" })}
                    description="  Manage and discover email templates across your workspace."
                />
                <Space>
                    <Input
                        placeholder="Search templates..."
                        prefix={<SearchOutlined />}
                        style={{ width: 240 }}
                    />
                    <Button type="primary" icon={<PlusOutlined />}>
                        New Template
                    </Button>
                </Space>
            </Flex>
            <Space orientation="vertical" size={16} style={{ width: "100%" }}>
                {/* Filters bar */}
                <Card
                    size="small"
                    styles={{ body: { padding: "12px 16px" } }}
                >
                    <Row justify="space-between" align="middle" wrap>
                        <Col>
                            <Space size="large">
                                <Space size={4}>
                                    <FilterOutlined />
                                    <Text strong>FILTERS</Text>
                                </Space>

                                <Space size={8}>
                                    <Text type="secondary">Project:</Text>
                                    <Select
                                        defaultValue="all"
                                        variant="borderless"
                                        suffixIcon={<DownOutlined />}
                                        style={{ width: 130, background: theme ? "#0A1622" : "#F5F8FA" }}
                                        options={[
                                            { value: "all", label: "All Projects" },
                                            { value: "marketing", label: "Marketing Hub" },
                                            { value: "internal", label: "Internal Comms" },
                                            { value: "transactional", label: "Transactional" },
                                        ]}
                                    />
                                </Space>

                                <Space size={8}>
                                    <Text type="secondary">Status:</Text>
                                    <Segmented
                                        defaultValue="All"
                                        options={["All", "Published", "Draft"]}
                                    />
                                </Space>
                            </Space>
                        </Col>

                        <Col>
                            <Space size={8}>
                                <Text type="secondary">Sort:</Text>
                                <Select
                                    defaultValue="recent"
                                    variant="borderless"
                                    suffixIcon={<DownOutlined />}
                                    style={{ width: 150, background: theme ? "#0A1622" : "#F5F8FA" }}
                                    options={[
                                        { value: "recent", label: "Recently Updated" },
                                        { value: "name", label: "Name (A-Z)" },
                                        { value: "oldest", label: "Oldest First" },
                                    ]}
                                />
                            </Space>
                        </Col>
                    </Row>
                </Card>

                {/* Template cards */}
                <Row gutter={[16, 16]}>
                    {templates.map((tpl) => (
                        <Col key={tpl.key} xs={24} sm={12} lg={6}>
                            <Card
                                hoverable
                                styles={{ body: { padding: 16 } }}
                                cover={
                                    tpl.thumb ? (
                                        <div
                                            style={{
                                                height: 200,
                                                background: "#dcdfe4",
                                                borderBottom: "1px solid #f0f0f0",
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                height: 200,
                                                background: "#dcdfe4",
                                                borderBottom: "1px solid #f0f0f0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <FileImageOutlined
                                                style={{ fontSize: 28, color: "#bfbfbf" }}
                                            />
                                        </div>
                                    )
                                }
                            >
                                <Space
                                    style={{ width: "100%", justifyContent: "space-between" }}
                                    align="start"
                                >
                                    <Text strong ellipsis style={{ maxWidth: 130 }}>
                                        {tpl.name}
                                    </Text>
                                    <Tag color={statusColors[tpl.status]}>{tpl.status}</Tag>
                                </Space>

                                <div style={{ marginTop: 8 }}>
                                    <Space size={4}>
                                        <FolderOutlined style={{ color: "#8c8c8c" }} />
                                        <Text type="secondary">{tpl.project}</Text>
                                    </Space>
                                </div>

                                <Row
                                    justify="space-between"
                                    align="middle"
                                    style={{ marginTop: 16 }}
                                >
                                    <Space size={4}>
                                        <ClockCircleOutlined style={{ color: "#8c8c8c" }} />
                                        <Text type="secondary">{tpl.updated}</Text>
                                    </Space>
                                    <Tag variant="filled" style={{ background: theme ? "#0A1622" : "#F5F8FA" }}>
                                        {tpl.format}
                                    </Tag>
                                </Row>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Space>
            {templates.length === 0 && (
                <Empty description="No templates found" style={{ padding: "64px 0" }} />
            )}
        </PageContainer>
    );
}
