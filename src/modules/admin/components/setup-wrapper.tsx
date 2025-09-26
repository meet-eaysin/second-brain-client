import React, { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { adminApi } from "../services/adminApi";

/**
 * SetupWrapper component that checks if initial system setup is needed
 * and redirects to setup page if no super admin exists
 */
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
      } catch (error) {
        console.error("Failed to check setup status:", error);
        // If we can't check setup status, assume it's not needed to avoid blocking the app
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
