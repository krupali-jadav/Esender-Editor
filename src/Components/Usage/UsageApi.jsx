import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";

export const getUsageTrend = async (projectId, range = 30) => {
    try {
        const response = await axiosInstance.get("usage/trend", {
            params: {
                projectId,
                range,
            },
        });

        if (response.data?.status) {
            return response.data;
        }

        message.error(response.data?.message);
    } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message);
    }
};
export const getUsageAlerts = async (projectId) => {
    try {
        const response = await axiosInstance.get(`usage/alerts?projectId=${projectId}`);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message );
    }
};
export const getUsageSummary = async (projectId, range = 30) => {
    try {
        const response = await axiosInstance.get(`usage/summary?projectId=${projectId}&range=${range}`);

        if (response.data?.status) {
            return response.data;
        } else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log(error);
        message.error(error?.response?.data?.message);
    }
};