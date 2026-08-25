import {
    Layout,
    Typography,
    Card,
    Tag,
    Button,
    Space,
    ConfigProvider,
    theme as antdTheme,
    Spin,
    Empty,
    message,
} from "antd";
import {
    MoonOutlined,
    SunOutlined,
    RightOutlined,
    FolderOpenOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setSelectedProject, setTheme } from "../Redux/Reducer/reducer.app";
import { getProjectById, listProjects } from "./SelectProjectApi";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../util/commom.utils";

const { Title, Text } = Typography;
const { Content, Header } = Layout;

export default function SelectProject() {
    const theme = useSelector((state) => state?.app?.theme);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isDark = !!theme;

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        try {
            setLoading(true);

            const response = await listProjects();

            const projectList = response?.projects || [];

            setProjects(Array.isArray(projectList) ? projectList : []);
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

            console.log("GET PROJECT RESPONSE:", response);

            if (response?.status && response?.project) {
                const selectedProject = response.project;

                // Save selected project in Redux
                dispatch(setSelectedProject(selectedProject));

                // Save selected project for refresh
                localStorage.setItem(
                    "selectedProject",
                    JSON.stringify(selectedProject)
                );

                message.success(
                    "Project selected successfully"
                );

                navigate("/overview");
            }
        } catch (error) {
            console.error("GET PROJECT ERROR:", error);

            message.error(
                error?.response?.data?.message ||
                "Failed to select project"
            );
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
                    colorPrimary: "#20A6CE",
                    colorBgBase: isDark ? "#0A101C" : "#F5F7FA",
                    colorBgLayout: isDark ? "#0A101C" : "#F5F7FA",
                    colorBgContainer: isDark ? "#152A3C" : "#FFFFFF",
                },
            }}
        >
            <Layout
                style={{
                    minHeight: "100vh",
                    background: isDark ? "#0A101C" : "#F5F7FA",
                    padding: "0 0 0 200px",
                }}
            >
                <Header
                    style={{
                        background: "transparent",
                        padding: "24px 40px 0",
                        height: "auto",
                        lineHeight: "normal",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "flex-start",
                    }}
                >
                    <Button
                        shape="circle"
                        icon={
                            isDark ? (
                                <MoonOutlined />
                            ) : (
                                <SunOutlined />
                            )
                        }
                        onClick={() => dispatch(setTheme(!isDark))}
                    />
                </Header>

                <Content
                    style={{
                        padding: "24px 40px",
                    }}
                >
                    <Title
                        level={2}
                        style={{
                            marginBottom: 4,
                        }}
                    >
                        Your Projects
                    </Title>

                    <Text type="secondary">
                        Choose a project to continue working
                    </Text>

                    {loading ? (
                        <Space
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                marginTop: 50,
                            }}
                        >
                            <Spin size="large" />
                        </Space>
                    ) : projects.length === 0 ? (
                        <Empty
                            description="No projects found"
                            style={{ marginTop: 50 }}
                        />
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 24,
                                marginTop: 32,
                            }}
                        >
                            {projects.map((project) => (
                                <Card
                                    key={project.id || project._id}
                                    style={{
                                        width: 350,
                                    }}
                                    styles={{
                                        body: {
                                            padding: 20,
                                            height: "250px",
                                        },
                                    }}
                                >
                                    <Space
                                        align="start"
                                        style={{
                                            width: "100%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>
                                            <Text
                                                strong
                                                style={{ fontSize: 20 }}
                                            >
                                                <FolderOpenOutlined style={{ color: "#20A6CE", fontSize: 22 }} /> {project.name}
                                            </Text>

                                            <div>
                                                <Text type="secondary">
                                                    1 project
                                                </Text>
                                            </div>
                                        </div>
                                    </Space>

                                    <div style={{ marginTop: 16 }}>
                                        <div
                                            onClick={() => handleProjectSelect(project)}
                                            style={{
                                                background: isDark
                                                    ? "#111A29"
                                                    : "#F5F7FA",
                                                padding: "12px 16px",
                                                display: "flex",
                                                borderRadius: 8,
                                                alignItems: "center",
                                                justifyContent:
                                                    "space-between",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <div>
                                                <Text strong>
                                                    {project.name}
                                                </Text>

                                                <div>
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 13,
                                                        }}
                                                    >
                                                        Created At: {formatDate(project.createdAt)}
                                                    </Text>
                                                </div>
                                            </div>

                                            <Space size={8}>
                                                <Tag
                                                    color={
                                                        project.status ===
                                                            "LIVE"
                                                            ? "default"
                                                            : "processing"
                                                    }
                                                    style={{
                                                        fontWeight: 600,
                                                        fontSize: 11,
                                                    }}
                                                >
                                                    {project.status ||
                                                        "ACTIVE"}
                                                </Tag>

                                                <RightOutlined
                                                    style={{
                                                        fontSize: 12,
                                                    }}
                                                />
                                            </Space>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </Content>
            </Layout>
        </ConfigProvider>
    );
}