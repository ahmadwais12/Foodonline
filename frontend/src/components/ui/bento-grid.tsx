"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
import { GridPattern } from "./grid-pattern";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  image,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  image?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      className={cn(
        "group/bento relative row-span-1 flex flex-col justify-between space-y-4 overflow-hidden rounded-xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:shadow-lg",
        className
      )}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      {image && (
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={typeof title === "string" ? title : "Bento item"}
            className="h-full w-full object-cover opacity-40 transition-transform duration-300 group-hover/bento:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}
      
      <div className="relative z-10">
        {header}
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
      </div>
      
      <div className="relative z-10 transition-transform duration-300 group-hover/bento:translate-x-2">
        <div className="mb-2 mt-2 font-sans text-xl font-bold text-foreground">
          {title}
        </div>
        <div className="font-sans text-sm font-normal text-muted-foreground">
          {description}
        </div>
      </div>

      <GridPattern
        width={20}
        height={20}
        x={-1}
        y={-1}
        className="absolute inset-0 z-0 stroke-primary/[0.05]"
      />
    </motion.div>
  );
};
