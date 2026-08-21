import type { Metadata } from "next";
import IdeaSubmission from "@/components/registration/IdeaSubmission";
import RegistrationClosed from "@/components/registration/RegistrationClosed";
import { COLLEGE, HACKATHON, PORTAL_CLOSED } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Submit Your Idea — ${HACKATHON.name}`,
  description: `Submit your team idea for the Internal SIH 2026 at ${COLLEGE.name}. Enter your Team ID and share your problem domain, idea title, and description.`,
};

export default function SubmitIdeaPage() {
  return (
    <div className="min-h-screen bg-background pb-16 sm:pb-20">
      {/* Page Header */}
      <div className="bg-navy-primary relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
        <div className="absolute right-0 top-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 sm:pt-36 sm:pb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs font-semibold text-white/90 mb-3 sm:mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-orange" />
              Idea Submission · iSIH 2026
            </div>
            <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
              Submit Your Team Idea
            </h1>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-white/70 leading-relaxed max-w-xl">
              Registered teams can submit their idea details using their assigned{" "}
              <span className="text-white font-semibold">SIH Team ID</span>.
              No PPT upload required — just your idea.
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12">
        {PORTAL_CLOSED ? <RegistrationClosed /> : <IdeaSubmission />}
      </div>
    </div>
  );
}
