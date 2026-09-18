import { Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import { t } from "i18next";
import AppPageHeader from "../Styles/AppHeader";
import { addProjectDomain, updateDomain } from "./ProjectsApi";

function AddDomain({ open, onClose, projectId, onSuccess, editingDomain }) {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (editingDomain) {
                form.setFieldsValue({
                    currentDomain: editingDomain.domain,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, editingDomain, form]);

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const domain = editingDomain ? values.newDomain?.trim() : values.domain?.trim();

            if (!domain) {
                message.warning(t("please.enter.domain", { defaultValue: "Please enter a domain", }));
                return;
            }

            if (!projectId) return;
            setLoading(true);
            let data;

            if (editingDomain) {
                // EDIT / UPDATE DOMAIN
                const payload = {
                    currentDomain: values.currentDomain?.trim(),
                    newDomain: values.newDomain?.trim(),
                };
                data = await updateDomain(projectId, payload);
            } else {
                // ADD DOMAIN
                const payload = { domain: domain, };
                data = await addProjectDomain(
                    projectId,
                    payload
                );
            }
            if (data?.status) {
                message.success(data?.message);
                form.resetFields();
                onClose();
                onSuccess?.();
            }
        } catch (error) {
            console.log(error);
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

                <Button key="update" type="primary" loading={loading} onClick={handleUpdate}>
                    {editingDomain ? t("update.domain", { defaultValue: "Update Domain" }) : t("add.domain", { defaultValue: "Add Domain" })}
                </Button>,
            ]}
        >
            <AppPageHeader
                title={editingDomain ? t("update.domain", { defaultValue: "Update Domain" }) : t("add.domain", { defaultValue: "Add Domain" })}
            />
            <Form form={form} layout="vertical">
                {editingDomain ? (
                    <>
                        <Form.Item
                            label={t("current.domain.name", { defaultValue: "Current Domain Name", })}
                            name="currentDomain"
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label={t("new.domain.name", { defaultValue: "New Domain Name", })}
                            name="newDomain"
                            rules={[
                                {
                                    required: true,
                                    message: t("please.enter.domain.name", { defaultValue: "Please enter domain name", }),
                                },
                            ]}
                        >
                            <Input
                                placeholder={t("enter.domain.name", { defaultValue: "Enter Domain Name", })}
                            />
                        </Form.Item>
                    </>
                ) : (
                    <Form.Item
                        label={t("domain.name", {
                            defaultValue: "Domain Name",
                        })}
                        name="domain"
                        rules={[
                            {
                                required: true,
                                message: t("please.enter.domain.name", { defaultValue: "Please enter domain name", }),
                            },
                        ]}
                    >
                        <Input
                            placeholder={t("enter.domain.name", { defaultValue: "Enter Domain Name", })}
                        />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}

export default AddDomain;