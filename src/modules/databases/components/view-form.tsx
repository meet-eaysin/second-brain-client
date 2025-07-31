import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { DatabaseProperty } from '@/types/database.types';

interface ViewFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    properties: DatabaseProperty[];
}

export function ViewForm({ open, onOpenChange, properties }: ViewFormProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create View</DialogTitle>
                    <DialogDescription>
                        Create a new view to organize and display your data.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        View form implementation coming soon...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Available properties: {properties.length}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
