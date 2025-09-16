// Content Hub types
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  type: 'article' | 'video' | 'podcast' | 'book' | 'course' | 'tool' | 'website' | 'document' | 'other';
  url?: string;
  filePath?: string;
  thumbnail?: string;
  author?: string;
  source?: string;
  tags?: string[];
  category?: string;
  status: 'to-consume' | 'consuming' | 'consumed' | 'archived';
  priority: 'low' | 'medium' | 'high';
  rating?: number; // 1-5
  notes?: string;
  highlights?: string[];
  dateAdded: string;
  dateStarted?: string;
  dateCompleted?: string;
  estimatedTime?: number; // minutes
  actualTime?: number; // minutes
  progress?: number; // 0-100
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentFormData {
  title: string;
  description?: string;
  type: ContentItem['type'];
  url?: string;
  author?: string;
  source?: string;
  tags?: string[];
  category?: string;
  status: ContentItem['status'];
  priority: ContentItem['priority'];
  estimatedTime?: number;
  notes?: string;
}

export interface ContentFilters {
  type?: ContentItem['type'][];
  status?: ContentItem['status'][];
  priority?: ContentItem['priority'][];
  category?: string[];
  tags?: string[];
  author?: string[];
  isFavorite?: boolean;
  dateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

export interface ContentStats {
  totalItems: number;
  consumedItems: number;
  inProgressItems: number;
  toConsumeItems: number;
  favoriteItems: number;
  byType: Record<ContentItem['type'], number>;
  byCategory: Record<string, number>;
  averageRating: number;
  totalTimeSpent: number;
}

export interface ContentHubPageProps {
  className?: string;
}

export interface ContentContextValue {
  content: ContentItem[];
  filters: ContentFilters;
  selectedContent: ContentItem | null;
  isLoading: boolean;
  error: string | null;
  stats: ContentStats;
  setFilters: (filters: ContentFilters) => void;
  setSelectedContent: (content: ContentItem | null) => void;
  createContent: (content: ContentFormData) => Promise<void>;
  updateContent: (id: string, updates: Partial<ContentItem>) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  refreshContent: () => Promise<void>;
}
