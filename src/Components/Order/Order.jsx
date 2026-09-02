import { FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Card, Table, Tag, Typography } from "antd"
import { t } from "i18next";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";
import { useEffect, useState } from "react";
import { getInvoices } from "../Plans/PlanApi";
import EmptyState from "../Styles/EmptyState";

const { Text, Link } = Typography;
function Order() {
    const theme = useSelector((state) => state?.app?.theme);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchInvoices = async () => {
        try {
            setLoading(true);

            const response = await getInvoices(0, 20);

            if (response?.status) {
                setInvoices(
                    (response.invoices || []).map((invoice, index) => ({
                        ...invoice,
                        key: invoice._id || index,
                    }))
                );
            } else {
                setInvoices([]);
            }
        } catch (error) {
            console.log(error);
            setInvoices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);
    const invoiceColumns = [
        {
            title: t("invoice.id", { defaultValue: "Invoice ID" }),
            dataIndex: "id",
            key: "id",
            render: (id) => <Text underline strong>{id}</Text>,
        },
        {
            title: t("invoice.date", { defaultValue: "Date" }),
            dataIndex: "date",
            key: "date"
        },
        {
            title: t("invoice.amount", { defaultValue: "Amount" }),
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: t("invoice.status", { defaultValue: "Status" }),
            dataIndex: "status",
            key: "status",
            render: (status) => <Tag color="success">{status}</Tag>,
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
            <Card title={t("billing.invoiceHistory", { defaultValue: "Invoice History" })}
                styles={{ body: { padding: 0 } }}
            >
                <Table
                    columns={invoiceColumns}
                    dataSource={invoices}
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