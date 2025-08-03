// Base interface for all Second Brain documents
export interface BaseSecondBrainDocument {
    _id: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    archivedAt?: string;
    area?: 'projects' | 'areas' | 'resources' | 'archive';
    tags: string[];
}

// Task interfaces
export interface Task extends BaseSecondBrainDocument {
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: string;
    estimatedTime?: number; // in minutes
    actualTime?: number; // in minutes
    
    // Hierarchy
    parentTask?: string;
    subtasks: string[];
    
    // Relationships
    project?: string;
    assignedTo?: string; // Person ID
    notes: string[]; // Note IDs
    
    // Recurrence
    isRecurring: boolean;
    recurrencePattern?: {
        type: 'daily' | 'weekly' | 'monthly' | 'custom';
        interval: number;
        daysOfWeek?: number[]; // 0-6, Sunday-Saturday
        endDate?: string;
    };
    
    // Smart Views
    energy: 'low' | 'medium' | 'high';
    context: string[]; // @home, @office, @calls, etc.
    
    completedAt?: string;
}

// Project interfaces
export interface Project extends BaseSecondBrainDocument {
    title: string;
    description?: string;
    status: 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
    
    // Timeline
    startDate?: string;
    endDate?: string;
    deadline?: string;
    
    // Relationships
    goal?: string;
    tasks: string[];
    notes: string[];
    people: string[]; // Collaborators
    
    // Progress
    completionPercentage: number;
    
    completedAt?: string;
}

// Note interfaces
export interface Note extends BaseSecondBrainDocument {
    title: string;
    content: string; // Rich text content
    type: 'general' | 'meeting' | 'book' | 'research' | 'template';
    
    // Relationships
    project?: string;
    tasks: string[]; // Linked tasks
    people: string[]; // Related people
    
    // Organization
    isFavorite: boolean;
    isPinned: boolean;
    template?: {
        isTemplate: boolean;
        templateName?: string;
        templateDescription?: string;
    };
    
    lastAccessedAt?: string;
}

// Person interfaces
export interface Person extends BaseSecondBrainDocument {
    // Basic Info
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    
    // Personal Details
    birthday?: string;
    company?: string;
    position?: string;
    
    // Contact Management
    lastContacted?: string;
    nextContactDate?: string;
    contactFrequency?: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
    
    // Relationships
    relationship: 'family' | 'friend' | 'colleague' | 'client' | 'mentor' | 'other';
    
    // Linked Data
    projects: string[];
    tasks: string[];
    notes: string[]; // Meeting notes, etc.
    
    // Social/Professional
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        website?: string;
        other?: string[];
    };
    
    // Notes
    bio?: string;
    personalNotes?: string;
    
    // Virtual field
    fullName?: string;
}

// Goal interfaces
export interface Goal extends BaseSecondBrainDocument {
    title: string;
    description?: string;
    category: 'personal' | 'career' | 'health' | 'financial' | 'learning' | 'other';
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    
    // Timeline
    targetDate?: string;
    startDate?: string;
    
    // Progress
    progress: number; // 0-100
    milestones: {
        title: string;
        description?: string;
        targetDate?: string;
        completed: boolean;
        completedAt?: string;
    }[];
    
    // Relationships
    projects: string[];
    tasks: string[];
    
    completedAt?: string;
}

// Habit interfaces
export interface Habit extends BaseSecondBrainDocument {
    name: string;
    description?: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    
    // Tracking
    currentStreak: number;
    longestStreak: number;
    lastCompleted?: string;
    
    // Configuration
    target?: number; // Target per frequency period
    unit?: string; // e.g., "minutes", "pages", "glasses"
    
    // Schedule
    schedule?: {
        daysOfWeek?: number[]; // For weekly habits
        timeOfDay?: string; // Preferred time
        reminder?: boolean;
    };
    
    // Progress
    completions: {
        date: string;
        value?: number; // For quantifiable habits
        notes?: string;
    }[];
    
    isActive: boolean;
}

// Journal interfaces
export interface Journal extends BaseSecondBrainDocument {
    date: string; // Date of the entry
    title?: string;
    content: string;
    
    // Mood tracking
    mood?: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
    energy?: 'high' | 'medium' | 'low';
    
    // Weather/Context
    weather?: string;
    location?: string;
    
    // Relationships
    tasks: string[]; // Tasks mentioned/completed
    people: string[]; // People mentioned
    
    // Gratitude/Reflection
    gratitude?: string[];
    highlights?: string[];
    improvements?: string[];
    
    isPrivate: boolean;
}

// Book interfaces
export interface Book extends BaseSecondBrainDocument {
    title: string;
    author: string;
    isbn?: string;
    
    // Reading Status
    status: 'want_to_read' | 'reading' | 'completed' | 'paused' | 'abandoned';
    
    // Progress
    totalPages?: number;
    currentPage?: number;
    progress: number; // 0-100
    
    // Dates
    startedAt?: string;
    finishedAt?: string;
    
    // Rating & Review
    rating?: number; // 1-5
    review?: string;
    
    // Categorization
    genre?: string;
    category: 'fiction' | 'non-fiction' | 'technical' | 'biography' | 'other';
    
    // Notes & Quotes
    notes: string[]; // Note IDs
    quotes: {
        text: string;
        page?: number;
        chapter?: string;
        notes?: string;
    }[];
    
    // Metadata
    coverUrl?: string;
    publisher?: string;
    publishedDate?: string;
    language?: string;
}

// Content interfaces (for content creation/consumption tracking)
export interface Content extends BaseSecondBrainDocument {
    title: string;
    type: 'article' | 'video' | 'podcast' | 'course' | 'tutorial' | 'other';
    url?: string;
    
    // Status
    status: 'to_consume' | 'consuming' | 'completed' | 'archived';
    
    // Progress
    progress: number; // 0-100
    duration?: number; // in minutes
    timeSpent?: number; // in minutes
    
    // Content details
    author?: string;
    source?: string; // Platform/website
    description?: string;
    
    // Learning
    category: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    
    // Rating & Notes
    rating?: number; // 1-5
    notes: string[]; // Note IDs
    keyTakeaways?: string[];
    
    // Dates
    startedAt?: string;
    completedAt?: string;
    
    // Metadata
    thumbnailUrl?: string;
    estimatedDuration?: number;
}

// Finance interfaces
export interface Finance extends BaseSecondBrainDocument {
    title: string;
    type: 'income' | 'expense' | 'investment' | 'goal' | 'budget';
    
    // Amount
    amount: number;
    currency: string;
    
    // Categorization
    category: string;
    subcategory?: string;
    
    // Transaction details
    date: string;
    description?: string;
    account?: string;
    
    // Recurring
    isRecurring: boolean;
    recurrencePattern?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval: number;
        endDate?: string;
    };
    
    // Goals/Budgets specific
    targetAmount?: number;
    currentAmount?: number;
    targetDate?: string;
    
    // Metadata
    receipt?: string; // File URL
    notes?: string;
    isPlanned: boolean; // vs actual
}

// Mood interfaces
export interface Mood extends BaseSecondBrainDocument {
    date: string;
    
    // Primary mood
    mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
    energy: 'high' | 'medium' | 'low';
    
    // Detailed tracking
    emotions?: string[]; // happy, sad, anxious, excited, etc.
    intensity: number; // 1-10
    
    // Context
    triggers?: string[];
    activities?: string[];
    location?: string;
    weather?: string;
    
    // Sleep & Health
    sleepHours?: number;
    sleepQuality?: 'excellent' | 'good' | 'fair' | 'poor';
    
    // Notes
    notes?: string;
    gratitude?: string[];
    
    // Relationships
    journalEntry?: string; // Journal ID
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Quick Capture types
export interface QuickCaptureData {
    type: 'task' | 'note' | 'idea';
    title: string;
    content?: string;
    tags?: string[];
    area?: 'projects' | 'areas' | 'resources' | 'archive';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
}

// Dashboard types
export interface DashboardData {
    todayTasks: Task[];
    upcomingDeadlines: Task[];
    activeProjects: Project[];
    recentNotes: Note[];
    currentGoals: Goal[];
    todayHabits: Habit[];
    moodEntry?: Mood;
    weeklyStats: {
        tasksCompleted: number;
        projectsActive: number;
        notesCreated: number;
        habitsCompleted: number;
    };
}

export interface MyDayData {
    date: Date;
    plannedTasks: Task[];
    inProgressTasks: Task[];
    todayHabits: Habit[];
    journalEntry?: Journal;
    moodEntry?: Mood;
}
