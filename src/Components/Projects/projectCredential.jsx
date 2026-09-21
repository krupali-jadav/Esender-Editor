import { useEffect, useState } from "react";
import { Badge, Button, Card, Dropdown, Flex, Table, Tag, Tooltip, Typography, message, } from "antd";
import { DownloadOutlined, KeyOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useSelector } from "react-redux";
import EmptyState from "../Styles/EmptyState";
import { getEditorApiKeys, revokeEditorApiKey, rotateEditorApiKey } from "./ProjectsApi";
import CreateEditorKey from "./CreateEditorKey";
import { FaRotateLeft, FaRotateRight } from "react-icons/fa6";
import { getCurrentTime } from "../../util/commom.utils";
import { exportToExcel } from "react-json-to-excel";
const { Text } = Typography;

function ProjectCredential() {
    const selectedProject = useSelector((state) => state?.app?.selectedProject);
    const projectId = selectedProject?._id;
    const theme = useSelector((state) => state?.app?.theme);
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [createEditorKeyOpen, setCreateEditorKeyOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const fetchEditorApiKeys = async () => {
        try {
            setLoading(true);

            const response = await getEditorApiKeys(projectId);

            if (response?.status) {
                const keys = response?.keys || [];
                setApiKeys(Array.isArray(keys) ? keys : []);
            } else {
                setApiKeys([]);
            }
        } catch (error) {
            console.log(error);
            setApiKeys([]);
            message.error(error?.message || "Failed to fetch editor API keys");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchEditorApiKeys();
        }
    }, [projectId]);

    const onExport = async () => {
        try {
            setExporting(true);

            const data = await getEditorApiKeys(projectId);

            if (data?.status) {
                const allKeys = data?.keys || [];

                const exportData = allKeys.map((key) => ({
                    keyId: key?.id,
                    KeyName: key?.name,
                    EditorApiKey: key?.publicPrefix,
                    Environment: key?.environment,
                    Status: key?.status,
                    createdAt: key?.createdAt,
                    ExpiresAt: key?.expiresAt,
                }));
                exportToExcel(exportData, `all_Keys_${getCurrentTime()}`);
            } else {
                message.error(data?.message);
            }
        } catch (error) {
            message.error(error?.message);
        } finally {
            setExporting(false);
        }
    };

    const handleRotate = async (editorKeyId) => {
        try {
            const response = await rotateEditorApiKey(
                projectId,
                editorKeyId
            );

            if (response?.status) {
                message.success(response?.message);
                fetchEditorApiKeys();
            }
        } catch (error) {
            message.error(error?.message);
        }
    };

    const handleRevoke = async (editorKeyId) => {
        try {
            const response = await revokeEditorApiKey(
                projectId,
                editorKeyId
            );

            if (response?.status) {
                message.success(response?.message || "Editor API key revoked successfully");
                fetchEditorApiKeys();
            }
        } catch (error) {
            message.error(error?.message || "Failed to revoked Editor API key");
        }
    };

    const columns = [
        {
            title: t("sn", { defaultValue: "SN" }),
            key: "sn",
            render: (_, __, index) => index + 1,
            width: 80,
        },
        {
            title: t("name", { defaultValue: "Name" }),
            dataIndex: "name",
            key: "name",
            render: (name) => name || "-",
        },
        {
            title: t("editor.api.key", { defaultValue: "Editor API Key" }),
            dataIndex: "publicPrefix",
            key: "publicPrefix",
            render: (prefix) => (
                <Text copyable={!!prefix}>
                    {prefix || "-"}
                </Text>
            ),
        },
        {
            title: t("environment", { defaultValue: "Environment" }),
            dataIndex: "environment",
            key: "environment",
            render: (environment) => (
                <Tag color={environment === "live" ? "blue" : "default"}>
                    {environment}
                </Tag>
            ),
        },
        {
            title: t("status", { defaultValue: "Status", }),
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Badge
                    status={status === "active" ? "success" : "warning"}
                    text={status}
                />
            ),
        },
        {
            title: t("created.at", { defaultValue: "Created At", }),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? new Date(date).toLocaleString() : "-",
        },
        {
            title: t("expires.at", { defaultValue: "Expires At", }),
            dataIndex: "expiresAt",
            key: "expiresAt",
            render: (date) => date ? new Date(date).toLocaleString() : "-",
        },
        {
            title: t("action", { defaultValue: "Action" }),
            key: "action",
            fixed: "right",
            width: 90,
            onCell: () => ({
                style: {
                    background: "var(--ant-color-bg-container)",
                    position: "sticky",
                    right: 0,
                    zIndex: 3,
                },
            }),

            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: "1",
                                label: t("edit", { defaultValue: "Rotate", }),
                                onClick: () => handleRotate(record.id),
                            },
                            {
                                key: "2",
                                label: t("delete", { defaultValue: "Delete", }),
                                danger: true,
                                onClick: () => handleRevoke(record.id),
                            },
                        ],
                    }}
                    trigger={["click"]}
                    placement="bottomLeft"
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        onClick={(e) => e.stopPropagation()}
                    />
                </Dropdown>
            ),
        },
    ];

    return (
        <div style={{ padding: "5px 24px" }}>
            <Flex gap="middle" justify="end" style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateEditorKeyOpen(true)}
                    style={{ background: "#20A6CE" }}
                >
                    {t("create.editor.key", { defaultValue: "Create Editor Key" })}
                </Button>
                <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={onExport}
                    loading={exporting}
                    style={{ background: "#20A6CE" }}
                >
                    {t("export", { defaultValue: "Export" })}
                </Button>
            </Flex>
            <Card styles={{ body: { padding: 0 } }}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={apiKeys}
                    loading={loading}
                    scroll={{ x: "max-content" }}
                    pagination={true}
                    locale={{
                        emptyText: (
                            <EmptyState
                                icon={<KeyOutlined />}
                                title={t("no.editor.api.keys.found", { defaultValue: "No Editor API Keys Found", })}
                                description={t("no.editor.api.keys.available", { defaultValue: "There are no Editor API keys available.", })}
                            />
                        ),
                    }}
                    components={{
                        header: {
                            cell: (props) => (
                                <th
                                    {...props}
                                    style={{ ...props.style, background: theme ? "#0e1c29" : "#f0f0f0", }}
                                />
                            ),
                        },
                    }}
                />
            </Card>

            <CreateEditorKey
                open={createEditorKeyOpen}
                onClose={() => setCreateEditorKeyOpen(false)}
                projectId={projectId}
                onSuccess={() => {
                    fetchEditorApiKeys();
                }}
            />
        </div>
    );
}

export default ProjectCredential;