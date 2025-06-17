// src/components/ui/button.jsx
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Base styles comuns a todos os botões
const baseButton =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 " +
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] " +
    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

// Variantes de aparência e tamanho do botão
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    {
      variants: {
        variant: {
          default:
              "bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:ring-primary/50",
          destructive:
              "bg-destructive text-destructive-foreground shadow hover:bg-destructive/90 focus-visible:ring-destructive/50",
          outline:
              "border border-gray-300 bg-background text-gray-700 hover:bg-gray-100",
          secondary:
              "bg-secondary text-secondary-foreground shadow hover:bg-secondary/80",
          ghost:
              "bg-transparent hover:bg-accent hover:text-accent-foreground",
          link:
              "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-9 px-4 py-2",
          sm: "h-8 px-3 py-1.5 text-sm",
          lg: "h-10 px-6 py-3 text-lg",
          icon: "h-9 w-9 p-2",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
      <Comp
          data-slot="button"
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
      />
  );
}

export { Button, buttonVariants };
