
import { Menu } from "lucide-react";
import { Button } from "./button";

interface SidebarTriggerProps {
  onClick: () => void;
}

const SidebarTrigger = ({ onClick }: SidebarTriggerProps) => {
  return (
    <Button 
      size="icon" 
      variant="ghost" 
      onClick={onClick} 
      className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/60 dark:hover:bg-gray-700/60"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default SidebarTrigger;
