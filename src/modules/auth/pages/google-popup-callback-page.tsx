import React, { useEffect } from 'react';
import { FullScreenLoader } from "@/components/loader/full-screen-loader.tsx";

const GooglePopupCallbackPage: React.FC = () => {
    useEffect(() => {
        // This page might not even be reached if backend handles everything
        // But we'll keep it as a fallback
        
        const isPopup = window.opener && window.opener !== window;
        
        if (!isPopup) {
            console.warn('GooglePopupCallbackPage: Not in popup mode, redirecting...');
            window.location.href = '/auth/sign-in';
            return;
        }

        // If we reach here, something might be wrong with backend popup handling
        console.log('🔄 GooglePopupCallbackPage: Fallback handling...');
        
        // Try to extract any URL parameters as fallback
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        
        if (error) {
            window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                error: error
            }, window.location.origin);
            window.close();
            return;
        }

        // If no error but we're here, something unexpected happened
        setTimeout(() => {
            window.opener.postMessage({
                type: 'GOOGLE_AUTH_ERROR',
                error: 'Unexpected callback state'
            }, window.location.origin);
            window.close();
        }, 2000);

    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <FullScreenLoader
                    message="Processing authentication..."
                    size="lg"
                    variant="primary"
                />
                <p className="mt-4 text-sm text-muted-foreground">
                    This window will close automatically...
                </p>
            </div>
        </div>
    );
};

export default GooglePopupCallbackPage;