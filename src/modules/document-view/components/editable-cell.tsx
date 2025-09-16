import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DocumentProperty, DatabaseRecord } from "@/modules/document-view";

interface EditableCellProps {
  property: DocumentProperty;
  value: any;
  record: DatabaseRecord;
  onSave: (recordId: string, propertyId: string, newValue: any) => void;
  onCancel: () => void;
}

export function EditableCell({
  property,
  value,
  record,
  onSave,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const currentSelectedValues = Array.isArray(editValue) ? editValue : [];
  const option = property.selectOptions?.find((opt) => opt.id === value);

  const handleSave = () => {
    if (editValue !== value) onSave(record.id, property.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const renderEditableContent = () => {
    if (!isEditing) {
      return (
        <div
          className="cursor-pointer hover:bg-muted/50 p-1 rounded min-h-[24px] transition-colors flex items-center"
          onClick={() => {
            setIsEditing(true);
            setEditValue(value);
          }}
        >
          {renderDisplayValue()}
        </div>
      );
    }

    switch (property.type) {
      case "CHECKBOX":
        return (
          <Checkbox
            checked={editValue}
            onCheckedChange={(checked) => {
              setEditValue(checked);
              onSave(record.id, property.id, checked);
              setIsEditing(false);
            }}
          />
        );

      case "SELECT":
        return (
          <Select
            value={editValue}
            onValueChange={(newValue) => {
              setEditValue(newValue);
              onSave(record.id, property.id, newValue);
              setIsEditing(false);
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.selectOptions?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center space-x-2">
                    {option.color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>{option.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "MULTI_SELECT":
        return (
          <DropdownMenu
            onOpenChange={(open) => {
              if (!open) setIsEditing(false);
            }}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 w-full justify-start">
                {currentSelectedValues.length > 0 ? (
                  <div className="flex flex-wrap gap-1 max-w-full">
                    {currentSelectedValues.slice(0, 2).map((selectedId) => {
                      const option = property.selectOptions?.find(
                        (opt) => opt.id === selectedId
                      );
                      return option ? (
                        <Badge
                          key={option.id}
                          variant="secondary"
                          className="text-xs"
                          style={{
                            backgroundColor: option.color + "20",
                            color: option.color,
                          }}
                        >
                          {option.name}
                        </Badge>
                      ) : null;
                    })}
                    {currentSelectedValues.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{currentSelectedValues.length - 2}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Select options...
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {property.selectOptions?.map((option) => {
                const isSelected = currentSelectedValues.includes(option.id);
                return (
                  <DropdownMenuCheckboxItem
                    key={option.id}
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const newValues = checked
                        ? [...currentSelectedValues, option.id]
                        : currentSelectedValues.filter(
                            (id) => id !== option.id
                          );
                      setEditValue(newValues);
                      // Immediately save the change (like Notion)
                      onSave(record.id, property.id, newValues);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {option.color && (
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span>{option.name}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case "DATE":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-full justify-start text-left font-normal",
                  !editValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editValue ? format(new Date(editValue), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={editValue ? new Date(editValue) : undefined}
                onSelect={(date) => {
                  setEditValue(date ? date.toISOString() : null);
                  onSave(
                    record.id,
                    property.id,
                    date ? date.toISOString() : null
                  );
                  setIsEditing(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case "EMAIL":
      case "URL":
      case "PHONE":
        return (
          <Input
            type={
              property.type === "EMAIL"
                ? "email"
                : property.type === "URL"
                ? "url"
                : "tel"
            }
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 border-0 shadow-none focus:ring-1 focus:ring-primary/20 bg-transparent px-1"
            autoFocus
          />
        );

      case "NUMBER":
        return (
          <Input
            type="number"
            value={editValue || ""}
            onChange={(e) =>
              setEditValue(e.target.value ? Number(e.target.value) : null)
            }
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 border-0 shadow-none focus:ring-1 focus:ring-primary/20 bg-transparent px-1"
            autoFocus
          />
        );

      default:
        return (
          <Input
            value={editValue || ""}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 border-0 shadow-none focus:ring-1 focus:ring-primary/20 bg-transparent px-1"
            autoFocus
          />
        );
    }
  };

  const renderDisplayValue = () => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground">—</span>;
    }

    switch (property.type) {
      case "CHECKBOX":
        return <Checkbox checked={value} disabled />;

      case "SELECT":
        return option ? (
          <Badge
            variant="secondary"
            style={{
              backgroundColor: option.color + "20",
              color: option.color,
            }}
          >
            {option.name}
          </Badge>
        ) : (
          value
        );

      case "MULTI_SELECT":
        if (!Array.isArray(value) || value.length === 0) {
          return <span className="text-muted-foreground">—</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {value.map((val) => {
              const option = property.selectOptions?.find(
                (opt) => opt.id === val
              );
              return option ? (
                <Badge
                  key={option.id}
                  variant="secondary"
                  style={{
                    backgroundColor: option.color + "20",
                    color: option.color,
                  }}
                  className="text-xs"
                >
                  {option.name}
                </Badge>
              ) : (
                <Badge key={val} variant="outline" className="text-xs">
                  {val}
                </Badge>
              );
            })}
          </div>
        );

      case "DATE":
        if (!value) return <span className="text-muted-foreground">—</span>;
        try {
          const date = new Date(value);
          return format(date, "MMM d, yyyy");
        } catch {
          return <span className="text-muted-foreground">Invalid date</span>;
        }

      case "EMAIL":
        return (
          <a href={`mailto:${value}`} className="hover:underline">
            {value}
          </a>
        );

      case "URL":
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {value}
          </a>
        );

      case "PHONE":
        return (
          <a href={`tel:${value}`} className="hover:underline">
            {value}
          </a>
        );

      case "NUMBER":
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);

      default:
        return String(value);
    }
  };

  return renderEditableContent();
}
