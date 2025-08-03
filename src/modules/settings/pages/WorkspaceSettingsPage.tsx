import React from 'react';
import { Link } from 'react-router-dom';
import { Main } from '@/layout/main';
import { EnhancedHeader } from '@/components/enhanced-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Building2 } from 'lucide-react';
import { WorkspaceSettings } from '../components/WorkspaceSettings';

export const WorkspaceSettingsPage: React.FC = () => {
    return (
        <>
            <EnhancedHeader 
                contextActions={
                    <>
                        <Button size="sm" variant="outline" className="h-8 gap-2" asChild>
                            <Link to="/app/settings">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Settings
                            </Link>
                        </Button>
                        <Button size="sm" className="h-8 gap-2">
                            <Building2 className="h-4 w-4" />
                            Invite Members
                        </Button>
                    </>
                }
            />
            
            <Main className="space-y-8">
                {/* Page Description */}
                <div className="space-y-2">
                    <p className="text-muted-foreground">
                        Configure workspace settings and permissions
                    </p>
                </div>

                <WorkspaceSettings />
            </Main>
        </>
    );
};

export default WorkspaceSettingsPage;
