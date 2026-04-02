"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const AnimatedTooltip = ({
  items,
  className,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  className?: string;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("flex flex-row items-center justify-center", className)}>
      {items.map((item, idx) => (
        <div
          className="group relative -mr-4"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="absolute -left-1/2 -top-16 z-50 flex translate-x-1/2 flex-col items-center justify-center"
              >
                <div className="relative flex flex-col items-center rounded-md bg-background px-4 py-2 text-xs shadow-xl ring-1 ring-border">
                  <div className="absolute inset-x-10 -bottom-px h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                  <div className="absolute -bottom-px left-10 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                  <p className="relative z-30 text-sm font-bold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.designation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img
            onMouseMove={() => setHoveredIndex(idx)}
            src={item.image}
            alt={item.name}
            className="relative h-14 w-14 rounded-full border-2 border-white object-cover transition-all duration-500 group-hover:z-30 group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
};
