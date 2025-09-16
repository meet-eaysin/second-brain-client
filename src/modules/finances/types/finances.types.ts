// Finances module types
export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  category: string;
  subcategory?: string;
  account: string;
  toAccount?: string; // For transfers
  date: string;
  tags?: string[];
  notes?: string;
  receipt?: string; // File path or URL
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
  budgetId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months/years
  endDate?: string;
  nextDate: string;
}

export interface Budget {
  id: string;
  name: string;
  description?: string;
  category: string;
  amount: number;
  currency: string;
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  spent: number;
  remaining: number;
  isActive: boolean;
  alertThreshold?: number; // Percentage (0-100)
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash' | 'other';
  balance: number;
  currency: string;
  institution?: string;
  accountNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceCategory {
  id: string;
  name: string;
  type: 'income' | 'expense';
  color?: string;
  icon?: string;
  subcategories?: string[];
  isActive: boolean;
}

export interface FinanceStats {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  totalBudgets: number;
  activeBudgets: number;
  overBudget: number;
  savingsRate: number;
  topExpenseCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

export interface TransactionFormData {
  type: Transaction['type'];
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  account: string;
  toAccount?: string;
  date: string;
  tags?: string[];
  notes?: string;
  isRecurring: boolean;
  recurringPattern?: RecurringPattern;
}

export interface FinanceFilters {
  type?: Transaction['type'][];
  category?: string[];
  account?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  tags?: string[];
  search?: string;
}

export interface FinancesPageProps {
  className?: string;
}
