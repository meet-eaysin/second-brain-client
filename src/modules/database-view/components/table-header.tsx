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
} from "lucide-react";
import { PropertyHeaderMenu } from "./property-header-menu";
import type { DocumentProperty } from "@/modules/database-view";

interface DocumentTableHeaderProps {
  property: DocumentProperty;
  sortDirection?: "asc" | "desc" | null;
}

const PROPERTY_TYPE_ICONS = {
  TEXT: Type,
  NUMBER: Hash,
  EMAIL: Mail,
  URL: Link,
  PHONE: Phone,
  CHECKBOX: CheckSquare,
  DATE: Calendar,
  SELECT: List,
  MULTI_SELECT: Tags,
} as const;

export function TableHeader({
  property,
  sortDirection
}: DocumentTableHeaderProps) {
  const IconComponent =
    PROPERTY_TYPE_ICONS[property.type as keyof typeof PROPERTY_TYPE_ICONS] ||
    Type;

  const getSortIcon = () => {
    if (sortDirection === "asc") return ArrowUp;
    if (sortDirection === "desc") return ArrowDown;
    return ArrowUpDown;
  };

  const SortIcon = getSortIcon();

  return (
    <PropertyHeaderMenu property={property} >
      <button className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors text-left">
        <div className="flex items-center space-x-1 min-w-0 flex-1">
          <IconComponent className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          {/*<span*/}
          {/*  className={`font-medium text-sm truncate ${*/}
          {/*    isFrozen ? "text-amber-700" : ""*/}
          {/*  }`}*/}
          {/*>*/}
          {/*  {property.name}*/}
          {/*</span>*/}
          {property.required && <span className="text-red-500 text-xs">*</span>}
          {/*{isFrozen && (*/}
          {/*  <Tooltip>*/}
          {/*    <TooltipTrigger asChild>*/}
          {/*      <div className="flex-shrink-0">*/}
          {/*        <Lock className="h-3 w-3 text-amber-600" />*/}
          {/*      </div>*/}
          {/*    </TooltipTrigger>*/}
          {/*    <TooltipContent>*/}
          {/*      <div className="max-w-xs">*/}
          {/*        <p className="font-medium">Protected Property</p>*/}
          {/*        {frozenReason && (*/}
          {/*          <p className="text-sm text-muted-foreground mt-1">*/}
          {/*            {frozenReason}*/}
          {/*          </p>*/}
          {/*        )}*/}
          {/*      </div>*/}
          {/*    </TooltipContent>*/}
          {/*  </Tooltip>*/}
          {/*)}*/}
          <div className="flex items-center space-x-1 ml-2">
            {/*{isFiltered && <div className="h-2 w-2 bg-blue-500 rounded-full" />}*/}
            <SortIcon className="h-3 w-3 text-muted-foreground" />
          </div>
        </div>
      </button>
    </PropertyHeaderMenu>
  );
}
