// Journal module types
export interface JournalEntry {
  id: string;
  title?: string;
  content: string;
  date: string; // YYYY-MM-DD
  mood?: number; // 1-10 scale
  weather?: string;
  location?: string;
  tags?: string[];
  category?: string;
  isPrivate: boolean;
  isFavorite: boolean;
  wordCount: number;
  readingTime: number; // minutes
  attachments?: string[]; // File paths or URLs
  prompts?: string[]; // Journal prompt IDs used
  gratitude?: string[]; // Things grateful for
  highlights?: string[]; // Day highlights
  challenges?: string[]; // Day challenges
  lessons?: string[]; // Lessons learned
  tomorrowGoals?: string[]; // Goals for tomorrow
  createdAt: string;
  updatedAt: string;
}

export interface JournalPrompt {
  id: string;
  text: string;
  category: string;
  type: 'reflection' | 'gratitude' | 'goal-setting' | 'creative' | 'self-care' | 'general';
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  isActive: boolean;
  usageCount: number;
  createdAt: string;
}

export interface JournalTemplate {
  id: string;
  name: string;
  description?: string;
  structure: TemplateSection[];
  category: string;
  isPublic: boolean;
  usageCount: number;
  createdAt: string;
}

export interface TemplateSection {
  id: string;
  title: string;
  type: 'text' | 'list' | 'rating' | 'mood' | 'prompt';
  placeholder?: string;
  required: boolean;
  order: number;
  promptId?: string; // For prompt sections
}

export interface JournalStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  totalWords: number;
  averageWordsPerEntry: number;
  averageMood: number;
  entriesThisMonth: number;
  entriesThisYear: number;
  favoriteEntries: number;
  mostUsedTags: Array<{
    tag: string;
    count: number;
  }>;
  moodTrend: Array<{
    date: string;
    mood: number;
  }>;
  writingFrequency: Array<{
    date: string;
    count: number;
  }>;
}

export interface JournalFormData {
  title?: string;
  content: string;
  date: string;
  mood?: number;
  weather?: string;
  location?: string;
  tags?: string[];
  category?: string;
  isPrivate: boolean;
  isFavorite: boolean;
  gratitude?: string[];
  highlights?: string[];
  challenges?: string[];
  lessons?: string[];
  tomorrowGoals?: string[];
}

export interface JournalFilters {
  dateRange?: {
    start?: string;
    end?: string;
  };
  mood?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  category?: string[];
  weather?: string[];
  isFavorite?: boolean;
  isPrivate?: boolean;
  search?: string;
  hasAttachments?: boolean;
}

export interface JournalPageProps {
  className?: string;
}

export interface JournalContextValue {
  entries: JournalEntry[];
  prompts: JournalPrompt[];
  templates: JournalTemplate[];
  filters: JournalFilters;
  selectedEntry: JournalEntry | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
  stats: JournalStats;
  setFilters: (filters: JournalFilters) => void;
  setSelectedEntry: (entry: JournalEntry | null) => void;
  setSelectedDate: (date: string) => void;
  createEntry: (entry: JournalFormData) => Promise<void>;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
}
