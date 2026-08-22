import { Space, Typography } from "antd";
import { useSelector } from "react-redux";

const { Text } = Typography;

export default function SelectTile({
    selected,
    onClick,
    icon,
    title,
    desc,
}) {
    const theme = useSelector((state) => state?.app?.theme);
    return (
        <div
            onClick={onClick}
            style={{
                width: "100%",
                minHeight: 86,
                boxSizing: "border-box",
                border: theme
                    ? `1px solid ${selected ? "#142b42" : "#2b313b"}`
                    : `1px solid ${selected ? "#20A6CE" : "#E7E9F0"}`,
                background: theme
                    ? selected
                        ? "#2b313b"
                        : "#142b42"
                    : selected
                        ? "#F4FBFD"
                        : "#FFFFFF",
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