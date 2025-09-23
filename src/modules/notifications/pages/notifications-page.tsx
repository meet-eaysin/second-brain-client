import React from "react";
import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { NotificationsPanel } from "../components/NotificationsPanel";

export default function NotificationsPage() {
  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        <NotificationsPanel />
      </Main>
    </>
  );
}
