import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Quote } from "lucide-react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { formatDistanceToNow, addHours } from "date-fns";
import { useWorkspace } from "@/modules/workspaces/context";
import { useNavigate } from "react-router-dom";
import { useDashboardOverview } from "../services/home-queries";
import { systemApi } from "../services/system-api";
import {
  GanttProvider,
  GanttSidebar,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureItem,
  GanttToday,
  type GanttFeature,
} from "@/components/ui/kibo-ui/gantt";
import { useTodayEvents } from "@/modules/calendar/services/calendar-queries";

export function HomePage() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useDashboardOverview();

  // Get today's calendar events for time-blocking preview
  const { data: todayEvents } = useTodayEvents();

  // Convert calendar events to Gantt features for time-blocking preview
  const todayScheduleFeatures: GanttFeature[] =
    todayEvents?.events?.map((event) => ({
      id: event.id,
      name: event.title,
      startAt: event.startTime,
      endAt: event.endTime || addHours(event.startTime, 1), // Default 1 hour if no end time
      status: {
        id: event.type || "event",
        name: event.type || "Event",
        color: getEventColor(event.type),
      },
    })) || [];

  // Fallback: Show default time blocks if no events
  const defaultScheduleFeatures: GanttFeature[] = [
    {
      id: "morning-focus",
      name: "Morning Focus",
      startAt: addHours(new Date().setHours(9, 0, 0, 0), 0),
      endAt: addHours(new Date().setHours(11, 0, 0, 0), 0),
      status: { id: "focus", name: "Focus", color: "hsl(var(--primary))" },
    },
    {
      id: "lunch-break",
      name: "Lunch Break",
      startAt: addHours(new Date().setHours(12, 0, 0, 0), 0),
      endAt: addHours(new Date().setHours(13, 0, 0, 0), 0),
      status: {
        id: "break",
        name: "Break",
        color: "hsl(var(--muted-foreground))",
      },
    },
    {
      id: "afternoon-work",
      name: "Afternoon Work",
      startAt: addHours(new Date().setHours(14, 0, 0, 0), 0),
      endAt: addHours(new Date().setHours(17, 0, 0, 0), 0),
      status: { id: "work", name: "Work", color: "hsl(var(--chart-2))" },
    },
  ];

  // Use live data if available, otherwise show default schedule
  const displayFeatures =
    todayScheduleFeatures.length > 0
      ? todayScheduleFeatures
      : defaultScheduleFeatures;

  // Helper function to get color based on event type
  const getEventColor = (eventType?: string): string => {
    switch (eventType) {
      case "meeting":
        return "hsl(var(--chart-1))";
      case "task":
        return "hsl(var(--chart-2))";
      case "personal":
        return "hsl(var(--chart-3))";
      case "work":
        return "hsl(var(--chart-4))";
      default:
        return "hsl(var(--primary))";
    }
  };

  // Motivational quotes based on time of day
  const getMotivationalQuote = () => {
    const hour = new Date().getHours();
    const quotes = {
      morning: [
        "Every morning is a fresh beginning. Every day is the world made new.",
        "The way to get started is to quit talking and begin doing.",
        "Your only limit is you.",
      ],
      afternoon: [
        "The afternoon knows what the morning never suspected.",
        "Success is not final, failure is not fatal: It is the courage to continue that counts.",
        "The best way to predict the future is to create it.",
      ],
      evening: [
        "Evening is a time of real experimentation. You never want to look the same way.",
        "What we achieve inwardly will change outer reality.",
        "Rest when you're weary. Refresh and renew yourself.",
      ],
    };

    let timeOfDay: keyof typeof quotes = "morning";
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17) timeOfDay = "evening";

    const timeQuotes = quotes[timeOfDay];
    return timeQuotes[Math.floor(Math.random() * timeQuotes.length)];
  };

  // Find items not visited recently for re-engagement
  const getReengagementPrompt = () => {
    if (!data?.recentlyVisited || data.recentlyVisited.length === 0)
      return null;

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Find items not visited in the last week
    const oldItems = data.recentlyVisited.filter(
      (item) => item.lastVisitedAt < oneWeekAgo
    );

    if (oldItems.length === 0) return null;

    // Return a random old item
    const randomItem = oldItems[Math.floor(Math.random() * oldItems.length)];
    return randomItem;
  };

  // Record page visit
  useEffect(() => {
    if (currentWorkspace?.id) {
      systemApi
        .recordPageVisit(location.pathname, currentWorkspace.id)
        .catch(console.error);
    }
  }, [currentWorkspace?.id, location.pathname]);

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

        {/* Time-blocking Calendar Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Schedule
            </h2>
            <Button variant="outline" size="sm">
              View Calendar
            </Button>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="h-64 overflow-hidden rounded border">
                <GanttProvider range="daily" zoom={150}>
                  <GanttSidebar>
                    <div className="p-2">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Time Blocks
                      </p>
                    </div>
                  </GanttSidebar>
                  <GanttTimeline>
                    <GanttHeader />
                    <GanttFeatureList>
                      <GanttFeatureListGroup>
                        {displayFeatures.map((feature) => (
                          <div className="flex" key={feature.id}>
                            <GanttFeatureItem {...feature}>
                              <p className="flex-1 truncate text-xs">
                                {feature.name}
                              </p>
                            </GanttFeatureItem>
                          </div>
                        ))}
                      </GanttFeatureListGroup>
                    </GanttFeatureList>
                    <GanttToday />
                  </GanttTimeline>
                </GanttProvider>
              </div>
              <div className="mt-4 pt-3 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Time-blocking helps you focus and be more productive
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Re-engagement Prompt */}
        {getReengagementPrompt() && (
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-primary">
                    It's been a while since you visited...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getReengagementPrompt()?.name} - Last visited{" "}
                    {formatDistanceToNow(
                      getReengagementPrompt()?.lastVisitedAt || new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      navigate(getReengagementPrompt()?.route || "")
                    }
                  >
                    Visit Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Quote */}
        <Card className="bg-muted/30 border-muted">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="text-sm italic text-foreground">
                  "{getMotivationalQuote()}"
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Daily inspiration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recently Visited */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recently Visited</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.recentlyVisited && data.recentlyVisited.length > 0 ? (
              data.recentlyVisited.slice(0, 6).map((item) => (
                <Card
                  key={item.id}
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => navigate(item.route)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
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

        {/* Learn */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learn</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            <Card className="flex-shrink-0 w-80 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden">
              <div className="h-32 bg-primary relative">
                <div className="absolute inset-0 bg-background/20"></div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-primary-foreground/90 uppercase tracking-wide bg-primary-foreground/20 px-2 py-1 rounded">
                    Guide
                  </span>
                  <span className="text-xs font-medium text-primary-foreground bg-destructive px-2 py-1 rounded uppercase tracking-wide">
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
              <div className="h-32 bg-chart-2 relative">
                <div className="absolute inset-0 bg-background/20"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-chart-2-foreground uppercase tracking-wide bg-background/20 px-2 py-1 rounded">
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
              <div className="h-32 bg-chart-3 relative">
                <div className="absolute inset-0 bg-background/20"></div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-chart-3-foreground uppercase tracking-wide bg-background/20 px-2 py-1 rounded">
                    Productivity
                  </span>
                  <span className="text-xs font-medium text-chart-3-foreground bg-primary px-2 py-1 rounded uppercase tracking-wide">
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
              <div className="h-32 bg-chart-4 relative">
                <div className="absolute inset-0 bg-background/20"></div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-chart-4-foreground uppercase tracking-wide bg-background/20 px-2 py-1 rounded">
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

            <Card className="flex-shrink-0 w-80 hover:shadow-lg cursor-pointer transition-all duration-300 overflow-hidden opacity-60">
              <div className="h-32 bg-muted relative">
                <div className="absolute inset-0 bg-background/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🚀</div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Coming Soon
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-3 left-4">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide bg-background/20 px-2 py-1 rounded">
                    Upcoming
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-base leading-tight mb-2">
                  Advanced Features Guide
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Discover powerful advanced features and integrations to
                  supercharge your productivity workflow.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Coming soon
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs p-0 h-auto opacity-50 cursor-not-allowed"
                    disabled
                  >
                    Soon →
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
