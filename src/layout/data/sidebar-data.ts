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
  CheckSquare,
  Target,
  DollarSign,
  BarChart3,
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
          title: "CalendarTypes",
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
          title: "People",
          url: "/app/second-brain/people",
          icon: Users,
        },
        {
          title: "Finance",
          url: "/app/second-brain/finances",
          icon: DollarSign,
        },
        {
          title: "Journal",
          url: "/app/second-brain/journal",
          icon: BookOpen,
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
      title: "Settings",
      items: [
        {
          title: "Profile",
          url: "/app/settings/profile",
          icon: LucideUserCog,
          tooltip: "Manage your personal information and preferences",
        },
        {
          title: "Security",
          url: "/app/settings/security",
          icon: Shield,
          tooltip: "Password, 2FA, and security settings",
        },
        {
          title: "Appearance",
          url: "/app/settings/appearance",
          icon: LucideLayoutDashboard,
          tooltip: "Theme, layout, and visual preferences",
        },
        {
          title: "Notifications",
          url: "/app/settings/notifications",
          icon: Bell,
          tooltip: "Email, push, and in-app notifications",
        },
        {
          title: "Workspace",
          url: "/app/settings/workspace",
          icon: Users,
          tooltip: "Team settings and permissions",
        },
        {
          title: "Billing",
          url: "/app/settings/billing",
          icon: DollarSign,
          tooltip: "Subscription and billing information",
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Help Center",
          url: "/app/help-center",
          icon: LucideHelpCircle,
        },
      ],
    },
  ],
};
