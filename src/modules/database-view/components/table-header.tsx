import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Type,
  Hash,
  Mail,
  Link,
  Phone,
  CheckSquare,
  Calendar,
  List,
  Tags,
  GripVertical,
} from "lucide-react";
import { PropertyHeaderMenu } from "./property-header-menu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TProperty } from "@/modules/database-view/types";

interface DocumentTableHeaderProps {
  property: TProperty;
  sortDirection?: "asc" | "desc" | null;
  sortableId?: string;
}

const PROPERTY_TYPE_ICONS = {
  text: Type,
  number: Hash,
  email: Mail,
  url: Link,
  phone: Phone,
  checkbox: CheckSquare,
  date: Calendar,
  select: List,
  multi_select: Tags,
} as const;

export function TableHeader({
  property,
  sortDirection,
  sortableId,
}: DocumentTableHeaderProps) {
  const IconComponent =
    PROPERTY_TYPE_ICONS[property.type as keyof typeof PROPERTY_TYPE_ICONS] ||
    Type;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId || property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getSortIcon = () => {
    if (sortDirection === "asc") return ArrowUp;
    if (sortDirection === "desc") return ArrowDown;
    return ArrowUpDown;
  };

  const SortIcon = getSortIcon();

  return (
    <PropertyHeaderMenu property={property}>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between w-full min-w-0 group cursor-pointer hover:bg-muted/50 rounded px-3 py-2 transition-colors text-left"
      >
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          {sortableId && (
            <div
              {...attributes}
              {...listeners}
              className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 hover:bg-muted/50 rounded"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
          )}
          <IconComponent className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-sm truncate">{property.name}</span>
          {property.required && <span className="text-red-500 text-xs">*</span>}
        </div>
        <div className="flex items-center space-x-1 ml-2">
          <SortIcon className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
    </PropertyHeaderMenu>
  );
}
