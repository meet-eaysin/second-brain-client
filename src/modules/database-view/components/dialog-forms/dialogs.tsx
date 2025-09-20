import { RecordForm } from "./record-form.tsx";
import { DatabaseForm } from "./database-form.tsx";
import { PropertyForm } from "./property-form.tsx";
import { ViewForm } from "./view-form.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Copy, Mail, FileText } from "lucide-react";
import { useDocumentView } from "../../context";
import {
  useCreateProperty,
  useUpdateProperty,
  useCreateRecord,
  useUpdateRecord,
  useCreateView,
  useUpdateView,
} from "../../services/database-queries.ts";

export function DatabaseDialogs() {
  const {
    dialogOpen: open,
    setDialogOpen: setOpen,
    currentSchema,
    currentRecord,
    currentProperty,
    currentView,
    setCurrentRecord,
    setCurrentProperty,
    setCurrentView,
  } = useDocumentView();

  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const createRecordMutation = useCreateRecord();
  const updateRecordMutation = useUpdateRecord();
  const createViewMutation = useCreateView();
  const updateViewMutation = useUpdateView();

  return (
    <>
      <Dialog
        open={open === "create-database"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Database</DialogTitle>
            <DialogDescription>
              Create a new database to organize your data.
            </DialogDescription>
          </DialogHeader>
          <DatabaseForm
            onSubmit={(data) => {
              setOpen(null);
            }}
            onCancel={() => setOpen(null)}
          />
        </DialogContent>
      </Dialog>

      <DatabaseForm
        database={currentSchema}
        open={open === "edit-database"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
        mode="edit"
      />

      <Dialog
        open={open === "share-database"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Share this document with others and manage permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Sharing functionality will be implemented here.
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex-1">
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "import-data"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Import data from CSV, JSON, or other formats.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Import functionality will be implemented here.
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
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button disabled>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "export-data"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Data</DialogTitle>
            <DialogDescription>
              Export your data in various formats.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Export functionality will be implemented here.
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
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button disabled>Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PropertyForm
        open={open === "create-property"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
        onSubmit={async (data) => {
          if (currentSchema?.id) {
            createPropertyMutation.mutate({
              databaseId: currentSchema.id,
              data: data,
            });
          }
          setOpen(null);
        }}
        mode="create"
      />

      <PropertyForm
        open={open === "edit-property"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null);
            setCurrentProperty(null);
          }
        }}
        property={currentProperty}
        onSubmit={async (data) => {
          if (currentSchema?.id && currentProperty?.id) {
            updatePropertyMutation.mutate({
              databaseId: currentSchema.id,
              propertyId: currentProperty.id,
              property: data,
            });
          }
          setOpen(null);
          setCurrentProperty(null);
        }}
        mode="edit"
      />

      <RecordForm
        open={open === "create-record"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
        properties={currentSchema?.properties || []}
        onSubmit={async (data) => {
          if (currentSchema?.id) {
            createRecordMutation.mutate({
              databaseId: currentSchema.id,
              data,
            });
          }
          setOpen(null);
        }}
        mode="create"
      />

      <RecordForm
        open={open === "edit-record"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null);
            setCurrentRecord(null);
          }
        }}
        properties={currentSchema?.properties || []}
        record={currentRecord}
        onSubmit={async (data) => {
          if (currentSchema?.id && currentRecord?.id) {
            updateRecordMutation.mutate({
              databaseId: currentSchema.id,
              recordId: currentRecord.id,
              data,
            });
          }
          setOpen(null);
          setCurrentRecord(null);
        }}
        mode="edit"
      />

      <Dialog
        open={open === "view-record"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null);
            setCurrentRecord(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Record</DialogTitle>
          </DialogHeader>
          <RecordForm
            database={currentSchema}
            record={currentRecord}
            readOnly={true}
            onSubmit={() => {}}
            onCancel={() => {
              setOpen(null);
              setCurrentRecord(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "create-view"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>
              Create a new view for your database.
            </DialogDescription>
          </DialogHeader>
          <ViewForm
            open={true}
            onOpenChange={(open) => !open && setOpen(null)}
            properties={currentSchema?.properties || []}
            onSubmit={async (data) => {
              if (currentSchema?.id) {
                createViewMutation.mutate({
                  databaseId: currentSchema.id,
                  data: data,
                });
              }
              setOpen(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={open === "edit-view"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpen(null);
            setCurrentView(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit View</DialogTitle>
            <DialogDescription>Update the view settings.</DialogDescription>
          </DialogHeader>
          <ViewForm
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                setOpen(null);
                setCurrentView(null);
              }
            }}
            properties={currentSchema?.properties || []}
            view={currentView}
            mode="edit"
            onSubmit={async (data) => {
              if (currentSchema?.id && currentView?.id) {
                updateViewMutation.mutate({
                  databaseId: currentSchema.id,
                  viewId: currentView.id,
                  data: data,
                });
              }
              setOpen(null);
              setCurrentView(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
