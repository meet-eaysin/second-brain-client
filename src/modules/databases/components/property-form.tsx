import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type {DatabaseProperty} from "@/types/database.types.ts";

interface PropertyFormProps {
    property?: DatabaseProperty | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: 'create' | 'edit';
}

export function PropertyForm({ open, onOpenChange, mode = 'create' }: PropertyFormProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {mode === 'create' ? 'Add Property' : 'Edit Property'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Add a new property to your database.'
                            : 'Update the property settings.'
                        }
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Property form implementation coming soon...
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
