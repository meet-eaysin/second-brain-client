import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DisplaySettings } from "../components/display-settings.tsx";

export const DisplaySettingsPage: React.FC = () => {
  return (
    <>
      <EnhancedHeader
        
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Display</h1>
          <p className="text-muted-foreground">
            Configure display settings, layout preferences, and screen
            optimization
          </p>
        </div>

        <DisplaySettings />
      </Main>
    </>
  );
};

export default DisplaySettingsPage;
