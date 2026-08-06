"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Globe, Award, Lightbulb, Users, Target, GraduationCap } from "lucide-react";
import { FEATURES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import processLogo from "@/app/images/hackathon-process-logo.png";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Lightbulb,
  Users,
  Target,
  GraduationCap,
  Globe,
  Award,
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  iconColor: string;
  index: number;
}

function FeatureCard({ title, description, icon, color, iconColor, index }: FeatureCardProps) {
  const Icon = ICONS[icon] ?? Lightbulb;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      className="group relative bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
      role="article"
    >
      {/* Background gradient on hover */}
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300", color)} />

      {/* Content */}
      <div className="relative">
        <div className={cn(
          "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300",
          color
        )}>
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>

        <h3 className="font-bold text-text-primary text-base mb-2 group-hover:text-navy-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-text-muted leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="py-16 lg:py-28 bg-background" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-14 flex flex-col items-center"
        >
          {/* MoE / AICTE Header Banner */}
          <div className="w-full max-w-xl sm:max-w-2xl mx-auto bg-white p-2 sm:p-3 rounded-2xl shadow-sm mb-8">
            <Image priority src={processLogo} alt="Ministry of Education & AICTE" className="w-full h-auto rounded-xl object-contain" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-accent-orange mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-orange" />
            Why Participate
          </div>
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-black text-text-primary leading-tight">
            Everything you need to{" "}
            <span className="text-gradient">innovate & excel</span>
          </h2>
          <p className="mt-4 text-text-muted leading-relaxed">
            The Internal SIH provides a complete ecosystem for student innovators — from idea to national-level recognition.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
