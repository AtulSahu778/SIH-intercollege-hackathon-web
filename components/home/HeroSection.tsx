"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronRight, BookOpen, Zap, Star, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COLLEGE, HACKATHON } from "@/lib/constants";

const floatingCards = [
  { icon: Zap, label: "48-Hour Hackathon", color: "from-orange-500 to-orange-600", delay: 0 },
  { icon: Users, label: "6-Member Teams", color: "from-cyan-500 to-cyan-600", delay: 0.3 },
  { icon: Star, label: "SIH Nomination", color: "from-violet-500 to-violet-600", delay: 0.6 },
  { icon: Shield, label: "IQAC Certified", color: "from-emerald-500 to-emerald-600", delay: 0.9 },
];

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
      className="relative min-h-[100dvh] flex items-center overflow-hidden hero-gradient grid-pattern"
      aria-label="Hero section"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-orange/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-navy-secondary/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column — Text */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Top badge */}
            <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-xs font-semibold text-white/80 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                {COLLEGE.iqac} · {COLLEGE.shortName}
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight"
            >
              Internal{" "}
              <span className="text-gradient block">Smart India</span>
              <span className="text-white">Hackathon 2026</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="mt-6 text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Showcase your innovation. Represent your college.{" "}
              <br className="hidden sm:block" />
              Build solutions that solve real-world problems and earn your spot at{" "}
              <span className="text-white/90 font-semibold">Smart India Hackathon 2026</span>.
            </motion.p>

            {/* Stats mini bar */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-6 mt-8"
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
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mt-10"
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

          {/* Right Column — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Central circle */}
              <div className="relative mx-auto w-64 h-64 rounded-full border border-white/10 flex items-center justify-center">
                {/* Rings */}
                <div className="absolute inset-0 rounded-full border border-white/5 scale-110 animate-float" style={{ animationDuration: "6s" }} />
                <div className="absolute inset-0 rounded-full border border-white/5 scale-125" />
                <div className="absolute inset-0 rounded-full border border-white/5 scale-150" />

                {/* Center badge */}
                <div className="flex flex-col items-center justify-center glass rounded-full w-40 h-40 border border-white/20 shadow-2xl">
                  <Zap className="w-10 h-10 text-accent-orange mb-2" strokeWidth={2.5} />
                  <div className="text-xs font-black text-white tracking-widest uppercase">iSIH</div>
                  <div className="text-xs text-white/50 font-semibold">2026</div>
                </div>

                {/* Floating mini cards around the circle */}
                {floatingCards.map((card, i) => {
                  const angle = (i * 360) / floatingCards.length - 45;
                  const radian = (angle * Math.PI) / 180;
                  const radius = 145;
                  const x = Math.cos(radian) * radius;
                  const y = Math.sin(radian) * radius;
                  const Icon = card.icon;

                  return (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + card.delay, duration: 0.5, ease: "backOut" }}
                      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
                      className="absolute"
                    >
                      <div
                        className="glass rounded-2xl border border-white/15 p-3 flex flex-col items-center gap-1.5 shadow-xl cursor-default"
                        style={{ minWidth: "80px" }}
                      >
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[10px] text-white/70 font-semibold text-center leading-tight">{card.label}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          <span className="text-xs text-white/30 font-medium tracking-widest uppercase">Scroll</span>
        </motion.div>
      </div>
    </section>
  );
}
