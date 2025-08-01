import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FullScreenLoader } from "@/components/loader/full-screen-loader.tsx";
import { toast } from 'sonner';
import { getSignInLink, getDashboardLink } from '@/app/router/router-link';
import { setToken, setRefreshToken } from '../utils/tokenUtils';

const GooglePopupCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const processCallback = () => {
            // Try to get tokens from URL parameters first
            let token = searchParams.get('token');
            let refreshToken = searchParams.get('refreshToken');
            const error = searchParams.get('error');

            // If no tokens in URL params, try to extract from hash or other sources
            if (!token || !refreshToken) {
                const hash = window.location.hash;
                const urlParams = new URLSearchParams(hash.substring(1));
                token = token || urlParams.get('token') || urlParams.get('access_token');
                refreshToken = refreshToken || urlParams.get('refreshToken') || urlParams.get('refresh_token');
            }

            console.log('🔄 Google Callback - Processing...', {
                hasToken: !!token,
                hasRefreshToken: !!refreshToken,
                error,
                url: window.location.href
            });

            // Check if this is running in a popup
            const isPopup = window.opener && window.opener !== window;

            if (isPopup) {
                console.log('🔄 Running in popup - sending data to parent window');

                if (error) {
                    // Send error to parent window
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        error: error
                    }, window.location.origin);

                    // Small delay to ensure message is sent
                    setTimeout(() => {
                        window.close();
                    }, 100);
                    return;
                }

                if (token && refreshToken) {
                    // Send tokens to parent window
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_SUCCESS',
                        accessToken: token,
                        refreshToken: refreshToken
                    }, window.location.origin);

                    // Small delay to ensure message is sent
                    setTimeout(() => {
                        window.close();
                    }, 100);
                    return;
                }

                // No valid data
                window.opener.postMessage({
                    type: 'GOOGLE_AUTH_ERROR',
                    error: 'No authentication data received'
                }, window.location.origin);

                setTimeout(() => {
                    window.close();
                }, 100);
                return;
            }

            // This is in main window (fallback for direct navigation)
            console.log(' Running in main window - processing directly');

            if (error) {
                console.error('Authentication error:', error);
                toast.error(`Authentication failed: ${error}`);
                navigate(getSignInLink(), { replace: true });
                return;
            }

            if (token && refreshToken) {
                console.log('✅ Tokens received in main window');

                // Store tokens using standardized keys
                setToken(token);
                setRefreshToken(refreshToken);

                toast.success('Authentication successful!');
                navigate(getDashboardLink(), { replace: true });
                return;
            }

            // No valid data
            console.error('No authentication data received');
            toast.error('No authentication data received');
            navigate(getSignInLink(), { replace: true });
        };

        // Small delay to ensure URL is fully loaded and DOM is ready
        const timer = setTimeout(processCallback, 500);

        return () => clearTimeout(timer);
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <FullScreenLoader
                    message="Processing authentication..."
                    size="lg"
                    variant="primary"
                />
                <p className="mt-4 text-sm text-muted-foreground">
                    Please wait while we complete your authentication...
                </p>
            </div>
        </div>
    );
};

export default GooglePopupCallbackPage;