import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DatabaseView } from "@/modules/database-view";
import { EDatabaseType } from "@/modules/database-view";

export function PeoplePage() {
  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        <DatabaseView moduleType={EDatabaseType.PEOPLE}/>
      </Main>
    </>
  );
}
