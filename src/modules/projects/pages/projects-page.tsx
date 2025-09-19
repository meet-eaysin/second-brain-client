import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { Clipboard, Star, Clock, TrendingUp } from 'lucide-react';
import { DocumentView } from '@/modules/document-view';
import {
    useProjectViewsQuery,
    useDefaultProjectViewQuery,
    useProjectViewConfigQuery,
    useProjectFrozenConfigQuery,
    useProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
} from '../hooks/use-projects-document-view';

export function ProjectsPage() {
    // Fetch projects data
    const { data: views, isLoading: viewsLoading } = useProjectViewsQuery();
    const { data: defaultView, isLoading: defaultViewLoading } = useDefaultProjectViewQuery();
    const { data: viewConfig, isLoading: configLoading } = useProjectViewConfigQuery();
    const { data: apiFrozenConfig, isLoading: frozenConfigLoading } = useProjectFrozenConfigQuery();
    const { data: projectsDatabase, isLoading: databaseLoading } = useProjectsQuery();

    // Mutations
    const updateProjectMutation = useUpdateProjectMutation();
    const deleteProjectMutation = useDeleteProjectMutation();

    // Loading state
    const isLoading = viewsLoading || defaultViewLoading || configLoading || frozenConfigLoading || databaseLoading;

    // Extract data
    const projectsRecords = projectsDatabase?.records || [];
    const databaseMetadata = projectsDatabase?.metadata;

    // Handlers
    const handleRecordEdit = (record: any) => {
        // TODO: Implement projects editing
    };

    const handleRecordDelete = async (recordId: string) => {
        try {
            await deleteProjectMutation.mutateAsync(recordId);
        } catch (error) {
            console.error('Failed to delete projects:', error);
        }
    };

    const handleRecordUpdate = async (recordId: string, updates: Record<string, any>) => {
        try {
            await updateProjectMutation.mutateAsync({ projectsId: recordId, updates });
        } catch (error) {
            console.error('Failed to update projects:', error);
        }
    };

    if (isLoading) {
        return (
            <>
                <EnhancedHeader />
                <Main className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-muted-foreground">
                            Loading your projects...
                        </p>
                    </div>
                    <Card>
                        <CardContent className="p-8">
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        </CardContent>
                    </Card>
                </Main>
            </>
        );
    }

    return (
        <>
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Manage your projects and initiatives
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clipboard className="h-4 w-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium">Total Projects</p>
                                    <p className="text-2xl font-bold">{projectsRecords.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-600" />
                                <div>
                                    <p className="text-sm font-medium">Active</p>
                                    <p className="text-2xl font-bold">
                                        {projectsRecords.filter(item => item.properties?.status === 'active' || item.properties?.status === 'in-progress').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium">Completed</p>
                                    <p className="text-2xl font-bold">
                                        {projectsRecords.filter(item => item.properties?.status === 'completed' || item.properties?.status === 'done').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium">Recent</p>
                                    <p className="text-2xl font-bold">
                                        {projectsRecords.filter(item => {
                                            const updatedAt = new Date(item.updatedAt);
                                            const weekAgo = new Date();
                                            weekAgo.setDate(weekAgo.getDate() - 7);
                                            return updatedAt > weekAgo;
                                        }).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Projects Document View */}
                <DocumentView
                    database={projectsDatabase}
                    records={projectsRecords}
                    moduleType="projects"
                    config={{
                        title: databaseMetadata?.displayNamePlural || 'Projects',
                        icon: databaseMetadata?.icon || '📋',
                        description: databaseMetadata?.description || 'Manage your projects and initiatives',
                        canCreate: true,
                        canEdit: true,
                        canDelete: true,
                        canShare: true,
                        enableViews: true,
                        enableSearch: true,
                        enableFilters: true,
                        enableSorts: true,
                        disablePropertyManagement: false,
                        isFrozen: false,
                        defaultViewId: defaultView?.id,
                        apiFrozenConfig: apiFrozenConfig,
                    }}
                    onRecordEdit={handleRecordEdit}
                    onRecordDelete={handleRecordDelete}
                    onRecordUpdate={handleRecordUpdate}
                />
            </Main>
        </>
    );
}

export default ProjectsPage;