import { useEffect, useState } from "react";
import { Card, Grid, Tabs } from "antd";
import { PageContainer } from "@ant-design/pro-components";

import BasicInformation from "./BasicInformation";
import BillingDetails from "./BillingDetails";
import Support from "./Support";
import SocialMedia from "./SocialMedia";
import ApiKey from "./ApiKey";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { getUserSetting } from "./SettingApi";
import AppPageHeader from "../Styles/AppHeader";
import { setUserSetting } from "../Redux/Reducer/reducer.app";

const { useBreakpoint } = Grid;

const Settings = () => {
  const [activeTab, setActiveTab] = useState("basic");
  const dispatch = useDispatch();
  const screens = useBreakpoint();

  const userSetting = useSelector((state) => state.app.userSetting);

  const loadSetting = async () => {
    const res = await getUserSetting();

    if (res?.status) {
      dispatch(setUserSetting(res.setting));
    }
  };

  useEffect(() => {
    if (!userSetting) {
      loadSetting();
    }
  }, []);

  const tabItems = [
    {
      key: "basic",
      label: t("basic.information", { defaultValue: "Basic Information" }),
      children: <BasicInformation />,
    },
    {
      key: "billing",
      label: t("billing.details", { defaultValue: "Billing Details" }),
      children: <BillingDetails />,
    },
    {
      key: "support",
      label: t("support", { defaultValue: "Support" }),
      children: <Support />,
    },
    {
      key: "social",
      label: t("social.media", { defaultValue: "Social Media" }),
      children: <SocialMedia />,
    },
    {
      key: "api",
      label: t("api.key", { defaultValue: "API Key" }),
      children: <ApiKey />,
    },
  ];

  return (
    <PageContainer title={false} breadcrumb={false}>
      <AppPageHeader
        eyebrow="Account"
        title={t("settings", { defaultValue: "Settings" })}
        description={t("manage.your.account.billing.support.and.integration.details", { defaultValue: "Manage your account, billing, support, and integration details." })}
      />

      <Card styles={{body: {padding: screens.md ? "16px 8px" : 16,},}}>
        <Tabs
          tabPosition={screens.md ? "left" : "top"}
        activeKey={activeTab}
          items={tabItems}
          onChange={setActiveTab}
          style={{ minHeight: 420 }}
        />
      </Card>
    </PageContainer>
  );
};

export default Settings;
