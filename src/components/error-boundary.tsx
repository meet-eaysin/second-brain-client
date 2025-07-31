import React, {Component, type ErrorInfo, type ReactNode} from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ error, errorInfo });
        
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }

        // Call custom error handler if provided
        this.props.onError?.(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <div className="min-h-[400px] flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg mx-auto">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardTitle className="text-xl">Something went wrong</CardTitle>
                            <CardDescription className="text-sm">
                                An unexpected error occurred. Please try again or go back to the home page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-full overflow-hidden">
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-sm">
                                    <summary className="cursor-pointer font-medium text-muted-foreground">
                                        Error Details (Development)
                                    </summary>
                                    <div className="mt-2 rounded bg-muted p-3 font-mono text-xs max-h-40 overflow-auto">
                                        <div className="font-semibold text-destructive break-words">
                                            {this.state.error.name}: {this.state.error.message}
                                        </div>
                                        {this.state.error.stack && (
                                            <pre className="mt-2 whitespace-pre-wrap text-xs break-words overflow-x-auto">
                                                {this.state.error.stack}
                                            </pre>
                                        )}
                                    </div>
                                </details>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button onClick={this.handleRetry} className="flex-1">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Try Again
                                </Button>
                                <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                                    <Home className="mr-2 h-4 w-4" />
                                    Go Home
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

// Hook version for functional components
export const withErrorBoundary = <P extends object>(
    Component: React.ComponentType<P>,
    fallback?: ReactNode,
    onError?: (error: Error, errorInfo: ErrorInfo) => void
) => {
    const WrappedComponent = (props: P) => (
        <ErrorBoundary fallback={fallback} onError={onError}>
            <Component {...props} />
        </ErrorBoundary>
    );

    WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
    return WrappedComponent;
};

// Simple error boundary for pages
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
    <ErrorBoundary
        onError={(error, errorInfo) => {
            // Log to error reporting service in production
            console.error('Page Error:', error, errorInfo);
        }}
    >
        {children}
    </ErrorBoundary>
);
