
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Expense } from "@/types/expense";
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseStatsProps {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryTotals: { category: string; total: number }[];
  recentTransactions: Expense[];
}

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#22C55E', '#EAB308', '#EC4899', '#6366F1'];

const ExpenseStats: React.FC<ExpenseStatsProps> = ({
  totalExpenses,
  monthlyExpenses,
  categoryTotals,
  recentTransactions
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Prepare chart data
  const chartData = categoryTotals.map((category, index) => ({
    name: category.category,
    value: category.total,
    color: COLORS[index % COLORS.length]
  }));

  const largestCategory = categoryTotals.length > 0 ? categoryTotals[0].category : 'None';
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-muted-foreground">All time expenses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</div>
          <p className="text-xs text-muted-foreground">Current month expenses</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{largestCategory}</div>
          <p className="text-xs text-muted-foreground">
            {categoryTotals.length > 0 
              ? formatCurrency(categoryTotals[0].total)
              : "$0"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(recentTransactions.length > 0 
              ? totalExpenses / recentTransactions.length 
              : 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">Per transaction</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
          <CardDescription>How your expenses are distributed across categories</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => formatCurrency(Number(value))} 
                  labelFormatter={(_, payload) => payload[0]?.name || ''}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {transaction.description || "No description"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.expense_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No recent transactions
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseStats;
