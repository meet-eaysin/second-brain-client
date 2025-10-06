import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface EditableSelectProps {
  property: TProperty;
  value: string | null;
  onChange: (value: string) => void;
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

export function EditableSelect({
  property,
  value,
  onChange,
  databaseId,
  disabled = false,
}: EditableSelectProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const updatePropertyMutation = useUpdateProperty();

  const options = property.config?.options || [];
  const selectedOption = options.find((option) => option.id === value);

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
    };

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
              color: newOption.color || "#6b7280",
              description: newOption.description,
            },
          ],
        },
      });

      // After creating, select it
      onChange(newOption.value);
      setSearchValue("");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create option:", error);
    }
  };

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setOpen(false);
    setSearchValue("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-8 border shadow-sm bg-background hover:bg-muted/50 focus:ring-1 focus:ring-ring focus:ring-offset-0 px-2 text-sm dark:bg-background dark:hover:bg-muted/50 transition-colors min-w-0"
          disabled={disabled}
        >
          {selectedOption ? (
            <div className="flex items-center space-x-2">
              {selectedOption.color && (
                <div
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: selectedOption.color }}
                />
              )}
              <span className="truncate">{selectedOption.label}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">Select option...</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[200px] p-0 border shadow-lg" align="start">
        <Command>
          <CommandInput
            placeholder="Search options..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {shouldShowCreate ? (
                <CommandItem onSelect={handleCreateOption}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create "{searchValue}"
                </CommandItem>
              ) : (
                "No options found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.id}
                  onSelect={() => handleSelect(option.id)}
                >
                  <div className="flex items-center space-x-2 w-full">
                    {option.color && (
                      <div
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: option.color }}
                      />
                    )}
                    <span className="flex-1">{option.label}</span>
                    {value === option.id && <Check className="h-4 w-4" />}
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
