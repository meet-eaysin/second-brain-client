import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {useLinkedInCallbackMutation} from "@/modules/linkedin/services/linkedinQueries.ts";

export const useLinkedInAuthCallback = () => {
    const [searchParams] = useSearchParams();
    const { mutate: handleCallback } = useLinkedInCallbackMutation();

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code) {
            handleCallback({ code, state: state || undefined });
        }
    }, [searchParams, handleCallback]);
};
