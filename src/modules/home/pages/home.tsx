import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Quote } from "lucide-react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { formatDistanceToNow, addHours } from "date-fns";
import { useWorkspace } from "@/modules/workspaces/context";
import { useNavigate } from "react-router-dom";
import { useDashboardOverview } from "../services/home-queries";
import { useMemo } from "react";
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureItem,
  GanttToday,
} from "@/components/ui/kibo-ui/gantt";
import { useTodayEvents } from "@/modules/calendar/services/calendar-queries";
import { useUpdateEvent } from "@/modules/calendar/services/calendar-queries";
import  {
  type CalendarEvent,
  EEventType,
} from "@/modules/calendar/types/calendar.types.ts";
import type { IRecentlyVisitedItem } from "@/modules/home/types";

interface DisplayFeature {
  id: string;
  name: string;
  startAt: Date;
  endAt: Date;
  status: {
    id: EEventType;
    name: EEventType;
    color: string;
  };
}

export function HomePage() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useDashboardOverview();
  const { data: todayEvents } = useTodayEvents();
  const { mutateAsync: updateEventMutation } = useUpdateEvent();

  const getEventColor = (eventType?: string): string => {
    try {
      switch (eventType) {
        case "meeting":
          return "hsl(var(--chart-1))"; // Blue
        case "task":
          return "hsl(var(--chart-2))"; // Green
        case "personal":
          return "hsl(var(--chart-3))"; // Purple
        case "work":
          return "hsl(var(--chart-4))"; // Orange
        case "reminder":
          return "hsl(var(--chart-5))"; // Yellow
        case "appointment":
          return "hsl(var(--destructive))"; // Red
        case "focus_time":
          return "hsl(var(--primary))"; // Primary
        case "break":
          return "hsl(var(--muted-foreground))"; // Gray
        case "deadline":
          return "hsl(var(--destructive))"; // Red
        case "habit":
          return "hsl(var(--chart-3))"; // Purple
        case "goal_review":
          return "hsl(var(--primary))"; // Primary
        case "travel":
          return "hsl(var(--chart-2))"; // Green
        case "milestone":
          return "hsl(var(--chart-1))"; // Blue
        default:
          return "hsl(var(--primary))";
      }
    } catch {
      return "hsl(var(--primary))";
    }
  };

  const displayFeatures = useMemo<DisplayFeature[]>(() => {
    try {
      if (
        !todayEvents?.data?.events ||
        !Array.isArray(todayEvents.data.events)
      ) {
        return [];
      }

      return todayEvents.data.events
        .filter((event: CalendarEvent) => {
          try {
            const today = new Date();
            const eventDate = new Date(event.startTime);
            return (
              eventDate.getDate() === today.getDate() &&
              eventDate.getMonth() === today.getMonth() &&
              eventDate.getFullYear() === today.getFullYear()
            );
          } catch {
            return false;
          }
        })
        .map((event: CalendarEvent) => {
          try {
            // Ensure dates are Date objects
            const startAt = new Date(event.startTime);
            const endAt = event.endTime
              ? new Date(event.endTime)
              : addHours(startAt, 1);

            if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) return null;

            return {
              id: event.id || `event-${Date.now()}`,
              name: event.title || "Untitled Event",
              startAt,
              endAt,
              status: {
                id: event.type || EEventType.EVENT,
                name: event.type || EEventType.EVENT,
                color: getEventColor(event.type),
              },
            };
          } catch {
            return null;
          }
        })
        .filter(
          (feature: DisplayFeature | null): feature is DisplayFeature =>
            feature !== null
        );
    } catch {
      return [];
    }
  }, [todayEvents]);

  // Handle moving/rescheduling events by dragging
  const handleMoveFeature = async (
    id: string,
    startAt: Date,
    endAt: Date | null
  ) => {
    try {
      if (!endAt || !id) return;

      const event = displayFeatures.find((f: DisplayFeature) => f.id === id);
      if (!event) return;

      // Validate dates
      if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) return;

      await updateEventMutation({
        eventId: id,
        data: {
          startTime: startAt,
          endTime: endAt,
        },
      });
    } catch {
      // Error handling is done in the mutation hook
    }
  };

  // Motivational quotes based on time of day
  const getMotivationalQuote = () => {
    try {
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
    } catch {
      return "Stay focused and keep moving forward.";
    }
  };

  // Find items not visited recently for re-engagement
  const getReengagementPrompt = () => {
    try {
      if (
        !data?.data?.recentlyVisited ||
        !Array.isArray(data.data.recentlyVisited) ||
        data.data.recentlyVisited.length === 0
      )
        return null;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Find items not visited in the last week
      const oldItems = data.data.recentlyVisited.filter(
        (item: IRecentlyVisitedItem) => {
          try {
            return (
              item?.lastVisitedAt && new Date(item.lastVisitedAt) < oneWeekAgo
            );
          } catch {
            return false;
          }
        }
      );

      if (oldItems.length === 0) return null;

      // Return a random old item
      const randomItem = oldItems[Math.floor(Math.random() * oldItems.length)];
      return randomItem;
    } catch {
      return null;
    }
  };

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    try {
      const hour = new Date().getHours();
      if (hour < 12) return "Good morning";
      if (hour < 17) return "Good afternoon";
      return "Good evening";
    } catch {
      return "Hello";
    }
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
          {/* Header Section Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-10 w-48 bg-muted animate-pulse rounded"></div>
                <div className="h-6 w-64 bg-muted animate-pulse rounded mt-1"></div>
              </div>
            </div>
          </div>

          {/* Time-blocking CalendarTypes Preview Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-40 bg-muted animate-pulse rounded flex items-center gap-2">
                <div className="w-5 h-5 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-9 w-24 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="h-64 bg-muted animate-pulse rounded"></div>
              <div className="mt-4 pt-3 border-t">
                <div className="h-3 w-64 bg-muted animate-pulse rounded mx-auto"></div>
              </div>
            </div>
          </div>

          {/* Re-engagement Prompt Skeleton */}
          <div className="border-l-4 border-l-primary rounded-lg">
            <div className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-muted animate-pulse rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted animate-pulse rounded"></div>
                  <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-20 bg-muted animate-pulse rounded mt-2"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Motivational Quote Skeleton */}
          <div className="bg-muted/30 border-muted rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-muted animate-pulse rounded mt-1"></div>
              <div className="flex-1">
                <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
          </div>

          {/* Recently Visited Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-36 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-64 border rounded-lg p-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-muted animate-pulse rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-1/2 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-2/3 bg-muted animate-pulse rounded mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
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

        {/* Time-blocking CalendarTypes Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Today's Schedule
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/app/calendar")}
            >
              View Calendar
            </Button>
          </div>
          <Card>
            <CardContent className="p-4">
              {displayFeatures.length > 0 ? (
                <div className="h-64 overflow-hidden rounded border">
                  <GanttProvider range="monthly" zoom={80}>
                    <GanttSidebar>
                      <GanttSidebarGroup name="Today's Events">
                        {displayFeatures.map((feature: DisplayFeature) => (
                          <GanttSidebarItem
                            key={feature?.id}
                            feature={feature || null}
                            onSelectItem={(id) => {
                              // Scroll to the feature in the timeline
                              const ganttElement = document.querySelector(
                                '[data-roadmap-ui="gantt-sidebar"]'
                              )?.parentElement;
                              if (ganttElement) {
                                const featureElement =
                                  ganttElement.querySelector(
                                    `[data-feature-id="${id}"]`
                                  );
                                featureElement?.scrollIntoView({
                                  behavior: "smooth",
                                  block: "center",
                                });
                              }
                            }}
                          />
                        ))}
                      </GanttSidebarGroup>
                    </GanttSidebar>
                    <GanttTimeline>
                      <GanttHeader />
                      <GanttFeatureList>
                        <GanttFeatureListGroup>
                          {displayFeatures?.map((feature: DisplayFeature) => (
                            <div className="flex" key={feature?.id}>
                              <GanttFeatureItem
                                onMove={handleMoveFeature}
                                {...feature}
                              >
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
              ) : (
                <div className="h-64 flex items-center justify-center border rounded">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No events scheduled for today
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your calendar is free today
                    </p>
                  </div>
                </div>
              )}
              <div className="mt-4 pt-3 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {displayFeatures.length > 0
                      ? `${displayFeatures.length} ${
                          displayFeatures.length === 1 ? "event" : "events"
                        } scheduled today`
                      : "No events scheduled for today"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Time-blocking helps you focus and be more productive
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Re-engagement Prompt */}
        {(() => {
          const reengagementItem = getReengagementPrompt();
          return reengagementItem ? (
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
                      {reengagementItem.name || "Unknown item"} - Last visited{" "}
                      {reengagementItem.lastVisitedAt
                        ? formatDistanceToNow(
                            new Date(reengagementItem.lastVisitedAt),
                            {
                              addSuffix: true,
                            }
                          )
                        : "some time ago"}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        try {
                          if (reengagementItem.route)
                            navigate(reengagementItem.route);
                        } catch {
                          // Ignore navigation errors
                        }
                      }}
                    >
                      Visit Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null;
        })()}

        {/* Recently Visited */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recently Visited</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {data?.data?.recentlyVisited &&
            Array.isArray(data.data.recentlyVisited) &&
            data.data.recentlyVisited.length > 0 ? (
              data.data.recentlyVisited
                .slice(0, 6)
                .map((item: IRecentlyVisitedItem) => {
                  try {
                    return (
                      <Card
                        key={item?.id || `item-${Math.random()}`}
                        className="flex-shrink-0 w-64 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => {
                          try {
                            if (item?.route) navigate(item.route);
                          } catch {
                            // Ignore navigation errors
                          }
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                              style={{
                                backgroundColor: `${
                                  item?.color || "#3b82f6"
                                }20`,
                                color: item?.color || "#3b82f6",
                              }}
                            >
                              {item?.icon || "📄"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {item?.name || "Untitled"}
                              </h3>
                              {item?.preview && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {item.preview}
                                </p>
                              )}
                              <div className="mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {item?.lastVisitedAt
                                    ? formatDistanceToNow(
                                        new Date(item.lastVisitedAt),
                                        {
                                          addSuffix: true,
                                        }
                                      )
                                    : "Recently"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  } catch {
                    return null;
                  }
                })
                .filter(Boolean)
            ) : (
              <div className="flex-shrink-0 w-full text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  No recently visited items
                </p>
              </div>
            )}
          </div>
        </div>

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

        {/* Learn */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learn</h2>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded uppercase tracking-wide">
              Upcoming
            </span>
          </div>
          <Card className="opacity-60">
            <CardContent className="p-8 text-center">
              <div className="text-3xl mb-3">📖</div>
              <h3 className="font-semibold text-lg mb-2">
                Personalized Learning
              </h3>
              <p className="text-sm text-muted-foreground">
                Curated articles and insights tailored to your interests and
                productivity goals.
              </p>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
