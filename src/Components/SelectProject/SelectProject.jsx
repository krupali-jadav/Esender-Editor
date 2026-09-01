import { Layout, Typography, Card, Tag, Space, ConfigProvider, theme as antdTheme, Spin, message, Select, Row, Col, Avatar, Button, Divider, Flex, Badge, } from "antd";
import { MoonOutlined, SunOutlined, RightOutlined, FolderOpenOutlined, CalendarOutlined, GlobalOutlined, PlusOutlined, FileTextOutlined, } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPanel, setTheme, setSelectedProject } from "../Redux/Reducer/reducer.app";
import { getProjectById, listProjects } from "./SelectProjectApi";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../util/commom.utils";
import lang from "../../util/lang/lang.json";
import { t } from "i18next";
import EmptyState from "../Styles/EmptyState";
const { Title, Text } = Typography;
const { Content, Header } = Layout;
const PRIMARY_COLOR = "#20A6CE";

export default function SelectProject() {
    const theme = useSelector((state) => state?.app?.theme);
    const panel = useSelector((state) => state?.app?.panel);
    const language = useSelector((state) => state.app.language);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDark = !!theme;
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const toggleTheme = () => {
        const newTheme = !theme;
        dispatch(setTheme(newTheme));
        const currentPanel = panel || {};

        dispatch(
            setPanel({
                ...currentPanel,
                esender: {
                    ...currentPanel.esender,
                    theme: {
                        algorithm: newTheme ? "dark" : "light",
                        token: {
                            colorPrimary: PRIMARY_COLOR,
                            borderRadius: 12,
                        },
                    },
                },
            })
        );
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await listProjects();
            const projectList = response?.projects || [];
            setProjects(
                Array.isArray(projectList)
                    ? projectList
                    : []
            );
        } catch (error) {
            console.error(error);
            message.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const handleProjectSelect = async (project) => {
        const projectId = project?._id || project?.id;

        if (!projectId) {
            message.error("Project ID not found");
            return;
        }

        try {
            setLoading(true);

            const response = await getProjectById(projectId);
            if (response?.status && response?.project) {
                const selectedProject = response.project;

                // Save selected project in Redux
                dispatch(setSelectedProject(selectedProject));

                message.success(response?.message);
                navigate("/overview");
            }
        } catch (error) {
            console.error("GET PROJECT ERROR:", error);
            message.error(error?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark
                    ? antdTheme.darkAlgorithm
                    : antdTheme.defaultAlgorithm,

                token: {
                    colorPrimary: PRIMARY_COLOR,
                    borderRadius: 12,
                    colorBgLayout: isDark
                        ? "#08151F"
                        : "#F6F9FB",
                    colorBgContainer: isDark
                        ? "#102634"
                        : "#FFFFFF",
                },

                components: {
                    Card: { borderRadiusLG: 16, },
                    Button: { borderRadius: 8, },
                    Select: { borderRadius: 8, },
                },
            }}
        >
            <Layout style={{ minHeight: "100vh", }}>

                {/* HEADER */}
                <Header
                    style={{
                        background: "transparent",
                        padding: "22px 40px",
                        height: "auto",
                        lineHeight: "normal",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}
                >
                    <Space size={12}>
                        <Button
                            type="text"
                            shape="circle"
                            size="large"
                            icon={isDark ? (<MoonOutlined />) : (<SunOutlined />)}
                            onClick={toggleTheme}
                        />

                        <Select
                            value={language ?? "en"}
                            showSearch
                            variant="filled"
                            style={{ width: 130, }}
                            popupMatchSelectWidth={200}
                            options={lang?.map((item) => ({
                                value: item.key,
                                label: item.name,
                            }))}
                            filterOption={(input, option) =>
                                option?.label?.toLowerCase().includes(input.toLowerCase())
                            }
                        />
                    </Space>
                </Header>

                <Content style={{ padding: "0 50px 60px", }}>

                    <Row justify="space-between" align="middle" gutter={[20, 20]}>
                        <Col>
                            <Space direction="vertical" size={4}>
                                <Space size={10}>
                                    <Avatar
                                        shape="square"
                                        size={42}
                                        icon={<FolderOpenOutlined />}
                                        style={{ background: "rgba(32,166,206,0.12)", color: PRIMARY_COLOR, }}
                                    />
                                    <Title level={2} style={{ margin: 0, }}>{t("your.projects", { defaultValue: "Your Projects" })}</Title>
                                </Space>

                                <Text type="secondary" style={{ marginLeft: 52, }}>
                                    {t("selectProject.description", { defaultValue: "Select a project to manage your email marketing campaigns and templates." })}
                                </Text>
                            </Space>
                        </Col>
                    </Row>

                    {!loading &&
                        projects.length > 0 && (
                            <Flex align="center" gap={8} style={{ marginTop: 35, }}>
                                <Text strong>{t("allProjects", { defaultValue: "All Projects" })}</Text>
                                <Badge count={projects.length} color={PRIMARY_COLOR} />
                            </Flex>
                        )}

                    <Space style={{ marginTop: 20, width: "100%" }} direction="vertical" size={12} >
                        {loading ? (
                            <Flex justify="center" align="center" style={{ minHeight: 350, }}>
                                <Space direction="vertical" align="center">
                                    <Spin size="middle" />
                                    <Text type="secondary">{t("loadingProjects", { defaultValue: "Loading projects..." })}</Text>
                                </Space>
                            </Flex>
                        ) : projects.length === 0 ? (
                            <Card style={{ marginTop: 35, textAlign: "center", }}>
                                <EmptyState
                                    icon={<FileTextOutlined />}
                                    title={t('no.Projects', { defaultValue: 'No projects yet' })}
                                    description={t('create.First.Project', { defaultValue: 'Create your first project to get started.' })}
                                />
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate("/workflow")}>
                                    {t("createProject", { defaultValue: "Create Project" })}
                                </Button>
                            </Card>
                        ) : (
                            <Row gutter={[20, 20,]}>
                                {projects.map((project) => {
                                    const projectId = project?.id || project?._id;

                                    return (
                                        <Col key={projectId} xs={24} sm={12} lg={8} xl={6}>
                                            <Card hoverable
                                                onClick={() => handleProjectSelect(project)}
                                                styles={{ body: { padding: 0, }, }}>

                                                <div style={{ padding: 20, }}>
                                                    <Flex justify="space-between" align="start">
                                                        <Avatar shape="square" size={50}
                                                            icon={<FolderOpenOutlined />}
                                                            style={{ background: "rgba(32,166,206,0.12)", color: PRIMARY_COLOR, }}
                                                        />

                                                        <Tag color="cyan" bordered={false}>
                                                            {((project?.environment || "DEFAULT").toUpperCase())}
                                                        </Tag>
                                                    </Flex>

                                                    <Space direction="vertical" size={2} style={{ marginTop: 18, width: "100%", }}>
                                                        <Text strong ellipsis style={{ fontSize: 18, }}>
                                                            {project?.name}
                                                        </Text>

                                                        <Text type="secondary" style={{ fontSize: 13, }}>{t("email.marketing.project", { defaultValue: "Email marketing project" })}</Text>
                                                    </Space>
                                                </div>

                                                <Divider style={{ margin: 0, }} />

                                                <div style={{ padding: "16px 20px", }}>
                                                    <Space direction="vertical" size={14} style={{ width: "100%", }}>
                                                        <Flex justify="space-between" align="center">
                                                            <Space size={8}>
                                                                <CalendarOutlined style={{ color: PRIMARY_COLOR, }} />
                                                                <Text type="secondary">{t("created", { defaultValue: "Created" })}</Text>
                                                            </Space>

                                                            <Text style={{ fontSize: 12, }}>{formatDate(project?.createdAt)}</Text>
                                                        </Flex>

                                                        <Flex justify="space-between" align="center">
                                                            <Space size={8}>
                                                                <GlobalOutlined style={{ color: PRIMARY_COLOR, }} />
                                                                <Text type="secondary">{t("environment", { defaultValue: "Environment" })}</Text>
                                                            </Space>

                                                            <Text strong>{project?.environment || "Default"}</Text>
                                                        </Flex>
                                                    </Space>
                                                </div>

                                                <Divider style={{ margin: 0, }} />

                                                <Flex justify="space-between" align="center" style={{ padding: "12px 20px", }}>
                                                    <Text type="secondary" style={{ fontSize: 12, }}>
                                                        {t("open_workspace", { defaultValue: "Open workspace" })}
                                                    </Text>

                                                    <Button
                                                        type="text"
                                                        shape="circle"
                                                        icon={<RightOutlined />}
                                                        style={{ color: PRIMARY_COLOR, }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleProjectSelect(project);
                                                        }}
                                                    />
                                                </Flex>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </Space>
                </Content>
            </Layout>
        </ConfigProvider>
    );
}