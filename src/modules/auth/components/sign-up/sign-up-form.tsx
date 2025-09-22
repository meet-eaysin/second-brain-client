import { type HTMLAttributes } from "react";
import { Chrome, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrength } from "../password-strength";
import { authApi } from "../../services/auth-api";
import { useRegister } from "../../hooks/useRegister.ts";
import { toast } from "sonner";
import { useState } from "react";
import { useAuthService } from "../../hooks/useAuthService.ts";

type SignUpFormProps = HTMLAttributes<HTMLFormElement>;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const { form, handleRegister, isLoading, error } = useRegister();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { handleGoogleTokens } = useAuthService();

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);

      const isAvailable = await authApi.checkGoogleOAuthAvailability();
      if (!isAvailable) {
        toast.error(
          "Google OAuth is not configured on the backend. Please use the registration form or contact your administrator."
        );
        return;
      }

      const { accessToken, refreshToken } =
        await authApi.initiateGoogleAuthPopup();

      await handleGoogleTokens(accessToken, refreshToken);
    } catch (error: unknown) {
      console.error("Failed to initiate Google sign-up:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to initiate Google sign-up. Please try again.";
      toast.error(errorMessage);
    } finally {
      setGoogleLoading(false);
    }
  };

  const isFormLoading = isLoading || googleLoading;
  const passwordValue = form.watch("password");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleRegister)}
        className={cn("grid gap-4", className)}
        {...props}
        aria-label="Sign up form"
      >
        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "An error occurred during registration"}
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Choose a unique username"
                  autoComplete="username"
                  {...field}
                  disabled={isLoading}
                  aria-describedby="username-error"
                />
              </FormControl>
              <FormMessage id="username-error" />
            </FormItem>
          )}
        />

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    autoComplete="given-name"
                    {...field}
                    disabled={isLoading}
                    aria-describedby="firstName-error"
                  />
                </FormControl>
                <FormMessage id="firstName-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    autoComplete="family-name"
                    {...field}
                    disabled={isLoading}
                    aria-describedby="lastName-error"
                  />
                </FormControl>
                <FormMessage id="lastName-error" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...field}
                  disabled={isLoading}
                  aria-describedby="password-error"
                />
              </FormControl>
              <FormMessage id="password-error" />
              {passwordValue && (
                <PasswordStrength password={passwordValue} className="mt-2" />
              )}
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          disabled={isFormLoading}
          aria-describedby={error ? "form-error" : undefined}
        >
          {isLoading ? "Creating account..." : "Create your account"}
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
          onClick={handleGoogleSignUp}
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
