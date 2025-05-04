
"use client";

import { Button } from "@/components/ui/button";
import { Glow } from "@/components/ui/glow";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CTAProps {
  title: string;
  description?: string;
  action: {
    text: string;
    href: string;
    variant?: "default" | "glow" | "secondary";
  };
  secondaryAction?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function CTASection({ title, description, action, secondaryAction, className }: CTAProps) {
  return (
    <section className={cn("group relative overflow-hidden py-24 sm:py-32", className)}>
      <div className="relative z-10 mx-auto flex max-w-container flex-col items-center gap-6 text-center sm:gap-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white animate-appear">
          {title}
        </h2>
        
        {description && (
          <p className="max-w-[800px] text-lg text-white/90 md:text-xl animate-appear delay-100">
            {description}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 mt-2 animate-appear delay-200">
          <Button 
            variant={action.variant || "secondary"} 
            size="lg" 
            className="rounded-full px-8 py-6 text-lg shadow-xl hover:shadow-white/20 hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link to={action.href}>{action.text}</Link>
          </Button>
          
          {secondaryAction && (
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-8 py-6 text-lg hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to={secondaryAction.href}>{secondaryAction.text}</Link>
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-white/80 mt-8 animate-appear delay-300">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="h-10 w-10 rounded-full border-2 border-white/20 bg-white/10 shadow-inner transform hover:scale-110 hover:z-10 transition-all duration-300"
              />
            ))}
          </div>
          <p className="text-sm font-medium">10,000+ freelancers already growing their business</p>
        </div>
      </div>
      
      <div className="absolute left-0 top-0 h-full w-full translate-y-[1rem] opacity-80 transition-all duration-500 ease-in-out group-hover:translate-y-[-2rem] group-hover:opacity-100">
        <Glow variant="bottom" className="animate-appear-zoom delay-300" />
      </div>
    </section>
  );
}
