import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useAuthService } from '../hooks/useAuthService';
import { authApi } from '../services/authApi';
import { getSignInLink } from '@/app/router/router-link';
import { toast } from 'sonner';
import { FullScreenLoader } from "@/components/loader/full-screen-loader.tsx";
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

const GoogleCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback, error: googleAuthError } = useGoogleAuth();
    const { handleGoogleTokens } = useAuthService();
    const [isProcessing, setIsProcessing] = useState(true);
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

    useEffect(() => {
        const processCallback = async () => {
            try {
                console.log('🔄 Google Callback Page - Processing callback...');
                console.log('📍 Current URL:', window.location.href);
                console.log('🔍 Search Params:', Object.fromEntries(searchParams.entries()));

                // Extract parameters from URL
                const { accessToken, refreshToken, error } = authApi.handleTokensFromUrl(searchParams);
                const code = searchParams.get('code');

                console.log('🎫 Extracted tokens:', {
                    hasAccessToken: !!accessToken,
                    hasRefreshToken: !!refreshToken,
                    hasCode: !!code,
                    error
                });

                // Handle OAuth errors
                if (error) {
                    console.error('Google OAuth error:', error);
                    setStatus('error');

                    let errorMessage = 'Google authentication failed. Please try again.';
                    switch (error) {
                        case 'access_denied':
                            errorMessage = 'Google authentication was cancelled. Please try again.';
                            break;
                        case 'invalid_state':
                            errorMessage = 'Security validation failed. Please try again.';
                            break;
                        case 'oauth_failed':
                            errorMessage = 'Google authentication failed. Please try again.';
                            break;
                        default:
                            errorMessage = `Authentication error: ${error}`;
                    }

                    toast.error(errorMessage);
                    setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
                    return;
                }

                // Method 1: Handle direct tokens from server redirect (preferred method)
                if (accessToken && refreshToken) {
                    console.log('✅ Processing Google OAuth with direct tokens');
                    setStatus('success');
                    await handleGoogleTokens(accessToken, refreshToken);
                    return;
                }

                // Method 2: Handle authorization code (fallback method)
                if (code) {
                    console.log('🔄 Processing Google OAuth with authorization code');
                    handleGoogleCallback(code);
                    return;
                }

                // No valid parameters found
                console.error('❌ No valid OAuth parameters received');
                setStatus('error');
                toast.error('Invalid Google authentication response.');
                setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);

            } catch (error) {
                console.error('❌ Error processing Google callback:', error);
                setStatus('error');
                toast.error('Failed to process Google authentication.');
                setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
            } finally {
                setIsProcessing(false);
            }
        };

        processCallback();
    }, [searchParams, handleGoogleCallback, handleGoogleTokens, navigate]);

    // Handle Google Auth hook errors
    useEffect(() => {
        if (googleAuthError) {
            console.error('Google authentication error:', googleAuthError);
            setStatus('error');
            toast.error('Google authentication failed. Please try again.');
            setTimeout(() => navigate(getSignInLink(), { replace: true }), 3000);
        }
    }, [googleAuthError, navigate]);

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Authentication Successful!</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Redirecting you to the dashboard...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Authentication Failed</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Redirecting you back to sign in...
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <FullScreenLoader
                message="Processing Google authentication..."
                size="lg"
                variant="primary"
            />
        </div>
    );
};

export default GoogleCallbackPage;
