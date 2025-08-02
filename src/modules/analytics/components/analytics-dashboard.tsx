import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    TrendingUp,
    TrendingDown,
    Database,
    Users,
    Eye,
    Activity,
    Clock,
    Zap,
    Calendar,
    BarChart3,
} from 'lucide-react';
import { analyticsApi, type DashboardAnalytics } from '../services/analyticsApi';
import { toast } from 'sonner';

interface AnalyticsDashboardProps {
    className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

    useEffect(() => {
        loadAnalytics();
    }, [timeRange]);

    const loadAnalytics = async () => {
        try {
            setIsLoading(true);
            const data = await analyticsApi.getDashboardAnalytics({
                timeRange,
                includeActivity: true,
                includeGrowth: true,
            });
            setAnalytics(data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            toast.error('Failed to load analytics data');
        } finally {
            setIsLoading(false);
        }
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const formatPercentage = (current: number, previous: number) => {
        if (previous === 0) return '+100%';
        const percentage = ((current - previous) / previous) * 100;
        return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
    };

    const getGrowthIcon = (current: number, previous: number) => {
        return current >= previous ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <div className="h-10 w-32 bg-muted animate-pulse rounded" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <div className="space-y-2">
                                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                                    <div className="h-8 bg-muted animate-pulse rounded w-16" />
                                    <div className="h-3 bg-muted animate-pulse rounded w-20" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                <p className="text-muted-foreground">Analytics data is not available at the moment.</p>
                <Button onClick={loadAnalytics} className="mt-4">
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                    <p className="text-muted-foreground">
                        Insights and metrics for your databases and activity
                    </p>
                </div>
                <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                        <SelectItem value="1y">Last year</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Databases</p>
                                <p className="text-2xl font-bold">{formatNumber(analytics.totalDatabases)}</p>
                                <div className="flex items-center gap-1 text-sm">
                                    {getGrowthIcon(
                                        analytics.growthMetrics.databasesGrowth.current,
                                        analytics.growthMetrics.databasesGrowth.previous
                                    )}
                                    <span className={
                                        analytics.growthMetrics.databasesGrowth.percentage >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }>
                                        {analytics.growthMetrics.databasesGrowth.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <Database className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                                <p className="text-2xl font-bold">{formatNumber(analytics.totalRecords)}</p>
                                <div className="flex items-center gap-1 text-sm">
                                    {getGrowthIcon(
                                        analytics.growthMetrics.recordsGrowth.current,
                                        analytics.growthMetrics.recordsGrowth.previous
                                    )}
                                    <span className={
                                        analytics.growthMetrics.recordsGrowth.percentage >= 0
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    }>
                                        {analytics.growthMetrics.recordsGrowth.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <Activity className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                                <p className="text-2xl font-bold">{formatNumber(analytics.totalViews)}</p>
                                <div className="flex items-center gap-1 text-sm">
                                    <Eye className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Views created</span>
                                </div>
                            </div>
                            <Eye className="h-8 w-8 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                                <p className="text-2xl font-bold">{formatNumber(analytics.usageStats.dailyActiveUsers)}</p>
                                <div className="flex items-center gap-1 text-sm">
                                    <Users className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-muted-foreground">Daily active</span>
                                </div>
                            </div>
                            <Users className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Popular Databases */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Databases</CardTitle>
                    <CardDescription>Most accessed databases in the selected time period</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.popularDatabases.slice(0, 5).map((db, index) => (
                            <div key={db.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                                        {db.icon || '#'}
                                    </div>
                                    <div>
                                        <p className="font-medium">{db.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {db.recordCount} records • {db.viewCount} views
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{db.accessCount} views</p>
                                    <p className="text-sm text-muted-foreground">
                                        Last accessed {new Date(db.lastAccessed).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions across your databases</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analytics.recentActivity.slice(0, 10).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Activity className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{activity.description}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span>{activity.userName}</span>
                                        <span>•</span>
                                        <span>{new Date(activity.timestamp).toLocaleString()}</span>
                                        {activity.databaseName && (
                                            <>
                                                <span>•</span>
                                                <span>{activity.databaseName}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <Badge variant="outline">
                                    {activity.type.replace('_', ' ')}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
