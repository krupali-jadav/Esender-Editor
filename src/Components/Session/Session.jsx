import React, { useEffect, useState } from "react";
import { Button, Col, Row, Spin, Typography, notification, Flex, Space, Card } from "antd";
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
        console.log("Calling session API...");
        setLoading(true);
        try {
            const data = await sessionAll({ status: "all" });
            if (data.status) {
                setSessionData(data.sessions);
            }
        } catch (error) {
            notification.error({ message: "Error", description: "Failed to fetch session data." });
            console.error("Error fetching session devices:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        sessionDevices();
    }, []);
    const handleSessionLogout = (id) => {
        staticModal.confirm({
            title: t("confirm.logout"),
            icon: <InfoCircleOutlined />,
            content: t("session.content"),
            cancelText: t("cancel"),
            okText: t("ok"),
            onOk: async () => {
                setButtonLoading((prev) => ({ ...prev, [id]: true }));
                try {
                    const data = await sessionLogout({ session_id: id });
                    if (data?.status) {
                        notification.success({
                            message: t("success"),
                            description: t("session.successfully"),
                        });
                        await sessionDevices();
                    }
                } catch (error) {
                    notification.error({
                        message: t("error"),
                        description: t("failed.log.out.session."),
                    });
                    console.error("Error logging out session devices:", error);
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
                                        {item?.createdAt
                                            ? formatDate(item.createdAt)
                                            : "N/A"}
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
                                            {t("layout.logout")}
                                        </Button>
                                    ) : (
                                        <Text type="secondary">{t("signedout")}</Text>
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
                eyebrow="Account"
                title={t("session", { defaultValue: "Sessions" })}
                description="Review and sign out of devices logged into your account."
            />
            {loading ? (
                <Flex
                    justify="center"
                    align="center"
                    style={{ height: "50vh" }}
                >
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
                            t("desktop.sessions")
                        )}
                    </Col>
                    <Col xs={24} md={12}>
                        {renderSessions(
                            sessionData?.filter((item) => item?.info?.os?.name?.toLowerCase() === "android"),
                            <MobileOutlined />,
                            "#FAAD14",
                            t("mobile.sessions")
                        )}
                    </Col>
                </Row>
            )}
        </PageContainer>
    );
};

export default Sessions;