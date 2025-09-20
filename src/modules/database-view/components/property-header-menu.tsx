import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit3,
  Type,
  Hash,
  Mail,
  Link,
  Phone,
  CheckSquare,
  Calendar,
  List,
  Tags,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { DocumentProperty, PropertyType } from "@/modules/database-view";
import {
  canEditProperty,
  canHideProperty,
  canDeleteProperty,
  type ViewFrozenConfig,
} from "./columns.tsx";

interface PropertyHeaderMenuProps {
  property: DocumentProperty;
  frozenConfig?: ViewFrozenConfig | null;
  disablePropertyManagement?: boolean;
  moduleType?: string;
  onEditName?: (property: DocumentProperty, newName: string) => void;
  onChangeType?: (property: DocumentProperty, newType: PropertyType) => void;
  onFilter?: (property: DocumentProperty) => void;
  onSort?: (property: DocumentProperty, direction: "asc" | "desc") => void;
  onFreeze?: (property: DocumentProperty) => void;
  onHide?: (property: DocumentProperty) => void;
  onInsertLeft?: (property: DocumentProperty) => void;
  onInsertRight?: (property: DocumentProperty) => void;
  onDuplicate?: (property: DocumentProperty) => void;
  onDelete?: (property: DocumentProperty) => void;
  onRefresh?: () => void;
  children: React.ReactNode;
}

const PROPERTY_TYPES = [
  { value: "TEXT", label: "Text", icon: Type },
  { value: "NUMBER", label: "Number", icon: Hash },
  { value: "EMAIL", label: "Email", icon: Mail },
  { value: "URL", label: "URL", icon: Link },
  { value: "PHONE", label: "Phone", icon: Phone },
  { value: "CHECKBOX", label: "Checkbox", icon: CheckSquare },
  { value: "DATE", label: "Date", icon: Calendar },
  { value: "SELECT", label: "Select", icon: List },
  { value: "MULTI_SELECT", label: "Multi-select", icon: Tags },
] as const;

export function PropertyHeaderMenu({
  property,
  frozenConfig,
  disablePropertyManagement = false,
  onEditName,
  onChangeType,
  onFilter,
  onSort,
  onFreeze,
  onHide,
  onInsertLeft,
  onInsertRight,
  onDuplicate,
  onDelete,
  onRefresh,
  children,
}: PropertyHeaderMenuProps) {
  const frozenProp = frozenConfig?.frozenProperties?.find(
    (fp) => fp.propertyId === property.id
  );
  const isFrozen = frozenProp !== undefined;
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [newName, setNewName] = useState(property.name);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canEdit = canEditProperty(property.id, frozenConfig);
  const canHide = canHideProperty(property.id, frozenConfig);
  const canDelete = canDeleteProperty(property.id, frozenConfig);

  const handleEditName = async () => {
    if (newName.trim() && newName !== property.name) {
      // Simple validation for property name
      if (newName.trim().length < 1) {
        toast.error("Property name cannot be empty");
        return;
      }
      if (newName.trim().length > 100) {
        toast.error("Property name cannot be longer than 100 characters");
        return;
      }

      setIsLoading(true);
      try {
        onEditName?.(property, newName.trim());
        onRefresh?.();
        toast.success("Property name updated");
      } catch (error) {
        console.error("Failed to update property name:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update property name";
        toast.error(`Failed to update property name: ${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    }
    setIsEditNameOpen(false);
  };

  const handleFreeze = async () => {
    setIsLoading(true);
    try {
      onFreeze?.(property);
      onRefresh?.();
      toast.success(isFrozen ? "Property unfrozen" : "Property frozen");
    } catch (error) {
      console.error("Failed to freeze/unfreeze property:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update freeze status";
      toast.error(`Failed to update freeze status: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeType = async (newType: PropertyType) => {
    if (newType !== property.type) {
      // Simple validation for property type
      const validTypes = [
        "TEXT",
        "NUMBER",
        "DATE",
        "CHECKBOX",
        "SELECT",
        "MULTI_SELECT",
        "URL",
        "EMAIL",
        "PHONE",
      ];
      if (!validTypes.includes(newType)) {
        toast.error("Invalid property type");
        return;
      }

      // Simple conversion validation (can be expanded later)
      const convertibleTypes = {
        TEXT: ["TEXT", "NUMBER", "URL", "EMAIL", "PHONE"],
        NUMBER: ["TEXT", "NUMBER"],
        DATE: ["TEXT", "DATE"],
        CHECKBOX: ["TEXT", "CHECKBOX"],
        SELECT: ["TEXT", "SELECT", "MULTI_SELECT"],
        MULTI_SELECT: ["TEXT", "MULTI_SELECT"],
        URL: ["TEXT", "URL"],
        EMAIL: ["TEXT", "EMAIL"],
        PHONE: ["TEXT", "PHONE"],
      };

      if (!convertibleTypes[property.type]?.includes(newType)) {
        const typeLabels = {
          TEXT: "Text",
          NUMBER: "Number",
          DATE: "Date",
          CHECKBOX: "Checkbox",
          SELECT: "Select",
          MULTI_SELECT: "Multi-select",
          URL: "URL",
          EMAIL: "Email",
          PHONE: "Phone",
        };
        toast.error(
          `Cannot convert from ${typeLabels[property.type]} to ${
            typeLabels[newType]
          }`
        );
        return;
      }

      setIsLoading(true);
      try {
        onChangeType?.(property, newType);
        onRefresh?.();
        const typeLabels = {
          TEXT: "Text",
          NUMBER: "Number",
          DATE: "Date",
          CHECKBOX: "Checkbox",
          SELECT: "Select",
          MULTI_SELECT: "Multi-select",
          URL: "URL",
          EMAIL: "Email",
          PHONE: "Phone",
        };
        toast.success(`Property type changed to ${typeLabels[newType]}`);
      } catch (error) {
        console.error("Failed to update property type:", error);
        toast.error("Failed to update property type");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      onDelete?.(property);
      onRefresh?.();
      toast.success("Property deleted");
    } catch (error) {
      console.error("Failed to delete property:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete property";
      toast.error(`Failed to delete property: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
    setIsDeleteConfirmOpen(false);
  };

  const handleDuplicate = async () => {
    setIsLoading(true);
    try {
      onDuplicate?.(property);
      onRefresh?.();
      toast.success("Property duplicated");
    } catch (error) {
      console.error("Failed to duplicate property:", error);
      toast.error("Failed to duplicate property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertLeft = async () => {
    if (disablePropertyManagement) {
      toast.error("Property management is disabled for this module");
      return;
    }

    setIsLoading(true);
    try {
      onInsertLeft?.(property);
      onRefresh?.();
      toast.success("Property inserted");
    } catch (error) {
      console.error("Failed to insert property:", error);
      toast.error("Failed to insert property");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertRight = async () => {
    if (disablePropertyManagement) {
      toast.error("Property management is disabled for this module");
      return;
    }

    setIsLoading(true);
    try {
      onInsertRight?.(property);
      onRefresh?.();
      toast.success("Property inserted");
    } catch (error) {
      console.error("Failed to insert property:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to insert property";
      toast.error(`Failed to insert property: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56" sideOffset={2}>
          {onEditName && (
            <DropdownMenuItem
              onClick={() => setIsEditNameOpen(true)}
              disabled={!canEdit}
            >
              <Edit3 className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Edit Name</span>
              {!canEdit && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Protected
                </span>
              )}
            </DropdownMenuItem>
          )}

          {onChangeType && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!canEdit}>
                <Type className="mr-4 h-4 w-4 flex-shrink-0" />
                <span className="flex-1">Change Type</span>
                <Badge variant="outline" className="ml-2 text-xs">
                  {PROPERTY_TYPES.find((t) => t.value === property.type)?.label}
                </Badge>
                {!canEdit && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Protected
                  </span>
                )}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {PROPERTY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = property.type === type.value;
                  return (
                    <DropdownMenuItem
                      key={type.value}
                      onClick={() => handleChangeType(type.value)}
                      disabled={isSelected || isLoading}
                      className={isSelected ? "bg-muted" : ""}
                    >
                      <Icon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{type.label}</span>
                      {isSelected && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Current
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}

          {(onFilter || onSort) && <DropdownMenuSeparator />}

          {onFilter && (
            <DropdownMenuItem onClick={() => onFilter(property)}>
              <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Filter</span>
            </DropdownMenuItem>
          )}

          {onSort && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <ArrowUpDown className="mr-4 h-4 w-4 flex-shrink-0" />
                <span>Sort</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => onSort(property, "asc")}>
                  <ArrowUp className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>Ascending</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort(property, "desc")}>
                  <ArrowDown className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>Descending</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}

          {(onFreeze ||
            onHide ||
            onInsertLeft ||
            onInsertRight ||
            onDuplicate ||
            onDelete) && <DropdownMenuSeparator />}

          {onFreeze && (
            <DropdownMenuItem onClick={handleFreeze} disabled={isLoading}>
              {isFrozen ? (
                <>
                  <Unlock className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>Unfreeze Column</span>
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span>Freeze Column</span>
                </>
              )}
            </DropdownMenuItem>
          )}

          {onHide && (
            <DropdownMenuItem
              onClick={() => onHide(property)}
              disabled={!canHide}
            >
              <EyeOff className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Hide Column</span>
              {!canHide && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Protected
                </span>
              )}
            </DropdownMenuItem>
          )}

          {onInsertLeft && (
            <DropdownMenuItem onClick={handleInsertLeft} disabled={isLoading}>
              <ChevronLeft className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Insert Left</span>
            </DropdownMenuItem>
          )}

          {onInsertRight && (
            <DropdownMenuItem onClick={handleInsertRight} disabled={isLoading}>
              <ChevronRight className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Insert Right</span>
            </DropdownMenuItem>
          )}

          {onDuplicate && (
            <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
              <Copy className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Duplicate</span>
            </DropdownMenuItem>
          )}

          {onDelete && (
            <DropdownMenuItem
              onClick={() => setIsDeleteConfirmOpen(true)}
              disabled={!canDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Delete</span>
              {!canDelete && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Protected
                </span>
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Property Name</DialogTitle>
            <DialogDescription>
              Change the name of this property. This will update the column
              header.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Property Name</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter property name..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleEditName();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditNameOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditName}
              disabled={!newName.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the "{property.name}" property?
              This will permanently remove the column and all its data from all
              records.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
