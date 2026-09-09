// Friendly labels + formatting for plan features/limits, so the UI never shows
// raw camelCase. Shared by the plans grid, the quote modal and usage.

export const FEATURE_LABELS = {
    emailEditor: "Email editor",
    exportHtml: "Export HTML",
    premiumBlocks: "Premium blocks",
    videoBlock: "Video block",
    customHtml: "Custom HTML",
    imageLibrary: "Image library",
    customFonts: "Custom fonts",
    brandKit: "Brand kit",
    reusableBlocks: "Reusable blocks",
    aiText: "AI text",
    aiSubject: "AI subject lines",
    aiRewrite: "AI rewrite",
    aiTranslate: "AI translate",
    watermarkRemoval: "Watermark removal",
};

export const LIMIT_LABELS = {
    maxProjects: "Projects",
    maxTemplates: "Templates",
    maxEditorUsers: "Editor users",
    maxMonthlySessions: "Monthly sessions",
    storageBytes: "Storage",
    maxMonthlyAiCredits: "AI credits",
};

export const featureLabel = (key) =>
    FEATURE_LABELS[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export const limitLabel = (key) => LIMIT_LABELS[key] || key;

// Format a numeric limit for display. 0 means "Not included" (never "Unlimited"
// — this product has no unlimited sentinel).
export const formatLimit = (key, value) => {
    const n = Number(value) || 0;
    if (key === "storageBytes") {
        if (n <= 0) return "Not included";
        return `${(n / (1024 * 1024 * 1024)).toFixed(0)} GB`;
    }
    if (n <= 0) return "Not included";
    return n.toLocaleString();
};

// Clamp a percentage into [0, 100].
export const clampPct = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));

export const CURRENCY_SYMBOLS = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
};

export const money = (amount, currency = "INR") => {
    const sym = CURRENCY_SYMBOLS[currency] || `${currency} `;
    return `${sym}${(Number(amount) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};
