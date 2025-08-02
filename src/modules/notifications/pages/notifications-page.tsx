import React from 'react';
import { NotificationsPanel } from '../components/NotificationsPanel';
import { ContentLayout } from '@/layout/content-layout';

export default function NotificationsPage() {
    return (
        <ContentLayout title="Notifications">
            <NotificationsPanel />
        </ContentLayout>
    );
}
