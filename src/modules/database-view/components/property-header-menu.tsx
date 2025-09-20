import { type ReactNode, useState, useEffect } from "react";
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
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  EPropertyType,
  EFilterOperator,
  type TProperty,
} from "@/modules/database-view/types";
import { useDatabaseView } from "@/modules/database-view/context";
import {
  useUpdateProperty,
  useDeleteProperty,
  useDuplicateProperty,
  useChangePropertyType,
} from "@/modules/database-view/services/database-queries";

interface PropertyHeaderMenuProps {
  children: ReactNode;
  property: TProperty;
}

const PROPERTY_TYPES = [
  { value: EPropertyType.TEXT, label: "Text", icon: Type },
  { value: EPropertyType.NUMBER, label: "Number", icon: Hash },
  { value: EPropertyType.EMAIL, label: "Email", icon: Mail },
  { value: EPropertyType.URL, label: "URL", icon: Link },
  { value: EPropertyType.PHONE, label: "Phone", icon: Phone },
  { value: EPropertyType.CHECKBOX, label: "Checkbox", icon: CheckSquare },
  { value: EPropertyType.DATE, label: "Date", icon: Calendar },
  { value: EPropertyType.SELECT, label: "Select", icon: List },
  { value: EPropertyType.MULTI_SELECT, label: "Multi-select", icon: Tags },
] as const;

export const PropertyHeaderMenu = ({
  children,
  property,
}: PropertyHeaderMenuProps) => {
  const { database, onFiltersChange, onSortsChange } = useDatabaseView();

  // API hooks
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();
  const duplicatePropertyMutation = useDuplicateProperty();
  const changePropertyTypeMutation = useChangePropertyType();

  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [newName, setNewName] = useState(property.name);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Check if any mutation is pending
  const isLoading =
    updatePropertyMutation.isPending ||
    deletePropertyMutation.isPending ||
    duplicatePropertyMutation.isPending ||
    changePropertyTypeMutation.isPending;

  // Update newName when property changes
  useEffect(() => {
    setNewName(property.name);
  }, [property.name]);

  // For now, assume no frozen properties - can be enhanced later
  const canEdit = true;
  const canDelete = true;

  const handleEditName = async () => {
    if (!database?.id) {
      toast.error("Database not found");
      return;
    }

    if (newName.trim() && newName !== property.name) {
      if (newName.trim().length < 1) {
        toast.error("Property name cannot be empty");
        return;
      }
      if (newName.trim().length > 100) {
        toast.error("Property name cannot be longer than 100 characters");
        return;
      }

      try {
        await updatePropertyMutation.mutateAsync({
          databaseId: database.id,
          propertyId: property.id,
          data: { name: newName.trim() },
        });
        toast.success("Property name updated");
        setIsEditNameOpen(false);
      } catch (error) {
        console.error("Failed to update property name:", error);
        toast.error("Failed to update property name");
      }
    } else {
      setIsEditNameOpen(false);
    }
  };

  const handleChangeType = async (newType: EPropertyType) => {
    if (!database?.id) {
      toast.error("Database not found");
      return;
    }

    if (newType !== property.type) {
      // Simple conversion validation (can be expanded later)
      const convertibleTypes: Record<EPropertyType, EPropertyType[]> = {
        [EPropertyType.TEXT]: [
          EPropertyType.TEXT,
          EPropertyType.NUMBER,
          EPropertyType.URL,
          EPropertyType.EMAIL,
          EPropertyType.PHONE,
        ],
        [EPropertyType.NUMBER]: [EPropertyType.TEXT, EPropertyType.NUMBER],
        [EPropertyType.DATE]: [EPropertyType.TEXT, EPropertyType.DATE],
        [EPropertyType.CHECKBOX]: [EPropertyType.TEXT, EPropertyType.CHECKBOX],
        [EPropertyType.SELECT]: [
          EPropertyType.TEXT,
          EPropertyType.SELECT,
          EPropertyType.MULTI_SELECT,
        ],
        [EPropertyType.MULTI_SELECT]: [
          EPropertyType.TEXT,
          EPropertyType.MULTI_SELECT,
        ],
        [EPropertyType.URL]: [EPropertyType.TEXT, EPropertyType.URL],
        [EPropertyType.EMAIL]: [EPropertyType.TEXT, EPropertyType.EMAIL],
        [EPropertyType.PHONE]: [EPropertyType.TEXT, EPropertyType.PHONE],
        [EPropertyType.RICH_TEXT]: [
          EPropertyType.TEXT,
          EPropertyType.RICH_TEXT,
        ],
        [EPropertyType.FILE]: [EPropertyType.FILE],
        [EPropertyType.RELATION]: [EPropertyType.RELATION],
        [EPropertyType.ROLLUP]: [EPropertyType.ROLLUP],
        [EPropertyType.FORMULA]: [EPropertyType.FORMULA],
        [EPropertyType.CREATED_TIME]: [EPropertyType.CREATED_TIME],
        [EPropertyType.LAST_EDITED_TIME]: [EPropertyType.LAST_EDITED_TIME],
        [EPropertyType.CREATED_BY]: [EPropertyType.CREATED_BY],
        [EPropertyType.LAST_EDITED_BY]: [EPropertyType.LAST_EDITED_BY],
        [EPropertyType.MOOD_SCALE]: [EPropertyType.MOOD_SCALE],
        [EPropertyType.FREQUENCY]: [EPropertyType.FREQUENCY],
        [EPropertyType.CONTENT_TYPE]: [EPropertyType.CONTENT_TYPE],
        [EPropertyType.FINANCE_TYPE]: [EPropertyType.FINANCE_TYPE],
        [EPropertyType.FINANCE_CATEGORY]: [EPropertyType.FINANCE_CATEGORY],
        [EPropertyType.FILES]: [EPropertyType.FILES],
        [EPropertyType.LOOKUP]: [EPropertyType.LOOKUP],
        [EPropertyType.PERCENT]: [EPropertyType.PERCENT],
        [EPropertyType.CURRENCY]: [EPropertyType.CURRENCY],
        [EPropertyType.STATUS]: [EPropertyType.STATUS],
        [EPropertyType.PRIORITY]: [EPropertyType.PRIORITY],
      };

      if (!convertibleTypes[property.type]?.includes(newType)) {
        const typeLabels: Record<EPropertyType, string> = {
          [EPropertyType.TEXT]: "Text",
          [EPropertyType.NUMBER]: "Number",
          [EPropertyType.DATE]: "Date",
          [EPropertyType.CHECKBOX]: "Checkbox",
          [EPropertyType.SELECT]: "Select",
          [EPropertyType.MULTI_SELECT]: "Multi-select",
          [EPropertyType.URL]: "URL",
          [EPropertyType.EMAIL]: "Email",
          [EPropertyType.PHONE]: "Phone",
          [EPropertyType.RICH_TEXT]: "Rich Text",
          [EPropertyType.FILE]: "File",
          [EPropertyType.RELATION]: "Relation",
          [EPropertyType.ROLLUP]: "Rollup",
          [EPropertyType.FORMULA]: "Formula",
          [EPropertyType.CREATED_TIME]: "Created Time",
          [EPropertyType.LAST_EDITED_TIME]: "Last Edited Time",
          [EPropertyType.CREATED_BY]: "Created By",
          [EPropertyType.LAST_EDITED_BY]: "Last Edited By",
          [EPropertyType.MOOD_SCALE]: "Mood Scale",
          [EPropertyType.FREQUENCY]: "Frequency",
          [EPropertyType.CONTENT_TYPE]: "Content Type",
          [EPropertyType.FINANCE_TYPE]: "Finance Type",
          [EPropertyType.FINANCE_CATEGORY]: "Finance Category",
          [EPropertyType.FILES]: "Files",
          [EPropertyType.LOOKUP]: "Lookup",
          [EPropertyType.PERCENT]: "Percent",
          [EPropertyType.CURRENCY]: "Currency",
          [EPropertyType.STATUS]: "Status",
          [EPropertyType.PRIORITY]: "Priority",
        };
        toast.error(
          `Cannot convert from ${typeLabels[property.type]} to ${
            typeLabels[newType]
          }`
        );
        return;
      }

      try {
        await changePropertyTypeMutation.mutateAsync({
          databaseId: database.id,
          propertyId: property.id,
          type: newType,
        });
        toast.success(
          `Property type changed to ${
            PROPERTY_TYPES.find((t) => t.value === newType)?.label
          }`
        );
      } catch (error) {
        console.error("Failed to update property type:", error);
        toast.error("Failed to update property type");
      }
    }
  };

  const handleDelete = async () => {
    if (!database?.id) {
      toast.error("Database not found");
      return;
    }

    try {
      await deletePropertyMutation.mutateAsync({
        databaseId: database.id,
        propertyId: property.id,
      });
      toast.success("Property deleted");
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleDuplicate = async () => {
    if (!database?.id) {
      toast.error("Database not found");
      return;
    }

    try {
      await duplicatePropertyMutation.mutateAsync({
        databaseId: database.id,
        propertyId: property.id,
        name: `${property.name} (Copy)`,
      });
      toast.success("Property duplicated");
    } catch (error) {
      console.error("Failed to duplicate property:", error);
      toast.error("Failed to duplicate property");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56" sideOffset={2}>
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
                    disabled={
                      isSelected ||
                      updatePropertyMutation.isPending ||
                      changePropertyTypeMutation.isPending
                    }
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

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() =>
              onFiltersChange([
                {
                  property: property.id,
                  condition: EFilterOperator.CONTAINS,
                  value: "",
                },
              ])
            }
          >
            <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>Filter by this property</span>
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowUpDown className="mr-4 h-4 w-4 flex-shrink-0" />
              <span>Sort</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() =>
                  onSortsChange([{ propertyId: property.id, direction: "asc" }])
                }
              >
                <ArrowUp className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Ascending</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onSortsChange([
                    { propertyId: property.id, direction: "desc" },
                  ])
                }
              >
                <ArrowDown className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>Descending</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleDuplicate}
            disabled={duplicatePropertyMutation.isPending}
          >
            <Copy className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>Duplicate</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsDeleteConfirmOpen(true)}
            disabled={!canDelete || deletePropertyMutation.isPending}
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
};
