import { Routes, Route } from "react-router-dom";
import { SecondBrainDashboard } from "@/modules/second-brain-dashboard/pages/second-brain-dashboard";
import { ProjectsPage } from "@/modules/projects/pages/projects-page";
import { MyDayPage } from "@/modules/my-day/pages/my-day-page";
import { GoalsPage } from "@/modules/goals/pages/goals-page";
import NotesPage from "@/modules/notes/pages/notes-page";
import { PeoplePage } from "@/modules/people/pages/people-page";
import { HabitsPage } from "@/modules/habits/pages/habits-page";
import { JournalPage } from "@/modules/journal/pages/journal-page";
import { BooksPage } from "@/modules/books/pages/books-page";
import { ContentHubPage } from "@/modules/content-hub/pages/content-hub-page";
import { FinancesPage } from "@/modules/finances/pages/finances-page";
import { MoodTrackerPage } from "@/modules/mood-tracker/pages/mood-tracker-page";
import SearchPage from "@/modules/search/pages/search-page";
import { QuickCapture } from "../components/quick-capture";
import { RecentCaptures } from "../components/recent-captures";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { PARAOverviewPage } from "@/modules/para/pages/para-overview-page";
import { PARAProjectsPage } from "@/modules/para/pages/para-projects-page";
import { PARAAreasPage } from "@/modules/para/pages/para-areas-page";
import { PARAResourcesPage } from "@/modules/para/pages/para-resources-page";
import { PARAArchivePage } from "@/modules/para/pages/para-archive-page";

const QuickCapturePage = () => (
  <>
    <EnhancedHeader />

    <Main className="space-y-8">
      {/* Clean Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Quick Capture</h1>
        <p className="text-muted-foreground">
          Quickly capture tasks, notes, and ideas
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Capture Form */}
        <div>
          <QuickCapture />
        </div>

        {/* Recent Captures */}
        <div>
          <RecentCaptures limit={15} />
        </div>
      </div>
    </Main>
  </>
);

export function SecondBrainRoutes() {
  return (
    <Routes>
      {/* Main Dashboard */}
      <Route index element={<SecondBrainDashboard />} />

      {/* Core Features */}
      <Route path="capture" element={<QuickCapturePage />} />
      <Route path="my-day" element={<MyDayPage />} />
      <Route path="search" element={<SearchPage />} />

      {/* Core Modules */}
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="notes" element={<NotesPage />} />
      <Route path="people" element={<PeoplePage />} />
      <Route path="goals" element={<GoalsPage />} />
      <Route path="habits" element={<HabitsPage />} />
      <Route path="journal" element={<JournalPage />} />
      <Route path="books" element={<BooksPage />} />
      <Route path="content" element={<ContentHubPage />} />
      <Route path="finances" element={<FinancesPage />} />
      <Route path="mood" element={<MoodTrackerPage />} />
      <Route path="search" element={<SearchPage />} />

      {/* PARA System */}
      <Route path="para" element={<PARAOverviewPage />} />
      <Route path="para/projects" element={<PARAProjectsPage />} />
      <Route path="para/areas" element={<PARAAreasPage />} />
      <Route path="para/resources" element={<PARAResourcesPage />} />
      <Route path="para/archive" element={<PARAArchivePage />} />
    </Routes>
  );
}
