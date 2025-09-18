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
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { toast } from "sonner";

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { form, handleLogin, isLoading, error } = useLogin();
  const [googleLoading, setGoogleLoading] = useState(false);

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
        onSubmit={form.handleSubmit(handleLogin)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
              <Link
                to="/auth/forgot-password"
                className="text-muted-foreground absolute -top-0.5 right-0 text-sm font-medium hover:opacity-75"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-red-600">
            {error instanceof Error ? error.message : String(error)}
          </div>
        )}

        <Button className="mt-2" disabled={isFormLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="relative my-2">
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
        >
          <Chrome className="h-4 w-4 mr-2" />
          {googleLoading ? "Authenticating..." : "Continue with Google"}
        </Button>
      </form>
    </Form>
  );
}
