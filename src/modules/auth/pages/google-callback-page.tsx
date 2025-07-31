import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useAuthService } from '../hooks/useAuthService';
import { authApi } from '../services/authApi';
import { getSignInLink } from '@/app/router/router-link';
import { toast } from 'sonner';
import { FullScreenLoader } from "@/components/loader/full-screen-loader.tsx";

const GoogleCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback, error: googleAuthError } = useGoogleAuth();
    const { handleGoogleTokens } = useAuthService();
    const [isProcessing, setIsProcessing] = useState(true);

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
                    navigate(getSignInLink(), { replace: true });
                    return;
                }

                // Method 1: Handle direct tokens from server redirect (preferred method)
                if (accessToken && refreshToken) {
                    console.log('Processing Google OAuth with direct tokens');
                    await handleGoogleTokens(accessToken, refreshToken);
                    return;
                }

                // Method 2: Handle authorization code (fallback method)
                if (code) {
                    console.log('Processing Google OAuth with authorization code');
                    handleGoogleCallback(code);
                    return;
                }

                // No valid parameters found
                console.error('No valid OAuth parameters received');
                toast.error('Invalid Google authentication response.');
                navigate(getSignInLink(), { replace: true });

            } catch (error) {
                console.error('Error processing Google callback:', error);
                toast.error('Failed to process Google authentication.');
                navigate(getSignInLink(), { replace: true });
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
            toast.error('Google authentication failed. Please try again.');
            navigate(getSignInLink(), { replace: true });
        }
    }, [googleAuthError, navigate]);

    if (!isProcessing) {
        return null; // Component will unmount after navigation
    }

    return (
        <FullScreenLoader
            message="Completing Google authentication..."
            size="lg"
            variant="primary"
        />
    );
};

export default GoogleCallbackPage;
