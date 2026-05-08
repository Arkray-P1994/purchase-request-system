import * as React from "react";
import { cn } from "@/lib/utils";

interface DetailItemProps {
  label: string;
  value?: string | number;
  icon: React.ReactNode;
  className?: string;
}

export function DetailItem({ label, value, icon, className }: DetailItemProps) {
  return (
    <div className={cn("flex gap-4 group", className)}>
      <div className="p-2.5 rounded-xl bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors h-fit">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-bold text-foreground drop-shadow-sm">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}
