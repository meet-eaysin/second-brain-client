import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

export const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
    return (
        <div className="flex items-center justify-center min-h-64 p-8">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-4 w-12 h-12 text-red-500">
                    <AlertCircle className="w-full h-full" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Oops! Something went wrong
                </h2>

                <p className="text-gray-600 mb-4">
                    {error.message || 'An unexpected error occurred while loading this page.'}
                </p>

                <div className="space-y-2">
                    <button
                        onClick={resetErrorBoundary}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try again
                    </button>

                    <button
                        onClick={() => window.location.reload()}
                        className="block w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        Reload page
                    </button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <details className="mt-4 text-left">
                        <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                            Error details (development only)
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                            {error.stack}
                        </pre>
                    </details>
                )}
            </div>
        </div>
    );
};