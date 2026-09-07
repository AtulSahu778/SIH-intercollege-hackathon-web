"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Presentation, Upload, CheckCircle2, Loader2,
  Download, ArrowRight, X, ShieldCheck, CloudUpload,
  FileCheck2, ArrowLeft, AlertCircle, KeyRound, FileType2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TEMPLATE } from "@/lib/constants";
import { fileToBase64 } from "@/lib/api/appsScript";
import Link from "next/link";

// Client-side Apps Script URL — used to bypass Vercel's 4.5 MB body limit
// by calling the script directly from the browser instead of through a Next.js route.
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────
const ACCEPTED_MIME_TYPES = [
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/pdf",
];
const ACCEPTED_EXTENSIONS = [".ppt", ".pptx", ".pdf"];
const MAX_SIZE_MB = 25;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Step = "verify" | "upload" | "done" | "already-submitted";

interface VerifyResult {
  teamName: string;
  teamId: string;
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

function getMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "pptx") return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  if (ext === "ppt") return "application/vnd.ms-powerpoint";
  if (ext === "pdf") return "application/pdf";
  return "application/octet-stream";
}

function getFileTypeLabel(file: File): string {
  const ext = file.name.toLowerCase().split(".").pop();
  if (ext === "pptx" || ext === "ppt") return "PowerPoint Presentation";
  if (ext === "pdf") return "PDF Document";
  return "Presentation File";
}

// ─────────────────────────────────────────────────────────────────────────────
// Dropzone Component
// ─────────────────────────────────────────────────────────────────────────────
function FileDropzone({
  file,
  onFile,
  onClear,
}: {
  file: File | null;
  onFile: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validate = (f: File): string | null => {
    const ext = f.name.toLowerCase().split(".").pop();
    const mimeOk = ACCEPTED_MIME_TYPES.includes(f.type) || !f.type;
    const extOk = ext && ACCEPTED_EXTENSIONS.includes(`.${ext}`);

    if (!mimeOk && !extOk) {
      return "Only PPT, PPTX, or PDF files are accepted.";
    }
    if (f.size > MAX_SIZE_BYTES) {
      return `File must be under ${MAX_SIZE_MB} MB.`;
    }
    return null;
  };

  const handle = (f: File) => {
    const err = validate(f);
    if (err) {
      toast.error(err);
      return;
    }
    onFile(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handle(dropped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (file) {
    return (
      <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 transition-all duration-300">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-bold text-emerald-900 truncate">{file.name}</p>
          <p className="text-xs text-emerald-700/90 mt-0.5 leading-tight">
            {(file.size / (1024 * 1024)).toFixed(2)} MB · {getFileTypeLabel(file)} · Ready to submit
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 transition-colors flex items-center justify-center flex-shrink-0"
          title="Remove file"
          aria-label="Remove file"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={`group cursor-pointer rounded-2xl border-2 border-dashed p-5 sm:p-10 text-center transition-all duration-200 flex flex-col items-center justify-center ${
        isDragging
          ? "border-accent-orange bg-orange-50/60 scale-[1.01]"
          : "border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".ppt,.pptx,.pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handle(f);
        }}
      />
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
        <CloudUpload className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors duration-200 ${isDragging ? "text-accent-orange" : "text-slate-400 group-hover:text-navy-primary"}`} />
      </div>
      <p className="text-sm sm:text-base font-bold text-slate-800 mb-1">
        Tap to browse or drop your presentation
      </p>
      <p className="text-xs sm:text-sm text-slate-500 font-medium">
        PPT, PPTX or PDF · Maximum {MAX_SIZE_MB} MB
      </p>

      {/* Format pills */}
      <div className="flex items-center gap-1.5 mt-4">
        {[".pptx", ".ppt", ".pdf"].map((ext) => (
          <span
            key={ext}
            className="px-2.5 py-0.5 sm:py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-mono font-semibold"
          >
            {ext}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function PresentationUpload() {
  const [step, setStep] = useState<Step>("verify");
  const [teamIdInput, setTeamIdInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verified, setVerified] = useState<VerifyResult | null>(null);
  const [alreadySubmittedTeam, setAlreadySubmittedTeam] = useState<VerifyResult | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ── Verify Team ID ──────────────────────────────────────────────────────
  const handleVerify = async () => {
    const raw = teamIdInput.trim();
    if (!raw) {
      setVerifyError("Please enter your Team ID.");
      return;
    }

    const normalized = normalizeTeamId(raw);
    setTeamIdInput(normalized);

    if (!/^SIH-2026-\d{3}$/.test(normalized)) {
      setVerifyError("Format should be SIH-2026-XXX (e.g. SIH-2026-001)");
      return;
    }

    setVerifyError("");
    setIsVerifying(true);

    try {
      const res = await fetch(`/api/verify-team?teamId=${encodeURIComponent(normalized)}`);
      const data = await res.json();

      // Check if team has already submitted a presentation
      if (data.alreadyUploadedPresentation) {
        setAlreadySubmittedTeam({
          teamName: data.teamName || "Registered Team",
          teamId: normalized,
        });
        setStep("already-submitted");
        return;
      }

      if (data.success && data.exists) {
        setVerified({ teamName: data.teamName, teamId: normalized });
        setStep("upload");
      } else {
        setVerifyError(data.error || "Team ID not found in database.");
      }
    } catch {
      setVerifyError("Network error. Please check your connection.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ── Upload Presentation ──────────────────────────────────────────────────
  // We call Google Apps Script directly from the browser (bypassing the Next.js
  // API route) to avoid Vercel's 4.5 MB serverless body limit. Using
  // Content-Type: text/plain avoids a CORS preflight, making it a "simple"
  // request that Apps Script accepts and responds to with CORS headers.
  const handleUpload = async () => {
    if (!file || !verified) return;
    setIsUploading(true);
    const toastId = toast.loading("Uploading presentation…", {
      description: "This may take a moment. Please keep this window open.",
    });

    try {
      const base64 = await fileToBase64(file);
      const mimeType = getMimeType(file);

      // ── Direct-to-Apps-Script path (production / Vercel) ──────────────────
      if (APPS_SCRIPT_URL && !APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
        const TIMEOUT_MS = 120_000;

        const fetchPromise = fetch(APPS_SCRIPT_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "uploadPresentation",
            teamId: verified.teamId,
            base64,
            fileName: file.name,
            mimeType,
          }),
          redirect: "follow",
        }).then(async (res) => {
          const text = await res.text();
          return { ok: res.ok, text };
        });

        const timeoutPromise = new Promise<"timeout">((resolve) =>
          setTimeout(() => resolve("timeout"), TIMEOUT_MS)
        );

        toast.dismiss(toastId);
        const result = await Promise.race([fetchPromise, timeoutPromise]);

        // Timeout → treat as success (Apps Script is still processing)
        if (result === "timeout") {
          setStep("done");
          return;
        }

        // Bad HTTP / HTML error page from Apps Script
        if (!result.ok || result.text.trim().startsWith("<!DOCTYPE") || result.text.trim().startsWith("<html")) {
          console.error("Apps Script upload error:", result.text.slice(0, 200));
          toast.error("Upload failed", { description: "Server error. Please try again." });
          return;
        }

        let data: { success?: boolean; error?: string; alreadySubmitted?: boolean; alreadyUploadedPresentation?: boolean };
        try {
          data = JSON.parse(result.text);
        } catch {
          toast.error("Upload failed", { description: "Unexpected server response. Please try again." });
          return;
        }

        if (data.success) {
          setStep("done");
        } else if (data.alreadySubmitted || data.alreadyUploadedPresentation) {
          toast.error("Already Submitted", {
            description: data.error || "Your team has already uploaded a presentation. Re-uploads are not permitted.",
          });
          setAlreadySubmittedTeam({ teamName: verified.teamName, teamId: verified.teamId });
          setStep("already-submitted");
        } else {
          toast.error("Upload failed", {
            description: data.error || "Please try again or contact management.",
          });
        }
        return;
      }

      // ── Fallback: API route (dev / mock mode when URL not configured) ──────
      const res = await fetch("/api/upload-presentation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId: verified.teamId,
          base64,
          fileName: file.name,
          mimeType,
        }),
      });
      const data = await res.json();
      toast.dismiss(toastId);

      if (data.success) {
        setStep("done");
      } else if (data.alreadySubmitted || data.alreadyUploadedPresentation) {
        toast.error("Already Submitted", {
          description: data.error || "Your team has already uploaded a presentation. Re-uploads are not permitted.",
        });
        setAlreadySubmittedTeam({ teamName: verified.teamName, teamId: verified.teamId });
        setStep("already-submitted");
      } else {
        toast.error("Upload failed", {
          description: data.error || "Please try again or contact management.",
        });
      }
    } catch (err) {
      toast.dismiss(toastId);
      console.error("Presentation upload error:", err);
      toast.error("Upload failed", { description: "Network error. Please check your connection and try again." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto w-full">
      {/* Step Indicator Header */}
      {step !== "done" && step !== "already-submitted" && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 mb-6 sm:mb-8 px-1">
          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full transition-colors duration-200 ${
            step === "verify" ? "bg-navy-primary text-white shadow-sm" : "bg-emerald-50 text-emerald-700"
          }`}>
            {step === "upload" ? (
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0">1</span>
            )}
            <span className="whitespace-nowrap">
              <span className="inline sm:hidden">1. Team ID</span>
              <span className="hidden sm:inline">1. Enter Team ID</span>
            </span>
          </div>
          <div className="w-3 sm:w-6 h-0.5 bg-slate-200 flex-shrink-0" />
          <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-full transition-colors duration-200 ${
            step === "upload" ? "bg-navy-primary text-white shadow-sm" : "bg-slate-100 text-slate-400"
          }`}>
            <span className={`w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0 ${
              step === "upload" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
            }`}>2</span>
            <span className="whitespace-nowrap">
              <span className="inline sm:hidden">2. Upload PPT</span>
              <span className="hidden sm:inline">2. Upload Presentation</span>
            </span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Enter Team ID & Download Template ── */}
        {step === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5 sm:space-y-4"
          >
            {/* Download Template Strip */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-orange-50 text-accent-orange flex items-center justify-center flex-shrink-0">
                  <FileType2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                    Official SIH Presentation Template
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 leading-snug">
                    Download, fill in your idea, and upload as PPT or PDF
                  </p>
                </div>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-xl font-bold text-xs sm:text-sm shrink-0 w-full sm:w-auto h-10 sm:h-9 hover:bg-slate-50">
                <a href={TEMPLATE.downloadUrl} download>
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                  Download Template
                </a>
              </Button>
            </div>

            {/* Team Verification Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-md">
              <div className="text-center mb-5 sm:mb-6">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-navy-primary/5 text-navy-primary flex items-center justify-center mx-auto mb-2.5 sm:mb-3">
                  <KeyRound className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold sm:font-black text-slate-900">
                  Enter Your SIH Team ID
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 sm:mt-1.5 max-w-sm mx-auto">
                  Enter the unique Team ID assigned during your registration
                </p>
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="text"
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
                    className={`w-full px-4 py-3 sm:py-3.5 rounded-xl border text-center text-base sm:text-lg font-mono font-bold tracking-wider transition-all duration-200 outline-none focus:ring-2 focus:ring-navy-primary/15 ${
                      verifyError
                        ? "border-red-300 bg-red-50/50 text-red-900 focus:border-red-400"
                        : "border-slate-200 bg-slate-50/50 text-slate-900 focus:border-navy-primary focus:bg-white"
                    }`}
                  />
                </div>

                {verifyError && (
                  <p className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-red-600 font-medium text-center px-1">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {verifyError}
                  </p>
                )}

                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={isVerifying || !teamIdInput.trim()}
                  size="lg"
                  className="w-full h-12 rounded-xl bg-navy-primary hover:bg-navy-secondary text-white font-bold shadow-md shadow-navy-primary/10 disabled:opacity-50 transition-all duration-200 text-sm sm:text-base"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Verifying Team ID…
                    </>
                  ) : (
                    <>
                      Verify &amp; Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Upload Presentation ── */}
        {step === "upload" && verified && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5 sm:space-y-4"
          >
            {/* Verified Team Pill */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-semibold leading-none">Verified Team</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 truncate mt-1">
                    {verified.teamName} <span className="font-mono text-xs sm:text-sm font-normal text-slate-500">({verified.teamId})</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep("verify");
                  setFile(null);
                }}
                className="text-xs sm:text-sm text-slate-500 hover:text-navy-primary font-semibold px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
              >
                Change
              </button>
            </div>

            {/* Upload Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-md space-y-4 sm:space-y-5">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                  Upload SIH Idea Presentation
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Upload your completed presentation using the official SIH template. Accepted formats: <span className="font-mono font-semibold text-slate-700">PPT, PPTX, PDF</span> (max {MAX_SIZE_MB} MB).
                </p>
              </div>

              <FileDropzone file={file} onFile={setFile} onClear={() => setFile(null)} />

              {/* Important notice */}
              <div className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                  <strong className="font-semibold text-amber-950">One-time submission:</strong> Re-uploading or modifying presentations after submission is locked to maintain contest integrity.
                </p>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep("verify")}
                  className="rounded-xl px-3.5 sm:px-5 font-semibold text-slate-600 h-12 text-sm sm:text-base flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 sm:mr-1.5" />
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  size="lg"
                  className="flex-1 h-12 rounded-xl bg-accent-orange hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 transition-all duration-200 text-sm sm:text-base"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1.5 sm:mr-2" />
                      Submit Presentation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── LOCKED STATE: Presentation Already Submitted ── */}
        {step === "already-submitted" && alreadySubmittedTeam && (
          <motion.div
            key="already-submitted"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl sm:rounded-3xl border border-amber-200 p-6 sm:p-10 text-center shadow-lg space-y-5"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto text-amber-600">
              <Lock className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                Submission Locked
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Presentation Already Submitted
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 max-w-md mx-auto text-left">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Submitted For</p>
              <p className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{alreadySubmittedTeam.teamName}</p>
              <p className="text-xs sm:text-sm font-mono text-slate-600 mt-0.5">Team ID: {alreadySubmittedTeam.teamId}</p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
              Your presentation file has already been safely uploaded to Google Drive and recorded in the evaluation database.
              To maintain the integrity of the evaluation process, <strong>teams are not permitted to re-upload or overwrite existing submissions</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAlreadySubmittedTeam(null);
                  setTeamIdInput("");
                  setVerifyError("");
                  setStep("verify");
                }}
                className="w-full sm:w-auto h-11 sm:h-12 rounded-xl font-semibold text-sm sm:text-base"
              >
                Check Another Team ID
              </Button>

              <Button asChild className="w-full sm:w-auto h-11 sm:h-12 rounded-xl bg-navy-primary hover:bg-navy-secondary text-white font-bold px-6 text-sm sm:text-base">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Success Confirmation ── */}
        {step === "done" && verified && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-12 text-center shadow-lg"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3.5 sm:mb-4">
              <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
              Presentation Submitted!
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-md mx-auto leading-relaxed mb-5 sm:mb-6">
              The SIH presentation for team{" "}
              <strong className="text-slate-900">{verified.teamName}</strong> (
              <span className="font-mono font-semibold text-slate-800">{verified.teamId}</span>
              ) has been securely saved to Google Drive and recorded in our system.
            </p>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs sm:text-sm font-semibold mb-6 sm:mb-8">
              <Presentation className="w-3.5 h-3.5 text-emerald-600" />
              Recorded on {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>

            <div>
              <Button asChild size="lg" className="w-full sm:w-auto h-12 rounded-xl bg-navy-primary hover:bg-navy-secondary text-white font-bold px-8 text-sm sm:text-base">
                <Link href="/">
                  Return to Home
                </Link>
              </Button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
