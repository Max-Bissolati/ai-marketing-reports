"use client";

import React, { useEffect, useRef } from "react";

/**
 * SVG Filters Component
 *
 * Contains SVG filter definitions for frosted glass effects.
 * This component injects SVG filters into the document that can be
 * referenced via CSS backdrop-filter: url(#frosted)
 *
 * The frosted glass effect uses:
 * - feImage: A noise texture for displacement
 * - feGaussianBlur: Blurs the source content
 * - feDisplacementMap: Creates the frosted distortion effect
 */

// Base64 encoded noise image for the displacement map
// This is a simple noise texture that creates the frosted glass distortion
const NOISE_IMAGE_BASE64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEUAAAD///////////////////////////////////////////8AAAAAAACN1ZUCAAAAA3RSTlMAgJ/B0h/SawAAAAFiS0dEAIgFHUgAAAAJcEhZcwAAAEgAAABIAEbJaz4AAADTSURBVEjH7dTLDoMgEEVR2wxxuwU01/7fbFsQKEr6I2J2Zv1+YGBggYH5V1ZmPlQFrsSvKNf4JcCvqH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/CPgv6h94/wj4L+ofeP8I+C/qH3j/A/JdOQMAfTU4FYUAAAAASUVORK5CYII=`;

interface SvgFiltersProps {
    /** Whether to enable hover animations on the displacement map */
    enableAnimations?: boolean;
}

export function SvgFilters({ enableAnimations = true }: SvgFiltersProps) {
    const filterRef = useRef<SVGFEDisplacementMapElement>(null);

    // Handle hover animations via JavaScript for better React integration
    useEffect(() => {
        if (!enableAnimations) return;

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.closest) {
                const glassElement = target.closest("[data-glass-hover]");
                if (glassElement && filterRef.current) {
                    filterRef.current.setAttribute("scale", "0.5");
                }
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target && target.closest) {
                const glassElement = target.closest("[data-glass-hover]");
                if (glassElement && filterRef.current) {
                    filterRef.current.setAttribute("scale", "0.3");
                }
            }
        };

        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, [enableAnimations]);

    return (
        <svg
            style={{
                position: "absolute",
                width: 0,
                height: 0,
                overflow: "hidden",
                pointerEvents: "none",
            }}
            aria-hidden="true"
        >
            <defs>
                {/* Main frosted glass filter */}
                <filter id="frosted" primitiveUnits="objectBoundingBox">
                    {/* Noise texture for displacement */}
                    <feImage
                        href={NOISE_IMAGE_BASE64}
                        x="0"
                        y="0"
                        width="1"
                        height="1"
                        result="map"
                        preserveAspectRatio="none"
                    />
                    {/* Blur the source content - subtle blur for iOS-style frosted effect */}
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.008" result="blur" />
                    {/* Apply displacement for frosted effect - reduced for subtlety */}
                    <feDisplacementMap
                        ref={filterRef}
                        in="blur"
                        in2="map"
                        scale="0.3"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>

                {/* Alternative lighter frosted effect */}
                <filter id="frosted-light" primitiveUnits="objectBoundingBox">
                    <feImage
                        href={NOISE_IMAGE_BASE64}
                        x="0"
                        y="0"
                        width="1"
                        height="1"
                        result="map"
                        preserveAspectRatio="none"
                    />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.005" result="blur" />
                    <feDisplacementMap
                        in="blur"
                        in2="map"
                        scale="0.2"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>

                {/* Heavy frosted effect for more privacy */}
                <filter id="frosted-heavy" primitiveUnits="objectBoundingBox">
                    <feImage
                        href={NOISE_IMAGE_BASE64}
                        x="0"
                        y="0"
                        width="1"
                        height="1"
                        result="map"
                        preserveAspectRatio="none"
                    />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.015" result="blur" />
                    <feDisplacementMap
                        in="blur"
                        in2="map"
                        scale="0.5"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </defs>
        </svg>
    );
}

export default SvgFilters;
