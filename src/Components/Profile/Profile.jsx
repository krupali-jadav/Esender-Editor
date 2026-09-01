
import { useEffect, useState } from "react";
import { Form, Row, Col, Input, Button, Avatar, Upload, Flex, Select, message, Card, } from "antd";
import PhoneInput from "antd-phone-input";
import { PageContainer } from "@ant-design/pro-components";
import { useDispatch, useSelector } from "react-redux";
import countryList from "../../util/countryList.json";
import { LoadingOutlined } from "@ant-design/icons";
import { getMediaPath } from "../../util/getMediaPath";
import { t } from "i18next";
import { saveProfile, uploadImage } from "./ProfileApi";
import { refreshProfile } from "../Redux/action"
import AppPageHeader from "../Styles/AppHeader";

const Profile = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isProfileUploading, setIsProfileUploading] = useState(false);

  const profile = useSelector((state) => state?.user?.profile);
  const phoneCountry = useSelector(
    (state) => state?.setting?.panel?.crm?.country?.toLowerCase() ?? "in"
  );

  useEffect(() => {
    if (!profile) return;

    setProfileUrl(profile.profile || "");

    form.setFieldsValue({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      addressLine1: profile.address?.addressLine1,
      addressLine2: profile.address?.addressLine2,
      city: profile.address?.city,
      state: profile.address?.state,
      zip: profile.address?.zip,
      country: profile.address?.country,
    });

    setPhone(profile.phone || "");
  }, [profile]);

  const onProfileSave = async (values) => {
    try {
      setLoading(true);

      const payload = {
        name: values.name,
        email: values.email,
        profile: profileUrl,
        address: {
          addressLine1: values.addressLine1,
          addressLine2: values.addressLine2,
          city: values.city,
          state: values.state,
          zip: values.zip,
          country: values.country,
          type: "home",
        }
      };
      const data = await saveProfile(payload);

      if (data?.status) {
        message.success(data.message);
        dispatch(refreshProfile());
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const imageUpload = async ({ file }) => {
    const formData = new FormData();

    formData.append("type", "image");
    formData.append("file", file);

    try {
      setIsProfileUploading(true);
      const data = await uploadImage(formData);
      if (data?.status) {
        message.success(data.message);
        setProfileUrl(
          data.downloadUrl ||
          data.url ||
          data.profile ||
          ""
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsProfileUploading(false);
    }
  };
  return (
    <PageContainer title={false} breadcrumb={false}>
      <AppPageHeader
        eyebrow={t("profile", { defaultValue: "Profile" })}
        title={t("profile", { defaultValue: "Profile" })}
        description="Update your personal details and contact information."
      />
      <Row justify="center">
        <Col xs={24}>
          <Card
            style={{ width: "100%", maxWidth: 1280, margin: "0 auto" }}
            styles={{ body: { padding: 28 } }}
          >
            <Form form={form} layout="vertical" autoComplete="off" onFinish={onProfileSave}>
              <Row gutter={[14, 0]}>

                {/* image */}
                <Col xs={24} sm={24} md={7} lg={5} xl={4}>
                  <Form.Item name="logo">
                    <Flex justify="center" align="center">
                      <Upload
                        multiple={false}
                        showUploadList={false}
                        cursor="pointer"
                        customRequest={imageUpload}
                      >
                        {isProfileUploading ? (
                          <LoadingOutlined />
                        ) : (
                          <Avatar
                            shape="circle"
                            size={100}
                            src={
                              profileUrl !== ""
                                ? getMediaPath(profileUrl)
                                : `${getMediaPath("/media/avatar.png")}`
                            }
                            alt="avatar"
                          />
                        )}
                      </Upload>
                    </Flex>
                  </Form.Item>
                </Col>

                {/* Right Side */}
                <Col xs={24} sm={24} md={17} lg={19} xl={20}>
                  <Row gutter={[16, 0]}>

                    {/* Name */}
                    <Col md={12} sm={12} xl={12} xs={24}>
                      <Form.Item
                        label={t("name", { defaultValue: "Name" })}
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: t("please.enter.name", { defaultValue: "Please enter your name" }),
                          },
                        ]}
                      >
                        <Input placeholder={t("enter.name", { defaultValue: "Enter Name" })} />
                      </Form.Item>
                    </Col>

                    {/* Phone */}
                    <Col md={12} sm={12} xl={12} xs={24}>
                      <Form.Item
                        label={t("phone", { defaultValue: "Phone" })}
                        name="phone"
                      >
                        <PhoneInput
                          enableSearch
                          country={phoneCountry}
                          value={phone}
                          readOnly
                          disableDropdown
                        />
                      </Form.Item>
                    </Col>

                    {/* Email */}
                    <Col md={24} sm={24} xl={24} xs={24}>
                      <Form.Item
                        label={t("email.address", { defaultValue: "Email Address" })}
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: t("please.enter.email", { defaultValue: "Please enter email" }),
                          },
                        ]}
                      >
                        <Input
                          type="email"
                          placeholder={t("enter.email", { defaultValue: "Enter Email" })}
                        />
                      </Form.Item>
                    </Col>

                  </Row>
                </Col>
              </Row>

              {/* Address part */}
              <Row gutter={[16, 0]}>

                {/* Address 1 */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label={t("address.line1", { defaultValue: "Address Line 1" })}
                    name="addressLine1"
                    rules={[
                      {
                        required: true,
                        message: t("please.enter.address", { defaultValue: "Please enter address" }),
                      },
                    ]}
                  >
                    <Input placeholder={t("enter.address.line1", { defaultValue: "Enter Address Line 1" })} />
                  </Form.Item>
                </Col>

                {/* Address 2 */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label={t("address.line2", { defaultValue: "Address Line 2" })}
                    name="addressLine2"
                  >
                    <Input placeholder={t("enter.address.line2", { defaultValue: "Enter Address Line 2" })} />
                  </Form.Item>
                </Col>

                {/* City */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label={t("city", { defaultValue: "City" })}
                    name="city"
                    rules={[
                      {
                        required: true,
                        message: t("please.enter.city", { defaultValue: "Please Enter City" }),
                      },
                    ]}
                  >
                    <Input placeholder={t("enter.city", { defaultValue: "Enter City" })} />
                  </Form.Item>
                </Col>

                {/* State */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label={t("state", { defaultValue: "State" })}
                    name="state"
                    rules={[
                      {
                        required: true,
                        message: t("please.enter.state", { defaultValue: "Please enter state" }),
                      },
                    ]}
                  >
                    <Input placeholder={t("enter.state", { defaultValue: "Enter State" })} />
                  </Form.Item>
                </Col>

                {/* Country */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label={t("country", { defaultValue: "Country" })}
                    name="country"
                  >
                    <Select
                      showSearch
                      placeholder={t("select.country", { defaultValue: "Select Country" })}
                      options={countryList.map((c) => ({
                        value: c.countryCode,
                        label: c.countryNameEn,
                      }))}
                    />
                  </Form.Item>
                </Col>

                {/* Zip */}
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item
                    label={t("zip.code", { defaultValue: "Zip Code" })}
                    name="zip"
                  >
                    <Input placeholder={t("enter.zip.code", { defaultValue: "Enter Zip Code" })} />
                  </Form.Item>
                </Col>
              </Row>
              <br />

              <Flex justify="end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                >
                  {t("save", { defaultValue: "Save" })}
                </Button>
              </Flex>

            </Form>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Profile;
