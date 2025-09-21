import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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
} from "lucide-react";
import { EViewType } from "../../types";
import { useDatabaseView } from "../../context";
import { useCreateView, useUpdateView } from "../../services/database-queries";

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
    icon: <TableIcon className="h-5 w-5" />,
    description: "Display records in rows and columns",
    isAvailable: true,
  },
  {
    value: EViewType.BOARD,
    label: "Board",
    icon: <Columns className="h-5 w-5" />,
    description: "Group records by a select property",
    isAvailable: true,
  },
  {
    value: EViewType.GALLERY,
    label: "Gallery",
    icon: <Grid className="h-5 w-5" />,
    description: "Display records as cards in a grid",
    isAvailable: true,
  },
  {
    value: EViewType.LIST,
    label: "List",
    icon: <List className="h-5 w-5" />,
    description: "Show records in a simple list format",
    isAvailable: true,
  },
  {
    value: EViewType.CALENDAR,
    label: "Calendar",
    icon: <Calendar className="h-5 w-5" />,
    description: "Display records on a calendar (coming soon)",
    isAvailable: false,
  },
  {
    value: EViewType.TIMELINE,
    label: "Timeline",
    icon: <Clock className="h-5 w-5" />,
    description: "Show records on a timeline (coming soon)",
    isAvailable: false,
  },
  {
    value: EViewType.GANTT,
    label: "Gantt",
    icon: <Clock className="h-5 w-5" />,
    description: "Project timeline with dependencies (coming soon)",
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
          filters: [],
          sorts: [],
          frozenColumns: [],
          pageSize: 25,
        },
      };

      if (mode === "create") {
        const result = await createViewMutation.mutateAsync({
          databaseId,
          data: viewData,
        });
        onViewChange(result.data.id);
      } else if (mode === "edit" && view) {
        await updateViewMutation.mutateAsync({
          databaseId,
          viewId: view.id,
          data: viewData,
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

  const handlePropertyToggle = (propertyId: string, checked: boolean) => {
    const currentVisible = form.getValues("visibleProperties");
    const newVisible = checked
      ? [...currentVisible, propertyId]
      : currentVisible.filter((id) => id !== propertyId);
    form.setValue("visibleProperties", newVisible);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <SheetContent className="overflow-y-auto w-[500px] sm:w-[700px] lg:w-[800px] px-6">
        <SheetHeader className="space-y-4 pb-3 px-2">
          <div>
            <SheetTitle className="text-xl">
              {mode === "edit" ? "Edit View" : "Create View"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {mode === "edit"
                ? "Modify the view settings to change how your data is displayed."
                : "Create a new view to organize and display your data in different ways."}
            </SheetDescription>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 pb-6 px-1"
          >
            {/* View Name */}
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

            {/* View Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>View Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {viewTypes.map((viewType) => {
                        const Icon = viewType.icon;
                        const isSelected = field.value === viewType.value;
                        return (
                          <Card
                            key={viewType.value}
                            className={`cursor-pointer transition-colors p-0 ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "hover:border-muted-foreground/50"
                            } ${!viewType.isAvailable ? "opacity-50" : ""}`}
                            onClick={() =>
                              viewType.isAvailable &&
                              handleViewTypeChange(viewType.value)
                            }
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-md ${
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  {Icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium flex items-center gap-2">
                                    {viewType.label}
                                    {!viewType.isAvailable && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        Soon
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {viewType.description}
                                  </div>
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Describe what this view is for..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visible Properties */}
            <FormField
              control={form.control}
              name="visibleProperties"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Visible Properties</FormLabel>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
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
                        onClick={() => field.onChange([])}
                      >
                        <EyeOff className="h-3 w-3 mr-1" />
                        None
                      </Button>
                    </div>
                  </div>
                  <FormControl>
                    {properties.length === 0 ? (
                      <div className="border rounded-md p-6 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="p-3 rounded-full bg-muted">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium text-muted-foreground">
                              No Properties Available
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Create some properties first to configure this
                              view.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/20">
                          {properties.map((property) => (
                            <div
                              key={property.id}
                              className="flex items-center space-x-2 p-2 rounded hover:bg-background/80 transition-colors"
                            >
                              <Checkbox
                                id={`property-${property.id}`}
                                checked={field.value.includes(property.id)}
                                onCheckedChange={(checked) =>
                                  handlePropertyToggle(
                                    property.id,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={`property-${property.id}`}
                                className="flex items-center gap-2 cursor-pointer flex-1"
                              >
                                <span className="font-medium">
                                  {property.name}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {property.type.replace("_", " ")}
                                </Badge>
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Selected: {field.value.length} of{" "}
                            {properties.length} properties
                          </span>
                          {field.value.length === 0 && (
                            <Badge variant="destructive" className="text-xs">
                              At least one property required
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default View Checkbox */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Set as default view</FormLabel>
                    <FormDescription>
                      This view will be shown by default when opening the
                      database
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <SheetFooter className="flex gap-3 pt-6 border-t px-1">
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
                type="submit"
                disabled={
                  createViewMutation.isPending ||
                  updateViewMutation.isPending ||
                  properties.length === 0
                }
                className="flex-1"
              >
                {createViewMutation.isPending ||
                updateViewMutation.isPending ? (
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
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
