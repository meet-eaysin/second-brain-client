import {
  LucideHelpCircle,
  LucideLayoutDashboard,
  LucideUserCog,
  Database as DatabaseIcon,
  Users,
  Shield,
  BookOpen,
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
  Calendar,
} from "lucide-react";

export const sidebarData = {
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Home",
          url: "/app",
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
          title: "Calendar",
          url: "/app/calendar",
          icon: Calendar,
          tooltip: "Manage your events, meetings, and schedule",
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
        },
        {
          title: "Tasks",
          url: "/app/second-brain/tasks",
          icon: CheckSquare,
        },
        {
          title: "Notes",
          url: "/app/second-brain/notes",
          icon: FileText,
        },
        {
          title: "Projects",
          url: "/app/second-brain/projects",
          icon: Target,
        },
        {
          title: "Goals",
          url: "/app/second-brain/goals",
          icon: Target,
        },
        {
          title: "People",
          url: "/app/second-brain/people",
          icon: Users,
        },
        {
          title: "Finance",
          url: "/app/second-brain/finance",
          icon: DollarSign,
        },
        {
          title: "Habits",
          url: "/app/second-brain/habits",
          icon: Repeat,
        },
        {
          title: "Journal",
          url: "/app/second-brain/journal",
          icon: BookOpen,
        },
        {
          title: "Mood",
          url: "/app/second-brain/mood-tracker",
          icon: Heart,
        },
        {
          title: "Resources",
          url: "/app/second-brain/resources",
          icon: Bookmark,
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
