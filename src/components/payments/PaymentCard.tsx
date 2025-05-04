
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, XCircle, ArrowRight } from "lucide-react";
import { format, parseISO } from "date-fns";

interface PaymentCardProps {
  id: string;
  clientName: string;
  invoiceNumber: string;
  amount: number;
  issueDate: string;
  dueDate: string | null;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  onViewDetails: (id: string) => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  id,
  clientName,
  invoiceNumber,
  amount,
  issueDate,
  dueDate,
  status,
  onViewDetails
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'paid': return <CheckCircle2 className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border-border/50 hover:shadow-md transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-cyan/5 to-brand-magenta/5 rounded-full transform translate-x-8 -translate-y-8 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-medium">{clientName}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{invoiceNumber}</p>
            </div>
            <Badge 
              variant="outline" 
              className={`flex gap-1 items-center ${getStatusColor()}`}
            >
              {getStatusIcon()}
              <span className="capitalize">{status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2 flex-grow">
          <div className="text-xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-magenta">
            {formatCurrency(amount)}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-muted-foreground">Issued:</div>
            <div>{formatDate(issueDate)}</div>
            
            <div className="text-muted-foreground">Due:</div>
            <div>{formatDate(dueDate)}</div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t border-border/30">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between hover:bg-brand-magenta/5 hover:text-brand-magenta transition-colors duration-300"
            onClick={() => onViewDetails(id)}
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PaymentCard;
