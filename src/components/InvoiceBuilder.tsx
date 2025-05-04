
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save, ArrowLeft, Download, CreditCard, Send } from "lucide-react";
import { toast } from "sonner";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0, "Rate must be a positive number"),
  amount: z.coerce.number().optional(),
});

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Invalid email format").optional(),
  clientAddress: z.string().optional(),
  notes: z.string().optional(),
  currency: z.string().default("USD"),
  taxRate: z.coerce.number().min(0, "Tax rate must be a positive number").default(0),
});

type InvoiceItem = z.infer<typeof invoiceItemSchema>;
type InvoiceFormValues = z.infer<typeof invoiceSchema>;

interface InvoiceBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoiceBuilder = ({ open, onOpenChange }: InvoiceBuilderProps) => {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      currency: "USD",
      taxRate: 0,
    },
  });
  
  const handleAddItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };
  
  const handleRemoveItem = (index: number) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };
  
  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...invoiceItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Recalculate amount
    if (field === 'quantity' || field === 'rate') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].rate;
    }
    
    setInvoiceItems(updatedItems);
  };
  
  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + (item.amount || 0), 0);
  };
  
  const calculateTax = () => {
    const taxRate = form.watch("taxRate") || 0;
    return calculateSubtotal() * (taxRate / 100);
  };
  
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };
  
  const handleSaveInvoice = (data: InvoiceFormValues) => {
    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }
    
    // Save the invoice data
    const invoiceData = {
      ...data,
      items: invoiceItems,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      status: "draft",
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage or send to server
    const savedInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
    localStorage.setItem("invoices", JSON.stringify([...savedInvoices, invoiceData]));
    
    toast.success("Invoice created successfully!");
    handleCloseBuilder();
  };
  
  const handlePreviewInvoice = () => {
    if (invoiceItems.length === 0) {
      toast.error("Please add at least one item to the invoice");
      return;
    }
    
    if (!form.formState.isValid) {
      form.trigger();
      toast.error("Please fill all required fields");
      return;
    }
    
    setPreviewMode(true);
  };
  
  const handleCloseBuilder = () => {
    setPreviewMode(false);
    onOpenChange(false);
    // Reset form when dialog closes
    setTimeout(() => {
      form.reset();
      setInvoiceItems([]);
    }, 300);
  };
  
  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "INR": return "₹";
      case "JPY": return "¥";
      default: return "$";
    }
  };
  
  const formatCurrency = (amount: number) => {
    const currency = form.watch("currency") || "USD";
    return `${getCurrencySymbol(currency)}${amount.toFixed(2)}`;
  };
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto" side="right">
        <SheetHeader className="mb-6">
          <SheetTitle>Create Invoice</SheetTitle>
          <SheetDescription>
            Create a new invoice for your client
          </SheetDescription>
        </SheetHeader>
        
        {previewMode ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(false)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Edit
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
                <Button variant="default" size="sm" onClick={form.handleSubmit(handleSaveInvoice)}>
                  <Save className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg p-6 space-y-6">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">INVOICE</h2>
                  <p className="text-gray-500">{form.watch("invoiceNumber")}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Issue Date: {form.watch("issueDate")}</p>
                  <p className="font-medium">Due Date: {form.watch("dueDate")}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">From</h3>
                  <p className="font-medium">Your Company Name</p>
                  <p className="text-sm text-gray-600">your@email.com</p>
                  <p className="text-sm text-gray-600">Your Address</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500 mb-1">Bill To</h3>
                  <p className="font-medium">{form.watch("clientName")}</p>
                  {form.watch("clientEmail") && (
                    <p className="text-sm text-gray-600">{form.watch("clientEmail")}</p>
                  )}
                  {form.watch("clientAddress") && (
                    <p className="text-sm text-gray-600 whitespace-pre-line">{form.watch("clientAddress")}</p>
                  )}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rate
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoiceItems.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          {item.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          {formatCurrency(item.amount || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-48 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Subtotal:</span>
                      <span className="text-sm font-medium">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    {form.watch("taxRate") > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm">Tax ({form.watch("taxRate")}%):</span>
                        <span className="text-sm font-medium">{formatCurrency(calculateTax())}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {form.watch("notes") && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Notes</h3>
                  <p className="text-sm text-gray-600">{form.watch("notes")}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="JPY">JPY (¥)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Client Information</h3>
                
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="clientAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Address</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Invoice Items</h3>
                  <Button type="button" onClick={handleAddItem} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
                
                {invoiceItems.length === 0 ? (
                  <div className="text-center p-6 border border-dashed rounded-lg">
                    <p className="text-gray-500">No items added yet</p>
                    <Button
                      type="button"
                      onClick={handleAddItem}
                      variant="outline"
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rate
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {invoiceItems.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Input
                                value={item.description}
                                onChange={(e) => handleItemChange(index, "description", e.target.value)}
                                placeholder="Item description"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                                className="w-20 text-right"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.rate}
                                onChange={(e) => handleItemChange(index, "rate", parseFloat(e.target.value))}
                                className="w-28 text-right"
                              />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                              {formatCurrency(item.amount || (item.quantity * item.rate))}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <Trash2 className="h-4 w-4 text-gray-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {invoiceItems.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-end">
                      <div className="w-48 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Subtotal:</span>
                          <span className="text-sm font-medium">{formatCurrency(calculateSubtotal())}</span>
                        </div>
                        {form.watch("taxRate") > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm">Tax ({form.watch("taxRate")}%):</span>
                            <span className="text-sm font-medium">{formatCurrency(calculateTax())}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-medium">Total:</span>
                          <span className="font-bold">{formatCurrency(calculateTotal())}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any additional notes or payment terms..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={handleCloseBuilder}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handlePreviewInvoice}>
                    Preview
                  </Button>
                  <Button type="button" onClick={form.handleSubmit(handleSaveInvoice)}>
                    Save Invoice
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default InvoiceBuilder;
