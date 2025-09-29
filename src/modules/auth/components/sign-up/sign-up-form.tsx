import { type HTMLAttributes } from "react";
import { Chrome } from "lucide-react";
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
import { authApi } from "../../services/auth-api";
import { useRegister } from "../../hooks/useRegister.ts";
import { toast } from "sonner";
import { useState } from "react";
import { useAuthService } from "../../hooks/useAuthService.ts";

type SignUpFormProps = HTMLAttributes<HTMLFormElement>;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const { form, handleRegister, isLoading } = useRegister();
  const [googleLoading, setGoogleLoading] = useState(false);
  const { handleGoogleTokens } = useAuthService();

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);

      const isAvailable = await authApi.checkGoogleOAuthAvailability();
      if (!isAvailable) {
        toast.error(
          "Google OAuth is not available at this moment. Please use the registration form or contact your administrator."
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

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(handleRegister)(e);
        }}
        className={cn("space-y-6", className)}
        noValidate
        {...props}
        aria-label="Sign up form"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Choose a unique username (letters, numbers, hyphens)"
                    autoComplete="username"
                    {...field}
                    disabled={isLoading}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="email"
                    {...field}
                    disabled={isLoading}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    First Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John"
                      autoComplete="given-name"
                      {...field}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Last Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Doe"
                      autoComplete="family-name"
                      {...field}
                      disabled={isLoading}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Create a password (min. 8 characters)"
                    autoComplete="new-password"
                    {...field}
                    disabled={isLoading}
                    className="h-11"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full h-11" disabled={isFormLoading}>
          {isLoading ? "Creating account..." : "Sign Up"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          disabled={isFormLoading}
          onClick={handleGoogleSignUp}
          className="w-full h-11"
        >
          <Chrome className="h-4 w-4 mr-2" />
          {googleLoading ? "Authenticating..." : "Continue with Google"}
        </Button>
      </form>
    </Form>
  );
}
