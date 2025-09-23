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
  Archive,
  FolderOpen,
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
      ],
    },
    {
      title: "PARA Method",
      items: [
        {
          title: "PARA Overview",
          url: "/app/second-brain/para",
          icon: FolderOpen,
          tooltip:
            "Overview of your PARA system (Projects, Areas, Resources, Archive)",
        },
        {
          title: "Projects",
          url: "/app/second-brain/para/projects",
          icon: Target,
          tooltip: "Active projects that require action",
        },
        {
          title: "Areas",
          url: "/app/second-brain/para/areas",
          icon: Users,
          tooltip: "Areas of responsibility and interest",
        },
        {
          title: "Resources",
          url: "/app/second-brain/para/resources",
          icon: Bookmark,
          tooltip: "Reference materials and resources",
        },
        {
          title: "Archive",
          url: "/app/second-brain/para/archive",
          icon: Archive,
          tooltip: "Completed or inactive items",
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
