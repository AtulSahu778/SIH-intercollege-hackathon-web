"use client";

import { Info, Users, UserCheck, AlertCircle, Laptop } from "lucide-react";
import { motion } from "framer-motion";
import { VALIDATION, WHATSAPP_GROUP_URL } from "@/lib/constants";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.74.949 3.71 1.45 5.71 1.45h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.18-1.238-6.167-3.488-8.414" />
    </svg>
  );
}

export default function RegistrationNotice() {
  const rules = [
    {
      icon: Laptop,
      text: "Open to students from all departments & streams of SXC Ranchi!",
      color: "text-accent-orange",
      bg: "bg-orange-50",
    },
    {
      icon: UserCheck,
      text: "Only the Team Leader fills out this form & must share WhatsApp link with all team members.",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      text: `Each team must have exactly ${VALIDATION.TEAM_SIZE} members (1 Leader + 5 Members).`,
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
      text: "Only one registration per team. Duplicate entries will be disqualified.",
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
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

          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#128C7E] text-xs font-bold transition-colors duration-200"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366] fill-current" />
            <span>Join WhatsApp Group</span>
          </a>
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

