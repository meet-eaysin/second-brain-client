import { Routes, Route } from "react-router-dom";
import { DatabaseFormPage, DatabasesPage, DatabaseViewPage } from "@/modules/database";

export function DatabaseRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DatabasesPage />} />
      <Route path="/new" element={<DatabaseFormPage />} />
      <Route path="/:databaseId" element={<DatabaseViewPage />} />
      <Route path="/:databaseId/edit" element={<DatabaseFormPage />} />
    </Routes>
  );
}
