import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { CalendarIcon, CheckIcon } from "lucide-react";
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from "@/components/ui/kibo-ui/tags";
import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from "@/components/ui/kibo-ui/glimpse";
import { apiClient } from "@/services/api-client";
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
import { Badge } from "@/components/ui/badge";

interface EditableCellProps {
  record: TRecord;
  property: TProperty;
  value: TPropertyValue;
}

export function EditableCell({ record, property, value }: EditableCellProps) {
  const { database } = useDatabaseView();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<TPropertyValue>(value);
  const [glimpseData, setGlimpseData] = useState<{
    title: string | null;
    description: string | null;
    image: string | null;
  } | null>(null);

  const currentSelectedValues = getMultiSelectValues(editValue);
  const originalValueRef = useRef<TPropertyValue>(value);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateRecordMutation = useUpdateRecord();

  useEffect(() => {
    if (!isEditing) {
      originalValueRef.current = value;
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Load glimpse data for URLs
  useEffect(() => {
    const urlValue = getStringValue(value);
    if (urlValue && urlValue.startsWith("http")) {
      apiClient
        .get(`/search/glimpse?url=${encodeURIComponent(urlValue)}`)
        .then((response) => {
          setGlimpseData(response.data.data);
        })
        .catch(() => setGlimpseData(null));
    } else {
      setGlimpseData(null);
    }
  }, [value]);

  const handleSave = useCallback(
    async (newValue: TPropertyValue) => {
      // Prevent saving if value hasn't changed from original
      if (
        JSON.stringify(newValue) === JSON.stringify(originalValueRef.current)
      ) {
        if (!isTextInput(property.type)) {
          setIsEditing(false);
        }
        return;
      }

      if (!database?.id) return;

      try {
        await updateRecordMutation.mutateAsync({
          databaseId: database.id,
          recordId: record.id,
          payload: {
            [property.id]: newValue,
          },
        });
        // Update the original value reference
        originalValueRef.current = newValue;
        if (!isTextInput(property.type)) {
          setIsEditing(false);
        }
      } catch {
        toast.error("Failed to update cell");
        setEditValue(originalValueRef.current);
      }
    },
    [database?.id, record.id, property.id, updateRecordMutation, property.type]
  );

  const debouncedSave = useCallback(
    (newValue: TPropertyValue) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        handleSave(newValue);
      }, 500);
    },
    [handleSave]
  );

  const handleValueChange = useCallback(
    (newValue: TPropertyValue) => {
      setEditValue(newValue);
      if (isTextInput(property.type)) {
        debouncedSave(newValue);
      } else {
        handleSave(newValue);
      }
    },
    [property.type, debouncedSave, handleSave]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Helper to check if property type is text-based
  const isTextInput = (type: EPropertyType) => {
    return [
      EPropertyType.EMAIL,
      EPropertyType.URL,
      EPropertyType.PHONE,
      EPropertyType.NUMBER,
      EPropertyType.TEXT,
    ].includes(type);
  };

  const handleCancel = () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
    setEditValue(originalValueRef.current);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isTextInput(property.type)) {
      // Clear any pending debounce and save immediately on Enter
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
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
          className={cn(
            "p-1 rounded min-h-[24px] flex items-center gap-2 relative",
            isFrozen ? "cursor-not-allowed opacity-60" : "cursor-text"
          )}
          onClick={() => {
            if (!isFrozen) {
              originalValueRef.current = value;
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
            <SelectTrigger className="h-8 border-0 bg-transparent shadow-none focus:ring-0 focus:ring-offset-0 px-1 text-sm dark:bg-transparent max-w-[180px] dark:hover:bg-transparent focus-visible:bg-transparent">
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

      case EPropertyType.MULTI_SELECT: {
        const handleRemove = (value: string) => {
          const newValues = currentSelectedValues.filter((id) => id !== value);
          handleSave(newValues);
        };
        const handleSelect = (value: string) => {
          const newValues = currentSelectedValues.includes(value)
            ? currentSelectedValues.filter((id) => id !== value)
            : [...currentSelectedValues, value];
          handleSave(newValues);
        };
        return (
          <Tags
            open={isEditing}
            onOpenChange={(open) => setIsEditing(open)}
            className="max-w-[180px] inline-block"
          >
            <TagsTrigger className="h-8 px-2 text-xs dark:border-0 dark:bg-transparent dark:hover:bg-transparent">
              {currentSelectedValues.map((selectedId) => {
                const option = property.config?.options?.find(
                  (opt) => opt.id === selectedId
                );
                return option ? (
                  <TagsValue
                    key={option.id}
                    onRemove={() => handleRemove(option.id)}
                    style={{
                      backgroundColor: option.color + "20",
                      color: option.color,
                    }}
                  >
                    {option.label}
                  </TagsValue>
                ) : null;
              })}
            </TagsTrigger>
            <TagsContent>
              <TagsInput placeholder="Search options..." />
              <TagsList className="max-h-[150px]">
                <TagsEmpty />
                <TagsGroup>
                  {property.config?.options?.map((option) => (
                    <TagsItem
                      key={option.id}
                      onSelect={() => handleSelect(option.id)}
                      value={option.id}
                    >
                      <div className="flex items-center space-x-2">
                        {option.color && (
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        <span>{option.label}</span>
                        {currentSelectedValues.includes(option.id) && (
                          <CheckIcon
                            className="text-muted-foreground"
                            size={14}
                          />
                        )}
                      </div>
                    </TagsItem>
                  ))}
                </TagsGroup>
              </TagsList>
            </TagsContent>
          </Tags>
        );
      }

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
            onChange={(e) => handleValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-auto min-h-[24px] border-0 shadow-none focus:ring-0 focus:ring-offset-0 bg-transparent text-sm dark:bg-transparent truncate max-w-[200px] focus-visible:ring-0"
            autoFocus
          />
        );

      case EPropertyType.NUMBER:
        return (
          <Input
            type="number"
            value={getNumberValue(editValue)}
            onChange={(e) =>
              handleValueChange(e.target.value ? Number(e.target.value) : null)
            }
            onKeyDown={handleKeyDown}
            className="h-auto min-h-[24px] border-0 shadow-none focus-visible:ring-0 bg-transparent px-1 text-sm font-medium dark:bg-transparent"
            autoFocus
          />
        );

      default:
        return (
          <Input
            value={getStringValue(editValue)}
            onChange={(e) => handleValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-auto min-h-[24px] border-0 shadow-none focus:ring-0 focus:ring-offset-0 bg-transparent dark:bg-transparent text-sm truncate max-w-[200px] focus-visible:ring-0"
            autoFocus
          />
        );
    }
  };

  const renderDisplayValue = () => {
    if (value === null || value === undefined || value === "") {
      return "";
    }

    switch (property.type) {
      case EPropertyType.CHECKBOX:
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "w-4 h-4 border rounded flex items-center justify-center",
                value
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-muted-foreground"
              )}
            >
              {value && <CheckIcon className="w-3 h-3" />}
            </div>
            <span className="text-sm">{value ? "Checked" : "Unchecked"}</span>
          </div>
        );

      case EPropertyType.SELECT:
        if (typeof value === "string" && property.config?.options) {
          const option = property.config.options.find(
            (opt) => opt.id === value
          );
          if (option) {
            return (
              <Badge
                variant="outline"
                className="text-xs text-white border-0"
                style={{ backgroundColor: option.color || "#6b7280" }}
              >
                {option.label}
              </Badge>
            );
          }
        }
        return (
          <Badge variant="secondary" className="text-xs">
            {String(value)}
          </Badge>
        );

      case EPropertyType.MULTI_SELECT:
        if (!Array.isArray(value) || value.length === 0) {
          return null;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {(value as string[]).slice(0, 2).map((val) => {
              const option = property.config?.options?.find(
                (opt) => opt.id === val
              );
              return option ? (
                <Badge
                  key={option.id}
                  variant="outline"
                  className="text-xs text-white border-0"
                  style={{ backgroundColor: option.color || "#6b7280" }}
                >
                  {option.label}
                </Badge>
              ) : (
                <Badge key={val} variant="secondary" className="text-xs">
                  {val}
                </Badge>
              );
            })}
            {value.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 2}
              </Badge>
            )}
          </div>
        );

      case EPropertyType.DATE: {
        const displayDateValue = getDateValue(value);
        if (!displayDateValue) return "";

        return (
          <span className="text-sm">
            {format(displayDateValue, "MMM d, yyyy")}
          </span>
        );
      }

      case EPropertyType.DATE_RANGE: {
        if (value && typeof value === "object" && "start" in value) {
          const range = value as { start?: string | Date; end?: string | Date };
          const start = range.start
            ? format(new Date(range.start), "MMM d, yyyy")
            : null;
          const end = range.end
            ? format(new Date(range.end), "MMM d, yyyy")
            : null;
          if (start && end) {
            return (
              <span className="text-sm">
                {start} - {end}
              </span>
            );
          } else if (start) {
            return <span className="text-sm">{start}</span>;
          } else if (end) {
            return <span className="text-sm">{end}</span>;
          }
        }
        return "";
      }

      case EPropertyType.CREATED_TIME:
      case EPropertyType.LAST_EDITED_TIME: {
        const displayDateValue = getDateValue(value);
        if (!displayDateValue) return "";
        return (
          <span className="text-sm">
            {format(displayDateValue, "MMM d, yyyy")}
          </span>
        );
      }

      case EPropertyType.EMAIL: {
        const emailValue = getStringValue(value);
        return (
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            {emailValue}
          </span>
        );
      }

      case EPropertyType.URL: {
        const urlValue = getStringValue(value);
        return (
          <Glimpse>
            <GlimpseTrigger asChild>
              <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                {urlValue}
              </span>
            </GlimpseTrigger>
            <GlimpseContent
              className="w-80 cursor-pointer"
              side="bottom"
              onClick={() => window.open(urlValue, "_blank")}
            >
              {glimpseData ? (
                <>
                  {glimpseData.image && (
                    <GlimpseImage src={glimpseData.image} />
                  )}
                  {glimpseData.title && (
                    <GlimpseTitle>{glimpseData.title}</GlimpseTitle>
                  )}
                  {glimpseData.description && (
                    <GlimpseDescription>
                      {glimpseData.description}
                    </GlimpseDescription>
                  )}
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Click to visit this URL
                  </p>
                </div>
              )}
            </GlimpseContent>
          </Glimpse>
        );
      }

      case EPropertyType.PHONE: {
        const phoneValue = getStringValue(value);
        return (
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">
            {phoneValue}
          </span>
        );
      }

      case EPropertyType.NUMBER:
        return (
          <span className="text-sm font-medium">
            {typeof value === "number" ? value.toLocaleString() : String(value)}
          </span>
        );

      default:
        return (
          <span className="text-sm truncate max-w-[200px]">
            {String(value)}
          </span>
        );
    }
  };

  return renderEditableContent();
}
