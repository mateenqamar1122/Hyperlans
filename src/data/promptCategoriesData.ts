
import { 
  Briefcase, 
  FileEdit, 
  FileText, 
  Code, 
  Lightbulb 
} from "lucide-react";

export const promptCategoriesData = [
  { 
    icon: Briefcase,
    name: "Business Strategy",
    color: "bg-gradient-to-r from-indigo-500 to-blue-500",
    prompts: [
      { 
        title: "Business Plan Template",
        prompt: "Create a comprehensive business plan template for a freelance web development business.",
        tags: ["Planning", "Strategy"]
      },
      { 
        title: "Pricing Strategy",
        prompt: "Help me develop a pricing strategy for my freelance graphic design services. I'm not sure whether to charge hourly or per project.",
        tags: ["Pricing", "Finance"]
      },
      {
        title: "Competitor Analysis",
        prompt: "I need to analyze my competitors in the web design industry. What are the key aspects I should focus on?",
        tags: ["Research", "Strategy"]
      },
    ]
  },
  {
    icon: FileEdit,
    name: "Client Communication",
    color: "bg-gradient-to-r from-emerald-500 to-teal-500",
    prompts: [
      { 
        title: "Project Proposal",
        prompt: "Write a professional project proposal for a client who needs a new e-commerce website.",
        tags: ["Proposal", "Sales"]
      },
      { 
        title: "Follow-up Email",
        prompt: "Draft a follow-up email to a client who hasn't responded in two weeks about a project proposal.",
        tags: ["Email", "Client"]
      },
      {
        title: "Client Onboarding",
        prompt: "Create a client onboarding questionnaire for new web design clients to gather all necessary project information.",
        tags: ["Onboarding", "Process"]
      },
    ]
  },
  {
    icon: FileText,
    name: "Content Creation",
    color: "bg-gradient-to-r from-pink-500 to-rose-500",
    prompts: [
      { 
        title: "Blog Post Ideas",
        prompt: "Generate 10 SEO-friendly blog post ideas for a web development agency targeting small businesses.",
        tags: ["Marketing", "SEO"]
      },
      { 
        title: "Portfolio Description",
        prompt: "Write a compelling description of a web design project for my portfolio. The project was a restaurant website with online ordering capabilities.",
        tags: ["Portfolio", "Marketing"]
      },
      {
        title: "About Me Page",
        prompt: "Help me write a professional 'About Me' page for my freelance website that showcases my skills and personality.",
        tags: ["Branding", "Website"]
      },
    ]
  },
  {
    icon: Code,
    name: "Development",
    color: "bg-gradient-to-r from-violet-500 to-purple-500",
    prompts: [
      { 
        title: "Code Review Checklist",
        prompt: "Create a comprehensive code review checklist for web application projects.",
        tags: ["Development", "Quality"]
      },
      { 
        title: "Project Structure",
        prompt: "Recommend a file and folder structure for a React-based SaaS application.",
        tags: ["Architecture", "Organization"]
      },
      {
        title: "Development Best Practices",
        prompt: "What are the current best practices for responsive web design in 2024?",
        tags: ["Best Practices", "Design"]
      },
    ]
  },
  {
    icon: Lightbulb,
    name: "Marketing & Growth",
    color: "bg-gradient-to-r from-amber-500 to-orange-500",
    prompts: [
      { 
        title: "Social Media Strategy",
        prompt: "Develop a monthly social media posting strategy for my design studio to attract more clients.",
        tags: ["Social Media", "Marketing"]
      },
      { 
        title: "Cold Email Template",
        prompt: "Write a cold email template to reach out to potential clients in the finance industry for web development services.",
        tags: ["Email", "Lead Gen"]
      },
      {
        title: "Client Testimonials",
        prompt: "Create a list of questions I can ask clients to get detailed testimonials about my services.",
        tags: ["Reviews", "Marketing"]
      },
    ]
  }
];
