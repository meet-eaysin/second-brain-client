import React from 'react';
import { useDatabase } from '../context/database-context';
import { DatabaseForm } from './database-form';
import { PropertyForm } from './property-form';
import { RecordForm } from './record-form';
import { ViewForm } from './view-form';
import { ShareDatabaseDialog } from './share-database-dialog';
import { DeleteDatabaseDialog } from './delete-database-dialog';

export function DatabaseDialogs() {
    const { 
        open, 
        setOpen, 
        currentDatabase, 
        currentRecord, 
        currentProperty 
    } = useDatabase();

    return (
        <>
            {/* Database Form */}
            <DatabaseForm
                database={open === 'edit-database' ? currentDatabase : null}
                open={open === 'create-database' || open === 'edit-database'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                mode={open === 'edit-database' ? 'edit' : 'create'}
            />

            {/* Property Form */}
            <PropertyForm
                property={open === 'edit-property' ? currentProperty : null}
                open={open === 'create-property' || open === 'edit-property'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                mode={open === 'edit-property' ? 'edit' : 'create'}
            />

            {/* Record Form */}
            <RecordForm
                record={open === 'edit-record' ? currentRecord : null}
                properties={currentDatabase?.properties || []}
                open={open === 'create-record' || open === 'edit-record'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                mode={open === 'edit-record' ? 'edit' : 'create'}
            />

            {/* View Form */}
            <ViewForm
                open={open === 'create-view'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
                properties={currentDatabase?.properties || []}
            />

            {/* Share Database Dialog */}
            <ShareDatabaseDialog
                database={currentDatabase}
                open={open === 'share-database'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
            />

            {/* Delete Database Dialog */}
            <DeleteDatabaseDialog
                database={currentDatabase}
                open={open === 'delete-database'}
                onOpenChange={(isOpen) => setOpen(isOpen ? open : null)}
            />
        </>
    );
}
