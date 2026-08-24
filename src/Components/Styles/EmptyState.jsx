import { Flex, Typography } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const EmptyState = ({ icon, title, description, action, style }) => {
  return (
    <Flex vertical align="center" justify="center" gap={12} style={{ padding: "48px 24px", textAlign: "center", ...style }}>
      <Flex
        className="ds-empty-icon"
        align="center"
        justify="center"
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "rgba(32,166,206,0.1)",
          color: "var(--ds-violet)",
          fontSize: 26,
        }}
      >
        {icon || <InboxOutlined />}
      </Flex>
      <Title level={5} style={{ margin: 0 }}>
        {title}
      </Title>
      {description && (
        <Text type="secondary" style={{ maxWidth: 380 }}>
          {description}
        </Text>
      )}
      {action}
    </Flex>
  );
};

export default EmptyState;
