import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatabaseView } from "@/modules/database-view";
import { EDatabaseType } from "@/modules/database-view/types";
import { EnhancedHeader } from "@/components/enhanced-header";

export function DatabaseViewPage() {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();

  if (!databaseId) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Database not found</h1>
          <Button onClick={() => navigate("/app/databases")}>
            Back to Databases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
        <EnhancedHeader
        contextActions={
          <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/app/databases")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          </>
        }
      />

      {/* Database View */}
      <div className="container mx-auto px-4 py-6">
        <DatabaseView
          moduleType={EDatabaseType.CUSTOM}
          databaseId={databaseId}
          className="max-w-none"
        />
      </div>
    </div>
  );
}
