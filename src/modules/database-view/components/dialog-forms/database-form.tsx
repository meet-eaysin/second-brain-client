import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
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
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Database,
  Palette,
  Settings,
  Shield,
  Users,
  FileText,
  Archive,
  Save,
} from "lucide-react";
import { useDatabaseView } from "../../context";
import {
  useCreateDatabase,
  useUpdateDatabase,
} from "../../services/database-queries";
import type { TCreateDatabase, TUpdateDatabase } from "../../types";
import {
  createDatabaseSchema,
  updateDatabaseSchema,
  type CreateDatabaseFormData,
  type UpdateDatabaseFormData,
} from "../../schemas/database.schema";
import {Label} from "@/components/ui/label.tsx";

export function DatabaseForm() {
  const { database, dialogOpen, onDialogOpen, workspace } = useDatabaseView();

  const createDatabaseMutation = useCreateDatabase();
  const updateDatabaseMutation = useUpdateDatabase();

  const isOpen =
    dialogOpen === "create-database" || dialogOpen === "edit-database";
  const mode = dialogOpen === "create-database" ? "create" : "edit";

  const schema =
    mode === "create" ? createDatabaseSchema : updateDatabaseSchema;

  const form = useForm<CreateDatabaseFormData | UpdateDatabaseFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      isPublic: false,
      icon: "",
      cover: "",
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
    if (isOpen) {
      if (database && mode === "edit") {
        form.reset({
          name: database.name,
          description: database.description || "",
          isPublic: database.isPublic,
          icon: database.icon?.value || "",
          cover: database.cover?.value || "",
        });

        setAdvancedSettings({
          allowComments: database.allowComments,
          allowDuplicates: database.allowDuplicates,
          enableVersioning: database.enableVersioning,
          enableAuditLog: database.enableAuditLog,
          enableAutoTagging: database.enableAutoTagging,
          enableSmartSuggestions: database.enableSmartSuggestions,
        });
      } else if (mode === "create") {
        form.reset({
          name: "",
          description: "",
          isPublic: false,
          icon: "",
          cover: "",
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
    }
  }, [isOpen, database, mode, form]);

  const onSubmit = async (
    data: CreateDatabaseFormData | UpdateDatabaseFormData
  ) => {
    if (!workspace?._id) return;

    if (mode === "create") {
      const createData: TCreateDatabase = {
        ...(data as TCreateDatabase),
        workspaceId: workspace._id,
      };

      await createDatabaseMutation.mutateAsync({ data: createData });
    } else if (database) {
      const updateData: TUpdateDatabase = data as TUpdateDatabase;
      await updateDatabaseMutation.mutateAsync({
        id: database.id,
        data: updateData,
      });
    }

    onDialogOpen(null);
  };

  const handleCancel = () => {
    onDialogOpen(null);
  };

  const isLoading =
    createDatabaseMutation.isPending || updateDatabaseMutation.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <SheetContent className="overflow-y-auto w-[500px] sm:w-[700px] lg:w-[800px] px-6">
        <SheetHeader className="space-y-4 pb-3 px-2">
          <div>
            <SheetTitle className="text-xl flex items-center gap-2">
              <Database className="h-5 w-5" />
              {mode === "create"
                ? "Create Custom Database"
                : "Edit Custom Database"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {mode === "create"
                ? "Create a custom database to organize your data with advanced features and customization options."
                : "Update your custom database settings and configuration."}
            </SheetDescription>
          </div>
        </SheetHeader>

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
                          disabled={isLoading}
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
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <div className="font-medium">Custom Database</div>
                    <div className="text-sm text-muted-foreground">
                      Create a custom database for any purpose with full
                      flexibility
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="icon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter emoji or icon URL"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Use an emoji (📝) or image URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter cover image URL"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional background image URL
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
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

            <SheetFooter className="flex gap-3 pt-6 border-t px-1">
              <div className="flex items-center gap-2">
                {mode === "edit" && database && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Archive className="h-3 w-3" />
                      {database.recordCount} records
                    </Badge>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Users className="h-3 w-3" />
                      {database.properties.length} properties
                    </Badge>
                  </div>
                )}
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
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Settings className="mr-2 h-4 w-4 animate-spin" />
                      {mode === "create" ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {mode === "create"
                        ? "Create Custom Database"
                        : "Update Custom Database"}
                    </>
                  )}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
