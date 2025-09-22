import { DatabaseForm } from "./database-form";
import { PropertyForm } from "./property-form";
import { RecordForm } from "./record-form";
import { ViewForm } from "./view-form";
import ImportData from "./import -data";
import ExportData from "./export-data";
import ShareDatabase from "./share-database";
import { RecordEditor } from "../record-editor";
import { useDatabaseView } from "../../context";

function RecordEditorDialog() {
  const { dialogOpen, onDialogOpen, currentRecord, database } =
    useDatabaseView();

  const isOpen = dialogOpen === "view-record";
  const databaseId = database?.id || "";
  const recordId = currentRecord?.id || "";

  return (
    <RecordEditor
      databaseId={databaseId}
      recordId={recordId}
      open={isOpen}
      onOpenChange={(open) => !open && onDialogOpen(null)}
    />
  );
}

export function DatabaseDialogs() {
  return (
    <>
      <DatabaseForm />
      <PropertyForm />
      <RecordForm />
      <RecordEditorDialog />
      <ViewForm />
      <ImportData />
      <ExportData />
      <ShareDatabase />
    </>
  );
}
