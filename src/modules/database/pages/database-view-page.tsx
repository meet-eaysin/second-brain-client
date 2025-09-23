import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatabaseView } from "@/modules/database-view";
import { EDatabaseType } from "@/modules/database-view/types";

export function DatabaseViewPage() {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();

  if (!databaseId) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Database not found</h1>
          <Button onClick={() => navigate("/databases")}>
            Back to Databases
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/databases")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Databases
          </Button>
        </div>
      </div>

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
