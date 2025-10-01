import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { WorkspaceSettings } from "../components/workspace-settings.tsx";

export const WorkspaceSettingsPage: React.FC = () => {
  return (
    <>
      <EnhancedHeader
        
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Workspace</h1>
          <p className="text-muted-foreground">
            Configure workspace settings and permissions
          </p>
        </div>

        <WorkspaceSettings />
      </Main>
    </>
  );
};

export default WorkspaceSettingsPage;
