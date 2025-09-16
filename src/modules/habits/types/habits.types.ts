// Habits module types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: 'positive' | 'negative'; // Building or breaking habit
  frequency: HabitFrequency;
  targetValue?: number; // For quantifiable habits
  unit?: string; // e.g., 'minutes', 'pages', 'glasses'
  reminderTime?: string; // HH:MM format
  reminderDays?: number[]; // 0-6 (Sunday-Saturday)
  color?: string;
  icon?: string;
  tags?: string[];
  notes?: string;
  isActive: boolean;
  startDate: string;
  endDate?: string; // For temporary habits
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  createdAt: string;
  updatedAt: string;
}

export interface HabitFrequency {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  value?: number; // For "X times per week/month"
  customDays?: number[]; // Specific days for custom frequency
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number; // For quantifiable habits
  notes?: string;
  completedAt?: string; // ISO timestamp
  createdAt: string;
  updatedAt: string;
}

export interface HabitTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: Habit['type'];
  frequency: HabitFrequency;
  targetValue?: number;
  unit?: string;
  reminderTime?: string;
  color?: string;
  icon?: string;
  tags?: string[];
  isPublic: boolean;
}

export interface HabitCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  currentStreaks: number;
  averageCompletionRate: number;
  longestStreak: number;
  byCategory: Record<string, {
    total: number;
    completed: number;
    rate: number;
  }>;
  weeklyProgress: Array<{
    week: string;
    completed: number;
    total: number;
    rate: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    completions: number;
    rate: number;
  }>;
}

export interface HabitFormData {
  name: string;
  description?: string;
  category: string;
  type: Habit['type'];
  frequency: HabitFrequency;
  targetValue?: number;
  unit?: string;
  reminderTime?: string;
  reminderDays?: number[];
  color?: string;
  icon?: string;
  tags?: string[];
  notes?: string;
  startDate: string;
  endDate?: string;
}

export interface HabitFilters {
  category?: string[];
  type?: Habit['type'][];
  isActive?: boolean;
  tags?: string[];
  search?: string;
  completedToday?: boolean;
  hasStreak?: boolean;
}

export interface HabitTrackingData {
  habitId: string;
  date: string;
  completed: boolean;
  value?: number;
  notes?: string;
}

export interface HabitsPageProps {
  className?: string;
}

export interface HabitContextValue {
  habits: Habit[];
  entries: HabitEntry[];
  categories: HabitCategory[];
  templates: HabitTemplate[];
  filters: HabitFilters;
  selectedHabit: Habit | null;
  selectedDate: string;
  isLoading: boolean;
  error: string | null;
  stats: HabitStats;
  setFilters: (filters: HabitFilters) => void;
  setSelectedHabit: (habit: Habit | null) => void;
  setSelectedDate: (date: string) => void;
  createHabit: (habit: HabitFormData) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  trackHabit: (data: HabitTrackingData) => Promise<void>;
  refreshHabits: () => Promise<void>;
}
