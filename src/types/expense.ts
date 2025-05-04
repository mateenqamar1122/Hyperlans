
export interface Expense {
  id: string;
  user_id: string;
  project_id?: string | null;
  amount: number;
  category: string;
  description?: string | null;
  expense_date: string;
  payment_method?: string | null;
  receipt_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseFormData {
  category: string;
  amount: number;
  expense_date: Date;
  description?: string;
  payment_method?: string;
  project_id?: string | null;
  receipt_url?: string | null;
}

export interface ExpenseCategoryTotal {
  category: string;
  total: number;
}

export interface ExpensesStats {
  totalExpenses: number;
  monthlyExpenses: number;
  largestCategory: string;
  recentTransactions: Expense[];
}
