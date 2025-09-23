import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Activity, Calendar } from "lucide-react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { useDashboardOverview } from "../services/dashboard-queries";
import { useUpcomingEvents } from "@/modules/calendar/services/calendar-queries";
import { DatabaseView, EDatabaseType } from "@/modules/database-view";
import { formatDistanceToNow, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useWorkspace } from "@/modules/workspaces/context";

export function HomePage() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useDashboardOverview();

  const { data: upcomingEvents, isLoading: isLoadingEvents } =
    useUpcomingEvents({ limit: 5 });

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  // Navigation handlers
  const handleQuickAction = (action: string) => {
    switch (action) {
      case "task":
        navigate("/app/second-brain/tasks");
        break;
      case "note":
        navigate("/app/second-brain/notes");
        break;
      case "goal":
        navigate("/app/second-brain/goals");
        break;
      case "habit":
        navigate("/app/second-brain/habits");
        break;
      case "finance":
        navigate("/app/second-brain/finance");
        break;
      case "journal":
        navigate("/app/second-brain/journal");
        break;
      default:
        toast.info("Feature coming soon!");
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Dashboard refreshed");
    } catch (error) {
      toast.error("Failed to refresh dashboard");
    }
  };

  const handleViewAll = (section: string) => {
    switch (section) {
      case "notes":
        navigate("/app/second-brain/notes");
        break;
      case "goals":
        navigate("/app/second-brain/goals");
        break;
      case "habits":
        navigate("/app/second-brain/habits");
        break;
      case "tasks":
        navigate("/app/second-brain/tasks");
        break;
      case "activity":
        // Could navigate to activity page or show modal
        toast.info("Activity page coming soon!");
        break;
      default:
        break;
    }
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">
            Failed to load dashboard data
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Please check your connection and try again
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={handleRefresh}>
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const {
    quickStats,
    recentActivity,
    upcomingTasks,
    recentNotes,
    goalProgress,
    habitStreaks,
    financeSummary,
    workspaceStats,
  } = dashboardData || {};

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

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewAll("tasks")}
            >
              View All
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              {upcomingTasks && upcomingTasks.length > 0 ? (
                <div className="space-y-3">
                  {upcomingTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg"
                      onClick={() => navigate("/app/second-brain/tasks")}
                    >
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {task.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              task.priority === "urgent"
                                ? "destructive"
                                : task.priority === "high"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {task.daysUntilDue === 0
                              ? "Today"
                              : task.daysUntilDue === 1
                              ? "Tomorrow"
                              : `In ${task.daysUntilDue} days`}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    No upcoming tasks
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction("task")}
                  >
                    Create Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/app/calendar")}
            >
              View Calendar
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              {isLoadingEvents ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 p-3">
                      <div className="w-4 h-4 bg-muted animate-pulse rounded mt-1"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                        <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg"
                      onClick={() => navigate("/app/calendar")}
                    >
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{event.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {event.isAllDay
                              ? format(event.startTime, "MMM d, yyyy")
                              : format(event.startTime, "MMM d, h:mm a")}
                          </span>
                          {event.location && (
                            <Badge variant="outline" className="text-xs">
                              📍 {event.location}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    No upcoming events
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/app/calendar")}
                  >
                    Create Event
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Activity */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">System Activity</h2>
              <p className="text-muted-foreground">
                Monitor system-wide activities and events
              </p>
            </div>
          </div>
          <DatabaseView moduleType={EDatabaseType.ACTIVITY} />
        </div>

        {/* System Analytics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">System Analytics</h2>
              <p className="text-muted-foreground">
                Comprehensive analytics and insights
              </p>
            </div>
          </div>
          <DatabaseView moduleType={EDatabaseType.ANALYSIS} />
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
