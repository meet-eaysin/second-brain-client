import {
  LucideHelpCircle,
  LucideLayoutDashboard,
  LucideUserCog,
  Database as DatabaseIcon,
  Users,
  Shield,
  BookOpen,
  Search,
  FileText,
  Bookmark,
  Bell,
  Settings,
  CheckSquare,
  Target,
  Heart,
  DollarSign,
  BarChart3,
  Repeat,
} from "lucide-react";

export const sidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/app/dashboard",
          icon: LucideLayoutDashboard,
          tooltip: "View your workspace overview and analytics",
        },
        {
          title: "Databases",
          url: "/app/databases",
          icon: DatabaseIcon,
          isDynamic: true,
        },
        {
          title: "Users",
          url: "/app/users",
          icon: Users,
          tooltip: "Manage workspace members and user accounts",
        },
        {
          title: "Notifications",
          url: "/app/notifications",
          icon: Bell,
          tooltip: "View and manage your notifications",
        },
      ],
    },
    {
      title: "Second Brain",
      items: [
        {
          title: "Dashboard",
          url: "/app/second-brain/dashboard",
          icon: BarChart3,
          tooltip: "Central hub for second brain overview and quick access",
        },
        {
          title: "Tasks",
          url: "/app/second-brain/tasks",
          icon: CheckSquare,
          tooltip:
            "Task management with priorities, due dates, and project linking",
        },
        {
          title: "Notes",
          url: "/app/second-brain/notes",
          icon: FileText,
          tooltip: "Knowledge management with rich-text content and linking",
        },
        {
          title: "Projects",
          url: "/app/second-brain/projects",
          icon: Target,
          tooltip:
            "Project management with timelines, goals, and task tracking",
        },
        {
          title: "Goals",
          url: "/app/second-brain/goals",
          icon: Target,
          tooltip:
            "Goal setting and progress tracking with deadlines and milestones",
        },
        {
          title: "People",
          url: "/app/second-brain/people",
          icon: Users,
          tooltip: "Contact management and relationship tracking",
        },
        {
          title: "Finance",
          url: "/app/second-brain/finance",
          icon: DollarSign,
          tooltip:
            "Personal finance tracking with income, expenses, and budgeting",
        },
        {
          title: "Habits",
          url: "/app/second-brain/habits",
          icon: Repeat,
          tooltip:
            "Habit tracking and streak management for personal development",
        },
        {
          title: "Journal",
          url: "/app/second-brain/journal",
          icon: BookOpen,
          tooltip: "Daily journaling and reflection with mood tracking",
        },
        {
          title: "Mood Tracker",
          url: "/app/second-brain/mood-tracker",
          icon: Heart,
          tooltip: "Track daily moods and emotional patterns",
        },
        {
          title: "Resources",
          url: "/app/second-brain/resources",
          icon: Bookmark,
          tooltip: "Knowledge resources, bookmarks, and reference materials",
        },
        {
          title: "Search",
          url: "/app/second-brain/search",
          icon: Search,
          tooltip: "Search across all Second Brain modules",
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "Admin Dashboard",
          url: "/app/admin",
          icon: Shield,
        },
        {
          title: "User Management",
          url: "/app/admin/users",
          icon: LucideUserCog,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          url: "/app/settings",
          icon: Settings,
          tooltip: "Manage your account, preferences, and workspace settings",
        },
        {
          title: "Help Center",
          url: "/help-center",
          icon: LucideHelpCircle,
        },
      ],
    },
  ],
};
