import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  Target,
  BookOpen,
  Clock,
  Zap,
  ArrowRight,
  Star,
  Lightbulb,
  Activity,
  Filter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDashboardOverview } from "../services/dashboard-queries";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { useWorkspace } from "@/modules/workspaces/context";

export function SecondBrainDashboard() {
  const { currentWorkspace } = useWorkspace();
  const [activityFilter, setActivityFilter] = useState<string>("all");

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useDashboardOverview({
    workspaceId: currentWorkspace?.id,
    includeActivity: true,
    activityLimit: 10,
    upcomingTasksLimit: 5,
    recentNotesLimit: 5,
  });

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

  const dashboardOverview = dashboardData || {};

  const {
    quickStats,
    recentActivity = [],
    upcomingTasks = [],
    recentNotes = [],
    goalProgress = [],
    habitStreaks = [],
    recentlyVisited = [],
  } = dashboardOverview;

  // Filter activities based on selected filter
  const filteredActivities = recentActivity.filter((activity) => {
    if (activityFilter === "all") return true;
    return activity.type === activityFilter;
  });

  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-6">
        {/* Clean Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Your personal productivity and knowledge management system
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold">
                    {quickStats?.totalTasks || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Projects
                  </p>
                  <p className="text-2xl font-bold">
                    {quickStats?.activeProjects || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Notes
                  </p>
                  <p className="text-2xl font-bold">
                    {quickStats?.totalNotes || 0}
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
              {upcomingTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No upcoming tasks
                </p>
              ) : (
                upcomingTasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1">{task.name}</span>
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
            <CardContent className="space-y-2">
              {recentlyVisited.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No recent activity
                </p>
              ) : (
                recentlyVisited.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50"
                  >
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="task_created">Tasks</SelectItem>
                  <SelectItem value="note_created">Notes</SelectItem>
                  <SelectItem value="goal_updated">Goals</SelectItem>
                  <SelectItem value="habit_completed">Habits</SelectItem>
                  <SelectItem value="journal_entry">Journal</SelectItem>
                  <SelectItem value="finance_added">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  {activityFilter === "all"
                    ? "No recent activity"
                    : `No ${activityFilter.replace("_", " ")} activity`}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredActivities.slice(0, 10).map((activity) => (
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
            )}
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
