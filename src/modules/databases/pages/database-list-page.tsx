import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DocumentView } from '@/modules/document-view';
import { DatabasesProvider, createDatabaseSchema } from '@/modules/document-view/providers/databases-provider';
import { databasesDocumentViewService } from '../services/databases-document-view.service';
import { useDatabases } from '../hooks/database-hooks';
import { useDeleteDatabase } from '../services/databaseQueries';
import type { Database } from '@/types/document.types.ts';

export default function DatabaseListPage() {
    const navigate = useNavigate();
    const { data, isLoading, error } = useDatabases();
    const deleteDatabaseMutation = useDeleteDatabase();

    // Transform database data to match DocumentView format
    const transformDatabaseToRecord = (database: Database) => ({
        id: database.id,
        name: database.name,
        description: database.description || '',
        icon: database.icon || '🗄️',
        cover: database.cover,
        userId: database.userId,
        workspaceId: database.workspaceId,
        isPublic: database.isPublic || false,
        isFavorite: database.isFavorite || false,
        categoryId: database.categoryId,
        tags: database.tags || [],
        lastAccessedAt: database.lastAccessedAt || new Date(),
        accessCount: database.accessCount || 0,
        frozen: database.frozen || false,
        frozenAt: database.frozenAt,
        frozenBy: database.frozenBy,
        createdBy: database.createdBy,
        lastEditedBy: database.lastEditedBy,
        createdAt: database.createdAt,
        updatedAt: database.updatedAt,
    });

    const handleDatabaseView = (record: any) => {
        navigate(`/app/data-tables/${record.id}`);
    };

    const handleDatabaseEdit = (record: any) => {
        navigate(`/app/data-tables/${record.id}/edit`);
    };

    const handleDatabaseDelete = async (record: any) => {
        if (window.confirm(`Are you sure you want to delete "${record.name}"?`)) {
            try {
                await deleteDatabaseMutation.mutateAsync(record.id);
            } catch (error) {
                console.error('Failed to delete database:', error);
            }
        }
    };

    const handleDatabaseCreate = () => {
        // Navigate to create database page or open create dialog
        navigate('/app/databases/create');
    };

    const databases = data?.databases || [];
    const databaseRecords = databases.map(transformDatabaseToRecord);
    const databasesDatabase = createDatabaseSchema();

    return (
        <DatabasesProvider
            enableIntegrations={false}
            compactMode={false}
            enableTimeTracking={false}
            initialSchema={databasesDatabase}
        >
            <DocumentView
                database={databasesDatabase}
                records={databaseRecords}
                isLoading={isLoading}
                error={error?.message || null}
                config={{
                    title: 'Databases',
                    icon: '🗄️',
                    description: 'Manage your data structures and collections',
                    canCreate: true,
                    canEdit: true,
                    canDelete: true,
                    canShare: true,
                    enableViews: true,
                    enableSearch: true,
                    enableFilters: true,
                    enableSorts: true,
                    isFrozen: false,
                    defaultViewId: 'all-databases',
                }}
                onRecordView={handleDatabaseView}
                onRecordEdit={handleDatabaseEdit}
                onRecordDelete={handleDatabaseDelete}
                onRecordCreate={handleDatabaseCreate}
            />
        </DatabasesProvider>
    );
}
