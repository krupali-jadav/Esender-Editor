import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const getPlans = async () => {
    try {
        const response = await axiosInstance.get("plans");

        if (response.data?.status) {
            return response.data;
        }

        message.error(
            response.data?.message || "Failed to fetch plans"
        );

        return null;
    } catch (error) {
        console.error("GET PLANS ERROR:", error);

        message.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch plans"
        );

        return null;
    }
};
export const getSubscriptionPlans = async () => {
    try {
        const response = await axiosInstance.get("subscription  ");

        if (response.data?.status) {
            return response.data;
        }

        message.error(
            response.data?.message || "Failed to fetch subscription plans"
        );

        return null;
    } catch (error) {
        console.error("GET SUBSCRIPTION PLANS ERROR:", error);

        message.error(
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch subscription plans"
        );

        return null;
    }
};