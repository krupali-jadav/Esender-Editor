import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Dropdown, Flex, message, Space, Table } from "antd";
import { staticModal } from "../../util/staticFn";
import { t } from "i18next";
import AddSupport from "./AddSupport";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { deleteSupport, getUserSetting } from "./SettingApi";

function Support() {
  const [supportList, setSupportList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupport, setSelectedSupport] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useSelector((state) => state?.app?.theme);
  const getSupportList = async () => {
    try {
      setLoading(true);
      const data = await getUserSetting();

      if (data?.status) {
        setSupportList(data?.setting?.support || []);
      }
    } catch (error) {
      console.log(error);
      message.error(error?.message || "Failed to get support list");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getSupportList();
  }, []);

  const openEditModal = (record) => {
    setSelectedSupport(record);
    setModalOpen(true);
  };

  const handleDelete = (record) => {
    staticModal.confirm({
      title: t("delete.support", { defaultValue: "Delete Support" }),
      content: `Are you sure you want to delete "${record.name}"?`,
      okText: t("delete", { defaultValue: "Delete" }),
      cancelText: t("cancel", { defaultValue: "Cancel" }),
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        try {
          const data = await deleteSupport({
            support_id: record._id,
          });

          if (data?.status) {
            message.success(data?.message);

            getSupportList();
          }
        } catch (error) {
          console.log(error);
          message.error(error?.message);
        }
      },
    });
  };
  const columns = [
    {
      title: t("name", { defaultValue: "Name" }),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("phone_number", { defaultValue: "Phone Number" }),
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: t("department", { defaultValue: "Department" }),
      dataIndex: "department",
      key: "department",
    },
    {
      title: t("actions", { defaultValue: "Actions" }),
      key: "actions",
      width: 70,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: t("edit", { defaultValue: "Edit" }),
                onClick: () => openEditModal(record),
              },
              {
                key: "2",
                label: t("delete", { defaultValue: "Delete" }),
                onClick: () => handleDelete(record),
                danger: true,
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    }

  ];
  return (
    <Card
      style={{
        borderRadius: 0,
        borderColor: theme ? "transparent" : "#fff",
      }} >
      <Space direction="vertical" style={{ width: "100%" }} >
        <Flex justify="end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedSupport(null);
              setModalOpen(true);
            }}
          >
            {t("add", { defaultValue: "Add" })}
          </Button>
          <AddSupport
            open={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedSupport(null);
            }}
            editData={selectedSupport}
            onSuccess={getSupportList}
          />
        </Flex>

        <Table
          rowKey="_id"
          loading={loading}
          scroll={{ x: "max-content" }}
          columns={columns}
          pagination={false}
          dataSource={supportList}
        />
      </Space>
    </Card>
  )
}

export default Support