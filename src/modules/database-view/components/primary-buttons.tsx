import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Database as DatabaseIcon,
  Import,
  FileText,
  Settings,
  Share,
  MoreHorizontal,
  Lock,
  Unlock,
} from "lucide-react";
import { useDatabaseView } from "../context";
import { useUpdateDatabase } from "../services/database-queries";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Freeze form validation schema
const freezeFormSchema = z.object({
  reason: z.string().max(500, "Reason cannot exceed 500 characters").optional(),
});

type FreezeFormData = z.infer<typeof freezeFormSchema>;

export function DatabasePrimaryButtons() {
  const { database, onDialogOpen } = useDatabaseView();
  const updateDatabaseMutation = useUpdateDatabase();
  const [freezeDialogOpen, setFreezeDialogOpen] = useState(false);

  const form = useForm<FreezeFormData>({
    resolver: zodResolver(freezeFormSchema),
    defaultValues: {
      reason: "",
    },
  });

  const handleToggleFreeze = async () => {
    if (!database?.id) return;

    if (!database.isFrozen) {
      // Show dialog for freeze reason
      setFreezeDialogOpen(true);
    } else {
      // Unfreeze directly
      try {
        await updateDatabaseMutation.mutateAsync({
          id: database.id,
          data: {
            isFrozen: false,
            frozenReason: undefined,
          },
        });

        toast.success("Database unfrozen successfully");
      } catch (error) {
        toast.error("Failed to unfreeze database");
      }
    }
  };

  const handleConfirmFreeze = async (data: FreezeFormData) => {
    if (!database?.id) return;

    try {
      await updateDatabaseMutation.mutateAsync({
        id: database.id,
        data: {
          isFrozen: true,
          frozenReason: data.reason?.trim() || "Database frozen by user",
        },
      });

      toast.success("Database frozen successfully");
      setFreezeDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to freeze database");
    }
  };

  if (database) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onDialogOpen("import-data")}>
              <Import className="mr-2 h-4 w-4" />
              Import Data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDialogOpen("export-data")}>
              <FileText className="mr-2 h-4 w-4" />
              Export Data
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleToggleFreeze}>
              {database?.isFrozen ? (
                <Unlock className="mr-2 h-4 w-4" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}
              {database?.isFrozen ? "Unfreeze Database" : "Freeze Database"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => database?.id && onDialogOpen("share-database")}
              disabled={!database?.id}
            >
              <Share className="mr-2 h-4 w-4" />
              Share Document
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => database?.id && onDialogOpen("edit-database")}
              disabled={!database?.id || database?.isFrozen}
            >
              <Settings className="mr-2 h-4 w-4" />
              Document Settings
              {database?.isFrozen && (
                <span className="ml-auto text-xs text-muted-foreground">
                  (Frozen)
                </span>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Freeze Reason Dialog */}
        <Dialog open={freezeDialogOpen} onOpenChange={setFreezeDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Freeze Database</DialogTitle>
              <DialogDescription>
                Freezing a database prevents any modifications to records,
                properties, and settings. This is useful for archiving completed
                projects or protecting important data.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleConfirmFreeze)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a reason for freezing this database..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFreezeDialogOpen(false);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateDatabaseMutation.isPending}
                  >
                    {updateDatabaseMutation.isPending
                      ? "Freezing..."
                      : "Freeze Database"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={() => onDialogOpen("create-database")}>
        <Plus className="mr-2 h-4 w-4" />
        New Database
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onDialogOpen("create-database")}>
            <DatabaseIcon className="mr-2 h-4 w-4" />
            Create Database
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onDialogOpen("import-data")}>
            <Import className="mr-2 h-4 w-4" />
            Import Database
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
