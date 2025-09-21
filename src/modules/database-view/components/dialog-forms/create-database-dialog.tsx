import React from "react";
import { DatabaseForm } from "./database-form";

interface CreateDatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateDatabaseDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDatabaseDialogProps) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  const handleCancel = () => onOpenChange(false);

  return (
    <DatabaseForm
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
}
