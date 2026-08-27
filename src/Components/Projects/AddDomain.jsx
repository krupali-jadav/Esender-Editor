import { App, Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { updateProjectDomains } from "../WorkFlow/WorkFlowApi";
import AppPageHeader from "../Styles/AppHeader";

function AddDomain({ open, onClose, projectId, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            form.resetFields();
        }
    }, [open, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const domain = values.name?.trim();

            if (!domain) {
                message.warning(t("please.enter.domain", { defaultValue: "Please enter a domain", })
                );
                return;
            }

            setLoading(true);

            const payload = {
                allowedDomains: [domain],
            };

            const data = await updateProjectDomains(
                projectId,
                payload
            );

            if (data?.status) {
                message.success(data?.message);

                form.resetFields();
                onClose();
                onSuccess?.();
            }
        } catch (error) {
            console.error("DOMAIN UPDATE ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            width={500}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel", })}
                </Button>,

                <Button
                    key="update"
                    type="primary"
                    loading={loading}
                    onClick={handleUpdate}
                >
                    {t("update", { defaultValue: "Update", })}
                </Button>,
            ]}
        >
            <AppPageHeader
                title={t("update.domain", { defaultValue: "Update Domain", })}
            />
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    label={t("domain.name", {
                        defaultValue: "Domain Name",
                    })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: t(
                                "please.enter.domain.name",
                                {
                                    defaultValue:
                                        "Please enter domain name",
                                }
                            ),
                        },
                    ]}
                >
                    <Input
                        placeholder={t(
                            "enter.domain.name",
                            {
                                defaultValue:
                                    "Enter Domain Name",
                            }
                        )}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddDomain;