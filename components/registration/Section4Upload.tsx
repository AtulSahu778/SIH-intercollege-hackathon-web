"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, X, CheckCircle2, AlertCircle, CloudUpload
} from "lucide-react";
import { RegistrationSchemaType } from "@/lib/validation/registrationSchema";
import { VALIDATION } from "@/lib/constants";
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
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: VALIDATION.MAX_PDF_SIZE_BYTES,
  });

  const removeFile = () => {
    setValue("presentationFile", null, { shouldValidate: true });
  };

  const hasError = !!errors.presentationFile;

  return (
    <div className="space-y-4">
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
              aria-label="Upload PDF presentation"
              role="button"
              tabIndex={0}
            >
              <input {...getInputProps()} id="presentationFile" aria-label="PDF file upload input" />

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
                <p className="text-sm font-semibold text-text-primary">
                  {isDragActive ? "Drop your PDF here" : "Upload Idea Presentation"}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Drag & drop or{" "}
                  <span className="text-accent-orange font-semibold underline-offset-2 hover:underline">
                    browse to upload
                  </span>
                </p>
                <div className="flex items-center justify-center gap-3 mt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs text-text-muted">
                    <FileText className="w-3 h-3 text-error" />
                    PDF only
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
            className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-200 bg-emerald-50"
          >
            {/* PDF icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-error/10 flex-shrink-0">
              <FileText className="w-6 h-6 text-error" />
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {presentationFile.name}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {formatBytes(presentationFile.size)} · PDF
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
            className="flex items-center gap-1.5 text-xs text-error"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {errors.presentationFile?.message?.toString()}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Note */}
      <p className="text-xs text-text-muted leading-relaxed">
        <span className="font-semibold">Note:</span> Upload a presentation (PPT exported as PDF or PDF document)
        summarizing your idea, proposed solution, and expected impact. The College Authorization Letter
        will be generated separately for shortlisted teams.
      </p>
    </div>
  );
}
