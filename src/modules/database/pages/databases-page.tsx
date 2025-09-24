import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Database,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Archive,
  Copy,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { EDatabaseType, TDatabase } from "@/modules/database-view/types";
import { toast } from "sonner";

export function DatabasesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<TDatabase | null>(
    null
  );
  const { data: databasesResponse, isLoading } = useDatabases({
    type: EDatabaseType.CUSTOM,
    search: searchQuery || undefined,
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  const deleteDatabaseMutation = useDeleteDatabase();
  const duplicateDatabaseMutation = useDuplicateDatabase();

  const databases = databasesResponse?.data || [];

  const handleCreateDatabase = () => {
    navigate("/app/databases/new");
  };

  const handleViewDatabase = (databaseId: string) => {
    navigate(`/app/databases/${databaseId}`);
  };

  const handleEditDatabase = (databaseId: string) => {
    navigate(`/app/databases/${databaseId}/edit`);
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
        permanent: false, // Soft delete by default
      });

      toast.success(`"${selectedDatabase.name}" has been moved to trash.`);

      setDeleteDialogOpen(false);
      setSelectedDatabase(null);
    } catch {
      toast.error("Failed to delete database. Please try again.");
    }
  };

  const handleDuplicateDatabase = async (database: TDatabase) => {
    try {
      await duplicateDatabaseMutation.mutateAsync({
        id: database.id,
        data: { name: `${database.name} (Copy)` },
      });

      toast.success(`"${database.name}" has been duplicated successfully.`);
    } catch {
      toast.error("Failed to duplicate database. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Database className="mx-auto h-12 w-12 text-muted-foreground animate-pulse" />
            <p className="mt-4 text-muted-foreground">Loading databases...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Custom Databases</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your custom databases to organize any type of data.
        </p>
      </div>

      {/* Table Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search databases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {databases.length} database{databases.length !== 1 ? "s" : ""}
          </span>
          <Button onClick={handleCreateDatabase} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Database
          </Button>
        </div>
      </div>

      {/* Databases Table */}
      {databases.length === 0 ? (
        <div className="text-center py-12">
          <Database className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No custom databases yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Create your first custom database to start organizing your data.
          </p>
          <Button onClick={handleCreateDatabase}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Database
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databases.map((database: TDatabase) => (
                <TableRow
                  key={database.id}
                  onClick={() => handleViewDatabase(database.id)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{database.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate text-sm text-muted-foreground">
                      {database.description || "No description"}
                    </div>
                  </TableCell>
                  <TableCell>{database.recordCount || 0}</TableCell>
                  <TableCell>{database.properties?.length || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {database.isPublic && (
                        <Badge variant="secondary" className="text-xs">
                          Public
                        </Badge>
                      )}
                      {database.isArchived && (
                        <Badge variant="outline" className="text-xs">
                          <Archive className="h-3 w-3 mr-1" />
                          Archived
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(database.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDatabase(database.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Database
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditDatabase(database.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Database
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDuplicateDatabase(database)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteDatabase(database)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Database
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
    </div>
  );
}
