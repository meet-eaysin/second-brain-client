import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "@/modules/auth/layout/auth-layout.tsx";
import { Link } from "react-router-dom";
import { SignUpForm } from "@/modules/auth/components/sign-up/sign-up-form.tsx";
import { getSignInLink } from "@/app/router/router-link.ts";

export default function SignUp() {
  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Join Second Brain
          </CardTitle>
          <CardDescription className="text-base">
            Create your account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={getSignInLink()}
              className="font-medium text-primary hover:text-primary/80 underline underline-offset-4"
            >
              Sign in here
            </Link>
          </div>
          <p className="text-center text-xs text-muted-foreground px-4">
            By creating an account, you agree to our{" "}
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
