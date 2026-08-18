"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Lightbulb, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import pmBanner from "@/app/images/sih2025-slider-banner-PM-Banner2.png";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] flex items-center overflow-hidden hero-gradient"
      aria-label="Hero section"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-secondary/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 lg:py-32 w-full">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">

          {/* Content Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center flex flex-col items-center w-full"
          >
            {/* PM Banner */}
            <motion.div variants={itemVariants} className="w-full max-w-6xl mx-auto mb-8 sm:mb-10 px-2 sm:px-4">
              <div className="rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-navy-secondary/50 relative bg-black/10">
                <Image priority src={pmBanner} alt="Smart India Hackathon PM Banner" className="w-full h-auto object-contain" />
              </div>
            </motion.div>

            {/* Top badge */}
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center mb-8 px-2">
              <div className="relative inline-flex items-center justify-center">
                {/* Subtle ambient border glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-accent-orange/40 via-accent-cyan/40 to-accent-orange/40 rounded-full blur-sm opacity-50" />
                
                {/* Main Badge */}
                <div className="relative flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 px-5 sm:px-6 py-2 sm:py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-full shadow-2xl">
                  {/* Scope */}
                  <span className="text-[11px] sm:text-xs font-semibold text-white tracking-wide text-center">
                    SXC Ranchi · Open to All Departments
                  </span>
                  
                  {/* Separator (Hidden on mobile) */}
                  <span className="hidden sm:block w-px h-3.5 bg-white/20" />
                  
                  {/* Event */}
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] bg-gradient-to-r from-accent-orange to-amber-300 bg-clip-text text-transparent text-center">
                    Internal SIH 2026
                  </span>
                </div>
              </div>

              {/* Minimal Association Subtitle */}
              <div className="mt-5 flex items-center gap-3 sm:gap-4 opacity-50">
                <span className="h-px w-6 sm:w-10 bg-gradient-to-r from-transparent to-white/40" />
                <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-white uppercase">In Association with IQAC</span>
                <span className="h-px w-6 sm:w-10 bg-gradient-to-l from-transparent to-white/40" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.12] sm:leading-[1.05] tracking-tight"
            >
              Internal{" "}
              <span className="text-gradient block">Smart India</span>
              <span className="text-white">Hackathon 2026</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-4 sm:mt-6 text-sm sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto px-2"
            >
              Showcase your innovation. Represent your college.{" "}
              <br className="hidden sm:block" />
              Build solutions that solve real-world problems and earn your spot at{" "}
              <span className="text-white/90 font-semibold">Smart India Hackathon 2026</span>.
            </motion.p>

            {/* Stats mini bar */}
            <motion.div
              variants={itemVariants}
              className="flex items-start justify-between sm:justify-center gap-2 sm:gap-10 mt-8 sm:mt-12 w-full max-w-md mx-auto px-1 sm:px-0"
            >
              {[
                { value: "24", label: "Hour Hackathon" },
                { value: "6", label: "Members/Team" },
                { value: "SIH", label: "Nomination Awaits" },
              ].map((stat) => (
                <div key={stat.label} className="text-center flex-1 sm:flex-none sm:w-24">
                  <div className="text-2xl sm:text-3xl font-black text-white leading-none">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-white/40 font-medium mt-1.5 sm:mt-2 leading-tight px-1 sm:px-0">{stat.label}</div>
                </div>
              ))}
            </motion.div>


            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-4 w-full sm:w-auto"
            >
              <Button
                asChild
                size="xl"
                className="w-full sm:w-auto bg-gradient-to-r from-accent-orange via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 active:scale-98 transition-all duration-200 border border-orange-400/30"
              >
                <Link href="/submit-idea" className="flex items-center justify-center gap-2.5">
                  <Lightbulb className="w-5 h-5" />
                  <span>Submit Your Idea</span>
                </Link>
              </Button>

              <Button
                asChild
                size="xl"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 backdrop-blur-xl text-white font-semibold rounded-2xl shadow-lg shadow-navy-primary/40 hover:shadow-cyan-500/10 active:scale-98 transition-all duration-200"
              >
                <Link href="/guidelines" className="flex items-center justify-center gap-2.5">
                  <ScrollText className="w-5 h-5 text-accent-cyan" />
                  <span>View Guidelines</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
