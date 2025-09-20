import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  X,
  Settings,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  List,
  Tags,
  Mail,
  Link,
  Phone,
} from "lucide-react";
import type { DocumentProperty } from "@/modules/database-view";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  properties?: DocumentProperty[];
  className?: string;
  showPropertySelector?: boolean;
}

const PROPERTY_TYPE_ICONS = {
  TEXT: Type,
  NUMBER: Hash,
  EMAIL: Mail,
  URL: Link,
  PHONE: Phone,
  DATE: Calendar,
  CHECKBOX: CheckSquare,
  SELECT: List,
  MULTI_SELECT: Tags,
} as const;

export function SearchBar({
  value,
  onChange,
  placeholder = "Search records...",
  properties = [],
  className = "",
  showPropertySelector = false,
}: SearchBarProps) {
  const [searchProperty, setSearchProperty] = useState<string>("all");

  const handleClear = () => {
    onChange("");
  };

  const handlePropertySearch = (propertyId: string) =>
    setSearchProperty(propertyId);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />

        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {showPropertySelector && properties.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <Settings className="h-4 w-4 mr-2" />
              {searchProperty === "all"
                ? "All Fields"
                : properties.find((p) => p.id === searchProperty)?.name ||
                  "All Fields"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Search in</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlePropertySearch("all")}
              className={searchProperty === "all" ? "bg-muted" : ""}
            >
              <Search className="h-4 w-4 mr-2" />
              All Fields
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {properties.map((property) => {
              const IconComponent = PROPERTY_TYPE_ICONS[property.type] || Type;
              return (
                <DropdownMenuItem
                  key={property.id}
                  onClick={() => handlePropertySearch(property.id)}
                  className={searchProperty === property.id ? "bg-muted" : ""}
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {property.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
