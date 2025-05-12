
import { Outlet } from "react-router-dom";
import LandingNavbar from "@/components/LandingNavbar";
// import Cursor from "@/components/ui/cursor";

const LandingLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <Cursor /> */}
      <LandingNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
    
  );
};

export default LandingLayout;
