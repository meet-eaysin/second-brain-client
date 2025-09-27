import { Routes, Route } from "react-router-dom";
import { SecondBrainDashboard } from "@/modules/second-brain-dashboard/pages/second-brain-dashboard";
import { TasksPage } from "@/modules/tasks/pages/tasks-page";
import {NotesPage} from "@/modules/notes/pages/notes-page";
import { PeoplePage } from "@/modules/people/pages/people-page";
import { JournalPage } from "@/modules/journal/pages/journal-page";
import { FinancesPage } from "@/modules/finances/pages/finances-page";
import { PARAOverviewPage } from "@/modules/para/pages/para-overview-page";
import { PARAProjectsPage } from "@/modules/para/pages/para-projects-page";
import { PARAAreasPage } from "@/modules/para/pages/para-areas-page";
import { PARAResourcesPage } from "@/modules/para/pages/para-resources-page";
import { PARAArchivePage } from "@/modules/para/pages/para-archive-page";

export function SecondBrainRoutes() {
  return (
    <Routes>
      <Route index element={<SecondBrainDashboard />} />
      <Route path="dashboard" element={<SecondBrainDashboard />} />

      <Route path="tasks" element={<TasksPage />} />
      <Route path="notes" element={<NotesPage />} />
      <Route path="people" element={<PeoplePage />} />
      <Route path="journal" element={<JournalPage />} />
      <Route path="finances" element={<FinancesPage />} />

      <Route path="para" element={<PARAOverviewPage />} />
      <Route path="para/projects" element={<PARAProjectsPage />} />
      <Route path="para/areas" element={<PARAAreasPage />} />
      <Route path="para/resources" element={<PARAResourcesPage />} />
      <Route path="para/archive" element={<PARAArchivePage />} />
    </Routes>
  );
}
