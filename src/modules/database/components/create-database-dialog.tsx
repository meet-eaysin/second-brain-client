import React from "react";
import { CreateDatabaseForm } from "./create-database-form";

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
  return (
    <CreateDatabaseForm
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
    />
  );
}
