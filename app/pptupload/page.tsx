import type { Metadata } from "next";
import PresentationUpload from "@/components/registration/PresentationUpload";
import { COLLEGE, HACKATHON } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Upload SIH Presentation | ${HACKATHON.shortName} — ${COLLEGE.shortName}`,
  description: `Upload your official SIH idea presentation for the Internal Smart India Hackathon 2026 at ${COLLEGE.name}. Accepted formats: PPT, PPTX, PDF.`,
};

export default function PresentationUploadPage() {
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-10 sm:py-16 md:py-24 px-3.5 sm:px-4">
      {/* Page Header */}
      <div className="max-w-xl mx-auto text-center mb-6 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-navy-primary/5 border border-navy-primary/10 text-navy-primary text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4">
          {HACKATHON.shortName} · {COLLEGE.shortName}
        </div>
        <h1 className="text-[1.65rem] sm:text-4xl font-black text-slate-900 tracking-tight mb-2.5 sm:mb-3">
          Upload Your Presentation
        </h1>
        <p className="text-sm sm:text-base text-slate-600 sm:text-slate-500 leading-relaxed max-w-md mx-auto px-1 sm:px-0">
          Submit your completed SIH idea presentation using the official template. 
          Your file will be saved securely to Google Drive.
        </p>
      </div>

      {/* Upload Form */}
      <PresentationUpload />
    </section>
  );
}
