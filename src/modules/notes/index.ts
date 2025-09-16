// Notes module exports
export { NotesPage } from './pages/notes-page';

// Components
export { NoteCard } from './components/note-card';
export { NoteList } from './components/note-list';
export { NoteEditor } from './components/note-editor';
export { NoteForm } from './components/note-form';
export { NotesSearch } from './components/notes-search';
export { NotesFilters } from './components/notes-filters';
export { NoteStats } from './components/note-stats';

// Types
export type * from './types/notes.types';

// Hooks
export { useNotesQuery } from './hooks/use-notes-query';
export { useCreateNote } from './hooks/use-create-note';
export { useUpdateNote } from './hooks/use-update-note';
export { useNotesSearch } from './hooks/use-notes-search';

// Services
export { notesApi } from './services/notes-api';

// Context
export { NotesProvider, useNotesContext } from './context/notes-context';

// Utils
export { formatNoteContent } from './utils/note-utils';
export { extractNoteTags } from './utils/tag-utils';

// Routes
export { notesRoutes } from './routes/notes-routes';
