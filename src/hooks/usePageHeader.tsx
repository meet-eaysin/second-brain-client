import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Filter,
  BarChart3,
  Download,
  Settings,
  Share,
} from "lucide-react";

export interface PageHeaderConfig {
  showSearch?: boolean;
  contextActions?: ReactNode;
}

export function usePageHeader() {
  // Common action builders for consistency
  const createAction = (
    icon: ReactNode,
    label: string,
    onClick?: () => void,
    variant: "default" | "outline" = "default"
  ) => (
    <Button size="sm" variant={variant} className="h-8 gap-2" onClick={onClick}>
      {icon}
      {label}
    </Button>
  );

  const createActions = {
    add: (label: string = "Add", onClick?: () => void) =>
      createAction(<Plus className="h-4 w-4" />, label, onClick),

    filter: (onClick?: () => void) =>
      createAction(
        <Filter className="h-4 w-4" />,
        "Filter",
        onClick,
        "outline"
      ),

    analytics: (onClick?: () => void) =>
      createAction(
        <BarChart3 className="h-4 w-4" />,
        "Analytics",
        onClick,
        "outline"
      ),

    download: (onClick?: () => void) =>
      createAction(
        <Download className="h-4 w-4" />,
        "Download",
        onClick,
        "outline"
      ),

    settings: (onClick?: () => void) =>
      createAction(
        <Settings className="h-4 w-4" />,
        "Settings",
        onClick,
        "outline"
      ),

    share: (onClick?: () => void) =>
      createAction(<Share className="h-4 w-4" />, "Share", onClick, "outline"),
  };

  return {
    createAction,
    createActions,
  };
}

// Pre-configured header configs for common page types
export const headerConfigs = {
  dashboard: {
    showSearch: false,
    contextActions: (
      <Button size="sm" variant="outline" className="h-8 gap-2">
        <Download className="h-4 w-4" />
        Download
      </Button>
    ),
  },

  list: (addLabel: string = "Add", onAdd?: () => void) => ({
    showSearch: true,
    contextActions: (
      <Button size="sm" className="h-8 gap-2" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        {addLabel}
      </Button>
    ),
  }),

  analytics: (onAdd?: () => void, addLabel: string = "Add") => ({
    showSearch: true,
    contextActions: (
      <>
        <Button size="sm" variant="outline" className="h-8 gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </Button>
        <Button size="sm" className="h-8 gap-2" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </>
    ),
  }),

  search: {
    showSearch: true,
    contextActions: (
      <Button size="sm" variant="outline" className="h-8 gap-2">
        <Filter className="h-4 w-4" />
        Filter
      </Button>
    ),
  },
};
