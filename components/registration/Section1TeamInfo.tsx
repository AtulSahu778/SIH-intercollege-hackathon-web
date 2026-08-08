"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { AlertCircle, Users, Layers, BookOpen, Tag } from "lucide-react";
import { DEPARTMENT_GROUPS, ACADEMIC_YEARS, CATEGORIES } from "@/lib/constants";
import { RegistrationSchemaType } from "@/lib/validation/registrationSchema";


function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-error mt-1.5" role="alert">
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </p>
  );
}

export default function Section1TeamInfo() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegistrationSchemaType>();

  return (
    <div className="space-y-5">
      {/* Team Name */}
      <div>
        <Label htmlFor="teamName" className="flex items-center gap-1.5 mb-1.5">
          <Users className="w-3.5 h-3.5 text-accent-orange" />
          Team Name <span className="text-error">*</span>
        </Label>
        <Input
          id="teamName"
          placeholder="e.g. Team Phoenix, Code Crusaders"
          error={!!errors.teamName}
          {...register("teamName")}
        />
        <p className="text-[11px] text-text-muted mt-1">
          Must be unique and <strong>must NOT contain</strong> college name (e.g., &quot;Xavier&quot; or &quot;SXC&quot;).
        </p>
        <FieldError message={errors.teamName?.message} />
      </div>

      {/* Stream / Department */}
      <div>
        <Label htmlFor="department" className="flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3.5 h-3.5 text-accent-orange" />
          Department / Stream <span className="text-error">*</span>
        </Label>
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id="department"
                error={!!errors.department}
                aria-invalid={!!errors.department}
              >
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENT_GROUPS.map((group) => (
                  <SelectGroup key={group.category}>
                    <SelectLabel>{group.category}</SelectLabel>
                    {group.options.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError message={errors.department?.message} />
      </div>

      {/* Academic Year + Category — 2 column on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Academic Year */}
        <div>
          <Label htmlFor="academicYear" className="flex items-center gap-1.5 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-accent-orange" />
            Academic Year <span className="text-error">*</span>
          </Label>
          <Controller
            name="academicYear"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="academicYear"
                  error={!!errors.academicYear}
                >
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {ACADEMIC_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.academicYear?.message} />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="flex items-center gap-1.5 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-accent-orange" />
            Hackathon Category <span className="text-error">*</span>
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="category"
                  error={!!errors.category}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError message={errors.category?.message} />
        </div>
      </div>
    </div>
  );
}
