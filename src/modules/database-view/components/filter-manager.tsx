import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, Trash2, Filter as FilterIcon } from "lucide-react";
import { EFilterOperator } from "@/modules/database-view/types";
import type { TFilterCondition } from "@/modules/database-view/types";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateViewFilters } from "@/modules/database-view/services/database-queries.ts";

const FILTER_OPERATORS: Record<
  string,
  Array<{ value: EFilterOperator; label: string }>
> = {
  text: [
    { value: EFilterOperator.CONTAINS, label: "Contains" },
    { value: EFilterOperator.NOT_CONTAINS, label: "Does not contain" },
    { value: EFilterOperator.EQUALS, label: "Equals" },
    { value: EFilterOperator.NOT_EQUALS, label: "Does not equal" },
    { value: EFilterOperator.STARTS_WITH, label: "Starts with" },
    { value: EFilterOperator.ENDS_WITH, label: "Ends with" },
    { value: EFilterOperator.IS_EMPTY, label: "Is empty" },
    { value: EFilterOperator.IS_NOT_EMPTY, label: "Is not empty" },
  ],
  number: [
    { value: EFilterOperator.EQUALS, label: "Equals" },
    { value: EFilterOperator.NOT_EQUALS, label: "Does not equal" },
    { value: EFilterOperator.GREATER_THAN, label: "Greater than" },
    { value: EFilterOperator.LESS_THAN, label: "Less than" },
    {
      value: EFilterOperator.GREATER_THAN_OR_EQUAL,
      label: "Greater than or equal",
    },
    { value: EFilterOperator.LESS_THAN_OR_EQUAL, label: "Less than or equal" },
    { value: EFilterOperator.IS_EMPTY, label: "Is empty" },
    { value: EFilterOperator.IS_NOT_EMPTY, label: "Is not empty" },
  ],
  date: [
    { value: EFilterOperator.EQUALS, label: "Is" },
    { value: EFilterOperator.NOT_EQUALS, label: "Is not" },
    { value: EFilterOperator.BEFORE, label: "Before" },
    { value: EFilterOperator.AFTER, label: "After" },
    { value: EFilterOperator.ON_OR_BEFORE, label: "On or before" },
    { value: EFilterOperator.ON_OR_AFTER, label: "On or after" },
    { value: EFilterOperator.IS_EMPTY, label: "Is empty" },
    { value: EFilterOperator.IS_NOT_EMPTY, label: "Is not empty" },
  ],
  checkbox: [
    { value: EFilterOperator.IS_CHECKED, label: "Is checked" },
    { value: EFilterOperator.IS_UNCHECKED, label: "Is unchecked" },
  ],
  select: [
    { value: EFilterOperator.IS, label: "Is" },
    { value: EFilterOperator.IS_NOT, label: "Is not" },
    { value: EFilterOperator.IS_EMPTY, label: "Is empty" },
    { value: EFilterOperator.IS_NOT_EMPTY, label: "Is not empty" },
  ],
  multi_select: [
    { value: EFilterOperator.CONTAINS, label: "Contains" },
    { value: EFilterOperator.NOT_CONTAINS, label: "Does not contain" },
    { value: EFilterOperator.CONTAINS_ALL, label: "Contains all" },
    { value: EFilterOperator.IS_EMPTY, label: "Is empty" },
    { value: EFilterOperator.IS_NOT_EMPTY, label: "Is not empty" },
  ],
};

export function FilterManager() {
  const { database, currentView, properties, tempFilters, setTempFilters } =
    useDatabaseView();
  const [localFilters, setLocalFilters] = useState<TFilterCondition[]>([]);
  const [open, setOpen] = useState(false);

  const updateViewFiltersMutation = useUpdateViewFilters();
  const isFrozen = database?.isFrozen;

  useEffect(() => {
    if (open && tempFilters) {
      setLocalFilters(tempFilters);
    }
  }, [open, tempFilters]);

  const addFilter = () => {
    if (properties.length > 0) {
      const firstProperty = properties[0];
      const operators =
        FILTER_OPERATORS[firstProperty.type] || FILTER_OPERATORS.text;

      const newFilters = [
        ...localFilters,
        {
          property: firstProperty.id,
          condition: operators[0].value,
          value: "",
          operator: "and" as const,
        },
      ];
      setLocalFilters(newFilters);
      setTempFilters(newFilters);
    }
  };

  const removeFilter = (index: number) => {
    const newFilters = localFilters.filter((_, i) => i !== index);
    setLocalFilters(newFilters);
    setTempFilters(newFilters);
  };

  const updateFilter = (
    index: number,
    field: "property" | "condition" | "value" | "operator",
    value: unknown
  ) => {
    const newFilters = [...localFilters];
    newFilters[index] = { ...newFilters[index], [field]: value };

    if (field === "property") {
      const property = properties.find((p) => p.id === (value as string));
      if (property) {
        const operators =
          FILTER_OPERATORS[property.type] || FILTER_OPERATORS.text;
        newFilters[index].condition = operators[0].value;
        newFilters[index].value = "";
      }
    }

    setLocalFilters(newFilters);
    // Update tempFilters immediately for instant feedback
    setTempFilters(newFilters);
  };

  const handleSave = async () => {
    if (!database?.id || !currentView?.id) return;

    try {
      await updateViewFiltersMutation.mutateAsync({
        databaseId: database.id,
        viewId: currentView.id,
        filters: localFilters,
      });

      setOpen(false);
    } catch (error) {
      console.error("Failed to save filters:", error);
    }
  };

  const handleClearAll = () => {
    setLocalFilters([]);
    setTempFilters([]);
  };

  const getProperty = (propertyId: string) =>
    properties.find((p) => p.id === propertyId);

  const getOperators = (propertyType: string) =>
    FILTER_OPERATORS[propertyType] || FILTER_OPERATORS.text;

  if (isFrozen) {
    return null; // Don't show filter manager for frozen databases
  }

  const renderValueInput = (
    filter: TFilterCondition,
    index: number,
    disabled = false
  ) => {
    const property = getProperty(filter.property);
    if (!property) return null;

    if (
      ["is_empty", "is_not_empty", "checked", "unchecked"].includes(
        filter.condition
      )
    ) {
      return null;
    }

    switch (property.type) {
      case "select":
        return (
          <Select
            value={filter.value as string}
            onValueChange={(value) => updateFilter(index, "value", value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {property.config?.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multi_select":
        return (
          <div className="w-[140px] space-y-2">
            {property.config?.options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${index}-${option.id}`}
                  checked={
                    Array.isArray(filter.value) &&
                    (filter.value as string[]).includes(option.id)
                  }
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(filter.value)
                      ? (filter.value as string[])
                      : [];
                    const newValues = checked
                      ? [...currentValues, option.id]
                      : currentValues.filter((id: string) => id !== option.id);
                    updateFilter(index, "value", newValues);
                  }}
                  disabled={disabled}
                />
                <label htmlFor={`${index}-${option.id}`}>{option.label}</label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            className="w-[140px]"
            value={filter.value as string}
            onChange={(e) => updateFilter(index, "value", e.target.value)}
            placeholder="Enter value..."
            disabled={disabled}
          />
        );
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isFrozen}
          title={
            isFrozen ? "Cannot modify filters for frozen database" : undefined
          }
        >
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full max-w-[500px] flex flex-col gap-3 p-4"
        align="end"
        side="bottom"
      >
        <p className="text-xs font-medium text-muted-foreground">
          {isFrozen ? "Filters disabled (database frozen)" : "Where"}
        </p>

        {localFilters.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {localFilters.map((filter, index) => {
              const property = getProperty(filter.property);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 border rounded-md px-2 py-1"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

                  <Select
                    value={filter.property}
                    onValueChange={(value) =>
                      updateFilter(index, "property", value)
                    }
                    disabled={isFrozen}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Property" />
                    </SelectTrigger>
                    <SelectContent>
                      {properties.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filter.condition}
                    onValueChange={(value) =>
                      updateFilter(index, "condition", value)
                    }
                    disabled={isFrozen}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {property &&
                        getOperators(property.type).map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  {renderValueInput(filter, index, isFrozen)}

                  <Button
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    size="icon"
                    onClick={() => removeFilter(index)}
                    disabled={isFrozen}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No filters applied. Add one below.
          </p>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" onClick={addFilter} disabled={isFrozen}>
            <Plus className="mr-1 h-4 w-4" />
            Add filter
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleClearAll}
            disabled={isFrozen}
          >
            Clear All
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isFrozen}>
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
