
"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GlowProps {
  variant?: "bottom" | "full";
  className?: string;
}

export function Glow({ variant = "full", className }: GlowProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          "absolute inset-0 z-[-1]",
          variant === "bottom" &&
            "bg-gradient-to-b from-transparent to-primary/20 opacity-60 blur-3xl",
          variant === "full" &&
            "bg-gradient-to-br from-brand-cyan/30 via-primary/30 to-brand-blue/30 opacity-50 blur-[100px]"
        )}
      />
      <div
        className={cn(
          "absolute z-[-1] h-full w-full",
          variant === "bottom" && "bottom-0",
          variant === "full" && "inset-0"
        )}
      >
        <svg
          className="absolute bottom-0 left-0 right-0 top-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient
              id="glow-radial"
              cx="50%"
              cy="50%"
              r="50%"
              fx="50%"
              fy="50%"
            >
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#glow-radial)"
            className={cn(
              variant === "full" && "opacity-90",
              variant === "bottom" && "opacity-50"
            )}
          />
        </svg>
      </div>
    </div>
  );
}
