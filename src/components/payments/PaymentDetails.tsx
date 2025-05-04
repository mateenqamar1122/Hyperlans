
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  CalendarDays, 
  Calendar, 
  CreditCard, 
  Building, 
  FileText, 
  Edit, 
  Trash 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Payment } from '@/services/paymentService';

interface PaymentDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
  onEdit: () => void;
  onDelete: () => void;
}

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  open,
  onOpenChange,
  payment,
  onEdit,
  onDelete
}) => {
  if (!payment) return null;

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'paid': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'paid': return "bg-green-500/10 text-green-500 border-green-500/20";
      case 'pending': return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case 'overdue': return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'cancelled': return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default: return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  const formatDate = (date: string | null): string => {
    if (!date) return 'Not set';
    try {
      return format(parseISO(date), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Payment Details</span>
            <Badge 
              variant="outline" 
              className={`flex gap-1 items-center ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="capitalize">{payment.status}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount */}
          <div className="text-center py-4 bg-muted/30 rounded-lg">
            <div className="text-sm text-muted-foreground">Amount</div>
            <div className="text-3xl font-bold mt-1">{formatCurrency(payment.amount)}</div>
          </div>
          
          {/* Invoice Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Invoice Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-muted-foreground">Invoice Number:</div>
              <div className="font-medium">{payment.invoice_number}</div>
              
              <div className="text-muted-foreground">Issue Date:</div>
              <div>{formatDate(payment.issue_date)}</div>
              
              <div className="text-muted-foreground">Due Date:</div>
              <div>{formatDate(payment.due_date)}</div>
            </div>
          </div>
          
          <Separator />
          
          {/* Client Details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span className="font-medium">Client Details</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-muted-foreground">Client Name:</div>
              <div className="font-medium">{payment.client_name}</div>
            </div>
          </div>
          
          {/* Description */}
          {payment.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="font-medium">Description</span>
                </div>
                <p className="text-sm">{payment.description || 'No description provided.'}</p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter className="flex gap-2 sm:gap-0">
          <div className="flex-1 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200" 
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button onClick={onEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDetails;
