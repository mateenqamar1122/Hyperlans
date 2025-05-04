
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface PaymentStatProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  index: number;
}

const PaymentStat: React.FC<PaymentStatProps> = ({
  title,
  value,
  description,
  icon,
  iconBg,
  iconColor,
  index
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="h-full"
  >
    <Card className="h-full overflow-hidden border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50/20 to-slate-100/10 rounded-full transform translate-x-8 -translate-y-8 opacity-60"></div>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-full ${iconBg} backdrop-blur-sm`}>
          <div className={`${iconColor}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-magenta">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  </motion.div>
);

interface PaymentStatsProps {
  totalRevenue: number;
  pendingAmount: number;
  overdueAmount: number;
  paidAmount: number;
}

const PaymentStats: React.FC<PaymentStatsProps> = ({
  totalRevenue,
  pendingAmount,
  overdueAmount,
  paidAmount
}) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      description: "Total earnings from invoices",
      icon: <CreditCard className="h-4 w-4" />,
      iconBg: "bg-brand-magenta/10",
      iconColor: "text-brand-magenta",
    },
    {
      title: "Pending",
      value: formatCurrency(pendingAmount),
      description: "Awaiting payment",
      icon: <Clock className="h-4 w-4" />,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      title: "Overdue",
      value: formatCurrency(overdueAmount),
      description: "Past due date",
      icon: <AlertCircle className="h-4 w-4" />,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
    },
    {
      title: "Paid",
      value: formatCurrency(paidAmount),
      description: "Successfully collected",
      icon: <CheckCircle2 className="h-4 w-4" />,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <PaymentStat
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          iconBg={stat.iconBg}
          iconColor={stat.iconColor}
          index={index}
        />
      ))}
    </div>
  );
};

export default PaymentStats;
