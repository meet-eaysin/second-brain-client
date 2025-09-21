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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Database,
  Palette,
  Settings,
  Shield,
  Users,
  FileText,
  Archive,
  AlertCircle,
} from "lucide-react";
import { useWorkspace } from "@/modules/workspaces/context/workspace-context";
import {
  useCreateDatabase,
  useUpdateDatabase,
} from "@/modules/database-view/services/database-queries";
import type {
  TDatabase,
  TCreateDatabase,
  TUpdateDatabase,
} from "@/modules/database-view/types";
import {
  createDatabaseSchema,
  updateDatabaseSchema,
  type CreateDatabaseFormData,
  type UpdateDatabaseFormData,
} from "@/modules/database-view/schemas/database.schema";

interface DatabaseFormProps {
  database?: TDatabase;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: "create" | "edit";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DatabaseForm({
  database,
  open,
  onOpenChange,
  mode = "create",
  onSuccess,
  onCancel,
}: DatabaseFormProps) {
  const { currentWorkspace } = useWorkspace();
  const createDatabaseMutation = useCreateDatabase();
  const updateDatabaseMutation = useUpdateDatabase();

  const schema =
    mode === "create" ? createDatabaseSchema : updateDatabaseSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateDatabaseFormData | UpdateDatabaseFormData>({
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
    if (database && mode === "edit") {
      reset({
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
      reset({
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
  }, [database, mode, reset]);

  const onSubmit = async (
    data: CreateDatabaseFormData | UpdateDatabaseFormData
  ) => {
    if (!currentWorkspace?._id) return;

    if (mode === "create") {
      const createData: TCreateDatabase = {
        ...(data as TCreateDatabase),
        workspaceId: currentWorkspace._id,
      };

      await createDatabaseMutation.mutateAsync({ data: createData });
    } else if (database) {
      const updateData: TUpdateDatabase = data as TUpdateDatabase;
      await updateDatabaseMutation.mutateAsync({
        id: database.id,
        data: updateData,
      });
    }

    onSuccess?.();
    onOpenChange?.(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange?.(false);
  };

  const isLoading =
    createDatabaseMutation.isPending ||
    updateDatabaseMutation.isPending ||
    isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {mode === "create"
              ? "Create Custom Database"
              : "Edit Custom Database"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a custom database to organize your data with advanced features and customization options."
              : "Update your custom database settings and configuration."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-medium">
                Please fix the following errors:
              </p>
              <ul className="text-sm text-destructive mt-1 list-disc list-inside">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                    {error?.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Database Name *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Enter database name"
                    disabled={isLoading || isSubmitting}
                    className={`${
                      errors.name
                        ? "border-destructive pr-8"
                        : watch("name") && !errors.name
                        ? "border-green-500 pr-8"
                        : ""
                    }`}
                  />
                  {watch("name") && !errors.name && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                  {errors.name && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe what this database is for..."
                  rows={3}
                  disabled={isLoading || isSubmitting}
                  className={
                    errors.description
                      ? "border-destructive"
                      : watch("description") && !errors.description
                      ? "border-green-500"
                      : ""
                  }
                />
                {errors.description && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description.message}
                  </p>
                )}
              </div>

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
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    {...register("icon")}
                    placeholder="Enter emoji or icon URL"
                    disabled={isLoading || isSubmitting}
                    className={errors.icon ? "border-destructive" : ""}
                  />
                  {errors.icon && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.icon.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Use an emoji (📝) or image URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cover">Cover Image</Label>
                  <Input
                    id="cover"
                    {...register("cover")}
                    placeholder="Enter cover image URL"
                    disabled={isLoading || isSubmitting}
                    className={errors.cover ? "border-destructive" : ""}
                  />
                  {errors.cover && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.cover.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Optional background image URL
                  </p>
                </div>
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
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="isPublic">Public Database</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anyone with the link to view this database
                  </p>
                </div>
                <Switch
                  id="isPublic"
                  {...register("isPublic")}
                  checked={watch("isPublic")}
                  onCheckedChange={(checked) => setValue("isPublic", checked)}
                  disabled={isLoading || isSubmitting}
                />
              </div>
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

          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === "edit" && database && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Archive className="h-3 w-3" />
                    {database.recordCount} records
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
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
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className={!isValid && !isLoading ? "opacity-50" : ""}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === "create" ? "Creating..." : "Updating..."}
                  </>
                ) : (
                  <>
                    {mode === "create"
                      ? "Create Custom Database"
                      : "Update Custom Database"}
                    {isValid && !isLoading && (
                      <span className="ml-2 text-green-400">✓</span>
                    )}
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
