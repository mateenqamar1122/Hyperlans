import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorColor?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "success" | "info" | "warning" | "danger" | "premium";
  animated?: boolean;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    {
      className,
      value = 0,
      indicatorColor,
      showValue = false,
      size = "md",
      variant = "default",
      animated = true,
      ...props
    },
    ref
  ) => {
    const getHeight = () => {
      switch (size) {
        case "sm":
          return "h-2";
        case "lg":
          return "h-6";
        default:
          return "h-4";
      }
    };

    const getVariantClasses = () => {
      switch (variant) {
        case "success":
          return "bg-green-500";
        case "info":
          return "bg-sky-500";
        case "warning":
          return "bg-yellow-500";
        case "danger":
          return "bg-rose-500";
        case "premium":
          return "bg-gradient-to-r from-fuchsia-500 via-indigo-500 to-cyan-500";
        default:
          return "bg-primary";
      }
    };

    const getTextSize = () => {
      return size === "lg" ? "text-sm font-semibold" : "text-xs font-medium";
    };

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted shadow-inner",
          getHeight(),
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full transition-all duration-500 ease-in-out rounded-full",
            size === "lg" && "flex items-center justify-center",
            indicatorColor || getVariantClasses()
          )}
          style={{
            transform: `translateX(-${100 - value}%)`,
            backgroundImage:
              variant === "premium" || animated
                ? "linear-gradient(135deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)"
                : undefined,
            backgroundSize: (variant === "premium" || animated) ? "1rem 1rem" : undefined,
            animation: animated ? "progress-bar-stripes 1s linear infinite" : undefined,
          }}
        >
          {showValue && size === "lg" && (
            <span className={cn("text-white drop-shadow z-10", getTextSize())}>
              {value}%
            </span>
          )}
        </ProgressPrimitive.Indicator>
        {showValue && size !== "lg" && (
          <span className={cn("absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground", getTextSize())}>
            {value}%
          </span>
        )}
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
