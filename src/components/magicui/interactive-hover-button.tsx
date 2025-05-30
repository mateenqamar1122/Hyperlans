import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <div className="flex justify-center items-center">
      <Link to="/auth">
        <button
          ref={ref}
          className={cn(
            "group relative w-auto cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold transition-all duration-300",
            "hover:border-primary/50 dark:hover:border-primary/50",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 transition-all duration-300 group-hover:scale-[100.8]"></div>
            <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
              {children}
            </span>
          </div>
          <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white dark:text-white opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
            <span>{children}</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </button>
      </Link>
    </div>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
