import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { adminApi } from "../services/admin-api";

export const SetupWrapper: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);

  useEffect(() => {
    const checkSetupStatus = async () => {
      try {
        const data = await adminApi.checkSetupStatus();

        if (data.setupNeeded) {
          setSetupNeeded(true);
        } else {
          setSetupNeeded(false);
        }
      } catch {
        setSetupNeeded(false);
      } finally {
        setChecking(false);
      }
    };

    checkSetupStatus();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Checking system setup...</p>
        </div>
      </div>
    );
  }

  if (setupNeeded) {
    return <Navigate to="/setup" replace />;
  }

  return <Outlet />;
};
