"use client";

import { useFormContext, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { AlertCircle, Crown, User, ChevronDown } from "lucide-react";
import { RegistrationSchemaType } from "@/lib/validation/registrationSchema";
import FemaleBadge from "./FemaleBadge";
import { cn } from "@/lib/utils";
import { useState } from "react";

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"] as const;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-error mt-1" role="alert">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

interface MemberRowProps {
  index: number;
  isLeader: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function MemberRow({ index, isLeader, isOpen, onToggle }: MemberRowProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<RegistrationSchemaType>();

  const memberErrors = errors.members?.[index];
  const name = watch(`members.${index}.fullName`);
  const gender = watch(`members.${index}.gender`);
  const hasError = !!memberErrors;

  return (
    <div
      className={cn(
        "rounded-2xl border overflow-hidden transition-all duration-200 shadow-sm",
        isLeader ? "border-navy-primary/30" : "border-slate-200",
        hasError && !isOpen ? "border-red-300" : ""
      )}
    >
      {/* Header Button */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors duration-200",
          isLeader ? "bg-navy-primary/5 hover:bg-navy-primary/10" : "bg-white hover:bg-slate-50",
          isOpen ? (isLeader ? "bg-navy-primary/5" : "bg-slate-50") : ""
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
            isLeader ? "bg-navy-primary text-white" : "bg-navy-primary/10 text-navy-primary"
          )}>
            {isLeader ? <Crown className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <div className="font-bold text-navy-primary text-sm sm:text-base">
              {name || (isLeader ? "Team Leader" : `Member ${index + 1}`)}
            </div>
            <div className="text-xs text-text-muted mt-0.5">
              {isLeader ? "Registrant — fills this form" : `Role: Member`} {gender && `• ${gender}`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasError && <AlertCircle className="w-5 h-5 text-error" />}
          <ChevronDown className={cn("w-5 h-5 text-text-muted transition-transform duration-300", isOpen && "rotate-180")} />
        </div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-white"
          >
            <div className="p-4 sm:p-5 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Label htmlFor={`member-${index}-name`} className="text-xs mb-1 block">
            Full Name <span className="text-error">*</span>
          </Label>
          <Input
            id={`member-${index}-name`}
            placeholder="Full name"
            error={!!memberErrors?.fullName}
            className="h-10 text-sm"
            {...register(`members.${index}.fullName`)}
          />
          <FieldError message={memberErrors?.fullName?.message} />
        </div>

        {/* Gender */}
        <div>
          <Label htmlFor={`member-${index}-gender`} className="text-xs mb-1 block">
            Gender <span className="text-error">*</span>
          </Label>
          <Controller
            name={`members.${index}.gender`}
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id={`member-${index}-gender`}
                  className="h-10 text-sm"
                  error={!!memberErrors?.gender}
                >
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={memberErrors?.gender?.message} />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor={`member-${index}-email`} className="text-xs mb-1 block">
            Email <span className="text-error">*</span>
          </Label>
          <Input
            id={`member-${index}-email`}
            type="email"
            placeholder="email@example.com"
            error={!!memberErrors?.email}
            className="h-10 text-sm"
            {...register(`members.${index}.email`)}
          />
          <FieldError message={memberErrors?.email?.message} />
        </div>

        {/* Mobile */}
        <div>
          <Label htmlFor={`member-${index}-mobile`} className="text-xs mb-1 block">
            Mobile <span className="text-error">*</span>
          </Label>
          <Input
            id={`member-${index}-mobile`}
            type="tel"
            placeholder="10-digit number"
            maxLength={10}
            error={!!memberErrors?.mobile}
            className="h-10 text-sm"
            {...register(`members.${index}.mobile`)}
          />
          <FieldError message={memberErrors?.mobile?.message} />
        </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Section2TeamDetails() {
  const { watch, formState: { errors } } = useFormContext<RegistrationSchemaType>();
  const members = watch("members") || [];

  // Count female members from watched form values
  const femaleCount = members.filter((m) => m?.gender === "Female").length;

  // Top-level members array error (e.g., duplicate email/mobile, min female)
  const membersError = errors.members?.root?.message || errors.members?.message;

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-4">
      {/* Female Badge — live counter */}
      <FemaleBadge count={femaleCount} />

      {/* Members */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <MemberRow 
            key={index} 
            index={index} 
            isLeader={index === 0} 
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>

      {/* Array-level error */}
      {membersError && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-error flex-shrink-0" />
          <p className="text-xs text-error font-medium">{membersError}</p>
        </motion.div>
      )}
    </div>
  );
}
