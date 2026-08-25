import { Button, Card, Col, Input, message, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { generateApiKey } from "./SettingApi";
import { t } from "i18next";
const { Text } = Typography;
function ApiKey() {
  const theme = useSelector((state) => state?.app?.theme);
  const setting = useSelector((state) => state.app.userSetting);
  const [visible, setVisible] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);

      const data = await generateApiKey();

      if (data?.status) {
        setApiKey(data.apiKey);

        message.success(
          data?.message || "API key generated successfully"
        );
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!setting) return;
    setApiKey(setting?.apiKey || "");
  }, [setting]);

  return (
    <Col xs={24} sm={26} md={22} lg={22} xl={24} xxl={13}>
      <Card
        style={{
          borderRadius: 0,
          borderColor: theme ? "transparent" : "#fff",
        }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>
            {t("your.api.key", { defaultValue: "Your API Key" })}
          </Text>

          <Space.Compact block>
            <Input.Password
              value={apiKey}
              readOnly
              visibilityToggle={
                apiKey
                  ? {
                    visible,
                    onVisibleChange: setVisible,
                  }
                  : false
              }
              suffix={
                apiKey ? (
                  <Typography.Text
                    copyable={{
                      text: apiKey,
                    }}
                  />
                ) : null
              }
              style={{ minWidth: 0, flex: 1 }}
            />

            <Button
              type="primary"
              loading={loading}
              onClick={handleGenerate}
              style={{
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {t("generate", { defaultValue: "Generate" })}
            </Button>
          </Space.Compact>
        </Space>
      </Card>
    </Col>
  );
}
export default ApiKey;