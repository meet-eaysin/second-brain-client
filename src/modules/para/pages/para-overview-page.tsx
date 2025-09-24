import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { useParaStats } from "../services/para-queries";
import { EParaCategory, EParaStatus } from "../types/para.types";
import { useWorkspace } from "@/modules/workspaces/context";

export function PARAOverviewPage() {
  const { currentWorkspace } = useWorkspace();
  const { data: paraStats } = useParaStats({
    databaseId: currentWorkspace?.id,
  });

  const totalItems = paraStats?.totalItems || 0;

  const quickStats = [
    { label: "Total Items", value: totalItems, icon: Target },
    {
      label: "Active",
      value:
        Object.values(paraStats?.byStatus[EParaStatus.ACTIVE] || {}).reduce(
          (sum, v) => sum + (v as number),
          0
        ) || 0,
      icon: CheckSquare,
    },
    {
      label: "Due This Week",
      value: paraStats?.reviewsDueThisWeek || 0,
      icon: Calendar,
    },
    {
      label: "Overdue",
      value: paraStats?.reviewsOverdue || 0,
      icon: TrendingUp,
    },
  ];

  const paraAreas = [
    {
      id: EParaCategory.PROJECTS,
      title: "Projects",
      icon: Target,
      stats: {
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.PROJECTS] ||
          0,
        completed:
          paraStats?.byStatus[EParaStatus.COMPLETED]?.[
            EParaCategory.PROJECTS
          ] || 0,
        total: paraStats?.byCategory[EParaCategory.PROJECTS] || 0,
      },
    },
    {
      id: EParaCategory.AREAS,
      title: "Areas",
      icon: Layers,
      stats: {
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.AREAS] || 0,
        maintenance: paraStats?.areas.maintenanceOverdue || 0,
        total: paraStats?.byCategory[EParaCategory.AREAS] || 0,
      },
    },
    {
      id: EParaCategory.RESOURCES,
      title: "Resources",
      icon: BookOpen,
      stats: {
        total: paraStats?.byCategory[EParaCategory.RESOURCES] || 0,
        linked: paraStats?.linkedItems.resources || 0,
      },
    },
    {
      id: EParaCategory.ARCHIVE,
      title: "Archive",
      icon: Archive,
      stats: {
        total: paraStats?.byCategory[EParaCategory.ARCHIVE] || 0,
        recentlyArchived: paraStats?.archives.recentlyArchived || 0,
      },
    },
  ];

  return (
    <>
      <EnhancedHeader />
      <Main className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              PARA Overview
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personal productivity system at a glance
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" /> Analytics
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className="p-2 bg-muted rounded-md">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* PARA System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paraAreas.map((area) => {
            const AreaIcon = area.icon;
            return (
              <Card key={area.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-muted rounded-md">
                        <AreaIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{area.stats.total}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Detailed Stats */}
                  <div className="space-y-2">
                    {area.id === EParaCategory.PROJECTS && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active</span>
                          <span className="font-medium">
                            {area.stats.active}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Completed
                          </span>
                          <span className="font-medium">
                            {area.stats.completed}
                          </span>
                        </div>
                      </>
                    )}
                    {area.id === EParaCategory.AREAS && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Active</span>
                          <span className="font-medium">
                            {area.stats.active}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Maintenance
                          </span>
                          <span className="font-medium">
                            {area.stats.maintenance}
                          </span>
                        </div>
                      </>
                    )}
                    {area.id === EParaCategory.RESOURCES && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total</span>
                          <span className="font-medium">
                            {area.stats.total}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Linked</span>
                          <span className="font-medium">
                            {area.stats.linked}
                          </span>
                        </div>
                      </>
                    )}
                    {area.id === EParaCategory.ARCHIVE && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Archived
                          </span>
                          <span className="font-medium">
                            {area.stats.total}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Recently
                          </span>
                          <span className="font-medium">
                            {area.stats.recentlyArchived}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Plus className="h-3 w-3 mr-1" /> Add
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                New Project
              </Button>
              <Button variant="outline" className="gap-2">
                <Layers className="h-4 w-4" />
                Add Area
              </Button>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Save Resource
              </Button>
              <Button variant="outline" className="gap-2">
                <Archive className="h-4 w-4" />
                Review Archive
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
