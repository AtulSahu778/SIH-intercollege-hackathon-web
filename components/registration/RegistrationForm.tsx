"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Loader2, Send,
  Users, FolderOpen, CheckCircle2, ChevronRight, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import RegistrationNotice from "@/components/registration/RegistrationNotice";
import Section1TeamInfo from "@/components/registration/Section1TeamInfo";
import Section2TeamDetails from "@/components/registration/Section2TeamDetails";
import AuthLetterUpload from "@/components/registration/AuthLetterUpload";

import {
  registrationSchema,
  RegistrationSchemaType,
} from "@/lib/validation/registrationSchema";
import { submitRegistration } from "@/lib/api/appsScript";
import { useRegistrationOpen } from "@/lib/hooks/useRegistrationOpen";


// ─────────────────────────────────────────────────────────────────────────────
// Section config
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: 1,
    title: "Team Information",
    description: "Basic details about your team",
    icon: FolderOpen,
    color: "text-navy-primary",
    bgColor: "bg-navy-primary/10",
  },
  {
    id: 2,
    title: "Team Details",
    description: "Leader + 5 member information",
    icon: Users,
    color: "text-navy-primary",
    bgColor: "bg-navy-primary/10",
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
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isOpen = useRegistrationOpen();

  const methods = useForm<RegistrationSchemaType>({
    resolver: zodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      teamName: "",
      department: "",
      academicYear: "",
      category: undefined,
      members: defaultMembers,

    },
  });

  const { handleSubmit, watch, reset, trigger } = methods;

  // ── Load autosaved draft ──────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Don't restore the file (can't serialize File objects)
        reset(parsed);
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
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formValues));
    }, 800);
    return () => clearTimeout(timer);
  }, [formValues]);

  // ── Step Navigation ────────────────────────────────────────────────────────
  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    if (currentStep === 1) fieldsToValidate = ["teamName", "department", "academicYear", "category"];
    else if (currentStep === 2) fieldsToValidate = ["members"];

    const isStepValid = await trigger(fieldsToValidate as (keyof RegistrationSchemaType)[]);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: RegistrationSchemaType) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting registration...", {
      description: "Saving your team details. Please wait...",
    });

    try {
      const payload = {
        teamName: data.teamName,
        department: data.department,
        academicYear: data.academicYear,
        category: data.category,
        problemStatement: "",
        ideaTitle: "",
        ideaDescription: "",
        members: data.members,
        pdfBase64: "",
        pdfFileName: "",
        authLetterBase64: "",
        authLetterFileName: "",
      };

      const result = await submitRegistration(payload);

      if (result.success && result.teamId) {
        toast.dismiss(toastId);
        // Clear draft
        localStorage.removeItem(AUTOSAVE_KEY);
        // Navigate to success page
        router.push(`/register/success?teamId=${result.teamId}&teamName=${encodeURIComponent(data.teamName)}`);
      } else {
        toast.dismiss(toastId);
        toast.error("Submission failed", {
          description: result.error || "Please try again. If the problem persists, contact IQAC.",
        });
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error("Submit error:", error);
      toast.error("Something went wrong", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    toast.error("Please fix the errors before submitting.", {
      description: "Scroll up to see all validation errors.",
    });
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-3xl mx-auto">

        {/* Registration Closed → Auth Letter Upload */}
        {!isOpen && <AuthLetterUpload />}

        {isOpen && (
          <>
            {/* Horizontal Stepper UI */}
            <div className="mb-10 px-2 sm:px-0">
          <div className="relative flex justify-between">
            {SECTIONS.map((section, index) => {
              const isActive = currentStep === section.id;
              const isPast = currentStep > section.id;
              const Icon = section.icon;

              return (
                <div key={section.id} className="relative z-10 flex flex-col items-center w-1/2">
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                    isActive ? "bg-navy-primary border-navy-primary text-white shadow-md scale-110" : 
                    isPast ? "bg-navy-primary border-navy-primary text-white" : "bg-white border-slate-200 text-slate-400"
                  )}>
                    {isPast ? <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className={cn(
                    "text-[10px] sm:text-xs font-bold mt-2.5 text-center leading-tight transition-colors duration-300",
                    isActive ? "text-navy-primary" : "text-slate-400"
                  )}>
                    {section.title}
                  </div>
                  
                  {/* Connector Line */}
                  {index < SECTIONS.length - 1 && (
                    <div className="absolute top-5 sm:top-6 left-[50%] w-[100%] h-0.5 -z-10">
                      <div className="w-full h-full bg-slate-200" />
                      <div 
                        className="absolute top-0 left-0 h-full bg-navy-primary transition-all duration-500 ease-in-out" 
                        style={{ width: isPast ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Notice */}
        <div className={cn("transition-all duration-300", currentStep > 1 ? "hidden" : "block mb-8")}>
          <RegistrationNotice />
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          noValidate
          aria-label="Team registration form"
          onKeyDown={(e) => {
            // Prevent accidental form submission when pressing Enter inside inputs/textareas
            if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
              e.preventDefault();
            }
          }}
        >
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden mb-8">
            <div className="px-5 py-6 sm:p-8">
              {/* Step Header */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  SECTIONS[currentStep - 1].bgColor, SECTIONS[currentStep - 1].color
                )}>
                  {(() => { 
                    const Icon = SECTIONS[currentStep - 1].icon; 
                    return <Icon className="w-6 h-6" />; 
                  })()}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-navy-primary">
                    Step {currentStep}: {SECTIONS[currentStep - 1].title}
                  </h2>
                  <p className="text-sm text-text-muted mt-1 font-medium">
                    {SECTIONS[currentStep - 1].description}
                  </p>
                </div>
              </div>

              {/* Step Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {currentStep === 1 && <Section1TeamInfo />}
                  {currentStep === 2 && <Section2TeamDetails />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" size="lg" onClick={prevStep} className="w-1/3 sm:w-32 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : <div />}

            {currentStep < 2 ? (
              <Button type="button" size="lg" onClick={nextStep} className="w-2/3 sm:w-auto sm:min-w-[160px] rounded-xl bg-navy-primary hover:bg-navy-secondary text-white shadow-lg shadow-navy-primary/20">
                Next Step
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-2/3 sm:w-auto sm:min-w-[200px] rounded-xl bg-navy-primary hover:bg-navy-secondary text-white shadow-xl shadow-navy-primary/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Registration
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
        </>
        )}
      </div>
    </FormProvider>
  );
}
