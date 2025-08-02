import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyForm } from './property-form';
import { DatabaseForm } from './database-form';
import { DatabaseViewRenderer } from './database-view-renderer';
import { useDatabaseById } from '../hooks/database-hooks';
import { useCreateRecord, useDeleteRecord, useRecords, useUpdateRecord } from '../hooks/record-hooks';
import type { DatabaseProperty, DatabaseRecord, DatabaseView } from '@/types/database.types';
import {
    Plus,
    MoreHorizontal,
    Settings,
    PlusCircle,
    ViewIcon,
    Filter,
    SortAsc,
    Table as TableIcon,
    Grid,
    Calendar,
    List,
    Columns,
    Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DataTablePage() {
    const { databaseId } = useParams<{ databaseId: string }>();
    const { data: database, isLoading: isLoadingDatabase } = useDatabaseById(databaseId!);
    const { data: recordsData, isLoading: isLoadingRecords } = useRecords(databaseId!);
    const createRecordMutation = useCreateRecord();
    const updateRecordMutation = useUpdateRecord();
    const deleteRecordMutation = useDeleteRecord();

    const [isEditDatabaseOpen, setIsEditDatabaseOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DatabaseRecord | null>(null);
    const [isPropertyFormOpen, setIsPropertyFormOpen] = useState(false);
    const [currentView, setCurrentView] = useState<string | null>(null);

    // Select default view when database loads
    React.useEffect(() => {
        if (database && database.views && database.views.length > 0) {
            const defaultView = database.views.find(v => v.isDefault) || database.views[0];
            setCurrentView(defaultView.id);
        }
    }, [database]);

    if (isLoadingDatabase) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!database) {
        return (
            <div className="text-center py-8">
                <h2 className="text-2xl font-bold mb-2">Database not found</h2>
                <p className="text-muted-foreground mb-6">The database you're looking for doesn't exist or you don't have access to it.</p>
                <Button asChild>
                    <Link to="/app/databases">Back to Databases</Link>
                </Button>
            </div>
        );
    }

    const handleCreateRecord = async () => {
        try {
            // Create a new record with default values
            const defaultProperties: Record<string, any> = {};
            database.properties.forEach(property => {
                // Set default values based on property type
                switch (property.type) {
                    case 'TEXT':
                        defaultProperties[property.id] = '';
                        break;
                    case 'NUMBER':
                        defaultProperties[property.id] = null;
                        break;
                    case 'CHECKBOX':
                        defaultProperties[property.id] = false;
                        break;
                    case 'SELECT':
                    case 'MULTI_SELECT':
                        defaultProperties[property.id] = property.type === 'SELECT' ? null : [];
                        break;
                    default:
                        defaultProperties[property.id] = null;
                }
            });

            await createRecordMutation.mutateAsync({
                databaseId: database.id,
                data: {
                    properties: defaultProperties,
                },
            });

            toast.success('New record added');
        } catch (error) {
            console.error('Error creating record:', error);
            toast.error('Failed to add new record');
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (!confirm('Are you sure you want to delete this record?')) return;

        try {
            await deleteRecordMutation.mutateAsync({
                databaseId: database.id,
                recordId,
            });
            toast.success('Record deleted successfully');
        } catch (error) {
            console.error('Error deleting record:', error);
            toast.error('Failed to delete record');
        }
    };

    const handleUpdateCell = async (recordId: string, propertyId: string, value: any) => {
        try {
            const records = recordsData?.data?.records || recordsData?.records || [];
            const record = records.find(r => r.id === recordId);
            if (!record) return;

            await updateRecordMutation.mutateAsync({
                databaseId: database.id,
                recordId,
                data: {
                    properties: {
                        ...record.properties,
                        [propertyId]: value,
                    },
                },
            });
        } catch (error) {
            console.error('Error updating cell:', error);
            toast.error('Failed to update cell');
        }
    };

    const renderCellValue = (property: DatabaseProperty, value: any) => {
        switch (property.type) {
            case 'TEXT':
                return value || '-';
            case 'NUMBER':
                return value !== null && value !== undefined ? value : '-';
            case 'CHECKBOX':
                return value ? '✓' : '☐';
            case 'SELECT':
                if (!value) return '-';
                const selectOption = property.selectOptions?.find(o => o.id === value);
                return selectOption ? (
                    <Badge style={{ backgroundColor: selectOption.color }}>
                        {selectOption.name}
                    </Badge>
                ) : value;
            case 'MULTI_SELECT':
                if (!value || !Array.isArray(value) || value.length === 0) return '-';
                return (
                    <div className="flex flex-wrap gap-1">
                        {value.map(optionId => {
                            const option = property.selectOptions?.find(o => o.id === optionId);
                            return option ? (
                                <Badge key={optionId} style={{ backgroundColor: option.color }}>
                                    {option.name}
                                </Badge>
                            ) : null;
                        })}
                    </div>
                );
            case 'DATE':
                return value ? new Date(value).toLocaleDateString() : '-';
            case 'URL':
                return value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {value}
                    </a>
                ) : '-';
            case 'CREATED_TIME':
            case 'LAST_EDITED_TIME':
                return value ? new Date(value).toLocaleString() : '-';
            default:
                return value || '-';
        }
    };

    const getCurrentView = (): DatabaseView | undefined => {
        if (!database || !database.views || database.views.length === 0) return undefined;
        if (currentView) {
            return database.views.find(v => v.id === currentView);
        }
        return database.views.find(v => v.isDefault) || database.views[0];
    };

    const getVisibleProperties = (): DatabaseProperty[] => {
        const view = getCurrentView();
        if (!view || !view.visibleProperties || view.visibleProperties.length === 0) {
            return database.properties;
        }
        return database.properties.filter(p => view.visibleProperties?.includes(p.id));
    };

    const viewTypeIcons: Record<string, React.ReactNode> = {
        'TABLE': <TableIcon className="h-4 w-4" />,
        'BOARD': <Columns className="h-4 w-4" />,
        'LIST': <List className="h-4 w-4" />,
        'GALLERY': <Grid className="h-4 w-4" />,
        'CALENDAR': <Calendar className="h-4 w-4" />,
        'TIMELINE': <Clock className="h-4 w-4" />,
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{database.icon || '📋'}</span>
                    <div>
                        <h1 className="text-2xl font-bold">{database.name}</h1>
                        {database.description && (
                            <p className="text-muted-foreground">{database.description}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={handleCreateRecord}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Record
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Database Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setIsEditDatabaseOpen(true)}>
                                <Settings className="h-4 w-4 mr-2" />
                                Database Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsPropertyFormOpen(true)}>
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Add Property
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Filter className="h-4 w-4 mr-2" />
                                Filter View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SortAsc className="h-4 w-4 mr-2" />
                                Sort View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <ViewIcon className="h-4 w-4 mr-2" />
                                Create View
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Views tabs */}
            {database.views && database.views.length > 0 && (
                <div className="flex items-center justify-between">
                    <Tabs value={currentView || database.views[0].id} onValueChange={setCurrentView} className="w-full">
                        <TabsList className="mb-4">
                            {database.views.map(view => (
                                <TabsTrigger key={view.id} value={view.id} className="flex items-center gap-1">
                                    {viewTypeIcons[view.type] || <TableIcon className="h-4 w-4" />}
                                    {view.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            )}

            {/* Database View Renderer */}
            <DatabaseViewRenderer
                database={database}
                currentView={getCurrentView()!}
                records={recordsData?.data?.records || recordsData?.records || []}
                isLoading={isLoadingRecords}
                onRecordEdit={(record) => setEditingRecord(record)}
                onRecordDelete={handleDeleteRecord}
                onRecordCreate={handleCreateRecord}
            />

            {/* Database edit dialog */}
            <DatabaseForm
                open={isEditDatabaseOpen}
                onOpenChange={setIsEditDatabaseOpen}
                database={database}
                mode="edit"
            />

            {/* Property form dialog */}
            <PropertyForm
                open={isPropertyFormOpen}
                onOpenChange={setIsPropertyFormOpen}
                onSubmit={(data) => {
                    // This would be handled by the PropertyList component in practice
                    toast.success(`Property ${data.name} added`);
                    setIsPropertyFormOpen(false);
                }}
                databaseId={database.id}
            />
        </div>
    );
}
