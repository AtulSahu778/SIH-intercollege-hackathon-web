"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronDown, ChevronUp, Loader2, Send,
  Users, FolderOpen, Lightbulb, Upload, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import RegistrationNotice from "@/components/registration/RegistrationNotice";
import Section1TeamInfo from "@/components/registration/Section1TeamInfo";
import Section2TeamDetails from "@/components/registration/Section2TeamDetails";
import Section3ProjectDetails from "@/components/registration/Section3ProjectDetails";
import Section4Upload from "@/components/registration/Section4Upload";

import {
  registrationSchema,
  RegistrationSchemaType,
} from "@/lib/validation/registrationSchema";
import { submitRegistration, fileToBase64 } from "@/lib/api/appsScript";
import { VALIDATION } from "@/lib/constants";

// ─────────────────────────────────────────────────────────────────────────────
// Section config
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1,
    title: "Team Information",
    description: "Basic details about your team",
    icon: FolderOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    title: "Team Details",
    description: "Leader + 5 member information",
    icon: Users,
    color: "text-violet-500",
    bgColor: "bg-violet-50",
  },
  {
    id: 3,
    title: "Project Details",
    description: "Idea title and description",
    icon: Lightbulb,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
  {
    id: 4,
    title: "Upload Presentation",
    description: "Idea presentation PDF (max 10 MB)",
    icon: Upload,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Default members array
// ─────────────────────────────────────────────────────────────────────────────
const defaultMembers = Array.from({ length: 6 }, (_, i) => ({
  memberType: i === 0 ? ("Leader" as const) : ("Member" as const),
  fullName: "",
  gender: "Male" as const,
  email: "",
  mobile: "",
}));

// ─────────────────────────────────────────────────────────────────────────────
// Autosave key
// ─────────────────────────────────────────────────────────────────────────────
const AUTOSAVE_KEY = "sxc_sih_registration_draft";

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function RegistrationForm() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<number[]>([1]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<RegistrationSchemaType>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      teamName: "",
      department: "",
      academicYear: "",
      category: undefined,
      members: defaultMembers,
      problemStatement: "",
      ideaTitle: "",
      ideaDescription: "",
      presentationFile: null,
    },
  });

  const { handleSubmit, watch, reset, formState: { errors } } = methods;

  // ── Load autosaved draft ──────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Don't restore the file (can't serialize File objects)
        reset({ ...parsed, presentationFile: null });
        toast.info("Draft restored", {
          description: "We restored your previously saved progress.",
          action: {
            label: "Clear",
            onClick: () => {
              localStorage.removeItem(AUTOSAVE_KEY);
              reset();
            },
          },
        });
      } catch {
        localStorage.removeItem(AUTOSAVE_KEY);
      }
    }
  }, [reset]);

  // ── Autosave on change ────────────────────────────────────────────────────
  const formValues = watch();
  useEffect(() => {
    const timer = setTimeout(() => {
      const { presentationFile, ...saveable } = formValues;
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(saveable));
    }, 800);
    return () => clearTimeout(timer);
  }, [formValues]);

  // ── Section toggle ────────────────────────────────────────────────────────
  const toggleSection = (id: number) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // ── Progress calculation ──────────────────────────────────────────────────
  const calculateProgress = useCallback(() => {
    const vals = formValues;
    let filled = 0;
    if (vals.teamName && vals.department && vals.academicYear && vals.category) filled += 25;
    const membersComplete = vals.members?.every(
      (m) => m.fullName && m.email && m.mobile
    );
    if (membersComplete) filled += 25;
    if (vals.problemStatement && vals.ideaTitle && vals.ideaDescription) filled += 25;
    if (vals.presentationFile) filled += 25;
    return filled;
  }, [formValues]);

  const progress = calculateProgress();

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: RegistrationSchemaType) => {
    if (!data.presentationFile) {
      toast.error("Please upload your idea presentation PDF before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert file to base64
      const pdfBase64 = await fileToBase64(data.presentationFile);

      const payload = {
        teamName: data.teamName,
        department: data.department,
        academicYear: data.academicYear,
        category: data.category,
        problemStatement: data.problemStatement,
        ideaTitle: data.ideaTitle,
        ideaDescription: data.ideaDescription,
        members: data.members,
        pdfBase64,
        pdfFileName: data.presentationFile.name,
      };

      const result = await submitRegistration(payload);

      if (result.success && result.teamId) {
        // Clear draft
        localStorage.removeItem(AUTOSAVE_KEY);
        // Navigate to success page
        router.push(`/register/success?teamId=${result.teamId}&teamName=${encodeURIComponent(data.teamName)}&ideaTitle=${encodeURIComponent(data.ideaTitle)}`);
      } else {
        toast.error("Submission failed", {
          description: result.error || "Please try again. If the problem persists, contact IQAC.",
        });
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Something went wrong", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    // Open all sections with errors
    const sectionsWithErrors: number[] = [];
    if (errors.teamName || errors.department || errors.academicYear || errors.category) {
      sectionsWithErrors.push(1);
    }
    if (errors.members) sectionsWithErrors.push(2);
    if (errors.problemStatement || errors.ideaTitle || errors.ideaDescription) {
      sectionsWithErrors.push(3);
    }
    if (errors.presentationFile) sectionsWithErrors.push(4);

    setOpenSections((prev) => [...new Set([...prev, ...sectionsWithErrors])]);
    toast.error("Please fix the errors before submitting.", {
      description: "Scroll up to see all validation errors.",
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-text-primary">Registration Progress</span>
            <span className="text-sm font-bold text-accent-orange">{progress}%</span>
          </div>
          <Progress value={progress} />
          <p className="text-xs text-text-muted mt-1.5">
            {progress < 100
              ? "Complete all sections to enable submission"
              : "All sections complete — ready to submit!"}
          </p>
        </div>

        {/* Registration Notice */}
        <RegistrationNotice />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate aria-label="Team registration form">
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const isOpen = openSections.includes(section.id);
              const Icon = section.icon;

              // Check if section has errors
              const hasErrors =
                (section.id === 1 && (!!errors.teamName || !!errors.department || !!errors.academicYear || !!errors.category)) ||
                (section.id === 2 && !!errors.members) ||
                (section.id === 3 && (!!errors.problemStatement || !!errors.ideaTitle || !!errors.ideaDescription)) ||
                (section.id === 4 && !!errors.presentationFile);

              return (
                <div
                  key={section.id}
                  className={cn(
                    "rounded-2xl border bg-white shadow-sm overflow-hidden transition-all duration-200",
                    hasErrors ? "border-red-200" : isOpen ? "border-navy-primary/20 shadow-md" : "border-slate-100"
                  )}
                >
                  {/* Section Header — clickable */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200",
                      isOpen ? "bg-navy-primary/3" : "hover:bg-slate-50"
                    )}
                    aria-expanded={isOpen}
                    aria-controls={`section-${section.id}-content`}
                  >
                    {/* Step number + icon */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 transition-colors duration-200",
                      section.bgColor
                    )}>
                      <Icon className={cn("w-5 h-5", section.color)} />
                    </div>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                          Section {section.id}
                        </span>
                        {hasErrors && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-error text-xs font-semibold">
                            Errors
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-text-primary text-sm sm:text-base mt-0.5">
                        {section.title}
                      </div>
                      <div className="text-xs text-text-muted mt-0.5 hidden sm:block">
                        {section.description}
                      </div>
                    </div>

                    {/* Chevron */}
                    <div className="flex-shrink-0 text-text-muted">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Section Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`section-${section.id}-content`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                          {section.id === 1 && <Section1TeamInfo />}
                          {section.id === 2 && <Section2TeamDetails />}
                          {section.id === 3 && <Section3ProjectDetails />}
                          {section.id === 4 && <Section4Upload />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
          >
            <Button
              type="submit"
              size="xl"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-48 group"
              aria-live="polite"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  Submit Registration
                </>
              )}
            </Button>
            <p className="text-xs text-text-muted text-center sm:text-left">
              By submitting, you confirm that all provided information is accurate
              and that your team meets all eligibility criteria.
            </p>
          </motion.div>
        </form>

        {/* Sticky mobile CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-100 safe-bottom sm:hidden z-40">
          <Button
            type="submit"
            form="registration-form"
            size="lg"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit, onError)}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Registration
              </>
            )}
          </Button>
        </div>
      </div>
    </FormProvider>
  );
}
