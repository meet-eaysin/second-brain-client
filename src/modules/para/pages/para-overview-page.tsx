import React, { useState } from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
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
  Target,
  Layers,
  BookOpen,
  Archive,
  BarChart3,
  CheckSquare,
  Plus,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import { DatabaseView, EDatabaseType } from "@/modules/database-view";
import { useParaStats } from "../services/para-queries";
import { EParaCategory, EParaStatus } from "../types/para.types";
import { useWorkspace } from "@/modules/workspaces/context";

export function PARAOverviewPage() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const { currentWorkspace } = useWorkspace();

  // Fetch PARA stats
  const { data: paraStats } = useParaStats({
    databaseId: currentWorkspace?.id,
  });

  const paraAreas = [
    {
      id: EParaCategory.PROJECTS,
      title: "Projects",
      description: "Things with a deadline and specific outcome",
      icon: Target,
      color: "bg-blue-500",
      items: {
        total: paraStats?.byCategory[EParaCategory.PROJECTS] || 0,
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.PROJECTS] ||
          0,
        completed:
          paraStats?.byStatus[EParaStatus.COMPLETED]?.[
            EParaCategory.PROJECTS
          ] || 0,
      },
    },
    {
      id: EParaCategory.AREAS,
      title: "Areas",
      description: "Ongoing responsibilities to maintain",
      icon: Layers,
      color: "bg-green-500",
      items: {
        total: paraStats?.byCategory[EParaCategory.AREAS] || 0,
        active:
          paraStats?.byStatus[EParaStatus.ACTIVE]?.[EParaCategory.AREAS] || 0,
        maintenance: paraStats?.areas.maintenanceOverdue || 0,
      },
    },
    {
      id: EParaCategory.RESOURCES,
      title: "Resources",
      description: "Topics of ongoing interest for future reference",
      icon: BookOpen,
      color: "bg-purple-500",
      items: {
        total: paraStats?.byCategory[EParaCategory.RESOURCES] || 0,
        linked: paraStats?.linkedItems.resources || 0,
      },
    },
    {
      id: EParaCategory.ARCHIVE,
      title: "Archive",
      description: "Inactive items from the other three categories",
      icon: Archive,
      color: "bg-gray-500",
      items: {
        total: paraStats?.byCategory[EParaCategory.ARCHIVE] || 0,
        recentlyArchived: paraStats?.archives.recentlyArchived || 0,
      },
    },
  ];

  const totalItems = paraStats?.totalItems || 0;

  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        {/* Clean Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">PARA System</h1>
            <p className="text-muted-foreground">
              Projects, Areas, Resources, and Archives - Your organizational
              framework
            </p>
          </div>
          <Button className="gap-2">
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
        </div>

        {/* PARA Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paraAreas.map((area) => {
            const AreaIcon = area.icon;
            const percentage =
              totalItems > 0 ? (area.items.total / totalItems) * 100 : 0;

            return (
              <Card
                key={area.id}
                className={`hover:shadow-md transition-all cursor-pointer ${
                  selectedArea === area.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() =>
                  setSelectedArea(selectedArea === area.id ? null : area.id)
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${area.color} text-white`}>
                      <AreaIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{area.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {area.items.total} items
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-sm">
                    {area.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Distribution */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Distribution</span>
                      <span>{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>

                  {/* Item Breakdown */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {area.id === EParaCategory.PROJECTS && (
                      <>
                        <div className="flex items-center gap-2">
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.active} active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckSquare className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.completed} completed</span>
                        </div>
                      </>
                    )}
                    {area.id === EParaCategory.AREAS && (
                      <>
                        <div className="flex items-center gap-2">
                          <Layers className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.active} active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.maintenance} maintenance</span>
                        </div>
                      </>
                    )}
                    {area.id === EParaCategory.RESOURCES && (
                      <>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.total} total</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.linked} linked</span>
                        </div>
                      </>
                    )}
                    {area.id === EParaCategory.ARCHIVE && (
                      <>
                        <div className="flex items-center gap-2">
                          <Archive className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.total} archived</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span>{area.items.recentlyArchived} recent</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View All
                    </Button>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed View */}
        {selectedArea && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {paraAreas.find((a) => a.id === selectedArea)?.title}
                </h2>
                <p className="text-muted-foreground">
                  {paraAreas.find((a) => a.id === selectedArea)?.description}
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Button>
            </div>

            {/* Database View for the selected category */}
            <DatabaseView
              moduleType={
                selectedArea === EParaCategory.PROJECTS
                  ? EDatabaseType.PARA_PROJECTS
                  : selectedArea === EParaCategory.AREAS
                  ? EDatabaseType.PARA_AREAS
                  : selectedArea === EParaCategory.RESOURCES
                  ? EDatabaseType.PARA_RESOURCES
                  : EDatabaseType.PARA_ARCHIVE
              }
            />
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Organize your Second Brain with the PARA method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                <Target className="h-6 w-6" />
                <span>Create Project</span>
                <span className="text-xs text-muted-foreground">
                  Start a new goal-oriented project
                </span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                <Layers className="h-6 w-6" />
                <span>Define Area</span>
                <span className="text-xs text-muted-foreground">
                  Set up ongoing responsibility
                </span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                <BookOpen className="h-6 w-6" />
                <span>Save Resource</span>
                <span className="text-xs text-muted-foreground">
                  Store reference material
                </span>
              </Button>
              <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                <Archive className="h-6 w-6" />
                <span>Review Archive</span>
                <span className="text-xs text-muted-foreground">
                  Clean up completed items
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Main>
    </>
  );
}
