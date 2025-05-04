
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { fetchExpenses, fetchExpenseStats, createExpense, updateExpense, deleteExpense } from '@/services/expenseService';
import { Expense, ExpenseFormData } from '@/types/expense';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ExpenseTable from '@/components/expense/ExpenseTable';
import ExpenseStats from '@/components/expense/ExpenseStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const ExpensesPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const queryClient = useQueryClient();

  // Fetch expenses
  const { data: expenses = [], isLoading: isLoadingExpenses, error: expensesError } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpenses
  });

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['expenseStats'],
    queryFn: fetchExpenseStats
  });

  // Create expense mutation
  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseStats'] });
      toast.success('Expense created successfully');
      setIsDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating expense:', error);
      toast.error('Failed to create expense');
    }
  });

  // Update expense mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ExpenseFormData> }) => 
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseStats'] });
      toast.success('Expense updated successfully');
      setIsDialogOpen(false);
      setEditingExpense(null);
    },
    onError: (error) => {
      console.error('Error updating expense:', error);
      toast.error('Failed to update expense');
    }
  });

  // Delete expense mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenseStats'] });
      toast.success('Expense deleted successfully');
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  });

  const handleNewExpense = () => {
    setEditingExpense(null);
    setIsDialogOpen(true);
  };

  const handleSubmitExpense = (data: ExpenseFormData) => {
    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    const expenseDate = new Date(expense.expense_date);
    setEditingExpense({
      ...expense,
      expense_date: expense.expense_date // Keep as string for the API
    });
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteMutation.mutate(expenseToDelete.id);
    }
  };

  const handleDeleteExpense = (expense: Expense) => {
    setExpenseToDelete(expense);
    setIsDeleteDialogOpen(true);
  };

  // Reset state when dialog is closed
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setTimeout(() => setEditingExpense(null), 300); // Delay to avoid UI flicker
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <WalletCards className="h-8 w-8" />
            Expense Management
          </h1>
          <p className="text-muted-foreground">
            Track, analyze, and manage your expenses
          </p>
        </div>
        <Button onClick={handleNewExpense} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Expense
        </Button>
      </div>

      {expensesError && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the expenses. Please try again later.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-4">
          {isLoadingExpenses ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading expenses...
            </div>
          ) : (
            <ExpenseTable
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          )}
        </TabsContent>
        
        <TabsContent value="dashboard">
          {isLoadingStats ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading stats...
            </div>
          ) : (
            stats && (
              <ExpenseStats
                totalExpenses={stats.totalExpenses}
                monthlyExpenses={stats.monthlyExpenses}
                categoryTotals={stats.categoryTotals}
                recentTransactions={stats.recentTransactions}
              />
            )
          )}
        </TabsContent>
      </Tabs>

      {/* Expense Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
            <DialogDescription>
              {editingExpense 
                ? 'Update the details of your expense.'
                : 'Fill in the details to add a new expense.'}
            </DialogDescription>
          </DialogHeader>
          
          <ExpenseForm
            initialData={editingExpense ? {
              ...editingExpense,
              expense_date: new Date(editingExpense.expense_date)
            } : {}}
            onSubmit={handleSubmitExpense}
            onCancel={handleCloseDialog}
            isSubmitting={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExpensesPage;
