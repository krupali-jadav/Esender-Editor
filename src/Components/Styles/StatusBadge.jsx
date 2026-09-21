import { Tag } from "antd";
import { statusToneMap } from "../theme/tokens";

// antd's semantic/preset tag colors already adapt to light & dark themes on
// their own, so tones map onto them instead of hard-coded hex pairs.
const TONE_TAG_COLOR = {
  neutral: "default",
  violet: "purple",
  blue: "blue",
  cyan: "cyan",
  success: "success",
  warning: "warning",
  error: "error",
};

const toTitleCase = (value) =>
  String(value)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Status indicator used across campaigns, domains, webhooks, contacts, etc.
 * Always renders text (never color alone) and looks up a sensible tone from
 * `status` unless one is passed explicitly.
 */
const StatusBadge = ({ status, label, tone, icon }) => {
  const resolvedTone = tone || statusToneMap[String(status).toLowerCase()] || "neutral";
  const color = TONE_TAG_COLOR[resolvedTone] || "default";

  return (
    <Tag color={color} icon={icon} style={{ borderRadius: 6, fontWeight: 500 }}>
      {label ?? toTitleCase(status)}
    </Tag>
  );
};

export default StatusBadge;
