import { CreateDatabaseForm } from "@/modules/database/components/create-database-form";
import type { TDatabase } from "@/modules/database-view/types";

interface CreateDatabaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  database?: TDatabase | null;
}

export function CreateDatabaseDialog({
  open,
  onOpenChange,
  onSuccess,
  database,
}: CreateDatabaseDialogProps) {
  return (
    <CreateDatabaseForm
      open={open}
      onOpenChange={onOpenChange}
      onSuccess={onSuccess}
      database={database}
    />
  );
}
