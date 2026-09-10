import { DownloadOutlined, DownOutlined, FileTextOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Button, Card, Flex, Input, Segmented, Select, Space, Table, Tag, Typography } from "antd"
import { t } from "i18next";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";
import { useEffect, useState } from "react";
import { getOrders } from "./OrderApi";
import EmptyState from "../Styles/EmptyState";
import { Link } from "react-router-dom";
import { CURRENCIES_SYMBOL, formatDate } from "../../util/commom.utils";
import StatusBadge from "../Styles/StatusBadge";
const { Text } = Typography;

function Order() {
    const theme = useSelector((state) => state?.app?.theme);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("created-at");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await getOrders(0, 20);

            if (response?.status) {
                setOrder(
                    (response.orders || []).map((invoice, index) => ({
                        ...invoice,
                        key: invoice._id || index,
                    }))
                );
            } else {
                setOrder([]);
            }
        } catch (error) {
            console.log(error);
            setOrder([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const orderColumns = [
        {
            title: t("order.id", { defaultValue: "Order ID" }),
            dataIndex: "_id",
            key: "id",
            render: (id) => (
                <Text copyable={{ text: id }}>
                    <Link to={`/invoice/${id}`}>
                        {id}
                    </Link>
                </Text>
            ),
        },
        {
            title: t("plan.name", { defaultValue: "Plan Name" }),
            dataIndex: "planName",
            key: "planName"
        },
        {
            title: t("billing.interval", { defaultValue: "Billing Interval" }),
            dataIndex: "billingInterval",
            key: "billingInterval"
        },
        {
            title: t("billing.amount", { defaultValue: "Amount" }),
            dataIndex: "total",
            key: "amount",
            render: (_, record) => (
                <>
                    {CURRENCIES_SYMBOL[record.currency]} {record.total}
                </>
            )
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <StatusBadge status={status === "paid" ? "completed" : "failed"} label={status} />
            )
        },
        {
            title: t("payment.gateway", { defaultValue: "Payment Gateway" }),
            dataIndex: "gateway",
            key: "gateway"
        },
        {
            title: t("created.at", { defaultValue: "Created At" }),
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => formatDate(date),
        },
    ];
    return (
        <PageContainer title={false}>
            <AppPageHeader
                eyebrow={t("account", { defaultValue: "Account" })}
                title={t("orders", { defaultValue: "Orders" })}
                description={t("orders.description", { defaultValue: "View and manage your order history, invoices, and payment details." })}
            />

            <Space direction="vertical" size="large" style={{ width: "100%" }}>

                <Card size="small">
                    <Flex gap={24} justify="space-between" align="center" wrap="wrap" >
                        {/* Search */}
                        <Input
                            placeholder="Search Orders..."
                            prefix={<SearchOutlined />}
                            allowClear
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ flex: 1, width: "100%", maxWidth: 500, minWidth: 200, }}
                        />

                        {/* Filters */}
                        <Flex gap={16} justify="end" wrap="wrap">

                            <Space size={4}>
                                <FilterOutlined />
                                <Text strong>{t('filters', { defaultValue: 'FILTERS' })}</Text>
                            </Space>

                            <Space size={8}>
                                <Text type="secondary">{t('status', { defaultValue: 'Status' })}:</Text>
                                <Segmented
                                    defaultValue="all"
                                    options={[
                                        t('all', { defaultValue: 'All' }),
                                        t('paid', { defaultValue: 'Paid' }),
                                        t('pending', { defaultValue: 'Pending' })
                                    ]}
                                />
                            </Space>

                            <Space size={8}>
                                <Text type="secondary">{t('sort', { defaultValue: 'Sort' })}:</Text>
                                <Select
                                    value={sortBy}
                                    onChange={(value) => setSortBy(value)}
                                    variant="borderless"
                                    suffixIcon={<DownOutlined />}
                                    style={{ width: 150, background: theme ? "#0A1622" : "#F5F8FA", borderRadius: 8, }}
                                    options={[
                                        {
                                            value: "created-at",
                                            label: t('sort.created.at', { defaultValue: 'Sort by Created At' }),
                                        },
                                        {
                                            value: "name",
                                            label: t('sort.name', { defaultValue: 'Sort by Name' }),
                                        },
                                    ]}
                                />
                            </Space>

                            <Space>
                                <Button type="primary" style={{ minWidth: "18%" }} icon={<DownloadOutlined />}>
                                    {t("export", { defaultValue: "Export", })}
                                </Button>
                            </Space>
                        </Flex>
                    </Flex>
                </Card>

                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={orderColumns}
                        dataSource={order}
                        loading={loading}
                        pagination={false}
                        scroll={{ x: "max-content" }}
                        locale={{
                            emptyText: (
                                <EmptyState
                                    icon={<FileTextOutlined />}
                                    title={t("no.orders.found", { defaultValue: "No Orders Found" })}
                                    description={t("no.orders.description", { defaultValue: "There are no Orders available.", })}
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
                </Card>
            </Space>
        </PageContainer>
    )
}

export default Order