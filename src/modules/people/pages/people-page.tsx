import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DocumentView } from "@/modules/document-view";
import {
  useUpdatePeopleRecord,
  useDeletePeopleRecord,
  usePeopleModuleConfig,
} from "../hooks/use-people-document-view";
import { toast } from "sonner";
import { EDatabaseType } from "@/modules/document-view";

export function PeoplePage() {
  // Use people-specific hooks
  const { data: moduleConfig, isLoading: configLoading } =
    usePeopleModuleConfig();

  // Mutations
  const updateRecordMutation = useUpdatePeopleRecord();
  const deleteRecordMutation = useDeletePeopleRecord();

  // Event Handlers
  const handleRecordEdit = (record: unknown) => {
    console.log("Edit person:", record);
  };

  const handleRecordDelete = async (recordId: string) => {
    try {
      await deleteRecordMutation.mutateAsync({
        recordId,
      });
      toast.success("Person deleted successfully");
    } catch {
      toast.error("Failed to delete person");
    }
  };

  const handleRecordUpdate = async (
    recordId: string,
    updates: Record<string, unknown>
  ) => {
    try {
      await updateRecordMutation.mutateAsync({
        recordId,
        data: updates,
      });
      toast.success("Person updated successfully");
    } catch {
      toast.error("Failed to update person");
    }
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        {/* People Document View */}
        <DocumentView
          moduleType={EDatabaseType.PEOPLE}
          moduleConfig={moduleConfig}
          config={{
            canCreate: true,
            canEdit: true,
            canDelete: true,
            enableViews: true,
            enableSearch: true,
            enableFilters: true,
            enableSorts: true,
          }}
          onRecordUpdate={handleRecordUpdate}
          onRecordDelete={handleRecordDelete}
          onRecordEdit={handleRecordEdit}
        />
      </Main>
    </>
  );
}
