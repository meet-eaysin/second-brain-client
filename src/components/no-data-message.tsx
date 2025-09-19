import React from "react";
import { Button } from "@/components/ui/button.tsx";

interface NoDataMessageProps {
  title?: string;
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
  compact?: boolean;
}

export function NoDataMessage({
  title,
  message,
  icon: Icon,
  action,
  compact = false,
}: NoDataMessageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${
        compact ? "py-4" : "h-64"
      }`}
    >
      {Icon && (
        <Icon
          className={`text-muted-foreground mb-4 ${
            compact ? "h-8 w-8" : "h-12 w-12"
          }`}
        />
      )}
      {title && (
        <h3 className={`font-medium mb-2 ${compact ? "text-base" : "text-lg"}`}>
          {title}
        </h3>
      )}
      <p className="text-muted-foreground mb-4">{message}</p>
      {action && (
        <Button variant="outline" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
