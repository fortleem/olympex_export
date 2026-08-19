import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:bg-primary-deep",
        hero: "bg-primary text-primary-foreground shadow-elevated hover:-translate-y-0.5 hover:bg-primary-deep",
        accent: "bg-accent text-accent-foreground shadow-soft hover:bg-accent-deep",
        outline:
          "border border-border bg-background text-foreground hover:border-primary hover:text-primary",
        onBrand:
          "border border-primary-foreground/40 bg-primary-foreground/10 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground hover:text-primary",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-surface-2",
        ghost: "hover:bg-secondary hover:text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3.5 text-xs",
        lg: "h-12 rounded-md px-7 text-[0.95rem]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
