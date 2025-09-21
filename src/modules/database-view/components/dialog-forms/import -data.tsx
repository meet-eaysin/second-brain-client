import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { FileText, Upload } from "lucide-react";
import { useDatabaseView } from "../../context";

const ImportData = () => {
  const { dialogOpen, onDialogOpen } = useDatabaseView();

  const isOpen = dialogOpen === "import-data";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <DialogTitle>Import Data</DialogTitle>
            <Badge variant="secondary">Upcoming</Badge>
          </div>
          <DialogDescription>
            Import data from CSV, JSON, or other formats into your database.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Data import functionality is coming soon. You'll be able to import
            records from various file formats and external sources.
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              CSV File
            </Button>
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              JSON File
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDialogOpen(null)}>
            Cancel
          </Button>
          <Button disabled>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportData;
