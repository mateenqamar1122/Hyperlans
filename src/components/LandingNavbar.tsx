
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";
import { useEffect, useState } from "react";

const LandingNavbar = () => {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? "border-b shadow-md bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80" 
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative overflow-hidden rounded-lg p-1.5 bg-gradient-to-br from-primary/80 to-brand-blue transition-all duration-300 group-hover:from-brand-blue group-hover:to-primary">
  <img
    src="/logo.png"
    alt="Logo"
    className="h-6 w-6 object-contain transition-transform duration-300 group-hover:scale-110"
  />
</div>

            <span className="font-bold text-lg premium-text-gradient">HyperLans</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link 
            to="/features" 
            className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </Link>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col space-y-1.5 p-2 rounded-md hover:bg-muted/50 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-foreground transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-foreground transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Button 
                variant="outline" 
                asChild 
                className="border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                asChild 
                className="hover:bg-primary/5 transition-all duration-300"
              >
                <Link to="/auth">Log in</Link>
              </Button>
              <Button 
                asChild 
                className="bg-gradient-to-r from-brand-cyan to-brand-blue hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
              >
                <Link to="/auth">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-background/95 backdrop-blur-md border-b shadow-lg transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
        <nav className="container flex flex-col py-4 space-y-4">
          <Link 
            to="/features" 
            className="text-sm font-medium p-2 hover:bg-primary/5 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className="text-sm font-medium p-2 hover:bg-primary/5 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium p-2 hover:bg-primary/5 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-sm font-medium p-2 hover:bg-primary/5 rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          <div className="pt-2 border-t flex flex-col space-y-3">
            {user ? (
              <Button 
                variant="outline" 
                asChild 
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  asChild 
                  className="w-full justify-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/auth">Log in</Link>
                </Button>
                <Button 
                  asChild 
                  className="w-full justify-center bg-gradient-to-r from-brand-cyan to-brand-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to="/auth">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LandingNavbar;
