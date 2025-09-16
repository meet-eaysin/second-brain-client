"use client";

import React, { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, Trash2, Filter as FilterIcon } from "lucide-react";
import type { DocumentProperty, DatabaseView } from "@/modules/document-view";

interface FilterRule {
  propertyId: string;
  operator: string;
  value: any;
}

interface FilterManagerProps {
  properties: DocumentProperty[];
  currentView?: DatabaseView;
  onSave: (filters: FilterRule[]) => void;
}

const FILTER_OPERATORS = {
  TEXT: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
    { value: "starts_with", label: "Starts with" },
    { value: "ends_with", label: "Ends with" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  NUMBER: [
    { value: "equals", label: "Equals" },
    { value: "not_equals", label: "Does not equal" },
    { value: "greater_than", label: "Greater than" },
    { value: "less_than", label: "Less than" },
    { value: "greater_than_or_equal", label: "Greater than or equal" },
    { value: "less_than_or_equal", label: "Less than or equal" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  DATE: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
    { value: "before", label: "Before" },
    { value: "after", label: "After" },
    { value: "on_or_before", label: "On or before" },
    { value: "on_or_after", label: "On or after" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  CHECKBOX: [
    { value: "checked", label: "Is checked" },
    { value: "unchecked", label: "Is unchecked" },
  ],
  SELECT: [
    { value: "equals", label: "Is" },
    { value: "not_equals", label: "Is not" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
  MULTI_SELECT: [
    { value: "contains", label: "Contains" },
    { value: "not_contains", label: "Does not contain" },
    { value: "contains_all", label: "Contains all" },
    { value: "is_empty", label: "Is empty" },
    { value: "is_not_empty", label: "Is not empty" },
  ],
};

export function FilterManager({
  properties,
  currentView,
  onSave,
}: FilterManagerProps) {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && currentView?.filters) {
      setFilters(currentView.filters);
    }
  }, [open, currentView?.filters]);

  const addFilter = () => {
    if (properties.length > 0) {
      const firstProperty = properties[0];
      const operators =
        FILTER_OPERATORS[firstProperty.type] || FILTER_OPERATORS.TEXT;

      setFilters([
        ...filters,
        {
          propertyId: firstProperty.id,
          operator: operators[0].value,
          value: "",
        },
      ]);
    }
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof FilterRule, value: any) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };

    if (field === "propertyId") {
      const property = properties.find((p) => p.id === value);
      if (property) {
        const operators =
          FILTER_OPERATORS[property.type] || FILTER_OPERATORS.TEXT;
        newFilters[index].operator = operators[0].value;
        newFilters[index].value = "";
      }
    }

    setFilters(newFilters);
  };

  const handleSave = async () => {
    await onSave(filters);
    setOpen(false);
  };

  const handleReset = () => {
    setFilters([]);
  };

  const getProperty = (propertyId: string) =>
    properties.find((p) => p.id === propertyId);

  const getOperators = (propertyType: string) =>
    FILTER_OPERATORS[propertyType] || FILTER_OPERATORS.TEXT;

  const renderValueInput = (filter: FilterRule, index: number) => {
    const property = getProperty(filter.propertyId);
    if (!property) return null;

    if (
      ["is_empty", "is_not_empty", "checked", "unchecked"].includes(
        filter.operator
      )
    ) {
      return null;
    }

    switch (property.type) {
      case "SELECT":
        return (
          <Select
            value={filter.value}
            onValueChange={(value) => updateFilter(index, "value", value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select option..." />
            </SelectTrigger>
            <SelectContent>
              {property.selectOptions?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "MULTI_SELECT":
        return (
          <div className="w-[140px] space-y-2">
            {property.selectOptions?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${index}-${option.id}`}
                  checked={
                    Array.isArray(filter.value) &&
                    filter.value.includes(option.id)
                  }
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(filter.value)
                      ? filter.value
                      : [];
                    const newValues = checked
                      ? [...currentValues, option.id]
                      : currentValues.filter((id) => id !== option.id);
                    updateFilter(index, "value", newValues);
                  }}
                />
                <label htmlFor={`${index}-${option.id}`}>{option.name}</label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            className="w-[140px]"
            value={filter.value}
            onChange={(e) => updateFilter(index, "value", e.target.value)}
            placeholder="Enter value..."
          />
        );
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <FilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[500px] flex flex-col gap-3 p-4"
        align="start"
        side="bottom"
      >
        <p className="text-xs font-medium text-muted-foreground">Where</p>

        {filters.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filters.map((filter, index) => {
              const property = getProperty(filter.propertyId);
              return (
                <div
                  key={index}
                  className="flex items-center gap-2 border rounded-md px-2 py-1"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />

                  <Select
                    value={filter.propertyId}
                    onValueChange={(value) =>
                      updateFilter(index, "propertyId", value)
                    }
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
                    value={filter.operator}
                    onValueChange={(value) =>
                      updateFilter(index, "operator", value)
                    }
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

                  {renderValueInput(filter, index)}

                  <Button
                    variant="ghost"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    size="icon"
                    onClick={() => removeFilter(index)}
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
          <Button size="sm" onClick={addFilter}>
            <Plus className="mr-1 h-4 w-4" />
            Add filter
          </Button>
          {filters.length > 0 && (
            <>
              <Button size="sm" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button size="sm" onClick={handleSave}>
                Apply
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
