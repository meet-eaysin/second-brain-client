// Second Brain Dashboard module exports
export { SecondBrainDashboard } from './pages/second-brain-dashboard';

// Components
export { DashboardLayout } from './components/dashboard-layout';
export { DashboardWidget } from './components/dashboard-widget';
export { QuickActions } from './components/quick-actions';
export { RecentActivity } from './components/recent-activity';
export { ProgressOverview } from './components/progress-overview';
export { UpcomingTasks } from './components/upcoming-tasks';
export { HabitsOverview } from './components/habits-overview';
export { GoalsProgress } from './components/goals-progress';

// Types
export type * from './types/dashboard.types';

// Hooks
export { useDashboardData } from './hooks/use-dashboard-data';
export { useDashboardWidgets } from './hooks/use-dashboard-widgets';

// Services
export { dashboardApi } from './services/dashboard-api';

// Context
export { DashboardProvider, useDashboardContext } from './context/dashboard-context';

// Routes
export { dashboardRoutes } from './routes/dashboard-routes';
