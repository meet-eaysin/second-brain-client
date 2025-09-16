import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useAuthService } from "../hooks/useAuthService";
import { authApi } from "../services/auth-api";
import { getSignInLink } from "@/app/router/router-link";
import { toast } from "sonner";
import { FullScreenLoader } from "@/components/loader/full-screen-loader.tsx";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback, error: googleAuthError } = useGoogleAuth();
  const { handleGoogleTokens } = useAuthService();
  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing"
  );

  useEffect(() => {
    const processCallback = async () => {
      try {
        const isPopup = window.opener && window.opener !== window;

        const { accessToken, refreshToken, error } =
          authApi.handleTokensFromUrl(searchParams);
        const code = searchParams.get("code");

        if (error) {
          setStatus("error");

          let errorMessage = "Google authentication failed. Please try again.";
          switch (error) {
            case "access_denied":
              errorMessage =
                "Google authentication was cancelled. Please try again.";
              break;
            case "invalid_state":
              errorMessage = "Security validation failed. Please try again.";
              break;
            case "oauth_failed":
              errorMessage = "Google authentication failed. Please try again.";
              break;
            default:
              errorMessage = `Authentication error: ${error}`;
          }

          if (isPopup) {
            window.opener?.postMessage(
              {
                type: "GOOGLE_AUTH_ERROR",
                error: errorMessage,
              },
              window.location.origin
            );

            setTimeout(() => {
              window.close();
            }, 100);
            return;
          }

          toast.error(errorMessage);
          setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
          return;
        }

        if (accessToken && refreshToken) {
          setStatus("success");

          if (isPopup) {
            window.opener?.postMessage(
              {
                type: "GOOGLE_AUTH_SUCCESS",
                accessToken,
                refreshToken,
              },
              window.location.origin
            );

            setTimeout(() => {
              window.close();
            }, 100);
            return;
          }

          await handleGoogleTokens(accessToken, refreshToken);
          return;
        }

        if (code) {
          handleGoogleCallback(code);
          return;
        }

        setStatus("error");

        // Handle popup case
        if (isPopup) {
          window.opener?.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              error: "Invalid Google authentication response.",
            },
            window.location.origin
          );

          setTimeout(() => {
            window.close();
          }, 100);
          return;
        }

        toast.error("Invalid Google authentication response.");
        setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
      } catch (error) {
        console.error("❌ Error processing Google callback:", error);
        setStatus("error");

        // Check if this is a popup (need to check again in catch block)
        const isPopup = window.opener && window.opener !== window;

        if (isPopup) {
          window.opener?.postMessage(
            {
              type: "GOOGLE_AUTH_ERROR",
              error: "Failed to process Google authentication.",
            },
            window.location.origin
          );

          setTimeout(() => {
            window.close();
          }, 100);
          return;
        }

        toast.error("Failed to process Google authentication.");
        setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, handleGoogleTokens, navigate]);

  useEffect(() => {
    if (googleAuthError) {
      setStatus("error");
      toast.error("Google authentication failed. Please try again.");
      setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
    }
  }, [googleAuthError, navigate]);

  const isPopup = window.opener && window.opener !== window;

  if (isPopup) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
          <p style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#333" }}>
            {status === "processing"
              ? "Completing authentication..."
              : status === "success"
              ? "Authentication successful!"
              : "Authentication failed"}
          </p>
          <p style={{ margin: "0", fontSize: "12px", color: "#666" }}>
            This window will close automatically.
          </p>
        </div>

        <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Authentication Successful!
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecting you to the dashboard...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Authentication Failed</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecting you back to sign in...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <FullScreenLoader
        message="Processing Google authentication..."
        size="lg"
        variant="primary"
      />
    </div>
  );
};

export default GoogleCallbackPage;
