import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Type,
  Hash,
  Calendar,
  CheckSquare,
  Link,
  Mail,
  Phone,
  List,
  Tags,
  Plus,
  X,
  Settings,
  Save,
  Check,
  Shuffle,
} from "lucide-react";
import type { TPropertyOption } from "../../types";
import { EPropertyType } from "../../types";
import {
  useCreateProperty,
  useUpdateProperty,
} from "../../services/database-queries";
import { useDatabaseView } from "../../context";

const propertyFormSchema = z.object({
  name: z.string().min(1, "Property name is required"),
  type: z.nativeEnum(EPropertyType),
  description: z.string().optional(),
  isRequired: z.boolean(),
  isVisible: z.boolean(),
  selectOptions: z
    .array(
      z.object({
        id: z.string(),
        value: z.string(),
        label: z.string(),
        color: z.string(),
      })
    )
    .optional(),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

const PROPERTY_TYPES = [
  {
    value: "text",
    label: "Text",
    icon: Type,
    description: "Plain text content",
  },
  {
    value: "number",
    label: "Number",
    icon: Hash,
    description: "Numeric values",
  },
  {
    value: "email",
    label: "Email",
    icon: Mail,
    description: "Email addresses",
  },
  {
    value: "url",
    label: "URL",
    icon: Link,
    description: "Web links",
  },
  {
    value: "phone",
    label: "Phone",
    icon: Phone,
    description: "Phone numbers",
  },
  {
    value: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    description: "True/false values",
  },
  {
    value: "date",
    label: "Date",
    icon: Calendar,
    description: "Date values",
  },
  {
    value: "select",
    label: "Select",
    icon: List,
    description: "Single choice from options",
  },
  {
    value: "multi_select",
    label: "Multi-select",
    icon: Tags,
    description: "Multiple choices from options",
  },
];

const OPTION_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
  "#6b7280",
  "#374151",
];

const getRandomColor = () => {
  return OPTION_COLORS[Math.floor(Math.random() * OPTION_COLORS.length)];
};

const PROPERTY_SUGGESTIONS = {
  text: ["Title", "Description", "Notes", "Summary", "Content", "Comments"],
  rich_text: ["Content", "Description", "Notes", "Details", "Summary"],
  number: ["Price", "Quantity", "Score", "Rating", "Count", "Amount"],
  date: ["Due Date", "Created Date", "Start Date", "End Date", "Deadline"],
  checkbox: ["Completed", "Active", "Published", "Verified", "Approved"],
  url: ["Website", "Link", "Reference", "Source", "Documentation"],
  email: ["Email", "Contact Email", "Work Email", "Personal Email"],
  phone: ["Phone", "Mobile", "Work Phone", "Contact Number"],
  currency: ["Price", "Cost", "Budget", "Salary", "Revenue"],
  percent: ["Progress", "Completion", "Rate", "Percentage"],
  select: ["Status", "Priority", "Category", "Type", "Stage"],
  multi_select: ["Tags", "Labels", "Categories", "Skills", "Technologies"],
  status: ["Status", "State", "Phase", "Progress"],
  priority: ["Priority", "Urgency", "Importance", "Level"],
  file: ["Attachment", "Document", "File", "Upload"],
  relation: ["Related To", "Linked", "Connected", "Reference"],
  rollup: ["Total", "Sum", "Count", "Average", "Summary"],
  formula: ["Calculated", "Formula", "Computed", "Derived"],
  created_time: ["Created At", "Date Created", "Creation Date"],
  last_edited_time: ["Updated At", "Modified Date", "Last Modified"],
  created_by: ["Creator", "Author", "Created By"],
  last_edited_by: ["Editor", "Modified By", "Last Edited By"],
  mood_scale: ["Mood", "Feeling", "Emotion", "State"],
  frequency: ["Frequency", "Rate", "Occurrence", "Interval"],
  content_type: ["Type", "Category", "Content Type", "Format"],
  finance_type: ["Transaction Type", "Payment Type", "Finance Type"],
  finance_category: ["Category", "Expense Type", "Income Type"],
  FILES: ["Files", "Attachments", "Documents"],
  LOOKUP: ["Lookup", "Reference", "Linked Value"],
};

export function PropertyForm() {
  const {
    database,
    currentProperty,
    currentView,
    dialogOpen,
    onDialogOpen,
    onPropertyChange,
  } = useDatabaseView();

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();

  const isOpen =
    dialogOpen === "create-property" || dialogOpen === "edit-property";
  const mode = dialogOpen === "create-property" ? "create" : "edit";
  const databaseId = database?.id || "";
  const property = currentProperty;
  const currentViewId = currentView?.id;

  const [selectOptions, setSelectOptions] = useState<TPropertyOption[]>([]);
  const [newOptionName, setNewOptionName] = useState("");
  const [useAutoColors, setUseAutoColors] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      type: EPropertyType.TEXT,
      description: "",
      isRequired: false,
      isVisible: true,
      selectOptions: [],
    },
  });

  useEffect(() => {
    if (property && mode === "edit") {
      form.reset({
        name: property.name,
        type: property.type,
        description: property.description || "",
        isRequired: property.required,
        isVisible: property.isVisible,
        selectOptions: property.config?.options || [],
      });
      setSelectOptions(property.config?.options || []);
    } else if (mode === "create") {
      form.reset({
        name: "",
        type: EPropertyType.TEXT,
        description: "",
        isRequired: false,
        isVisible: true,
        selectOptions: [],
      });
      setSelectOptions([]);
    }
  }, [property, mode, form]);

  const selectedType = form.watch("type");

  const handleSubmit = async (data: PropertyFormData) => {
    if (mode === "create" && !currentViewId) {
      console.error("Cannot create property: No current view selected");
      return;
    }

    try {
      const processedSelectOptions = ["select", "multi_select"].includes(
        data.type
      )
        ? selectOptions.map((option) =>
            useAutoColors ? { id: option.id, label: option.label } : option
          )
        : undefined;

      const propertyData = {
        name: data.name,
        type: data.type,
        description: data.description,
        required: data.isRequired,
        isVisible: data.isVisible,
        config: processedSelectOptions
          ? { options: processedSelectOptions }
          : undefined,
        viewId: currentViewId,
      };

      if (mode === "create") {
        await createPropertyMutation.mutateAsync({
          databaseId,
          data: propertyData,
        });
      } else if (mode === "edit" && property) {
        await updatePropertyMutation.mutateAsync({
          databaseId,
          propertyId: property.id,
          data: propertyData,
        });
      }

      onDialogOpen(null);
      onPropertyChange(null);
    } catch (error) {
      console.error("Failed to submit property:", error);
      // Don't close the dialog on error - let the user see the error and fix it
    }
  };

  const addSelectOption = (customColor?: string) => {
    if (newOptionName.trim()) {
      const label = newOptionName.trim();
      const newOption: TPropertyOption = {
        id: `option_${Date.now()}`,
        value: label.toLowerCase().replace(/\s+/g, "-"),
        label,
        color: customColor || getRandomColor(),
      };
      setSelectOptions((prev) => [...prev, newOption]);
      setNewOptionName("");
    }
  };

  const removeSelectOption = (optionId: string) => {
    setSelectOptions((prev) => prev.filter((option) => option.id !== optionId));
  };

  const updateOptionColor = (optionId: string, color: string) => {
    setSelectOptions((prev) =>
      prev.map((option) =>
        option.id === optionId ? { ...option, color } : option
      )
    );
  };

  const renderSelectOptionsEditor = () => {
    if (!["select", "multi_select"].includes(selectedType)) return null;

    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Options</label>
            <Badge variant="outline" className="text-xs">
              {selectOptions.length} option
              {selectOptions.length !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Auto-generate colors</span>
              <span className="text-xs text-muted-foreground">
                Let the server automatically assign colors to options
              </span>
            </div>
            <Checkbox
              checked={useAutoColors}
              onCheckedChange={(checked) => setUseAutoColors(Boolean(checked))}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Add option..."
            value={newOptionName}
            onChange={(e) => setNewOptionName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSelectOption();
              }
            }}
            className="flex-1"
          />

          {!useAutoColors && (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 to-blue-500 mr-2" />
                  Color
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="p-2">
                  <div className="text-xs font-medium mb-2 text-muted-foreground">
                    Choose Color
                  </div>
                  <div className="grid grid-cols-5 gap-1 mb-2">
                    {OPTION_COLORS.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full border hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addSelectOption(color);
                        }}
                        disabled={!newOptionName.trim()}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addSelectOption();
                    }}
                    disabled={!newOptionName.trim()}
                  >
                    <Shuffle className="h-3 w-3 mr-1" />
                    Random Color
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            type="button"
            onClick={() => addSelectOption()}
            disabled={!newOptionName.trim()}
            size="sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {selectOptions.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectOptions.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
              >
                <div className="flex items-center gap-2 flex-1">
                  {!useAutoColors ? (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full border-2 border-background shadow-sm"
                          style={{ backgroundColor: option.color }}
                        >
                          <span className="sr-only">Change color</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <div className="p-2">
                          <div className="text-xs font-medium mb-2 text-muted-foreground">
                            Choose Color
                          </div>
                          <div className="grid grid-cols-5 gap-1 mb-2">
                            {OPTION_COLORS.map((color) => (
                              <Button
                                key={color}
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 rounded-full border hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  updateOptionColor(option.id, color);
                                }}
                              >
                                {option.color === color && (
                                  <Check className="h-3 w-3 text-white drop-shadow-sm" />
                                )}
                              </Button>
                            ))}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              updateOptionColor(option.id, getRandomColor());
                            }}
                          >
                            <Shuffle className="h-3 w-3 mr-1" />
                            Random Color
                          </Button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                      <Shuffle className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSelectOption(option.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <SheetContent className="overflow-y-auto w-[500px] sm:w-[700px] lg:w-[800px] px-6">
        <SheetHeader className="space-y-4 pb-3 px-2">
          <div>
            <SheetTitle className="text-xl">
              {mode === "create" ? "Create Property" : "Edit Property"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {mode === "create"
                ? "Add a new property to structure your database."
                : "Modify the property configuration."}
            </SheetDescription>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 pb-6 px-1"
          >
            {/* Property Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Name</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Input placeholder="Enter property name..." {...field} />
                      {selectedType && PROPERTY_SUGGESTIONS[selectedType] && (
                        <div className="flex flex-wrap gap-2">
                          {PROPERTY_SUGGESTIONS[selectedType].map(
                            (suggestion) => (
                              <Button
                                key={suggestion}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  field.onChange(suggestion);
                                }}
                              >
                                {suggestion}
                              </Button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {PROPERTY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = field.value === type.value;
                        return (
                          <div
                            key={type.value}
                            className={`relative cursor-pointer rounded-md border p-2 transition-all hover:border-primary/50
                              ${
                                isSelected
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-muted hover:bg-muted/50"
                              }`}
                            onClick={() => field.onChange(type.value)}
                          >
                            <div className="flex flex-col items-center text-center space-y-1">
                              <Icon
                                className={`h-4 w-4 ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div
                                className={`text-xs font-medium ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-foreground"
                                }`}
                              >
                                {type.label}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                        );
                      })}
                    </div>
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
                    <Textarea
                      placeholder="Describe what this property is for..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="isRequired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Required</FormLabel>
                      <FormDescription>
                        This property must have a value
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isVisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Visible</FormLabel>
                      <FormDescription>
                        Show this property in forms
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {renderSelectOptionsEditor()}
            <SheetFooter className="flex gap-3 pt-6 border-t px-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => onDialogOpen(null)}
                disabled={
                  createPropertyMutation.isPending ||
                  updatePropertyMutation.isPending
                }
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  createPropertyMutation.isPending ||
                  updatePropertyMutation.isPending ||
                  (mode === "create" && !currentViewId)
                }
                className="flex-1"
              >
                {createPropertyMutation.isPending ||
                updatePropertyMutation.isPending ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {mode === "create" ? "Create Property" : "Update Property"}
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
