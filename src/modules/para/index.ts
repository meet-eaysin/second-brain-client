// PARA Method module exports
// PARA = Projects, Areas, Resources, Archive

// Pages
export { ParaOverviewPage } from './pages/para-overview-page';
export { ParaProjectsPage } from './pages/para-projects-page';
export { ParaAreasPage } from './pages/para-areas-page';
export { ParaResourcesPage } from './pages/para-resources-page';
export { ParaArchivePage } from './pages/para-archive-page';

// Components
export { ParaNavigation } from './components/para-navigation';
export { ProjectCard } from './components/project-card';
export { AreaCard } from './components/area-card';
export { ResourceCard } from './components/resource-card';
export { ParaStats } from './components/para-stats';

// Types
export type * from './types/para.types';

// Context
export { ParaProvider, useParaContext } from './context/para-context';

// Services
export { paraApi } from './services/para-api';

// Hooks
export { useParaQuery } from './hooks/use-para-query';

// Routes
export { paraRoutes } from './routes/para-routes';
