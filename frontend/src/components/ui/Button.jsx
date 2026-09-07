import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default: "btn-pill-base btn-pill-primary",
  destructive: "btn-pill-base btn-pill-security",
  outline: "btn-pill-base btn-pill-secondary",
  secondary: "btn-pill-base btn-pill-secondary",
  ghost: "btn-pill-base btn-pill-icon",
  link: "text-[#818cf8] underline-offset-4 hover:underline text-xs font-medium",
  neon: "btn-pill-base btn-pill-primary",
  "neon-purple": "btn-pill-base btn-pill-primary",
};

const sizeVariants = {
  default: "!h-9 !px-4 text-xs",
  sm: "!h-8 !px-3 text-xs",
  lg: "!h-10 !px-5 text-sm",
  icon: "!h-8 !w-8 !p-0",
  "icon-sm": "!h-7 !w-7 !p-0",
  "icon-xs": "!h-6 !w-6 !p-0",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
