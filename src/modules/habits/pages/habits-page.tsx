import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw, Star, Clock, TrendingUp } from 'lucide-react';
import { DatabaseView } from '@/modules/database-view';
import {
    useHabitViewsQuery,
    useDefaultHabitViewQuery,
    useHabitViewConfigQuery,
    useHabitFrozenConfigQuery,
    useHabitsQuery,
    useUpdateHabitMutation,
    useDeleteHabitMutation,
} from '../hooks/use-habits-document-view';

export function HabitsPage() {
    // Fetch habits data
    const { data: views, isLoading: viewsLoading } = useHabitViewsQuery();
    const { data: defaultView, isLoading: defaultViewLoading } = useDefaultHabitViewQuery();
    const { data: viewConfig, isLoading: configLoading } = useHabitViewConfigQuery();
    const { data: apiFrozenConfig, isLoading: frozenConfigLoading } = useHabitFrozenConfigQuery();
    const { data: habitsDatabase, isLoading: databaseLoading } = useHabitsQuery();

    // Mutations
    const updateHabitMutation = useUpdateHabitMutation();
    const deleteHabitMutation = useDeleteHabitMutation();

    // Loading state
    const isLoading = viewsLoading || defaultViewLoading || configLoading || frozenConfigLoading || databaseLoading;

    // Extract data
    const habitsRecords = habitsDatabase?.records || [];
    const databaseMetadata = habitsDatabase?.metadata;

    // Handlers
    const handleRecordEdit = (record: any) => {
        // TODO: Implement habits editing
    };

    const handleRecordDelete = async (recordId: string) => {
        try {
            await deleteHabitMutation.mutateAsync(recordId);
        } catch (error) {
            console.error('Failed to delete habits:', error);
        }
    };

    const handleRecordUpdate = async (recordId: string, updates: Record<string, any>) => {
        try {
            await updateHabitMutation.mutateAsync({ habitsId: recordId, updates });
        } catch (error) {
            console.error('Failed to update habits:', error);
        }
    };

    if (isLoading) {
        return (
            <>
                <EnhancedHeader />
                <Main className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-muted-foreground">
                            Loading your habits...
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
                        Build and track your daily habits
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <RotateCcw className="h-4 w-4 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium">Total Habits</p>
                                    <p className="text-2xl font-bold">{habitsRecords.length}</p>
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
                                        {habitsRecords.filter(item => item.properties?.status === 'active' || item.properties?.status === 'in-progress').length}
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
                                        {habitsRecords.filter(item => item.properties?.status === 'completed' || item.properties?.status === 'done').length}
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
                                        {habitsRecords.filter(item => {
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

                {/* Habits Document View */}
                <DatabaseView
                    database={habitsDatabase}
                    records={habitsRecords}
                    moduleType="habits"
                    config={{
                        title: databaseMetadata?.displayNamePlural || 'Habits',
                        icon: databaseMetadata?.icon || '🔄',
                        description: databaseMetadata?.description || 'Build and track your daily habits',
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

export default HabitsPage;