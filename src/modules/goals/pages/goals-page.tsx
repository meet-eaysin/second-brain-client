import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Star, Clock, TrendingUp } from 'lucide-react';
import { DocumentView } from '@/modules/document-view';
import {
    useGoalViewsQuery,
    useDefaultGoalViewQuery,
    useGoalViewConfigQuery,
    useGoalFrozenConfigQuery,
    useGoalsQuery,
    useUpdateGoalMutation,
    useDeleteGoalMutation,
} from '../hooks/use-goals-document-view';

export function GoalsPage() {
    // Fetch goals data
    const { data: views, isLoading: viewsLoading } = useGoalViewsQuery();
    const { data: defaultView, isLoading: defaultViewLoading } = useDefaultGoalViewQuery();
    const { data: viewConfig, isLoading: configLoading } = useGoalViewConfigQuery();
    const { data: apiFrozenConfig, isLoading: frozenConfigLoading } = useGoalFrozenConfigQuery();
    const { data: goalsDatabase, isLoading: databaseLoading } = useGoalsQuery();

    // Mutations
    const updateGoalMutation = useUpdateGoalMutation();
    const deleteGoalMutation = useDeleteGoalMutation();

    // Loading state
    const isLoading = viewsLoading || defaultViewLoading || configLoading || frozenConfigLoading || databaseLoading;

    // Extract data
    const goalsRecords = goalsDatabase?.records || [];
    const databaseMetadata = goalsDatabase?.metadata;

    // Handlers
    const handleRecordEdit = (record: any) => {
        console.log('Edit goals:', record);
        // TODO: Implement goals editing
    };

    const handleRecordDelete = async (recordId: string) => {
        try {
            await deleteGoalMutation.mutateAsync(recordId);
        } catch (error) {
            console.error('Failed to delete goals:', error);
        }
    };

    const handleRecordUpdate = async (recordId: string, updates: Record<string, any>) => {
        try {
            await updateGoalMutation.mutateAsync({ goalsId: recordId, updates });
        } catch (error) {
            console.error('Failed to update goals:', error);
        }
    };

    if (isLoading) {
        return (
            <>
                <EnhancedHeader />
                <Main className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-muted-foreground">
                            Loading your goals...
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
                        Track your personal and professional goals
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium">Total Goals</p>
                                    <p className="text-2xl font-bold">{goalsRecords.length}</p>
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
                                        {goalsRecords.filter(item => item.properties?.status === 'active' || item.properties?.status === 'in-progress').length}
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
                                        {goalsRecords.filter(item => item.properties?.status === 'completed' || item.properties?.status === 'done').length}
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
                                        {goalsRecords.filter(item => {
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

                {/* Goals Document View */}
                <DocumentView
                    database={goalsDatabase}
                    records={goalsRecords}
                    moduleType="goals"
                    config={{
                        title: databaseMetadata?.displayNamePlural || 'Goals',
                        icon: databaseMetadata?.icon || '🎯',
                        description: databaseMetadata?.description || 'Track your personal and professional goals',
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

export default GoalsPage;