import { Routes, Route } from "react-router-dom";
import { DatabasesPage } from "../pages/databases-page";
import { DatabaseViewPage } from "../pages/database-view-page";
import { DatabaseFormPage } from "../pages/database-form-page";

export function DatabaseRoutes() {
  return (
    <Routes>
      {/* List all databases */}
      <Route path="/" element={<DatabasesPage />} />

      {/* Create new database */}
      <Route path="/new" element={<DatabaseFormPage />} />

      {/* View/edit specific database */}
      <Route path="/:databaseId" element={<DatabaseViewPage />} />

      {/* Edit database form */}
      <Route path="/:databaseId/edit" element={<DatabaseFormPage />} />
    </Routes>
  );
}
