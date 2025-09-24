import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useWorkspace } from "@/modules/workspaces/context";
import { useRecordPageVisit } from "../services/home-queries";

export function PageVisitTracker() {
  const { currentWorkspace } = useWorkspace();
  const location = useLocation();
  const recordPageVisit = useRecordPageVisit();
  const lastPathnameRef = useRef<string>();

  useEffect(() => {
    // Only record page visit if pathname actually changed
    if (currentWorkspace?.id && location.pathname !== lastPathnameRef.current) {
      lastPathnameRef.current = location.pathname;

      // Record page visit using React Query mutation
      recordPageVisit.mutate({
        page: location.pathname,
        workspaceId: currentWorkspace.id,
      });
    }
  }, [currentWorkspace?.id, location.pathname]); // Removed recordPageVisit from deps

  return null;
}
