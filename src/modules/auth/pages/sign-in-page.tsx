import SignIn from "@/modules/auth/components/sign-in";
import {ErrorBoundary} from "@/app/providers/ErrorBoundary.tsx";

export const SignInPage = () => {
    return (
        <ErrorBoundary>
                <SignIn />
        </ErrorBoundary>
    )
}
