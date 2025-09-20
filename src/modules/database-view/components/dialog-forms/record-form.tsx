import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { CalendarIcon, Save, Settings } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils.ts";
import type { IDatabaseProperty, IDatabaseRecord } from "../../types";
import {
  normalizeSelectValue,
  getSelectOptionId,
} from "@/modules/database-view/utils/select-option-utils.ts";

type RecordFormData = Record<string, unknown>;

interface RecordFormProps {
  record?: IDatabaseRecord | null;
  properties?: IDatabaseProperty[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RecordFormData) => Promise<void>;
  mode?: "create" | "edit";
  isLoading?: boolean;
}

export function RecordForm({
  record,
  properties = [],
  open,
  onOpenChange,
  onSubmit,
  mode = "create",
  isLoading = false,
}: RecordFormProps) {
  // Create dynamic schema based on properties
  const createSchema = () => {
    const schemaFields: Record<string, z.ZodTypeAny> = {};

    (properties || []).forEach((property) => {
      if (!property || !property.id || !property.type) return;
      let fieldSchema: z.ZodTypeAny;

      switch (property.type) {
        case "text":
        case "email":
        case "url":
        case "phone":
          fieldSchema = z.string().optional();
          if (property.required) {
            fieldSchema = z.string().min(1, `${property.name} is required`);
          }
          break;
        case "number":
          fieldSchema = z.union([z.number(), z.string()]).optional();
          if (property.required) {
            fieldSchema = z.union([
              z.number(),
              z.string().min(1, `${property.name} is required`),
            ]);
          }
          break;
        case "checkbox":
          fieldSchema = z.boolean().optional();
          break;
        case "date":
          fieldSchema = z.date().optional();
          if (property.required) {
            fieldSchema = z.date({
              required_error: `${property.name} is required`,
            });
          }
          break;
        case "select":
          fieldSchema = z.string().optional();
          if (property.required) {
            fieldSchema = z.string().min(1, `${property.name} is required`);
          }
          break;
        case "multi_select":
          fieldSchema = z.array(z.string()).optional();
          if (property.required) {
            fieldSchema = z
              .array(z.string())
              .min(1, `${property.name} is required`);
          }
          break;
        default:
          fieldSchema = z.unknown().optional();
      }

      schemaFields[property.id] = fieldSchema;
    });

    return z.object(schemaFields);
  };

  const schema = createSchema();
  const form = useForm<RecordFormData>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    if (record && mode === "edit") {
      const formData: RecordFormData = {};
      (properties || []).forEach((property) => {
        if (!property || !property.id) return;
        if (!record.properties) return;

        const value = record.properties[property.id];
        if (value !== undefined) {
          if (property.type === "date" && typeof value === "string") {
            const dateValue = new Date(value);
            formData[property.id] = !isNaN(dateValue.getTime())
              ? dateValue
              : undefined;
          } else if (property.type === "select") {
            const normalizedValue = normalizeSelectValue(value, false);
            formData[property.id] = getSelectOptionId(normalizedValue) || "";
          } else if (property.type === "multi_select") {
            const normalizedValues = normalizeSelectValue(value, true);
            formData[property.id] = normalizedValues
              .map((v: unknown) => getSelectOptionId(v))
              .filter(Boolean);
          } else {
            formData[property.id] = value;
          }
        }
      });
      form.reset(formData);
    } else if (mode === "create") {
      const defaultData: RecordFormData = {};
      (properties || []).forEach((property) => {
        if (!property || !property.id || !property.type) return;

        switch (property.type) {
          case "checkbox":
            defaultData[property.id] = false;
            break;
          case "multi_select":
            defaultData[property.id] = [];
            break;
          case "number":
            defaultData[property.id] = "";
            break;
          default:
            defaultData[property.id] = "";
        }
      });
      form.reset(defaultData);
    }
  }, [record, properties, mode, form]);

  useEffect(() => {
    if (record && mode === "edit") {
      const formData: RecordFormData = {};
      (properties || []).forEach((property) => {
        if (!property || !property.id) return;

        const value = record.properties?.[property.id];
        if (value !== undefined) {
          if (property.type === "date" && typeof value === "string") {
            const dateValue = new Date(value);
            formData[property.id] = !isNaN(dateValue.getTime())
              ? dateValue
              : undefined;
          } else if (property.type === "select") {
            const normalizedValue = normalizeSelectValue(value, false);
            formData[property.id] = getSelectOptionId(normalizedValue) || "";
          } else if (property.type === "multi_select") {
            const normalizedValues = normalizeSelectValue(value, true);
            formData[property.id] = normalizedValues
              .map((v: unknown) => getSelectOptionId(v))
              .filter(Boolean);
          } else {
            formData[property.id] = value;
          }
        } else {
          switch (property.type) {
            case "checkbox":
              formData[property.id] = false;
              break;
            case "multi_select":
              formData[property.id] = [];
              break;
            case "number":
              formData[property.id] = "";
              break;
            default:
              formData[property.id] = "";
          }
        }
      });
      form.reset(formData);
    }
  }, [record, properties, mode, form]);

  const handleSubmit = async (data: RecordFormData) => {
    try {
      const transformedData: RecordFormData = {};

      (properties || []).forEach((property) => {
        if (!property || !property.id || !property.type) return;
        const value = data[property.id];

        if (value !== undefined && value !== "" && value !== null) {
          if (property.type === "date" && value instanceof Date) {
            transformedData[property.id] = value.toISOString();
          } else if (property.type === "select" && typeof value === "string") {
            transformedData[property.id] = value;
          } else if (property.type === "multi_select" && Array.isArray(value)) {
            transformedData[property.id] = value;
          } else {
            transformedData[property.id] = value;
          }
        }
      });

      await onSubmit(transformedData);
      form.reset();
    } catch (error) {
      console.error("Failed to submit record:", error);
    }
  };

  const renderField = (property: IDatabaseProperty) => {
    const fieldKey = `field-${property.id}`;

    return (
      <FormField
        key={fieldKey}
        control={form.control}
        name={property.id}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              {property.name}
              {property.required && <span className="text-red-500">*</span>}
            </FormLabel>

            {/* TEXT Field */}
            {property.type === "text" && (
              <FormControl>
                <Input
                  className="w-full"
                  placeholder={`Enter ${property.name.toLowerCase()}...`}
                  {...field}
                />
              </FormControl>
            )}

            {/* NUMBER Field */}
            {property.type === "number" && (
              <FormControl>
                <Input
                  className="w-full"
                  type="number"
                  placeholder={`Enter ${property.name.toLowerCase()}...`}
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </FormControl>
            )}

            {/* EMAIL Field */}
            {property.type === "email" && (
              <FormControl>
                <Input
                  className="w-full"
                  type="email"
                  placeholder={`Enter ${property.name.toLowerCase()}...`}
                  {...field}
                />
              </FormControl>
            )}

            {/* URL Field */}
            {property.type === "url" && (
              <FormControl>
                <Input
                  className="w-full"
                  type="url"
                  placeholder={`Enter ${property.name.toLowerCase()}...`}
                  {...field}
                />
              </FormControl>
            )}

            {/* PHONE Field */}
            {property.type === "phone" && (
              <FormControl>
                <Input
                  className="w-full"
                  type="tel"
                  placeholder={`Enter ${property.name.toLowerCase()}...`}
                  {...field}
                />
              </FormControl>
            )}

            {/* CHECKBOX Field */}
            {property.type === "checkbox" && (
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={field.value || false}
                    onCheckedChange={field.onChange}
                  />
                  <span className="text-sm">{property.name}</span>
                </div>
              </FormControl>
            )}

            {/* DATE Field */}
            {property.type === "date" && (
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value &&
                      field.value instanceof Date &&
                      !isNaN(field.value.getTime()) ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
            )}

            {/* SELECT Field */}
            {property.type === "select" && (
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={`Select ${property.name.toLowerCase()}...`}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {property.config?.options?.map((option) => {
                    const optionId = option.id;
                    const optionLabel = option.name || String(option);
                    const optionColor = option.color;

                    return (
                      <SelectItem key={optionId} value={optionId}>
                        <div className="flex items-center space-x-2">
                          {optionColor && (
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: optionColor }}
                            />
                          )}
                          <span>{optionLabel}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}

            {/* MULTI_SELECT Field */}
            {property.type === "multi_select" && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1 min-h-[2rem] p-2 border rounded-md">
                  {(field.value || []).map((selectedId: string) => {
                    const option = property.config?.options?.find(
                      (opt) => opt.id === selectedId
                    );
                    const optionLabel = option?.name || selectedId;
                    const optionColor = option?.color;

                    return (
                      <Badge
                        key={selectedId}
                        variant="secondary"
                        className="flex items-center space-x-1"
                      >
                        {optionColor && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: optionColor }}
                          />
                        )}
                        <span>{optionLabel}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newValue = (field.value || []).filter(
                              (id: string) => id !== selectedId
                            );
                            field.onChange(newValue);
                          }}
                          className="ml-1 text-xs hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Select
                  onValueChange={(value) => {
                    const currentValues = field.value || [];
                    if (!currentValues.includes(value)) {
                      field.onChange([...currentValues, value]);
                    }
                  }}
                  value=""
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={`Add ${property.name.toLowerCase()}...`}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {property.config?.options
                      ?.filter((option) => {
                        return !(field.value || []).includes(option.id);
                      })
                      .map((option) => {
                        const optionId = option.id;
                        const optionLabel = option.name || String(option);
                        const optionColor = option.color;

                        return (
                          <SelectItem key={optionId} value={optionId}>
                            <div className="flex items-center space-x-2">
                              {optionColor && (
                                <div
                                  className="w-3 h-3 rounded-full border border-gray-300"
                                  style={{ backgroundColor: optionColor }}
                                />
                              )}
                              <span>{optionLabel}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              </div>
            )}

            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[500px] sm:w-[600px] px-6">
        <SheetHeader className="space-y-4 px-0">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <SheetTitle>
              {mode === "create" ? "Create Record" : "Edit Record"}
            </SheetTitle>
          </div>
          <SheetDescription>
            {mode === "create"
              ? "Add a new record with the information below."
              : "Update the record information below."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 pb-6"
          >
            {(properties || [])
              .filter((p) => p && p.id && p.name)
              .map(renderField)}

            <SheetFooter className="flex space-x-2 px-0 pt-3">
              <div className="flex justify-end gap-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Save className="mr-1 h-4 w-4 animate-spin" />
                      {mode === "create" ? "Creating..." : "Updating..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 h-4 w-4" />
                      {mode === "create" ? "Create Record" : "Update Record"}
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
