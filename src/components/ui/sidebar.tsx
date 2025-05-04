import * as React from "react";
import {
  LayoutDashboard,
  BarChart2,
  CreditCard,
  Briefcase,
  Users,
  Plus,
  Settings,
  Menu,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink, useLocation } from "react-router-dom";
import { useSidebar } from "@/hooks/use-sidebar";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createContext, useContext, useState } from "react";

interface SidebarItemProps {
  Icon: React.ComponentType<any>;
  text: string;
  active: boolean;
  href: string;
  onClick?: () => void;
  isCollapsed?: boolean;
}

export function SidebarItem({ Icon, text, active, href, onClick, isCollapsed }: SidebarItemProps) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={cn(
        "group flex w-full items-center rounded-md p-3 text-sm font-medium hover:bg-brand-blue/5 hover:text-brand-blue transition-colors",
        active ? "bg-brand-blue/5 text-brand-blue" : "text-muted-foreground",
        isCollapsed ? "justify-center" : "space-x-2"
      )}
      title={isCollapsed ? text : undefined}
    >
      <Icon className="h-4 w-4" />
      {!isCollapsed && <span>{text}</span>}
    </NavLink>
  );
}

interface SidebarProps {
  children: React.ReactNode;
}

type SidebarContextType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({children}: {children: React.ReactNode}) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return (
    <SidebarContext.Provider value={{ isOpen, onOpen, onClose }}>
      {children}
    </SidebarContext.Provider>
  );
};

export function AppSidebar() {
  const { isOpen, onClose } = useSidebarContext();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const routes = [
    {
      icon: LayoutDashboard,
      text: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: BarChart2,
      text: "Analytics",
      href: "/analytics",
    },
    {
      icon: CreditCard,
      text: "Payments",
      href: "/payments",
    },
    {
      icon: Briefcase,
      text: "Portfolio",
      href: "/portfolio",
    },
    {
      icon: Users,
      text: "Clients",
      href: "/clients",
    },
    {
      icon: Settings,
      text: "Projects",
      href: "/projects",
    },
    {
      icon: UserCircle,
      text: "Team",
      href: "/team",
    },
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="w-full sm:w-60 border-r p-0">
          <SheetHeader className="pl-6 pr-4 pt-4 pb-2">
            <SheetTitle className="text-lg font-semibold">ProManage</SheetTitle>
            <SheetDescription>   
              Manage everything from one place.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {routes.map((route) => (
              <SidebarItem
                key={route.href}
                Icon={route.icon}
                text={route.text}
                href={route.href}
                active={location.pathname === route.href}
                onClick={() => onClose()}
              />
            ))}
          </div>
          <div className="mt-auto pl-6 pr-4 pt-2 pb-4">
            <Button
              variant="secondary"
              className="w-full justify-start gap-2"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span>Toggle Theme</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <aside className="fixed left-0 top-0 z-20 flex h-screen flex-col space-y-4 border-r bg-background py-4 px-3 transition-all duration-300" style={{ width: isOpen ? '240px' : '72px' }}>
        <div className="flex items-center justify-between px-3 pb-2">
          <span className="inline-flex items-center space-x-2 text-lg font-semibold transition-opacity duration-300" style={{ opacity: isOpen ? 1 : 0 }}>
            ProManage
          </span>
        </div>
        <div className="flex-1 space-y-1">
          {routes.map((route) => (
            <SidebarItem
              key={route.href}
              Icon={route.icon}
              text={route.text}
              href={route.href}
              active={location.pathname === route.href}
              isCollapsed={!isOpen}
            />
          ))}
        </div>
        <div className="mt-auto px-3 pt-2 pb-4">
          <Button
            variant="secondary"
            className={cn("w-full transition-all duration-300", isOpen ? "justify-start gap-2" : "justify-center")}
            onClick={toggleTheme}
            title={isOpen ? undefined : "Toggle Theme"}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {isOpen && <span>Toggle Theme</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}

export const Sidebar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("h-screen", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("px-3 py-2", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("mt-auto p-4", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarMenu: React.FC<React.HTMLAttributes<HTMLUListElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <ul className={cn("space-y-1", className)} {...props}>
      {children}
    </ul>
  );
};

export const SidebarMenuItem: React.FC<React.HTMLAttributes<HTMLLIElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <li className={cn("", className)} {...props}>
      {children}
    </li>
  );
};

export const SidebarMenuButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  isActive?: boolean;
}> = ({ 
  className, 
  children,
  asChild = false,
  isActive = false,
  ...props 
}) => {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp 
      className={cn(
        "flex w-full items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )} 
      {...props}
    >
      {children}
    </Comp>
  );
};

export const SidebarGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("py-2", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarGroupLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
};

export const SidebarGroupContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ 
  className, 
  children,
  ...props 
}) => {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  );
};

export { default as SidebarTrigger } from './sidebar-trigger';

export { Link } from "react-router-dom";
