"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/**
 * Glass Component
 *
 * A reusable frosted glass component that uses SVG filters for a sophisticated
 * glassmorphism effect. Supports different shapes, sizes, and hover animations.
 *
 * @example
 * // Basic circle glass
 * <Glass shape="circle" size="md">
 *   <p>Content inside glass</p>
 * </Glass>
 *
 * @example
 * // Rectangle glass with custom dimensions
 * <Glass shape="rectangle" className="w-80 h-40">
 *   <h2>Title</h2>
 * </Glass>
 *
 * @example
 * // With hover animation disabled
 * <Glass hoverAnimation={false}>
 *   Static glass content
 * </Glass>
 */

export type GlassShape = "circle" | "rectangle" | "pill";
export type GlassSize = "sm" | "md" | "lg" | "xl" | "full";
export type GlassVariant = "default" | "light" | "heavy";

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Shape of the glass element */
    shape?: GlassShape;
    /** Preset size (only applies to circle shape) */
    size?: GlassSize;
    /** Glass effect variant */
    variant?: GlassVariant;
    /** Enable hover animation on the displacement map */
    hoverAnimation?: boolean;
    /** Custom width (overrides size prop) */
    width?: string | number;
    /** Custom height (overrides size prop) */
    height?: string | number;
    /** Children to render inside the glass */
    children?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** Whether to center content */
    centerContent?: boolean;
}

const sizeMap: Record<GlassSize, string> = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-80 h-80",
    xl: "w-96 h-96",
    full: "w-full h-full",
};

const variantFilterMap: Record<GlassVariant, string> = {
    default: "url(#frosted)",
    light: "url(#frosted-light)",
    heavy: "url(#frosted-heavy)",
};

export function Glass({
    shape = "circle",
    size = "md",
    variant = "default",
    hoverAnimation = true,
    width,
    height,
    children,
    className,
    centerContent = true,
    style,
    ...props
}: GlassProps) {
    const glassRef = useRef<HTMLDivElement>(null);

    // Handle hover animation by dispatching custom events
    const handleMouseEnter = useCallback(() => {
        if (!hoverAnimation) return;
        // The animation is handled by the SvgFilters component via event delegation
    }, [hoverAnimation]);

    const handleMouseLeave = useCallback(() => {
        if (!hoverAnimation) return;
    }, [hoverAnimation]);

    // Shape-specific classes
    const shapeClasses: Record<GlassShape, string> = {
        circle: "rounded-full",
        rectangle: "rounded-3xl",
        pill: "rounded-full",
    };

    // Build inline styles for custom dimensions
    const customStyles: React.CSSProperties = {
        ...(width && { width: typeof width === "number" ? `${width}px` : width }),
        ...(height && { height: typeof height === "number" ? `${height}px` : height }),
        backdropFilter: variantFilterMap[variant],
        WebkitBackdropFilter: variantFilterMap[variant],
        ...style,
    };

    return (
        <div
            ref={glassRef}
            data-glass-hover={hoverAnimation ? "true" : undefined}
            className={cn(
                // Base glass styles - subtle frosted effect
                "glass-element",
                "relative",
                "bg-white/[0.05]",
                "border-2 border-transparent",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.3),0_8px_24px_rgba(0,0,0,0.1)]",
                "cursor-pointer",
                "outline-none",
                "transition-all duration-300 ease-out",

                // Shape
                shapeClasses[shape],

                // Size (only for circle, rectangle uses custom width/height or defaults)
                shape === "circle" && !width && !height && sizeMap[size],

                // Center content
                centerContent && "grid place-items-center",

                // Hover effects - subtle enhancement
                hoverAnimation && "hover:shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_12px_32px_rgba(0,0,0,0.15)]",
                hoverAnimation && "hover:bg-white/[0.08]",

                className
            )}
            style={customStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {/* Inner glow overlay */}
            <div
                className="absolute inset-0 rounded-inherit pointer-events-none"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)",
                    borderRadius: "inherit",
                }}
            />

            {/* Content container */}
            <div className="relative z-10">{children}</div>
        </div>
    );
}

/**
 * GlassCard - A pre-styled glass component for card-like content
 *
 * @example
 * <GlassCard title="Statistics">
 *   <p>Some stats here</p>
 * </GlassCard>
 */
interface GlassCardProps extends Omit<GlassProps, "shape" | "centerContent"> {
    title?: string;
    description?: string;
}

export function GlassCard({ title, description, children, className, ...props }: GlassCardProps) {
    return (
        <Glass
            shape="rectangle"
            className={cn("p-6", className)}
            centerContent={false}
            {...props}
        >
            {(title || description) && (
                <div className="mb-4">
                    {title && <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>}
                    {description && <p className="text-sm text-white/60">{description}</p>}
                </div>
            )}
            {children}
        </Glass>
    );
}

/**
 * GlassButton - A glass-styled button
 *
 * @example
 * <GlassButton onClick={() => console.log('clicked')}>
 *   Click me
 * </GlassButton>
 */
interface GlassButtonProps extends Omit<GlassProps, "shape" | "centerContent"> {
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export function GlassButton({
    children,
    onClick,
    disabled = false,
    type = "button",
    className,
    ...props
}: GlassButtonProps) {
    return (
        <Glass
            shape="pill"
            hoverAnimation={!disabled}
            className={cn(
                "px-6 py-3",
                !disabled && "hover:scale-105 active:scale-95",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
            centerContent
            {...props}
        >
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className="bg-transparent border-none text-white font-medium cursor-pointer focus:outline-none"
            >
                {children}
            </button>
        </Glass>
    );
}

export default Glass;
