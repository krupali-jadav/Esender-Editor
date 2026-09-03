import { Button, Card, Col, Form, Input, message, Row } from 'antd'
import PhoneInput from 'antd-phone-input';
import TextArea from 'antd/es/input/TextArea'
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserSetting, saveBasicInfo } from './SettingApi';
import { formatDate } from '../../util/commom.utils';
import { setUserSetting } from '../Redux/Reducer/reducer.app';

function BasicInformation() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state?.app?.theme);
  const setting = useSelector((state) => state.app.userSetting);
  const [phone, setPhone] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const payload = {
        businessName: values.name,
        address: values.address,
        email: values.email,
        phone: phone,
        description: values.about_your_business,
        category: values.category,
        website: values.website_url,
      };

      const data = await saveBasicInfo(payload);

      if (data?.status) {
        message.success(data?.message);
        const res = await getUserSetting();

        if (res?.status) {
          dispatch(setUserSetting(res.setting));
        }
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!setting) return;

    form.setFieldsValue({
      name: setting?.basicInfo?.businessName,
      category: setting?.basicInfo?.category,
      address: setting?.basicInfo?.address,
      website_url: setting?.basicInfo?.website,
      email: setting?.basicInfo?.email,
      about_your_business: setting?.basicInfo?.description,
      phone: setting?.basicInfo?.phone,
    });

    setPhone(setting?.basicInfo?.phone || "");
    setLastUpdated(setting?.updatedAt || "");
  }, [setting]);

  const handlePhoneChange = (value) => {
    if (value && value.valid && value.valid()) {
      const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""}
        }${value?.phoneNumber ?? ""}`;
      setPhone(fullPhoneNumber);
    } else {
      setPhone("");
    }
  };

  return (
    <Card style={{ borderRadius: 0, borderColor: theme ? "transparent" : "#fff", }}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("bussiness.name", { defaultValue: "Business Name" })}
              name="name"
              rules={[
                {
                  required: true,
                  message: t("please.enter.business.name", { defaultValue: "Please Enter Business Name" }),
                },
              ]}
            >
              <Input
                placeholder={t("enter.your.business.name", { defaultValue: "Enter Your Business Name", })} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("business.category", { defaultValue: "Business Category" })}
              name="category"
              rules={[
                {
                  required: true,
                  message: t("please.enter.business.category", { defaultValue: "Please Enter Business Category" })
                },
              ]}
            >
              <Input
                placeholder={t("enter.your.business.category", { defaultValue: "Enter Your Business Category", })} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("address", { defaultValue: "Address" })}
              name="address"
              rules={[
                {
                  required: true,
                  message: t("please.enter.address", { defaultValue: "Please Enter Address" }),
                },
              ]}
            >
              <Input
                placeholder={t("enter.your.address", { defaultValue: "Enter Your Address", })} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("website.url", { defaultValue: "Website Url (Optional)" })}
              name="website_url"
            >
              <Input
                placeholder={t("enter.website.url", { defaultValue: "Enter Website Url", })} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              label={t("email", { defaultValue: "Email" })}
              name="email"
              rules={[
                {
                  required: true,
                  message: t("please.enter.email", { defaultValue: "Please Enter Email" }),
                },
              ]}
            >
              <Input
                placeholder={t("enter.your.email", { defaultValue: "Enter Your Email", })} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item
              name="phone"
              label={t("phone.number", { defaultValue: "Phone Number" })}
              initialValue={phone}
              rules={[
                {
                  required: true,
                  message: t("please.enter.phone", { defaultValue: "Please Enter Phone Number" }),
                },
              ]}
            >
              <PhoneInput
                enableSearch
                country={"in"}
                value={phone}
                onChange={handlePhoneChange}
                placeholder={t("enter.phone.number", { defaultValue: "Enter Phone Number" })}
              />
            </Form.Item>

          </Col>
        </Row>

        <Form.Item
          label={t("about.your.business", { defaultValue: "About Your Business" })}
          name="about_your_business"
          rules={[
            {
              required: true,
              message: t("please.enter.about.your.business", { defaultValue: "Please Enter About Your Business" }),
            },
          ]}
        >
          <TextArea rows={5}
            placeholder={t("enter.about.your.business", { defaultValue: "Enter About Your Business", })} />
        </Form.Item>

        <Row gutter={[24, 16]} justify="space-between" align="middle" >
          <Col xs={24} sm={24} md={12} lg={12}>
            <span>{t("last.update", { defaultValue: "Last Update" })}: </span>{" "}{lastUpdated ? formatDate(lastUpdated) : "-"}
          </Col>

          <Col>
            <Button type="primary" htmlType='submit' loading={loading}>
              {t("save", { defaultValue: "Save" })}
            </Button>
          </Col>
        </Row>
      </Form>
    </Card >
  )
}

export default BasicInformation;