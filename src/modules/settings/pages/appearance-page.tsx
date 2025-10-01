import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { AppearanceSettings } from "../components/appearance-settings.tsx";

export const AppearancePage: React.FC = () => {
  return (
    <>
      <EnhancedHeader
        
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Appearance Settings</h1>
          <p className="text-muted-foreground">
            Customize the look and feel of your workspace
          </p>
        </div>

        <AppearanceSettings />
      </Main>
    </>
  );
};

export default AppearancePage;
