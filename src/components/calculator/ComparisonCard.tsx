import { cn } from "@/lib/utils";
import { TrendingUp, ArrowRight } from "lucide-react";
import { AnimatedValue } from "./AnimatedValue";

interface ComparisonCardProps {
  title: string;
  currentValue: number;
  projectedValue: number;
  formatter: (value: number) => string;
  improvement?: string;
  className?: string;
  decimals?: number;
}

export function ComparisonCard({
  title,
  currentValue,
  projectedValue,
  formatter,
  improvement,
  className,
  decimals = 0,
}: ComparisonCardProps) {
  return (
    <div className={cn("card-elevated p-6", className)}>
      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="flex items-center justify-between gap-4">
        {/* Current State */}
        <div className="flex-1">
          <span className="comparison-badge comparison-badge-current mb-2">
            Current
          </span>
          <AnimatedValue
            value={currentValue}
            formatter={formatter}
            decimals={decimals}
            className="text-2xl md:text-3xl font-bold text-foreground mt-2 block"
          />
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0">
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>

        {/* Projected State */}
        <div className="flex-1 text-right">
          <span className="comparison-badge comparison-badge-projected mb-2">
            <TrendingUp className="h-3.5 w-3.5" />
            Projected
          </span>
          <AnimatedValue
            value={projectedValue}
            formatter={formatter}
            decimals={decimals}
            className="text-2xl md:text-3xl font-bold text-success mt-2 block"
          />
          {improvement && (
            <p className="text-sm font-medium text-success mt-1">
              {improvement}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
