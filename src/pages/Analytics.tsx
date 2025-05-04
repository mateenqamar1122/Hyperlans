
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  BarChart3, 
  PieChart, 
  LineChart, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Filter, 
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your business performance.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span>Last 30 Days</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Revenue",
            value: "$42,530",
            change: "+12.3%",
            trend: "up",
            description: "Compared to $37,850 last period",
          },
          {
            title: "Projects Completed",
            value: "24",
            change: "+8.7%",
            trend: "up",
            description: "Compared to 22 last period",
          },
          {
            title: "Average Project Value",
            value: "$1,772",
            change: "+5.2%",
            trend: "up",
            description: "Compared to $1,684 last period",
          },
          {
            title: "Client Retention",
            value: "86%",
            change: "-2.1%",
            trend: "down",
            description: "Compared to 88% last period",
          },
        ].map((metric, i) => (
          <Card key={i} className="animate-scale-in" style={{ animationDelay: `${i * 50}ms` }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center mt-1 text-xs">
                <span 
                  className={`flex items-center ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}
                >
                  {metric.trend === "up" ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-2">{metric.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Revenue Analysis */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Monthly revenue breakdown and trends</CardDescription>
          </div>
          <Tabs defaultValue="monthly">
            <TabsList className="grid grid-cols-3 w-[240px]">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full flex items-center justify-center">
            <AreaChart className="h-32 w-32 text-muted-foreground/50" />
            <div className="ml-4 text-center">
              <p className="text-muted-foreground">Revenue chart will be displayed here</p>
              <p className="text-sm text-muted-foreground/70 mt-2">Use Recharts to implement actual charts</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Project Distribution</CardTitle>
              <CardDescription>Breakdown by project type</CardDescription>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[300px]">
              <PieChart className="h-32 w-32 text-muted-foreground/50" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {[
                { label: "Web Development", value: "32%", color: "bg-brand-magenta" },
                { label: "Design", value: "28%", color: "bg-blue-500" },
                { label: "Branding", value: "24%", color: "bg-amber-500" },
                { label: "Consulting", value: "16%", color: "bg-green-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                  <div className="text-sm">{item.label}</div>
                  <div className="text-sm font-medium ml-auto">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Client Acquisition</CardTitle>
              <CardDescription>New clients over time</CardDescription>
            </div>
            <Select defaultValue="sixMonths">
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="threeMonths">Last 3 months</SelectItem>
                <SelectItem value="sixMonths">Last 6 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <LineChart className="h-32 w-32 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance by Client & Top Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Performance by Client</CardTitle>
            <CardDescription>Revenue by client</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[
                { name: "TechCorp", revenue: "$12,450", growth: "+24%", color: "bg-gradient-to-r from-brand-magenta to-brand-magenta/60" },
                { name: "InnovateCo", revenue: "$8,320", growth: "+12%", color: "bg-gradient-to-r from-blue-500 to-blue-500/60" },
                { name: "StyleWorks", revenue: "$6,540", growth: "+8%", color: "bg-gradient-to-r from-amber-500 to-amber-500/60" },
                { name: "GrowthInc", revenue: "$4,890", growth: "+5%", color: "bg-gradient-to-r from-green-500 to-green-500/60" },
              ].map((client, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="font-medium">{client.name}</div>
                    <div className="flex items-center gap-2">
                      <span>{client.revenue}</span>
                      <span className="text-xs text-green-500">{client.growth}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${client.color} rounded-full`} 
                      style={{ width: `${75 - i * 15}%` }} 
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Top Performing Projects</CardTitle>
            <CardDescription>Ranked by profitability</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { name: "Enterprise Website Redesign", client: "TechCorp", value: "$18,500", roi: "247%" },
                { name: "E-commerce Platform", client: "StyleWorks", value: "$12,800", roi: "198%" },
                { name: "Mobile App Development", client: "InnovateCo", value: "$24,600", roi: "182%" },
                { name: "Branding & Identity", client: "GrowthInc", value: "$8,750", roi: "156%" },
              ].map((project, i) => (
                <div key={i} className="flex items-start justify-between p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{project.name}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{project.client}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{project.value}</div>
                    <div className="text-sm text-green-500">{project.roi} ROI</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Time Tracking */}
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Time Allocation</CardTitle>
            <CardDescription>Hours spent per project category</CardDescription>
          </div>
          <Button variant="outline" size="sm">View Detailed Report</Button>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full flex items-center justify-center">
            <BarChart3 className="h-32 w-32 text-muted-foreground/50" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { label: "Development", hours: "246h", color: "bg-brand-magenta", percentage: "42%" },
              { label: "Design", hours: "128h", color: "bg-blue-500", percentage: "22%" },
              { label: "Meetings", hours: "96h", color: "bg-amber-500", percentage: "16%" },
              { label: "Research", hours: "118h", color: "bg-green-500", percentage: "20%" },
            ].map((category, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-4">
                  <div className={`w-3 h-3 rounded-full ${category.color} mb-2`}></div>
                  <div className="font-medium">{category.label}</div>
                  <div className="text-2xl font-bold mt-1">{category.hours}</div>
                  <div className="text-sm text-muted-foreground">{category.percentage} of total</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
