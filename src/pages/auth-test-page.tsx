import React from 'react';
import { AuthDemo } from '@/modules/auth/components/auth-demo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Test page for demonstrating the complete authentication system
 * This page showcases all implemented features and provides testing interface
 */
const AuthTestPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Authentication System Test
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Complete client-side Google OAuth implementation with JWT token management, 
                        role-based access control, and comprehensive error handling.
                    </p>
                </div>

                {/* Features Overview */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Implemented Features
                        </CardTitle>
                        <CardDescription>
                            All features from the authentication implementation guide
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Google OAuth Flow</h4>
                                    <p className="text-sm text-gray-600">Complete redirect-based authentication</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">JWT Token Management</h4>
                                    <p className="text-sm text-gray-600">Auto-refresh with 15min/7day expiry</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Protected Routes</h4>
                                    <p className="text-sm text-gray-600">Role-based access control</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">State Management</h4>
                                    <p className="text-sm text-gray-600">Zustand with persistence</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">Error Handling</h4>
                                    <p className="text-sm text-gray-600">Comprehensive error scenarios</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium">User Experience</h4>
                                    <p className="text-sm text-gray-600">Loading states & smooth transitions</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Implementation Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">OAuth Flow</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Step 1</Badge>
                                <span className="text-sm">Redirect to /api/v1/auth/google</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Step 2</Badge>
                                <span className="text-sm">Server redirects to Google</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Step 3</Badge>
                                <span className="text-sm">Google redirects back with code</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Step 4</Badge>
                                <span className="text-sm">Server exchanges for tokens</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">Step 5</Badge>
                                <span className="text-sm">Frontend receives & stores tokens</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Token Strategy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="default" className="text-xs">Access Token</Badge>
                                    <span className="text-xs text-gray-500">15 minutes</span>
                                </div>
                                <p className="text-sm text-gray-600">Bearer token for API requests</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs">Refresh Token</Badge>
                                    <span className="text-xs text-gray-500">7 days</span>
                                </div>
                                <p className="text-sm text-gray-600">Get new access tokens</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className="text-xs">Auto-Refresh</Badge>
                                </div>
                                <p className="text-sm text-gray-600">Axios interceptor handles 401s</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Security Features</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">CSRF Protection</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Role-based Access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Secure Token Storage</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Automatic Cleanup</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-sm">Error Recovery</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Usage Instructions */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="h-5 w-5" />
                            Testing Instructions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Before Testing</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Ensure your backend server is running on the configured URL</li>
                                    <li>• Verify Google OAuth is properly configured on the server</li>
                                    <li>• Check that all API endpoints are accessible</li>
                                </ul>
                            </div>
                            
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h4 className="font-medium text-green-900 mb-2">Test Scenarios</h4>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Click "Sign in with Google" to test OAuth flow</li>
                                    <li>• Test logout and logout all devices</li>
                                    <li>• Try accessing protected routes</li>
                                    <li>• Test token refresh by waiting 15 minutes</li>
                                    <li>• Test error scenarios (disconnect network, etc.)</li>
                                </ul>
                            </div>
                            
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <h4 className="font-medium text-yellow-900 mb-2">Expected Behavior</h4>
                                <ul className="text-sm text-yellow-800 space-y-1">
                                    <li>• Smooth redirect to Google and back</li>
                                    <li>• Automatic token refresh on API calls</li>
                                    <li>• Proper error messages for failed operations</li>
                                    <li>• Intended path redirect after login</li>
                                    <li>• Clean logout with token cleanup</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-8" />

                {/* Interactive Demo */}
                <AuthDemo />
            </div>
        </div>
    );
};

export default AuthTestPage;
