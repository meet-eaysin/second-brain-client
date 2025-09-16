// Journal module exports
export { JournalPage } from './pages/journal-page';

// Components
export { JournalEntry } from './components/journal-entry';
export { JournalList } from './components/journal-list';
export { JournalForm } from './components/journal-form';
export { JournalCalendar } from './components/journal-calendar';
export { JournalStats } from './components/journal-stats';
export { JournalPrompts } from './components/journal-prompts';
export { MoodTracker } from './components/mood-tracker';

// Types
export type * from './types/journal.types';

// Hooks
export { useJournalQuery } from './hooks/use-journal-query';
export { useCreateEntry } from './hooks/use-create-entry';
export { useUpdateEntry } from './hooks/use-update-entry';
export { useJournalPrompts } from './hooks/use-journal-prompts';

// Services
export { journalApi } from './services/journal-api';

// Context
export { JournalProvider, useJournalContext } from './context/journal-context';

// Utils
export { formatJournalDate } from './utils/date-utils';
export { getWritingStreak } from './utils/streak-utils';

// Routes
export { journalRoutes } from './routes/journal-routes';
