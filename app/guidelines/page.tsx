import type { Metadata } from "next";
import { COLLEGE, HACKATHON, TEMPLATE } from "@/lib/constants";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from "@/components/ui/accordion";
import {
  Users, ClipboardCheck, Star, BarChart3, HelpCircle,
  BookOpen, CheckCircle2, AlertCircle, Download, FileText
} from "lucide-react";

export const metadata: Metadata = {
  title: `Guidelines — ${HACKATHON.name}`,
  description: `Complete guidelines for the Internal SIH 2026 at ${COLLEGE.name}. Team eligibility, registration rules, selection process, evaluation criteria, and FAQs.`,
};

const SECTIONS = [
  {
    id: "eligibility",
    icon: Users,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50",
    title: "Team Eligibility",
    content: (
      <ul className="space-y-3">
        {[
          "Only currently enrolled students of St. Xavier's College, Ranchi may participate.",
          "Only Computer Science department students (B.Sc. IT, B.Sc. Computer Application, BCA) are eligible to participate.",
          "Each team must consist of exactly 6 members (1 Team Leader + 5 Members).",
          "A minimum of 2 female members is mandatory in every team.",
          "All 6 members must belong to St. Xavier's College, Ranchi. Cross-college teams are not permitted.",
          "One student cannot be part of multiple teams.",
          "Faculty advisors are not counted as team members.",
        ].map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: "registration-rules",
    icon: ClipboardCheck,
    iconColor: "text-accent-orange",
    iconBg: "bg-orange-50",
    title: "Registration Rules",
    content: (
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            Only the Team Leader should complete the online registration form.
          </p>
        </div>
        <ul className="space-y-3">
          {[
            "Mandatory Template Format: You MUST download and use ONLY the official SIH 2026 Idea Presentation PPT template (SIH2025-IDEA-Presentation-Format.pptx). No other custom format will be accepted.",
            "Only one registration is allowed per team. Duplicate entries will be disqualified.",
            "All information provided must be accurate. Misrepresentation will result in disqualification.",
            "Upload your idea presentation following the official template as PDF or PPTX (max 10 MB).",
            "Registrations are accepted only through this online portal — offline/email submissions will not be considered.",
            "Ensure all 6 member email addresses and mobile numbers are unique and valid.",
            "Once submitted, changes to registration can only be made by contacting IQAC directly.",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "selection",
    icon: Star,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
    title: "Selection Process",
    content: (
      <ol className="space-y-4">
        {[
          {
            step: "1",
            title: "Registration Review",
            desc: "IQAC reviews all registrations for completeness, Computer Science eligibility, and submission format compliance. Non-template or ineligible registrations will be rejected.",
          },
          {
            step: "2",
            title: "Internal Hackathon (24 Hours)",
            desc: "All eligible teams participate in the 24-hour on-campus hackathon. Teams present their working prototypes or demos.",
          },
          {
            step: "3",
            title: "Evaluation by Expert Panel",
            desc: "A panel of faculty members and industry experts evaluates each team's solution based on predefined criteria.",
          },
          {
            step: "4",
            title: "Shortlisting",
            desc: "Top-performing teams are shortlisted. Results are announced on this portal and communicated via email.",
          },
          {
            step: "5",
            title: "SIH 2026 Nomination",
            desc: "Shortlisted teams receive the College Authorization Letter and are nominated to represent SXC at Smart India Hackathon 2026.",
          },
        ].map((item) => (
          <li key={item.step} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-100 text-violet-600 font-black text-sm flex items-center justify-center">
              {item.step}
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-sm">{item.title}</h3>
              <p className="text-sm text-text-muted mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
  {
    id: "evaluation",
    icon: BarChart3,
    iconColor: "text-success",
    iconBg: "bg-emerald-50",
    title: "Evaluation Criteria",
    content: (
      <div className="space-y-3">
        {[
          { criterion: "Innovation & Originality", weight: "25%", desc: "How novel and creative is the idea?" },
          { criterion: "Problem Relevance", weight: "20%", desc: "Does the solution address a real-world or national-level problem?" },
          { criterion: "Technical Feasibility", weight: "20%", desc: "Is the proposed solution technically sound and implementable?" },
          { criterion: "Prototype / Demo", weight: "20%", desc: "Quality and completeness of the working prototype or demo." },
          { criterion: "Presentation & Communication", weight: "15%", desc: "Clarity and adherence to the official SIH idea presentation format." },
        ].map((item) => (
          <div key={item.criterion} className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
              <span className="text-xs font-black text-success">{item.weight}</span>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary text-sm">{item.criterion}</h3>
              <p className="text-xs text-text-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "faq",
    icon: HelpCircle,
    iconColor: "text-accent-cyan",
    iconBg: "bg-cyan-50",
    title: "Frequently Asked Questions",
    content: (
      <div className="space-y-5">
        {[
          {
            q: "Who is eligible to participate in the hackathon?",
            a: "Only currently enrolled Computer Science students (B.Sc. Information Technology, B.Sc. Computer Application, BCA) of St. Xavier's College, Ranchi are eligible to participate.",
          },
          {
            q: "What format should the idea presentation be in?",
            a: "Teams MUST download and use ONLY the official SIH 2026 Idea Presentation Template (SIH2025-IDEA-Presentation-Format.pptx). Submissions in any other custom presentation format will be disqualified.",
          },
          {
            q: "Can the same idea be submitted by two different teams?",
            a: "No. Each idea submission must be unique. Plagiarism or identical submissions will result in disqualification of both teams.",
          },
          {
            q: "What if our team has fewer than 6 members?",
            a: "Strictly, 6 members are required (minimum 2 female members). Teams with fewer members will not be considered eligible and their registration will be rejected.",
          },
          {
            q: "Can students from non-Computer Science streams participate?",
            a: "No. The Internal SIH selection round is strictly for Computer Science students (B.Sc. IT, B.Sc. CA, BCA).",
          },
          {
            q: "Will there be internet access and electricity during the hackathon?",
            a: "Yes. The hackathon venue will have WiFi and power. Specific venue and logistics details will be shared after registration closes.",
          },
          {
            q: "What happens after the internal hackathon?",
            a: "Top teams will be shortlisted by the expert evaluation panel. Shortlisted teams will receive the College Authorization Letter and be nominated to SIH 2026.",
          },
          {
            q: "My team wants to change the team leader. Is that possible?",
            a: "After submission, changes can only be made by contacting IQAC directly.",
          },
        ].map((item, i) => (
          <div key={i} className="border-l-2 border-accent-cyan/30 pl-4">
            <p className="font-semibold text-text-primary text-sm mb-1">{item.q}</p>
            <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-navy-primary relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent-cyan/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:pt-36 sm:pb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent-orange" />
              <span className="text-white/60 text-sm font-medium">Hackathon Guidelines</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Rules, Eligibility &{" "}
              <span className="text-gradient-cyan">Selection Process</span>
            </h1>
            <p className="mt-3 text-xs sm:text-base text-white/60 leading-relaxed max-w-xl">
              Everything you need to know about participating in the Internal SIH 2026 at{" "}
              <span className="text-white/80 font-semibold">{COLLEGE.name}</span>.
              Read carefully before registering.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mandatory Template Download Card */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-navy-primary/5 border border-orange-200/80 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-accent-orange/15 border border-accent-orange/30 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-accent-orange" />
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent-orange text-white text-[11px] font-bold uppercase tracking-wider mb-1">
                  Mandatory Submission Format
                </span>
                <h3 className="font-bold text-navy-primary text-base sm:text-lg">
                  Official SIH 2026 Idea Presentation Template
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                  All teams <strong className="text-navy-primary">MUST</strong> submit their presentation using ONLY this official PowerPoint template (<code className="text-accent-orange font-semibold">{TEMPLATE.filename}</code>). Custom presentation formats will be rejected.
                </p>
              </div>
            </div>
            <a
              href={TEMPLATE.downloadUrl}
              download={TEMPLATE.filename}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-navy-primary hover:bg-navy-secondary text-white font-semibold text-sm shadow-md transition-all duration-200 flex-shrink-0 group"
            >
              <Download className="w-4 h-4 text-accent-cyan group-hover:translate-y-0.5 transition-transform" />
              <span>Download Template (.pptx)</span>
            </a>
          </div>
        </div>

        <Accordion type="multiple" defaultValue={["eligibility", "registration-rules"]} className="space-y-3">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="gap-3">
                  <div className="flex items-center gap-3 text-left">
                    <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${section.iconColor}`} />
                    </div>
                    <span className="font-bold text-text-primary">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-navy-primary to-navy-secondary text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30" />
          <div className="relative">
            <h2 className="font-black text-xl mb-2">Ready to Innovate?</h2>
            <p className="text-white/60 text-sm mb-5">
              Register your team now and take the first step towards representing{" "}
              {COLLEGE.shortName} at SIH 2026.
            </p>
            <a
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-orange text-white font-semibold text-sm shadow-lg hover:bg-orange-500 transition-colors duration-200"
            >
              Register Your Team →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
