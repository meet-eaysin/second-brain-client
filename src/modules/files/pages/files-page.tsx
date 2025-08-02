import React from 'react';
import { FilesManager } from '../components/FilesManager';
import { ContentLayout } from '@/layout/content-layout';

export default function FilesPage() {
    return (
        <ContentLayout title="Files">
            <FilesManager />
        </ContentLayout>
    );
}
