import {
    Typography,
    Button,
    Input,
    Select,
    Table,
    Avatar,
    Tag,
    Space,
    Card,
    Flex,
} from 'antd'
import {
    DownloadOutlined,
    SearchOutlined,
    CalendarOutlined,
    FilterOutlined,
    KeyOutlined,
    CloseCircleOutlined,
    UserAddOutlined,
    CreditCardOutlined,
} from '@ant-design/icons'
import AppPageHeader from '../Styles/AppHeader'
import { useSelector } from 'react-redux'

const { Text } = Typography

const iconWrapperStyle = (bg, color) => ({
    width: 32,
    height: 32,
    borderRadius: 8,
    background: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0,
})

const avatarColors = {
    JD: '#e6f0ff',
    UN: '#f0f0f0',
    MS: '#ffe9d6',
}

const data = [
    {
        key: '1',
        icon: <KeyOutlined />,
        iconBg: '#e6f0ff',
        iconColor: '#2f6fed',
        event: 'Rotated signing secret',
        subtext: 'Project: Production API',
        actorInitials: 'JD',
        actorName: 'Jane Doe',
        actorEmail: 'jane@bitbeast.io',
        ip: '192.168.1.184',
        ipDanger: false,
        date: 'Oct 24, 2023 14:32:01 UTC',
    },
    {
        key: '2',
        icon: <CloseCircleOutlined />,
        iconBg: '#fde8e8',
        iconColor: '#e5484d',
        event: 'Failed login attempt',
        subtext: 'Reason: Invalid credentials',
        actorInitials: 'UN',
        actorName: 'Unknown User',
        actorEmail: 'admin@bitbeast.io',
        ip: '184.28.19.122',
        ipDanger: true,
        date: 'Oct 24, 2023 09:15:44 UTC',
    },
    {
        key: '3',
        icon: <UserAddOutlined />,
        iconBg: '#e3fbf1',
        iconColor: '#12b76a',
        event: 'Added team member',
        subtext: 'Role: Developer',
        actorInitials: 'JD',
        actorName: 'Jane Doe',
        actorEmail: 'jane@bitbeast.io',
        ip: '192.168.1.184',
        ipDanger: false,
        date: 'Oct 23, 2023 16:45:10 UTC',
    },
    {
        key: '4',
        icon: <CreditCardOutlined />,
        iconBg: '#f5f0ff',
        iconColor: '#7c3aed',
        event: 'Updated payment method',
        subtext: 'Card ending in 4242',
        actorInitials: 'MS',
        actorName: 'Michael Smith',
        actorEmail: 'michael@bitbeast.io',
        ip: '98.214.33.15',
        ipDanger: false,
        date: 'Oct 22, 2023 11:20:05 UTC',
    },
]

function Auditlog() {
    const theme = useSelector((state) => state?.app?.theme);

    const columns = [
        {
            title: 'Event',
            dataIndex: 'event',
            key: 'event',
            render: (_, record) => (
                <Space align="start" size={12}>
                    <div style={iconWrapperStyle(record.iconBg, record.iconColor)}>
                        {record.icon}
                    </div>
                    <div>
                        <div style={{ fontWeight: 500 }}>{record.event}</div>
                        <Text type="secondary">
                            {record.subtext}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Actor',
            dataIndex: 'actor',
            key: 'actor',
            render: (_, record) => (
                <Space align="start" size={8}>
                    <Avatar
                        size={28}
                        style={{
                            backgroundColor: avatarColors[record.actorInitials] || '#f0f0f0',
                            color: '#333',
                            fontSize: 12,
                        }}
                    >
                        {record.actorInitials}
                    </Avatar>
                    <div>
                        <div>
                            {record.actorName}
                        </div>
                        <Text type="secondary">
                            {record.actorEmail}
                        </Text>
                    </div>
                </Space>
            ),
        },
        {
            title: 'IP Address',
            dataIndex: 'ip',
            key: 'ip',
            render: (_, record) => (
                <Tag
                    style={{
                        fontFamily: 'monospace',
                        background: record.ipDanger ? '#fef2f2' : '#f5f5f5',
                        color: record.ipDanger ? '#e5484d' : '#333',
                        border: record.ipDanger ? '1px solid #fecaca' : '1px solid #e5e5e5',
                    }}
                >
                    {record.ip}
                </Tag>
            ),
        },
        {
            title: 'Date & Time',
            dataIndex: 'date',
            key: 'date',
            render: (text) => (
                <Text type="secondary">
                    {text}
                </Text>
            ),
        },
    ]

    return (
        <div style={{ padding: 24 }}>
            <AppPageHeader title="Audit Log" description="A comprehensive record of security and administrative events  within your workspace. Logs are retained for 90 days." />

            {/* Filters row */}
            <Space direction='vertical' size="middle" style={{ width: "100%" }}>
                <Card>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
                        <Space size={12} wrap>
                            <Input
                                placeholder="Search templates..."
                                prefix={<SearchOutlined />}
                                style={{ width: 240 }}
                            />
                            <Select
                                defaultValue="all"
                                variant="borderless"
                                suffixIcon={<CalendarOutlined />}
                                style={{ width: 130, background: theme ? "#0A1622" : "#F5F8FA" }}
                                options={[
                                    { value: "all", label: "All Days" },
                                    { value: "7days", label: "Last 7 Days" },
                                    { value: "30days", label: "Last 30 Days" },
                                    { value: "90days", label: "Last 90 Days" },
                                ]}
                            />
                            <Select
                                defaultValue="all"
                                variant="borderless"
                                style={{ width: 130, background: theme ? "#0A1622" : "#F5F8FA" }}
                                options={[
                                    { value: "all_events", label: "All Events" },
                                    { value: "login", label: "Login" },
                                    { value: "security", label: "Security" },
                                ]}
                            />
                            <Select
                                defaultValue="all_actors"
                                variant="borderless"
                                style={{ width: 130, background: theme ? "#0A1622" : "#F5F8FA" }}
                                options={[
                                    { value: "all_actors", label: "All Actors" },
                                    { value: "jane", label: "Jane Doe" },
                                    { value: "michael", label: "Michael Smith" },
                                ]}
                            />
                            <Button icon={<FilterOutlined />} style={{ width: 40, height: 40, background: theme ? "#0A1622" : "#F5F8FA" }} />
                        </Space>

                        <Button style={{ backgroundColor: "#20A6CE", color: "#fff" }} icon={<DownloadOutlined />}>Export CSV</Button>
                    </Flex>
                </Card>

                {/* Table */}
                <Card styles={{ body: { padding: 0 } }}>
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={true}
                        components={{
                            header: {
                                cell: (props) => (
                                    <th
                                        {...props}
                                        style={{
                                            ...props.style,
                                            background: theme ? "#0E1C29" : "#F0F0F0",
                                        }}
                                    />
                                ),
                            },
                        }}
                    />
                </Card>
            </Space>

        </div>
    )
}

export default Auditlog