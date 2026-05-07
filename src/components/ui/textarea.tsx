import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & { autoGrow?: boolean }
>(({ className, autoGrow, ...props }, ref) => {
  const innerRef = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current!);

  const adjustHeight = () => {
    const textarea = innerRef.current;
    if (textarea && autoGrow) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    if (autoGrow) {
      adjustHeight();
    }
  }, [props.value, autoGrow]);

  return (
    <textarea
      className={cn(
        "flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none",
        autoGrow && "overflow-hidden",
        className
      )}
      ref={innerRef}
      onChange={(e) => {
        adjustHeight();
        props.onChange?.(e);
      }}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
