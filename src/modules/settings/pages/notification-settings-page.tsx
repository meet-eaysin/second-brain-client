import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { NotificationSettings } from "../components/notification-settings.tsx";

export const NotificationSettingsPage: React.FC = () => {
  return (
    <>
      <EnhancedHeader
      
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
