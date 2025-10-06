import { useState } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { TProperty } from "@/modules/database-view/types";
import { useUpdateProperty } from "@/modules/database-view/services/database-queries";

interface EditableMultiSelectProps {
  property: TProperty;
  value: string[];
  onChange: (value: string[]) => void;
  databaseId: string;
  disabled?: boolean;
}

const colors = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#6b7280", // gray
];

export function EditableMultiSelect({
  property,
  value,
  onChange,
  databaseId,
  disabled = false,
}: EditableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const updatePropertyMutation = useUpdateProperty();

  const options = property.config?.options || [];
  const selectedOptions = options.filter((option) => value.includes(option.id));

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  const shouldShowCreate =
    searchValue.trim() &&
    !filteredOptions.some(
      (option) => option.label.toLowerCase() === searchValue.toLowerCase()
    );

  const handleCreateOption = async () => {
    if (!searchValue.trim()) return;

    const newOption = {
      value: searchValue.trim(),
      label: searchValue.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      description: "",
    } as const;

    try {
      await updatePropertyMutation.mutateAsync({
        databaseId,
        propertyId: property.id,
        data: {
          selectOptions: [
            ...options,
            {
              id: `temp-${Date.now()}`,
              label: newOption.label,
              value: newOption.value,
              color: newOption.color ?? "#6b7280",
              description: newOption.description || "",
            },
          ],
        },
      });

      // After creating, select it
      onChange([...value, newOption.value]);
      setSearchValue("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create option:", error);
    }
  };

  const handleSelect = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter((id) => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const handleRemove = (optionId: string) => {
    onChange(value.filter((id) => id !== optionId));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-start h-auto min-h-[32px] border shadow-sm bg-background hover:bg-muted/50 focus:ring-1 focus:ring-ring focus:ring-offset-0 px-2 py-1 text-sm dark:bg-background dark:hover:bg-muted/50 transition-colors min-w-0",
            selectedOptions.length === 0 && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-1 flex-wrap min-w-0">
            {selectedOptions.length > 0 ? (
              <>
                {selectedOptions.slice(0, 3).map((option) => (
                  <Badge
                    key={option.id}
                    variant="outline"
                    className="text-xs border px-2 py-1 h-6 font-medium rounded-md shadow-sm"
                    style={{
                      backgroundColor: option.color + "15",
                      color: option.color,
                      borderColor: option.color + "40",
                    }}
                  >
                    {option.label}
                    <button
                      type="button"
                      className="ml-1.5 h-3 w-3 rounded-full hover:bg-black/20 flex items-center justify-center p-0.5 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(option.id);
                      }}
                      aria-label={`Remove ${option.label}`}
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </Badge>
                ))}
                {selectedOptions.length > 3 && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-1 h-6 font-medium"
                  >
                    +{selectedOptions.length - 3}
                  </Badge>
                )}
              </>
            ) : (
              <span>Select options...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[280px] p-0 border shadow-lg" align="start" side="bottom">
        <Command>
          <CommandInput
             placeholder="Search or create options..."
             value={searchValue}
             onValueChange={setSearchValue}
             className="border-b focus:ring-0"
           />
          <CommandList className="max-h-[200px]">
            <CommandEmpty>
              {shouldShowCreate ? (
                <CommandItem
                  onSelect={handleCreateOption}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="font-medium">Create "{searchValue}"</span>
                </CommandItem>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No options found.
                </div>
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => handleSelect(option.id)}
                  className="cursor-pointer py-2.5"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      {option.color && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="truncate font-medium">
                        {option.label}
                      </span>
                    </div>
                    {value.includes(option.id) && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
