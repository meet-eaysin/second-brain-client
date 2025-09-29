import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Type,
  Hash,
  Calendar,
  CheckSquare,
  ArrowDownUp,
  List,
  Tags,
  Mail,
  Link,
  Phone,
  FileText,
  DollarSign,
  Percent,
  Circle,
  AlertTriangle,
  File,
  Calculator,
  Clock,
  User,
  Smile,
  Repeat,
  Search,
  Files,
} from "lucide-react";
import {
  EPropertyType,
  ESortDirection,
  type TSortConfig,
} from "@/modules/database-view/types";
import { useDatabaseView } from "@/modules/database-view/context";
import { useUpdateViewSorts } from "@/modules/database-view/services/database-queries.ts";

const PROPERTY_TYPE_ICONS = {
  [EPropertyType.TEXT]: Type,
  [EPropertyType.RICH_TEXT]: FileText,
  [EPropertyType.NUMBER]: Hash,
  [EPropertyType.DATE]: Calendar,
  [EPropertyType.DATE_RANGE]: Calendar, // ✅ Added
  [EPropertyType.CHECKBOX]: CheckSquare,
  [EPropertyType.URL]: Link,
  [EPropertyType.EMAIL]: Mail,
  [EPropertyType.PHONE]: Phone,
  [EPropertyType.CURRENCY]: DollarSign,
  [EPropertyType.PERCENT]: Percent,
  [EPropertyType.SELECT]: List,
  [EPropertyType.MULTI_SELECT]: Tags,
  [EPropertyType.STATUS]: Circle,
  [EPropertyType.PRIORITY]: AlertTriangle,
  [EPropertyType.FILE]: File,
  [EPropertyType.RELATION]: Link,
  [EPropertyType.ROLLUP]: Calculator,
  [EPropertyType.FORMULA]: Calculator,
  [EPropertyType.CREATED_TIME]: Clock,
  [EPropertyType.LAST_EDITED_TIME]: Clock,
  [EPropertyType.CREATED_BY]: User,
  [EPropertyType.LAST_EDITED_BY]: User,
  [EPropertyType.MOOD_SCALE]: Smile,
  [EPropertyType.FREQUENCY]: Repeat,
  [EPropertyType.CONTENT_TYPE]: FileText,
  [EPropertyType.FINANCE_TYPE]: DollarSign,
  [EPropertyType.FINANCE_CATEGORY]: Tags,
  [EPropertyType.FILES]: Files,
  [EPropertyType.LOOKUP]: Search,
} as const;

export function SortManager() {
  const { database, properties, currentView, tempSorts, setTempSorts } =
    useDatabaseView();
  const [open, setOpen] = useState(false);

  const [localSorts, setLocalSorts] = useState<TSortConfig[]>([]);

  const updateViewSortsMutation = useUpdateViewSorts();

  // Sync localSorts with tempSorts when opening
  useEffect(() => {
    if (open) {
      setLocalSorts(tempSorts);
    }
  }, [open, tempSorts]);

  const addSort = () => {
    const available = properties.filter(
      (prop) => !localSorts.some((s) => s.propertyId === prop.id)
    );
    if (available.length > 0) {
      const newSorts = [
        ...localSorts,
        { propertyId: available[0].id, direction: ESortDirection.ASC },
      ];
      setLocalSorts(newSorts);
      setTempSorts(newSorts);
    }
  };

  const updateSort = (i: number, field: keyof TSortConfig, value: string) => {
    const next = [...localSorts];
    next[i] = { ...next[i], [field]: value };
    setLocalSorts(next);
    setTempSorts(next);
  };

  const removeSort = (i: number) => {
    const newSorts = localSorts.filter((_, idx) => idx !== i);
    setLocalSorts(newSorts);
    setTempSorts(newSorts);
  };

  const moveSort = (i: number, dir: "up" | "down") => {
    const next = [...localSorts];
    const t = dir === "up" ? i - 1 : i + 1;
    if (t >= 0 && t < next.length) {
      [next[i], next[t]] = [next[t], next[i]];
      setLocalSorts(next);
      setTempSorts(next);
    }
  };

  const handleSave = async () => {
    if (!database?.id || !currentView?.id) return;

    try {
      // Convert local sorts to backend format
      const sorts: TSortConfig[] = localSorts
        .filter((sort) => sort.propertyId)
        .map((sort) => ({
          propertyId: sort.propertyId,
          direction: sort.direction,
        }));

      await updateViewSortsMutation.mutateAsync({
        databaseId: database.id,
        viewId: currentView.id,
        sorts,
      });

      setOpen(false);
    } catch (err) {
      console.error("Failed to save sorts:", err);
    }
  };

  const handleReset = () => {
    const newSorts: TSortConfig[] = [];
    setLocalSorts(newSorts);
    setTempSorts(newSorts);
  };

  const isFrozen = database?.isFrozen;

  if (isFrozen) {
    return null; // Don't show sort manager for frozen databases
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          disabled={isFrozen}
          title={
            isFrozen ? "Cannot modify sorting for frozen database" : undefined
          }
        >
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="bottom"
        className="w-full max-w-[420px] flex flex-col gap-2 p-3 text-sm"
      >
        <h4 className="font-medium text-sm">
          {isFrozen
            ? "Sorting disabled (database frozen)"
            : localSorts.length > 0
            ? "Sort by"
            : "No sorting applied"}
        </h4>

        {localSorts.length > 0 ? (
          <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
            {localSorts.map((sort, i) => {
              return (
                <Card key={i} className="p-1.5">
                  <div className="flex flex-row gap-1.5 items-center">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab shrink-0" />

                    <Select
                      value={sort.propertyId}
                      onValueChange={(v) => updateSort(i, "propertyId", v)}
                      disabled={isFrozen}
                    >
                      <SelectTrigger className="flex-1 h-7 min-h-7 px-2 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {properties.map((p) => {
                          const Icon = PROPERTY_TYPE_ICONS[p.type] || Type;
                          return (
                            <SelectItem
                              key={p.id}
                              value={p.id}
                              className="text-sm"
                            >
                              <div className="flex items-center gap-1.5">
                                <Icon className="h-3.5 w-3.5" />
                                <span>{p.name}</span>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] px-1"
                                >
                                  {p.type}
                                </Badge>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>

                    <Select
                      value={sort.direction}
                      onValueChange={(v) =>
                        updateSort(i, "direction", v as "asc" | "desc")
                      }
                      disabled={isFrozen}
                    >
                      <SelectTrigger className="w-[80px] h-7 min-h-7 text-sm px-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc" className="text-sm">
                          <div className="flex items-center gap-1.5">
                            <ArrowUp className="h-3.5 w-3.5" /> Asc
                          </div>
                        </SelectItem>
                        <SelectItem value="desc" className="text-sm">
                          <div className="flex items-center gap-1.5">
                            <ArrowDown className="h-3.5 w-3.5" /> Desc
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSort(i, "up")}
                        disabled={isFrozen || i === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSort(i, "down")}
                        disabled={isFrozen || i === localSorts.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSort(i)}
                        disabled={isFrozen}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-2 text-sm w-[420px]">
            <p>No sorting rules configured</p>
            <p className="text-sm">Add a rule to sort your records</p>
          </div>
        )}

        <div className="flex flex-col w-full gap-1.5">
          <Button
            onClick={addSort}
            variant="outline"
            className="h-8 text-sm"
            disabled={isFrozen || localSorts.length >= properties.length}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Sort
          </Button>

          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-8 text-sm"
              disabled={isFrozen || localSorts.length === 0}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="h-8 text-sm"
              onClick={handleSave}
              disabled={isFrozen}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
