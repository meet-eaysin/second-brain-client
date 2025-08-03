import React from 'react';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { NotificationsPanel } from '../components/NotificationsPanel';

export default function NotificationsPage() {
    return (
        <>
            <EnhancedHeader />

            <Main className="space-y-8">
                {/* Clean Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
                    <p className="text-muted-foreground">
                        View and manage your notifications
                    </p>
                </div>

                <NotificationsPanel />
            </Main>
        </>
    );
}
