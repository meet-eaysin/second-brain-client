import { Routes, Route } from 'react-router-dom';
import { SecondBrainDashboard } from '../pages/second-brain-dashboard';
import { TasksPage } from '../pages/tasks-page';
import { ProjectsPage } from '../pages/projects-page';
import { MyDayPage } from '../pages/my-day-page';
import { GoalsPage } from '../pages/goals-page';
import { PARAOverviewPage } from '../pages/para-overview-page';
import { PARAProjectsPage } from '../pages/para-projects-page';
import { PARAAreasPage } from '../pages/para-areas-page';
import { PARAResourcesPage } from '../pages/para-resources-page';
import { PARAArchivePage } from '../pages/para-archive-page';
import NotesPage from '../pages/notes-page';
import { PeoplePage } from '../pages/people-page';
import { HabitsPage } from '../pages/habits-page';
import { JournalPage } from '../pages/journal-page';
import { BooksPage } from '../pages/books-page';
import { ContentHubPage } from '../pages/content-hub-page';
import { FinancesPage } from '../pages/finances-page';
import { MoodTrackerPage } from '../pages/mood-tracker-page';
import SearchPage from '../pages/search-page';
import { QuickCapture } from '../components/quick-capture';


const QuickCapturePage = () => (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Quick Capture</h1>
        <QuickCapture />
    </div>
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
            <Route path="tasks" element={<TasksPage />} />
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
