import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { Header } from '@/layout/header';
import { Main } from '@/layout/main';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { DatabaseDataTable } from '../components/database-data-table';
import { DatabaseDialogs } from '../components/database-dialogs';
import { DatabasePrimaryButtons } from '../components/database-primary-buttons';
import { generateDatabaseColumns } from '../components/database-columns';
import { useDatabase } from '../context/database-context';
import { useDatabase as useDatabaseQuery, useRecords } from '../services/databaseQueries';
import type { DatabaseRecord } from '@/types/database.types';

export default function DatabaseDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        setCurrentDatabase,
        setCurrentRecord,
        setOpen,
        searchQuery,
        filters,
        sorts,
        setVisibleProperties,
    } = useDatabase();

    // Fetch database data
    const { data: database, isLoading: isDatabaseLoading } = useDatabaseQuery(id!);
    const { data: recordsData } = useRecords(id!, {
        search: searchQuery,
        filters: JSON.stringify(filters),
        sorts: JSON.stringify(sorts),
    });

    // Set current database when data loads
    useEffect(() => {
        if (database) {
            setCurrentDatabase(database);
            // Initialize visible properties
            const initialVisibility = database.properties.reduce(
                (acc, prop) => ({ ...acc, [prop.id]: true }),
                {}
            );
            setVisibleProperties(initialVisibility);
        }
    }, [database, setCurrentDatabase, setVisibleProperties]);

    // Generate columns based on database properties
    const columns = useMemo(() => {
        if (!database) return [];
        
        return generateDatabaseColumns(
            database.properties,
            (record: DatabaseRecord) => {
                setCurrentRecord(record);
                setOpen('edit-record');
            },
            (recordId: string) => {
                // Handle delete record
                console.log('Delete record:', recordId);
            }
        );
    }, [database, setCurrentRecord, setOpen]);

    const handleBack = () => {
        navigate('/app/databases');
    };

    const handleRecordSelect = (record: DatabaseRecord) => {
        setCurrentRecord(record);
        setOpen('edit-record');
    };

    if (isDatabaseLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!database) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Database not found</h1>
                <Button onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Databases
                </Button>
            </div>
        );
    }

    return (
        <>
            <Header fixed>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">{database.icon}</div>
                        <div>
                            <h1 className="text-xl font-semibold">{database.name}</h1>
                            <p className="text-sm text-muted-foreground">{database.description}</p>
                        </div>
                    </div>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                    <Search />
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className="mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Records</h2>
                        <p className="text-muted-foreground">
                            {recordsData?.total || 0} records in this database
                        </p>
                    </div>
                    <DatabasePrimaryButtons />
                </div>

                <div className="-mx-4 flex-1 overflow-auto px-4 py-1">
                    <DatabaseDataTable
                        columns={columns}
                        data={recordsData?.records || []}
                        properties={database.properties}
                        onRecordSelect={handleRecordSelect}
                        onRecordEdit={(record) => {
                            setCurrentRecord(record);
                            setOpen('edit-record');
                        }}
                        onRecordDelete={(recordId) => {
                            console.log('Delete record:', recordId);
                        }}
                    />
                </div>
            </Main>

            <DatabaseDialogs />
        </>
    );
}
