import React, { useState } from 'react'
import { Breadcrumb, Typography, Tag, Tabs, ConfigProvider } from 'antd'
import ProjectDomain from './projectDomain'
import ProjectTemplate from './projectTemplate'
import ProjectCredential from './projectCredential'
import ProjectIntegration from './projectIntegration'
const { Title } = Typography


const TAB_ITEMS = [
    { key: 'overview', label: 'Overview' },
    { key: 'templates', label: 'Templates' },
    { key: 'domains', label: 'Domains' },
    { key: 'credentials', label: 'Credentials' },
    { key: 'usage', label: 'Usage' },
    { key: 'integration', label: 'Integration' },
    { key: 'settings', label: 'Settings' },
]

function Projects() {
    const [activeTab, setActiveTab] = useState('domains')

    return (
        <div>
            <div style={{ margin: 0, background: '#fff' }}>
                <div style={{ padding: '24px 0 0 24px' }}>
                    {/* Breadcrumb */}
                    <Breadcrumb
                        items={[{ title: 'Projects' }, { title: 'Marketing Emails' }]}
                        style={{ marginBottom: 8 }}
                    />

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            marginBottom: 16,
                        }}
                    >
                        <Title level={3} style={{ margin: 0 }}>
                            Marketing Emails
                        </Title>
                        <Tag color="green" bordered={false}>
                            Live
                        </Tag>
                        <Tag bordered style={{ fontFamily: 'monospace' }}>
                            prj_live_8823
                        </Tag>
                    </div>

                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#20A6CE',
                            },
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
                {activeTab === 'templates' && (
                    <ProjectTemplate />
                )}
                {activeTab === 'credentials' && (
                    <ProjectCredential />
                )}
                {activeTab === 'integration' && (
                    <ProjectIntegration />
                )}
            </div>
        </div>
    )
}

export default Projects
