"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import pmBanner from "@/app/images/sih2025-slider-banner-PM-Banner2.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
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
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
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
            <motion.div variants={itemVariants} className="w-full max-w-5xl mx-auto mb-8 sm:mb-10 rounded-3xl overflow-hidden shadow-2xl relative group">
               <Image priority src={pmBanner} alt="Smart India Hackathon PM Banner" className="w-full h-auto object-contain transform group-hover:scale-105 transition-transform duration-700" />
            </motion.div>

            {/* Top badge */}
            <motion.div variants={itemVariants} className="flex items-center justify-center mb-6">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-md text-xs sm:text-sm font-medium text-white/90 shadow-lg text-center max-w-full">
                <span className="font-semibold text-white">St. Xavier&apos;s College, Ranchi</span>
                <span className="text-white/60 font-normal">presents</span>
                <span className="font-extrabold text-accent-orange">Internal SIH 2026</span>
                <span className="text-white/60 font-normal">in association with</span>
                <span className="font-semibold text-amber-300 bg-white/10 px-2 py-0.5 rounded-md">IQAC</span>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.15] sm:leading-[1.05] tracking-tight"
            >
              Internal{" "}
              <span className="text-gradient block">Smart India</span>
              <span className="text-white">Hackathon 2026</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mx-auto"
            >
              Showcase your innovation. Represent your college.{" "}
              <br className="hidden sm:block" />
              Build solutions that solve real-world problems and earn your spot at{" "}
              <span className="text-white/90 font-semibold">Smart India Hackathon 2026</span>.
            </motion.p>

            {/* Stats mini bar */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-6 mt-8"
            >
              {[
                { value: "48", label: "Hour Hackathon" },
                { value: "6", label: "Members/Team" },
                { value: "SIH", label: "Nomination Awaits" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-white/40 font-medium mt-0.5 leading-tight">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
            >
              <Button asChild size="xl" className="w-full sm:w-auto group shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                <Link href="/register">
                  Register Your Team
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl" className="w-full sm:w-auto">
                <Link href="/guidelines">
                  <BookOpen className="w-5 h-5" />
                  View Guidelines
                </Link>
              </Button>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
