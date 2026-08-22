import { Tabs } from 'antd'
import Auditlog from './Auditlog'
import TeamRoles from './TeamRoles'
import AppPageHeader from '../Styles/AppHeader'
import { useState } from 'react'

const TAB_ITEMS = [
    { key: 'profile', label: 'Profile' },
    { key: 'team-roles', label: 'Team & Roles' },
    { key: 'security', label: 'Security' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'audit-log', label: 'Audit Log' },
]

const TAB_HEADERS = {
    profile: {
        title: 'Profile',
        description: 'Manage your profile information and workspace preferences.',
    },
    'team-roles': {
        title: 'Team & Roles',
        description: 'Manage who has access to this workspace and their permission levels.',
    },
    security: {
        title: 'Security',
        description: 'Manage your workspace security and authentication settings.',
    },
    notifications: {
        title: 'Notifications',
        description: 'Configure your workspace notification preferences.',
    },
    'audit-log': {
        title: 'Settings',
        description: 'Manage your workspace configuration, security protocols, and team access.',
    },
}

function Setting() {
    const [activeTab, setActiveTab] = useState('profile')
    const currentHeader = TAB_HEADERS[activeTab]
    return (
        <div>
            <div style={{ padding: 24 }}>
                <AppPageHeader
                    title={currentHeader.title}
                    description={currentHeader.description}
                />

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={TAB_ITEMS}
                />
            </div>

            <div>
                {activeTab === 'audit-log' && <Auditlog />}
                {activeTab === 'team-roles' && <TeamRoles />}
            </div>
        </div>
    )
}

export default Setting