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
import { useCreateDatabase } from "@/modules/database-view/services/database-queries";
import type { TCreateDatabase } from "@/modules/database-view/types";
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
}

export function CreateDatabaseForm({
  open,
  onOpenChange,
  onSuccess,
}: CreateDatabaseFormProps) {
  const { currentWorkspace, isCurrentWorkspaceLoading } = useWorkspace();
  const createDatabaseMutation = useCreateDatabase();

  const form = useForm<CreateDatabaseFormData>({
    resolver: zodResolver(createDatabaseSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      icon: "",
      cover: "",
      defaultViewType: "TABLE",
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
        name: "",
        description: "",
        isPublic: false,
        icon: "",
        cover: "",
        defaultViewType: "TABLE",
      });

      setAdvancedSettings({
        allowComments: true,
        allowDuplicates: false,
        enableVersioning: true,
        enableAuditLog: false,
        enableAutoTagging: true,
        enableSmartSuggestions: true,
      });
    }
  }, [open, form]);

  const onSubmit = async (data: CreateDatabaseFormData) => {
    // Wait for workspace to load
    if (isCurrentWorkspaceLoading) {
      toast.error("Loading workspace information. Please wait...");
      return;
    }

    if (!currentWorkspace?.id) {
      // Workspace should always be available through useWorkspace hook
      console.error("No workspace available - this should not happen");
      toast.error(
        "Unable to create database. Please refresh the page and try again."
      );
      return;
    }

    try {
      // Prepare the create data, omitting empty icon and cover fields
      const createData: TCreateDatabase = {
        workspaceId: currentWorkspace.id,
        name: data.name,
        description: data.description || undefined,
        type: "custom",
        isPublic: data.isPublic,
        allowComments: advancedSettings.allowComments,
        allowDuplicates: advancedSettings.allowDuplicates,
        enableVersioning: advancedSettings.enableVersioning,
        enableAuditLog: advancedSettings.enableAuditLog,
        enableAutoTagging: advancedSettings.enableAutoTagging,
        enableSmartSuggestions: advancedSettings.enableSmartSuggestions,
        defaultViewType: data.defaultViewType,
      };

      // Only include icon if it has a value
      if (data.icon && data.icon.trim()) {
        // For now, assume emoji type for simple icons
        createData.icon = {
          type: "emoji" as const,
          value: data.icon.trim(),
        };
      }

      // Only include cover if it has a value
      if (data.cover && data.cover.trim()) {
        // For now, assume color type for simple covers
        createData.cover = {
          type: "color" as const,
          value: data.cover.trim(),
        };
      }

      await createDatabaseMutation.mutateAsync({ data: createData });

      toast.success("Custom database created successfully!");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Failed to create database:", error);

      // Show specific error message
      const apiError = error as ApiError;
      const errorMessage =
        apiError?.response?.data?.message ||
        apiError?.message ||
        "Failed to create database. Please try again.";

      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const isLoading = createDatabaseMutation.isPending;
  const isWorkspaceReady = !isCurrentWorkspaceLoading && !!currentWorkspace?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-y-auto max-w-6xl max-h-[90vh] px-6">
        <DialogHeader className="space-y-4 pb-3 px-2">
          <div>
            <DialogTitle className="text-xl flex items-center gap-2">
              <Database className="h-5 w-5" />
              Create Database
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {isCurrentWorkspaceLoading
                ? "Loading workspace information..."
                : !currentWorkspace?.id
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
                        <div className="grid grid-cols-3 gap-2">
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
                              label: "Calendar",
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
                              className={`cursor-pointer transition-all duration-200 p-0 hover:scale-105 ${
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

            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy & Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Public Database
                        </FormLabel>
                        <FormDescription>
                          Allow anyone with the link to view this database
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card> */}

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
                      <Label htmlFor="allowComments">Allow Comments</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable commenting on records
                      </p>
                    </div>
                    <Switch
                      id="allowComments"
                      checked={advancedSettings.allowComments}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings((prev) => ({
                          ...prev,
                          allowComments: checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>

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
                      <Label htmlFor="enableVersioning">Version Control</Label>
                      <p className="text-xs text-muted-foreground">
                        Track record changes
                      </p>
                    </div>
                    <Switch
                      id="enableVersioning"
                      checked={advancedSettings.enableVersioning}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings((prev) => ({
                          ...prev,
                          enableVersioning: checked,
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

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enableAutoTagging">Auto Tagging</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically tag records
                      </p>
                    </div>
                    <Switch
                      id="enableAutoTagging"
                      checked={advancedSettings.enableAutoTagging}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings((prev) => ({
                          ...prev,
                          enableAutoTagging: checked,
                        }))
                      }
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="enableSmartSuggestions">
                        Smart Suggestions
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        AI-powered suggestions
                      </p>
                    </div>
                    <Switch
                      id="enableSmartSuggestions"
                      checked={advancedSettings.enableSmartSuggestions}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings((prev) => ({
                          ...prev,
                          enableSmartSuggestions: checked,
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
                      Create Database
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
