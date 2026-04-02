"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const springConfig = { damping: 20, stiffness: 300 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center",
        containerClassName
      )}
      style={{
        perspective: "1000px",
      }}
    >
      <motion.div
        style={{
          rotateX: isHovered ? rotateXSpring : 0,
          rotateY: isHovered ? rotateYSpring : 0,
          transformStyle: "preserve-3d",
        }}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-full w-full transform transition-all",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardItem = ({
  as: Component = "div",
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  ...rest
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
}) => {
  return (
    <Component
      className={cn("w-fit", className)}
      style={{
        transform: `translateX(${translateX}) translateY(${translateY}) translateZ(${translateZ}) rotateX(${rotateX}) rotateY(${rotateY}) rotateZ(${rotateZ})`,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};
