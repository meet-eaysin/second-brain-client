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
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Copy,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { DatabaseProperty, PropertyType } from "@/types/document.types.ts";

interface PropertyHeaderMenuProps {
  property: DatabaseProperty;
  onEditName: (newName: string) => void;
  onChangeType: (newType: PropertyType) => void;
  onFilter: (property: DatabaseProperty) => void;
  onSort: (property: DatabaseProperty, direction: "asc" | "desc") => void;
  onFreeze: (property: DatabaseProperty) => void;
  onHide: (property: DatabaseProperty) => void;
  onInsertLeft: (property: DatabaseProperty) => void;
  onInsertRight: (property: DatabaseProperty) => void;
  onDuplicate: (property: DatabaseProperty) => void;
  onDelete: (property: DatabaseProperty) => void;
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
  children,
}: PropertyHeaderMenuProps) {
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [newName, setNewName] = useState(property.name);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const handleEditName = () => {
    if (newName.trim() && newName !== property.name) {
      onEditName(newName.trim());
      toast.success("Property name updated");
    }
    setIsEditNameOpen(false);
  };

  const handleChangeType = (newType: PropertyType) => {
    if (newType !== property.type) {
      onChangeType(newType);
      toast.success(
        `Property type changed to ${
          PROPERTY_TYPES.find((t) => t.value === newType)?.label
        }`
      );
    }
  };

  const handleDelete = () => {
    onDelete(property);
    setIsDeleteConfirmOpen(false);
    toast.success("Property deleted");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56" sideOffset={2}>
          <DropdownMenuItem onClick={() => setIsEditNameOpen(true)}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Name
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Type className="me-4 h-4 w-4" />
              Change Type
              <Badge variant="outline" className="ml-auto text-xs">
                {PROPERTY_TYPES.find((t) => t.value === property.type)?.label}
              </Badge>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {PROPERTY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = property.type === type.value;
                return (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => handleChangeType(type.value)}
                    disabled={isSelected}
                    className={isSelected ? "bg-muted" : ""}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {type.label}
                    {isSelected && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Current
                      </Badge>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onFilter(property)}>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onSort(property, "asc")}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSort(property, "desc")}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Descending
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onFreeze(property)}>
            <Lock className="mr-2 h-4 w-4" />
            Freeze Column
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onHide(property)}>
            <EyeOff className="mr-2 h-4 w-4" />
            Hide Column
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onInsertLeft(property)}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Insert Left
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onInsertRight(property)}>
            <ChevronRight className="mr-2 h-4 w-4" />
            Insert Right
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => onDuplicate(property)}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
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
            <Button variant="outline" onClick={() => setIsEditNameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditName} disabled={!newName.trim()}>
              Save Changes
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
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Property
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
