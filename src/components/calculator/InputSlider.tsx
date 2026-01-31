import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface InputSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  formatValue: (value: number) => string;
  onChange: (value: number) => void;
  tooltip?: string;
}

export function InputSlider({
  label,
  value,
  min,
  max,
  step = 1,
  formatValue,
  onChange,
  tooltip,
}: InputSliderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">{label}</label>
          {tooltip && (
            <div className="group relative">
              <div className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground">
                ?
              </div>
              <div className="invisible absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover p-3 text-xs text-popover-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {tooltip}
                <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-l border-t border-border bg-popover" />
              </div>
            </div>
          )}
        </div>
        <span className="text-lg font-semibold text-primary">
          {formatValue(value)}
        </span>
      </div>
      <SliderPrimitive.Root
        className="relative flex w-full touch-none select-none items-center"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => onChange(values[0])}
      >
        <SliderPrimitive.Track className="slider-track relative h-2 w-full grow overflow-hidden rounded-full">
          <SliderPrimitive.Range className="slider-range absolute h-full" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="slider-thumb block h-5 w-5 cursor-grab rounded-full border-2 border-primary bg-card shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
