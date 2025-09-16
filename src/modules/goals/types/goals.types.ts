// Goals module types
export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'outcome' | 'process' | 'habit';
  status: 'not-started' | 'in-progress' | 'completed' | 'paused' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  progress: number; // 0-100
  unit?: string; // e.g., 'pages', 'hours', 'pounds', etc.
  targetValue?: number;
  currentValue?: number;
  milestones?: Milestone[];
  tags?: string[];
  notes?: string;
  attachments?: string[];
  parentGoalId?: string; // For sub-goals
  subGoals?: string[]; // Goal IDs
  relatedTasks?: string[]; // Task IDs
  relatedHabits?: string[]; // Habit IDs
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate?: string;
  completedDate?: string;
  targetValue?: number;
  isCompleted: boolean;
  order: number;
}

export interface GoalCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
}

export interface GoalTemplate {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: Goal['type'];
  suggestedDuration?: number; // days
  milestones?: Omit<Milestone, 'id' | 'completedDate' | 'isCompleted'>[];
  tags?: string[];
  isPublic: boolean;
}

export interface GoalStats {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  pausedGoals: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number; // days
  byCategory: Record<string, number>;
  byPriority: Record<Goal['priority'], number>;
  monthlyProgress: Array<{
    month: string;
    completed: number;
    started: number;
  }>;
}

export interface GoalFormData {
  title: string;
  description?: string;
  category: string;
  type: Goal['type'];
  priority: Goal['priority'];
  startDate?: string;
  targetDate?: string;
  targetValue?: number;
  unit?: string;
  milestones?: Omit<Milestone, 'id' | 'completedDate' | 'isCompleted'>[];
  tags?: string[];
  notes?: string;
  parentGoalId?: string;
  isPublic: boolean;
}

export interface GoalFilters {
  status?: Goal['status'][];
  category?: string[];
  priority?: Goal['priority'][];
  type?: Goal['type'][];
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
  showOverdue?: boolean;
  showCompleted?: boolean;
}

export interface GoalProgress {
  goalId: string;
  date: string;
  value: number;
  notes?: string;
  createdAt: string;
}

export interface GoalsPageProps {
  className?: string;
}

export interface GoalContextValue {
  goals: Goal[];
  categories: GoalCategory[];
  templates: GoalTemplate[];
  filters: GoalFilters;
  selectedGoal: Goal | null;
  isLoading: boolean;
  error: string | null;
  stats: GoalStats;
  setFilters: (filters: GoalFilters) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  createGoal: (goal: GoalFormData) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateProgress: (goalId: string, progress: GoalProgress) => Promise<void>;
  refreshGoals: () => Promise<void>;
}
