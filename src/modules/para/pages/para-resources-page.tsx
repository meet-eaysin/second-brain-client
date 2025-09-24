import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DatabaseView, EDatabaseType } from "@/modules/database-view";

export function PARAResourcesPage() {
  return (
    <>
      <EnhancedHeader />
      <Main className="space-y-8">
        <DatabaseView moduleType={EDatabaseType.PARA_RESOURCES} />
      </Main>
    </>
  );
}
