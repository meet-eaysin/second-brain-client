import {
  useAddProperty,
  useUpdateProperty,
  useCreateRecord,
  useUpdateRecord,
  useAddView,
  useUpdateView,
} from "../../databases/services/databaseQueries";
import {
  createStandardModuleApiService,
  isModuleSupported,
} from "../services/api-service.ts";
import { useQueryClient } from "@tanstack/react-query";
import { RecordForm } from "./record-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Mail, FileText } from "lucide-react";
import { DatabaseForm } from "../../databases/components/database-form";
import { PropertyForm } from "../../databases/components/property-form";
import { ViewForm } from "../../databases/components/view-form";
import { useDocumentView } from "../context/document-view-context";

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

  const queryClient = useQueryClient();

  const addPropertyMutation = useAddProperty();
  const updatePropertyMutation = useUpdateProperty();
  const createRecordMutation = useCreateRecord();
  const updateRecordMutation = useUpdateRecord();
  const addViewMutation = useAddView();
  const updateViewMutation = useUpdateView();

  const getApiService = () => {
    const moduleType = currentSchema?.config?.moduleType;

    if (
      moduleType &&
      moduleType.toLowerCase() !== "databases" &&
      isModuleSupported(moduleType)
    ) {
      return createStandardModuleApiService(moduleType);
    }
    return null;
  };

  const invalidateModuleQueries = () => {
    const moduleType = currentSchema?.config?.moduleType || "tasks";

    queryClient.invalidateQueries({ queryKey: [moduleType] });
    queryClient.invalidateQueries({ queryKey: ["second-brain"] });

    if (moduleType === "books") {
      queryClient.invalidateQueries({
        queryKey: ["books-document-view"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["books-document-view-config"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books-document-view-properties"],
      });
      queryClient.invalidateQueries({
        queryKey: ["books-document-view-views"],
      });
      queryClient.invalidateQueries({ queryKey: ["books-stats"] });
      console.log("📚 Books queries invalidated - properties should refresh");
    }

    if (moduleType === "people") {
      queryClient.invalidateQueries({
        queryKey: ["people-document-view"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["people"] });
      queryClient.invalidateQueries({ queryKey: ["people-records"] });
      queryClient.invalidateQueries({ queryKey: ["people-views"] });
      queryClient.invalidateQueries({ queryKey: ["document-views", "people"] });
    }
  };

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
              console.log("Create database:", data);
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
            const apiService = getApiService();

            if (apiService) {
              try {
                const defaultView = await apiService.getDefaultView();
                if (defaultView?.id) {
                  const propertyData = {
                    name: data.name,
                    type: data.type,
                    description: data.description,
                    required: data.required || false,
                    order: currentSchema.properties?.length || 0,
                  };

                  if (
                    ["SELECT", "MULTI_SELECT"].includes(data.type) &&
                    data.selectOptions
                  ) {
                    propertyData.selectOptions = data.selectOptions.map(
                      (option) => ({
                        name: option.name,
                        color: option.color,
                      })
                    );
                  }

                  await apiService.addProperty(defaultView.id, propertyData);
                  invalidateModuleQueries();
                } else {
                  console.error("No default view found");
                }
              } catch (error) {
                console.error("Failed to create property:", error);
              }
            } else {
              addPropertyMutation.mutate({
                databaseId: currentSchema.id,
                data: data,
              });
            }
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
            const apiService = getApiService();

            if (apiService) {
              try {
                await apiService.createRecord(data);

                invalidateModuleQueries();
              } catch (error) {
                console.error("Failed to create record:", error);
              }
            } else {
              createRecordMutation.mutate({
                databaseId: currentSchema.id,
                data,
              });
            }
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
            const apiService = getApiService();

            if (apiService) {
              try {
                await apiService.updateRecord(currentRecord.id, data);
                console.log("Record updated successfully");
              } catch (error) {
                console.error("Failed to update record:", error);
              }
            } else {
              updateRecordMutation.mutate({
                databaseId: currentSchema.id,
                recordId: currentRecord.id,
                data,
              });
            }
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
                const apiService = getApiService();

                if (apiService) {
                  try {
                    await apiService.createView(data);

                    invalidateModuleQueries();
                  } catch (error) {
                    console.error("Failed to create view:", error);
                  }
                } else {
                  addViewMutation.mutate({
                    databaseId: currentSchema.id,
                    data: data,
                  });
                }
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
                const apiService = getApiService();

                if (apiService) {
                  try {
                    await apiService.updateView(currentView.id, data);
                  } catch (error) {
                    console.error("Failed to update view:", error);
                  }
                } else {
                  updateViewMutation.mutate({
                    databaseId: currentSchema.id,
                    viewId: currentView.id,
                    data: data,
                  });
                }
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
