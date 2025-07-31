import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { authApi } from '../services/authApi';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';
import { 
    CheckCircle, 
    XCircle, 
    AlertCircle, 
    ExternalLink,
    User,
    Mail,
    Key,
    Shield
} from 'lucide-react';

export default function AuthTestPage() {
    const { user, isAuthenticated, hasToken } = useAuth();

    const testGoogleAuth = async () => {
        try {
            const response = await authApi.getGoogleLoginUrl();
            if (response.url) {
                toast.success('Redirecting to Google OAuth...');
                window.location.href = response.url;
            }
        } catch (error) {
            console.error('Google auth test failed:', error);
            toast.error('Failed to initiate Google OAuth');
        }
    };

    const testApiConnection = async () => {
        try {
            // Test if the API is reachable
            const response = await fetch('/api/health');
            if (response.ok) {
                toast.success('API connection successful');
            } else {
                toast.error('API connection failed');
            }
        } catch (error) {
            console.error('API test failed:', error);
            toast.error('API connection failed');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Authentication System Test</h1>
                <p className="text-muted-foreground">
                    Test and verify the authentication system functionality
                </p>
            </div>

            {/* Current Auth Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Current Authentication Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            {hasToken ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span>Has Token: </span>
                            <Badge variant={hasToken ? "default" : "destructive"}>
                                {hasToken ? "Yes" : "No"}
                            </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {isAuthenticated ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span>Authenticated: </span>
                            <Badge variant={isAuthenticated ? "default" : "destructive"}>
                                {isAuthenticated ? "Yes" : "No"}
                            </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {user ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <span>User Data: </span>
                            <Badge variant={user ? "default" : "destructive"}>
                                {user ? "Loaded" : "None"}
                            </Badge>
                        </div>
                    </div>

                    {user && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                User Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div><strong>ID:</strong> {user.id}</div>
                                <div><strong>Username:</strong> {user.username}</div>
                                <div><strong>Email:</strong> {user.email}</div>
                                <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
                                <div><strong>Role:</strong> {user.role}</div>
                                <div><strong>Status:</strong> {user.isActive ? 'Active' : 'Inactive'}</div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* API Endpoints Test */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Endpoints
                    </CardTitle>
                    <CardDescription>
                        Test authentication API endpoints and functionality
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-semibold">OAuth Endpoints</h4>
                            <div className="space-y-2">
                                <Button 
                                    onClick={testGoogleAuth}
                                    className="w-full justify-start"
                                    variant="outline"
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Test Google OAuth
                                </Button>
                                <div className="text-xs text-muted-foreground">
                                    GET /auth/google → Redirect to Google
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">API Connection</h4>
                            <div className="space-y-2">
                                <Button 
                                    onClick={testApiConnection}
                                    className="w-full justify-start"
                                    variant="outline"
                                >
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Test API Connection
                                </Button>
                                <div className="text-xs text-muted-foreground">
                                    Check if backend API is reachable
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Authentication Flow */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Authentication Flow
                    </CardTitle>
                    <CardDescription>
                        Step-by-step authentication process
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                1
                            </div>
                            <div>
                                <div className="font-semibold">User clicks "Continue with Google"</div>
                                <div className="text-sm text-muted-foreground">
                                    Frontend calls GET /auth/google
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                2
                            </div>
                            <div>
                                <div className="font-semibold">Backend redirects to Google OAuth</div>
                                <div className="text-sm text-muted-foreground">
                                    User authenticates with Google
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                3
                            </div>
                            <div>
                                <div className="font-semibold">Google redirects to callback</div>
                                <div className="text-sm text-muted-foreground">
                                    GET /auth/google/callback?code=...&state=...
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                4
                            </div>
                            <div>
                                <div className="font-semibold">Frontend handles callback</div>
                                <div className="text-sm text-muted-foreground">
                                    POST /auth/google/callback with authorization code
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                5
                            </div>
                            <div>
                                <div className="font-semibold">Authentication complete</div>
                                <div className="text-sm text-muted-foreground">
                                    User receives JWT tokens and is redirected to dashboard
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Troubleshooting
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3 text-sm">
                        <div>
                            <strong>If Google OAuth fails:</strong>
                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                <li>Check if backend API is running</li>
                                <li>Verify Google OAuth credentials in backend</li>
                                <li>Check browser console for errors</li>
                                <li>Ensure callback URL is registered with Google</li>
                            </ul>
                        </div>
                        
                        <div>
                            <strong>If authentication state is inconsistent:</strong>
                            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                <li>Clear localStorage and refresh</li>
                                <li>Check token expiration</li>
                                <li>Verify API endpoints are correct</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
