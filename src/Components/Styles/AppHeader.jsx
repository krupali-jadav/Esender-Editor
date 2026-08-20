import { Flex, Grid, Space, Typography } from "antd";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

/**
 * Standard page header: eyebrow/breadcrumb, title, description, and a
 * primary + secondary action slot that wraps onto its own row on small
 * screens instead of squeezing against the title.
 */
const AppPageHeader = ({ eyebrow, title, description, tags, primaryAction, secondaryActions, tabs }) => {
  const screens = useBreakpoint();

  return (
    <Flex vertical gap={16} style={{ marginBottom: 24 }} className="ds-fade-in">
      <Flex
        justify="space-between"
        align={screens.md ? "center" : "flex-start"}
        gap={16}
        vertical={!screens.md}
      >
        <Flex vertical gap={4} style={{ minWidth: 0 }}>
          {eyebrow && (
            <Text type="secondary" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4, textTransform: "uppercase" }}>
              {eyebrow}
            </Text>
          )}
          <Flex align="center" gap={12} wrap="wrap">
            <Title level={3} className="ds-heading-font" style={{ margin: 0, fontWeight: 700 }}>
              {title}
            </Title>
            {tags}
          </Flex>
          {description && (
            <Text type="secondary" style={{ fontSize: 14, maxWidth: 640 }}>
              {description}
            </Text>
          )}
        </Flex>

        {(primaryAction || secondaryActions) && (
          <Space wrap size={8}>
            {secondaryActions}
            {primaryAction}
          </Space>
        )}
      </Flex>

      {tabs}
    </Flex>
  );
};

export default AppPageHeader;
