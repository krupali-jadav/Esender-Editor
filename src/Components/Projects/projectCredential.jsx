import React, { useEffect, useState } from "react";
import { PageContainer } from "@ant-design/pro-components";
import {
    Button,
    Card,
    Flex,
    Table,
    Typography,
    message,
} from "antd";
import { KeyOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { t } from "i18next";
import { useSelector } from "react-redux";
import EmptyState from "../Styles/EmptyState";
import { getEditorApiKeys } from "./ProjectsApi";

const { Text } = Typography;

function ProjectCredential() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const theme = useSelector((state) => state?.app?.theme);

    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEditorApiKeys = async () => {
        try {
            setLoading(true);

            const response = await getEditorApiKeys(projectId);

            if (response?.status) {
                setApiKeys(
                    (response?.editor_keys || response?.data || []).map(
                        (item, index) => ({
                            ...item,
                            key: item?._id || item?.id || index,
                        })
                    )
                );
            } else {
                setApiKeys([]);
            }
        } catch (error) {
            console.log(error);
            setApiKeys([]);

            message.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to fetch Editor API keys"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchEditorApiKeys();
        }
    }, [projectId]);

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
            dataIndex: "key",
            key: "apiKey",
            render: (key) => (
                <Text copyable={{ text: key }}>
                    {key || "-"}
                </Text>
            ),
        },
        {
            title: t("created.at", { defaultValue: "Created At" }),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) =>
                date ? new Date(date).toLocaleString() : "-",
        },
    ];

    return (
        <div style={{ padding: "5px 24px" }}>
            <Flex justify="end" style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    // onClick={() =>
                    //     navigate(`/projects/${projectId}/credentials/create`)
                    // }
                >
                    {t("create.editor.key", {defaultValue: "Create Editor Key"})}
                </Button>
            </Flex>
            <Card styles={{ body: { padding: 0 } }}>
                <Table
                    columns={columns}
                    dataSource={apiKeys}
                    loading={loading}
                    scroll={{ x: "max-content" }}
                    pagination={false}
                    locale={{
                        emptyText: (
                            <EmptyState
                                icon={<KeyOutlined />}
                                title={t(
                                    "no.editor.api.keys",
                                    {
                                        defaultValue:
                                            "No Editor API Keys Found",
                                    }
                                )}
                                description={t(
                                    "no.editor.api.keys.description",
                                    {
                                        defaultValue:
                                            "There are no Editor API keys available.",
                                    }
                                )}
                            />
                        ),
                    }}
                    components={{
                        header: {
                            cell: (props) => (
                                <th
                                    {...props}
                                    style={{
                                        ...props.style,
                                        background: theme
                                            ? "#0e1c29"
                                            : "#f0f0f0",
                                    }}
                                />
                            ),
                        },
                    }}
                />
            </Card>
        </div>
    );
}

export default ProjectCredential;