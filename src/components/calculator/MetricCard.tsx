import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { AnimatedValue } from "./AnimatedValue";

interface MetricCardProps {
  title: string;
  value: number;
  formatter: (value: number) => string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "success" | "accent";
  className?: string;
  decimals?: number;
}

export function MetricCard({
  title,
  value,
  formatter,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
  decimals = 0,
}: MetricCardProps) {
  const variants = {
    default: "bg-card border-border/50",
    primary: "bg-primary text-primary-foreground border-primary",
    success: "bg-success/10 text-success border-success/20",
    accent: "bg-accent/10 text-accent-foreground border-accent/20",
  };

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary-foreground/20 text-primary-foreground",
    success: "bg-success/20 text-success",
    accent: "bg-accent/20 text-accent",
  };

  return (
    <div
      className={cn(
        "card-elevated p-6 transition-all duration-300",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className={cn(
              "text-sm font-medium uppercase tracking-wide mb-2",
              variant === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
            )}
          >
            {title}
          </p>
          <AnimatedValue
            value={value}
            formatter={formatter}
            decimals={decimals}
            className={cn(
              "stat-highlight block",
              variant === "primary" ? "text-primary-foreground" : "",
              variant === "success" ? "text-success" : ""
            )}
          />
          {subtitle && (
            <p
              className={cn(
                "text-sm mt-2",
                variant === "primary"
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            iconVariants[variant]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
