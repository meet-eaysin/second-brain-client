import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Info, Server } from 'lucide-react';

interface DevelopmentNoticeProps {
    show?: boolean;
    message?: string;
}

export function DevelopmentNotice({ 
    show = true, 
    message = "Using demo data - backend server not connected" 
}: DevelopmentNoticeProps) {
    if (!show || import.meta.env.PROD) {
        return null;
    }

    return (
        <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-amber-700 border-amber-300 dark:text-amber-300 dark:border-amber-700">
                        <Server className="h-3 w-3 mr-1" />
                        Development Mode
                    </Badge>
                    <span className="text-amber-800 dark:text-amber-200">{message}</span>
                </div>
                <div className="text-xs text-amber-600 dark:text-amber-400">
                    Backend: <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">
                        {import.meta.env.VITE_API_BASE_URL}
                    </code>
                </div>
            </AlertDescription>
        </Alert>
    );
}
