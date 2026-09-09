import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

// Normalized subscription + billing API layer. Each function returns the parsed
// response object (or null on transport error). Components decide how to react to
// actionable codes; API modules only surface generic transport failures.

async function call(promise, { silent = false } = {}) {
    try {
        const response = await promise;
        return response.data;
    } catch (error) {
        if (!silent) message.error(error?.response?.data?.message || error?.message);
        return null;
    }
}

/* --------------------------------- Public --------------------------------- */

export const getApp = () => call(axiosInstance.get("app"), { silent: true });

export const getExchangeRates = () =>
    call(axiosInstance.get("exchange-rates"), { silent: true });

/* ------------------------------ Subscription ------------------------------ */

export const getCurrentSubscription = () =>
    call(axiosInstance.get("subscription/current"));

export const getQuote = (params) =>
    call(axiosInstance.get("subscription/quote", { params }));

export const getSubscriptionHistory = (page = 1, limit = 20) =>
    call(axiosInstance.get("subscription/history", { params: { page, limit } }));

export const getSubscriptionUsage = () =>
    call(axiosInstance.get("subscription/usage"));

export const getCredits = () => call(axiosInstance.get("subscription/credits"));

export const startTrial = () => call(axiosInstance.post("subscription/trial"));

export const cancelSubscription = () =>
    call(axiosInstance.post("subscription/cancel"));

export const cancelScheduledChange = () =>
    call(axiosInstance.post("subscription/cancel-scheduled"));

/* -------------------------------- Billing --------------------------------- */

export const checkout = (payload) =>
    call(axiosInstance.post("billing/checkout", payload));

export const getOrderStatus = (orderId) =>
    call(axiosInstance.get(`billing/orders/${orderId}/status`), { silent: true });

export const getOrders = (page = 0, limit = 20) =>
    call(axiosInstance.get("billing/orders", { params: { page, limit } }));

export const getInvoices = (page = 0, limit = 20) =>
    call(axiosInstance.get("billing/invoices", { params: { page, limit } }));
