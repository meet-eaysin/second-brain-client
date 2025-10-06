import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type {
  TProperty,
  TRecord,
  TPropertyValue,
} from "@/modules/database-view/types";
import { EPropertyType } from "@/modules/database-view/types";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateRecord } from "@/modules/database-view/services/database-queries";
import {
  getBooleanValue,
  getDateValue,
  getMultiSelectValues,
  getNumberValue,
  getStringValue,
} from "@/utils/helpers.ts";
import { formatDateForDisplay, formatLastEditedTime } from "@/lib/date-utils";
import { EditableSelect } from "./editable-select";
import { EditableMultiSelect } from "./editable-multi-select";

interface EditableCellProps {
  record: TRecord;
  property: TProperty;
  value: TPropertyValue;
}

export function EditableCell({ record, property, value }: EditableCellProps) {
  const { database } = useDatabaseView();
  const [editValue, setEditValue] = useState<TPropertyValue>(value);

  const currentSelectedValues = getMultiSelectValues(editValue);
  const originalValueRef = useRef<TPropertyValue>(value);
  const updateRecordMutation = useUpdateRecord();

  useEffect(() => {
    originalValueRef.current = value;
    setEditValue(value);
  }, [value]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = Math.max(24, textarea.scrollHeight) + "px";
    }
  }, [editValue]);

  const handleSave = useCallback(
    async (newValue: TPropertyValue) => {
      if (
        JSON.stringify(newValue) === JSON.stringify(originalValueRef.current)
      ) {
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
        originalValueRef.current = newValue;
      } catch {
        console.warn("Failed to save cell value");
      }
    },
    [database?.id, record.id, property.id, updateRecordMutation]
  );

  const handleValueChange = useCallback(
    (newValue: TPropertyValue) => {
      setEditValue(newValue);
      handleSave(newValue);
    },
    [handleSave]
  );

  const isReadOnly = (type: EPropertyType) => {
    return [
      EPropertyType.CREATED_TIME,
      EPropertyType.LAST_EDITED_TIME,
    ].includes(type);
  };

  const renderEditableContent = () => {
    const isFrozen = database?.isFrozen;
    const readOnly = isReadOnly(property.type);

    const disabled = !!isFrozen || readOnly;

    if (readOnly) {
      let displayValue: string;

      if (
        property.type === EPropertyType.CREATED_TIME ||
        property.type === EPropertyType.LAST_EDITED_TIME
      ) {
        let dateValue: Date | null = null;

        if (value) {
          if (typeof value === "object" && "getTime" in value) {
            dateValue = value as Date;
          } else if (typeof value === "string") {
            const parsed = new Date(value);
            if (!isNaN(parsed.getTime())) {
              dateValue = parsed;
            }
          }
        }

        displayValue = formatLastEditedTime(dateValue);
      } else {
        displayValue = String(value || "");
      }

      return (
        <div className="w-full p-1 min-h-[24px] flex items-center text-sm text-muted-foreground">
          {displayValue}
        </div>
      );
    }

    switch (property.type) {
      case EPropertyType.CHECKBOX:
        return (
          <div className="flex items-center">
            <Checkbox
              checked={getBooleanValue(editValue)}
              onCheckedChange={(checked) => {
                handleValueChange(checked);
              }}
              disabled={disabled}
            />
          </div>
        );

      case EPropertyType.SELECT:
        return (
          <div className="w-full">
            <EditableSelect
              property={property}
              value={getStringValue(editValue)}
              onChange={(newValue) => handleValueChange(newValue)}
              databaseId={database?.id || ""}
              disabled={disabled}
            />
          </div>
        );

      case EPropertyType.MULTI_SELECT:
        return (
          <div className="w-full">
            <EditableMultiSelect
              property={property}
              value={currentSelectedValues}
              onChange={(newValues) => handleValueChange(newValues)}
              databaseId={database?.id || ""}
              disabled={disabled}
            />
          </div>
        );

      case EPropertyType.DATE: {
        const dateValue = getDateValue(editValue);
        return (
          <div className="w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "h-8 w-full justify-start text-left font-normal border-0 shadow-none bg-transparent dark:bg-transparent hover:bg-transparent dark:hover:bg-transparent cursor-pointer",
                    !dateValue && "text-muted-foreground"
                  )}
                >
                  {dateValue ? formatDateForDisplay(dateValue) : ""}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 border shadow-lg"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dateValue}
                  onSelect={(date) => {
                    handleValueChange(date ? date.toISOString() : null);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        );
      }

      case EPropertyType.EMAIL:
      case EPropertyType.URL:
      case EPropertyType.PHONE:
        return (
          <div className="w-full">
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
              disabled={disabled}
              className="h-auto min-h-[24px] border-0 shadow-none focus:ring-0 focus:ring-offset-0 bg-transparent text-sm dark:bg-transparent focus-visible:ring-0 w-full"
              autoFocus
            />
          </div>
        );

      case EPropertyType.NUMBER:
        return (
          <div className="w-full">
            <Input
              type="number"
              value={getNumberValue(editValue)}
              onChange={(e) =>
                handleValueChange(
                  e.target.value ? Number(e.target.value) : null
                )
              }
              disabled={disabled}
              className="h-auto min-h-[24px] border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm font-medium dark:bg-transparent"
              autoFocus
            />
          </div>
        );

      default:
        return (
          <div className="w-full flex items-start justify-start">
            <Textarea
              ref={textareaRef}
              value={getStringValue(editValue)}
              onChange={(e) => handleValueChange(e.target.value)}
              disabled={disabled}
              className="w-full h-auto min-h-full border-0 shadow-none focus:ring-0 focus:ring-offset-0 bg-transparent dark:bg-transparent text-sm resize-none overflow-hidden focus-visible:ring-0 leading-relaxed min-w-0"
              placeholder=""
              autoFocus
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.max(24, target.scrollHeight) + "px";
              }}
            />
          </div>
        );
    }
  };
  return renderEditableContent();
}
