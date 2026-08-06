"use client";

import { useFormContext, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { AlertCircle, Crown, User } from "lucide-react";
import { RegistrationSchemaType } from "@/lib/validation/registrationSchema";
import FemaleBadge from "./FemaleBadge";
import { cn } from "@/lib/utils";

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
}

function MemberRow({ index, isLeader }: MemberRowProps) {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<RegistrationSchemaType>();

  const memberErrors = errors.members?.[index];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.35 }}
      className={cn(
        "rounded-2xl border p-4 sm:p-5",
        isLeader
          ? "bg-gradient-to-br from-orange-50 to-orange-50/30 border-orange-200"
          : "bg-white border-slate-100"
      )}
    >
      {/* Member header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className={cn(
          "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
          isLeader ? "bg-accent-orange" : "bg-navy-primary/10"
        )}>
          {isLeader ? (
            <Crown className="w-4 h-4 text-white" />
          ) : (
            <User className="w-4 h-4 text-navy-primary" />
          )}
        </div>
        <div>
          <div className="font-semibold text-sm text-text-primary">
            {isLeader ? "Team Leader" : `Member ${index}`}
          </div>
          {isLeader && (
            <div className="text-xs text-accent-orange font-medium">
              Registrant — fills this form
            </div>
          )}
        </div>
        <div className="ml-auto text-xs text-text-muted font-medium">
          #{index + 1}
        </div>
      </div>

      {/* Fields — responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
    </motion.div>
  );
}

export default function Section2TeamDetails() {
  const { watch, formState: { errors } } = useFormContext<RegistrationSchemaType>();
  const members = watch("members") || [];

  // Count female members from watched form values
  const femaleCount = members.filter((m) => m?.gender === "Female").length;

  // Top-level members array error (e.g., duplicate email/mobile, min female)
  const membersError = errors.members?.root?.message || errors.members?.message;

  return (
    <div className="space-y-4">
      {/* Female Badge — live counter */}
      <FemaleBadge count={femaleCount} />

      {/* Members */}
      {Array.from({ length: 6 }).map((_, index) => (
        <MemberRow key={index} index={index} isLeader={index === 0} />
      ))}

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
