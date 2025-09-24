import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DatabaseView, EDatabaseType } from "@/modules/database-view";

export function FinancesPage() {
  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        <DatabaseView moduleType={EDatabaseType.FINANCE} />
      </Main>
    </>
  );
}
