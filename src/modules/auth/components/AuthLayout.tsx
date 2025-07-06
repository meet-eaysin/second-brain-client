import type {ReactNode} from "react";

interface AuthLayoutProps {
    children: ReactNode
    title?: string
}

export const AuthLayout = ({ children, title = "Sign in to your account" }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                </div>
                {children}
            </div>
        </div>
    )
}
