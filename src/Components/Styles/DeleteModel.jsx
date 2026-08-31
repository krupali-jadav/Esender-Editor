import { ExclamationCircleFilled } from "@ant-design/icons";
import { Flex, Modal, Typography } from "antd";
import { t } from "i18next";

function DeleteModal({
    open,
    record = null,
    selectedRowKeys = [],
    loading = false,
    itemName = "Item",
    itemNamePlural = "Items",
    onCancel,
    onConfirm,
}) {
    const isMultiple = selectedRowKeys.length > 0 && !record;
    const {Text} = Typography;

    return (
        <Modal
            title={
                <Flex align="center" gap={12}>
                    <ExclamationCircleFilled
                        style={{
                            color: "#faad14",
                            fontSize: 22,
                        }}
                    />

                    <Text strong style={{ fontSize: 16 }}>
                        {isMultiple
                            ? `Delete ${itemNamePlural}`
                            : `Delete ${itemName}`}
                    </Text>
                </Flex>
            }
            open={open}
            okText={t("delete", { defaultValue: "Delete" })}
            okButtonProps={{
                danger: true,
                loading,
            }}
            cancelText={t("cancel", { defaultValue: "Cancel" })}
            onCancel={onCancel}
            onOk={onConfirm}
        >
            <p>
                {isMultiple
                    ? `Are you sure you want to delete ${selectedRowKeys.length} ${itemName.toLowerCase()}${selectedRowKeys.length > 1 ? "s" : ""
                    }?`
                    : `Are you sure you want to delete "${record?.name}" ${itemName.toLowerCase()}?`}
            </p>
        </Modal>
    );
}

export default DeleteModal;