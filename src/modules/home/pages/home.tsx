import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Clock,
} from "lucide-react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { formatDistanceToNow } from "date-fns";
import { useWorkspace } from "@/modules/workspaces/context";
import { useNavigate } from "react-router-dom";

// Mock demo data
const mockDashboardData = {
  recentActivity: [
    {
      id: "1",
      title: "New note created",
      description: "Added a new note about project planning",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2",
      title: "Task completed",
      description: "Finished reviewing quarterly goals",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      title: "File uploaded",
      description: "Uploaded presentation slides for team meeting",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    },
    {
      id: "4",
      title: "Goal updated",
      description: "Updated progress on Q4 objectives",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
    {
      id: "5",
      title: "Collaboration started",
      description: "Began collaborating on research document",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    },
  ],
  workspaceStats: {
    totalNotes: 1247,
    totalTasks: 89,
    activeProjects: 12,
    completedGoals: 34,
    systemUptime: "99.9%",
    lastBackup: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  recentlyVisited: [
    {
      id: "1",
      name: "Notes",
      type: "page",
      preview: "View and manage your knowledge base",
      lastVisitedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: "📝",
      color: "#3b82f6",
      route: "/notes",
      moduleType: "notes",
    },
    {
      id: "2",
      name: "Tasks",
      type: "page",
      preview: "Track and manage your tasks",
      lastVisitedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      icon: "✅",
      color: "#10b981",
      route: "/tasks",
      moduleType: "tasks",
    },
    {
      id: "3",
      name: "Goals",
      type: "page",
      preview: "Set and track your objectives",
      lastVisitedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      icon: "🎯",
      color: "#8b5cf6",
      route: "/goals",
      moduleType: "goals",
    },
    {
      id: "4",
      name: "Projects",
      type: "page",
      preview: "Manage your projects and initiatives",
      lastVisitedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      icon: "📁",
      color: "#f59e0b",
      route: "/projects",
      moduleType: "projects",
    },
    {
      id: "5",
      name: "Habits",
      type: "page",
      preview: "Build and maintain good habits",
      lastVisitedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      icon: "🔥",
      color: "#ef4444",
      route: "/habits",
      moduleType: "habits",
    },
    {
      id: "6",
      name: "Finance",
      type: "page",
      preview: "Track income and expenses",
      lastVisitedAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      icon: "💰",
      color: "#059669",
      route: "/finance",
      moduleType: "finance",
    },
  ],
};

export function HomePage() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  // Using mock data instead of API call
  const dashboardData = mockDashboardData;
  const isLoading = false;

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <>
        <EnhancedHeader />
        <Main className="space-y-8">
          {/* Header Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
                <div className="h-6 w-64 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-9 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-9 w-16 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
            <div className="h-12 w-full max-w-md bg-muted animate-pulse rounded"></div>
          </div>

          {/* Recent Activity Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="border rounded-lg p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded mt-1"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recently Visited Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-36 bg-muted animate-pulse rounded"></div>
              <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted animate-pulse rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-2/3 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-20 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="border rounded-lg p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-12 bg-muted animate-pulse rounded"></div>
                        <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Events Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
              <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="border rounded-lg p-6">
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3">
                    <div className="w-4 h-4 bg-muted animate-pulse rounded mt-1"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                        <div className="h-5 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learn Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-80 border rounded-lg overflow-hidden"
                >
                  <div className="h-32 bg-muted animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 w-3/4 bg-muted animate-pulse rounded"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-5/6 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-4/6 bg-muted animate-pulse rounded"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="h-6 w-12 bg-muted animate-pulse rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Main>
      </>
    );
  }

  const { recentActivity, recentlyVisited } = dashboardData;

  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{getGreeting()}!</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back
                {currentWorkspace && (
                  <span className="font-medium">
                    {" "}
                    to {currentWorkspace.name}
                  </span>
                )}
                .
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg"
                    >
                      <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(activity.timestamp, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No recent activity
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recently Visited */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recently Visited</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentlyVisited && recentlyVisited.length > 0 ? (
              recentlyVisited.slice(0, 6).map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(item.route)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{
                          backgroundColor: `${item.color}20`,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">
                          {item.name}
                        </h3>
                        {item.preview && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.preview}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            Last visited{" "}
                            {formatDistanceToNow(item.lastVisitedAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No recently visited items
                </p>
              </div>
            )}
          </div>
        </div>

        {/* System Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">System Activity</h2>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg">
                  <Activity className="h-4 w-4 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      System backup completed
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg">
                  <Users className="h-4 w-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">New user registered</p>
                    <p className="text-xs text-muted-foreground">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Content sync completed
                    </p>
                    <p className="text-xs text-muted-foreground">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      Scheduled maintenance finished
                    </p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learn */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learn</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            <Card className="flex-shrink-0 w-80 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                    Guide
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-base leading-tight mb-2">
                  Getting Started Guide
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Learn the basics of organizing your knowledge and building
                  effective workflows in your Second Brain.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    5 min read
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs p-0 h-auto"
                  >
                    Read →
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="flex-shrink-0 w-80 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-green-400 to-green-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                    Strategy
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-base leading-tight mb-2">
                  Goal Setting Best Practices
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Discover proven strategies for setting and achieving
                  meaningful goals that drive real results.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    7 min read
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs p-0 h-auto"
                  >
                    Read →
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="flex-shrink-0 w-80 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-purple-400 to-purple-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                    Productivity
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-base leading-tight mb-2">
                  Task Management Techniques
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Master different approaches to organizing and completing your
                  tasks efficiently and effectively.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    6 min read
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs p-0 h-auto"
                  >
                    Read →
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="flex-shrink-0 w-80 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 relative">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                    Habits
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-base leading-tight mb-2">
                  Building Lasting Habits
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Learn how to create sustainable habits that support your
                  long-term success and personal growth.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    8 min read
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs p-0 h-auto"
                  >
                    Read →
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Main>
    </>
  );
}
