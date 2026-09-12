import { Modal, Table, Tag, Typography, Button, Flex, message, } from "antd";
import { CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { getSubscriptionHistory } from "./SearchHistoryApi";
import EmptyState from "../Styles/EmptyState";
import { useSelector } from "react-redux";
import { CURRENCIES_SYMBOL, formatDate } from "../../util/commom.utils";

const { Text } = Typography;

function SubscriptionHistory({ open, onCancel, }) {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const theme = useSelector((state) => state?.app?.theme);

    const fetchSearchHistory = async () => {
        try {
            setLoading(true);

            const response = await getSubscriptionHistory(0, 20);

            if (response?.status) {
                const historyItems = (response.items || []).flatMap((item) =>
                    (item.changes || []).map((change, changeIndex) => ({
                        ...change,
                        key: `${item._id}-${changeIndex}`,
                        billingInterval: item.billingInterval,
                    }))
                );

                setSearchHistory(historyItems);
            } else {
                setSearchHistory([]);
            }
        } catch (error) {
            console.log(error);
            setSearchHistory([]);
            message.error(error?.message)
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (open) {
            fetchSearchHistory();
        }
    }, [open]);

    const columns = [
        {
            title: t("sn", { defaultValue: "SN" }),
            key: "sn",
            render: (_, __, index) => (page - 1) * pageSize + (index + 1),
            width: 100,
        },
        {
            title: t("from.plan", { defaultValue: "From Plan" }),
            dataIndex: "fromPlanName",
            key: "fromPlanName",
            render: (value) => (
                <Text strong>
                    {value || "-"}
                </Text>
            ),
        },
        {
            title: t("to.plan", { defaultValue: "To Plan" }),
            dataIndex: "toPlanName",
            key: "toPlanName",
            render: (value) => (
                <Text strong>
                    {value || "-"}
                </Text>
            ),
        },
        {
            title: t("amount", { defaultValue: "Amount" }),
            dataIndex: "amount",
            key: "amount",
            render: (value, record) => {
                const currency = record?.currency || "INR";

                return (
                    <span>
                        <span style={{ fontSize: 16, marginRight: 3 }}>
                            {CURRENCIES_SYMBOL[currency]}
                        </span>
                        {Number(value || 0).toFixed(2)}
                    </span>
                );
            },
        },
        {
            title: t("change.type", { defaultValue: "Change type" }),
            dataIndex: "changeType",
            key: "changeType",
            render: (value) => {
                const type = value?.toLowerCase();
                return type
                    ? value.charAt(0).toUpperCase() + value.slice(1)
                    : "N/A";
            },
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "mode",
            key: "mode",
            render: (value) => (
                <Tag
                    bordered={false}
                    color={value === "immediate" ? "success" : value === "start_on_expiry" ? "warning" : "default"}
                >
                    {value === "immediate" ? "Immediate" : value === "start_on_expiry" ? "Start on Expiry" : value || "-"}
                </Tag>
            ),
        },
        {
            title: t("created.at", { defaultValue: "Created At" }),
            dataIndex: "at",
            key: "at",
            render: (value) => value ? formatDate(value) : "-",
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={860}
            closeIcon={null}
            styles={{
                content: { padding: 0, borderRadius: 10, overflow: "hidden", },
                header: { margin: 0, padding: "18px 24px", },
                body: { padding: "0 24px 20px", },
                mask: { backgroundColor: "rgba(0, 0, 0, 0.45)", },
            }}
            title={
                <Flex justify="space-between" align="center">
                    <Text strong style={{ fontSize: 16 }}>
                        {t("subscription.history", { defaultValue: "Subscription History", })}
                    </Text>

                    <Button type="text" icon={<CloseOutlined />} onClick={onCancel} />
                </Flex>
            }
        >
            <Table
                columns={columns}
                dataSource={searchHistory}
                loading={loading}
                scroll={{ x: "max-content" }}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    showSizeChanger: false,
                    onChange: (newPage, pageSize) => {
                        setPage(newPage);
                        setPageSize(pageSize)
                    },
                }}
                locale={{
                    emptyText: (
                        <EmptyState
                            icon={<FileTextOutlined />}
                            title={t("no.history.found", { defaultValue: "No History found" })}
                            description={t("no.history.description", { defaultValue: "There are no History items available.", })}
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
                                    background: theme ? "#0e1c29" : "#f0f0f0",
                                }}
                            />
                        ),
                    },
                }}
            />
        </Modal>
    );
}

export default SubscriptionHistory;