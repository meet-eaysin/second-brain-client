import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDatabases,
  useDeleteDatabase,
  useDuplicateDatabase,
} from "@/modules/database-view/services/database-queries";
import { EDatabaseType, type TDatabase } from "@/modules/database-view/types";
import { CreateDatabaseDialog } from "@/modules/database/components/create-database-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/modules/database/components/database-columns";
import { DatabaseToolbar } from "@/modules/database/components/database-toolbar";
import { DatabaseTableSkeleton } from "@/modules/database/components/database-table-skeleton";
import { toast } from "sonner";

export function DatabasesPage() {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<TDatabase | null>(
    null
  );
  const [editingDatabase, setEditingDatabase] = useState<TDatabase | null>(
    null
  );
  const { data: databasesResponse, isLoading } = useDatabases({
    type: EDatabaseType.CUSTOM,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const deleteDatabaseMutation = useDeleteDatabase();
  const duplicateDatabaseMutation = useDuplicateDatabase();

  const databases = databasesResponse?.data || [];

  const handleCreateDatabase = () => {
    setCreateDialogOpen(true);
  };

  const handleViewDatabase = (databaseId: string) => {
    navigate(`/app/databases/${databaseId}`);
  };

  const handleEditDatabase = (databaseId: string) => {
    const database = databases.find((db) => db.id === databaseId);
    if (database) {
      setEditingDatabase(database);
      setCreateDialogOpen(true);
    }
  };

  const handleDeleteDatabase = (database: TDatabase) => {
    setSelectedDatabase(database);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDatabase) return;

    try {
      await deleteDatabaseMutation.mutateAsync({
        id: selectedDatabase.id,
      });

      toast.success(`"${selectedDatabase.name}" has been moved to trash.`);

      setDeleteDialogOpen(false);
      setSelectedDatabase(null);
    } catch {
      toast.error("Failed to delete database. Please try again.");
    }
  };

  const handleDuplicateDatabase = async (database: TDatabase) => {
    console.log("## Database", database);

    try {
      await duplicateDatabaseMutation.mutateAsync({
        id: database.id,
        name: `${database.name} (Copy)`,
      });

      toast.success(`"${database.name}" has been duplicated successfully.`);
    } catch {
      toast.error("Failed to duplicate database. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-8 w-32" />
        </div>

        <DatabaseTableSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Databases</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your databases to organize any type of data.
        </p>
      </div>

      {/* Table Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {databases.length} database{databases.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleCreateDatabase} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Database
          </Button>
        </div>
      </div>

      {/* Databases Table */}
      {databases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center space-y-4 max-w-md">
            <Database className="mx-auto h-12 w-12 text-muted-foreground" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">No databases yet</h3>
              <p className="text-sm text-muted-foreground">
                Create your first database to start organizing your data.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <DataTable
          data={databases}
          columns={columns}
          toolbar={DatabaseToolbar}
          onRowClick={(database) => handleViewDatabase(database.id)}
          meta={{
            onView: handleViewDatabase,
            onEdit: handleEditDatabase,
            onDelete: handleDeleteDatabase,
            onDuplicate: handleDuplicateDatabase,
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Database</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDatabase?.name}"? This
              action cannot be undone. The database will be moved to trash and
              can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Database Dialog */}
      <CreateDatabaseDialog
        open={createDialogOpen}
        onOpenChange={(open) => {
          setCreateDialogOpen(open);
          if (!open) setEditingDatabase(null);
        }}
        database={editingDatabase}
      />
    </div>
  );
}
