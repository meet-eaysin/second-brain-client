import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
    CheckSquare, Target, 
    Star, AlertCircle, Lightbulb, ArrowRight,
    BarChart3, BookOpen, Plus, X
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';

interface WeeklyReviewProps {
    onComplete?: () => void;
}

export function WeeklyReview({ onComplete }: WeeklyReviewProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [reviewData, setReviewData] = useState({
        accomplishments: [] as string[],
        challenges: [] as string[],
        insights: [] as string[],
        nextWeekGoals: [] as string[],
        reflection: '',
        moodReflection: '',
        energyLevel: 5,
        satisfactionLevel: 5
    });

    const queryClient = useQueryClient();

    // Get week's data
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const { data: weeklyStats } = useQuery({
        queryKey: ['second-brain', 'weekly-stats', weekStart.toISOString()],
        queryFn: async () => {
            const [tasks, projects, habits, mood, journal] = await Promise.all([
                secondBrainApi.tasks.getAll({ 
                    startDate: weekStart.toISOString(),
                    endDate: weekEnd.toISOString()
                }),
                secondBrainApi.projects.getAll(),
                secondBrainApi.habits.getAll(),
                secondBrainApi.mood.getAll({
                    startDate: weekStart.toISOString(),
                    endDate: weekEnd.toISOString()
                }),
                secondBrainApi.journal.getAll({
                    startDate: weekStart.toISOString(),
                    endDate: weekEnd.toISOString()
                })
            ]);

            return { tasks, projects, habits, mood, journal };
        }
    });

    const createJournalMutation = useMutation({
        mutationFn: secondBrainApi.journal.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain'] });
            toast.success('Weekly review saved successfully');
            onComplete?.();
        },
    });

    const steps = [
        { title: 'Review Accomplishments', icon: Star },
        { title: 'Identify Challenges', icon: AlertCircle },
        { title: 'Capture Insights', icon: Lightbulb },
        { title: 'Plan Next Week', icon: Target },
        { title: 'Overall Reflection', icon: BookOpen }
    ];

    const addItem = (field: keyof typeof reviewData, value: string) => {
        if (!value.trim()) return;
        setReviewData(prev => ({
            ...prev,
            [field]: [...(prev[field] as string[]), value.trim()]
        }));
    };

    const removeItem = (field: keyof typeof reviewData, index: number) => {
        setReviewData(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
    };

    const handleComplete = () => {
        const journalEntry = {
            type: 'weekly',
            title: `Weekly Review - Week of ${weekStart.toLocaleDateString()}`,
            content: reviewData.reflection,
            date: new Date(),
            weeklyReflection: {
                accomplishments: reviewData.accomplishments,
                challenges: reviewData.challenges,
                insights: reviewData.insights,
                nextWeekGoals: reviewData.nextWeekGoals
            },
            mood: {
                value: reviewData.satisfactionLevel,
                notes: reviewData.moodReflection
            },
            energy: {
                value: reviewData.energyLevel
            }
        };

        createJournalMutation.mutate(journalEntry);
    };

    const weeklyData = weeklyStats;
    const completedTasks = weeklyData?.tasks?.filter((t: any) => t.status === 'completed') || [];
    const totalTasks = weeklyData?.tasks?.length || 0;
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    const activeProjects = weeklyData?.projects?.filter((p: any) => p.status === 'active') || [];
    const moodEntries = weeklyData?.mood?.data?.moods || [];
    const avgMood = moodEntries.length > 0 
        ? moodEntries.reduce((sum: number, m: any) => sum + m.mood.value, 0) / moodEntries.length 
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">Weekly Review</h2>
                <p className="text-muted-foreground">
                    Week of {weekStart.toLocaleDateString()} - {weekEnd.toLocaleDateString()}
                </p>
                <div className="flex justify-center">
                    <Progress value={(currentStep / (steps.length - 1)) * 100} className="w-64" />
                </div>
            </div>

            {/* Steps Navigation */}
            <div className="flex justify-center">
                <div className="flex space-x-2">
                    {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        return (
                            <Button
                                key={index}
                                variant={index === currentStep ? 'default' : index < currentStep ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentStep(index)}
                                className="gap-2"
                            >
                                <StepIcon className="h-4 w-4" />
                                {step.title}
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Week Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        This Week's Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
                            <div className="text-sm text-muted-foreground">Tasks Completed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{activeProjects.length}</div>
                            <div className="text-sm text-muted-foreground">Active Projects</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{Math.round(completionRate)}%</div>
                            <div className="text-sm text-muted-foreground">Completion Rate</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">{avgMood.toFixed(1)}</div>
                            <div className="text-sm text-muted-foreground">Avg Mood</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Step Content */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                        {steps[currentStep].title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentStep === 0 && (
                        <AccomplishmentsStep
                            accomplishments={reviewData.accomplishments}
                            completedTasks={completedTasks}
                            onAdd={(value: string) => addItem('accomplishments', value)}
                            onRemove={(index: number) => removeItem('accomplishments', index)}
                        />
                    )}

                    {currentStep === 1 && (
                        <ChallengesStep
                            challenges={reviewData.challenges}
                            onAdd={(value: string) => addItem('challenges', value)}
                            onRemove={(index: number) => removeItem('challenges', index)}
                        />
                    )}

                    {currentStep === 2 && (
                        <InsightsStep
                            insights={reviewData.insights}
                            onAdd={(value: string) => addItem('insights', value)}
                            onRemove={(index: number) => removeItem('insights', index)}
                        />
                    )}

                    {currentStep === 3 && (
                        <NextWeekStep
                            goals={reviewData.nextWeekGoals}
                            onAdd={(value: string) => addItem('nextWeekGoals', value)}
                            onRemove={(index: number) => removeItem('nextWeekGoals', index)}
                        />
                    )}

                    {currentStep === 4 && (
                        <ReflectionStep
                            reflection={reviewData.reflection}
                            moodReflection={reviewData.moodReflection}
                            energyLevel={reviewData.energyLevel}
                            satisfactionLevel={reviewData.satisfactionLevel}
                            onChange={(field: string, value: any) => setReviewData(prev => ({ ...prev, [field]: value }))}
                        />
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                >
                    Previous
                </Button>
                
                {currentStep === steps.length - 1 ? (
                    <Button
                        onClick={handleComplete}
                        disabled={createJournalMutation.isPending}
                        className="gap-2"
                    >
                        {createJournalMutation.isPending ? 'Saving...' : 'Complete Review'}
                        <CheckSquare className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                        className="gap-2"
                    >
                        Next
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}

// Step Components
function AccomplishmentsStep({ accomplishments, completedTasks, onAdd, onRemove }: any) {
    const [newItem, setNewItem] = useState('');

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                What did you accomplish this week? Include completed tasks, projects, and personal wins.
            </p>
            
            {/* Completed Tasks Suggestions */}
            {completedTasks.length > 0 && (
                <div className="space-y-2">
                    <Label>Completed Tasks (click to add)</Label>
                    <div className="space-y-1">
                        {completedTasks.slice(0, 5).map((task: any) => (
                            <Button
                                key={task._id}
                                variant="outline"
                                size="sm"
                                onClick={() => onAdd(task.title)}
                                className="justify-start h-auto p-2 text-left"
                            >
                                <CheckSquare className="h-3 w-3 mr-2 text-green-500" />
                                {task.title}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            <ListEditor
                items={accomplishments}
                newItem={newItem}
                setNewItem={setNewItem}
                onAdd={onAdd}
                onRemove={onRemove}
                placeholder="Add an accomplishment..."
                icon={Star}
            />
        </div>
    );
}

function ChallengesStep({ challenges, onAdd, onRemove }: any) {
    const [newItem, setNewItem] = useState('');

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                What challenges did you face? What obstacles slowed you down or caused stress?
            </p>
            <ListEditor
                items={challenges}
                newItem={newItem}
                setNewItem={setNewItem}
                onAdd={onAdd}
                onRemove={onRemove}
                placeholder="Add a challenge..."
                icon={AlertCircle}
            />
        </div>
    );
}

function InsightsStep({ insights, onAdd, onRemove }: any) {
    const [newItem, setNewItem] = useState('');

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                What did you learn? What insights or realizations did you have?
            </p>
            <ListEditor
                items={insights}
                newItem={newItem}
                setNewItem={setNewItem}
                onAdd={onAdd}
                onRemove={onRemove}
                placeholder="Add an insight..."
                icon={Lightbulb}
            />
        </div>
    );
}

function NextWeekStep({ goals, onAdd, onRemove }: any) {
    const [newItem, setNewItem] = useState('');

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                What are your top priorities for next week? What do you want to focus on?
            </p>
            <ListEditor
                items={goals}
                newItem={newItem}
                setNewItem={setNewItem}
                onAdd={onAdd}
                onRemove={onRemove}
                placeholder="Add a goal for next week..."
                icon={Target}
            />
        </div>
    );
}

function ReflectionStep({ reflection, moodReflection, energyLevel, satisfactionLevel, onChange }: any) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label>Overall Reflection</Label>
                <Textarea
                    placeholder="How do you feel about this week overall? What patterns do you notice?"
                    value={reflection}
                    onChange={(e) => onChange('reflection', e.target.value)}
                    rows={4}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <Label>Energy Level (1-10)</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={energyLevel}
                                onChange={(e) => onChange('energyLevel', Number(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-sm font-medium w-8">{energyLevel}</span>
                        </div>
                    </div>

                    <div>
                        <Label>Satisfaction Level (1-10)</Label>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="range"
                                min="1"
                                max="10"
                                value={satisfactionLevel}
                                onChange={(e) => onChange('satisfactionLevel', Number(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-sm font-medium w-8">{satisfactionLevel}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Mood Notes</Label>
                    <Textarea
                        placeholder="How did you feel emotionally this week?"
                        value={moodReflection}
                        onChange={(e) => onChange('moodReflection', e.target.value)}
                        rows={4}
                    />
                </div>
            </div>
        </div>
    );
}

function ListEditor({ items, newItem, setNewItem, onAdd, onRemove, placeholder, icon: Icon }: any) {
    const handleAdd = () => {
        onAdd(newItem);
        setNewItem('');
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <Input
                    placeholder={placeholder}
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                />
                <Button onClick={handleAdd} disabled={!newItem.trim()}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            
            <div className="space-y-2">
                {items.map((item: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{item}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
