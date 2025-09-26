import React from "react";
import { Link } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Palette } from "lucide-react";
import { AppearanceSettings } from "../components/appearance-settings.tsx";

export const AppearancePage: React.FC = () => {
  return (
    <>
      <EnhancedHeader
        contextActions={
          <>
            <Button size="sm" variant="outline" className="h-8 gap-2" asChild>
              <Link to="/app/settings">
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </Link>
            </Button>
            <Button size="sm" className="h-8 gap-2">
              <Palette className="h-4 w-4" />
              Reset Theme
            </Button>
          </>
        }
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
