import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Zap, MessageSquare, FileText, Search, Lightbulb } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
    const features = [
        {
            icon: MessageSquare,
            title: 'Intelligent Chat',
            description: 'Have natural conversations with your AI assistant about your knowledge base.',
        },
        {
            icon: Search,
            title: 'Smart Search',
            description: 'Find information across all your notes, databases, and documents instantly.',
        },
        {
            icon: FileText,
            title: 'Content Generation',
            description: 'Generate summaries, outlines, and new content based on your existing knowledge.',
        },
        {
            icon: Lightbulb,
            title: 'Insight Discovery',
            description: 'Discover hidden connections and patterns in your personal knowledge graph.',
        },
        {
            icon: Zap,
            title: 'Quick Actions',
            description: 'Perform complex tasks with simple natural language commands.',
        },
        {
            icon: Brain,
            title: 'Learning Assistant',
            description: 'Get personalized learning recommendations and knowledge reinforcement.',
        },
    ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full">
                        <Brain className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-3">
                        <h1 className="text-4xl font-bold">AI Assistant</h1>
                        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                            Coming Soon
                        </Badge>
                    </div>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your intelligent companion for managing and exploring your second brain
                    </p>
                </div>
            </div>

            {/* Main Card */}
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        Powerful AI Features Coming Soon
                    </CardTitle>
                    <CardDescription>
                        We're building an advanced AI assistant that will revolutionize how you interact with your knowledge base.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex gap-4 p-4 rounded-lg border bg-card/50">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-primary/10 rounded-md">
                                        <feature.icon className="h-5 w-5 text-primary" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* CTA Section */}
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                        <h2 className="text-2xl font-bold">Get Early Access</h2>
                        <p className="text-muted-foreground">
                            Be among the first to experience the future of personal knowledge management.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                <Sparkles className="h-4 w-4 mr-2" />
                                Join Waitlist
                            </Button>
                            <Button variant="outline">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Development Roadmap</CardTitle>
                    <CardDescription>
                        Here's what we're working on to bring you the best AI assistant experience.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-700 dark:text-green-400">Phase 1: Foundation</h3>
                                <p className="text-sm text-muted-foreground">Core AI infrastructure and knowledge indexing</p>
                                <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                    Completed
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-blue-700 dark:text-blue-400">Phase 2: Smart Search</h3>
                                <p className="text-sm text-muted-foreground">Semantic search and content understanding</p>
                                <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                    In Progress
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-orange-700 dark:text-orange-400">Phase 3: Conversational AI</h3>
                                <p className="text-sm text-muted-foreground">Natural language chat interface</p>
                                <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                                    Coming Soon
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-400">Phase 4: Advanced Features</h3>
                                <p className="text-sm text-muted-foreground">Content generation and insight discovery</p>
                                <Badge variant="secondary" className="mt-1">
                                    Planned
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AIAssistantPage;