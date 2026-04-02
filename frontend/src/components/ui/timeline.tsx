"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative pl-8 pb-12 last:pb-0"
          >
            {/* Timeline line */}
            {index !== data.length - 1 && (
              <div className="absolute left-[11px] top-8 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5">
              <motion.div
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center",
                  "bg-background border-primary"
                )}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <div className="text-muted-foreground">{item.content}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export const TimelineModern = ({ data }: { data: TimelineEntry[] }) => {
  return (
    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />
      
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={cn(
            "relative mb-8 md:mb-0 md:grid md:grid-cols-2 md:gap-8",
            index % 2 === 0 ? "md:text-right" : "md:text-left"
          )}
        >
          {/* Dot */}
          <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
            <motion.div
              className="h-4 w-4 rounded-full bg-primary ring-4 ring-background"
              whileHover={{ scale: 1.5 }}
            />
          </div>

          {/* Content */}
          <div className={cn(
            "pl-12 md:pl-0",
            index % 2 === 0 ? "md:pr-12 md:col-start-1" : "md:pl-12 md:col-start-2"
          )}>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <div className="text-muted-foreground">{item.content}</div>
          </div>

          {/* Empty space for alternating layout */}
          <div className={cn(
            "hidden md:block",
            index % 2 === 0 ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
          )} />
        </motion.div>
      ))}
    </div>
  );
};
