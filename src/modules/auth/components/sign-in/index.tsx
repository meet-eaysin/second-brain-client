import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "@/modules/auth/layout/auth-layout.tsx";
import { UserAuthForm } from "@/modules/auth/components/sign-in/user-auth-form.tsx";

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="text-base">
            Sign in to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UserAuthForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/auth/sign-up"
              className="font-medium text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Create one here
            </a>
          </div>
          <p className="text-center text-xs text-muted-foreground px-4">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
