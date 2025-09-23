import { apiClient } from "@/services/api-client.ts";
import type { ApiResponse } from "@/types/api.types";

// Types
export interface QuickCaptureData {
  type: "task" | "note" | "idea";
  title: string;
  content?: string;
  tags?: string[];
  area?: "projects" | "areas" | "resources" | "archive";
  priority?: "low" | "medium" | "high" | "urgent";
}

// Import types from the server-side dashboard types
export interface DashboardTask {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  project?: string;
  assignedTo?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardProject {
  _id: string;
  title: string;
  status: "planning" | "active" | "on-hold" | "completed" | "cancelled";
  description?: string;
  startDate?: string;
  endDate?: string;
  progress: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardNote {
  _id: string;
  title: string;
  content?: string;
  tags: string[];
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardGoal {
  _id: string;
  title: string;
  type: "outcome" | "process" | "learning";
  status: "active" | "completed" | "paused" | "cancelled";
  targetDate?: string;
  progressPercentage: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardHabit {
  _id: string;
  name: string;
  frequency: "daily" | "weekly" | "monthly";
  status: "active" | "paused" | "completed";
  streak: number;
  completedToday: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMoodEntry {
  _id: string;
  mood: number;
  energy: number;
  notes?: string;
  tags: string[];
  date: string;
  createdAt: string;
}

export interface DashboardData {
  todayTasks: DashboardTask[];
  upcomingDeadlines: DashboardTask[];
  activeProjects: DashboardProject[];
  recentNotes: DashboardNote[];
  currentGoals: DashboardGoal[];
  todayHabits: DashboardHabit[];
  moodEntry?: DashboardMoodEntry;
  weeklyStats: {
    tasksCompleted: number;
    projectsActive: number;
    notesCreated: number;
    habitsCompleted: number;
  };
}

export interface DashboardJournalEntry {
  _id: string;
  title?: string;
  content: string;
  mood?: number;
  tags: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardPerson {
  _id: string;
  name: string;
  email?: string;
  role?: string;
  company?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MyDayData {
  date: Date;
  plannedTasks: DashboardTask[];
  inProgressTasks: DashboardTask[];
  todayHabits: DashboardHabit[];
  journalEntry?: DashboardJournalEntry;
  moodEntry?: DashboardMoodEntry;
}

export interface SearchResults {
  tasks?: DashboardTask[];
  notes?: DashboardNote[];
  projects?: DashboardProject[];
  people?: DashboardPerson[];
}

// Helper function to handle API calls with fallback to mock data
const apiCallWithFallback = async (
  apiCall: () => Promise<any>,
  fallbackData: any
) => {
  try {
    const response = await apiCall();
    return response;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("🔄 Second-brain API call failed, using mock data:", error);
      console.warn(
        "📍 This suggests the server endpoint may not be implemented yet"
      );
      return { data: fallbackData };
    }
    throw error;
  }
};

// API Service
export const secondBrainApi = {
  // Quick Capture
  quickCapture: async (data: QuickCaptureData) => {
    return apiCallWithFallback(
      () =>
        apiClient.post<ApiResponse<{ message: string }>>(
          "/second-brain/quick-capture",
          data
        ),
      { message: "Item captured successfully" }
    );
  },

  // Dashboard
  getDashboard: async (params?: any): Promise<{ data: any }> => {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.DASHBOARD.BASE,
      { params }
    );
    return { data: response.data.data };
  },

  // My Day
  getMyDay: async (): Promise<{ data: MyDayData }> => {
    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<MyDayData>>("/second-brain/my-day")
          .then((res) => ({ data: res.data.data })),
      {
        date: new Date(),
        plannedTasks: mockData.tasks.slice(0, 3),
        inProgressTasks: mockData.tasks.filter(
          (t) => t.status === "in-progress"
        ),
        todayHabits: mockData.habits,
        journalEntry: null,
        moodEntry: null,
      }
    );
  },

  // Get recent captures
  getRecentCaptures: async (limit: number = 20): Promise<{ data: any[] }> => {
    return apiCallWithFallback(
      async () => {
        // Fetch recent tasks, notes, and ideas in parallel
        const [tasksRes, notesRes] = await Promise.all([
          apiClient.get<ApiResponse<{ tasks: any[] }>>("/second-brain/tasks", {
            params: {
              limit: Math.ceil(limit / 2),
              sort: "createdAt",
              order: "desc",
            },
          }),
          apiClient.get<ApiResponse<{ notes: any[] }>>("/second-brain/notes", {
            params: {
              limit: Math.ceil(limit / 2),
              sort: "createdAt",
              order: "desc",
            },
          }),
        ]);

        const tasks = tasksRes.data.data.tasks.map((task: any) => ({
          ...task,
          type: "task",
          capturedAt: task.createdAt,
        }));

        const notes = notesRes.data.data.notes.map((note: any) => ({
          ...note,
          type: note.type || "note",
          capturedAt: note.createdAt,
        }));

        // Combine and sort by creation date
        const allItems = [...tasks, ...notes]
          .sort(
            (a, b) =>
              new Date(b.capturedAt).getTime() -
              new Date(a.capturedAt).getTime()
          )
          .slice(0, limit);

        return { data: allItems };
      },
      { data: [] }
    );
  },

  // Global Search
  search: async (
    query: string,
    type?: string,
    limit?: number
  ): Promise<{ data: SearchResults }> => {
    const params = new URLSearchParams({ query });
    if (type) params.append("type", type);
    if (limit) params.append("limit", limit.toString());

    return apiCallWithFallback(
      () =>
        apiClient
          .get<ApiResponse<SearchResults>>(`/second-brain/search?${params}`)
          .then((res) => ({ data: res.data.data })),
      {
        tasks: mockData.tasks.filter((t) =>
          t.title.toLowerCase().includes(query.toLowerCase())
        ),
        notes: mockData.notes.filter((n) =>
          n.title.toLowerCase().includes(query.toLowerCase())
        ),
        projects: mockData.projects.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase())
        ),
        people: mockData.people.filter((p) =>
          `${p.firstName} ${p.lastName}`
            .toLowerCase()
            .includes(query.toLowerCase())
        ),
      }
    );
  },

  // Tasks
  tasks: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () =>
          apiClient
            .get<ApiResponse<{ tasks: any[] }>>("/second-brain/tasks", {
              params,
            })
            .then((res) => ({ data: res.data.data })),
        { tasks: mockData.tasks }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () =>
          apiClient
            .get<ApiResponse<any>>(`/second-brain/tasks/${id}`)
            .then((res) => res.data.data),
        mockData.tasks.find((t) => t._id === id) || mockData.tasks[0]
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () =>
          apiClient
            .post<ApiResponse<any>>("/second-brain/tasks", data)
            .then((res) => res.data.data),
        {
          ...data,
          _id: Date.now().toString(),
          status: "todo",
          createdAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () =>
          apiClient
            .patch<ApiResponse<any>>(`/second-brain/tasks/${id}`, data)
            .then((res) => res.data.data),
        { ...mockData.tasks.find((t) => t._id === id), ...data }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () =>
          apiClient
            .delete<ApiResponse<{ message: string }>>(
              `/second-brain/tasks/${id}`
            )
            .then((res) => res.data.data),
        { message: "Task deleted successfully" }
      );
    },

    bulkUpdate: async (taskIds: string[], updates: any) => {
      return apiCallWithFallback(
        () =>
          apiClient
            .patch<ApiResponse<{ message: string; updatedCount: number }>>(
              "/second-brain/tasks/bulk",
              { taskIds, updates }
            )
            .then((res) => res.data.data),
        { message: "Tasks updated successfully", updatedCount: taskIds.length }
      );
    },
  },

  // Projects
  projects: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () => apiClient.get("/second-brain/projects", { params }),
        { projects: mockData.projects }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.get(`/second-brain/projects/${id}`),
        mockData.projects.find((p) => p._id === id) || mockData.projects[0]
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () => apiClient.post("/second-brain/projects", data),
        {
          ...data,
          _id: Date.now().toString(),
          status: "planning",
          completionPercentage: 0,
          createdAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () => apiClient.patch(`/second-brain/projects/${id}`, data),
        { ...mockData.projects.find((p) => p._id === id), ...data }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.delete(`/second-brain/projects/${id}`),
        { message: "Project deleted successfully" }
      );
    },
  },

  // Notes
  notes: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () => apiClient.get("/second-brain/notes", { params }),
        { notes: mockData.notes }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.get(`/second-brain/notes/${id}`),
        mockData.notes.find((n) => n._id === id) || mockData.notes[0]
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () => apiClient.post("/second-brain/notes", data),
        {
          ...data,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () => apiClient.patch(`/second-brain/notes/${id}`, data),
        {
          ...mockData.notes.find((n) => n._id === id),
          ...data,
          updatedAt: new Date().toISOString(),
        }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.delete(`/second-brain/notes/${id}`),
        { message: "Note deleted successfully" }
      );
    },
  },

  // People
  people: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () => apiClient.get("/second-brain/people", { params }),
        { people: mockData.people }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.get(`/second-brain/people/${id}`),
        mockData.people.find((p) => p._id === id) || mockData.people[0]
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () => apiClient.post("/second-brain/people", data),
        {
          ...data,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () => apiClient.patch(`/second-brain/people/${id}`, data),
        { ...mockData.people.find((p) => p._id === id), ...data }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.delete(`/second-brain/people/${id}`),
        { message: "Person deleted successfully" }
      );
    },
  },

  // Goals
  goals: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () => apiClient.get("/second-brain/goals", { params }),
        { goals: mockData.goals }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.get(`/second-brain/goals/${id}`),
        mockData.goals.find((g) => g._id === id) || mockData.goals[0]
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () => apiClient.post("/second-brain/goals", data),
        {
          ...data,
          _id: Date.now().toString(),
          progress: 0,
          status: "active",
          createdAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () => apiClient.patch(`/second-brain/goals/${id}`, data),
        { ...mockData.goals.find((g) => g._id === id), ...data }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.delete(`/second-brain/goals/${id}`),
        { message: "Goal deleted successfully" }
      );
    },
  },

  // Habits
  habits: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () => apiClient.get("/second-brain/habits", { params }),
        { habits: mockData.habits }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.get(`/second-brain/habits/${id}`),
        mockData.habits.find((h) => h._id === id) || mockData.habits[0]
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () => apiClient.post("/second-brain/habits", data),
        {
          ...data,
          _id: Date.now().toString(),
          streak: 0,
          isActive: true,
          completedToday: false,
          createdAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () => apiClient.patch(`/second-brain/habits/${id}`, data),
        { ...mockData.habits.find((h) => h._id === id), ...data }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.delete(`/second-brain/habits/${id}`),
        { message: "Habit deleted successfully" }
      );
    },

    trackEntry: async (id: string, entry: any) => {
      return apiCallWithFallback(
        () => apiClient.post(`/second-brain/habits/${id}/entries`, entry),
        {
          message: "Habit entry tracked successfully",
          streak: Math.floor(Math.random() * 30) + 1,
        }
      );
    },
  },

  // Journal
  journal: {
    getAll: async (params?: any) => {
      return apiCallWithFallback(
        () => apiClient.get("/second-brain/journal", { params }),
        { entries: [] }
      );
    },

    getById: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.get(`/second-brain/journal/${id}`),
        {
          _id: id,
          content: "Sample journal entry...",
          date: new Date().toISOString(),
          mood: "good",
        }
      );
    },

    create: async (data: any) => {
      return apiCallWithFallback(
        () => apiClient.post("/second-brain/journal", data),
        {
          ...data,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
      );
    },

    update: async (id: string, data: any) => {
      return apiCallWithFallback(
        () => apiClient.patch(`/second-brain/journal/${id}`, data),
        { _id: id, ...data, updatedAt: new Date().toISOString() }
      );
    },

    delete: async (id: string) => {
      return apiCallWithFallback(
        () => apiClient.delete(`/second-brain/journal/${id}`),
        { message: "Journal entry deleted successfully" }
      );
    },
  },

  // Books
  books: {
    getAll: async (params?: any) => {
      const response = await apiClient.get("/second-brain/books", { params });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get(`/second-brain/books/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await apiClient.post("/second-brain/books", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await apiClient.patch(`/second-brain/books/${id}`, data);
      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/second-brain/books/${id}`);
      return response.data;
    },

    addNote: async (id: string, note: any) => {
      const response = await apiClient.post(
        `/second-brain/books/${id}/notes`,
        note
      );
      return response.data;
    },
  },

  // Content
  content: {
    getAll: async (params?: any) => {
      const response = await apiClient.get("/second-brain/content", { params });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get(`/second-brain/content/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await apiClient.post("/second-brain/content", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await apiClient.patch(
        `/second-brain/content/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/second-brain/content/${id}`);
      return response.data;
    },
  },

  // Finances
  finances: {
    getAll: async (params?: any) => {
      const response = await apiClient.get("/second-brain/finances", {
        params,
      });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get(`/second-brain/finances/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await apiClient.post("/second-brain/finances", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await apiClient.patch(
        `/second-brain/finances/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/second-brain/finances/${id}`);
      return response.data;
    },
  },

  // Mood
  mood: {
    getAll: async (params?: any) => {
      const response = await apiClient.get("/second-brain/mood", { params });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await apiClient.get(`/second-brain/mood/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await apiClient.post("/second-brain/mood", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await apiClient.patch(`/second-brain/mood/${id}`, data);
      return response.data;
    },

    delete: async (id: string) => {
      const response = await apiClient.delete(`/second-brain/mood/${id}`);
      return response.data;
    },
  },
};
