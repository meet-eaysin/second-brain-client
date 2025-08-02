import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
    DollarSign, Plus, Search, Filter, TrendingUp,
    TrendingDown, ArrowUpRight, ArrowDownRight,
    CreditCard, PiggyBank, Target, BarChart3,
    Calendar, Edit, Trash2, Eye, AlertTriangle,
    CheckCircle, Clock, Wallet, Building
} from 'lucide-react';
import { secondBrainApi } from '../services/second-brain-api';
import { toast } from 'sonner';

interface Transaction {
    _id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    subcategory?: string;
    account: string;
    date: string;
    tags: string[];
    isRecurring: boolean;
    recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface Budget {
    _id: string;
    category: string;
    budgetAmount: number;
    spentAmount: number;
    period: 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    isActive: boolean;
}

interface FinancialGoal {
    _id: string;
    title: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    category: 'emergency-fund' | 'investment' | 'purchase' | 'debt-payoff' | 'retirement' | 'other';
    priority: 'low' | 'medium' | 'high';
    isActive: boolean;
}

const expenseCategories = [
    'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance',
    'Healthcare', 'Entertainment', 'Shopping', 'Education', 'Travel',
    'Subscriptions', 'Debt Payments', 'Savings', 'Investments', 'Other'
];

const incomeCategories = [
    'Salary', 'Freelance', 'Business', 'Investments', 'Rental',
    'Side Hustle', 'Gifts', 'Refunds', 'Other'
];

export function FinancesPage() {
    const [selectedView, setSelectedView] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
        type: 'expense',
        isRecurring: false,
        tags: []
    });
    const [newBudget, setNewBudget] = useState<Partial<Budget>>({
        period: 'monthly',
        isActive: true
    });
    const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
        category: 'emergency-fund',
        priority: 'medium',
        isActive: true,
        currentAmount: 0
    });

    const queryClient = useQueryClient();

    const { data: financesData, isLoading } = useQuery({
        queryKey: ['second-brain', 'finances'],
        queryFn: () => secondBrainApi.finances?.getAll() || Promise.resolve({ 
            data: { 
                transactions: [], 
                budgets: [], 
                goals: [],
                summary: {
                    totalIncome: 0,
                    totalExpenses: 0,
                    netIncome: 0,
                    savingsRate: 0
                }
            } 
        }),
    });

    const createTransactionMutation = useMutation({
        mutationFn: (data: Partial<Transaction>) => secondBrainApi.finances?.createTransaction(data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'finances'] });
            toast.success('Transaction added successfully');
            setIsTransactionDialogOpen(false);
            setNewTransaction({
                type: 'expense',
                isRecurring: false,
                tags: []
            });
        },
    });

    const createBudgetMutation = useMutation({
        mutationFn: (data: Partial<Budget>) => secondBrainApi.finances?.createBudget(data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'finances'] });
            toast.success('Budget created successfully');
            setIsBudgetDialogOpen(false);
            setNewBudget({
                period: 'monthly',
                isActive: true
            });
        },
    });

    const createGoalMutation = useMutation({
        mutationFn: (data: Partial<FinancialGoal>) => secondBrainApi.finances?.createGoal(data) || Promise.resolve({}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['second-brain', 'finances'] });
            toast.success('Financial goal created successfully');
            setIsGoalDialogOpen(false);
            setNewGoal({
                category: 'emergency-fund',
                priority: 'medium',
                isActive: true,
                currentAmount: 0
            });
        },
    });

    const data = financesData?.data || {};
    const transactions = data.transactions || [];
    const budgets = data.budgets || [];
    const goals = data.goals || [];
    const summary = data.summary || {};

    const filteredTransactions = transactions.filter((transaction: Transaction) => {
        const matchesSearch = searchQuery === '' || 
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const handleCreateTransaction = () => {
        if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
            toast.error('Description, amount, and category are required');
            return;
        }
        createTransactionMutation.mutate(newTransaction);
    };

    const handleCreateBudget = () => {
        if (!newBudget.category || !newBudget.budgetAmount) {
            toast.error('Category and budget amount are required');
            return;
        }
        createBudgetMutation.mutate(newBudget);
    };

    const handleCreateGoal = () => {
        if (!newGoal.title || !newGoal.targetAmount) {
            toast.error('Title and target amount are required');
            return;
        }
        createGoalMutation.mutate(newGoal);
    };

    const getTransactionIcon = (type: string) => {
        return type === 'income' ? ArrowUpRight : ArrowDownRight;
    };

    const getTransactionColor = (type: string) => {
        return type === 'income' ? 'text-green-600' : 'text-red-600';
    };

    const getBudgetStatus = (budget: Budget) => {
        const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
        if (percentage >= 100) return { status: 'over', color: 'text-red-600' };
        if (percentage >= 80) return { status: 'warning', color: 'text-yellow-600' };
        return { status: 'good', color: 'text-green-600' };
    };

    const views = [
        { id: 'overview', label: 'Overview' },
        { id: 'transactions', label: 'Transactions' },
        { id: 'budgets', label: 'Budgets' },
        { id: 'goals', label: 'Goals' },
        { id: 'analytics', label: 'Analytics' }
    ];

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
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <DollarSign className="h-8 w-8" />
                        Finances
                    </h1>
                    <p className="text-muted-foreground">Track your income, expenses, budgets, and financial goals</p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Transaction
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Transaction</DialogTitle>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-sm font-medium">Description *</label>
                                    <Input
                                        placeholder="Transaction description"
                                        value={newTransaction.description || ''}
                                        onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount *</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={newTransaction.amount || ''}
                                        onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Type</label>
                                    <Select 
                                        value={newTransaction.type} 
                                        onValueChange={(value) => setNewTransaction(prev => ({ ...prev, type: value as any }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">Income</SelectItem>
                                            <SelectItem value="expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category *</label>
                                    <Select 
                                        value={newTransaction.category || ''} 
                                        onValueChange={(value) => setNewTransaction(prev => ({ ...prev, category: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(newTransaction.type === 'income' ? incomeCategories : expenseCategories).map((category) => (
                                                <SelectItem key={category} value={category.toLowerCase()}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <Input
                                        type="date"
                                        value={newTransaction.date || new Date().toISOString().split('T')[0]}
                                        onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleCreateTransaction}
                                    disabled={createTransactionMutation.isPending}
                                >
                                    Add Transaction
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Quick Add
                    </Button>
                </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Income</p>
                                <p className="text-2xl font-bold text-green-600">
                                    ${summary.totalIncome?.toLocaleString() || '0'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Total Expenses</p>
                                <p className="text-2xl font-bold text-red-600">
                                    ${summary.totalExpenses?.toLocaleString() || '0'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Net Income</p>
                                <p className={`text-2xl font-bold ${(summary.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${summary.netIncome?.toLocaleString() || '0'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2">
                            <PiggyBank className="h-5 w-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-muted-foreground">Savings Rate</p>
                                <p className="text-2xl font-bold text-purple-600">
                                    {summary.savingsRate || 0}%
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* View Tabs */}
            <Tabs value={selectedView} onValueChange={setSelectedView}>
                <TabsList className="grid w-full grid-cols-5">
                    {views.map((view) => (
                        <TabsTrigger key={view.id} value={view.id}>
                            {view.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Transactions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Transactions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {transactions.slice(0, 5).map((transaction: Transaction) => {
                                    const Icon = getTransactionIcon(transaction.type);
                                    return (
                                        <div key={transaction._id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Icon className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                                                <div>
                                                    <p className="font-medium">{transaction.description}</p>
                                                    <p className="text-sm text-muted-foreground">{transaction.category}</p>
                                                </div>
                                            </div>
                                            <div className={`font-medium ${getTransactionColor(transaction.type)}`}>
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Budget Overview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Budget Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {budgets.slice(0, 4).map((budget: Budget) => {
                                    const status = getBudgetStatus(budget);
                                    const percentage = Math.min((budget.spentAmount / budget.budgetAmount) * 100, 100);
                                    
                                    return (
                                        <div key={budget._id} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">{budget.category}</span>
                                                <span className={`text-sm ${status.color}`}>
                                                    ${budget.spentAmount.toLocaleString()} / ${budget.budgetAmount.toLocaleString()}
                                                </span>
                                            </div>
                                            <Progress value={percentage} className="h-2" />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Financial Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial Goals</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {goals.map((goal: FinancialGoal) => {
                                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                                    
                                    return (
                                        <Card key={goal._id}>
                                            <CardContent className="p-4">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h4 className="font-medium">{goal.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{goal.category.replace('-', ' ')}</p>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span>${goal.currentAmount.toLocaleString()}</span>
                                                            <span>${goal.targetAmount.toLocaleString()}</span>
                                                        </div>
                                                        <Progress value={progress} className="h-2" />
                                                        <p className="text-xs text-muted-foreground">
                                                            {progress.toFixed(1)}% complete
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="transactions" className="space-y-4">
                    {/* Search */}
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search transactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>

                    {/* Transactions List */}
                    <Card>
                        <CardContent className="p-0">
                            <div className="space-y-0">
                                {filteredTransactions.map((transaction: Transaction) => {
                                    const Icon = getTransactionIcon(transaction.type);
                                    return (
                                        <div key={transaction._id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                                            <div className="flex items-center gap-3">
                                                <Icon className={`h-4 w-4 ${getTransactionColor(transaction.type)}`} />
                                                <div>
                                                    <p className="font-medium">{transaction.description}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{transaction.category}</span>
                                                        <span>•</span>
                                                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`font-medium ${getTransactionColor(transaction.type)}`}>
                                                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                                                </div>
                                                <Button variant="ghost" size="sm">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Other tabs would be implemented similarly */}
                <TabsContent value="budgets">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Target className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Budget Management</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Create and manage your budgets to stay on track with your financial goals.
                            </p>
                            <Button onClick={() => setIsBudgetDialogOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Budget
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="goals">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <PiggyBank className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Financial Goals</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Set and track your financial goals to build wealth and achieve financial freedom.
                            </p>
                            <Button onClick={() => setIsGoalDialogOpen(true)} className="gap-2">
                                <Plus className="h-4 w-4" />
                                Create Goal
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Financial Analytics</h3>
                            <p className="text-muted-foreground text-center">
                                Detailed analytics and insights about your financial patterns and trends.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
