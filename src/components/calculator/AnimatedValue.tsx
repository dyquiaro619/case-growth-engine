import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

interface AnimatedValueProps {
  value: number;
  formatter: (value: number) => string;
  duration?: number;
  decimals?: number;
  className?: string;
}

export function AnimatedValue({
  value,
  formatter,
  duration = 400,
  decimals = 0,
  className,
}: AnimatedValueProps) {
  const animatedValue = useAnimatedNumber(value, { duration, decimals });

  return <span className={className}>{formatter(animatedValue)}</span>;
}
