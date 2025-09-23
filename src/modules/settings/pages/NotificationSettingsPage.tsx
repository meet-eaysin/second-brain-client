import React from "react";
import { Link } from "react-router-dom";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { NotificationSettings } from "../components/NotificationSettings";

export const NotificationSettingsPage: React.FC = () => {
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
              <Bell className="h-4 w-4" />
              Test Notification
            </Button>
          </>
        }
      />

      <Main className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Notification Settings</h1>
          <p className="text-muted-foreground">
            Control how and when you receive notifications
          </p>
        </div>

        <NotificationSettings />
      </Main>
    </>
  );
};

export default NotificationSettingsPage;
