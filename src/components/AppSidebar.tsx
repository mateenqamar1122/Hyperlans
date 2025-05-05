import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BarChart2, 
  CreditCard, 
  Briefcase, 
  Settings, 
  LogOut, 
  Users,
  Folder,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Wand2,
  Brain,
  Lightbulb,
  Zap,
  SquareCode,
  FolderTree,
  ListTodo,
  Crown,
  WalletCards
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AppSidebar = ({ isOpen, setIsOpen }: AppSidebarProps) => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Add custom scrollbar styles to the document head
    const styleId = 'premium-scrollbar-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .premium-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
          background-color: transparent;
        }
        
        .premium-scrollbar::-webkit-scrollbar-track {
          background-color: transparent;
          border-radius: 10px;
          margin: 8px 0;
        }
        
        .premium-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(128, 128, 255, 0.2);
          background-image: linear-gradient(
            to bottom,
            rgba(128, 128, 255, 0.2),
            rgba(156, 128, 255, 0.3)
          );
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }
        
        .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background-image: linear-gradient(
            to bottom,
            rgba(101, 101, 255, 0.4),
            rgba(156, 128, 255, 0.5)
          );
        }
        
        .dark .premium-scrollbar::-webkit-scrollbar-thumb {
          background-image: linear-gradient(
            to bottom,
            rgba(128, 128, 255, 0.3),
            rgba(156, 128, 255, 0.4)
          );
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.2);
        }
        
        .dark .premium-scrollbar::-webkit-scrollbar-thumb:hover {
          background-image: linear-gradient(
            to bottom,
            rgba(128, 128, 255, 0.5),
            rgba(156, 128, 255, 0.6)
          );
        }

        /* For Firefox */
        .premium-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(128, 128, 255, 0.3) transparent;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const mainMenuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: BarChart2,
    },
    {
      title: "Payments",
      path: "/payments",
      icon: CreditCard,
    },
    {
      title: "Expenses", // New expenses menu item
      path: "/expenses",
      icon: WalletCards,
    },
    {
      title: "Portfolio",
      path: "/portfolio",
      icon: Briefcase,
    },
  ];
  
  const toolsMenuItems = [
    {
      title: "AI Assistant",
      path: "/ai-assistant",
      icon: Brain,
      premium: true,
    },
    {
      title: "Content Generator",
      path: "/content-generator",
      icon: Wand2,
      premium: true,
    },
    {
      title: "File Manager",
      path: "/file-manager",
      icon: FolderTree,
    },
    {
      title: "Productivity",
      path: "/productivity",
      icon: Zap,
    },
    {
      title: "Task Manager",
      path: "/task-manager",
      icon: ListTodo,
    },
    {
      title: "Code Snippets",
      path: "/code-snippets",
      icon: SquareCode,
      premium: true,
    },
  ];
  
  const secondaryMenuItems = [
    {
      title: "Clients",
      path: "/clients",
      icon: Users,
    },
    {
      title: "Projects",
      path: "/projects",
      icon: Folder,
    },
    {
      title: "Teams",
      path: "/team",
      icon: Users,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  if (isMobile && isOpen) {
    return (
      <>
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
        <SidebarContent 
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          location={location}
          toggleTheme={toggleTheme}
          theme={theme}
          mainMenuItems={mainMenuItems}
          secondaryMenuItems={secondaryMenuItems}
          toolsMenuItems={toolsMenuItems}
          
        />
      </>
    );
  }

  return (
    <SidebarContent 
      isOpen={isOpen}
      toggleSidebar={toggleSidebar}
      location={location}
      toggleTheme={toggleTheme}
      theme={theme}
      mainMenuItems={mainMenuItems}
      toolsMenuItems={toolsMenuItems}
      secondaryMenuItems={secondaryMenuItems}
    />
  );
};

interface SidebarContentProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  location: ReturnType<typeof useLocation>;
  toggleTheme: () => void;
  theme: string;
  mainMenuItems: Array<{
    title: string;
    path: string;
    icon: React.ComponentType<any>;
    premium?: boolean;
  }>;
  toolsMenuItems: Array<{
    title: string;
    path: string;
    icon: React.ComponentType<any>;
    premium?: boolean;
  }>;
  secondaryMenuItems: Array<{
    title: string;
    path: string;
    icon: React.ComponentType<any>;
    premium?: boolean;
  }>;
}

const SidebarContent = ({
  isOpen,
  toggleSidebar,
  location,
  toggleTheme,
  theme,
  mainMenuItems,
  toolsMenuItems,
  secondaryMenuItems
}: SidebarContentProps) => {
  return (
    <aside 
      className={cn(
        "fixed top-4 left-4 z-40 h-[calc(100vh-32px)] transition-all duration-300 ease-in-out rounded-xl shadow-2xl",
        isOpen ? "w-72" : "w-20",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border border-gray-100/30 dark:border-gray-800/30",
        "backdrop-saturate-150"
      )}
    >
      <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100/30 dark:border-gray-800/30">
        <Link to="/" className="flex items-center gap-3 overflow-hidden group">
          <div className={cn(
            "rounded-lg overflow-hidden shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30 transition-all duration-300 group-hover:shadow-indigo-500/40 dark:group-hover:shadow-indigo-900/50 group-hover:scale-105",
            isOpen ? "h-9 w-9" : "h-10 w-10"
          )}>
            <img src="/logo.png" alt="Logo" className="h-full w-full object-cover" />
          </div>

          <span className={cn(
            "font-semibold text-lg text-gray-800 dark:text-white transition-all duration-300 whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300",
            isOpen ? "opacity-100" : "opacity-0 w-0"
          )}>
            Hyper
            <span className="text-indigo-600 dark:text-indigo-400 ml-1 font-bold">Lans</span>
          </span>
        </Link>
        
        
        <Button 
        variant="ghost" 
        size="icon"
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200 ease-in-out"
        onClick={toggleSidebar}
        >
        {isOpen ? 
        <ChevronLeft className={cn(
        "transition-all duration-300",
        isOpen ? "h-5 w-5" : "h-6 w-6"
        )} /> : 
        <ChevronRight className={cn(
        "transition-all duration-300",
        isOpen ? "h-5 w-5" : "h-6 w-6"
        )} />
        }
        </Button>
      </div>
      
      <div className="py-5 px-3 space-y-8 overflow-y-auto max-h-[calc(100vh-60px-140px)] premium-scrollbar">
        <div>
          <div className={cn(
            "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4",
            isOpen ? "block" : "hidden"
          )}>
            Main Menu
          </div>
          <ul className="space-y-1.5">
            {mainMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    title={!isOpen ? item.title : undefined}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                      isOpen ? "justify-start" : "justify-center",
                      isActive 
                        ? "bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {isActive && (
                      <>
                        <span className="absolute inset-0 bg-[url('data:image/svg+xml;base66,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></span>
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30"></div>
                      </>
                    )}
                    <item.icon className={cn(
                      "transition-all duration-300 ease-out z-10",
                      isOpen ? "h-5 w-5" : "h-6 w-6",
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                      "group-hover:scale-110"
                    )} />
                    <span className={cn(
                      "transition-all duration-300 ml-3.5 whitespace-nowrap font-medium",
                      isOpen ? "opacity-100" : "opacity-0 w-0 ml-0"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Management section moved before Tools section */}
        <div>
          <div className={cn(
            "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-4",
            isOpen ? "block" : "hidden"
          )}>
            Management
          </div>
          <ul className="space-y-1.5">
            {secondaryMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    title={!isOpen ? item.title : undefined}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                      isOpen ? "justify-start" : "justify-center",
                      isActive 
                        ? "bg-gradient-to-r from-indigo-600/90 to-violet-600/90 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {isActive && (
                      <>
                        <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></span>
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30"></div>
                      </>
                    )}
                    <item.icon className={cn(
                      "transition-all duration-300 ease-out z-10",
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400",
                      "group-hover:scale-110"
                    )} />
                    <span className={cn(
                      "transition-all duration-300 ml-3.5 whitespace-nowrap font-medium",
                      isOpen ? "opacity-100" : "opacity-0 w-0 ml-0"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        
        <div>
          <div className={cn(
            "flex items-center justify-between",
            isOpen ? "px-4" : "px-0"
          )}>
            <div className={cn(
              "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3",
              isOpen ? "block" : "hidden"
            )}>
              Pro Tools
            </div>
            {isOpen && (
              <div className="flex items-center gap-1.5 bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-3 py-1">
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">Pro</span>
              </div>
            )}
          </div>
          <ul className="space-y-1.5">
            {toolsMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    title={!isOpen ? item.title : undefined}
                    className={cn(
                      "flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                      isOpen ? "justify-start" : "justify-center",
                      isActive 
                        ? "bg-gradient-to-r from-violet-600/90 to-purple-600/90 text-white shadow-lg shadow-violet-500/20 dark:shadow-violet-900/30" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                    )}
                  >
                    {isActive && (
                      <>
                        <span className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxNSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></span>
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30"></div>
                      </>
                    )}
                    <item.icon className={cn(
                      "transition-all duration-300 ease-out z-10",
                      isActive ? "text-white" : "text-gray-600 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400",
                      "group-hover:scale-110"
                    )} />
                    
                    {item.premium && !isOpen && (
                      <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full border border-white dark:border-gray-900 z-20"></div>
                    )}
                    
                    <div className={cn(
                      "transition-all duration-300 ml-3.5 whitespace-nowrap flex-1 flex items-center",
                      isOpen ? "opacity-100" : "opacity-0 w-0 ml-0"
                    )}>
                      <span className="font-medium">{item.title}</span>
                      {item.premium && (
                        <Crown className="h-3.5 w-3.5 text-amber-500 ml-2" />
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100/30 dark:border-gray-800/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
        <div className="space-y-2">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            className={cn(
              "w-full justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-300",
              isOpen && "justify-start"
            )}
            title={!isOpen ? (theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
          >
            {theme === "dark" ? 
              <Sun className={cn(
                "text-amber-500 transition-all duration-300",
                isOpen ? "h-5 w-5" : "h-6 w-6"
              )} /> : 
              <Moon className={cn(
                "text-indigo-600 dark:text-indigo-400 transition-all duration-300",
                isOpen ? "h-5 w-5" : "h-6 w-6"
              )} />
            }
            <span className={cn(
              "transition-all duration-300 ml-3",
              isOpen ? "opacity-100" : "opacity-0 w-0 ml-0"
            )}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </Button>
          
          <Link to="/">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-lg transition-all duration-300",
                isOpen && "justify-start"
              )}
              title={!isOpen ? "Logout" : undefined}
            >
              <LogOut className={cn(
                "transition-all duration-300",
                isOpen ? "h-5 w-5" : "h-6 w-6"
              )} />
              <span className={cn(
                "transition-all duration-300 ml-3",
                isOpen ? "opacity-100" : "opacity-0 w-0 ml-0"
              )}>
                Logout
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;