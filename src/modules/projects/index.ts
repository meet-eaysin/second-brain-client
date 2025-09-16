// Projects module exports
export { ProjectsPage } from './pages/projects-page';

// Components
export { ProjectCard } from './components/project-card';
export { ProjectList } from './components/project-list';
export { ProjectForm } from './components/project-form';
export { ProjectBoard } from './components/project-board';
export { ProjectTimeline } from './components/project-timeline';
export { ProjectStats } from './components/project-stats';

// Types
export type * from './types/projects.types';

// Hooks
export { useProjectsQuery } from './hooks/use-projects-query';
export { useCreateProject } from './hooks/use-create-project';
export { useUpdateProject } from './hooks/use-update-project';
export { useProjectTasks } from './hooks/use-project-tasks';

// Services
export { projectsApi } from './services/projects-api';

// Context
export { ProjectsProvider, useProjectsContext } from './context/projects-context';

// Routes
export { projectsRoutes } from './routes/projects-routes';
