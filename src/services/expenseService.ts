
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseFormData } from '@/types/expense';

export async function fetchExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, projects(name)')
    .order('expense_date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }

  return data || [];
}

export async function fetchExpenseById(id: string): Promise<Expense> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*, projects(name)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }

  return data;
}

export async function createExpense(expenseData: ExpenseFormData): Promise<Expense> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      ...expenseData,
      user_id: user.id, // Add the current user's ID
      expense_date: expenseData.expense_date.toISOString(),
      // If project_id is "no-project", set it to null
      project_id: expenseData.project_id === "no-project" ? null : expenseData.project_id
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }

  return data;
}

export async function updateExpense(id: string, expenseData: Partial<ExpenseFormData>): Promise<Expense> {
  const updateData = { ...expenseData };
  
  // Convert Date to ISO string if it exists
  if (updateData.expense_date instanceof Date) {
    updateData.expense_date = updateData.expense_date.toISOString();
  }
  
  // If project_id is "no-project", set it to null
  if (updateData.project_id === "no-project") {
    updateData.project_id = null;
  }

  const { data, error } = await supabase
    .from('expenses')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating expense:', error);
    throw error;
  }

  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
}

export async function fetchExpenseStats(): Promise<{ 
  totalExpenses: number; 
  monthlyExpenses: number; 
  categoryTotals: { category: string; total: number }[];
  recentTransactions: Expense[];
}> {
  // Get all expenses to calculate statistics
  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('*')
    .order('expense_date', { ascending: false });

  if (error) {
    console.error('Error fetching expense statistics:', error);
    throw error;
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  // Calculate monthly expenses (current month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.expense_date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  // Calculate totals per category
  const categoryMap = new Map<string, number>();
  expenses.forEach(expense => {
    const currentTotal = categoryMap.get(expense.category) || 0;
    categoryMap.set(expense.category, currentTotal + Number(expense.amount));
  });

  const categoryTotals = Array.from(categoryMap).map(([category, total]) => ({
    category,
    total
  })).sort((a, b) => b.total - a.total);

  // Get recent transactions (top 5)
  const recentTransactions = expenses.slice(0, 5);

  return {
    totalExpenses,
    monthlyExpenses,
    categoryTotals,
    recentTransactions
  };
}

export async function fetchExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .gte('expense_date', startDate.toISOString())
    .lte('expense_date', endDate.toISOString())
    .order('expense_date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses by date range:', error);
    throw error;
  }

  return data || [];
}

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data || [];
}
