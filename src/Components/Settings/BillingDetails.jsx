import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd'
import PhoneInput from 'antd-phone-input'
import Dragger from 'antd/es/upload/Dragger';
import { t } from 'i18next';
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { saveBillingDetails } from './SettingApi';
import { formatDate } from '../../util/commom.utils';

function BillingDetails() {

    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const theme = useSelector((state) => state?.app?.theme);
    const setting = useSelector((state) => state.app.userSetting);
    const [lastUpdated, setLastUpdated] = useState("");
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        console.log("Form Values:", values);
        try {
            setLoading(true);
            const payload = {
                businessName: values.name,
                gst: values.gst_number,
                email: values.email,
                phone: phone,
                address: values.address,
                logo: values.media,
            };

            const data = await saveBillingDetails(payload);

            if (data?.status) {
                message.success(
                    data?.message || "Billing details saved successfully"
                );
            }
        } catch (error) {
            console.log(error);
            message.error(error?.message || "Failed to save billing details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!setting) return;

        form.setFieldsValue({
            name: setting?.billingDetails?.businessName,
            gst_number: setting?.billingDetails?.gst,
            email: setting?.billingDetails?.email,
            address: setting?.billingDetails?.address,
            media: setting?.billingDetails?.logo,
            phone: setting?.billingDetails?.phone,
        });

        setLastUpdated(setting?.updatedAt || "");
        setPhone(setting?.billingDetails?.phone || "");
    }, [setting]);

    const handlePhoneChange = (value) => {
        if (value && value.valid && value.valid()) {
            const fullPhoneNumber = `+${value?.countryCode ?? ""}${value?.areaCode ?? ""
                }${value?.phoneNumber ?? ""}`;
            setPhone(fullPhoneNumber);
        } else {
            setPhone("");
        }
    };

    return (
        <Card
            style={{
                borderRadius: 0,
                borderColor: theme ? "transparent" : "#fff",
            }} >
            <Form form={form}
                layout="vertical"
                onFinish={handleSubmit}>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("bussiness.name", { defaultValue: "Business Name" })}
                            name="name"
                        >
                            <Input
                                placeholder={t("bussiness.name", { defaultValue: "Enter Your Bussiness Name", })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("gst.number", { defaultValue: "GST Number" })}
                            name="gst_number"
                        >
                            <Input
                                placeholder={t("gst.number", { defaultValue: "Enter Your GST Number", })} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 16]} gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("email", { defaultValue: "Email" })}
                            name="email"
                        >
                            <Input
                                placeholder={t("email", { defaultValue: "Enter Your Email", })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            name="phone"
                            label={t("phone.number", { defaultValue: "Phone Number" })}
                            initialValue={phone}
                        >
                            <PhoneInput
                                enableSearch
                                country={"in"}
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder={t("phone.number", { defaultValue: "Enter Phone Number" })}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        onSendOtp();
                                    }
                                }}
                            />
                        </Form.Item>

                    </Col>
                </Row>

                <Row gutter={[24, 16]} gutter={24}>
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("address", { defaultValue: "Address" })}
                            name="address"
                        >
                            <Input
                                placeholder={t("address", { defaultValue: "Enter Your  Address", })} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12}>
                        <Form.Item
                            label={t("media", { defaultValue: "Media" })}
                            name="media"
                        >
                            <Card size="small" >
                                <Dragger style={{ padding: "20px" }}>
                                    <p className="ant-upload-drag-icon">
                                        <UploadOutlined />
                                    </p>

                                    <p className="ant-upload-text">
                                        {t("drag.file.upload", { defaultValue: "Drag File Upload" })}
                                    </p>
                                </Dragger>
                            </Card>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={[24, 16]} justify="space-between" align="middle">
                    <Col xs={24} sm={24} md={12} lg={12}>
                        <span>
                            {t("last.update", { defaultValue: "Last Update:" })}{" "}
                            {lastUpdated ? formatDate(lastUpdated) : "-"}
                        </span>
                    </Col>

                    <Col>
                        <Button type="primary" htmlType='submit' loading={loading}>
                            {t("save", { defaultValue: "Save" })}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default BillingDetails;