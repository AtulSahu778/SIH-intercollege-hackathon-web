"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import processFlowImage from "@/app/images/SIH26_Process_Flow.png";

export default function TimelineSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="py-16 lg:py-28 bg-navy-primary relative overflow-hidden" aria-labelledby="timeline-heading">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Event Timeline
          </div>
          <h2 id="timeline-heading" className="text-3xl sm:text-4xl font-black text-white leading-tight">
            Your journey from{" "}
            <span className="text-white">idea to SIH</span>
          </h2>
          <p className="mt-4 text-white/50 leading-relaxed">
            Five milestones. One destination — representing St. Xavier's College, Ranchi at the national stage.
          </p>
        </motion.div>

        {/* Timeline Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white"
        >
          <Image 
            src={processFlowImage} 
            alt="SIH 2026 Process Flow" 
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
}
