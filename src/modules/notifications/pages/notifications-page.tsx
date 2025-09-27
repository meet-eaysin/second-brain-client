import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { NotificationsPanel } from "@/modules/notifications/components/notifications-panel.tsx";

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
