import { Link } from 'react-router-dom';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { getSignInLink, getSignUpLink, getDashboardLink } from '@/app/router/router-link.ts';
import { Button } from '@/components/ui/button';

export const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">YourApp</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {isAuthenticated ? (
                                <Link to={getDashboardLink()}>
                                    <Button>Go to Dashboard</Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to={getSignInLink()}>
                                        <Button variant="outline">Sign In</Button>
                                    </Link>
                                    <Link to={getSignUpLink()}>
                                        <Button>Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-20 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                        Welcome to <span className="text-indigo-600">YourApp</span>
                    </h2>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
                        The best platform to manage your data and boost your productivity.
                        Join thousands of users who trust us with their business.
                    </p>
                    <div className="mt-10 flex justify-center space-x-4">
                        {isAuthenticated ? (
                            <Link to={getDashboardLink()}>
                                <Button size="lg" className="px-8 py-3">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link to={getSignUpLink()}>
                                    <Button size="lg" className="px-8 py-3">
                                        Get Started Free
                                    </Button>
                                </Link>
                                <Link to={getSignInLink()}>
                                    <Button variant="outline" size="lg" className="px-8 py-3">
                                        Sign In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-indigo-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Reliable</h3>
                            <p className="text-gray-600">Lightning-fast performance with 99.9% uptime guarantee.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
                            <p className="text-gray-600">Enterprise-grade security to protect your data.</p>
                        </div>
                        <div className="text-center">
                            <div className="bg-indigo-500 rounded-lg p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
                            <p className="text-gray-600">Intuitive interface designed for maximum productivity.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2024 YourApp. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};