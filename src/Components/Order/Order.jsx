import { FilePdfOutlined } from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import { Card, Table, Tag, Typography } from "antd"
import { t } from "i18next";
import { useSelector } from "react-redux";
import AppPageHeader from "../Styles/AppHeader";

const { Text, Link } = Typography;
const invoices = [
    {
        key: "1",
        id: "INV-2823-09",
        date: "Sep 24, 2023",
        amount: "$49.00",
        status: "Paid",
    },
    {
        key: "2",
        id: "INV-2823-08",
        date: "Aug 24, 2023",
        amount: "$49.00",
        status: "Paid",
    },
];

const invoiceColumns = [
    {
        title: t("invoice.id", { defaultValue: "Invoice ID" }),
        dataIndex: "id",
        key: "id",
        render: (id) => <Text underline strong>{id}</Text>,
    },
    { title: t("invoice.date", { defaultValue: "Date" }), dataIndex: "date", key: "date" },
    { title: t("invoice.amount", { defaultValue: "Amount" }), dataIndex: "amount", key: "amount" },
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
                <FilePdfOutlined /> View PDF
            </Link>
        ),
    },
];
function Order() {
    const theme = useSelector((state) => state?.app?.theme);
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
                    pagination={false}
                    scroll={{ x: "max-content" }}
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