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
import { Copy, Mail } from "lucide-react";
import { useDatabaseView } from "../../context";

const ShareDatabase = () => {
  const { dialogOpen, onDialogOpen } = useDatabaseView();

  const isOpen = dialogOpen === "share-database";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDialogOpen(null)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <DialogTitle>Share Database</DialogTitle>
            <Badge variant="secondary">Upcoming</Badge>
          </div>
          <DialogDescription>
            Share this database with others and manage permissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Database sharing functionality is coming soon. You'll be able to
            invite team members and control access permissions.
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex-1" disabled>
              <Copy className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1" disabled>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDialogOpen(null)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDatabase;
