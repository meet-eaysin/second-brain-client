import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";

interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  isDynamic?: boolean;
  items?: NavItem[];
  tooltip?: string;
}

interface NavGroupProps {
  title: string;
  items: NavItem[];
}

const NavBadge = ({ children }: { children: React.ReactNode }) => {
  if (children === "Upcoming") {
    return (
      <Badge className="rounded-full px-1.5 py-0.5 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
        {children}
      </Badge>
    );
  }

  return <Badge className="rounded-full px-1 py-0 text-xs">{children}</Badge>;
};

const NavItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = item.url ? location.pathname === item.url : false;
  const hasChildren = item.items && item.items.length > 0;

  if (hasChildren) {
    const triggerContent = (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 h-8 px-2 min-w-0",
          level > 0 && "ml-4"
        )}
      >
        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
        <span className="flex-1 text-left truncate">{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </Button>
    );

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          {item.tooltip ? (
            <TooltipWrapper content={item.tooltip} side="right">
              {triggerContent}
            </TooltipWrapper>
          ) : (
            triggerContent
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1">
          {item.items?.map((subItem, index) => (
            <NavItem key={index} item={subItem} level={level + 1} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const buttonContent = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start gap-2 h-8 px-2 min-w-0",
        level > 0 && "ml-4"
      )}
      asChild
    >
      <Link to={item.url || "#"} className="flex items-center gap-2 min-w-0">
        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
        <span className="flex-1 text-left truncate">{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
      </Link>
    </Button>
  );

  return buttonContent;
};

export const NavGroup = ({ title, items }: NavGroupProps) => {
  return (
    <div className="space-y-1">
      <h4 className="text-sm font-medium text-muted-foreground px-2 py-1">
        {title}
      </h4>
      <div className="space-y-1">
        {items.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};
