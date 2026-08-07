"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, X, CheckCircle2, AlertCircle, CloudUpload, Download
} from "lucide-react";
import { RegistrationSchemaType } from "@/lib/validation/registrationSchema";
import { VALIDATION, TEMPLATE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function Section4Upload() {
  const {
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useFormContext<RegistrationSchemaType>();

  const presentationFile = watch("presentationFile");

  const onDrop = useCallback(
    (acceptedFiles: File[], _rejectedFiles: unknown[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setValue("presentationFile", file, { shouldValidate: true, shouldDirty: true });
        clearErrors("presentationFile");
      }
    },
    [setValue, clearErrors]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
      "application/vnd.ms-powerpoint": [".ppt"],
    },
    maxFiles: 1,
    maxSize: VALIDATION.MAX_PDF_SIZE_BYTES,
  });

  const removeFile = () => {
    setValue("presentationFile", null, { shouldValidate: true });
  };

  const hasError = !!errors.presentationFile;

  return (
    <div className="space-y-5">
      {/* Mandatory Template Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-5 h-5 text-accent-orange" />
            </div>
            <div>
              <h3 className="font-bold text-navy-primary text-sm sm:text-base flex items-center gap-2">
                Mandatory Idea Presentation Format
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-orange text-white font-bold uppercase">Required</span>
              </h3>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                You <strong>MUST</strong> use ONLY the official SIH presentation template format (<code className="text-accent-orange font-semibold">{TEMPLATE.filename}</code>). Submissions using any other custom format will be rejected.
              </p>
            </div>
          </div>
          <a
            href={TEMPLATE.downloadUrl}
            download={TEMPLATE.filename}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-primary hover:bg-navy-secondary text-white text-xs font-semibold shadow-md transition-colors duration-200 shrink-0"
          >
            <Download className="w-4 h-4 text-accent-cyan" />
            <span>Download Official PPT Template</span>
          </a>
        </div>
      </div>

      {/* Dropzone */}
      <AnimatePresence mode="wait">
        {!presentationFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <div
              {...getRootProps()}
              className={cn(
                "relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-dashed cursor-pointer",
                "transition-all duration-200",
                isDragActive && !isDragReject
                  ? "border-accent-orange bg-orange-50 scale-[1.01]"
                  : isDragReject
                  ? "border-error bg-red-50"
                  : hasError
                  ? "border-error/50 bg-red-50/30 hover:border-error hover:bg-red-50"
                  : "border-slate-200 bg-slate-50/50 hover:border-accent-orange/50 hover:bg-orange-50/30"
              )}
              aria-label="Upload presentation file"
              role="button"
              tabIndex={0}
            >
              <input {...getInputProps()} id="presentationFile" aria-label="Presentation file upload input" />

              {/* Icon */}
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200",
                isDragActive ? "bg-accent-orange/20 scale-110" : "bg-slate-100"
              )}>
                <CloudUpload className={cn(
                  "w-8 h-8 transition-colors duration-200",
                  isDragActive ? "text-accent-orange" : "text-text-muted"
                )} />
              </div>

              {/* Text */}
              <div className="text-center">
                <p className="text-sm font-bold text-text-primary">
                  {isDragActive ? "Drop your SIH presentation file here" : "Upload Official SIH Idea Presentation"}
                </p>
                <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto leading-relaxed">
                  Drag & drop your completed <strong className="text-navy-primary">SIH Template file</strong> or{" "}
                  <span className="text-accent-orange font-semibold underline-offset-2 hover:underline">
                    browse to upload
                  </span>
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold mt-2.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Must use official SIH format (SIH2025-IDEA-Presentation-Format.pptx)</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-text-muted">
                    <FileText className="w-3 h-3 text-accent-orange" />
                    PDF / PPTX
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-text-muted">
                    <Upload className="w-3 h-3" />
                    Max {VALIDATION.MAX_PDF_SIZE_MB} MB
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* File preview */
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="flex flex-col gap-2 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/80"
          >
            <div className="flex items-center gap-4">
              {/* File icon */}
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-orange/10 flex-shrink-0">
                <FileText className="w-6 h-6 text-accent-orange" />
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary truncate">
                  {presentationFile.name}
                </p>
                <p className="text-xs text-text-muted mt-0.5">
                  {formatBytes(presentationFile.size)} · {presentationFile.name.endsWith('.pdf') ? 'PDF Document' : 'PowerPoint Presentation (.pptx)'}
                </p>
              </div>

              {/* Success icon */}
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />

              {/* Remove button */}
              <button
                type="button"
                onClick={removeFile}
                className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-100 text-text-muted hover:text-error transition-colors duration-200 flex-shrink-0"
                aria-label="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template confirmation notice */}
            <div className="text-[11px] text-emerald-800 bg-white/80 rounded-lg p-2 border border-emerald-200 flex items-center gap-1.5 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              <span>File Attached. Ensure this presentation follows the official SIH 2026 template slides before submitting.</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      <AnimatePresence>
        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-error font-medium"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.presentationFile?.message?.toString()}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Strict Requirement Callout */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold text-amber-950">Strict Formatting Rule:</strong> All presentations must strictly follow the official SIH presentation template format (<code className="font-mono text-accent-orange font-bold">{TEMPLATE.filename}</code>). Submissions using any custom or non-standard presentation structure will be rejected by the evaluation committee.
        </div>
      </div>
    </div>
  );
}

