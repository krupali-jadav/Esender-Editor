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
export const getSubscriptionPlans = async () => {
    try {
        const response = await axiosInstance.get("subscription");

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
export const getInvoices = async (page = 0, limit = 20) => {
    try {
        const response = await axiosInstance.get(`billing/invoices?page=${page}&limit=${limit}`);

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
        return null;
    } catch (error) {
        console.log(error);
        message.error(error?.message);
        return null;
    }
};