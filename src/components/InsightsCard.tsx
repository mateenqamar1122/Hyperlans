
import { useState, useEffect } from "react";
import { Insight } from "@/types/database";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  DollarSign, 
  BarChart, 
  CheckCircle, 
  Activity 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface InsightsCardProps {
  entityType: 'client' | 'project';
  entityId: string;
}

export default function InsightsCard({ entityType, entityId }: InsightsCardProps) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('insights')
          .select('*')
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .maybeSingle();

        if (error) throw error;
        setInsight(data as Insight);
      } catch (error) {
        console.error("Error fetching insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (entityId) {
      fetchInsights();
    }
  }, [entityType, entityId]);

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insight) return null;

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "N/A";
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null) return "N/A";
    return `${value}%`;
  };

  const getMetricValue = (key: string) => {
    if (!insight.key_metrics) return null;
    return insight.key_metrics[key];
  };

  const renderClientInsights = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <DollarSign className="h-3.5 w-3.5 mr-1" /> Revenue
        </span>
        <span className="text-xl font-medium">{formatCurrency(insight.total_revenue)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Completed
        </span>
        <span className="text-xl font-medium">{insight.completed_projects || 0} projects</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <Activity className="h-3.5 w-3.5 mr-1" /> Active
        </span>
        <span className="text-xl font-medium">{insight.active_projects || 0} projects</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <BarChart className="h-3.5 w-3.5 mr-1" /> Satisfaction
        </span>
        <span className="text-xl font-medium">
          {formatPercentage(getMetricValue('satisfaction_rate') as number)}
        </span>
      </div>
    </div>
  );

  const renderProjectInsights = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <DollarSign className="h-3.5 w-3.5 mr-1" /> Budget
        </span>
        <span className="text-xl font-medium">{formatCurrency(insight.total_revenue)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <Clock className="h-3.5 w-3.5 mr-1" /> Time Spent
        </span>
        <span className="text-xl font-medium">{insight.total_time_spent || 0} hours</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" /> Avg. Completion
        </span>
        <span className="text-xl font-medium">{insight.average_completion_time || 0} days</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground flex items-center">
          <TrendingUp className="h-3.5 w-3.5 mr-1" /> Performance
        </span>
        <span className="text-xl font-medium">
          {formatPercentage(getMetricValue('team_performance') as number)}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Performance Insights</CardTitle>
        <CardDescription>
          Key metrics and statistics for this {entityType}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entityType === 'client' ? renderClientInsights() : renderProjectInsights()}
      </CardContent>
    </Card>
  );
}
