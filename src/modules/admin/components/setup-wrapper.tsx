import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { adminApi } from "../services/admin-api";
import {LoadingSpinner} from "@/components/loading-spinner.tsx";

export const SetupWrapper = ({ children }: { children: React.ReactNode}) => {
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

  if (checking) return <LoadingSpinner/>
  if (setupNeeded) return <Navigate to="/setup" replace />

  return children
};
