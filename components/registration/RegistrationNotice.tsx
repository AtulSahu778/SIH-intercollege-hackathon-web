"use client";

import { Info, Users, UserCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { VALIDATION } from "@/lib/constants";

export default function RegistrationNotice() {
  const rules = [
    {
      icon: UserCheck,
      text: "Only the Team Leader should complete this registration.",
      color: "text-accent-orange",
      bg: "bg-orange-50",
    },
    {
      icon: Users,
      text: `Each team must have exactly ${VALIDATION.TEAM_SIZE} members (including the leader).`,
      color: "text-accent-cyan",
      bg: "bg-cyan-50",
    },
    {
      icon: AlertCircle,
      text: `Minimum ${VALIDATION.MIN_FEMALE_MEMBERS} female members are mandatory per team.`,
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      icon: Info,
      text: "Only one registration is allowed per team. Duplicate entries will be rejected.",
      color: "text-success",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-navy-primary/10 bg-gradient-to-br from-navy-primary/5 to-navy-secondary/5 p-5 sm:p-6 mb-8"
      role="note"
      aria-label="Registration rules"
    >
      {/* Decorative left border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-orange via-accent-cyan to-violet-500 rounded-full" />

      <div className="pl-3">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-navy-primary flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-navy-primary text-sm sm:text-base">
              Before You Register
            </h2>
            <p className="text-xs text-text-muted">Please read these rules carefully</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map((rule, i) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className={`flex items-start gap-3 p-3 rounded-xl ${rule.bg}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${rule.color}`} />
                <span className="text-xs text-text-primary font-medium leading-relaxed">
                  {rule.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
