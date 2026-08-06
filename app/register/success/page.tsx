"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import {
  CheckCircle2, Download, Printer, Home, Copy, CalendarDays, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { COLLEGE, HACKATHON } from "@/lib/constants";

// Dynamically import jsPDF to avoid SSR issues
async function downloadPDF(teamId: string, teamName: string, ideaTitle: string) {
  const { generateAcknowledgementPDF } = await import("@/lib/pdf/generateAcknowledgement");
  generateAcknowledgementPDF({
    teamId,
    teamName,
    ideaTitle,
    department: "",
    academicYear: "",
    category: "",
    members: [],
  });
}

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  const teamId = params.get("teamId") || "SIH-2026-001";
  const teamName = params.get("teamName") || "Your Team";
  const ideaTitle = params.get("ideaTitle") || "Your Idea";

  const copyTeamId = async () => {
    await navigator.clipboard.writeText(teamId);
    toast.success("Team ID copied!", { description: teamId });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    await downloadPDF(teamId, teamName, ideaTitle);
    toast.success("Acknowledgement downloaded!");
  };

  const nextSteps = [
    "Your registration is under review by IQAC",
    "You'll receive confirmation at your registered email",
    "Watch for hackathon schedule and venue details",
    "Shortlisted teams will be announced after evaluation",
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
        >
          {/* Top gradient */}
          <div className="bg-gradient-to-br from-navy-primary to-navy-secondary px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-success/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="relative flex items-center justify-center w-20 h-20 mx-auto mb-6"
            >
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" style={{ animationDuration: "2s" }} />
              <div className="absolute inset-0 rounded-full bg-success/10 scale-125" />
              <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center shadow-xl shadow-success/30">
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-2xl sm:text-3xl font-black text-white mb-2"
            >
              Registration Successful! 🎉
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto"
            >
              Your team has been registered for the{" "}
              <span className="text-white/90 font-semibold">{HACKATHON.name}</span> at{" "}
              {COLLEGE.shortName}.
            </motion.p>
          </div>

          {/* Team ID */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="px-8 py-6 border-b border-slate-100"
          >
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">
              Your Team ID
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 px-4 py-3 rounded-2xl bg-navy-primary/5 border border-navy-primary/10">
                <span className="text-2xl font-black text-navy-primary tracking-wider font-mono">
                  {teamId}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyTeamId}
                className="h-12 w-12 rounded-xl flex-shrink-0"
                aria-label="Copy team ID"
                title="Copy Team ID"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Save this ID. You&apos;ll need it for all future communications with IQAC.
            </p>
          </motion.div>

          {/* Team info summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="px-8 py-5 border-b border-slate-100 grid grid-cols-2 gap-4"
          >
            <div>
              <p className="text-xs text-text-muted font-medium mb-0.5">Team Name</p>
              <p className="font-bold text-text-primary text-sm">{teamName}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted font-medium mb-0.5">Idea Title</p>
              <p className="font-bold text-text-primary text-sm line-clamp-2">{ideaTitle}</p>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="px-8 py-5 border-b border-slate-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-4 h-4 text-accent-orange" />
              <h2 className="font-bold text-text-primary text-sm">What happens next?</h2>
            </div>
            <ul className="space-y-2.5">
              {nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-text-muted">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 text-accent-orange text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* SIH Motivation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mx-8 my-5 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100"
          >
            <Trophy className="w-8 h-8 text-accent-orange flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Aim for SIH 2026!</p>
              <p className="text-xs text-text-muted">
                The top-performing teams will be nominated to represent{" "}
                <strong>{COLLEGE.name}</strong> at the national Smart India Hackathon.
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="px-8 pb-8 flex flex-col sm:flex-row gap-3"
          >
            <Button
              variant="default"
              onClick={handleDownload}
              className="flex-1 gap-2"
            >
              <Download className="w-4 h-4" />
              Download Acknowledgement
            </Button>
            <Button
              variant="outline"
              onClick={handlePrint}
              className="flex-1 gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </Button>
            <Button
              variant="navy"
              onClick={() => router.push("/")}
              className="flex-1 gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </motion.div>
        </motion.div>

        {/* Confetti text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-text-muted mt-6"
        >
          For queries, email{" "}
          <a href={`mailto:${COLLEGE.email}`} className="text-accent-orange hover:underline font-medium">
            {COLLEGE.email}
          </a>
        </motion.p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-accent-orange/20 border-t-accent-orange animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
