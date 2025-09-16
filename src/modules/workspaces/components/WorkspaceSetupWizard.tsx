import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, ArrowLeft, Check, Sparkles, Users, Database, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useCreateWorkspace } from '../services/workspaceQueries';
import type { CreateWorkspaceRequest } from '@/types/workspace.types';

const workspaceSetupSchema = z.object({
    name: z.string().min(1, 'Workspace name is required').max(100, 'Name must be less than 100 characters'),
    description: z.string().max(500, 'Description must be less than 500 characters').optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    isPublic: z.boolean(),
    allowMemberInvites: z.boolean(),
});

type WorkspaceSetupFormValues = z.infer<typeof workspaceSetupSchema>;

interface WorkspaceSetupWizardProps {
    open: boolean;
    onComplete: (workspace: any) => void;
    onSkip?: () => void;
}

const WORKSPACE_ICONS = ['🏢', '🚀', '💼', '🎯', '⚡', '🌟', '🔥', '💡', '🎨', '📊', '🛠️', '🎪'];
const WORKSPACE_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const SETUP_STEPS = [
    {
        id: 'welcome',
        title: 'Welcome to Second Brain',
        description: 'Let\'s set up your first workspace to get started',
        icon: Sparkles,
    },
    {
        id: 'workspace',
        title: 'Create Your Workspace',
        description: 'Give your workspace a name and customize it',
        icon: Settings,
    },
    {
        id: 'complete',
        title: 'You\'re All Set!',
        description: 'Your workspace is ready. Start building your second brain',
        icon: Check,
    },
];

export const WorkspaceSetupWizard: React.FC<WorkspaceSetupWizardProps> = ({
    open,
    onComplete,
    onSkip,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const createWorkspaceMutation = useCreateWorkspace();

    const form = useForm<WorkspaceSetupFormValues>({
        resolver: zodResolver(workspaceSetupSchema),
        defaultValues: {
            name: '',
            description: '',
            icon: WORKSPACE_ICONS[0],
            color: WORKSPACE_COLORS[0],
            isPublic: false,
            allowMemberInvites: true,
        },
    });

    const handleNext = () => {
        if (currentStep < SETUP_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (data: WorkspaceSetupFormValues) => {
        try {
            const workspaceData: CreateWorkspaceRequest = {
                name: data.name,
                description: data.description || undefined,
                icon: data.icon,
                color: data.color,
                isPublic: data.isPublic,
                allowMemberInvites: data.allowMemberInvites,
            };

            const workspace = await createWorkspaceMutation.mutateAsync(workspaceData);
            setCurrentStep(SETUP_STEPS.length - 1); // Go to completion step
            
            // Complete after a short delay to show success
            setTimeout(() => {
                onComplete(workspace);
            }, 2000);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    const renderWelcomeStep = () => (
        <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Welcome to Second Brain!</h2>
                <p className="text-muted-foreground">
                    Your personal knowledge management system. Let's create your first workspace to organize your thoughts, ideas, and data.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center space-y-2">
                    <Database className="w-8 h-8 text-blue-500" />
                    <span className="font-medium">Organize Data</span>
                    <span className="text-muted-foreground text-center">Create databases to structure your information</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <Users className="w-8 h-8 text-green-500" />
                    <span className="font-medium">Collaborate</span>
                    <span className="text-muted-foreground text-center">Invite team members to work together</span>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    <Settings className="w-8 h-8 text-purple-500" />
                    <span className="font-medium">Customize</span>
                    <span className="text-muted-foreground text-center">Tailor your workspace to your needs</span>
                </div>
            </div>
        </div>
    );

    const renderWorkspaceStep = () => (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Create Your Workspace</h2>
                <p className="text-muted-foreground">
                    Give your workspace a name and customize its appearance
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Workspace Name *</Label>
                    <Input
                        id="name"
                        placeholder="My Awesome Workspace"
                        {...form.register('name')}
                    />
                    {form.formState.errors.name && (
                        <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                        id="description"
                        placeholder="Describe what this workspace is for..."
                        rows={3}
                        {...form.register('description')}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Choose an Icon</Label>
                    <div className="grid grid-cols-6 gap-2">
                        {WORKSPACE_ICONS.map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                className={`p-3 text-2xl rounded-lg border-2 transition-colors ${
                                    form.watch('icon') === icon
                                        ? 'border-primary bg-primary/10'
                                        : 'border-muted hover:border-primary/50'
                                }`}
                                onClick={() => form.setValue('icon', icon)}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Choose a Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                        {WORKSPACE_COLORS.map((color) => (
                            <button
                                key={color}
                                type="button"
                                className={`w-12 h-12 rounded-lg border-2 transition-all ${
                                    form.watch('color') === color
                                        ? 'border-gray-900 dark:border-gray-100 scale-110'
                                        : 'border-gray-300 dark:border-gray-600 hover:scale-105'
                                }`}
                                style={{ backgroundColor: color }}
                                onClick={() => form.setValue('color', color)}
                            />
                        ))}
                    </div>
                </div>
            </form>
        </div>
    );

    const renderCompleteStep = () => (
        <div className="text-center space-y-6">
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">You're All Set!</h2>
                <p className="text-muted-foreground">
                    Your workspace has been created successfully. You can now start building your second brain!
                </p>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <div className="animate-pulse">
                    <Badge variant="secondary">Redirecting to your workspace...</Badge>
                </div>
            </div>
        </div>
    );

    const currentStepData = SETUP_STEPS[currentStep];

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <currentStepData.icon className="w-5 h-5" />
                        <span>{currentStepData.title}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center space-x-2">
                        {SETUP_STEPS.map((step, index) => (
                            <div
                                key={step.id}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                        ))}
                    </div>

                    {/* Step content */}
                    <div className="min-h-[400px] flex items-center justify-center">
                        {currentStep === 0 && renderWelcomeStep()}
                        {currentStep === 1 && renderWorkspaceStep()}
                        {currentStep === 2 && renderCompleteStep()}
                    </div>

                    {/* Navigation */}
                    {currentStep < SETUP_STEPS.length - 1 && (
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                                {currentStep === 0 && onSkip && (
                                    <Button variant="ghost" onClick={onSkip}>
                                        Skip Setup
                                    </Button>
                                )}
                                {currentStep > 0 && (
                                    <Button variant="outline" onClick={handlePrevious}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Previous
                                    </Button>
                                )}
                            </div>
                            <Button
                                onClick={currentStep === 1 ? form.handleSubmit(handleSubmit) : handleNext}
                                disabled={currentStep === 1 && createWorkspaceMutation.isPending}
                            >
                                {currentStep === 1 ? (
                                    createWorkspaceMutation.isPending ? 'Creating...' : 'Create Workspace'
                                ) : (
                                    <>
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
