import { Card, Flex, Typography } from "antd";

const { Title, Text } = Typography;

/**
 * Base surface for every panel in the app. Wraps antd Card with the Aurora
 * Studio border/shadow treatment and an optional title/description/extra
 * header row, so pages don't hand-roll that layout repeatedly.
 */
const AppCard = ({
  title,
  description,
  extra,
  accent,
  bodyStyle,
  style,
  children,
  interactive = false,
  className,
  ...rest
}) => {
  const mergedClassName = [interactive ? "ds-interactive-card" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Card
      className={mergedClassName || undefined}
      style={{
        borderRadius: 14,
        borderColor: "var(--ds-card-border)",
        boxShadow: "var(--ds-shadow-sm)",
        borderTop: accent ? `3px solid ${accent}` : undefined,
        ...style,
      }}
      styles={{ body: { padding: 24, ...bodyStyle } }}
      {...rest}
    >
      {(title || extra) && (
        <Flex justify="space-between" align="flex-start" style={{ marginBottom: description ? 4 : 16 }}>
          {title && (
            <Title level={5} style={{ margin: 0, fontWeight: 600 }}>
              {title}
            </Title>
          )}
          {extra}
        </Flex>
      )}
      {description && (
        <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
          {description}
        </Text>
      )}
      {children}
    </Card>
  );
};

export default AppCard;
