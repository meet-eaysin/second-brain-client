import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import type { DocumentProperty, DatabaseView } from "@/modules/document-view";

interface SortRule {
  propertyId: string;
  direction: "asc" | "desc";
}

interface SortManagerProps {
  properties: DocumentProperty[];
  currentView: DatabaseView;
  onSave: (sorts: SortRule[]) => Promise<void>;
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

export function SortManager({
  properties,
  currentView,
  onSave,
}: SortManagerProps) {
  const [open, setOpen] = useState(false);
  const [sorts, setSorts] = useState<SortRule[]>([]);

  useEffect(() => {
    setSorts(currentView?.sorts ?? []);
  }, [currentView]);

  const addSort = () => {
    const available = properties.filter(
      (prop) => !sorts.some((s) => s.propertyId === prop.id)
    );
    if (available.length > 0) {
      setSorts([...sorts, { propertyId: available[0].id, direction: "asc" }]);
    }
  };

  const updateSort = (i: number, field: keyof SortRule, value: string) => {
    const next = [...sorts];
    next[i] = { ...next[i], [field]: value };
    setSorts(next);
  };

  const removeSort = (i: number) => {
    setSorts(sorts.filter((_, idx) => idx !== i));
  };

  const moveSort = (i: number, dir: "up" | "down") => {
    const next = [...sorts];
    const t = dir === "up" ? i - 1 : i + 1;
    if (t >= 0 && t < next.length) {
      [next[i], next[t]] = [next[t], next[i]];
      setSorts(next);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(sorts);
      setOpen(false);
    } catch (err) {
      console.error("Failed to save sorts:", err);
    }
  };

  const handleReset = () => setSorts([]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2">
          <ArrowDownUp className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[420px] flex flex-col gap-2 p-3 text-sm"
      >
        <h4 className="font-medium text-sm">
          {sorts.length > 0 ? "Sort by" : "No sorting applied"}
        </h4>

        {sorts.length > 0 ? (
          <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
            {sorts.map((sort, i) => {
              return (
                <Card key={i} className="p-1.5">
                  <div className="flex flex-row gap-1.5 items-center">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground cursor-grab shrink-0" />

                    <Select
                      value={sort.propertyId}
                      onValueChange={(v) => updateSort(i, "propertyId", v)}
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
                        disabled={i === 0}
                        className="h-7 w-7 p-0"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveSort(i, "down")}
                        disabled={i === sorts.length - 1}
                        className="h-7 w-7 p-0"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSort(i)}
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
            disabled={sorts.length >= properties.length}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Sort
          </Button>

          <div className="flex justify-end gap-1.5">
            <Button
              variant="outline"
              onClick={handleReset}
              className="h-8 text-sm"
              disabled={sorts.length === 0}
            >
              Reset
            </Button>
            <Button size="sm" className="h-8 text-sm" onClick={handleSave}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
