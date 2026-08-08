"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { AlertCircle, Users, Layers, BookOpen, Tag, CheckCircle2 } from "lucide-react";
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

      {/* Stream / Department (Multi-Select) */}
      <div>
        <Controller
          name="department"
          control={control}
          render={({ field }) => {
            const selectedValues: string[] = Array.isArray(field.value)
              ? field.value
              : field.value
              ? [field.value]
              : [];

            const toggleDept = (dept: string) => {
              if (selectedValues.includes(dept)) {
                field.onChange(selectedValues.filter((d) => d !== dept));
              } else {
                field.onChange([...selectedValues, dept]);
              }
            };

            return (
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
                  <Label className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-accent-orange flex-shrink-0" />
                    <span>Department(s) / Stream(s) <span className="text-error">*</span></span>
                  </Label>
                  {selectedValues.length > 0 && (
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-navy-primary/10 text-navy-primary border border-navy-primary/20">
                        {selectedValues.length} Selected
                      </span>
                      <button
                        type="button"
                        onClick={() => field.onChange([])}
                        className="text-[11px] text-slate-400 hover:text-navy-primary font-medium transition-colors px-1 py-0.5"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-text-muted">
                  Select all departments represented by your team members (multi-selection enabled).
                </p>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-4 max-h-[360px] overflow-y-auto custom-scrollbar">
                  {DEPARTMENT_GROUPS.map((group) => (
                    <div key={group.category} className="space-y-2">
                      <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-200/60 pb-1">
                        {group.category}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {group.options.map((dept) => {
                          const isSelected = selectedValues.includes(dept);
                          return (
                            <button
                              type="button"
                              key={dept}
                              onClick={() => toggleDept(dept)}
                              className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border text-left flex-initial max-w-full ${
                                isSelected
                                  ? "bg-navy-primary text-white border-navy-primary shadow-sm scale-[1.02]"
                                  : "bg-white text-slate-700 border-slate-200 hover:border-navy-primary/40 hover:bg-slate-50"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-md flex-shrink-0 flex items-center justify-center border transition-colors ${
                                  isSelected
                                    ? "bg-white text-navy-primary border-white"
                                    : "border-slate-300 group-hover:border-navy-primary"
                                }`}
                              >
                                {isSelected ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-navy-primary stroke-[3]" />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-navy-primary transition-colors" />
                                )}
                              </div>
                              <span className="leading-snug break-words whitespace-normal">{dept}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
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
