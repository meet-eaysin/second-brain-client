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
import { FileText, Download } from "lucide-react";
import { useDatabaseView } from "../../context";

const ExportData = () => {
  const { dialogOpen, onDialogOpen } = useDatabaseView();

  const isOpen = dialogOpen === "export-data";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            <DialogTitle>Export Data</DialogTitle>
            <Badge variant="secondary">Upcoming</Badge>
          </div>
          <DialogDescription>
            Export your database data in various formats for backup or analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Data export functionality is coming soon. You'll be able to download
            your records in multiple formats for external use.
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              CSV Format
            </Button>
            <Button variant="outline" disabled>
              <FileText className="mr-2 h-4 w-4" />
              JSON Format
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDialogOpen(null)}>
            Cancel
          </Button>
          <Button disabled>Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportData;
