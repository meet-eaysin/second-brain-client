import { useNavigate } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import {
  Target,
  Layers,
  BookOpen,
  Archive,
  AlertCircle,
} from "lucide-react";
import { useParaStats } from "../services/para-queries";
import { EParaCategory, EParaStatus, EParaPriority } from "../types/para.types";
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

  // Reviews data now comes from paraStats

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card/50 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </div>
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
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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

  // Extract data from backend response structure
  const totalItems = paraStats?.totalItems || 0;
  const activeItems = paraStats?.byStatus[EParaStatus.ACTIVE] ?
    Object.values(paraStats.byStatus[EParaStatus.ACTIVE]).reduce((a, b) => a + b, 0) : 0;
  const completedItems = paraStats?.byStatus[EParaStatus.COMPLETED] ?
    Object.values(paraStats.byStatus[EParaStatus.COMPLETED]).reduce((a, b) => a + b, 0) : 0;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const reviewsOverdue = paraStats?.reviewsOverdue || 0;



  return (
    <>
      <EnhancedHeader />
      <Main className="space-y-8">
        {/* Header with Key Metrics */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">PARA System Overview</h1>
            <p className="text-muted-foreground">Complete productivity system analytics</p>
          </div>

          {/* Primary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold text-green-600">{activeItems}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className="text-2xl font-bold">{completionRate}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
            </div>
            <div className="p-4 rounded-lg border bg-card">
              <div className={`text-2xl font-bold ${reviewsOverdue > 0 ? 'text-red-600' : ''}`}>
                {reviewsOverdue}
              </div>
              <div className="text-sm text-muted-foreground">Reviews Overdue</div>
            </div>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Status & Priority */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Category Breakdown</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Projects</span>
                  </div>
                  <div className="text-xl font-bold">{paraStats?.byCategory[EParaCategory.PROJECTS] || 0}</div>
                  <div className="text-xs text-muted-foreground">total items</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">Areas</span>
                  </div>
                  <div className="text-xl font-bold">{paraStats?.byCategory[EParaCategory.AREAS] || 0}</div>
                  <div className="text-xs text-muted-foreground">total items</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Resources</span>
                  </div>
                  <div className="text-xl font-bold">{paraStats?.byCategory[EParaCategory.RESOURCES] || 0}</div>
                  <div className="text-xs text-muted-foreground">total items</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <Archive className="h-4 w-4 text-gray-600" />
                    <span className="font-medium">Archive</span>
                  </div>
                  <div className="text-xl font-bold">{paraStats?.byCategory[EParaCategory.ARCHIVE] || 0}</div>
                  <div className="text-xs text-muted-foreground">total items</div>
                </div>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Priority Distribution</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-lg font-bold text-red-600">{paraStats?.byPriority[EParaPriority.CRITICAL] || 0}</div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-lg font-bold text-orange-600">{paraStats?.byPriority[EParaPriority.HIGH] || 0}</div>
                  <div className="text-sm text-muted-foreground">High</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-lg font-bold text-yellow-600">{paraStats?.byPriority[EParaPriority.MEDIUM] || 0}</div>
                  <div className="text-sm text-muted-foreground">Medium</div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="text-lg font-bold text-green-600">{paraStats?.byPriority[EParaPriority.LOW] || 0}</div>
                  <div className="text-sm text-muted-foreground">Low</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Areas & Archives */}
          <div className="space-y-6">
            {/* Areas Analytics */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Areas Analytics</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Areas</span>
                    <span className="text-xl font-bold">{paraStats?.areas.total || 0}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Maintenance Overdue</span>
                    <span className={`text-xl font-bold ${(paraStats?.areas.maintenanceOverdue || 0) > 0 ? 'text-orange-600' : ''}`}>
                      {paraStats?.areas.maintenanceOverdue || 0}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Reviews Overdue</span>
                    <span className={`text-xl font-bold ${(paraStats?.areas.reviewsOverdue || 0) > 0 ? 'text-red-600' : ''}`}>
                      {paraStats?.areas.reviewsOverdue || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Archive Analytics */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Archive Analytics</h2>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Archived</span>
                    <span className="text-xl font-bold">{paraStats?.archives.total || 0}</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Recently Archived (30d)</span>
                    <span className="text-xl font-bold text-orange-600">{paraStats?.archives.recentlyArchived || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Items */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Cross-Module Links</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-lg font-bold">{paraStats?.linkedItems.projects || 0}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-lg font-bold">{paraStats?.linkedItems.resources || 0}</div>
                  <div className="text-xs text-muted-foreground">Resources</div>
                </div>
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-lg font-bold">{paraStats?.linkedItems.tasks || 0}</div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
                <div className="p-3 rounded-lg border bg-card text-center">
                  <div className="text-lg font-bold">{paraStats?.linkedItems.notes || 0}</div>
                  <div className="text-xs text-muted-foreground">Notes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-medium text-green-600">Recently Created</h3>
              {paraStats?.recentlyCreated?.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
                </div>
              )) || <div className="p-4 text-center text-muted-foreground">No recent items</div>}
            </div>
            <div className="space-y-3">
              <h3 className="font-medium text-orange-600">Recently Archived</h3>
              {paraStats?.recentlyArchived?.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card/50">
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(item.archivedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{item.originalCategory}</div>
                </div>
              )) || <div className="p-4 text-center text-muted-foreground">No recent archives</div>}
            </div>
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button variant="outline" size="sm" onClick={() => navigate(getPARAProjectsLink())}>
            <Target className="h-3 w-3 mr-1" />
            Projects
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(getPARAAreasLink())}>
            <Layers className="h-3 w-3 mr-1" />
            Areas
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(getPARAResourcesLink())}>
            <BookOpen className="h-3 w-3 mr-1" />
            Resources
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(getPARAArchiveLink())}>
            <Archive className="h-3 w-3 mr-1" />
            Archive
          </Button>
        </div>
      </Main>
    </>
  );
}

