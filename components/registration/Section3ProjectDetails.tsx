"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Lightbulb, FileText, AlignLeft } from "lucide-react";
import { RegistrationSchemaType } from "@/lib/validation/registrationSchema";
import { VALIDATION } from "@/lib/constants";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-error mt-1.5" role="alert">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

function WordCounter({ value, max }: { value: string; max: number }) {
  const count = value ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOver = count > max;
  const nearLimit = count >= max * 0.85;

  return (
    <span className={cn(
      "text-xs font-medium tabular-nums transition-colors duration-200",
      isOver ? "text-error" : nearLimit ? "text-amber-500" : "text-text-muted"
    )}>
      {count} / {max} words
    </span>
  );
}

const PROBLEM_STATEMENT_DOMAINS = [
  "Agriculture / Rural Development",
  "Education & Skill Development",
  "Health & Wellness",
  "Environment & Sustainability",
  "Smart Cities & Infrastructure",
  "Finance / Fintech",
  "Disaster Management",
  "Transportation & Mobility",
  "Women Safety & Empowerment",
  "Cybersecurity",
  "Governance & Digital Services",
  "Tourism & Culture",
  "Other",
];

export default function Section3ProjectDetails() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<RegistrationSchemaType>();

  const descriptionValue = watch("ideaDescription") || "";

  return (
    <div className="space-y-5">
      {/* Problem Statement Domain */}
      <div>
        <Label htmlFor="problemStatement" className="flex items-center gap-1.5 mb-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-accent-orange" />
          Problem Domain / Statement <span className="text-error">*</span>
        </Label>
        <Input
          id="problemStatement"
          placeholder="e.g. Health & Wellness — Smart Telemedicine for Rural Areas"
          error={!!errors.problemStatement}
          {...register("problemStatement")}
        />
        <p className="text-xs text-text-muted mt-1.5">
          Describe the domain or specific problem you are solving.
        </p>
        <FieldError message={errors.problemStatement?.message} />
      </div>

      {/* Idea Title */}
      <div>
        <Label htmlFor="ideaTitle" className="flex items-center gap-1.5 mb-1.5">
          <FileText className="w-3.5 h-3.5 text-accent-orange" />
          Idea / Project Title <span className="text-error">*</span>
        </Label>
        <Input
          id="ideaTitle"
          placeholder="e.g. MediLink — Rural Health Access Platform"
          error={!!errors.ideaTitle}
          {...register("ideaTitle")}
        />
        <FieldError message={errors.ideaTitle?.message} />
      </div>

      {/* Idea Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="ideaDescription" className="flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-accent-orange" />
            Short Description <span className="text-error">*</span>
          </Label>
          <WordCounter value={descriptionValue} max={VALIDATION.MAX_DESCRIPTION_WORDS} />
        </div>
        <Textarea
          id="ideaDescription"
          rows={6}
          placeholder={`Describe your idea in up to ${VALIDATION.MAX_DESCRIPTION_WORDS} words. What problem does it solve? How does your solution work? What is the expected impact?`}
          error={!!errors.ideaDescription}
          {...register("ideaDescription")}
        />
        <p className="text-xs text-text-muted mt-1.5">
          Maximum {VALIDATION.MAX_DESCRIPTION_WORDS} words. Be concise and clear.
        </p>
        <FieldError message={errors.ideaDescription?.message} />
      </div>
    </div>
  );
}
