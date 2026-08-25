import { FacebookFilled, InstagramFilled, LinkedinFilled, TwitterSquareFilled, YoutubeFilled } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, message, Row } from "antd"
import { t } from "i18next"
import { useSelector } from "react-redux";
import {  saveSocialMedia } from "./SettingApi";
import { useEffect, useState } from "react";
import { formatDate } from "../../util/commom.utils";

function SocialMedia() {
  const [form] = Form.useForm();
  const theme = useSelector((state) => state?.app?.theme);
  const setting = useSelector((state) => state.app.userSetting);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  const handleSubmit = async (values) => {
    console.log("Form Values:", values);
    try {
      setLoading(true);
      const payload = {
        linkedin: values.linkedin,
        facebook: values.facebook,
        twitter: values.twitter,
        instagram: values.instagram,
        youtube: values.youtube
      };
      const data = await saveSocialMedia(payload);

      if (data?.status) {
        message.success(
          data?.message || "Social media details saved successfully"
        );
        
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to save social media details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        if (!setting) return;

        form.setFieldsValue({
            linkedin: setting?.socialMedia?.linkedin,
            facebook: setting?.socialMedia?.facebook,
            twitter: setting?.socialMedia?.twitter,
            instagram: setting?.socialMedia?.instagram,
            youtube: setting?.socialMedia?.youtube,
        });
        setLastUpdated(setting?.updatedAt || "");
    }, [setting]);

  return (
    <Card
      style={{
        borderRadius: 0,
        borderColor: theme ? "transparent" : "#fff",
      }} >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("linkedin", { defaultValue: "LinkedIn" })}
              name="linkedin"
            >
              <Input
                prefix={<LinkedinFilled />}
                placeholder={t("linkedin.url", { defaultValue: `Enter LinkedIn URL`, })} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("facebook", { defaultValue: "Facebook" })}
              name="facebook"
            >
              <Input
                prefix={<FacebookFilled />}
                placeholder={t("facebook", { defaultValue: `Enter Your Facebook`, })} />
            </Form.Item>
          </Col>

        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("twitter", { defaultValue: "Twitter" })}
              name="twitter"
            >
              <Input
                prefix={<TwitterSquareFilled />}
                placeholder={t("twitter", { defaultValue: `Enter Your Twitter`, })} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("instagram", { defaultValue: "Instagram" })}
              name="instagram"
            >
              <Input
                prefix={<InstagramFilled />}
                placeholder={t("instagram", { defaultValue: `Enter Your Instagram`, })} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("youtube", { defaultValue: "YouTube" })}
              name="youtube"
            >
              <Input
                prefix={<YoutubeFilled />}
                placeholder={t("youtube", { defaultValue: `Enter Your YouTube`, })} />
            </Form.Item>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" gutter={[24, 16]}>
          <Col xs={24} sm={24} lg={12}>
            <span>{t("last.update", { defaultValue: "Last Update" })}: </span>{" "}{lastUpdated ? formatDate(lastUpdated) : "-"}
          </Col>
          <Col >
            <Button type="primary" htmlType="submit" loading={loading}>{t("save", { defaultValue: "Save" })}</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  )
}

export default SocialMedia