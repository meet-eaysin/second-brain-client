import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Database,
  FileText,
  Activity,
  TrendingUp,
  Shield,
  BarChart3,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  useAdminDashboardStats,
  useSystemHealth,
} from "../services/admin-queries";

export const AdminDashboardPage: React.FC = () => {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useAdminDashboardStats();
  const {
    data: health,
    isLoading: healthLoading,
    error: healthError,
  } = useSystemHealth();

  return (
    <>
      <EnhancedHeader/>

      <Main className="space-y-8">
        {/* System Status */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">System Overview</h2>
          <p className="text-muted-foreground">
            Monitor system health, user activity, and key metrics
          </p>
        </div>

        {/* Error States */}
        {(statsError || healthError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load dashboard data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {(stats?.totalUsers || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />+
                    {stats?.growthRate || 0}% from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Badge variant="default">{stats?.activeUsers || 0}</Badge>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {(stats?.activeUsers || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.totalUsers
                      ? (
                          ((stats.activeUsers || 0) / stats.totalUsers) *
                          100
                        ).toFixed(1)
                      : 0}
                    % of total users
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Databases</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats?.totalDatabases || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active databases
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {(stats?.totalNotes || 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all users
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Health & Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Health
              </CardTitle>
              <CardDescription>
                Current system status and uptime
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                {healthLoading ? (
                  <Skeleton className="h-5 w-12" />
                ) : (
                  <Badge
                    variant={
                      health?.status === "Good"
                        ? "default"
                        : health?.status === "Warning"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {health?.status || "Unknown"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                {healthLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {health?.uptime || 0}%
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Backup</span>
                {healthLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {health?.lastBackup
                      ? new Date(health.lastBackup).toLocaleString()
                      : "Unknown"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Response Time</span>
                {healthLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {health?.responseTime || 0}ms
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                User activity in the last 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {stats?.recentActivity || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active sessions today
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <Users className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Manage Users</span>
                <span className="text-xs text-muted-foreground">
                  View and edit user accounts
                </span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <Database className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">System Logs</span>
                <span className="text-xs text-muted-foreground">
                  View system activity logs
                </span>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                <Calendar className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="text-sm font-medium">Scheduled Tasks</span>
                <span className="text-xs text-muted-foreground">
                  Manage cron jobs and tasks
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
};

export default AdminDashboardPage;
