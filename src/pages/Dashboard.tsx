
import React, { useEffect, useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button"; // Added missing import
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  LineChart as LineChartIcon,
  ListTodo,
  PieChart as PieChartIcon,
  Plus,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { getDashboardStats, getProjectStats, getRevenueHistory } from '@/services/dashboardService';
import { getTasks } from '@/services/productivityService';
import { getProjects } from '@/services/projectService';
import { getClients } from '@/services/clientService';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from '@/components/ui/dropdown-menu';

// Type definitions
interface DashboardStat {
  id: string;
  total_projects: number;
  active_projects: number;
  completed_projects: number;
  tasks_completion_rate: number;
  monthly_revenue: number;
  last_month_revenue: number;
  yearly_revenue: number;
  user_id: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStat | null>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [chartType, setChartType] = useState("bar");

  // Fetch dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoadingStats(true);
        const dashboardStats = await getDashboardStats();
        if (dashboardStats) {
          setStats(dashboardStats);
        }

        // Get revenue data
        setLoadingRevenue(true);
        const currentYear = new Date().getFullYear();
        const revenue = await getRevenueHistory(currentYear);
        
        // If no revenue data, create sample data
        if (revenue.every(item => item === null)) {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const sampleData = months.map((month, i) => ({
            name: month,
            revenue: Math.floor(Math.random() * 15000) + 5000,
            expenses: Math.floor(Math.random() * 8000) + 3000,
            profit: Math.floor(Math.random() * 10000) + 2000
          }));
          setRevenueData(sampleData);
        } else {
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const mappedData = months.map((month, i) => {
            const amount = revenue[i]?.amount || 0;
            return {
              name: month,
              revenue: amount,
              expenses: amount * 0.6, // Simulated data
              profit: amount * 0.4    // Simulated data
            };
          });
          setRevenueData(mappedData);
        }
        
        // Get project data
        const projects = await getProjects();
        const projectStats = {
          completed: projects.filter(p => p.status === 'completed').length,
          inProgress: projects.filter(p => p.status === 'in-progress').length,
          pending: projects.filter(p => p.status === 'pending').length,
          onHold: projects.filter(p => p.status === 'on-hold').length
        };
        
        setProjectData([
          { name: 'Completed', value: projectStats.completed, color: '#10b981' },
          { name: 'In Progress', value: projectStats.inProgress, color: '#3b82f6' },
          { name: 'Pending', value: projectStats.pending, color: '#f59e0b' },
          { name: 'On Hold', value: projectStats.onHold, color: '#6b7280' }
        ]);
        
        // Get task data
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoadingStats(false);
        setLoadingRevenue(false);
      }
    };

    loadDashboardData();
  }, [user]);

  // Calculate task completion rate
  const calculateTaskCompletionRate = () => {
    if (!tasks || tasks.length === 0) return 0;
    
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Get color based on trend (positive or negative)
  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-500";
    if (current < previous) return "text-red-500";
    return "text-gray-500";
  };

  // Calculate percentage change
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.05} vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                borderColor: 'rgba(55, 65, 81, 0.3)',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '12px'
              }} 
              cursor={{fill: 'rgba(100, 116, 139, 0.05)'}} 
            />
            <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} strokeWidth={0} animationDuration={1500} />
            <Bar dataKey="expenses" fill="url(#expensesGradient)" radius={[6, 6, 0, 0]} strokeWidth={0} animationDuration={1500} />
            <Bar dataKey="profit" fill="url(#profitGradient)" radius={[6, 6, 0, 0]} strokeWidth={0} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                color: '#fff' 
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3b82f6" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="profit" 
              stroke="#10b981" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                borderColor: '#374151',
                color: '#fff' 
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stackId="1"
              stroke="#3b82f6" 
              fill="#3b82f680" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              stackId="1"
              stroke="#ef4444" 
              fill="#ef444480" 
            />
            <Area 
              type="monotone" 
              dataKey="profit" 
              stackId="1"
              stroke="#10b981" 
              fill="#10b98180" 
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="space-y-6 px-1 py-2">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-blue/10 to-brand-cyan/10 p-6 backdrop-blur-sm border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-white/5"></div>
        <div className="absolute h-32 w-32 rounded-full bg-gradient-to-r from-brand-blue to-brand-cyan opacity-20 blur-3xl -top-10 -right-10"></div>
        <div className="absolute h-20 w-20 rounded-full bg-gradient-to-r from-brand-magenta to-brand-blue opacity-20 blur-2xl bottom-5 left-5"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan mb-2">Dashboard</h1>
            <p className="text-muted-foreground text-lg">
              Welcome to your dashboard. Here's a quick overview of your business.
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-brand-blue to-brand-cyan hover:from-brand-blue/90 hover:to-brand-cyan/90 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-xl">
              <DropdownMenuItem onClick={() => window.location.href = "/projects?action=create"} className="hover:bg-brand-blue/10 focus:bg-brand-blue/10 rounded-lg transition-colors duration-200 my-1">
                <Plus className="mr-2 h-4 w-4 text-brand-blue" />
                New Project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/payments?action=create-invoice"} className="hover:bg-brand-blue/10 focus:bg-brand-blue/10 rounded-lg transition-colors duration-200 my-1">
                <FileText className="mr-2 h-4 w-4 text-brand-cyan" />
                New Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/clients?action=create"} className="hover:bg-brand-blue/10 focus:bg-brand-blue/10 rounded-lg transition-colors duration-200 my-1">
                <UserPlus className="mr-2 h-4 w-4 text-brand-magenta" />
                New Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.location.href = "/productivity?action=create-task"} className="hover:bg-brand-blue/10 focus:bg-brand-blue/10 rounded-lg transition-colors duration-200 my-1">
                <ListTodo className="mr-2 h-4 w-4 text-emerald-500" />
                New Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 p-1 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-800/50 rounded-xl shadow-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 px-6">Overview</TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 px-6">Projects</TabsTrigger>
          <TabsTrigger value="finance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-blue/90 data-[state=active]:to-brand-cyan/90 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-300 px-6">Finance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Project Stats Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute h-32 w-32 bg-brand-blue/10 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 mr-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    Projects
                  </CardTitle>
                  <CardDescription>Project summary and metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold">Total Projects: {stats?.total_projects || 0}</p>
                      <p className="text-lg font-semibold">Active: {stats?.active_projects || 0}</p>
                      <p className="text-lg font-semibold">Completed: {stats?.completed_projects || 0}</p>
                      
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Project Success Rate</span>
                        <span className="text-sm font-medium">
                          {stats?.total_projects ? 
                            Math.round((stats.completed_projects / stats.total_projects) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Task Completion Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute h-32 w-32 bg-green-500/10 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-600/10 mr-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    Task Progress
                  </CardTitle>
                  <CardDescription>Task completion metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Task Completion</span>
                        <span>{calculateTaskCompletionRate()}%</span>
                      </div>
                      <Progress 
                        value={calculateTaskCompletionRate()} 
                        className="h-2" 
                      />
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>Completed: {tasks.filter(t => t.status === 'completed').length}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                          <span>In Progress: {tasks.filter(t => t.status === 'in-progress').length}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span>Not Started: {tasks.filter(t => t.status === 'not-started').length}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span>Total: {tasks.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Revenue Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute h-32 w-32 bg-emerald-500/10 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-600/10 mr-3">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>
                    Revenue
                  </CardTitle>
                  <CardDescription>Monthly revenue and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="space-y-2">
                      <Skeleton className="h-7 w-28" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ) : (
                    <div>
                      <p className="text-2xl font-bold">
                        ${stats?.monthly_revenue?.toLocaleString() || '0'}
                      </p>
                      <div className="flex items-center mt-1">
                        <p className="text-sm text-muted-foreground">Last Month</p>
                        <p className={`text-sm ml-1 ${getTrendColor(
                          stats?.monthly_revenue || 0, 
                          stats?.last_month_revenue || 0
                        )}`}>
                          {calculatePercentageChange(
                            stats?.monthly_revenue || 0, 
                            stats?.last_month_revenue || 0
                          )}%
                          {stats?.monthly_revenue || 0 > stats?.last_month_revenue || 0 ? (
                            <TrendingUp className="inline ml-1 h-3 w-3" />
                          ) : (
                            stats?.monthly_revenue || 0 < stats?.last_month_revenue || 0 ? (
                              <Activity className="inline ml-1 h-3 w-3" />
                            ) : null
                          )}
                        </p>
                      </div>
                      <p className="text-sm mt-2">
                        YTD Revenue: <span className="font-medium">${stats?.yearly_revenue?.toLocaleString() || '0'}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Timeline Card */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute h-32 w-32 bg-orange-500/10 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-amber-600/10 mr-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    Upcoming
                  </CardTitle>
                  <CardDescription>Deadlines and events</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tasks.filter(task => task.due_date && task.status !== 'completed')
                        .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                        .slice(0, 3)
                        .map((task, i) => (
                          <div key={i} className="flex items-start gap-2 py-1 group">
                            {new Date(task.due_date) < new Date() ? (
                              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                            ) : (
                              <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                            )}
                            <div>
                              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Due: {new Date(task.due_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      
                      {tasks.filter(task => task.due_date && task.status !== 'completed').length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No upcoming deadlines</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-cyan/5 opacity-50"></div>
              <div className="absolute h-64 w-64 bg-brand-blue/10 rounded-full blur-3xl -top-20 -right-20 opacity-30"></div>
              <div className="absolute h-48 w-48 bg-brand-cyan/10 rounded-full blur-3xl -bottom-20 -left-20 opacity-30"></div>
              <CardHeader className="pb-2 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-cyan">Revenue Overview</CardTitle>
                  <div className="flex gap-1 p-1 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-inner">
                    <Button 
                      variant={chartType === "bar" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setChartType("bar")}
                      className={chartType === "bar" ? "bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-md" : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={chartType === "line" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setChartType("line")}
                      className={chartType === "line" ? "bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-md" : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"}
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={chartType === "area" ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setChartType("area")}
                      className={chartType === "area" ? "bg-gradient-to-r from-brand-blue to-brand-cyan text-white shadow-md" : "hover:bg-gray-200/50 dark:hover:bg-gray-700/50"}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground/80">
                  Monthly revenue, expenses and profit
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRevenue ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                  </div>
                ) : (
                  renderChart()
                )}
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Project Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="md:col-span-1"
            >
              <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute h-32 w-32 bg-indigo-500/10 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="flex items-center text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-600/10 mr-3">
                      <PieChartIcon className="h-5 w-5 text-indigo-500" />
                    </div>
                    Project Distribution
                  </CardTitle>
                  <CardDescription>
                    Distribution by project status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStats ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={projectData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {projectData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
                    {projectData.map((item, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <div 
                          className="h-2 w-2 rounded-full mr-1" 
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}: {item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Clients and Team Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="md:col-span-2"
            >
              <Card className="border border-gray-200/50 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden group h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute h-32 w-32 bg-violet-500/10 rounded-full blur-3xl -top-10 -right-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardHeader className="pb-2 relative">
                  <CardTitle className="flex items-center text-lg">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-600/10 mr-3">
                      <Users className="h-5 w-5 text-violet-500" />
                    </div>
                    Team & Client Analytics
                  </CardTitle>
                  <CardDescription>
                    Recent activity and top clients
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Top Clients</h4>
                      <div className="space-y-2">
                        {loadingStats ? (
                          <>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-sm">Acme Inc.</span>
                              <span className="text-sm font-medium">$24,500</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-sm">Tech Solutions</span>
                              <span className="text-sm font-medium">$18,200</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-sm">Global Ventures</span>
                              <span className="text-sm font-medium">$15,800</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-sm">Modern Designs</span>
                              <span className="text-sm font-medium">$12,400</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Team Activity</h4>
                      <div className="space-y-2">
                        {loadingStats ? (
                          <>
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 py-1">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                                JS
                              </div>
                              <div className="flex-1 text-xs">
                                <p className="font-medium">John Smith</p>
                                <p className="text-muted-foreground">Completed Tech Solutions project</p>
                              </div>
                              <div className="text-xs text-muted-foreground">2h ago</div>
                            </div>
                            
                            <div className="flex items-center gap-2 py-1">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-medium">
                                AJ
                              </div>
                              <div className="flex-1 text-xs">
                                <p className="font-medium">Anna Johnson</p>
                                <p className="text-muted-foreground">Created new task for Global Ventures</p>
                              </div>
                              <div className="text-xs text-muted-foreground">5h ago</div>
                            </div>
                            
                            <div className="flex items-center gap-2 py-1">
                              <div className="h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-medium">
                                MB
                              </div>
                              <div className="flex-1 text-xs">
                                <p className="font-medium">Mark Brown</p>
                                <p className="text-muted-foreground">Updated progress on Acme Inc. project</p>
                              </div>
                              <div className="text-xs text-muted-foreground">Yesterday</div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {/* Project Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-sm">
              <CardHeader>
                <CardTitle>Project Timeline</CardTitle>
                <CardDescription>
                  Project durations and deadlines
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={[
                      { name: "Tech Solutions Website", start: 0, duration: 45 },
                      { name: "Acme Inc. Mobile App", start: 15, duration: 60 },
                      { name: "Global Ventures Redesign", start: 30, duration: 30 },
                      { name: "Modern Designs Branding", start: 45, duration: 50 },
                      { name: "Finance Dashboard", start: 60, duration: 35 },
                    ]}
                    margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      scale="band" 
                      width={100}
                      tick={{fontSize: 12}}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="duration" 
                      stackId="a" 
                      fill="#3b82f6" 
                      radius={[0, 4, 4, 0]} 
                      barSize={20}
                    />
                    <Bar 
                      dataKey="start" 
                      stackId="a" 
                      fill="transparent" 
                      radius={[4, 0, 0, 4]} 
                      barSize={20}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-sm">
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Weekly progress across projects
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { week: "Week 1", project1: 10, project2: 15, project3: 5, project4: 0 },
                      { week: "Week 2", project1: 25, project2: 30, project3: 15, project4: 10 },
                      { week: "Week 3", project1: 40, project2: 35, project3: 25, project4: 20 },
                      { week: "Week 4", project1: 55, project2: 45, project3: 40, project4: 35 },
                      { week: "Week 5", project1: 75, project2: 60, project3: 55, project4: 50 },
                      { week: "Week 6", project1: 90, project2: 75, project3: 70, project4: 65 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="project1" 
                      name="Tech Solutions" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="project2" 
                      name="Acme Inc." 
                      stroke="#10b981" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="project3" 
                      name="Global Ventures" 
                      stroke="#f59e0b" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="project4" 
                      name="Modern Designs" 
                      stroke="#8b5cf6" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Team Utilization Chart */}
          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-sm">
            <CardHeader>
              <CardTitle>Team Utilization</CardTitle>
              <CardDescription>
                Hours spent on different projects by team members
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'John Smith', project1: 20, project2: 10, project3: 5, project4: 15 },
                    { name: 'Anna Johnson', project1: 5, project2: 25, project3: 10, project4: 10 },
                    { name: 'Mark Brown', project1: 10, project2: 5, project3: 20, project4: 15 },
                    { name: 'Sarah Lee', project1: 15, project2: 15, project3: 5, project4: 15 },
                    { name: 'James Wilson', project1: 10, project2: 10, project3: 15, project4: 15 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="project1" 
                    name="Tech Solutions" 
                    stackId="a" 
                    fill="#3b82f6" 
                  />
                  <Bar 
                    dataKey="project2" 
                    name="Acme Inc." 
                    stackId="a" 
                    fill="#10b981" 
                  />
                  <Bar 
                    dataKey="project3" 
                    name="Global Ventures" 
                    stackId="a" 
                    fill="#f59e0b" 
                  />
                  <Bar 
                    dataKey="project4" 
                    name="Modern Designs" 
                    stackId="a" 
                    fill="#8b5cf6" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-sm md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>
                  Financial performance over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expenses" 
                      stroke="#ef4444" 
                      fillOpacity={1} 
                      fill="url(#colorExpenses)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-sm h-full">
              <CardHeader>
                <CardTitle>Profit Distribution</CardTitle>
                <CardDescription>
                  Distribution of profits by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Development', value: 45, color: '#3b82f6' },
                          { name: 'Design', value: 25, color: '#ec4899' },
                          { name: 'Marketing', value: 15, color: '#f59e0b' },
                          { name: 'Consulting', value: 15, color: '#10b981' },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Development', value: 45, color: '#3b82f6' },
                          { name: 'Design', value: 25, color: '#ec4899' },
                          { name: 'Marketing', value: 15, color: '#f59e0b' },
                          { name: 'Consulting', value: 15, color: '#10b981' },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Profit (YTD)</span>
                    <span className="font-medium">$245,200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <span className="font-medium">32.4%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">YoY Growth</span>
                    <span className="font-medium text-green-500">+18.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-gray-300/50 dark:border-gray-700/50 shadow-sm">
            <CardHeader>
              <CardTitle>Client Profitability</CardTitle>
              <CardDescription>
                Profitability analysis by client
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Acme Inc.', revenue: 55000, expenses: 30500, profit: 24500 },
                    { name: 'Tech Solutions', revenue: 42000, expenses: 23800, profit: 18200 },
                    { name: 'Global Ventures', revenue: 38000, expenses: 22200, profit: 15800 },
                    { name: 'Modern Designs', revenue: 31000, expenses: 18600, profit: 12400 },
                    { name: 'Finance Corp', revenue: 28000, expenses: 17500, profit: 10500 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar 
                    dataKey="revenue" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="#ef4444" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="profit" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
