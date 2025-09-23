import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/loading-spinner.tsx";
import { toast } from "sonner";
import { getSignInLink, getDashboardLink } from "@/app/router/router-link";
import { setToken, setRefreshToken } from "../utils/tokenUtils";

const GooglePopupCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = () => {
      let token = searchParams.get("token");
      let refreshToken = searchParams.get("refreshToken");
      const error = searchParams.get("error");

      if (!token || !refreshToken) {
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(hash.substring(1));
        token =
          token || urlParams.get("token") || urlParams.get("access_token");
        refreshToken =
          refreshToken ||
          urlParams.get("refreshToken") ||
          urlParams.get("refresh_token");
      }

      // Check if this is running in a popup
      const isPopup = window.opener && window.opener !== window;

      if (isPopup) {
        if (error) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              error: error,
            },
            window.location.origin
          );

          setTimeout(() => {
            window.close();
          }, 100);
          return;
        }

        if (token && refreshToken) {
          window.opener.postMessage(
            {
              type: "GOOGLE_AUTH_SUCCESS",
              accessToken: token,
              refreshToken: refreshToken,
            },
            window.location.origin
          );

          setTimeout(() => {
            window.close();
          }, 100);
          return;
        }

        window.opener.postMessage(
          {
            type: "GOOGLE_AUTH_ERROR",
            error: "No authentication data received",
          },
          window.location.origin
        );

        setTimeout(() => {
          window.close();
        }, 100);
        return;
      }

      if (error) {
        toast.error(`Authentication failed: ${error}`);
        navigate(getSignInLink(), { replace: true });
        return;
      }

      if (token && refreshToken) {
        setToken(token);
        setRefreshToken(refreshToken);

        toast.success("Authentication successful!");
        navigate(getDashboardLink(), { replace: true });
        return;
      }

      toast.error("No authentication data received");
      navigate(getSignInLink(), { replace: true });
    };

    const timer = setTimeout(processCallback, 500);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  return <LoadingSpinner />;
};

export default GooglePopupCallbackPage;
