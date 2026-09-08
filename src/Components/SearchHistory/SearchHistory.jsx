import {Modal, Table, Tag, Typography, Button, Flex,} from "antd";
import { CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { getsearchHistory } from "./SearchHistoryApi";
import EmptyState from "../Styles/EmptyState";
import { useSelector } from "react-redux";
import { formatDate } from "../../util/commom.utils";

const { Text } = Typography;

function SearchHistory({ open, onCancel, }) {
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useSelector((state) => state?.app?.theme);

    const fetchSearchHistory = async () => {
        try {
            setLoading(true);

            const response = await getsearchHistory(0, 20);

            if (response?.status) {
                setSearchHistory(
                    (response.items || []).map((items, index) => ({
                        ...items,
                        key: items._id || index,
                    }))
                );
            } else {
                setSearchHistory([]);
            }
        } catch (error) {
            console.log(error);
            setSearchHistory([]);
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
            title: t("plan.name", { defaultValue: "Plan Name" }),
            dataIndex: "planName",
            key: "planName",
            render: (value) => (
                <Text strong>{value || "N/A"}</Text>
            ),
        },
        {
            title: t("billing.cycle", { defaultValue: "Billing Cycle" }),
            dataIndex: ["planSnapshot", "billingInterval"],
            key: "billingCycle",
            render: (value) =>
                value
                    ? value.charAt(0).toUpperCase() + value.slice(1)
                    : "N/A",
        },
        {
            title: t("amount", { defaultValue: "Amount" }),
            dataIndex: ["planSnapshot", "price"],
            key: "amount",
            render: (value, record) => {
                const symbol =
                    record?.currency === "INR"
                        ? "₹"
                        : record?.currency === "USD"
                            ? "$"
                            : record?.currency || "";

                return `${symbol}${Number(value || 0).toFixed(2)}`;
            },
        },
        {
            title: t("activated", { defaultValue: "Activated" }),
            dataIndex: "activatedAt",
            key: "activated",
            render: (value) => value ? formatDate(value) : "-",
        },
        {
            title: t("expiry.date", { defaultValue: "Expiry Date" }),
            dataIndex: "usageCycleEndAt",
            key: "expiryDate",
            render: (value) => value ? formatDate(value) : "-",
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status?.toLowerCase() === "active"
                            ? "success"
                            : status?.toLowerCase() === "pending"
                                ? "warning"
                                : "default"
                    }
                    bordered={false}
                >
                    {status || "N/A"}
                </Tag>
            ),
        },
    ];

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            width={860}
            // destroyOnClose
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
                        {t("subscription.history", {defaultValue: "Subscription History",})}
                    </Text>

                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={onCancel}
                        style={{
                            width: 42,
                            height: 42,
                            fontSize: 18,
                        }}
                    />
                </Flex>
            }
        >
            <Table
                columns={columns}
                dataSource={searchHistory}
                loading={loading}
                pagination={false}
                scroll={{ x: "max-content" }}
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

export default SearchHistory;