import {
    LinkedInCallbackHandlerPage,
    SocialAccountsPage
} from '@/app/router/lazy-components/index.tsx'
import type {RouteObject} from "react-router-dom";

export const linkedinRoutes: RouteObject[] = [
    {
        path: "dashboard",
        element: <SocialAccountsPage />,
    },
    {
        path: "linkedin/callback",
        element: <LinkedInCallbackHandlerPage />,
    }
]