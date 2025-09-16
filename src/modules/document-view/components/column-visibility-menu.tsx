import React from "react";
import { Eye, EyeOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DocumentProperty {
  id: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  frozen?: boolean;
  visible?: boolean;
  order?: number;
}

interface DocumentView {
  id: string;
  name: string;
  visibleProperties?: string[];
  isDefault?: boolean;
}

interface ColumnVisibilityMenuProps {
  properties: DocumentProperty[];
  currentView: DocumentView;
  onToggleProperty: (propertyId: string, visible: boolean) => Promise<void>;
  onShowAll: () => Promise<void>;
  onHideAll: () => Promise<void>;
  disabled?: boolean;
}

export function ColumnVisibilityMenu({
  properties,
  currentView,
  onToggleProperty,
  onShowAll,
  onHideAll,
  disabled = false,
}: ColumnVisibilityMenuProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const visiblePropertyIds = currentView.visibleProperties || [];
  const visibleProperties = properties.filter((prop) =>
    visiblePropertyIds.includes(prop.id)
  );

  const hiddenProperties = properties.filter(
    (prop) => !visiblePropertyIds.includes(prop.id)
  );

  const canHideProperty = (property: DocumentProperty): boolean =>
    !property.frozen && !property.required;

  const handleToggleProperty = async (
    propertyId: string,
    currentlyVisible: boolean
  ) => {
    if (isLoading) return;

    const property = properties.find((p) => p.id === propertyId);
    if (!property) return;

    if (currentlyVisible && !canHideProperty(property)) {
      toast.error(`Cannot hide ${property.name} - it's a required property`);
      return;
    }

    setIsLoading(true);

    try {
      await onToggleProperty(propertyId, !currentlyVisible);
      toast.success(
        `${property.name} ${currentlyVisible ? "hidden" : "shown"}`
      );
    } catch (error) {
      console.log(error);

      toast.error(
        `Failed to ${currentlyVisible ? "hide" : "show"} ${property.name}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAll = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await onShowAll();
      toast.success("All properties are now visible");
    } catch (error) {
      console.log(error);

      toast.error("Failed to show all properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHideAll = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onHideAll();
      toast.success("Non-required properties hidden");
    } catch (error) {
      console.log(error);

      toast.error("Failed to hide properties");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || isLoading}
          className="h-8"
        >
          <Eye className="h-4 w-4" />
          <Badge variant="secondary" className="ml-1">
            {visibleProperties.length}/{properties.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Show/Hide Columns</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowAll}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              <Eye className="h-3 w-3 mr-1" />
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHideAll}
              disabled={isLoading}
              className="h-6 px-2 text-xs"
            >
              <EyeOff className="h-3 w-3 mr-1" />
              Min
            </Button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {visibleProperties.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Visible ({visibleProperties.length})
            </DropdownMenuLabel>
            {visibleProperties.map((property) => (
              <DropdownMenuCheckboxItem
                key={property.id}
                checked={true}
                onCheckedChange={() => handleToggleProperty(property.id, true)}
                disabled={isLoading || !canHideProperty(property)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <span>{property.name}</span>
                </div>
                {(property.frozen || property.required) && (
                  <Badge variant="outline" className="text-xs">
                    {property.frozen ? "Frozen" : "Required"}
                  </Badge>
                )}
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}

        {hiddenProperties.length > 0 && (
          <>
            {visibleProperties.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Hidden ({hiddenProperties.length})
            </DropdownMenuLabel>
            {hiddenProperties.map((property) => (
              <DropdownMenuCheckboxItem
                key={property.id}
                checked={false}
                onCheckedChange={() => handleToggleProperty(property.id, false)}
                disabled={isLoading}
                className="flex items-center justify-between opacity-60"
              >
                <div className="flex items-center">
                  <X className="h-3 w-3 mr-2 text-gray-400" />
                  <span>{property.name}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </>
        )}

        {properties.length === 0 && (
          <DropdownMenuItem disabled>No properties available</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
