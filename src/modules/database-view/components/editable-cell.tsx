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

interface EditableCellProps {
  record: TRecord;
  property: TProperty;
  value: TPropertyValue;
}

export function EditableCell({ record, property, value }: EditableCellProps) {
  const { database } = useDatabaseView();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<TPropertyValue>(value);
  const [glimpseData, setGlimpseData] = useState<{title: string | null, description: string | null, image: string | null} | null>(null);

  const currentSelectedValues = getMultiSelectValues(editValue);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    const urlValue = getStringValue(value);
    if (urlValue && urlValue.startsWith('http')) {
      apiClient.get(`/search/glimpse?url=${encodeURIComponent(urlValue)}`)
        .then(response => {
          setGlimpseData(response.data.data);
        })
        .catch(() => setGlimpseData(null));
    } else {
      setGlimpseData(null);
    }
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
              : property.type === EPropertyType.URL
              ? "cursor-pointer transition-colors"
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

      case EPropertyType.MULTI_SELECT: {
        const handleRemove = (value: string) => {
          const newValues = currentSelectedValues.filter(id => id !== value);
          handleSave(newValues);
        };
        const handleSelect = (value: string) => {
          const newValues = currentSelectedValues.includes(value)
            ? currentSelectedValues.filter(id => id !== value)
            : [...currentSelectedValues, value];
          handleSave(newValues);
        };
        return (
          <Tags
            open={isEditing}
            onOpenChange={(open) => setIsEditing(open)}
            className="max-w-[250px]"
          >
            <TagsTrigger>
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
              <TagsList>
                <TagsEmpty />
                <TagsGroup>
                  {property.config?.options?.map((option) => (
                    <TagsItem key={option.id} onSelect={() => handleSelect(option.id)} value={option.id}>
                      <div className="flex items-center space-x-2">
                        {option.color && (
                          <div
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: option.color }}
                          />
                        )}
                        <span>{option.label}</span>
                        {currentSelectedValues.includes(option.id) && (
                          <CheckIcon className="text-muted-foreground" size={14} />
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
          <Glimpse>
            <GlimpseTrigger asChild>
              <span className="hover:underline cursor-pointer">
                {urlValue}
              </span>
            </GlimpseTrigger>
            <GlimpseContent
              className="w-80 cursor-pointer"
              side="bottom"
              onClick={() => window.open(urlValue, '_blank')}
            >
              {glimpseData ? (
                <>
                  {glimpseData.image && <GlimpseImage src={glimpseData.image} />}
                  {glimpseData.title && <GlimpseTitle>{glimpseData.title}</GlimpseTitle>}
                  {glimpseData.description && <GlimpseDescription>{glimpseData.description}</GlimpseDescription>}
                </>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Click to visit this URL</p>
                </div>
              )}
            </GlimpseContent>
          </Glimpse>
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
