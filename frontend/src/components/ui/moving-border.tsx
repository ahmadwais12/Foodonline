"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function MovingBorder({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderClassName,
  colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57"],
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  colors?: string[];
}) {
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-lg", containerClassName)}
      style={{ padding: "2px" }}
    >
      <motion.div
        className={cn(
          "absolute inset-0 z-0 rounded-lg",
          borderClassName
        )}
        style={{
          background: `conic-gradient(from 0deg, ${colors.join(", ")})`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: duration / 1000,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className={cn("relative z-10 rounded-lg bg-background", className)}>
        {children}
      </div>
    </motion.div>
  );
}

export function AnimatedGradientBorder({
  children,
  className,
  gradientClassName,
}: {
  children: React.ReactNode;
  className?: string;
  gradientClassName?: string;
}) {
  return (
    <div className={cn("group relative rounded-lg", className)}>
      <div
        className={cn(
          "absolute -inset-0.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 opacity-30 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200",
          gradientClassName
        )}
      />
      <div className="relative rounded-lg bg-background p-1">
        {children}
      </div>
    </div>
  );
}
