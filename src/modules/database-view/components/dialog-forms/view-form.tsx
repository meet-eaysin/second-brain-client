import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  TableIcon,
  Columns,
  List,
  Grid,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import type {
    IDatabaseProperty,
    EViewType,
    ICreateViewRequest, IDatabaseView,
} from "../../types";
import { toast } from "sonner";

interface ViewFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties?: IDatabaseProperty[];
  view?: IDatabaseView | null; // For edit mode
  mode?: "create" | "edit";
  onSubmit?: (viewData: ICreateViewRequest) => Promise<void>;
}

const viewTypes: {
  value: EViewType;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    value: "table",
    label: "Table",
    icon: <TableIcon className="h-5 w-5" />,
    description: "Display records in rows and columns",
  },
  {
    value: "board",
    label: "Board",
    icon: <Columns className="h-5 w-5" />,
    description: "Group records by a select property",
  },
  {
    value: "gallery",
    label: "Gallery",
    icon: <Grid className="h-5 w-5" />,
    description: "Display records as cards in a grid",
  },
  {
    value: "list",
    label: "List",
    icon: <List className="h-5 w-5" />,
    description: "Show records in a simple list format",
  },
  {
    value: "CALENDAR",
    label: "Calendar",
    icon: <Calendar className="h-5 w-5" />,
    description: "Display records on a calendar (coming soon)",
  },
  {
    value: "TIMELINE",
    label: "Timeline",
    icon: <Clock className="h-5 w-5" />,
    description: "Show records on a timeline (coming soon)",
  },
];

export function ViewForm({
  open,
  onOpenChange,
  properties = [],
  view,
  mode = "create",
  onSubmit,
}: ViewFormProps) {
  const [formData, setFormData] = useState<ICreateViewRequest>({
    name: "Table",
    type: "TABLE",
    isDefault: false,
    visibleProperties: properties?.map((p) => p.id) || [],
    filters: [],
    sorts: [],
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && view) {
        setFormData({
          name: view.name,
          type: view.type,
          isDefault: view.isDefault,
          visibleProperties:
            view.settings.visibleProperties ||
            properties?.map((p) => p.id) ||
            [],
          filters: view.filters || [],
          sorts: view.sorts || [],
        });
      } else {
        // Reset to default for create mode
        setFormData({
          name: "Table",
          type: "TABLE",
          isDefault: false,
          visibleProperties: properties?.map((p) => p.id) || [],
          filters: [],
          sorts: [],
        });
      }
    }
  }, [open, properties, view, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter a view name");
      return;
    }

    if (!properties || properties.length === 0) {
      toast.error(
        "Cannot create view: No properties available. Please create some properties first."
      );
      return;
    }

    if (formData.visibleProperties && formData.visibleProperties.length === 0) {
      toast.error("Please select at least one property to display");
      return;
    }

    try {
      await onSubmit?.(formData);
      // Only close and reset form if submission was successful
      onOpenChange(false);

      // Reset form with default view type name
      setFormData({
        name: "Table", // Auto-fill with default view type
        type: "TABLE",
        isDefault: false,
        visibleProperties: properties?.map((p) => p.id) || [],
        filters: [],
        sorts: [],
      });
    } catch (error) {
      console.error("Failed to submit view:", error);
      // Don't close the dialog on error - let the user see the error and fix it
    }
  };

  const handlePropertyToggle = (propertyId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      visibleProperties: checked
        ? [...(prev.visibleProperties || []), propertyId]
        : (prev.visibleProperties || []).filter((id) => id !== propertyId),
    }));
  };

  const handleViewTypeChange = (newViewType: EViewType) => {
    const viewTypeLabel =
      viewTypes.find((vt) => vt.value === newViewType)?.label || newViewType;

    setFormData((prev) => {
      // Auto-fill name if it's empty or contains a previous view type name
      const shouldAutoFillName =
        !prev.name.trim() ||
        viewTypes.some(
          (vt) =>
            prev.name.toLowerCase() === vt.label.toLowerCase() ||
            prev.name.toLowerCase() === `${vt.label.toLowerCase()} view` ||
            prev.name.toLowerCase() === `my ${vt.label.toLowerCase()}` ||
            prev.name.toLowerCase() === `new ${vt.label.toLowerCase()}`
        );

      return {
        ...prev,
        type: newViewType,
        // Use just the label (e.g., "Timeline", "Board") for cleaner names
        name: shouldAutoFillName ? viewTypeLabel : prev.name,
      };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit View" : "Create New View"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modify the view settings to change how your data is displayed."
              : "Create a new view to organize and display your data in different ways."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* View Name */}
          <div className="space-y-2">
            <Label htmlFor="viewName">View Name</Label>
            <Input
              id="viewName"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter view name..."
              required
            />
          </div>

          {/* View Type Selection */}
          <div className="space-y-3">
            <Label>View Type</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {viewTypes.map((viewType) => (
                <Card
                  key={viewType.value}
                  className={`cursor-pointer transition-colors p-0 ${
                    formData.type === viewType.value
                      ? "border-primary bg-primary/5"
                      : "hover:border-muted-foreground/50"
                  }`}
                  onClick={() => handleViewTypeChange(viewType.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-md ${
                          formData.type === viewType.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {viewType.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{viewType.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {viewType.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Visible Properties */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Visible Properties</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visibleProperties: properties?.map((p) => p.id) || [],
                    }))
                  }
                  disabled={!properties || properties.length === 0}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visibleProperties: [],
                    }))
                  }
                >
                  <EyeOff className="h-3 w-3 mr-1" />
                  None
                </Button>
              </div>
            </div>

            {properties.length === 0 ? (
              <div className="border rounded-md p-6 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 rounded-full bg-muted">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-muted-foreground">
                      No Properties Available
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create some properties first to configure this view.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/20">
                  {(properties || []).map((property) => (
                    <div
                      key={property.id}
                      className="flex items-center space-x-2 p-2 rounded hover:bg-background/80 transition-colors"
                    >
                      <Checkbox
                        id={`property-${property.id}`}
                        checked={(formData.visibleProperties || []).includes(
                          property.id
                        )}
                        onCheckedChange={(checked) =>
                          handlePropertyToggle(property.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`property-${property.id}`}
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <span className="font-medium">{property.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {property.type.toLowerCase().replace("_", " ")}
                        </Badge>
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Selected: {(formData.visibleProperties || []).length} of{" "}
                    {properties.length} properties
                  </span>
                  {(formData.visibleProperties || []).length === 0 && (
                    <Badge variant="destructive" className="text-xs">
                      At least one property required
                    </Badge>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Default View Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: checked as boolean,
                }))
              }
            />
            <Label htmlFor="isDefault" className="cursor-pointer">
              Set as default view
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                properties.length === 0 ||
                (formData.visibleProperties || []).length === 0
              }
            >
              {mode === "edit" ? "Update View" : "Create View"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
