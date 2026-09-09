import axiosInstance from "./axiosInstance";

// AI generation + capabilities API. These return the raw response object so the
// caller can read the machine-readable `code` (AI_CREDITS_EXHAUSTED,
// AI_FEATURE_NOT_INCLUDED, SUBSCRIPTION_REQUIRED, …) and react appropriately,
// rather than surfacing a duplicate generic message here.

async function callAi(path, payload, { idempotencyKey } = {}) {
    try {
        const headers = idempotencyKey ? { "x-idempotency-key": idempotencyKey } : {};
        const response = await axiosInstance.post(path, payload, { headers });
        return response.data;
    } catch (error) {
        return (
            error?.response?.data || {
                status: false,
                message: error?.message || "Request failed",
            }
        );
    }
}

export const getAiCapabilities = async (projectId) => {
    try {
        const response = await axiosInstance.get("ai/capabilities", {
            params: projectId ? { projectId } : {},
        });
        return response.data;
    } catch (error) {
        return error?.response?.data || { status: false, configured: false };
    }
};

export const getAiHistory = async (params = {}) => {
    try {
        const response = await axiosInstance.get("ai/history", { params });
        return response.data;
    } catch (error) {
        return error?.response?.data || { status: false, items: [] };
    }
};

export const aiGenerateText = (payload, opts) =>
    callAi("ai/generate-text", payload, opts);
export const aiGenerateSubject = (payload, opts) =>
    callAi("ai/generate-template-subject", payload, opts);
export const aiGenerateDescription = (payload, opts) =>
    callAi("ai/generate-template-description", payload, opts);
export const aiRewriteText = (payload, opts) =>
    callAi("ai/rewrite-text", payload, opts);
export const aiTranslateText = (payload, opts) =>
    callAi("ai/translate-text", payload, opts);
export const aiGenerateBusinessDescription = (payload, opts) =>
    callAi("ai/generate-business-description", payload, opts);

// A short random idempotency key for one logical AI action (prevents a
// double-submit / retry from charging twice).
export const newIdempotencyKey = () =>
    `ai_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
