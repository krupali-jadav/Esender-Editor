import { Space, Typography } from "antd";

const { Text } = Typography;

export default function SelectTile({
    selected,
    onClick,
    icon,
    title,
    desc,
}) {
    return (
        <div
            onClick={onClick}
            style={{
                width: "100%",
                minHeight: 86,
                boxSizing: "border-box",
                border: `1px solid ${
                    selected ? "#20A6CE" : "#E7E9F0"
                }`,
                background: selected ? "#F4FBFD" : "#FFFFFF",
                borderRadius: 8,
                padding: 16,
                cursor: "pointer",
            }}
        >
            <Space align="start">
                {icon}

                <div>
                    <Text strong>{title}</Text>

                    {desc && (
                        <>
                            <br />
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                {desc}
                            </Text>
                        </>
                    )}
                </div>
            </Space>
        </div>
    );
}