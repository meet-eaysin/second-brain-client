import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import type { DatabaseRecord, DatabaseProperty } from '@/types/database.types';

interface RecordFormProps {
    record?: DatabaseRecord | null;
    properties: DatabaseProperty[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode?: 'create' | 'edit';
}

export function RecordForm({ record, properties, open, onOpenChange, mode = 'create' }: RecordFormProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>
                        {mode === 'create' ? 'Add Record' : 'Edit Record'}
                    </SheetTitle>
                    <SheetDescription>
                        {mode === 'create'
                            ? 'Add a new record to your database.'
                            : 'Update the record information.'
                        }
                    </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Record form implementation coming soon...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                        Properties: {properties.length}
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
