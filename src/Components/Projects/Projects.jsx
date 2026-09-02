import { useState } from 'react'
import { Typography, Tag, Tabs, ConfigProvider, Button, Flex, Space } from 'antd'
import ProjectDomain from './projectDomain'
import ProjectTemplate from './projectTemplate'
import ProjectCredential from './projectCredential'
import ProjectIntegration from './projectIntegration'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { t } from 'i18next'
import ProjectOverview from './ProjectOverview'
const { Title, Text } = Typography


const TAB_ITEMS = [
    { key: 'overview', label: 'Overview' },
    { key: 'templates', label: 'Templates' },
    { key: 'domains', label: 'Domains' },
    { key: 'credentials', label: 'Credentials' },
    { key: 'integration', label: 'Integration' },
]

function Projects() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('overview');
    const selectedProject = useSelector((state) => state?.app?.selectedProject);

    return (
        <div>
            <div style={{ margin: 0 }}>
                <div style={{ padding: '24px 0 0 24px' }}>
                    {/* Breadcrumb */}
                    <Text type="secondary">Projects</Text>

                    <Flex wrap="wrap" justify="space-between" align="center" gap={12}>
                        <Flex
                            wrap="wrap"
                            align="center"
                            gap={8}
                            style={{ minWidth: 0, flex: 1 }}
                        >
                            <Title level={3} ellipsis style={{ margin: 0, minWidth: 0, }}>
                                {selectedProject?.name || "Project"}
                            </Title>

                            <Tag color="green" bordered={false} >
                                {selectedProject?.environment ? selectedProject.environment.toUpperCase() : "LIVE"}
                            </Tag>
                            <Tag bordered >
                                {selectedProject?.publicProjectId || selectedProject?._id}
                            </Tag>
                        </Flex>
                        <div>
                            <Space direction='horizontal' size={8} wrap="wrap" >
                                <Button type="primary" style={{ marginRight: 10 }} onClick={() => navigate('/select-project')}>
                                    {t('switch.project', { defaultValue: 'Switch Project' })}
                                </Button>
                                <Button type="primary" style={{ marginRight: 10 }} onClick={() => navigate('/workflow')}>
                                    {t('create.new.project', { defaultValue: 'Create New Project' })}
                                </Button>
                            </Space>
                        </div>
                    </Flex>

                    <ConfigProvider theme={{ token: { colorPrimary: '#20A6CE', }, }}>
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={TAB_ITEMS}
                        />
                    </ConfigProvider>
                </div>
            </div>
            <div>
                {activeTab === 'overview' && <ProjectOverview setActiveTab={setActiveTab} />}
                {activeTab === 'domains' && <ProjectDomain />}
                {activeTab === 'templates' && (<ProjectTemplate />)}
                {activeTab === 'credentials' && (<ProjectCredential />)}
                {activeTab === 'integration' && (<ProjectIntegration />)}
            </div>
        </div>
    )
}

export default Projects
