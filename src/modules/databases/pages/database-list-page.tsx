import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatabaseCard } from '../components/database-card';
import { DatabaseForm } from '../components/database-form';
import { useDatabases } from '../hooks/database-hooks';
import { useDeleteDatabase } from '../services/databaseQueries';
import { Plus, Search } from 'lucide-react';
import { Database } from '@/types/database.types';

export default function DatabaseListPage() {
    const navigate = useNavigate();
    const { data, isLoading } = useDatabases();
    const deleteDatabaseMutation = useDeleteDatabase();

    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDatabaseOpen, setIsCreateDatabaseOpen] = useState(false);

    const handleDatabaseView = (database: Database) => {
        navigate(`/app/data-tables/${database.id}`);
    };

    const handleDatabaseEdit = (database: Database) => {
        navigate(`/app/data-tables/${database.id}/edit`);
    };

    const handleDatabaseDelete = async (databaseId: string) => {
        if (!confirm('Are you sure you want to delete this database? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteDatabaseMutation.mutateAsync(databaseId);
        } catch (error) {
            console.error('Error deleting database:', error);
        }
    };

    const filteredDatabases = data?.databases.filter(db =>
        db.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (db.description && db.description.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Databases</h1>
                <Button onClick={() => setIsCreateDatabaseOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Database
                </Button>
            </div>

            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search databases..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : filteredDatabases.length === 0 ? (
                <div className="text-center py-12">
                    {searchQuery ? (
                        <>
                            <h2 className="text-xl font-semibold mb-2">No results found</h2>
                            <p className="text-muted-foreground mb-4">
                                No databases match your search query. Try a different search term or create a new database.
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-semibold mb-2">No databases yet</h2>
                            <p className="text-muted-foreground mb-6">
                                Create your first database to get started organizing your data.
                            </p>
                            <Button onClick={() => setIsCreateDatabaseOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Database
                            </Button>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDatabases.map((database) => (
                        <DatabaseCard
                            key={database.id}
                            database={database}
                            onView={handleDatabaseView}
                            onEdit={handleDatabaseEdit}
                            onDelete={handleDatabaseDelete}
                            currentUserId="user-1" // This would come from auth context in a real app
                        />
                    ))}
                </div>
            )}

            <DatabaseForm
                open={isCreateDatabaseOpen}
                onOpenChange={setIsCreateDatabaseOpen}
                mode="create"
            />
        </div>
    );
}
