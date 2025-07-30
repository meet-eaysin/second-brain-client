import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { getSignInLink } from '@/app/router/router-link';
import { toast } from 'sonner';
import {FullScreenLoader} from "@/components/loader/full-screen-loader.tsx";

const GoogleCallbackPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback, error } = useGoogleAuth();

    useEffect(() => {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
            console.error('Google OAuth error:', error);
            toast.error('Google authentication failed. Please try again.');
            navigate(getSignInLink(), { replace: true });
            return;
        }

        if (!code) {
            console.error('No authorization code received from Google');
            toast.error('Invalid Google authentication response.');
            navigate(getSignInLink(), { replace: true });
            return;
        }

        // Handle the Google callback
        handleGoogleCallback(code);
    }, [searchParams, handleGoogleCallback, navigate]);

    // Handle errors
    useEffect(() => {
        if (error) {
            console.error('Google authentication error:', error);
            toast.error('Google authentication failed. Please try again.');
            navigate(getSignInLink(), { replace: true });
        }
    }, [error, navigate]);

    return (
        <FullScreenLoader
            message="Completing Google authentication..." 
            size="lg" 
            variant="primary"
        />
    );
};

export default GoogleCallbackPage;
