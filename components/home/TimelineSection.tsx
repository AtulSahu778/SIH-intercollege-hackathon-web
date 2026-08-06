"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ClipboardList, Clock, Zap, CheckCircle2, Trophy
} from "lucide-react";
import { TIMELINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardList,
  Clock,
  Zap,
  CheckCircle: CheckCircle2,
  Trophy,
};

export default function TimelineSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="py-20 lg:py-28 bg-navy-primary relative overflow-hidden" aria-labelledby="timeline-heading">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/10 text-xs font-semibold text-white/70 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
            Event Timeline
          </div>
          <h2 id="timeline-heading" className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Your journey from{" "}
            <span className="text-gradient-cyan">idea to SIH</span>
          </h2>
          <p className="mt-4 text-white/50 leading-relaxed">
            Five milestones. One destination — representing St. Xavier's College, Ranchi at the national stage.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line — desktop */}
          <div className="hidden lg:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

          <div className="space-y-8 lg:space-y-0">
            {TIMELINE.map((item, index) => {
              const Icon = ICONS[item.icon] || Zap;
              const isLeft = index % 2 === 0;
              const ref = useRef<HTMLDivElement>(null);
              const isInView = useInView(ref, { once: true, margin: "-60px" });

              return (
                <motion.div
                  key={item.id}
                  ref={ref}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
                  className={cn(
                    "relative grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0 lg:mb-16",
                    "last:mb-0"
                  )}
                >
                  {/* Left or right content placement */}
                  <div className={cn(
                    "lg:pr-12",
                    !isLeft && "lg:col-start-2 lg:pr-0 lg:pl-12"
                  )}>
                    <div className={cn(
                      "glass-light rounded-2xl border border-white/10 p-5 shadow-lg",
                      "bg-white/6 hover:bg-white/10 transition-colors duration-200",
                      isLeft ? "lg:text-right" : "lg:text-left"
                    )}>
                      <div className={cn(
                        "flex items-center gap-3 mb-3",
                        isLeft ? "lg:flex-row-reverse" : ""
                      )}>
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent-orange/15 border border-accent-orange/25 flex-shrink-0">
                          <Icon className="w-5 h-5 text-accent-orange" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-accent-orange uppercase tracking-wide">
                            Phase {item.id}
                          </div>
                          <h3 className="font-bold text-white text-base leading-tight mt-0.5">
                            {item.phase}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10">
                        <Clock className="w-3 h-3 text-accent-cyan" />
                        <span className="text-xs font-semibold text-white/70">{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Center dot — desktop only */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 top-6 items-center justify-center z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.08, duration: 0.4, ease: "backOut" }}
                      className="w-8 h-8 rounded-full bg-navy-primary border-2 border-accent-orange flex items-center justify-center shadow-lg shadow-orange-500/20"
                    >
                      <span className="text-xs font-black text-white">{item.id}</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
