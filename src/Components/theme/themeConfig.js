import { theme as antdTheme } from "antd";
import { lightTokens, darkTokens, fontFamily } from "./tokens";

// Builds the ConfigProvider `theme` prop for a given mode. Keeps every
// hand-picked color/radius/spacing decision in tokens.js instead of scattered
// across components.
export const getThemeConfig = (darkMode) => {
  const t = darkMode ? darkTokens : lightTokens;

  return {
    cssVar: true,
    algorithm: darkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: t.colorPrimary,
      colorInfo: t.colorInfo,
      colorSuccess: t.colorSuccess,
      colorWarning: t.colorWarning,
      colorError: t.colorError,
      colorBgLayout: t.colorBgLayout,
      colorBgContainer: t.colorBgContainer,
      colorBgElevated: t.colorBgElevated,
      colorBgSpotlight: t.colorBgSpotlight,
      colorText: t.colorText,
      colorTextSecondary: t.colorTextSecondary,
      colorTextTertiary: t.colorTextTertiary,
      colorBorder: t.colorBorder,
      colorBorderSecondary: t.colorBorderSecondary,
      borderRadius: t.borderRadius,
      borderRadiusLG: t.borderRadiusLG,
      controlHeight: t.controlHeight,
      fontFamily: fontFamily.body,
      fontFamilyCode: fontFamily.mono,
      wireframe: false,
    },
    components: {
      Typography: {
        codeBg: darkMode ? "#FFFFFF" : "#F5F5F5",
      },
      Button: {
        borderRadius: t.borderRadius,
        controlHeight: t.controlHeight,
        fontWeight: 600,
        primaryShadow: "none",
      },
      Card: {
        borderRadiusLG: t.borderRadiusLG,
        paddingLG: 24,
        boxShadowTertiary: "0 1px 2px rgba(16, 24, 40, 0.04)",
      },
      Table: {
        borderRadiusLG: t.borderRadiusLG,
        headerBg: t.colorBgContainer,
        headerColor: t.colorTextSecondary,
        headerSplitColor: "transparent",
        cellPaddingBlock: 14,
        rowHoverBg: darkMode ? "rgba(61,190,228,0.08)" : "rgba(32,166,206,0.06)",
      },
      Input: { borderRadius: t.borderRadius, controlHeight: t.controlHeight },
      InputNumber: { borderRadius: t.borderRadius, controlHeight: t.controlHeight },
      Select: { borderRadius: t.borderRadius, controlHeight: t.controlHeight },
      DatePicker: { borderRadius: t.borderRadius, controlHeight: t.controlHeight },
      Modal: { borderRadiusLG: 16 },
      Drawer: { paddingLG: 24 },
      Tabs: {
        itemSelectedColor: t.colorPrimary,
        itemHoverColor: t.colorPrimary,
        inkBarColor: t.colorPrimary,
        titleFontSizeLG: 16,
      },
      Tag: { borderRadiusSM: 6, defaultBg: t.colorBgLayout },
      Badge: { colorBgContainer: t.colorBgContainer },
      Menu: {
        borderRadius: t.borderRadius,
        itemBorderRadius: 8,
        subMenuItemBg: "transparent",
      },
      Layout: {
        bodyBg: t.colorBgLayout,
        headerBg: t.colorBgContainer,
        siderBg: "#152A3C",
      },
      Pagination: { borderRadius: t.borderRadius },
      Steps: { colorPrimary: t.colorPrimary },
      Tooltip: { borderRadius: 8 },
      Dropdown: { borderRadiusLG: t.borderRadiusLG },
      Upload: { borderRadius: t.borderRadius },
      Form: { itemMarginBottom: 20, labelFontSize: 14, verticalLabelPadding: "0 0 6px" },
      Progress: { defaultColor: t.colorPrimary },
      Segmented: { borderRadius: t.borderRadius, itemSelectedBg: t.colorBgContainer },
      Statistic: { titleFontSize: 13, contentFontSize: 28 },
    },
  };
};
