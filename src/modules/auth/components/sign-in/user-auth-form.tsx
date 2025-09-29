import type { HTMLAttributes } from "react";
import { useState } from "react";
import { useLogin } from "@/modules/auth/hooks/useLogin";
import { authApi } from "@/modules/auth/services/auth-api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Chrome, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { form, handleLogin, isLoading, error } = useLogin();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      await authApi.initiateGoogleAuth();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate Google login. Please try again.";
      toast.error(errorMessage);
      setGoogleLoading(false); // Only set loading to false on error
    }
    // Note: Don't set loading to false in finally block since page will redirect
  };

  const isFormLoading = isLoading || googleLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleLogin(data, rememberMe))}
        className={cn("grid gap-4", className)}
        {...props}
        aria-label="Sign in form"
      >
        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "An error occurred during sign in"}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
                  {...field}
                  disabled={isLoading}
                  aria-describedby="email-error"
                />
              </FormControl>
              <FormMessage id="email-error" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                  disabled={isLoading}
                  aria-describedby="password-error"
                />
              </FormControl>
              <FormMessage id="password-error" />
              <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary underline underline-offset-4"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isFormLoading}
          aria-describedby={error ? "form-error" : undefined}
        >
          {isLoading ? "Signing in..." : "Sign in to your account"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={isFormLoading}
          onClick={handleGoogleLogin}
          className="w-full"
          aria-label="Continue with Google"
        >
          <Chrome className="h-4 w-4 mr-2" />
          {googleLoading ? "Authenticating..." : "Continue with Google"}
        </Button>
      </form>
    </Form>
  );
}
