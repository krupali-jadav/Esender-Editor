import { useState } from 'react'
import { Breadcrumb, Typography, Tag, Tabs, ConfigProvider } from 'antd'
import ProjectDomain from './projectDomain'
import ProjectTemplate from './projectTemplate'
import ProjectCredential from './projectCredential'
import ProjectIntegration from './projectIntegration'
import { useSelector } from 'react-redux'
const { Title } = Typography


const TAB_ITEMS = [
    { key: 'overview', label: 'Overview' },
    { key: 'templates', label: 'Templates' },
    { key: 'domains', label: 'Domains' },
    { key: 'credentials', label: 'Credentials' },
    { key: 'usage', label: 'Usage' },
    { key: 'integration', label: 'Integration' },
]

function Projects() {
    const [activeTab, setActiveTab] = useState('domains');
    const selectedProject = useSelector(
        (state) => state?.app?.selectedProject
    );

    return (
        <div>
            <div style={{ margin: 0,/*  background: '#fff'  */ }}>
                <div style={{ padding: '24px 0 0 24px' }}>
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[{ title: 'Projects' }, { title: 'Marketing Emails' }]}
                        style={{ marginBottom: 10 }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8, }}>
                        <Title level={3} style={{ marginTop: 7 }}>
                            {selectedProject?.name || "Project"}
                        </Title>

                        <Tag color="green" bordered={false} >
                            {selectedProject?.environment ? selectedProject.environment.toUpperCase() : "LIVE"}
                        </Tag>
                        <Tag bordered >
                            {selectedProject?.publicProjectId || selectedProject?._id}
                        </Tag>
                    </div>

                    <ConfigProvider
                        theme={{
                            token: { colorPrimary: '#20A6CE', },
                        }}
                    >
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={TAB_ITEMS}
                        />
                    </ConfigProvider>
                </div>
            </div>
            <div>
                {activeTab === 'domains' && <ProjectDomain />}
                {activeTab === 'templates' && (<ProjectTemplate />)}
                {activeTab === 'credentials' && (<ProjectCredential />)}
                {activeTab === 'integration' && (<ProjectIntegration />)}
            </div>
        </div>
    )
}

export default Projects
