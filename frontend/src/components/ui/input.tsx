import * as React from "react";

import { cn } from "./utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "glass-input flex h-10 w-full min-w-0 px-4 py-2 text-sm transition-all outline-none",
        "file:text-foreground placeholder:text-muted-foreground/50 selection:bg-primary/30 selection:text-white",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
