import { useEffect, useState } from "react";
import { Card, Tabs, Table, Tag, Typography, Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { getOrders, getInvoices, getSubscriptionHistory } from "./SubscriptionApi";
import { getAiHistory } from "../../util/AiApi";
import { money } from "./planLabels";

const { Text } = Typography;

const STATUS_COLOR = {
    paid: "green", active: "green", created: "blue", pending: "gold",
    failed: "red", cancelled: "default", expired: "default", scheduled: "cyan", trialing: "cyan",
};

const dateCell = (d) => (d ? new Date(d).toLocaleDateString() : "—");

// Billing history: orders, invoices, AI credit usage, and subscription changes.
// Each tab paginates independently and shows an empty state.
export default function BillingHistory() {
    return (
        <Card title={t("billing.history", { defaultValue: "Billing history" })} styles={{ body: { paddingTop: 8 } }}>
            <Tabs
                items={[
                    { key: "orders", label: t("orders", { defaultValue: "Orders" }), children: <OrdersTab /> },
                    { key: "invoices", label: t("invoices", { defaultValue: "Invoices" }), children: <InvoicesTab /> },
                    { key: "ai", label: t("ai.credit.history", { defaultValue: "AI credit history" }), children: <AiTab /> },
                    { key: "subs", label: t("subscription.history", { defaultValue: "Subscription history" }), children: <SubsTab /> },
                ]}
            />
        </Card>
    );
}

function usePaged(fetcher, extract) {
    const [rows, setRows] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            const res = await fetcher(page);
            if (alive && res?.status) {
                const { items, total: tot } = extract(res);
                setRows(items || []);
                setTotal(tot || 0);
            }
            if (alive) setLoading(false);
        })();
        return () => { alive = false; };
    }, [page]);
    return { rows, total, page, setPage, loading };
}

function OrdersTab() {
    const { rows, total, page, setPage, loading } = usePaged(
        (p) => getOrders(p, 10),
        (r) => ({ items: r.orders, total: r.total })
    );
    return (
        <Table
            rowKey="_id" size="small" loading={loading} dataSource={rows}
            pagination={{ current: page + 1, pageSize: 10, total, onChange: (p) => setPage(p - 1) }}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: t("no.orders.yet", { defaultValue: "No orders yet" }) }}
            columns={[
                { title: t("reference", { defaultValue: "Reference" }), dataIndex: "reference" },
                { title: t("plan", { defaultValue: "Plan" }), dataIndex: "planName" },
                { title: t("type", { defaultValue: "Type" }), dataIndex: "changeType", render: (v) => <Tag>{v}</Tag> },
                { title: t("amount", { defaultValue: "Amount" }), dataIndex: "total", render: (v, r) => money(v, r.currency) },
                { title: t("status", { defaultValue: "Status" }), dataIndex: "status", render: (s) => <Tag color={STATUS_COLOR[s]}>{s}</Tag> },
                { title: t("date", { defaultValue: "Date" }), dataIndex: "createdAt", render: dateCell },
            ]}
        />
    );
}

function InvoicesTab() {
    const { rows, total, page, setPage, loading } = usePaged(
        (p) => getInvoices(p, 10),
        (r) => ({ items: r.invoices, total: r.total })
    );
    return (
        <Table
            rowKey="_id" size="small" loading={loading} dataSource={rows}
            pagination={{ current: page + 1, pageSize: 10, total, onChange: (p) => setPage(p - 1) }}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: t("no.invoices.yet", { defaultValue: "No invoices yet" }) }}
            columns={[
                { title: t("invoice", { defaultValue: "Invoice" }), dataIndex: "id" },
                { title: t("amount", { defaultValue: "Amount" }), dataIndex: "amount", render: (v, r) => money(v, r.currency) },
                { title: t("status", { defaultValue: "Status" }), dataIndex: "status", render: (s) => <Tag color={STATUS_COLOR[s]}>{s}</Tag> },
                { title: t("date", { defaultValue: "Date" }), dataIndex: "date", render: dateCell },
                {
                    title: "", dataIndex: "pdfUrl",
                    render: (url) => url ? <Button size="small" icon={<DownloadOutlined />} href={url} target="_blank">{t("download", { defaultValue: "Download" })}</Button> : <Text type="secondary">—</Text>,
                },
            ]}
        />
    );
}

function AiTab() {
    const { rows, total, page, setPage, loading } = usePaged(
        (p) => getAiHistory({ page: p + 1, limit: 10 }),
        (r) => ({ items: r.items, total: r.total })
    );
    return (
        <Table
            rowKey="_id" size="small" loading={loading} dataSource={rows}
            pagination={{ current: page + 1, pageSize: 10, total, onChange: (p) => setPage(p - 1) }}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: t("no.ai.usage.yet", { defaultValue: "No AI usage yet" }) }}
            columns={[
                { title: t("action", { defaultValue: "Action" }), dataIndex: "action" },
                { title: t("model", { defaultValue: "Model" }), dataIndex: "model", render: (v) => v || "—" },
                { title: t("tokens", { defaultValue: "Tokens" }), dataIndex: "totalTokens" },
                { title: t("credits", { defaultValue: "Credits" }), dataIndex: "credits" },
                { title: t("date", { defaultValue: "Date" }), dataIndex: "committedAt", render: (d, r) => dateCell(d || r.createdAt) },
            ]}
        />
    );
}

function SubsTab() {
    const { rows, total, page, setPage, loading } = usePaged(
        (p) => getSubscriptionHistory(p + 1, 10),
        (r) => ({ items: r.items, total: r.total })
    );
    return (
        <Table
            rowKey="_id" size="small" loading={loading} dataSource={rows}
            pagination={{ current: page + 1, pageSize: 10, total, onChange: (p) => setPage(p - 1) }}
            scroll={{ x: "max-content" }}
            locale={{ emptyText: t("no.history.yet", { defaultValue: "No history yet" }) }}
            columns={[
                { title: t("plan", { defaultValue: "Plan" }), dataIndex: "planName" },
                { title: t("interval", { defaultValue: "Interval" }), dataIndex: "billingInterval" },
                { title: t("status", { defaultValue: "Status" }), dataIndex: "status", render: (s) => <Tag color={STATUS_COLOR[s]}>{s}</Tag> },
                { title: t("started", { defaultValue: "Started" }), dataIndex: "currentPeriodStart", render: dateCell },
                { title: t("ends", { defaultValue: "Ends" }), dataIndex: "currentPeriodEnd", render: dateCell },
            ]}
        />
    );
}
