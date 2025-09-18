import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileText, Star, Clock } from 'lucide-react';
import {
    useNotesViewsQuery,
    useDefaultNotesViewQuery,
    useNotesViewConfigQuery,
    useNotesFrozenConfigQuery,
    useNotesQuery,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
} from '../hooks/use-notes-document-view';

export function NotesPage() {
    // Fetch notes data
    const { data: views, isLoading: viewsLoading } = useNotesViewsQuery();
    const { data: defaultView, isLoading: defaultViewLoading } = useDefaultNotesViewQuery();
    const { data: viewConfig, isLoading: configLoading } = useNotesViewConfigQuery();
    const { data: apiFrozenConfig, isLoading: frozenConfigLoading } = useNotesFrozenConfigQuery();
    const { data: notesDatabase, isLoading: databaseLoading } = useNotesQuery();

    // Mutations
    const updateNoteMutation = useUpdateNoteMutation();
    const deleteNoteMutation = useDeleteNoteMutation();

    // Loading state
    const isLoading = viewsLoading || defaultViewLoading || configLoading || frozenConfigLoading || databaseLoading;

    // Extract data
    const notesRecords = notesDatabase?.records || [];
    const databaseMetadata = notesDatabase?.metadata;

    // Handlers
    const handleRecordEdit = (record: any) => {
        console.log('Edit note:', record);
        // TODO: Implement note editing
    };

    const handleRecordDelete = async (recordId: string) => {
        try {
            await deleteNoteMutation.mutateAsync(recordId);
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const handleRecordUpdate = async (recordId: string, updates: Record<string, any>) => {
        try {
            await updateNoteMutation.mutateAsync({ noteId: recordId, updates });
        } catch (error) {
            console.error('Failed to update note:', error);
        }
    };

    if (isLoading) {
        return (
            <>
                <EnhancedHeader />
                <Main className="space-y-8">
                    <div className="space-y-2">
                        <p className="text-muted-foreground">
                            Loading your notes...
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
                        Manage your personal knowledge base
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium">Total Notes</p>
                                    <p className="text-2xl font-bold">{notesRecords.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-600" />
                                <div>
                                    <p className="text-sm font-medium">Favorites</p>
                                    <p className="text-2xl font-bold">
                                        {notesRecords.filter(note => note.properties?.isFavorite).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium">Types</p>
                                    <p className="text-2xl font-bold">
                                        {new Set(notesRecords.map(note => note.properties?.type).filter(Boolean)).size}
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
                                        {notesRecords.filter(note => {
                                            const updatedAt = new Date(note.updatedAt);
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

                {/* Notes Document View */}
                {/*<DocumentView*/}
                {/*    database={notesDatabase}*/}
                {/*    records={notesRecords}*/}
                {/*    moduleType="notes"*/}
                {/*    config={{*/}
                {/*        title: databaseMetadata?.displayNamePlural || 'Notes',*/}
                {/*        icon: databaseMetadata?.icon || '📝',*/}
                {/*        description: databaseMetadata?.description || 'Manage your personal knowledge base',*/}
                {/*        canCreate: true,*/}
                {/*        canEdit: true,*/}
                {/*        canDelete: true,*/}
                {/*        canShare: true,*/}
                {/*        enableViews: true,*/}
                {/*        enableSearch: true,*/}
                {/*        enableFilters: true,*/}
                {/*        enableSorts: true,*/}
                {/*        disablePropertyManagement: false,*/}
                {/*        isFrozen: false,*/}
                {/*        defaultViewId: defaultView?.id,*/}
                {/*        apiFrozenConfig: apiFrozenConfig,*/}
                {/*    }}*/}
                {/*    onRecordEdit={handleRecordEdit}*/}
                {/*    onRecordDelete={handleRecordDelete}*/}
                {/*    onRecordUpdate={handleRecordUpdate}*/}
                {/*/>*/}
            </Main>
        </>
    );
}

export default NotesPage;