import React, { createContext, useContext, useState, useEffect } from 'react';
import { workspaceApi } from '../services/workspaceApi';
import { WorkspaceSetupWizard } from '../components/WorkspaceSetupWizard';
import type { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest } from '@/types/workspace.types';
import { toast } from 'sonner';

interface WorkspaceContextType {
    workspaces: Workspace[];
    currentWorkspace: Workspace | null;
    isLoading: boolean;
    needsSetup: boolean;
    showSetupWizard: boolean;
    setCurrentWorkspace: (workspace: Workspace | null) => void;
    refreshWorkspaces: () => Promise<void>;
    createWorkspace: (data: CreateWorkspaceRequest) => Promise<Workspace>;
    updateWorkspace: (id: string, data: UpdateWorkspaceRequest) => Promise<Workspace>;
    deleteWorkspace: (id: string) => Promise<void>;
    completeSetup: (workspace: Workspace) => void;
    skipSetup: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
    children: React.ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [showSetupWizard, setShowSetupWizard] = useState(false);

    // Load workspaces on mount
    useEffect(() => {
        loadWorkspaces();
    }, []);

    const loadWorkspaces = async () => {
        try {
            setIsLoading(true);
            const response = await workspaceApi.getWorkspaces();
            const workspacesList = response.workspaces || [];
            setWorkspaces(workspacesList);

            // Check if user needs workspace setup
            if (workspacesList.length === 0) {
                setNeedsSetup(true);
                setShowSetupWizard(true);
            } else {
                setNeedsSetup(false);
                // Set the first workspace as current if none is selected
                if (!currentWorkspace) {
                    setCurrentWorkspace(workspacesList[0]);
                }
            }
        } catch (error) {
            console.error('Failed to load workspaces:', error);
            toast.error('Failed to load workspaces');
        } finally {
            setIsLoading(false);
        }
    };

    const refreshWorkspaces = async () => {
        await loadWorkspaces();
    };

    const createWorkspace = async (data: CreateWorkspaceRequest): Promise<Workspace> => {
        try {
            const newWorkspace = await workspaceApi.createWorkspace(data);
            setWorkspaces(prev => [...prev, newWorkspace]);
            setCurrentWorkspace(newWorkspace);
            setNeedsSetup(false);
            toast.success('Workspace created successfully');
            return newWorkspace;
        } catch (error: any) {
            console.error('Failed to create workspace:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Failed to create workspace';
            toast.error(errorMessage);
            throw error;
        }
    };

    const updateWorkspace = async (id: string, data: UpdateWorkspaceRequest): Promise<Workspace> => {
        try {
            const updatedWorkspace = await workspaceApi.updateWorkspace(id, data);
            setWorkspaces(prev => prev.map(w => w.id === id ? updatedWorkspace : w));
            
            // Update current workspace if it's the one being updated
            if (currentWorkspace?.id === id) {
                setCurrentWorkspace(updatedWorkspace);
            }
            
            toast.success('Workspace updated successfully');
            return updatedWorkspace;
        } catch (error: any) {
            console.error('Failed to update workspace:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Failed to update workspace';
            toast.error(errorMessage);
            throw error;
        }
    };

    const deleteWorkspace = async (id: string): Promise<void> => {
        try {
            await workspaceApi.deleteWorkspace(id);
            setWorkspaces(prev => prev.filter(w => w.id !== id));
            
            // If the deleted workspace was current, switch to another one
            if (currentWorkspace?.id === id) {
                const remainingWorkspaces = workspaces.filter(w => w.id !== id);
                setCurrentWorkspace(remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null);
            }
            
            toast.success('Workspace deleted successfully');
        } catch (error: any) {
            console.error('Failed to delete workspace:', error);
            const errorMessage = error?.response?.data?.error?.message || 'Failed to delete workspace';
            toast.error(errorMessage);
            throw error;
        }
    };

    const completeSetup = (workspace: Workspace) => {
        setCurrentWorkspace(workspace);
        setShowSetupWizard(false);
        setNeedsSetup(false);
    };

    const skipSetup = () => {
        setShowSetupWizard(false);
        setNeedsSetup(false);
    };

    const value: WorkspaceContextType = {
        workspaces,
        currentWorkspace,
        isLoading,
        needsSetup,
        showSetupWizard,
        setCurrentWorkspace,
        refreshWorkspaces,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        completeSetup,
        skipSetup,
    };

    return (
        <WorkspaceContext.Provider value={value}>
            {children}
            <WorkspaceSetupWizard
                open={showSetupWizard}
                onComplete={completeSetup}
                onSkip={skipSetup}
            />
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}

// Hook for getting workspace-specific data
export function useCurrentWorkspace() {
    const { currentWorkspace } = useWorkspace();
    return currentWorkspace;
}

// Hook for workspace operations
export function useWorkspaceOperations() {
    const { createWorkspace, updateWorkspace, deleteWorkspace, refreshWorkspaces } = useWorkspace();
    return { createWorkspace, updateWorkspace, deleteWorkspace, refreshWorkspaces };
}
