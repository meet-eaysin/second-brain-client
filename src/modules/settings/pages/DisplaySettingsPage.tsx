import React from "react";
import { Link } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor } from "lucide-react";
import { DisplaySettings } from "../components/display-settings.tsx";

export const DisplaySettingsPage: React.FC = () => {
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
              <Monitor className="h-4 w-4" />
              Reset Display
            </Button>
          </>
        }
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
