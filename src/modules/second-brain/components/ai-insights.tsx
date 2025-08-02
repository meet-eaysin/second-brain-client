import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Brain, TrendingUp, Lightbulb, Target, 
    BarChart3, Calendar, Clock, AlertTriangle,
    Zap, BookOpen, Users, CheckSquare,
    Sparkles, ArrowRight, RefreshCw
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';

export function AIInsights() {
    const [isGenerating, setIsGenerating] = useState(false);

    // Fetch comprehensive data for AI analysis
    const { data: analyticsData, isLoading } = useQuery({
        queryKey: ['second-brain', 'ai-analytics'],
        queryFn: async () => {
            const [
                tasks, projects, goals, habits, 
                journal, mood, notes, people
            ] = await Promise.all([
                secondBrainApi.tasks.getAll(),
                secondBrainApi.projects.getAll(),
                secondBrainApi.goals.getInsights(),
                secondBrainApi.habits.getInsights(),
                secondBrainApi.journal.getInsights(),
                secondBrainApi.mood.getAnalytics(),
                secondBrainApi.notes.getAll(),
                secondBrainApi.people.getInsights()
            ]);

            return { tasks, projects, goals, habits, journal, mood, notes, people };
        }
    });

    const generateInsights = async () => {
        setIsGenerating(true);
        // In a real implementation, this would call an AI service
        setTimeout(() => {
            setIsGenerating(false);
        }, 3000);
    };

    const data = analyticsData?.data || {};

    // Generate AI-ready insights
    const insights = {
        productivity: {
            score: 78,
            trend: 'improving',
            insights: [
                'Your task completion rate has improved 15% this month',
                'You work most efficiently on Tuesday and Wednesday mornings',
                'Projects with clear deadlines have 40% higher completion rates'
            ]
        },
        patterns: {
            workHabits: [
                'Peak productivity hours: 9-11 AM and 2-4 PM',
                'Most creative work happens on Mondays',
                'Friday afternoons are best for planning and review'
            ],
            moodCorrelations: [
                'Higher mood scores correlate with completed morning routines',
                'Stress levels decrease after journaling sessions',
                'Social interactions boost energy levels by 20%'
            ]
        },
        recommendations: [
            {
                type: 'habit',
                title: 'Add Morning Planning Session',
                description: 'Based on your patterns, 10 minutes of morning planning could increase daily completion by 25%',
                priority: 'high',
                impact: 'high'
            },
            {
                type: 'workflow',
                title: 'Batch Similar Tasks',
                description: 'Grouping similar tasks could reduce context switching and improve focus',
                priority: 'medium',
                impact: 'medium'
            },
            {
                type: 'review',
                title: 'Weekly Goal Alignment',
                description: 'Your projects show 30% better progress when aligned with specific goals',
                priority: 'high',
                impact: 'high'
            }
        ],
        predictions: {
            goalCompletion: [
                { goal: 'Learn Spanish', probability: 85, timeframe: '3 months' },
                { goal: 'Complete Course', probability: 92, timeframe: '6 weeks' },
                { goal: 'Fitness Goal', probability: 67, timeframe: '2 months' }
            ],
            riskFactors: [
                'Project X deadline may be at risk due to dependency on external team',
                'Habit streak for meditation may break without weekend reminders',
                'Goal Y progress has stalled - consider breaking into smaller milestones'
            ]
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Brain className="h-6 w-6 text-purple-500" />
                        AI Insights
                    </h2>
                    <p className="text-muted-foreground">
                        Intelligent analysis of your productivity patterns and recommendations
                    </p>
                </div>
                <Button 
                    onClick={generateInsights} 
                    disabled={isGenerating}
                    className="gap-2"
                >
                    {isGenerating ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                    {isGenerating ? 'Analyzing...' : 'Generate Insights'}
                </Button>
            </div>

            {/* Productivity Score */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-green-500" />
                        Productivity Score
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600">{insights.productivity.score}</div>
                            <div className="text-sm text-muted-foreground">Overall Score</div>
                        </div>
                        <div className="flex-1">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Productivity Level</span>
                                    <span className="capitalize text-green-600">{insights.productivity.trend}</span>
                                </div>
                                <Progress value={insights.productivity.score} className="h-3" />
                            </div>
                            <div className="mt-4 space-y-1">
                                {insights.productivity.insights.map((insight, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm">
                                        <Lightbulb className="h-3 w-3 text-yellow-500" />
                                        <span>{insight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="patterns">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="patterns">Patterns</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                    <TabsTrigger value="predictions">Predictions</TabsTrigger>
                    <TabsTrigger value="export">AI Export</TabsTrigger>
                </TabsList>

                <TabsContent value="patterns" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Work Habits */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    Work Patterns
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {insights.patterns.workHabits.map((habit, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />
                                        <span className="text-sm">{habit}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Mood Correlations */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    Mood & Energy
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {insights.patterns.moodCorrelations.map((correlation, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                                        <span className="text-sm">{correlation}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                    <div className="space-y-4">
                        {insights.recommendations.map((rec, index) => (
                            <Card key={index}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded ${
                                            rec.type === 'habit' ? 'bg-green-100 text-green-600' :
                                            rec.type === 'workflow' ? 'bg-blue-100 text-blue-600' :
                                            'bg-purple-100 text-purple-600'
                                        }`}>
                                            {rec.type === 'habit' ? <Zap className="h-4 w-4" /> :
                                             rec.type === 'workflow' ? <BarChart3 className="h-4 w-4" /> :
                                             <Target className="h-4 w-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium">{rec.title}</h3>
                                                <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                                                    {rec.priority} priority
                                                </Badge>
                                                <Badge variant="outline">
                                                    {rec.impact} impact
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                                            <Button size="sm" variant="outline" className="gap-2">
                                                Implement
                                                <ArrowRight className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="predictions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Goal Completion Predictions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Goal Completion Forecast
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {insights.predictions.goalCompletion.map((prediction, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">{prediction.goal}</span>
                                            <Badge variant={prediction.probability >= 80 ? 'default' : 'secondary'}>
                                                {prediction.probability}%
                                            </Badge>
                                        </div>
                                        <Progress value={prediction.probability} className="h-2" />
                                        <div className="text-xs text-muted-foreground">
                                            Expected completion: {prediction.timeframe}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Risk Factors */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Risk Factors
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {insights.predictions.riskFactors.map((risk, index) => (
                                    <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                        <span className="text-sm">{risk}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI-Ready Data Export</CardTitle>
                            <CardDescription>
                                Export your data in formats optimized for AI analysis and external tools
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                                    <Brain className="h-6 w-6" />
                                    <span>Export for ChatGPT</span>
                                    <span className="text-xs text-muted-foreground">Structured prompt with context</span>
                                </Button>
                                <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                                    <BarChart3 className="h-6 w-6" />
                                    <span>Analytics Dataset</span>
                                    <span className="text-xs text-muted-foreground">CSV with metrics and patterns</span>
                                </Button>
                                <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                                    <BookOpen className="h-6 w-6" />
                                    <span>Knowledge Graph</span>
                                    <span className="text-xs text-muted-foreground">JSON with relationships</span>
                                </Button>
                                <Button variant="outline" className="gap-2 h-auto p-4 flex-col">
                                    <Calendar className="h-6 w-6" />
                                    <span>Timeline Export</span>
                                    <span className="text-xs text-muted-foreground">Chronological activity data</span>
                                </Button>
                            </div>

                            {/* Sample AI Prompt */}
                            <div className="space-y-2">
                                <h4 className="font-medium">Sample AI Prompt</h4>
                                <div className="p-4 bg-muted rounded-lg text-sm font-mono">
                                    <div className="text-muted-foreground mb-2">// Generated AI prompt based on your data:</div>
                                    <div>
                                        "Analyze my productivity data: I have {data.tasks?.data?.tasks?.length || 0} tasks, 
                                        {data.projects?.data?.projects?.length || 0} projects, and {data.goals?.totalGoals || 0} goals. 
                                        My average mood is {data.mood?.averageMood || 'N/A'} and I've completed 
                                        {insights.productivity.score}% of my weekly targets. 
                                        What patterns do you see and what should I optimize?"
                                    </div>
                                </div>
                            </div>

                            {/* Export Actions */}
                            <div className="flex gap-2">
                                <Button className="gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Generate AI Prompt
                                </Button>
                                <Button variant="outline" className="gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Export Data
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
