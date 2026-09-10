import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const getPlans = async () => {
    try {
        const response = await axiosInstance.get("plans");

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.error(error);
        message.error(error?.message);
    }
};

export const getCurrentSubscription = async () => {
    try {
        const response = await axiosInstance.get("/subscription/current");

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.error("GET CURRENT SUBSCRIPTION ERROR:", error);
        message.error(error?.message);
        return null;
    }
};
export const getSubscriptionQuote = async ({ slug, billingInterval = "monthly", currency, gateway, }) => {
    try {
        const response = await axiosInstance.get("/subscription/quote", {
            params: {
                slug,
                billingInterval,
                currency,
                gateway,
            },
        });

        return response.data;
    } catch (error) {
        console.error("GET SUBSCRIPTION QUOTE ERROR:", error);
        throw error;
    }
};
export const chekoutSubscription = async (payload) => {
    try {
        const response = await axiosInstance.post("/billing/checkout", payload);

        if (response.data?.status) {
            return response.data;
        }
        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.error(error);
        message.error(error?.message);
    }
}