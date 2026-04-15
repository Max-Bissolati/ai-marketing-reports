"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface SkillCard {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string; // Tailwind color class for accent
  status: "active" | "coming-soon";
}

interface SkillCardStackProps {
  cards: SkillCard[];
}

export function SkillCardStack({ cards }: SkillCardStackProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const isHovering = hoveredIndex !== null;

  return (
    <div className="relative w-full max-w-md mx-auto h-[320px]">
      {cards.map((card, index) => {
        const isTop = index === 0;
        const stackOffset = index * 8;
        const stackScale = 1 - index * 0.04;

        // When hovering, fan cards out
        const fanAngle = isHovering ? (index - (cards.length - 1) / 2) * 8 : 0;
        const fanY = isHovering ? index * 12 : stackOffset;
        const fanX = isHovering ? (index - (cards.length - 1) / 2) * 40 : 0;
        const scale = isHovering
          ? hoveredIndex === index
            ? 1.05
            : 0.95
          : stackScale;

        return (
          <motion.div
            key={card.id}
            className="absolute inset-0"
            style={{ zIndex: cards.length - index + (hoveredIndex === index ? 10 : 0) }}
            animate={{
              y: fanY,
              x: fanX,
              scale,
              rotate: fanAngle,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {card.status === "active" ? (
              <Link href={card.href} className="block h-full">
                <CardContent card={card} isTop={isTop} isHovered={hoveredIndex === index} />
              </Link>
            ) : (
              <div className="h-full cursor-default">
                <CardContent card={card} isTop={isTop} isHovered={hoveredIndex === index} />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

function CardContent({
  card,
  isTop,
  isHovered,
}: {
  card: SkillCard;
  isTop: boolean;
  isHovered: boolean;
}) {
  return (
    <div
      className={cn(
        "h-full rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300",
        "bg-white/[0.04] backdrop-blur-[12px] border border-white/10",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        isHovered && "border-white/20 bg-white/[0.07] shadow-[0_12px_48px_rgba(0,0,0,0.4)]"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className={cn("p-3 rounded-xl border", card.color)}>
            {card.icon}
          </div>
          {card.status === "coming-soon" && (
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/10 text-muted-foreground border border-white/10 font-medium uppercase tracking-wider">
              Coming Soon
            </span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground">
            {card.title}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>

      {card.status === "active" && (
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span>Open Skill</span>
          <motion.span
            animate={{ x: isHovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            &rarr;
          </motion.span>
        </div>
      )}
    </div>
  );
}
