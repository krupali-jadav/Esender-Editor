import { Button, Form, Input, Modal } from 'antd'
import { t } from 'i18next'

function AddDomain({ open, onClose }) {
    return (
        <Modal
            title={t("add.group", { defaultValue: "Add Group" })}
            open={open}
            onCancel={onClose}
            width={500}
            centered
            footer={[
                <Button key="cancel" onClick={onClose}>
                    {t("cancel", { defaultValue: "Cancel" })}
                </Button>,
                <Button key="add" type="primary">
                    {t("add", { defaultValue: "Add", })}
                </Button>
            ]}
        >
            <Form layout="vertical" >
                <Form.Item
                    label={t("group.name", { defaultValue: "Domain Name" })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: t("please.enter.domain.name", { defaultValue: "Please enter domain name" }),
                        },
                    ]}
                >
                    <Input
                        placeholder={t("enter.domain.name", { defaultValue: "Enter Doamain Name" })}
                    />
                </Form.Item>
            </Form>

        </Modal>
    )
}

export default AddDomain