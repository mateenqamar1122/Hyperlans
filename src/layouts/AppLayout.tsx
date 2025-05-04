
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-[72px] lg:ml-72' : 'ml-[72px]'}`}>
        {/* <div className="flex h-14 lg:h-[60px] items-center gap-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-4">
          <div className="lg:hidden">
            <SidebarTrigger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
          </div>
          <div className="flex-1 font-medium">Dashboard</div>
        </div> */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default AppLayout;
