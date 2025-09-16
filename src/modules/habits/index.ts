// Habits module exports
export { HabitsPage } from './pages/habits-page';

// Components
export { HabitCard } from './components/habit-card';
export { HabitList } from './components/habit-list';
export { HabitForm } from './components/habit-form';
export { HabitTracker } from './components/habit-tracker';
export { HabitStats } from './components/habit-stats';
export { HabitStreak } from './components/habit-streak';
export { HabitCalendar } from './components/habit-calendar';

// Types
export type * from './types/habits.types';

// Hooks
export { useHabitsQuery } from './hooks/use-habits-query';
export { useCreateHabit } from './hooks/use-create-habit';
export { useUpdateHabit } from './hooks/use-update-habit';
export { useHabitTracking } from './hooks/use-habit-tracking';

// Services
export { habitsApi } from './services/habits-api';

// Context
export { HabitsProvider, useHabitsContext } from './context/habits-context';

// Utils
export { calculateStreak } from './utils/streak-utils';
export { getHabitCompletionRate } from './utils/habit-utils';

// Routes
export { habitsRoutes } from './routes/habits-routes';
