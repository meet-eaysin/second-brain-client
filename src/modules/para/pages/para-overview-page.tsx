import { useNavigate } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Layers, BookOpen, Archive } from "lucide-react";
import { useParaStats } from "../services/para-queries";
import { EParaCategory, EParaStatus } from "../types/para.types";
import { useWorkspace } from "@/modules/workspaces/context";
import {
  getPARAProjectsLink,
  getPARAAreasLink,
  getPARAResourcesLink,
  getPARAArchiveLink,
} from "@/app/router/router-link";

export function PARAOverviewPage() {
  const { currentWorkspace } = useWorkspace();
  const navigate = useNavigate();

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

  const paraAreas = [
    {
      id: EParaCategory.PROJECTS,
      title: "Projects",
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stats: {
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.PROJECTS] ||
          0,
        completed:
          paraStats?.byStatus[EParaStatus.COMPLETED]?.[
            EParaCategory.PROJECTS
          ] || 0,
        total: paraStats?.byCategory[EParaCategory.PROJECTS] || 0,
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

  // Use all areas for simplified design
  const filteredAreas = paraAreas;

  return (
    <>
      <EnhancedHeader />
      <Main className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAreas.map((area) => {
              const AreaIcon = area.icon;
              return (
                <Card
                  key={area.id}
                  className="hover:shadow-lg cursor-pointer group"
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
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${area.bgColor}`}>
                          <AreaIcon className={`h-5 w-5 ${area.color}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {area.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {area.stats.total} total items
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {area.stats.total}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Category-specific information */}
                    <div className="space-y-3">
                      {area.id === EParaCategory.PROJECTS && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Active Projects
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
                              Active Areas
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
                                (area.stats.maintenance || 0) > 0
                                  ? "text-orange-600"
                                  : "text-green-600"
                              }`}
                            >
                              {area.stats.maintenance || 0}
                            </span>
                          </div>
                        </>
                      )}

                      {area.id === EParaCategory.RESOURCES && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Total Resources
                            </span>
                            <span className="font-semibold">
                              {area.stats.total}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Linked Items
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
                              Recently Archived
                            </span>
                            <span className="font-semibold text-orange-600">
                              {area.stats.recentlyArchived}
                            </span>
                          </div>
                        </>
                      )}
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
            <CardTitle className="text-center">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-12"
                onClick={() => navigate(getPARAProjectsLink())}
              >
                <Target className="h-4 w-4 mr-2" />
                View Projects
              </Button>
              <Button
                variant="outline"
                className="h-12"
                onClick={() => navigate(getPARAAreasLink())}
              >
                <Layers className="h-4 w-4 mr-2" />
                Manage Areas
              </Button>
              <Button
                variant="outline"
                className="h-12"
                onClick={() => navigate(getPARAResourcesLink())}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Browse Resources
              </Button>
              <Button
                variant="outline"
                className="h-12"
                onClick={() => navigate(getPARAArchiveLink())}
              >
                <Archive className="h-4 w-4 mr-2" />
                Review Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
