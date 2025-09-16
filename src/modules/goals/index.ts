// Goals module exports
export { GoalsPage } from './pages/goals-page';

// Components
export { GoalCard } from './components/goal-card';
export { GoalList } from './components/goal-list';
export { GoalForm } from './components/goal-form';
export { GoalProgress } from './components/goal-progress';
export { GoalStats } from './components/goal-stats';
export { MilestoneCard } from './components/milestone-card';

// Types
export type * from './types/goals.types';

// Hooks
export { useGoalsQuery } from './hooks/use-goals-query';
export { useCreateGoal } from './hooks/use-create-goal';
export { useUpdateGoal } from './hooks/use-update-goal';
export { useGoalProgress } from './hooks/use-goal-progress';

// Services
export { goalsApi } from './services/goals-api';

// Context
export { GoalsProvider, useGoalsContext } from './context/goals-context';

// Utils
export { calculateGoalProgress } from './utils/goal-utils';
export { getGoalTimeRemaining } from './utils/time-utils';

// Routes
export { goalsRoutes } from './routes/goals-routes';
