import { useState, useEffect } from "react";
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
import type {
  TProperty,
  TRecord,
  TPropertyValue,
} from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import { toast } from "sonner";
import {
  getBooleanValue,
  getDateValue,
  getMultiSelectValues,
  getNumberValue,
  getStringValue,
} from "@/utils/helpers.ts";

interface EditableCellProps {
  record: TRecord;
  property: TProperty;
  value: TPropertyValue;
}

export function EditableCell({ record, property, value }: EditableCellProps) {
  const { database } = useDatabaseView();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<TPropertyValue>(value);

  const currentSelectedValues = getMultiSelectValues(editValue);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const updateRecordMutation = useUpdateRecord();

  const handleSave = async (newValue: TPropertyValue) => {
    if (!database?.id) return;

    try {
      await updateRecordMutation.mutateAsync({
        databaseId: database.id,
        recordId: record.id,
        payload: {
          [property.id]: newValue,
        },
      });
      setIsEditing(false);
      toast.success("Cell updated successfully");
    } catch {
      toast.error("Failed to update cell");
      setEditValue(value);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave(editValue);
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const renderEditableContent = () => {
    const isFrozen = database?.isFrozen;

    if (!isEditing) {
      return (
        <div
          className={`p-1 rounded min-h-[24px] flex items-center ${
            isFrozen
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer hover:bg-muted/50 transition-colors"
          }`}
          onClick={() => {
            if (!isFrozen) {
              setIsEditing(true);
              setEditValue(value);
            }
          }}
        >
          {renderDisplayValue()}
        </div>
      );
    }

    switch (property.type) {
      case EPropertyType.CHECKBOX:
        return (
          <Checkbox
            checked={getBooleanValue(editValue)}
            onCheckedChange={(checked) => {
              handleSave(checked);
            }}
          />
        );

      case EPropertyType.SELECT:
        return (
          <Select
            value={getStringValue(editValue)}
            onValueChange={(newValue) => {
              handleSave(newValue);
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {property.config?.options?.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center space-x-2">
                    {option.color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case EPropertyType.MULTI_SELECT:
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
                      const option = property.config?.options?.find(
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
                          {option.label}
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
              {property.config?.options?.map((option) => {
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
                      handleSave(newValues);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      {option.color && (
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span>{option.label}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );

      case EPropertyType.DATE: {
        const dateValue = getDateValue(editValue);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-full justify-start text-left font-normal",
                  !dateValue && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateValue ? format(dateValue, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  handleSave(date ? date.toISOString() : null);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      }

      case EPropertyType.EMAIL:
      case EPropertyType.URL:
      case EPropertyType.PHONE:
        return (
          <Input
            type={
              property.type === EPropertyType.EMAIL
                ? "email"
                : property.type === EPropertyType.URL
                ? "url"
                : "tel"
            }
            value={getStringValue(editValue)}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave(editValue)}
            onKeyDown={handleKeyDown}
            className="h-8 border-0 shadow-none focus:ring-1 focus:ring-primary/20 bg-transparent px-1"
            autoFocus
          />
        );

      case EPropertyType.NUMBER:
        return (
          <Input
            type="number"
            value={getNumberValue(editValue)}
            onChange={(e) =>
              setEditValue(e.target.value ? Number(e.target.value) : null)
            }
            onBlur={() => handleSave(editValue)}
            onKeyDown={handleKeyDown}
            className="h-8 border-0 shadow-none focus:ring-1 focus:ring-primary/20 bg-transparent px-1"
            autoFocus
          />
        );

      default:
        return (
          <Input
            value={getStringValue(editValue)}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleSave(editValue)}
            onKeyDown={handleKeyDown}
            className="h-8 border-0 shadow-none focus:ring-1 focus:ring-primary/20 bg-transparent px-1 w-auto"
            autoFocus
          />
        );
    }
  };

  const renderDisplayValue = () => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    switch (property.type) {
      case EPropertyType.CHECKBOX:
        return <Checkbox checked={Boolean(value)} disabled />;

      case EPropertyType.SELECT:
        if (typeof value === "string" && property.config?.options) {
          const option = property.config.options.find(
            (opt) => opt.id === value
          );
          return option ? (
            <Badge
              variant="secondary"
              style={{
                backgroundColor: option.color + "20",
                color: option.color,
              }}
            >
              {option.label}
            </Badge>
          ) : (
            <span>{value}</span>
          );
        }
        return <span>{String(value)}</span>;

      case EPropertyType.MULTI_SELECT:
        if (!Array.isArray(value) || value.length === 0) {
          return null;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {(value as string[]).map((val) => {
              const option = property.config?.options?.find(
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
                  {option.label}
                </Badge>
              ) : (
                <Badge key={val} variant="outline" className="text-xs">
                  {val}
                </Badge>
              );
            })}
          </div>
        );

      case EPropertyType.DATE: {
        const displayDateValue = getDateValue(value);
        if (!displayDateValue) return null;
        return format(displayDateValue, "MMM d, yyyy");
      }

      case EPropertyType.EMAIL: {
        const emailValue = getStringValue(value);
        return (
          <a href={`mailto:${emailValue}`} className="hover:underline">
            {emailValue}
          </a>
        );
      }

      case EPropertyType.URL: {
        const urlValue = getStringValue(value);
        return (
          <a
            href={urlValue}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {urlValue}
          </a>
        );
      }

      case EPropertyType.PHONE: {
        const phoneValue = getStringValue(value);
        return (
          <a href={`tel:${phoneValue}`} className="hover:underline">
            {phoneValue}
          </a>
        );
      }

      case EPropertyType.NUMBER:
        return typeof value === "number"
          ? value.toLocaleString()
          : String(value);

      default:
        return String(value);
    }
  };

  return renderEditableContent();
}
