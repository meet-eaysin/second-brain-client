import {ErrorBoundary} from "@/app/providers/error-boundary.tsx";

const NotFoundPage = () => (
    <ErrorBoundary>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">404 - Page Not Found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
            </div>
        </div>
    </ErrorBoundary>
)

export default NotFoundPage