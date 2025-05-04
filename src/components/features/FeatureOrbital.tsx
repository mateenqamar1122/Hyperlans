
import { Calendar, Code, FileText, User, Clock } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const featureData = [
  {
    id: 1,
    title: "Client Management",
    description: "Organize client information, track communication history, and build stronger relationships with your clients. Keep all your client data in one place.",
    icon: User,
    relatedIds: [2, 4],
    status: "available" as const,
    energy: 95,
  },
  {
    id: 2,
    title: "Project Tracking",
    description: "Stay on top of deadlines, milestones, and deliverables for every project. Manage tasks and track progress with visual indicators.",
    icon: FileText,
    relatedIds: [1, 3, 5],
    status: "available" as const,
    energy: 90,
  },
  {
    id: 3,
    title: "Invoicing & Payments",
    description: "Create professional invoices and get paid faster with multiple payment options. Automatic reminders and payment tracking.",
    icon: Calendar,
    relatedIds: [2, 4],
    status: "available" as const,
    energy: 85,
  },
  {
    id: 4,
    title: "Expense Tracking",
    description: "Track business expenses, categorize spending, and generate reports for tax time. Connect to your bank accounts for automatic imports.",
    icon: Clock,
    relatedIds: [3, 5],
    status: "available" as const,
    energy: 80,
  },
  {
    id: 5,
    title: "Portfolio Generator",
    description: "Create stunning portfolios to showcase your work to potential clients. Customizable templates with your branding.",
    icon: Code,
    relatedIds: [2, 6],
    status: "available" as const,
    energy: 75,
  },
  {
    id: 6,
    title: "AI Assistant",
    description: "Intelligent AI assistant to help with content creation, business advice, and automating repetitive tasks.",
    icon: User,
    relatedIds: [5, 7],
    status: "premium" as const,
    energy: 70,
  },
  {
    id: 7,
    title: "Team Collaboration",
    description: "Invite team members, assign tasks, and collaborate effectively. Real-time updates and communication tools.",
    icon: User,
    relatedIds: [6, 8],
    status: "available" as const,
    energy: 65,
  },
  {
    id: 8,
    title: "Analytics Dashboard",
    description: "Gain insights into your business performance with visual analytics. Track income, expenses, project profitability, and more.",
    icon: FileText,
    relatedIds: [7],
    status: "premium" as const,
    energy: 60,
  },
];

export function FeatureOrbital() {
  return (
    <div className="w-full py-12">
      <div className="container mx-auto px-4 text-center mb-12">
        <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-white mb-4">Features</div>
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Explore Our Features</h2>
        <p className="mt-4 max-w-[900px] mx-auto text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Click on any feature in the orbital display to learn more about what our platform offers
        </p>
      </div>
      
      <RadialOrbitalTimeline timelineData={featureData} />
      
      <div className="container mx-auto px-4 text-center mt-8">
        <p className="text-sm text-muted-foreground">
          Hover and click on the orbital nodes to explore feature details and connections
        </p>
      </div>
    </div>
  );
}
