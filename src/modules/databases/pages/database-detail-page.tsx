import { useParams, useNavigate } from 'react-router-dom';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Header } from '@/layout/header';
import { Main } from '@/layout/main';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { DocumentView } from '../../document-view';
import { DatabasesProvider, createDatabaseSchema } from '../../document-view/providers/databases-provider';
import { useDatabase, useRecords } from '../services/databaseQueries';
import type { DatabaseRecord, Database } from '@/types/document.types.ts';

// Comprehensive demo data showcasing all DocumentView features
const demoDatabase: Database = {
    id: 'demo-project-management',
    name: 'Project Management Demo',
    icon: '�',
    description: 'Comprehensive demo showcasing all DocumentView features and capabilities',
    properties: [
        {
            id: 'title',
            name: 'Task Title',
            type: 'TEXT',
            required: true,
            order: 0,
            isVisible: true
        },
        {
            id: 'status',
            name: 'Status',
            type: 'SELECT',
            required: false,
            order: 1,
            isVisible: true,
            selectOptions: [
                { id: 'backlog', name: 'Backlog', color: '#6b7280' },
                { id: 'todo', name: 'To Do', color: '#3b82f6' },
                { id: 'inprogress', name: 'In Progress', color: '#f59e0b' },
                { id: 'review', name: 'In Review', color: '#8b5cf6' },
                { id: 'done', name: 'Done', color: '#10b981' },
                { id: 'blocked', name: 'Blocked', color: '#ef4444' }
            ]
        },
        {
            id: 'priority',
            name: 'Priority',
            type: 'SELECT',
            required: false,
            order: 2,
            isVisible: true,
            selectOptions: [
                { id: 'critical', name: 'Critical', color: '#dc2626' },
                { id: 'high', name: 'High', color: '#ea580c' },
                { id: 'medium', name: 'Medium', color: '#ca8a04' },
                { id: 'low', name: 'Low', color: '#16a34a' }
            ]
        },
        {
            id: 'assignee',
            name: 'Assignee',
            type: 'TEXT',
            required: false,
            order: 3,
            isVisible: true
        },
        {
            id: 'team',
            name: 'Team',
            type: 'SELECT',
            required: false,
            order: 4,
            isVisible: true,
            selectOptions: [
                { id: 'frontend', name: 'Frontend', color: '#3b82f6' },
                { id: 'backend', name: 'Backend', color: '#10b981' },
                { id: 'design', name: 'Design', color: '#8b5cf6' },
                { id: 'qa', name: 'QA', color: '#f59e0b' },
                { id: 'devops', name: 'DevOps', color: '#ef4444' }
            ]
        },
        {
            id: 'dueDate',
            name: 'Due Date',
            type: 'DATE',
            required: false,
            order: 5,
            isVisible: true
        },
        {
            id: 'estimatedHours',
            name: 'Estimated Hours',
            type: 'NUMBER',
            required: false,
            order: 6,
            isVisible: true
        },
        {
            id: 'completed',
            name: 'Completed',
            type: 'CHECKBOX',
            required: false,
            order: 7,
            isVisible: true
        },
        {
            id: 'projectUrl',
            name: 'Project URL',
            type: 'URL',
            required: false,
            order: 8,
            isVisible: true
        },
        {
            id: 'contactEmail',
            name: 'Contact Email',
            type: 'EMAIL',
            required: false,
            order: 9,
            isVisible: true
        },
        {
            id: 'description',
            name: 'Description',
            type: 'TEXT',
            required: false,
            order: 10,
            isVisible: true
        },
        {
            id: 'tags',
            name: 'Tags',
            type: 'TEXT',
            required: false,
            order: 11,
            isVisible: true
        }
    ],
    views: [
        {
            id: 'table-view',
            name: 'All Tasks',
            type: 'TABLE',
            isDefault: true,
            visibleProperties: ['title', 'status', 'priority', 'assignee', 'team', 'dueDate', 'estimatedHours'],
            filters: [],
            sorts: [{ propertyId: 'priority', direction: 'desc' }, { propertyId: 'dueDate', direction: 'asc' }]
        },
        {
            id: 'board-view',
            name: 'Kanban Board',
            type: 'KANBAN',
            isDefault: false,
            visibleProperties: ['title', 'priority', 'assignee', 'dueDate', 'estimatedHours'],
            filters: [],
            sorts: [{ propertyId: 'priority', direction: 'desc' }],
            groupBy: 'status'
        },
        {
            id: 'team-board',
            name: 'Team Board',
            type: 'KANBAN',
            isDefault: false,
            visibleProperties: ['title', 'status', 'priority', 'assignee', 'dueDate'],
            filters: [],
            sorts: [{ propertyId: 'dueDate', direction: 'asc' }],
            groupBy: 'team'
        },
        {
            id: 'gallery-view',
            name: 'Gallery',
            type: 'GALLERY',
            isDefault: false,
            visibleProperties: ['title', 'status', 'priority', 'description', 'tags'],
            filters: [],
            sorts: [{ propertyId: 'title', direction: 'asc' }]
        },
        {
            id: 'list-view',
            name: 'Simple List',
            type: 'LIST',
            isDefault: false,
            visibleProperties: ['title', 'assignee', 'dueDate'],
            filters: [{ propertyId: 'completed', operator: 'equals', value: false }],
            sorts: [{ propertyId: 'dueDate', direction: 'asc' }]
        },
        {
            id: 'calendar-view',
            name: 'Calendar',
            type: 'CALENDAR',
            isDefault: false,
            visibleProperties: ['title', 'status', 'assignee'],
            filters: [],
            sorts: [{ propertyId: 'dueDate', direction: 'asc' }]
        }
    ],
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
    frozen: false,
    ownerId: 'demo-user',
    isPublic: false,
    permissions: []
};

// Comprehensive demo records showcasing all property types and features
const demoRecords: DatabaseRecord[] = [
    {
        id: '1',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Implement user authentication system',
            status: 'inprogress',
            priority: 'critical',
            assignee: 'Sarah Chen',
            team: 'backend',
            dueDate: '2024-02-15',
            estimatedHours: 40,
            completed: false,
            projectUrl: 'https://github.com/company/auth-system',
            contactEmail: 'sarah.chen@company.com',
            description: 'Implement OAuth 2.0 authentication with JWT tokens, including login, logout, and session management.',
            tags: 'authentication, security, backend, oauth'
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-20T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '2',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Design new dashboard UI',
            status: 'review',
            priority: 'high',
            assignee: 'Alex Rodriguez',
            team: 'design',
            dueDate: '2024-02-10',
            estimatedHours: 24,
            completed: false,
            projectUrl: 'https://figma.com/dashboard-redesign',
            contactEmail: 'alex.rodriguez@company.com',
            description: 'Create modern, responsive dashboard design with improved UX and accessibility features.',
            tags: 'ui, ux, design, dashboard, responsive'
        },
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-18T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '3',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Setup CI/CD pipeline',
            status: 'done',
            priority: 'high',
            assignee: 'Marcus Kim',
            team: 'devops',
            dueDate: '2024-01-30',
            estimatedHours: 16,
            completed: true,
            projectUrl: 'https://jenkins.company.com/pipeline',
            contactEmail: 'marcus.kim@company.com',
            description: 'Configure automated testing, building, and deployment pipeline using Jenkins and Docker.',
            tags: 'devops, ci/cd, automation, jenkins, docker'
        },
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-30T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '4',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Mobile app responsive design',
            status: 'todo',
            priority: 'medium',
            assignee: 'Emma Thompson',
            team: 'frontend',
            dueDate: '2024-02-25',
            estimatedHours: 32,
            completed: false,
            projectUrl: 'https://github.com/company/mobile-app',
            contactEmail: 'emma.thompson@company.com',
            description: 'Implement responsive design for mobile devices with touch-friendly interactions.',
            tags: 'mobile, responsive, frontend, react-native'
        },
        createdAt: '2024-01-04T00:00:00.000Z',
        updatedAt: '2024-01-04T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '5',
        databaseId: 'demo-project-management',
        properties: {
            title: 'API performance optimization',
            status: 'inprogress',
            priority: 'high',
            assignee: 'David Park',
            team: 'backend',
            dueDate: '2024-02-20',
            estimatedHours: 28,
            completed: false,
            projectUrl: 'https://github.com/company/api-optimization',
            contactEmail: 'david.park@company.com',
            description: 'Optimize database queries and implement caching to improve API response times by 50%.',
            tags: 'performance, api, optimization, caching, database'
        },
        createdAt: '2024-01-05T00:00:00.000Z',
        updatedAt: '2024-01-22T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '6',
        databaseId: 'demo-project-management',
        properties: {
            title: 'User acceptance testing',
            status: 'blocked',
            priority: 'medium',
            assignee: 'Lisa Wang',
            team: 'qa',
            dueDate: '2024-03-01',
            estimatedHours: 20,
            completed: false,
            projectUrl: 'https://testplan.company.com/uat',
            contactEmail: 'lisa.wang@company.com',
            description: 'Coordinate with stakeholders for comprehensive user acceptance testing of new features.',
            tags: 'testing, uat, qa, stakeholders'
        },
        createdAt: '2024-01-06T00:00:00.000Z',
        updatedAt: '2024-01-25T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '7',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Database migration script',
            status: 'todo',
            priority: 'critical',
            assignee: 'James Wilson',
            team: 'backend',
            dueDate: '2024-02-12',
            estimatedHours: 12,
            completed: false,
            projectUrl: 'https://github.com/company/db-migration',
            contactEmail: 'james.wilson@company.com',
            description: 'Create and test database migration scripts for production deployment.',
            tags: 'database, migration, sql, production'
        },
        createdAt: '2024-01-07T00:00:00.000Z',
        updatedAt: '2024-01-07T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '8',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Security audit and fixes',
            status: 'review',
            priority: 'critical',
            assignee: 'Rachel Green',
            team: 'backend',
            dueDate: '2024-02-08',
            estimatedHours: 36,
            completed: false,
            projectUrl: 'https://security.company.com/audit',
            contactEmail: 'rachel.green@company.com',
            description: 'Conduct comprehensive security audit and implement necessary fixes for vulnerabilities.',
            tags: 'security, audit, vulnerabilities, compliance'
        },
        createdAt: '2024-01-08T00:00:00.000Z',
        updatedAt: '2024-01-28T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '9',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Component library documentation',
            status: 'done',
            priority: 'low',
            assignee: 'Tom Anderson',
            team: 'frontend',
            dueDate: '2024-01-25',
            estimatedHours: 8,
            completed: true,
            projectUrl: 'https://storybook.company.com',
            contactEmail: 'tom.anderson@company.com',
            description: 'Create comprehensive documentation for the React component library using Storybook.',
            tags: 'documentation, components, storybook, react'
        },
        createdAt: '2024-01-09T00:00:00.000Z',
        updatedAt: '2024-01-25T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '10',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Load testing infrastructure',
            status: 'backlog',
            priority: 'medium',
            assignee: 'Kevin Lee',
            team: 'devops',
            dueDate: '2024-03-15',
            estimatedHours: 24,
            completed: false,
            projectUrl: 'https://loadtest.company.com',
            contactEmail: 'kevin.lee@company.com',
            description: 'Setup load testing infrastructure to simulate high traffic scenarios and identify bottlenecks.',
            tags: 'load-testing, performance, infrastructure, monitoring'
        },
        createdAt: '2024-01-10T00:00:00.000Z',
        updatedAt: '2024-01-10T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '11',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Accessibility improvements',
            status: 'todo',
            priority: 'medium',
            assignee: 'Nina Patel',
            team: 'frontend',
            dueDate: '2024-02-28',
            estimatedHours: 20,
            completed: false,
            projectUrl: 'https://a11y.company.com',
            contactEmail: 'nina.patel@company.com',
            description: 'Implement WCAG 2.1 AA compliance improvements including keyboard navigation and screen reader support.',
            tags: 'accessibility, a11y, wcag, inclusive-design'
        },
        createdAt: '2024-01-11T00:00:00.000Z',
        updatedAt: '2024-01-11T00:00:00.000Z',
        createdBy: 'demo-user'
    },
    {
        id: '12',
        databaseId: 'demo-project-management',
        properties: {
            title: 'Analytics dashboard integration',
            status: 'inprogress',
            priority: 'low',
            assignee: 'Chris Martinez',
            team: 'frontend',
            dueDate: '2024-03-10',
            estimatedHours: 16,
            completed: false,
            projectUrl: 'https://analytics.company.com',
            contactEmail: 'chris.martinez@company.com',
            description: 'Integrate Google Analytics and custom tracking events into the dashboard interface.',
            tags: 'analytics, tracking, dashboard, metrics'
        },
        createdAt: '2024-01-12T00:00:00.000Z',
        updatedAt: '2024-01-26T00:00:00.000Z',
        createdBy: 'demo-user'
    }
];

// Simple Database Detail Page using only DocumentView
export default function DatabaseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Fetch real database data
    const { data: database, isLoading: isDatabaseLoading, error: databaseError } = useDatabase(id || '');
    const { data: recordsData, isLoading: isRecordsLoading } = useRecords(id || '');

    const handleBack = () => {
        navigate('/app/databases');
    };

    // Use demo data if no ID or if database not found, otherwise use real data
    const showDemo = !id || (!isDatabaseLoading && !database);
    const finalDatabase = showDemo ? demoDatabase : database;
    const finalRecords = showDemo ? demoRecords : (recordsData?.records || []);
    const isLoading = !showDemo && (isDatabaseLoading || isRecordsLoading);
    const error = !showDemo ? databaseError : null;

    return (
        <>
            <Header fixed>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-lg font-semibold">
                        {showDemo ? 'Project Management Demo' : (finalDatabase?.name || 'Database')}
                    </h1>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Search />
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <DatabasesProvider
                    enableIntegrations={false}
                    compactMode={false}
                    enableTimeTracking={false}
                >
                    <DocumentView
                        database={finalDatabase}
                        records={finalRecords}
                        isLoading={isLoading}
                        error={error?.message || null}
                        config={{
                            title: showDemo ? 'Project Management Demo' : finalDatabase?.name,
                            icon: showDemo ? '🚀' : finalDatabase?.icon,
                            description: finalDatabase?.description,
                            canCreate: true,
                            canEdit: true,
                            canDelete: true,
                            canShare: true,
                            enableViews: true,
                            enableSearch: true,
                            enableFilters: true,
                            enableSorts: true,
                            isFrozen: false,
                        }}
                    />
                </DatabasesProvider>
            </Main>
        </>
    );
}

