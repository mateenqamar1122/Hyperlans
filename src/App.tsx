
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/contexts/AuthContext";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Payments from "./pages/Payments";
import Clients from "./pages/Clients";
import Projects from "./pages/Projects";
import TeamManager from "./pages/TeamManager";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AppLayout from "./layouts/AppLayout";
import LandingLayout from "./layouts/LandingLayout";
// import PortfolioGenerator from "./pages/PortfolioGenerator";
import Portfolio from "./pages/Portfolio";
import PortfolioPreview from "./pages/PortfolioPreview";
import AIAssistant from "./pages/tools/AIAssistant";
import ContentGenerator from "./pages/tools/ContentGenerator";
import FileManager from "./pages/tools/FileManager";
import FileShare from "./pages/FileShare";
import Productivity from "./pages/tools/Productivity";
import CodeSnippets from "./pages/tools/CodeSnippets";
import TaskManager from "./pages/tools/TaskManager";
import Auth from "./pages/Auth";
import AuthGuard from "./components/AuthGuard";
import Expenses from "./pages/Expenses";
import AcceptInvitation from "./pages/AcceptInvitation";
import Automation from "@/pages/tools/Automation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<LandingLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/accept-invitation" element={<AcceptInvitation />} />
                </Route>
                
                <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/team" element={<TeamManager />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  
                  {/* Tool Routes */}
                  <Route path="/ai-assistant" element={<AIAssistant />} />
                  <Route path="/content-generator" element={<ContentGenerator />} />
                  <Route path="/file-manager" element={<FileManager />} />
                  <Route path="/productivity" element={<Productivity />} />
                  <Route path="/code-snippets" element={<CodeSnippets />} />
                  <Route path="/task-manager" element={<TaskManager />} />
                  <Route path="/automation" element={<Automation />} />
                </Route>
                
                {/* Public Routes */}
                <Route path="/portfolio-preview" element={<PortfolioPreview />} />

                {/* <Route path="/accept-invitation" element={<AcceptInvitation />} /> */}
                <Route path="/portfolio-preview/:id" element={<PortfolioPreview />} />
                <Route path="/file-share/:token" element={<FileShare />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
