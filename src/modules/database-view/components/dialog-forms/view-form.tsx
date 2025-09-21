import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  TableIcon,
  Columns,
  List,
  Grid,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Plus,
  Settings,
  Save,
  ChartArea,
} from "lucide-react";
import { EViewType } from "../../types";
import { useDatabaseView } from "../../context";
import { useCreateView, useUpdateView } from "../../services/database-queries";
import { useQueryClient } from "@tanstack/react-query";

// View form validation schema
const viewFormSchema = z.object({
  name: z
    .string()
    .min(1, "View name is required")
    .max(100, "View name cannot exceed 100 characters")
    .trim(),
  type: z.nativeEnum(EViewType),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),
  isDefault: z.boolean(),
  isPublic: z.boolean(),
  visibleProperties: z
    .array(z.string())
    .min(1, "At least one property must be visible"),
});

type ViewFormData = z.infer<typeof viewFormSchema>;

const viewTypes: {
  value: EViewType;
  label: string;
  icon: React.ReactNode;
  description: string;
  isAvailable: boolean;
}[] = [
  {
    value: EViewType.TABLE,
    label: "Table",
    icon: <TableIcon className="h-4 w-4" />,
    description: "Grid view",
    isAvailable: true,
  },
  {
    value: EViewType.BOARD,
    label: "Board",
    icon: <Columns className="h-4 w-4" />,
    description: "Grouped cards",
    isAvailable: true,
  },
  {
    value: EViewType.GALLERY,
    label: "Gallery",
    icon: <Grid className="h-4 w-4" />,
    description: "Card grid",
    isAvailable: true,
  },
  {
    value: EViewType.LIST,
    label: "List",
    icon: <List className="h-4 w-4" />,
    description: "Simple list",
    isAvailable: true,
  },
  {
    value: EViewType.CALENDAR,
    label: "Calendar",
    icon: <Calendar className="h-4 w-4" />,
    description: "Date view",
    isAvailable: true,
  },
  {
    value: EViewType.TIMELINE,
    label: "Timeline",
    icon: <Clock className="h-4 w-4" />,
    description: "Time view",
    isAvailable: true,
  },
  {
    value: EViewType.GANTT,
    label: "Gantt",
    icon: <Clock className="h-4 w-4" />,
    description: "Tasks flow",
    isAvailable: true,
  },
  {
    value: EViewType.CHART,
    label: "Chart",
    icon: <ChartArea className="h-4 w-4" />,
    description: "Chart View",
    isAvailable: false,
  },
];

export function ViewForm() {
  const {
    database,
    currentView,
    dialogOpen,
    properties,
    onDialogOpen,
    onViewChange,
  } = useDatabaseView();

  const createViewMutation = useCreateView();
  const updateViewMutation = useUpdateView();
  const queryClient = useQueryClient();

  const isOpen = dialogOpen === "create-view" || dialogOpen === "edit-view";
  const mode = dialogOpen === "create-view" ? "create" : "edit";
  const databaseId = database?.id || "";
  const view = currentView;

  const form = useForm<ViewFormData>({
    resolver: zodResolver(viewFormSchema),
    defaultValues: {
      name: "",
      type: EViewType.TABLE,
      description: "",
      isDefault: false,
      isPublic: false,
      visibleProperties: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && view) {
        form.reset({
          name: view.name,
          type: view.type,
          description: view.description || "",
          isDefault: view.isDefault,
          isPublic: view.isPublic,
          visibleProperties: view.settings.visibleProperties,
        });
      } else {
        form.reset({
          name: "",
          type: EViewType.TABLE,
          description: "",
          isDefault: false,
          isPublic: false,
          visibleProperties: properties.map((p) => p.id),
        });
      }
    }
  }, [isOpen, properties, view, mode, form]);

  const handleSubmit = async (data: ViewFormData) => {
    try {
      const viewData = {
        name: data.name,
        type: data.type,
        description: data.description,
        isDefault: data.isDefault,
        isPublic: data.isPublic,
        settings: {
          visibleProperties: data.visibleProperties,
          hiddenProperties: [],
          filters: [],
          sorts: [],
          groups: [],
          frozenColumns: [],
          propertyWidths: {},
          wrapCells: false,
          pageSize: 25,
          cardSize: "medium",
        },
      };

      if (mode === "create") {
        const result = await createViewMutation.mutateAsync({
          databaseId,
          data: viewData,
        });
        onViewChange(result.data.id);
      } else if (mode === "edit" && view) {
        const updateData = {
          ...viewData,
          settings: {
            ...viewData.settings,
            ...view.settings,
            visibleProperties: data.visibleProperties,
          },
        };
        await updateViewMutation.mutateAsync({
          databaseId,
          viewId: view.id,
          data: updateData,
        });
        // Invalidate properties query to refetch with updated view settings
        queryClient.invalidateQueries({
          queryKey: ["properties", databaseId, view.id],
        });
      }

      onDialogOpen(null);
    } catch (error) {
      console.error("Failed to submit view:", error);
      // Error handling is done by the mutation
    }
  };

  const handleViewTypeChange = (newViewType: EViewType) => {
    const viewTypeLabel =
      viewTypes.find((vt) => vt.value === newViewType)?.label || newViewType;

    const currentName = form.getValues("name");
    const shouldAutoFillName =
      !currentName.trim() ||
      viewTypes.some(
        (vt) =>
          currentName.toLowerCase() === vt.label.toLowerCase() ||
          currentName.toLowerCase() === `${vt.label.toLowerCase()} view` ||
          currentName.toLowerCase() === `my ${vt.label.toLowerCase()}` ||
          currentName.toLowerCase() === `new ${vt.label.toLowerCase()}`
      );

    if (shouldAutoFillName) {
      form.setValue("name", viewTypeLabel);
    }
    form.setValue("type", newViewType);
  };

  const handlePropertyToggle = (
    propertyId: string,
    checked: boolean,
    currentVisible: string[]
  ) => {
    const newVisible = checked
      ? [...currentVisible, propertyId]
      : currentVisible.filter((id) => id !== propertyId);
    return newVisible;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* Fixed Header */}
        <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-xl">
            {mode === "edit" ? "Edit View" : "Create View"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {mode === "edit"
              ? "Modify view settings to change how data is displayed."
              : "Create a new view to organize and display data."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="py-4 space-y-5"
            >
              {/* Basic Info Section */}
              <div className="space-y-4">
                {/* View Name & Description in 2 columns on larger screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>View Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter view name..." {...field} />
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
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Describe this view..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* View Type - Compact Grid */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>View Type</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {viewTypes.map((viewType) => {
                            const isSelected = field.value === viewType.value;
                            return (
                              <Card
                                key={viewType.value}
                                className={`cursor-pointer transition-all duration-200 p-0 hover:scale-105 ${
                                  isSelected
                                    ? "border-primary bg-primary/10 shadow-sm"
                                    : "hover:border-muted-foreground/50"
                                } ${
                                  !viewType.isAvailable
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={() =>
                                  viewType.isAvailable &&
                                  handleViewTypeChange(viewType.value)
                                }
                              >
                                <CardContent className="p-3 text-center">
                                  <div
                                    className={`inline-flex p-2 rounded-md mb-2 ${
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                                  >
                                    {viewType.icon}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="font-medium text-sm flex items-center justify-center gap-1">
                                      {viewType.label}
                                      {!viewType.isAvailable && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs px-1 py-0"
                                        >
                                          Soon
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {viewType.description}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Visible Properties - Compact */}
                <FormField
                  control={form.control}
                  name="visibleProperties"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-medium">
                          Visible Properties ({field.value.length}/
                          {properties.length})
                        </FormLabel>
                        <div className="flex gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() =>
                              field.onChange(properties.map((p) => p.id))
                            }
                            disabled={properties.length === 0}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            All
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => field.onChange([])}
                          >
                            <EyeOff className="h-3 w-3 mr-1" />
                            None
                          </Button>
                        </div>
                      </div>

                      <FormControl>
                        {properties.length === 0 ? (
                          <div className="border rounded-lg p-4 text-center">
                            <div className="inline-flex p-2 rounded-full bg-muted mb-2">
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              No properties available. Create properties first.
                            </p>
                          </div>
                        ) : (
                          <div className="border rounded-lg p-3 bg-muted/20 max-h-40 overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {properties.map((property) => (
                                <div
                                  key={property.id}
                                  className="flex items-center space-x-2 p-2 rounded hover:bg-background/80 transition-colors"
                                >
                                  <Checkbox
                                    id={`property-${property.id}`}
                                    checked={field.value.includes(property.id)}
                                    onCheckedChange={(checked) =>
                                      field.onChange(
                                        handlePropertyToggle(
                                          property.id,
                                          checked as boolean,
                                          field.value
                                        )
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`property-${property.id}`}
                                    className="flex items-center gap-1 cursor-pointer flex-1 min-w-0"
                                  >
                                    <span className="font-medium text-sm truncate">
                                      {property.name}
                                    </span>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs px-1 py-0 flex-shrink-0"
                                    >
                                      {property.type.replace("_", " ")}
                                    </Badge>
                                  </label>
                                </div>
                              ))}
                            </div>

                            {field.value.length === 0 && (
                              <div className="mt-2 pt-2 border-t">
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  At least one property required
                                </Badge>
                              </div>
                            )}
                          </div>
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Options - Compact */}
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="isDefault"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-lg">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Set as default view
                          </FormLabel>
                          <FormDescription className="text-xs">
                            This view will be shown by default when opening the
                            database
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-muted/20">
          <div className="flex gap-2 w-full">
            <Button
              type="button"
              variant="outline"
              onClick={() => onDialogOpen(null)}
              disabled={
                createViewMutation.isPending || updateViewMutation.isPending
              }
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              disabled={
                createViewMutation.isPending ||
                updateViewMutation.isPending ||
                properties.length === 0
              }
              className="flex-1"
            >
              {createViewMutation.isPending || updateViewMutation.isPending ? (
                <>
                  <Settings className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create View" : "Update View"}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
