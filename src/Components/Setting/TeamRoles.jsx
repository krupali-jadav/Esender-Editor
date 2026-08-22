import { useSelector } from 'react-redux'
import { Table, Avatar, Select, Tag, Input, Space, Typography, Card, Flex, } from 'antd'
import { SearchOutlined, MailOutlined } from '@ant-design/icons'
const { Text } = Typography

const members = [
  {
    key: '1',
    name: 'Elena Harding',
    email: 'elena@bitbeast.io',
    initials: 'EH',
    role: 'Owner',
    status: 'Active',
    lastActive: 'Just now',
    pending: false,
  },
  {
    key: '2',
    name: 'Marcus Chen',
    email: 'marcus.chen@example.com',
    photo: true,
    role: 'Designer',
    status: 'Active',
    lastActive: '2 hours ago',
    pending: false,
  },
  {
    key: '3',
    name: 'Awaiting acceptance',
    email: 'sarah.j@contractor.com',
    role: 'Developer',
    status: 'Active',
    lastActive: '-',
    pending: true,
  },
  {
    key: '4',
    name: 'Priya Sharma',
    email: 'priya.s@bitbeast.io',
    photo: true,
    role: 'Admin',
    status: 'Active',
    lastActive: '1 day ago',
    pending: false,
  },
]

function TeamRoles() {
  const theme = useSelector((state) => state?.app?.theme)

  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <Space align="start" size={10}>
          {record.pending ? (
            <Avatar
              size={32}
              icon={<MailOutlined />}
              style={{
                backgroundColor: theme ? '#1C2733' : '#F5F5F5',
                color: theme ? '#8B98A5' : '#999999',
              }}
            />
          ) : record.photo ? (
            <Avatar size={32} />
          ) : (
            <Avatar
              size={32}
              style={{
                backgroundColor: theme ? '#16344A' : '#E9E2FD',
                color: theme ? '#5AC8E6' : '#6941C6',
              }}
            >
              {record.initials}
            </Avatar>
          )}

          <div>
            <div
              style={{
                fontWeight: 500,
                fontStyle: 'normal',
                color: '#fff',
              }}
            >
              {record.name}
            </div>

            <Text type="secondary">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Select
          defaultValue="all"
          variant="borderless"
          style={{ width: 130, background: theme ? '#0A1622' : '#F5F8FA', borderRadius: 8 }}
          options={[
            { value: 'owner', label: 'Owner', },
            { value: 'admin', label: 'Admin', },
            { value: 'developer', label: 'Developer', },
          ]}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) =>
        status === 'Active' ? (
          <Tag color="success" variant="filled">
            ● Active
          </Tag>
        ) : (
          <Tag color="warning" variant="filled">
            ⏱ Pending
          </Tag>
        ),
    },
    {
      title: 'Last Active',
      dataIndex: 'lastActive',
      key: 'lastActive',
      render: (text) => (
        <Text type="secondary">
          {text}
        </Text>
      ),
    },
  ]

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Card>
          <Flex justify="space-between" align="center">
            <Input
              placeholder="Search members by name or email..."
              prefix={<SearchOutlined />}
              style={{ maxWidth: 320 }}
            />

            <Select
              defaultValue="all"
              variant="borderless"
              style={{ width: 130, background: theme ? '#0A1622' : '#F5F8FA', borderRadius: 8 }}
              options={[
                { value: 'all', label: 'All', },
                { value: 'owner', label: 'Owner', },
                { value: 'admin', label: 'Admin', },
                { value: 'developer', label: 'Developer', },
              ]}
            />
          </Flex>
        </Card>

        <Card styles={{ body: { padding: 0, } }}>
          <Table
            columns={columns}
            dataSource={members}
            pagination={true}
            scroll={{ x: "max-content" }}
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

export default TeamRoles