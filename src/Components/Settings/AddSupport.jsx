import { Button, Col, Form, Input, message, Modal } from 'antd'
import PhoneInput from 'antd-phone-input';
import { t } from 'i18next'
import { useEffect, useState } from 'react';
import { addSupport, updateSupport } from './SettingApi';

function AddSupport({ open, onClose, onSuccess, editData }) {
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                name: values.name,
                phone: phone,
                department: values.department,
            };

            let data;

            if (editData?._id) {
                data = await updateSupport({
                    support_id: editData._id,
                    ...payload,
                });
            } else {
                data = await addSupport(payload);
            }

            if (data?.status) {
                message.success(
                    editData
                        ? t("support.updated.successfully", { defaultValue: "Support updated successfully" })
                        : t("support.added.successfully", { defaultValue: "Support added successfully" })
                );

                onSuccess?.();
                form.resetFields();
                setPhone("");
                onClose();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) return;

        form.resetFields();
        setPhone("");

        if (editData) {
            form.setFieldsValue({
                name: editData.name,
                phone: editData.phone,
                department: editData.department,
            });

            setPhone(editData.phone || "");
        }
    }, [open, editData, form]);

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
        <Col>
        <Modal
            title={editData
                ? t("edit.support", {
                    defaultValue: "Edit Support",
                })
                : t("add.support", {
                    defaultValue: "Add Support",
                })}
            open={open}
            onCancel={() => {
                form.resetFields();
                setPhone("");
                onClose();
            }}
                width = { 500}
                centered
                footer = {
                    [
                    <Button key="cancel" onClick={onClose}>
                        {t("cancel", { defaultValue: "Cancel" })}
                    </Button>,
                    <Button
                        key="add"
                        type="primary"
                        loading={loading}
                        onClick={() => form.submit()}
                    >
                        {editData ? t("edit", { defaultValue: "Edit" }) : t("add", { defaultValue: "Add" })}
                    </Button>
                    ]}
                    >

                    <Form layout="vertical" form={form} onFinish={handleSubmit}>
                        <Form.Item
                            label={t("name", { defaultValue: "Name" })}
                            name="name"
                        >
                            <Input
                                placeholder={t("enter.name", { defaultValue: "Enter name" })}
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label={t("phone.number", { defaultValue: "Phone Number" })}
                        
                        >
                            <PhoneInput
                                enableSearch
                                country={"in"}
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder={t("phone.number", { defaultValue: "Enter Phone Number" })}

                            />
                        </Form.Item>

                        <Form.Item
                            label={t("department", { defaultValue: "Department" })}
                            name="department"
                        >
                            <Input
                                placeholder={t("enter.department", { defaultValue: "Enter Department" })}
                            />
                        </Form.Item>
                    </Form>

        </Modal >
        </Col>
    )
            }

export default AddSupport
