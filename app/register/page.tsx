import type { Metadata } from "next";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { COLLEGE, HACKATHON } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Register Your Team — ${HACKATHON.name}`,
  description: `Register your 6-member team for the Internal SIH 2026 at ${COLLEGE.name}. Complete the registration in under 3 minutes.`,
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-navy-primary relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent-orange/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/70 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Registrations Open · {HACKATHON.year}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Register Your Team
            </h1>
            <p className="mt-3 text-white/60 text-sm sm:text-base leading-relaxed max-w-xl">
              Complete all sections below. The team leader registers on behalf of the entire team.
              Estimated time: <span className="text-white/80 font-semibold">3–5 minutes</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 sm:pb-10">
        <RegistrationForm />
      </div>
    </div>
  );
}
