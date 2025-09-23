import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Plus,
  CheckSquare,
  Target,
  BookOpen,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Lightbulb,
  BarChart3,
  DollarSign,
  FileText,
  Timer,
} from "lucide-react";
import { secondBrainApi } from "@/modules/second-brain/services/second-brain-api";
import {
  useProductivityAnalytics,
  useTaskAnalytics,
  useTimeTrackingAnalytics,
  useGoalAnalytics,
  useFinanceAnalytics,
  useContentAnalytics,
} from "../services/second-brain-analytics-queries";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { useWorkspace } from "@/modules/workspaces/context";

export function SecondBrainDashboard() {
  const { currentWorkspace } = useWorkspace();
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["second-brain", "dashboard"],
    queryFn: secondBrainApi.getDashboard,
  });

  // Only fetch analytics if workspace is available
  const workspaceId = currentWorkspace?.id;

  // Analytics queries - only enabled when workspaceId is available
  const { data: productivityData, isLoading: isLoadingProductivity } =
    useProductivityAnalytics(
      {
        workspaceId,
      },
      {
        enabled: !!workspaceId,
      }
    );
  const { data: taskData, isLoading: isLoadingTasks } = useTaskAnalytics(
    {
      workspaceId,
    },
    {
      enabled: !!workspaceId,
    }
  );
  const { data: timeTrackingData, isLoading: isLoadingTimeTracking } =
    useTimeTrackingAnalytics(
      {
        workspaceId,
      },
      {
        enabled: !!workspaceId,
      }
    );
  const { data: goalData, isLoading: isLoadingGoals } = useGoalAnalytics(
    {
      workspaceId,
    },
    {
      enabled: !!workspaceId,
    }
  );
  const { data: financeData, isLoading: isLoadingFinance } =
    useFinanceAnalytics(
      {
        workspaceId,
      },
      {
        enabled: !!workspaceId,
      }
    );
  const { data: contentData, isLoading: isLoadingContent } =
    useContentAnalytics(
      {
        workspaceId,
      },
      {
        enabled: !!workspaceId,
      }
    );

  if (isLoading) {
    return (
      <>
        <EnhancedHeader />
        <Main className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </Main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <EnhancedHeader />
        <Main className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">
              Failed to load dashboard data
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Please check your connection and try again
            </p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </Main>
      </>
    );
  }

  const {
    todayTasks = [],
    upcomingDeadlines = [],
    activeProjects = [],
    recentNotes = [],
    currentGoals = [],
    todayHabits = [],
    moodEntry,
    weeklyStats = {},
  } = dashboardData?.data || {};

  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        {/* Clean Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your personal productivity and knowledge management system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Tasks Completed
                  </p>
                  <p className="text-2xl font-bold">
                    {weeklyStats.tasksCompleted || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold">
                    {weeklyStats.projectsActive || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Notes Created</p>
                  <p className="text-2xl font-bold">
                    {weeklyStats.notesCreated || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Habits Done</p>
                  <p className="text-2xl font-bold">
                    {weeklyStats.habitsCompleted || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Today's Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No tasks for today
                </p>
              ) : (
                todayTasks.slice(0, 5).map((task: any) => (
                  <div
                    key={task._id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{task.title}</span>
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Active Projects */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Projects
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeProjects.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active projects
                </p>
              ) : (
                activeProjects.slice(0, 3).map((project: any) => (
                  <div key={project._id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {project.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.completionPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={project.completionPercentage}
                      className="h-2"
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Current Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Current Goals
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentGoals.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active goals</p>
              ) : (
                currentGoals.map((goal: any) => (
                  <div
                    key={goal._id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{goal.title}</span>
                      <p className="text-xs text-muted-foreground">
                        {goal.type}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {goal.progressPercentage || 0}%
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Recent Notes
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentNotes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent notes</p>
              ) : (
                recentNotes.slice(0, 4).map((note: any) => (
                  <div
                    key={note._id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{note.title}</span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {note.type}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Today's Habits */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Today's Habits
              </CardTitle>
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {todayHabits.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No habits for today
                </p>
              ) : (
                todayHabits.map((habit: any) => (
                  <div
                    key={habit._id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{habit.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {habit.frequency}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              View Details <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Task Analytics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Task Completion
                    </p>
                    <p className="text-2xl font-bold">
                      {taskData ? `${taskData.completionRate}%` : "0%"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Productivity Analytics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Productive Hours
                    </p>
                    <p className="text-2xl font-bold">
                      {productivityData
                        ? `${productivityData.timeTracking.productiveHours}h`
                        : "0h"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Goal Analytics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Goal Completion
                    </p>
                    <p className="text-2xl font-bold">
                      {goalData ? `${goalData.completionRate}%` : "0%"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Finance Analytics */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                    <p className="text-2xl font-bold">
                      {financeData ? `$${financeData.netIncome}` : "$0"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Time Tracking Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Timer className="h-4 w-4" />
                Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {timeTrackingData ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Tracked Time</span>
                    <span className="text-sm font-medium">
                      {timeTrackingData.totalTrackedTime}h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sessions Today</span>
                    <span className="text-sm font-medium">
                      {timeTrackingData.sessions.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Productivity Score</span>
                    <span className="text-sm font-medium">
                      {timeTrackingData.productivityScore}%
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No time tracking data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Content Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {contentData ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Content</span>
                    <span className="text-sm font-medium">
                      {contentData.totalContent}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Views</span>
                    <span className="text-sm font-medium">
                      {contentData.engagementMetrics.totalViews}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg. Engagement</span>
                    <span className="text-sm font-medium">
                      {contentData.engagementMetrics.averageEngagement}%
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No content analytics available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  );
}
