import { FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Card, Table, Tag, Typography } from "antd"
import { t } from "i18next";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";
import { useEffect, useState } from "react";
import { getOrders } from "./OrderApi";
import EmptyState from "../Styles/EmptyState";
import { useNavigate } from "react-router-dom";
const { Text, Link } = Typography;

function Order() {
    const navigate = useNavigate();
    const theme = useSelector((state) => state?.app?.theme);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const orders = [
        {
            _id: "ORD-001",
            planName: "Pro Plan",
            billingInterval: "Monthly",
            amount: 999,
            status: "Paid",
            paymentGateway: "Stripe",
        },
    ];
    const invoiceColumns = [
        {
            title: t("order.id", { defaultValue: "Order ID" }),
            dataIndex: "_id",
            key: "id",
            render: (id) => (
                <Text
                    underline
                    strong
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/invoice/12345`)}
                >
                    {id}
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
            key: "amount"
        },
        {
            title: t("status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color="success">{status}</Tag>,
        },
        {
            title: t("payment.gateway", { defaultValue: "Payment Gateway" }),
            dataIndex: "gateway",
            key: "gateway",
            render: (gateway) => <Tag color="success">{gateway}</Tag>,
        },
        {
            title: t("invoice.action", { defaultValue: "Action" }),
            key: "action",
            align: "right",
            render: () => (
                <Link>
                    <FilePdfOutlined /> {t("view.Pdf", { defaultValue: "View PDF" })}
                </Link>
            ),
        },
    ];
    return (
        <PageContainer title={false}>
            <AppPageHeader
                title={t("orders", { defaultValue: "Orders" })}
                description={t("orders.description", { defaultValue: "View and manage your order history, invoices, and payment details." })}
            />
            <Card title={t("billing.invoiceHistory", { defaultValue: "Invoice History" })} styles={{ body: { padding: 0 } }}>
                <Table
                    columns={invoiceColumns}
                    dataSource={orders}
                    loading={loading}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    locale={{
                        emptyText: (
                            <EmptyState
                                icon={<FileTextOutlined />}
                                title={t("no.orders.found", { defaultValue: "No Orders found" })}
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
        </PageContainer>
    )
}

export default Order