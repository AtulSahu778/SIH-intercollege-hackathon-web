"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, UserCheck, Users, UserPlus, Building, ClipboardCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const ELIGIBILITY_ITEMS = [
  {
    icon: UserCheck,
    title: "Team Leader Registers",
    description: "Only the designated team leader completes this registration form on behalf of the entire team.",
    color: "text-accent-orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-100",
  },
  {
    icon: Users,
    title: "Exactly 6 Members",
    description: "Every team must consist of exactly 6 members, including the team leader. No more, no less.",
    color: "text-accent-cyan",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-100",
  },
  {
    icon: UserPlus,
    title: "Minimum 2 Female Members",
    description: "Each team must have at least 2 female members — promoting gender-inclusive innovation.",
    color: "text-violet-500",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-100",
  },
  {
    icon: Building,
    title: "Same College (SXC Ranchi)",
    description: "All 6 team members must be currently enrolled students of St. Xavier's College, Ranchi.",
    color: "text-success",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  {
    icon: ClipboardCheck,
    title: "One Registration Per Team",
    description: "Each team can submit only one registration. Duplicate registrations will be rejected.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
];

type EligibilityItemType = (typeof ELIGIBILITY_ITEMS)[number];

// Extracted into its own component so useRef/useInView are called at the component
// level — not inside a .map() callback, which violates the Rules of Hooks.
function EligibilityItem({ item, index }: { item: EligibilityItemType; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = item.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      className={`flex items-start gap-4 p-4 rounded-2xl border ${item.bgColor} ${item.borderColor} group hover:shadow-sm transition-shadow duration-200`}
      role="listitem"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${item.color}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
          <div className="ml-auto flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-success/15 border border-success/30 flex items-center justify-center">
              <Check className="w-3 h-3 text-success" strokeWidth={3} />
            </div>
          </div>
        </div>
        <p className="text-xs text-text-muted mt-1 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function EligibilitySection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-80px" });

  return (
    <section className="py-16 lg:py-28 bg-white" aria-labelledby="eligibility-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Header */}
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, x: -30 }}
            animate={isHeaderInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold text-accent-orange mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-orange" />
              Eligibility Criteria
            </div>
            <h2 id="eligibility-heading" className="text-2xl sm:text-4xl font-black text-text-primary leading-tight">
              Who can{" "}
              <span className="text-gradient">participate?</span>
            </h2>
            <p className="mt-3 text-xs sm:text-base text-text-muted leading-relaxed">
              The Internal SIH 2026 is open to all students of St. Xavier&apos;s College, Ranchi.
              Please read the eligibility rules carefully before registering.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  Register Now <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/guidelines">
                  Read Full Guidelines
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right — Checklist */}
          <div className="space-y-4">
            {ELIGIBILITY_ITEMS.map((item, index) => (
              <EligibilityItem key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
