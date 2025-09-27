import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { getSignInLink, getDashboardLink } from "@/app/router/router-link";
import { toast } from "sonner";

const AuthErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      let errorMessage = "Authentication failed. Please try again.";

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
        case "invalid_request":
          errorMessage = "Invalid authentication request. Please try again.";
          break;
        case "server_error":
          errorMessage =
            "Server error occurred during authentication. Please try again later.";
          break;
        default:
          errorMessage = `Authentication error: ${error}`;
      }

      toast.error(errorMessage);
    }
  }, [error]);

  const handleGoToSignIn = () => {
    navigate(getSignInLink(), { replace: true });
  };

  const handleGoHome = () => {
    navigate(getDashboardLink(), { replace: true });
  };

  const getErrorTitle = () => {
    switch (error) {
      case "access_denied":
        return "Authentication Cancelled";
      case "invalid_state":
        return "Security Validation Failed";
      case "oauth_failed":
        return "Google Authentication Failed";
      case "server_error":
        return "Server Error";
      default:
        return "Authentication Error";
    }
  };

  const getErrorDescription = () => {
    switch (error) {
      case "access_denied":
        return "You cancelled the Google authentication process. Please try signing in again.";
      case "invalid_state":
        return "The authentication request failed security validation. This may be due to an expired or tampered request.";
      case "oauth_failed":
        return "There was an issue with Google authentication. Please try again or contact support if the problem persists.";
      case "server_error":
        return "A server error occurred during authentication. Please try again later.";
      default:
        return "An error occurred during the authentication process. Please try signing in again.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {getErrorTitle()}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {getErrorDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Button onClick={handleGoToSignIn} className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Sign In Again
            </Button>
            <Button onClick={handleGoHome} variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthErrorPage;
