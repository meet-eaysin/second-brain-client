import { useParams } from 'react-router-dom';
import { DynamicDatabaseDetail } from './dynamic-database-view';

export default function DataTablePage() {
    const { databaseId } = useParams<{ databaseId: string }>();

    if (!databaseId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Database ID not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6">
            <DynamicDatabaseDetail databaseId={databaseId} />
        </div>
    );
}
