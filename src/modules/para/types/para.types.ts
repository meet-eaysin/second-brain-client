// PARA Method types
// PARA = Projects, Areas, Resources, Archive

export interface ParaProject {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  areaId?: string; // Which area this project belongs to
  tags?: string[];
  tasks?: string[]; // Task IDs
  resources?: string[]; // Resource IDs
  notes?: string;
  progress?: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface ParaArea {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'inactive';
  color?: string;
  icon?: string;
  projects?: string[]; // Project IDs
  resources?: string[]; // Resource IDs
  standards?: string; // Standards of maintenance
  responsibilities?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ParaResource {
  id: string;
  title: string;
  description?: string;
  type: 'article' | 'book' | 'video' | 'course' | 'tool' | 'template' | 'reference' | 'other';
  url?: string;
  filePath?: string;
  tags?: string[];
  category?: string;
  source?: string;
  dateAdded: string;
  lastAccessed?: string;
  rating?: number; // 1-5
  notes?: string;
  isArchived: boolean;
  projectIds?: string[]; // Which projects use this resource
  areaIds?: string[]; // Which areas this resource relates to
}

export interface ParaArchiveItem {
  id: string;
  originalId: string;
  originalType: 'project' | 'area' | 'resource';
  title: string;
  description?: string;
  archivedDate: string;
  archivedReason?: string;
  originalData: ParaProject | ParaArea | ParaResource;
  tags?: string[];
}

export interface ParaStats {
  projects: {
    total: number;
    active: number;
    completed: number;
    onHold: number;
    cancelled: number;
  };
  areas: {
    total: number;
    active: number;
    inactive: number;
  };
  resources: {
    total: number;
    byType: Record<ParaResource['type'], number>;
    archived: number;
  };
  archive: {
    total: number;
    byType: Record<ParaArchiveItem['originalType'], number>;
  };
}

export interface ParaFilters {
  status?: string[];
  priority?: string[];
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  search?: string;
}

export interface ParaContextValue {
  projects: ParaProject[];
  areas: ParaArea[];
  resources: ParaResource[];
  archive: ParaArchiveItem[];
  stats: ParaStats;
  filters: ParaFilters;
  isLoading: boolean;
  error: string | null;
  setFilters: (filters: ParaFilters) => void;
  refreshData: () => Promise<void>;
}
