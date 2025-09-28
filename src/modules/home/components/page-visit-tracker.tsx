import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useWorkspace } from "@/modules/workspaces/context";
import { useRecordPageVisit } from "../services/home-queries";

export function PageVisitTracker() {
  const { currentWorkspace } = useWorkspace();
  const location = useLocation();
  const recordPageVisit = useRecordPageVisit();
  const lastPathnameRef = useRef<string>(null);

  useEffect(() => {
    if (
      currentWorkspace?._id &&
      location.pathname !== lastPathnameRef.current
    ) {
      lastPathnameRef.current = location.pathname;

      recordPageVisit.mutate({
        page: location.pathname,
        workspaceId: currentWorkspace._id,
      });
    }
  }, [currentWorkspace?._id, location.pathname]);

  return null;
}
