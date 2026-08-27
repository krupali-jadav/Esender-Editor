import { message } from "antd";
import axiosInstance from "../../util/axiosInstance";


export const getDashboardOverview = async (range = 30) => {
    try {
        const response = await axiosInstance.get(`dashboard/overview?range=${range}`);

        if (response.data?.status) {
            return response.data;
        }
        else {
            message.error(response.data?.message);
        }
    } catch (error) {
        console.log("DASHBOARD OVERVIEW ERROR:", error);
        message.error(error?.response?.data?.message)
    }
};