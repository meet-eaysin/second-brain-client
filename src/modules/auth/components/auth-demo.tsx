import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthService } from '../hooks/useAuthService';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '@/components/loading-spinner';
import { 
    User, 
    LogOut, 
    Shield, 
    Clock, 
    CheckCircle, 
    XCircle,
    RefreshCw,
    Users
} from 'lucide-react';

/**
 * Demo component showcasing all authentication features
 * This component demonstrates the complete auth implementation
 */
export const AuthDemo: React.FC = () => {
    const { 
        user, 
        isAuthenticated, 
        hasToken, 
        isLoading,
        error,
        loginWithGoogle,
        logout,
        logoutAll,
        refreshToken,
        loginLoading,
        logoutLoading,
        logoutAllLoading
    } = useAuthService();

    const { intendedPath } = useAuth();

    const handleGoogleLogin = async () => {
        try {
            console.log('🚀 Demo: Initiating Google OAuth popup...');
            await loginWithGoogle();
            console.log('✅ Demo: Google authentication successful');
        } catch (error: unknown) {
            console.error('Demo: Google login failed:', error);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    const handleLogoutAll = async () => {
        await logoutAll();
    };

    const handleRefreshToken = async () => {
        const success = await refreshToken();
        if (success) {
            console.log('Token refreshed successfully');
        } else {
            console.log('Token refresh failed');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Authentication Status
                    </CardTitle>
                    <CardDescription>
                        Current authentication state and user information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Authenticated:</span>
                            {isAuthenticated ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Yes
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    No
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Has Token:</span>
                            {hasToken ? (
                                <Badge variant="default" className="bg-blue-100 text-blue-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Yes
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    No
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Loading:</span>
                            {isLoading ? (
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Yes
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    No
                                </Badge>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Error:</span>
                            {error ? (
                                <Badge variant="destructive">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Yes
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    No
                                </Badge>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-800">
                                <strong>Error:</strong> {error.toString()}
                            </p>
                        </div>
                    )}

                    {intendedPath && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm text-blue-800">
                                <strong>Intended Path:</strong> {intendedPath}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {user && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-sm">{user.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Username</p>
                                <p className="text-sm">{user.username}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Role</p>
                                <Badge variant="outline">{user.role}</Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Auth Provider</p>
                                <Badge variant={user.authProvider === 'GOOGLE' ? 'default' : 'secondary'}>
                                    {user.authProvider}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Email Verified</p>
                                {user.isEmailVerified ? (
                                    <Badge variant="default" className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Pending
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Last Login</p>
                                <p className="text-sm">
                                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Authentication Actions</CardTitle>
                    <CardDescription>
                        Test various authentication functions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {!isAuthenticated && (
                            <Button 
                                onClick={handleGoogleLogin}
                                disabled={loginLoading}
                                className="flex items-center gap-2"
                            >
                                {loginLoading ? (
                                    <LoadingSpinner size="sm" />
                                ) : (
                                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                )}
                                Sign in with Google
                            </Button>
                        )}

                        {isAuthenticated && (
                            <>
                                <Button 
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    {logoutLoading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <LogOut className="h-4 w-4" />
                                    )}
                                    Logout
                                </Button>

                                <Button 
                                    onClick={handleLogoutAll}
                                    disabled={logoutAllLoading}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    {logoutAllLoading ? (
                                        <LoadingSpinner size="sm" />
                                    ) : (
                                        <Users className="h-4 w-4" />
                                    )}
                                    Logout All Devices
                                </Button>

                                <Button 
                                    onClick={handleRefreshToken}
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Refresh Token
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
