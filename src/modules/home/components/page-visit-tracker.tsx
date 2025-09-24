import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWorkspace } from "@/modules/workspaces/context";
import { systemApi } from "../services/system-api";

export function PageVisitTracker() {
  const { currentWorkspace } = useWorkspace();
  const location = useLocation();

  useEffect(() => {
    if (currentWorkspace?.id) {
      systemApi
        .recordPageVisit(location.pathname, currentWorkspace.id)
        .catch(console.error);
    }
  }, [currentWorkspace?.id, location.pathname]);

  return null;
}
