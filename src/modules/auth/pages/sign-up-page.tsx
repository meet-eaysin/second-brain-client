import SignUp from "@/modules/auth/components/sign-up";
import {ErrorBoundary} from "@/app/providers/ErrorBoundary.tsx";

export const SignUpPage = () => {
    return (
        <ErrorBoundary>
                <SignUp/>
        </ErrorBoundary>
    )
}
