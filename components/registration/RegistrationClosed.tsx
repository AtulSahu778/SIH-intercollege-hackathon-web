"use client";

import { motion } from "framer-motion";
import { LockKeyhole, Home, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { COLLEGE, HACKATHON, REGISTRATION_DEADLINE } from "@/lib/constants";

const NEXT_STEPS = [
  {
    label: "Need help?",
    detail: (
      <>
        Reach out via the{" "}
        <a
          href={HACKATHON.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-navy-primary hover:underline underline-offset-2"
        >
          iSIH 2026 WhatsApp group
        </a>{" "}
        or call{" "}
        <a
          href={`tel:${COLLEGE.phone}`}
          className="font-medium text-navy-primary hover:underline underline-offset-2"
        >
          {COLLEGE.phone}
        </a>
        .
      </>
    ),
  },
];

export default function RegistrationClosed() {
  const deadlineStr = REGISTRATION_DEADLINE.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-lg mx-auto py-4"
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
          <LockKeyhole className="w-7 h-7 text-slate-500" strokeWidth={1.8} />
        </div>
      </div>

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
          Submissions are closed
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The deadline was{" "}
          <span className="font-semibold text-slate-700">{deadlineStr}</span>.
          <br />
          No further submissions will be accepted.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 mb-6" />

      {/* Next steps */}
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">
        What&apos;s next
      </p>
      <ol className="space-y-4 mb-8">
        {NEXT_STEPS.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800">{step.label}</p>
              <p className="text-sm text-slate-500 leading-relaxed">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <Button asChild size="lg" className="flex-1 rounded-xl">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Go home
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1 rounded-xl">
          <a href={HACKATHON.whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp group
          </a>
        </Button>
      </div>
    </motion.div>
  );
}
