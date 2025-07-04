import React from "react";
import { cn } from "@/lib/utils";

export function LoadingSpinner({ size = "md", className = "", text }) {
    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-12 w-12",
        lg: "h-20 w-20",
    };

    return (
        <div className={cn("flex flex-col items-center justify-center min-h-screen gap-4", className)}>
            <div
                className={cn("rounded-full border-4 border-emerald-500 border-t-green-800 animate-spin", sizeClasses[size])}
            />
            {text && (
                <p className="text-xl text-muted-foreground outline border rounded pr-4 pl-4 border-primary text-emerald-700">{text}</p>
            )}
        </div>
    );
}
