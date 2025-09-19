import { Main } from "@/layout/main";
import { EnhancedHeader } from "@/components/enhanced-header";
import { DocumentView } from "@/modules/document-view";
import { EDatabaseType } from "@/modules/document-view";

export function PeoplePage() {
  return (
    <>
      <EnhancedHeader />

      <Main className="space-y-8">
        <DocumentView moduleType={EDatabaseType.PEOPLE}/>
      </Main>
    </>
  );
}
