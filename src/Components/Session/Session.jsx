import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spin, Typography, notification, Flex, Space, Card, message } from "antd";
import { staticModal } from "../../util/staticFn";
import { WindowsOutlined, MobileOutlined, LogoutOutlined, InfoCircleOutlined, } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";

import { t } from "i18next";
import { formatDate } from "../../util/commom.utils";
import { sessionAll, sessionLogout } from "./SessionApi";
import AppPageHeader from "../Styles/AppHeader";
const { Title, Text } = Typography;

const Sessions = () => {
    const [sessionData, setSessionData] = useState([]);
    const [loadingButton, setButtonLoading] = useState({});
    const [loading, setLoading] = useState(false);

    const sessionDevices = async () => {
        setLoading(true);
        try {
            const data = await sessionAll({ status: "all" });
            if (data.status) {
                setSessionData(data.sessions);
            }
        } catch (error) {
            message.error(error?.message || "Failed to get sessions");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        sessionDevices();
    }, []);

    const handleSessionLogout = (id) => {
        staticModal.confirm({
            title: t("confirm.logout", { defaultValue: "Confirm Logout" }),
            icon: <InfoCircleOutlined />,
            content: t("are.you.sure.want.to.logout.of.this.session", { defaultValue: "Are you sure you want to log out of this session?" }),
            cancelText: t("cancel", { defaultValue: "Cancel" }),
            okText: t("ok", { defaultValue: "OK" }),
            onOk: async () => {
                setButtonLoading((prev) => ({ ...prev, [id]: true }));
                try {
                    const data = await sessionLogout({ session_id: id });
                    if (data?.status) {
                        message.success(data?.message || "Session logged out successfully");
                        await sessionDevices();
                    }
                } catch (error) {
                    message.error(error?.message || "Failed to log out session");
                    console.error(error);
                } finally {
                    setButtonLoading((prev) => ({ ...prev, [id]: false }));
                }
            },
        });
    };

    const renderSessions = (sessions, icon, color, title) => (
        <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Row gutter={[16, 24]} align="middle" justify="space-between"  >
                    <Col>
                        <Space align="center">
                            {React.cloneElement(icon, { style: { color, fontSize: "28px" } })}
                            <Title level={5}>{title}</Title>
                        </Space>

                    </Col>
                    <Col>

                        <Title level={4}>
                            {sessions?.length}
                        </Title>
                    </Col>
                </Row>
                <div style={{ maxHeight: "450px", overflowY: "auto", }}>
                    {sessions?.map((item) => (
                        <Card key={item._id}
                            styles={{ body: { padding: 16 } }}
                            style={{ marginBottom: 12 }}
                        >
                            <Row justify="space-between" align="middle">
                                <Col>
                                    <Text strong>
                                        {item?.info?.os || "Unknown OS"}
                                    </Text>
                                    <br />

                                    <Text type="secondary">
                                        {item?.info?.browser || "Unknown Browser"}
                                    </Text>
                                    <br />
                                    <Text type="secondary">
                                        {t("last.active")}{" "}
                                        {item?.createdAt ? formatDate(item.createdAt) : "N/A"}
                                    </Text>
                                </Col>
                                <Col>
                                    {!item?.logout ? (
                                        <Button
                                            type="primary"
                                            icon={<LogoutOutlined />}
                                            loading={loadingButton[item._id]}
                                            onClick={() => handleSessionLogout(item._id)}
                                        >
                                            {t("layout.logout", { defaultValue: "Layout Logout" })}
                                        </Button>
                                    ) : (
                                        <Text type="secondary">{t("signedout", { defaultValue: "Signed Out" })}</Text>
                                    )}
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </Space>
        </Card>
    );

    return (
        <PageContainer title={false} breadcrumb={false}>
            <AppPageHeader
                eyebrow={t("account", { defaultValue: "Account" })}
                title={t("session", { defaultValue: "Sessions" })}
                description="Review and sign out of devices logged into your account."
            />
            {loading ? (
                <Flex justify="center" align="center" style={{ height: "50vh" }}>
                    <Spin spinning={loading} />
                </Flex>
            ) : (
                <Row
                    gutter={[16, 24]}
                    style={{ minHeight: "57vh" }}
                >
                    <Col xs={24} md={12}>
                        {renderSessions(
                            sessionData?.filter(
                                (item) =>
                                    item?.info?.os?.toLowerCase() === "windows"
                            ),
                            < WindowsOutlined />,
                            "#52C41A",
                            t("desktop.sessions", { defaultValue: "Desktop Sessions" })
                        )}
                    </Col>
                    <Col xs={24} md={12}>
                        {renderSessions(
                            sessionData?.filter((item) => item?.info?.os?.name?.toLowerCase() === "android"),
                            <MobileOutlined />,
                            "#FAAD14",
                            t("mobile.sessions", { defaultValue: "Mobile Sessions" })
                        )}
                    </Col>
                </Row>
            )}
        </PageContainer>
    );
};

export default Sessions;