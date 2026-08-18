"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Loader2, ArrowRight,
  ShieldCheck, AlertCircle, KeyRound,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VALIDATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Step = "verify" | "idea" | "done";

interface VerifyResult {
  teamName: string;
  teamId: string;
}

interface IdeaFormData {
  problemStatement: string;
  ideaTitle: string;
  ideaDescription: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function normalizeTeamId(input: string): string {
  let cleaned = input.trim().toUpperCase();
  if (/^\d{1,3}$/.test(cleaned)) {
    cleaned = `SIH-2026-${cleaned.padStart(3, "0")}`;
  } else if (/^SIH[-_\s]?(\d{1,3})$/.test(cleaned)) {
    const match = cleaned.match(/^SIH[-_\s]?(\d{1,3})$/);
    if (match) cleaned = `SIH-2026-${match[1].padStart(3, "0")}`;
  } else if (/^SIH[-_\s]?2026[-_\s]?(\d{1,3})$/.test(cleaned)) {
    const match = cleaned.match(/^SIH[-_\s]?2026[-_\s]?(\d{1,3})$/);
    if (match) cleaned = `SIH-2026-${match[1].padStart(3, "0")}`;
  }
  return cleaned;
}

function wordCount(text: string) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Word Counter
// ─────────────────────────────────────────────────────────────────────────────
function WordCounter({ value, max }: { value: string; max: number }) {
  const count = wordCount(value);
  const isOver = count > max;
  const nearLimit = count >= max * 0.85;

  return (
    <span
      className={cn(
        "text-[11px] font-medium transition-colors duration-300",
        isOver ? "text-red-500" : nearLimit ? "text-amber-500" : "text-slate-400"
      )}
    >
      {count} / {max}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field Error
// ─────────────────────────────────────────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1.5 text-[11px] text-red-500 font-medium mt-1.5 ml-1"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5" />
      {message}
    </motion.p>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function IdeaSubmission() {
  const [step, setStep] = useState<Step>("verify");
  const [teamIdInput, setTeamIdInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verified, setVerified] = useState<VerifyResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<IdeaFormData>({
    problemStatement: "",
    ideaTitle: "",
    ideaDescription: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<IdeaFormData>>({});

  // ── Verify Team ID ────────────────────────────────────────────────────────
  const handleVerify = async () => {
    const raw = teamIdInput.trim();
    if (!raw) {
      setVerifyError("Please enter your Team ID.");
      return;
    }
    const normalized = normalizeTeamId(raw);
    setTeamIdInput(normalized);

    if (!/^SIH-2026-\d{3}$/.test(normalized)) {
      setVerifyError("Format should be SIH-2026-XXX (e.g. 001)");
      return;
    }

    setVerifyError("");
    setIsVerifying(true);

    try {
      const res = await fetch(`/api/verify-team?teamId=${encodeURIComponent(normalized)}`);
      const data = await res.json();

      if (data.success && data.exists) {
        setVerified({ teamName: data.teamName, teamId: normalized });
        setStep("idea");
      } else {
        setVerifyError(data.error || "Team ID not found in database.");
      }
    } catch {
      setVerifyError("Network error. Please check your connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Validate Idea Form ────────────────────────────────────────────────────
  const validateForm = useCallback((): boolean => {
    const errors: Partial<IdeaFormData> = {};
    if (!form.problemStatement.trim())
      errors.problemStatement = "Problem domain is required.";
    if (!form.ideaTitle.trim())
      errors.ideaTitle = "Project title is required.";
    if (!form.ideaDescription.trim())
      errors.ideaDescription = "Description is required.";
    else if (wordCount(form.ideaDescription) > VALIDATION.MAX_DESCRIPTION_WORDS)
      errors.ideaDescription = `Limit exceeded (${VALIDATION.MAX_DESCRIPTION_WORDS} words max).`;

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [form]);

  // ── Submit Idea ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateForm() || !verified) return;
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting idea...", {
      description: "Please keep this window open.",
    });

    try {
      const res = await fetch("/api/submit-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: verified.teamId,
          problemStatement: form.problemStatement,
          ideaTitle: form.ideaTitle,
          ideaDescription: form.ideaDescription,
        }),
      });
      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        setStep("done");
      } else {
        toast.error("Submission failed", {
          description: data.error || "Please try again.",
        });
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("Something went wrong", { description: "Please try again later." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full relative z-10">
      
      {/* ── Single Unified Card ── */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-slate-100 shadow-[0_8px_40px_rgb(0,0,0,0.04)] overflow-hidden relative">
        
        {/* Subtle decorative elements inside the card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-60 pointer-events-none" />

        <div className="p-6 sm:p-10">
          <AnimatePresence mode="wait" custom={step}>
            
            {/* ── STEP 1: Enter Team ID ── */}
            {step === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-navy-primary/5 text-navy-primary mb-3">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Team Authentication
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                    Enter your assigned SIH Team ID to proceed
                  </p>
                </div>

                <div className="space-y-3.5 max-w-sm mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="e.g. SIH-2026-001"
                      value={teamIdInput}
                      onChange={(e) => {
                        setTeamIdInput(e.target.value.toUpperCase());
                        setVerifyError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-navy-primary focus:ring-2 focus:ring-navy-primary/10 text-center text-sm sm:text-base font-mono font-semibold transition-all duration-200 outline-none placeholder:text-slate-400 placeholder:font-sans placeholder:font-normal placeholder:text-xs sm:placeholder:text-sm",
                        verifyError && "border-red-300 focus:border-red-400 focus:ring-red-50 bg-red-50/40 text-red-800"
                      )}
                    />
                  </div>

                  {verifyError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }} 
                      className="flex items-center justify-center gap-1.5 text-[11px] text-red-500 font-medium text-center"
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {verifyError}
                    </motion.p>
                  )}

                  <Button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || !teamIdInput.trim()}
                    className="w-full h-11 sm:h-12 rounded-xl bg-navy-primary hover:bg-navy-secondary text-white font-semibold text-sm shadow-md shadow-navy-primary/10 disabled:opacity-50 transition-all duration-200 group"
                  >
                    {isVerifying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Verify &amp; Continue
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Idea Form ── */}
            {step === "idea" && verified && (
              <motion.div
                key="idea"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex flex-col mb-8 pb-6 border-b border-slate-100 gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      Project Details
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
                      Define your problem and proposed solution.
                    </p>
                  </div>
                  
                  {/* Verified Badge */}
                  <div className="inline-flex items-center flex-wrap gap-2 px-3.5 py-2 rounded-lg bg-navy-primary/5 border border-navy-primary/10 self-start">
                    <ShieldCheck className="w-4 h-4 text-navy-primary flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-bold text-navy-primary" title={verified.teamName}>
                      {verified.teamName}
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-500 font-medium">
                      ({verified.teamId})
                    </span>
                    <div className="w-px h-4 bg-navy-primary/20 mx-1 hidden sm:block" />
                    <button
                      type="button"
                      onClick={() => { setStep("verify"); setFormErrors({}); }}
                      className="text-xs font-semibold text-slate-500 hover:text-navy-primary transition-colors mt-1 sm:mt-0"
                    >
                      Change Team
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-5 sm:space-y-6">
                  
                  {/* Problem Domain */}
                  <div className="group">
                    <label
                      htmlFor="problemStatement"
                      className="block text-[13px] font-semibold text-slate-700 mb-2 ml-1"
                    >
                      Problem Domain <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="problemStatement"
                      type="text"
                      placeholder="e.g. Smart Automation in Agriculture"
                      value={form.problemStatement}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, problemStatement: e.target.value }));
                        if (formErrors.problemStatement) setFormErrors((fe) => ({ ...fe, problemStatement: undefined }));
                      }}
                      className={cn(
                        "w-full px-4 py-3.5 rounded-2xl bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all duration-300 text-sm outline-none placeholder:text-slate-400",
                        formErrors.problemStatement && "border-red-200 focus:border-red-300 focus:ring-red-50 bg-red-50/30"
                      )}
                    />
                    <FieldError message={formErrors.problemStatement} />
                  </div>

                  {/* Idea Title */}
                  <div className="group">
                    <label
                      htmlFor="ideaTitle"
                      className="block text-[13px] font-semibold text-slate-700 mb-2 ml-1"
                    >
                      Project Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="ideaTitle"
                      type="text"
                      placeholder="e.g. AgriBot: Autonomous Crop Monitoring"
                      value={form.ideaTitle}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, ideaTitle: e.target.value }));
                        if (formErrors.ideaTitle) setFormErrors((fe) => ({ ...fe, ideaTitle: undefined }));
                      }}
                      className={cn(
                        "w-full px-4 py-3.5 rounded-2xl bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all duration-300 text-sm outline-none placeholder:text-slate-400",
                        formErrors.ideaTitle && "border-red-200 focus:border-red-300 focus:ring-red-50 bg-red-50/30"
                      )}
                    />
                    <FieldError message={formErrors.ideaTitle} />
                  </div>

                  {/* Idea Description */}
                  <div className="group">
                    <div className="flex items-end justify-between mb-2 ml-1 mr-1">
                      <label
                        htmlFor="ideaDescription"
                        className="block text-[13px] font-semibold text-slate-700"
                      >
                        Description <span className="text-red-400">*</span>
                      </label>
                      <WordCounter value={form.ideaDescription} max={VALIDATION.MAX_DESCRIPTION_WORDS} />
                    </div>
                    <textarea
                      id="ideaDescription"
                      rows={5}
                      placeholder="Briefly describe the problem, your proposed solution, and its expected impact..."
                      value={form.ideaDescription}
                      onChange={(e) => {
                        setForm((f) => ({ ...f, ideaDescription: e.target.value }));
                        if (formErrors.ideaDescription) setFormErrors((fe) => ({ ...fe, ideaDescription: undefined }));
                      }}
                      className={cn(
                        "w-full px-4 py-3.5 rounded-2xl bg-slate-50/50 border border-transparent focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100/50 transition-all duration-300 text-sm outline-none resize-none leading-relaxed placeholder:text-slate-400",
                        formErrors.ideaDescription && "border-red-200 focus:border-red-300 focus:ring-red-50 bg-red-50/30"
                      )}
                    />
                    <FieldError message={formErrors.ideaDescription} />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xl shadow-slate-900/10 disabled:opacity-50 transition-all duration-300 group"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Submit Project Idea
                          <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                      )}
                    </Button>
                  </div>
                  
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Success ── */}
            {step === "done" && verified && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                className="text-center py-6 sm:py-10"
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-20" />
                  <div className="relative w-full h-full bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-3">
                  Submission Complete
                </h2>
                
                <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed mb-8">
                  Your project idea has been successfully recorded for team <strong className="text-slate-800 font-semibold">{verified.teamName}</strong>.
                </p>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl h-12 px-8 font-semibold text-sm border-slate-200 hover:bg-slate-50 text-slate-700 transition-all"
                >
                  <a href="/">Return to Homepage</a>
                </Button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
