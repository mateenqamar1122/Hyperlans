
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import InvoiceBuilder from "@/components/InvoiceBuilder";
import PaymentCard from "@/components/payments/PaymentCard";
import PaymentForm from "@/components/payments/PaymentForm";
import PaymentDetails from "@/components/payments/PaymentDetails";
import PaymentStats from "@/components/payments/PaymentStats";
import { 
  getPayments,
  getProjects,
  getPaymentStats, 
  createPayment, 
  updatePayment, 
  deletePayment,
  Payment
} from "@/services/paymentService";
import { toast } from "sonner";
import { format } from "date-fns";

const Payments = () => {
  // State
  const [activeTab, setActiveTab] = useState("all");
  const [invoiceBuilderOpen, setInvoiceBuilderOpen] = useState(false);
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<{id: string, name: string}[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;
  
  // Sorting state
  const [sortBy, setSortBy] = useState("issue_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Payments state
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    paidAmount: 0
  });
  
  // Fetch data
  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const status = activeTab !== "all" ? activeTab : undefined;
      const { data, count } = await getPayments(status, currentPage, itemsPerPage, sortBy, sortOrder);
      setPayments(data);
      setTotalItems(count);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
      toast.error("Could not load payment data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchProjects = async () => {
    try {
      const projectsData = await getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Could not load project data");
    }
  };
  
  const fetchStats = async () => {
    try {
      const statsData = await getPaymentStats();
      setStats({
        totalRevenue: statsData.totalRevenue,
        pendingAmount: statsData.pendingAmount,
        overdueAmount: statsData.overdueAmount,
        paidAmount: statsData.paidAmount
      });
    } catch (error) {
      console.error("Failed to fetch payment stats:", error);
    }
  };
  
  useEffect(() => {
    fetchPayments();
    fetchStats();
    fetchProjects();
  }, [activeTab, currentPage, sortBy, sortOrder]);
  
  // Event handlers
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleViewDetails = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment) {
      setSelectedPayment(payment);
      setIsDetailModalOpen(true);
    }
  };
  
  const handleAddPayment = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await createPayment({
        client_name: "", 
        project_id: data.project_id,
        amount: data.amount,
        due_date: data.due_date?.toISOString() || null,
        status: data.status as any,
        description: data.description || "",
        issue_date: new Date().toISOString() // Add the missing required field
      });
      
      if (result) {
        toast.success("Payment record created successfully");
        setPaymentFormOpen(false);
        fetchPayments();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to create payment:", error);
      toast.error("Could not create payment record");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditPayment = async (data: any) => {
    if (!selectedPayment) return;
    
    setIsSubmitting(true);
    try {
      const result = await updatePayment(selectedPayment.id, {
        project_id: data.project_id,
        amount: data.amount,
        due_date: data.due_date?.toISOString() || null,
        status: data.status as any,
        description: data.description || "",
        issue_date: selectedPayment.issue_date // Preserve the original issue date
      });
      
      if (result) {
        toast.success("Payment record updated successfully");
        setIsEditModalOpen(false);
        setIsDetailModalOpen(false);
        fetchPayments();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to update payment:", error);
      toast.error("Could not update payment record");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeletePayment = async () => {
    if (!selectedPayment) return;
    
    const confirmed = window.confirm("Are you sure you want to delete this payment record?");
    if (!confirmed) return;
    
    setIsSubmitting(true);
    try {
      const result = await deletePayment(selectedPayment.id);
      if (result) {
        toast.success("Payment record deleted successfully");
        setIsDetailModalOpen(false);
        fetchPayments();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to delete payment:", error);
      toast.error("Could not delete payment record");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered payments
  const filteredPayments = searchQuery
    ? payments.filter(
        payment =>
          payment.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payment.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (payment.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : payments;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return (
    <div className="space-y-8 px-4 md:px-6 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-1"
        >
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-magenta">Payments</h1>
          <p className="text-muted-foreground">Manage your invoices and track your financial transactions.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex gap-2"
        >
          <Button 
            onClick={() => setPaymentFormOpen(true)}
            className="shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Payment
          </Button>
          <Button 
            className="bg-gradient-to-r from-brand-cyan to-brand-magenta hover:from-brand-magenta hover:to-brand-cyan text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => setInvoiceBuilderOpen(true)}
          >
            <CreditCard className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </motion.div>
      </div>
      
      {/* Overview Stats */}
      <PaymentStats 
        totalRevenue={stats.totalRevenue}
        pendingAmount={stats.pendingAmount}
        overdueAmount={stats.overdueAmount}
        paidAmount={stats.paidAmount}
      />
      
      {/* Tabs and Filters */}
      <div className="flex flex-col gap-4 bg-card rounded-xl p-6 shadow-md border border-border/50">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="grid grid-cols-4 w-full sm:w-[400px] bg-muted/50 p-1 rounded-lg">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">All</TabsTrigger>
              <TabsTrigger value="paid" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Paid</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Pending</TabsTrigger>
              <TabsTrigger value="overdue" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Overdue</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search payments..." 
                  className="pl-9 w-full sm:w-[200px] bg-background/50 border-border/50 focus:border-brand-magenta/50 transition-all duration-300"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
              >
                <SelectTrigger className="w-[140px] bg-background/50 border-border/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="issue_date-desc">Newest first</SelectItem>
                  <SelectItem value="issue_date-asc">Oldest first</SelectItem>
                  <SelectItem value="amount-desc">Highest amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest amount</SelectItem>
                  <SelectItem value="due_date-asc">Due date (soonest)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-brand-cyan to-brand-magenta opacity-30 blur-md animate-pulse"></div>
                  <Loader2 className="h-8 w-8 animate-spin text-brand-magenta relative z-10" />
                </div>
              </div>
            ) : filteredPayments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPayments.map((payment) => (
                  <PaymentCard
                    key={payment.id}
                    id={payment.id}
                    clientName={payment.client_name}
                    invoiceNumber={payment.invoice_number}
                    amount={payment.amount}
                    issueDate={payment.issue_date}
                    dueDate={payment.due_date}
                    status={payment.status}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-muted/20 rounded-lg border border-dashed border-border/50">
                <div className="relative inline-block">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-brand-cyan/20 to-brand-magenta/20 opacity-30 blur-md"></div>
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground relative z-10" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No payments found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  {searchQuery ? "Try adjusting your search criteria." : "Start creating payment records to track your finances."}
                </p>
                <Button className="mt-6 bg-gradient-to-r from-brand-cyan to-brand-magenta hover:from-brand-magenta hover:to-brand-cyan text-white shadow-md hover:shadow-lg transition-all duration-300" onClick={() => setPaymentFormOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Payment
                </Button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredPayments.length > 0 && (
              <div className="flex items-center justify-between mt-6 bg-muted/20 p-3 rounded-lg border border-border/50">
                <div className="text-sm text-muted-foreground">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} payments
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="border-border/50 hover:bg-muted/50 transition-all duration-300"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Simple pagination logic to show current page and nearby pages
                    let pageToShow = currentPage;
                    if (i === 0) pageToShow = Math.max(1, currentPage - 2);
                    if (i === 1) pageToShow = Math.max(1, currentPage - 1);
                    if (i === 2) pageToShow = currentPage;
                    if (i === 3) pageToShow = Math.min(totalPages, currentPage + 1);
                    if (i === 4) pageToShow = Math.min(totalPages, currentPage + 2);
                    
                    // Don't show duplicates or pages out of bounds
                    if (pageToShow > totalPages || pageToShow < 1) return null;
                    if (i > 0 && pageToShow === Number(document.querySelector(`[data-page="${i-1}"]`)?.getAttribute('data-page-num'))) return null;
                    
                    return (
                      <Button
                        key={i}
                        data-page={i}
                        data-page-num={pageToShow}
                        variant={pageToShow === currentPage ? "default" : "outline"}
                        size="icon"
                        className={`w-8 h-8 ${pageToShow === currentPage ? 'bg-gradient-to-r from-brand-cyan to-brand-magenta text-white' : 'border-border/50 hover:bg-muted/50'} transition-all duration-300`}
                        onClick={() => handlePageChange(pageToShow)}
                      >
                        {pageToShow}
                      </Button>
                    );
                  })}
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="border-border/50 hover:bg-muted/50 transition-all duration-300"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {["paid", "pending", "overdue"].map((status) => (
            <TabsContent key={status} value={status} className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-magenta" />
                </div>
              ) : filteredPayments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPayments.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      id={payment.id}
                      clientName={payment.client_name}
                      invoiceNumber={payment.invoice_number}
                      amount={payment.amount}
                      issueDate={payment.issue_date}
                      dueDate={payment.due_date}
                      status={payment.status}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              ) : (
                <Card className="border-border">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      {status === "paid" && <CheckCircle className="h-12 w-12 text-green-500 mb-4" />}
                      {status === "pending" && <Clock className="h-12 w-12 text-amber-500 mb-4" />}
                      {status === "overdue" && <AlertCircle className="h-12 w-12 text-red-500 mb-4" />}
                      <h3 className="text-xl font-bold mb-2">No {status} payments</h3>
                      <p className="text-muted-foreground mb-4">
                        {status === "paid" && "You don't have any paid invoices at the moment."}
                        {status === "pending" && "You don't have any pending payments at the moment."}
                        {status === "overdue" && "You don't have any overdue payments at the moment."}
                      </p>
                      <Button onClick={() => setPaymentFormOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Pagination - same as above */}
              {filteredPayments.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} payments
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Simple pagination logic to show current page and nearby pages
                      let pageToShow = currentPage;
                      if (i === 0) pageToShow = Math.max(1, currentPage - 2);
                      if (i === 1) pageToShow = Math.max(1, currentPage - 1);
                      if (i === 2) pageToShow = currentPage;
                      if (i === 3) pageToShow = Math.min(totalPages, currentPage + 1);
                      if (i === 4) pageToShow = Math.min(totalPages, currentPage + 2);
                      
                      // Don't show duplicates or pages out of bounds
                      if (pageToShow > totalPages || pageToShow < 1) return null;
                      if (i > 0 && pageToShow === Number(document.querySelector(`[data-page="${status}-${i-1}"]`)?.getAttribute('data-page-num'))) return null;
                      
                      return (
                        <Button
                          key={i}
                          data-page={`${status}-${i}`}
                          data-page-num={pageToShow}
                          variant={pageToShow === currentPage ? "default" : "outline"}
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handlePageChange(pageToShow)}
                        >
                          {pageToShow}
                        </Button>
                      );
                    })}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-cyan/10 to-brand-magenta/10 rounded-full transform translate-x-8 -translate-y-8 opacity-60"></div>
          <CardHeader>
            <CardTitle className="text-lg">Payment Templates</CardTitle>
            <CardDescription>Use preset templates for quick creation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-2">
              {[
                { name: 'Standard Invoice', icon: <FileText className="h-4 w-4" /> },
                { name: 'Detailed Invoice', icon: <FileText className="h-4 w-4" /> },
                { name: 'Retainer Contract', icon: <FileText className="h-4 w-4" /> }
              ].map((template, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-background/50 hover:bg-muted/30 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    {template.icon}
                    <div className="font-medium">{template.name}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:text-brand-magenta">Use</Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-border/50 hover:border-brand-magenta/50 hover:text-brand-magenta transition-all duration-300">Create Custom Template</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-cyan/10 to-brand-magenta/10 rounded-full transform translate-x-8 -translate-y-8 opacity-60"></div>
          <CardHeader>
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <CardDescription>Review accepted payment methods</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-3">
              {[
                { name: 'Credit Card', icon: <CreditCard className="h-4 w-4" />},
                { name: 'Bank Transfer', icon: <ExternalLink className="h-4 w-4" /> },
                { name: 'PayPal', icon: <ExternalLink className="h-4 w-4" /> },
              ].map((method, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-background/50 hover:bg-muted/30 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    {method.icon}
                    <div className="font-medium">{method.name}</div>
                  </div>
                  <Button variant="ghost" size="sm" className="hover:text-brand-magenta">Edit</Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-border/50 hover:border-brand-magenta/50 hover:text-brand-magenta transition-all duration-300">Manage Payment Methods</Button>
          </CardFooter>
        </Card>
        
        <Card className="border-border/50 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-cyan/10 to-brand-magenta/10 rounded-full transform translate-x-8 -translate-y-8 opacity-60"></div>
          <CardHeader>
            <CardTitle className="text-lg">Recent Revenue</CardTitle>
            <CardDescription>Monthly earnings in {new Date().getFullYear()}</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="h-[160px] flex items-end gap-1">
              {Array.from({ length: 6 }).map((_, i) => {
                // Generate some random data for visualization
                const value = Math.floor(Math.random() * 80) + 20;
                const month = new Date();
                month.setMonth(month.getMonth() - 5 + i);
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="relative w-full">
                      <div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-brand-cyan/20 to-brand-magenta/20 rounded-sm" 
                        style={{ height: '100%' }} 
                      />
                      <motion.div 
                        className="absolute bottom-0 w-full bg-gradient-to-t from-brand-cyan to-brand-magenta rounded-sm"
                        initial={{ height: 0 }}
                        animate={{ height: `${value}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(month, 'MMM')}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-border/50 hover:border-brand-magenta/50 hover:text-brand-magenta transition-all duration-300">View Revenue Report</Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Modals */}
      <InvoiceBuilder open={invoiceBuilderOpen} onOpenChange={setInvoiceBuilderOpen} />

      <PaymentForm 
        open={paymentFormOpen}
        onOpenChange={setPaymentFormOpen}
        onSubmit={handleAddPayment}
        projects={projects}
        isLoading={isSubmitting}
      />

      {/* Fix TypeScript error by converting date string to Date object */}
      <PaymentForm 
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSubmit={handleEditPayment}
        projects={projects}
        isLoading={isSubmitting}
        defaultValues={selectedPayment ? {
          ...selectedPayment,
          due_date: selectedPayment.due_date ? new Date(selectedPayment.due_date) : null,
        } : undefined}
        title="Edit Payment"
      />

      <PaymentDetails 
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        payment={selectedPayment}
        onEdit={() => {
          setIsDetailModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={handleDeletePayment}
      />
    </div>
  );
};

export default Payments;
