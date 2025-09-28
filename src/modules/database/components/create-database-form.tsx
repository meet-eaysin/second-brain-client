import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Database,
  Settings,
  FileText,
  Save,
  TableIcon,
  Columns,
  List,
  Grid,
  Calendar,
  Clock,
} from "lucide-react";
import {
  useCreateDatabase,
  useUpdateDatabase,
} from "@/modules/database-view/services/database-queries";
import {
  type TCreateDatabase,
  type TUpdateDatabase,
  type TDatabase,
  EDatabaseType,
} from "@/modules/database-view/types";
import {
  createDatabaseSchema,
  type CreateDatabaseFormData,
} from "@/modules/database-view/schemas/database.schema";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "sonner";
import { useWorkspace } from "@/modules/workspaces/context";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface CreateDatabaseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  database?: TDatabase | null;
}

export function CreateDatabaseForm({
  open,
  onOpenChange,
  onSuccess,
  database,
}: CreateDatabaseFormProps) {
  const { currentWorkspace, isCurrentWorkspaceLoading } = useWorkspace();
  const createDatabaseMutation = useCreateDatabase();
  const updateDatabaseMutation = useUpdateDatabase();

  const form = useForm<CreateDatabaseFormData>({
    resolver: zodResolver(createDatabaseSchema),
    defaultValues: {
      name: database?.name || "",
      description: database?.description || "",
      isPublic: database?.isPublic ?? false,
      icon: database?.icon?.value || "",
      cover: database?.cover?.value || "",
      defaultViewType:
        database?.views?.find((v) => v.isDefault)?.type ?? "TABLE",
    },
  });

  const [advancedSettings, setAdvancedSettings] = React.useState({
    allowComments: true,
    allowDuplicates: false,
    enableVersioning: true,
    enableAuditLog: false,
    enableAutoTagging: true,
    enableSmartSuggestions: true,
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: database?.name || "",
        description: database?.description || "",
        isPublic: database?.isPublic ?? false,
        icon: database?.icon?.value || "",
        cover: database?.cover?.value || "",
        defaultViewType:
          database?.views?.find((v) => v.isDefault)?.type ?? "TABLE",
      });

      setAdvancedSettings({
        allowComments: database?.allowComments ?? true,
        allowDuplicates: database?.allowDuplicates ?? false,
        enableVersioning: database?.enableVersioning ?? true,
        enableAuditLog: database?.enableAuditLog ?? false,
        enableAutoTagging: database?.enableAutoTagging ?? true,
        enableSmartSuggestions: database?.enableSmartSuggestions ?? true,
      });
    }
  }, [open, form, database]);

  const onSubmit = async (data: CreateDatabaseFormData) => {
    // Wait for workspace to load
    if (isCurrentWorkspaceLoading) {
      toast.error("Loading workspace information. Please wait...");
      return;
    }

    if (!currentWorkspace?._id) {
      // Workspace should always be available through useWorkspace hook
      console.error("No workspace available - this should not happen");
      toast.error(
        "Unable to create database. Please refresh the page and try again."
      );
      return;
    }

    try {
      if (database) {
        // Update mode
        const updateData: TUpdateDatabase = {
          name: data.name,
          description: data.description || undefined,
          isPublic: data.isPublic ?? database?.isPublic,
        };

        // Only include icon if it has a value
        if (data.icon && data.icon.trim()) {
          updateData.icon = data.icon.trim();
        }

        // Only include cover if it has a value
        if (data.cover && data.cover.trim()) {
          updateData.cover = data.cover.trim();
        }

        await updateDatabaseMutation.mutateAsync({
          id: database.id,
          data: updateData,
        });

        toast.success("Database updated successfully!");
      } else {
        // Create mode
        const createData: TCreateDatabase = {
          workspaceId: currentWorkspace._id,
          name: data.name,
          description: data.description || undefined,
          type: EDatabaseType.CUSTOM,
          isPublic: data.isPublic ?? false,
          allowDuplicates: advancedSettings.allowDuplicates,
          defaultViewType: data.defaultViewType ?? "TABLE",
        };

        // Only include icon if it has a value
        if (data.icon && data.icon.trim()) {
          createData.icon = {
            type: "emoji" as const,
            value: data.icon.trim(),
          };
        }

        // Only include cover if it has a value
        if (data.cover && data.cover.trim()) {
          createData.cover = {
            type: "color" as const,
            value: data.cover.trim(),
          };
        }

        await createDatabaseMutation.mutateAsync({ data: createData });

        toast.success("Custom database created successfully!");
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Failed to save database:", error);

      // Show specific error message
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Failed to save database. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isLoading = createDatabaseMutation.isPending;
  const isWorkspaceReady =
    !isCurrentWorkspaceLoading && !!currentWorkspace?._id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="overflow-y-auto max-h-[90vh] px-6">
        <DialogHeader className="space-y-4 pb-3 px-2">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Database className="h-5 w-5" />
              {database ? "Edit Database" : "Create Database"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isCurrentWorkspaceLoading
                ? "Loading workspace information..."
                : !currentWorkspace?._id
                ? "No workspace available. Please ensure you're logged in and have access to a workspace."
                : "Create a custom database to organize your data with advanced features and customization options."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pb-6 px-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Database Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter database name"
                          disabled={isLoading || !isWorkspaceReady}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this database is for..."
                          rows={3}
                          disabled={isLoading || !isWorkspaceReady}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultViewType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default View Type</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            {
                              value: "TABLE",
                              label: "Table",
                              icon: <TableIcon className="h-3 w-3" />,
                            },
                            {
                              value: "BOARD",
                              label: "Board",
                              icon: <Columns className="h-3 w-3" />,
                            },
                            {
                              value: "LIST",
                              label: "List",
                              icon: <List className="h-3 w-3" />,
                            },
                            {
                              value: "GALLERY",
                              label: "Gallery",
                              icon: <Grid className="h-3 w-3" />,
                            },
                            {
                              value: "CALENDAR",
                              label: "CalendarTypes",
                              icon: <Calendar className="h-3 w-3" />,
                            },
                            {
                              value: "GANTT",
                              label: "Gantt",
                              icon: <Clock className="h-3 w-3" />,
                            },
                          ].map((viewType) => (
                            <Card
                              key={viewType.value}
                              className={`cursor-pointer p-0 ${
                                field.value === viewType.value
                                  ? "border-primary bg-primary/10"
                                  : "hover:border-muted-foreground/50"
                              }`}
                              onClick={() => field.onChange(viewType.value)}
                            >
                              <CardContent className="p-2 text-center">
                                <div
                                  className={`inline-flex p-1 rounded-md mb-1 ${
                                    field.value === viewType.value
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {viewType.icon}
                                </div>
                                <div className="text-xs font-medium">
                                  {viewType.label}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Choose the default view type for your database
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="allowDuplicates">Allow Duplicates</Label>
                      <p className="text-xs text-muted-foreground">
                        Permit duplicate records
                      </p>
                    </div>
                    <Switch
                      id="allowDuplicates"
                      checked={advancedSettings.allowDuplicates}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings((prev) => ({
                          ...prev,
                          allowDuplicates: checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enableAuditLog">Audit Log</Label>
                      <p className="text-xs text-muted-foreground">
                        Log all database activities
                      </p>
                    </div>
                    <Switch
                      id="enableAuditLog"
                      checked={advancedSettings.enableAuditLog}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings((prev) => ({
                          ...prev,
                          enableAuditLog: checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="flex gap-3 pt-6 border-t px-1">
              <div className="flex items-center gap-2">
                {/* Empty space for alignment */}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !isWorkspaceReady}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Settings className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : !isWorkspaceReady ? (
                    <>
                      <Database className="mr-2 h-4 w-4" />
                      {isCurrentWorkspaceLoading
                        ? "Loading..."
                        : "No Workspace"}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {database ? "Update Database" : "Create Database"}
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
