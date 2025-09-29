import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Layers,
  BookOpen,
  Archive,
  BarChart3,
  CheckSquare,
  Calendar,
  TrendingUp,
  Plus,
  Filter,
  Eye,
} from "lucide-react";
import { useParaStats } from "../services/para-queries";
import { EParaCategory, EParaStatus } from "../types/para.types";
import { useWorkspace } from "@/modules/workspaces/context";
import {
  getPARAProjectsLink,
  getPARAAreasLink,
  getPARAResourcesLink,
  getPARAArchiveLink,
  getSecondBrainDashboardLink,
} from "@/app/router/router-link";

export function PARAOverviewPage() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: paraStats,
    isLoading,
    error,
  } = useParaStats({
    databaseId: currentWorkspace?._id,
  });

  if (isLoading) {
    return (
      <>
        <EnhancedHeader />
        <Main className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">PARA Overview</h1>
            <p className="text-muted-foreground">
              Your personal productivity system at a glance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
              Failed to load PARA data
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

  const totalItems = paraStats?.totalItems || 0;
  const activeItems =
    Object.values(paraStats?.byStatus[EParaStatus.ACTIVE] || {}).reduce(
      (sum, v) => sum + (v as number),
      0
    ) || 0;

  const quickStats = [
    {
      label: "Total Items",
      value: totalItems,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active",
      value: activeItems,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Due This Week",
      value: paraStats?.reviewsDueThisWeek || 0,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      label: "Overdue",
      value: paraStats?.reviewsOverdue || 0,
      icon: TrendingUp,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const paraAreas = [
    {
      id: EParaCategory.PARA_PROJECTS,
      title: "Projects",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stats: {
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.PARA_PROJECTS] ||
          0,
        completed:
          paraStats?.byStatus[EParaStatus.COMPLETED]?.[
            EParaCategory.PARA_PROJECTS
          ] || 0,
        total: paraStats?.byCategory[EParaCategory.PARA_PROJECTS] || 0,
        completionRate: paraStats?.completionRates?.projects || 0,
      },
    },
    {
      id: EParaCategory.AREAS,
      title: "Areas",
      icon: Layers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      stats: {
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.AREAS] || 0,
        maintenance: paraStats?.areas.maintenanceOverdue || 0,
        total: paraStats?.byCategory[EParaCategory.AREAS] || 0,
        completionRate: paraStats?.completionRates?.areas || 0,
      },
    },
    {
      id: EParaCategory.RESOURCES,
      title: "Resources",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      stats: {
        total: paraStats?.byCategory[EParaCategory.RESOURCES] || 0,
        linked: paraStats?.linkedItems.resources || 0,
      },
    },
    {
      id: EParaCategory.ARCHIVE,
      title: "Archive",
      icon: Archive,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      stats: {
        total: paraStats?.byCategory[EParaCategory.ARCHIVE] || 0,
        recentlyArchived: paraStats?.archives.recentlyArchived || 0,
      },
    },
  ];

  // Filter areas based on status if needed
  const filteredAreas = paraAreas.filter((area) => {
    if (statusFilter === "all") return true;
    if (statusFilter === "active") return area.stats.active > 0;
    if (statusFilter === "completed") return area.stats.completed > 0;
    return true;
  });

  return (
    <>
      <EnhancedHeader />
      <Main className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              PARA Overview
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Your personal productivity system at a glance
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => navigate(getSecondBrainDashboardLink())}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="text-2xl sm:text-3xl font-bold">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-2 sm:p-3 rounded-lg bg-muted/50 ${stat.color}`}
                    >
                      <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* PARA System Overview */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <h2 className="text-lg sm:text-xl font-semibold">
              PARA Categories
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="completed">Completed Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAreas.map((area) => {
              const AreaIcon = area.icon;
              return (
                <Card
                  key={area.id}
                  className="hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${area.bgColor}`}>
                          <AreaIcon className={`h-5 w-5 ${area.color}`} />
                        </div>
                        <CardTitle className="text-lg font-semibold">
                          {area.title}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {area.stats.total}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar for completion */}
                    {(area.id === EParaCategory.PARA_PROJECTS ||
                      area.id === EParaCategory.AREAS) &&
                      area.stats.completionRate > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Completion
                            </span>
                            <span className="font-medium">
                              {area.stats.completionRate}%
                            </span>
                          </div>
                          <Progress
                            value={area.stats.completionRate}
                            className="h-2"
                          />
                        </div>
                      )}

                    {/* Detailed Stats */}
                    <div className="space-y-3">
                      {area.id === EParaCategory.PARA_PROJECTS && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Active
                            </span>
                            <span className="font-semibold text-green-600">
                              {area.stats.active}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Completed
                            </span>
                            <span className="font-semibold text-blue-600">
                              {area.stats.completed}
                            </span>
                          </div>
                        </>
                      )}
                      {area.id === EParaCategory.AREAS && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Active
                            </span>
                            <span className="font-semibold text-green-600">
                              {area.stats.active}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Maintenance Due
                            </span>
                            <span
                              className={`font-semibold ${
                                area.stats.maintenance > 0
                                  ? "text-red-600"
                                  : "text-green-600"
                              }`}
                            >
                              {area.stats.maintenance}
                            </span>
                          </div>
                        </>
                      )}
                      {area.id === EParaCategory.RESOURCES && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Total
                            </span>
                            <span className="font-semibold">
                              {area.stats.total}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Linked
                            </span>
                            <span className="font-semibold text-blue-600">
                              {area.stats.linked}
                            </span>
                          </div>
                        </>
                      )}
                      {area.id === EParaCategory.ARCHIVE && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Total Archived
                            </span>
                            <span className="font-semibold">
                              {area.stats.total}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Recently
                            </span>
                            <span className="font-semibold text-orange-600">
                              {area.stats.recentlyArchived}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm"
                        onClick={() => {
                          // TODO: Open create modal for this category
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Add</span>
                        <span className="sm:hidden">+</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs sm:text-sm gap-1"
                        onClick={() => {
                          switch (area.id) {
                            case EParaCategory.PROJECTS:
                              navigate(getPARAProjectsLink());
                              break;
                            case EParaCategory.AREAS:
                              navigate(getPARAAreasLink());
                              break;
                            case EParaCategory.RESOURCES:
                              navigate(getPARAResourcesLink());
                              break;
                            case EParaCategory.ARCHIVE:
                              navigate(getPARAArchiveLink());
                              break;
                          }
                        }}
                      >
                        <Eye className="h-3 w-3" />
                        <span className="hidden sm:inline">View All</span>
                        <span className="sm:hidden">View</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="gap-2 h-12 text-sm sm:text-base"
                onClick={() => {
                  // TODO: Open create project modal
                }}
              >
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">New Project</span>
                <span className="sm:hidden">Project</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-12 text-sm sm:text-base"
                onClick={() => {
                  // TODO: Open create area modal
                }}
              >
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Add Area</span>
                <span className="sm:hidden">Area</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-12 text-sm sm:text-base"
                onClick={() => {
                  // TODO: Open create resource modal
                }}
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Save Resource</span>
                <span className="sm:hidden">Resource</span>
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-12 text-sm sm:text-base"
                onClick={() => navigate(getPARAArchiveLink())}
              >
                <Archive className="h-4 w-4" />
                <span className="hidden sm:inline">Review Archive</span>
                <span className="sm:hidden">Archive</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
