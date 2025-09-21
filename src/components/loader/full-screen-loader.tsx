import React from "react";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { cn } from "@/lib/utils.ts";

interface FullScreenLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "muted";
  className?: string;
  overlay?: boolean;
}

export const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({
  message = "Loading...",
  size = "lg",
  variant = "default",
  className,
  overlay = true,
}) => {
  // Map size to spinner size
  const spinnerSize =
    size === "sm" ? 16 : size === "md" ? 24 : size === "lg" ? 32 : 48;

  // Map variant to spinner variant
  const spinnerVariant =
    variant === "primary"
      ? "circle-filled"
      : variant === "muted"
      ? "ellipsis"
      : "ring";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center",
        overlay && "bg-background/80 backdrop-blur-sm",
        className
      )}
    >
      <Spinner size={spinnerSize} variant={spinnerVariant} />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

interface CenteredLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "primary" | "muted";
  className?: string;
  minHeight?: string;
}

export const CenteredLoader: React.FC<CenteredLoaderProps> = ({
  message = "Loading...",
  size = "md",
  variant = "default",
  className,
  minHeight = "min-h-64",
}) => {
  // Map size to spinner size
  const spinnerSize =
    size === "sm" ? 16 : size === "md" ? 24 : size === "lg" ? 32 : 48;

  // Map variant to spinner variant
  const spinnerVariant =
    variant === "primary"
      ? "circle-filled"
      : variant === "muted"
      ? "ellipsis"
      : "ring";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center",
        minHeight,
        className
      )}
    >
      <Spinner size={spinnerSize} variant={spinnerVariant} />
      {message && (
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};
