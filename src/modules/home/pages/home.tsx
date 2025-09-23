import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, FileText } from "lucide-react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { formatDistanceToNow } from "date-fns";
import { useWorkspace } from "@/modules/workspaces/context";
import { useNavigate } from "react-router-dom";
import {
  useDashboardOverview,
  useRecentlyVisited,
} from "../services/dashboard-queries";
import { useSystemActivityFeed } from "../services/system-queries";
import { systemApi } from "../services/system-api";

export function HomePage() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useDashboardOverview();

  const { data: systemActivityData, isLoading: systemActivityLoading } =
    useSystemActivityFeed(currentWorkspace?.id || "", 5);

  const { data: recentlyVisitedData, isLoading: recentlyVisitedLoading } =
    useRecentlyVisited(6);

  // Record page visit
  useEffect(() => {
    if (currentWorkspace?.id) {
      systemApi
        .recordPageVisit("/home", currentWorkspace.id)
        .catch(console.error);
    }
  }, [currentWorkspace?.id]);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

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
            <Button variant="outline" onClick={() => refetch()}>
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

  const { recentActivity } = dashboardData || {};

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
            {recentlyVisitedData && recentlyVisitedData.length > 0 ? (
              recentlyVisitedData.slice(0, 6).map((item) => (
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
              {systemActivityData && systemActivityData.length > 0 ? (
                <div className="space-y-3">
                  {systemActivityData.slice(0, 5).map((activity) => (
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
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            {activity.userName || "System"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(activity.timestamp, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    No recent system activity
                  </p>
                </div>
              )}
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
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                    Guide
                  </span>
                  <span className="text-xs font-medium text-white bg-orange-500 px-2 py-1 rounded uppercase tracking-wide">
                    Upcoming
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
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-white/90 uppercase tracking-wide bg-white/20 px-2 py-1 rounded">
                    Productivity
                  </span>
                  <span className="text-xs font-medium text-white bg-blue-500 px-2 py-1 rounded uppercase tracking-wide">
                    New
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
