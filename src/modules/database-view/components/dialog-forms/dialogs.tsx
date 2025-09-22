import { DatabaseForm } from "./database-form";
import { PropertyForm } from "./property-form";
import { RecordForm } from "./record-form";
import { ViewForm } from "./view-form";
import ImportData from "./import -data";
import ExportData from "./export-data";
import ShareDatabase from "./share-database";

export function DatabaseDialogs() {
  return (
    <>
      <DatabaseForm />
      <PropertyForm />
      <RecordForm />
      <ViewForm />
      <ImportData />
      <ExportData />
      <ShareDatabase />
    </>
  );
}
