import { TagsManager } from '../components/TagsManager';
import { ContentLayout } from '@/layout/content-layout';

export default function TagsPage() {
    return (
        <ContentLayout title="Tags">
            <TagsManager />
        </ContentLayout>
    );
}
