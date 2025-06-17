import React from "react";
import { cn } from "@/lib/utils"; // se estiver usando shadcn, você já deve ter o helper `cn` disponível

export function LoadingSpinner({ size = "md", className = "" }) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-20 w-20",
    };

    return (
        <div
            role="status"
            aria-label="Loading"
            className={cn(
                "animate-spin rounded-full border-t-4 border-emerald-500 border-solid",
                sizeClasses[size],
                className
            )}
        />
    );
}
