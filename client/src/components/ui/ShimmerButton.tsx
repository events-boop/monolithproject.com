import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href?: string;
    asChild?: boolean;
}

const ShimmerButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ShimmerButtonProps>(
    ({ className, children, href, asChild, ...props }, ref) => {

        // Core structure of the button
        const content = (
            <>
                {/* Glow effect that bleeds outside */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#E8B86D]/80 to-transparent w-[150%] -translate-x-[150%] animate-[sweep_3s_ease-in-out_infinite] blur-xl" />

                {/* The sharp beam inside the button boundary */}
                <div className="absolute inset-0 z-0 overflow-hidden rounded-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-[150%] -translate-x-[150%] animate-[sweep_3s_ease-in-out_infinite] opacity-50 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E8B86D] to-transparent w-[150%] -translate-x-[150%] animate-[sweep_3s_ease-in-out_infinite]" />
                </div>

                {/* Frosted Glass Background layer */}
                <div className="absolute inset-[1px] rounded-full bg-black/40 backdrop-blur-md z-0" />

                {/* Outer border to give physical presence */}
                <div className="absolute inset-0 rounded-full border border-white/20 z-0" />

                {/* Content */}
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </span>
            </>
        );

        const buttonClass = cn(
            "relative inline-flex items-center justify-center px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-white font-display uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 group",
            className
        );

        if (href) {
            return (
                <Link href={href} asChild>
                    <a className={buttonClass} {...(props as any)} ref={ref as any}>
                        {content}
                    </a>
                </Link>
            );
        }

        return (
            <button className={buttonClass} {...(props as any)} ref={ref as any}>
                {content}
            </button>
        );
    }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
