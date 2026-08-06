import type { Metadata } from "next";
import { COLLEGE, HACKATHON } from "@/lib/constants";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent
} from "@/components/ui/accordion";
import {
  Users, ClipboardCheck, Star, BarChart3, HelpCircle,
  BookOpen, CheckCircle2, AlertCircle
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
          "Each team must consist of exactly 6 members (1 Team Leader + 5 Members).",
          "A minimum of 2 female members is mandatory in every team.",
          "All 6 members must belong to the same college. Cross-college teams are not permitted.",
          "One student cannot be part of multiple teams.",
          "Faculty advisors are not counted as team members.",
          "Students from any department or stream (UG or PG) are eligible.",
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
            "Only one registration is allowed per team. Duplicate entries will be disqualified.",
            "All information provided must be accurate. Misrepresentation will result in disqualification.",
            "Upload your idea presentation as a PDF (max 10 MB).",
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
            desc: "IQAC reviews all registrations for completeness and eligibility. Incomplete or ineligible registrations will be rejected.",
          },
          {
            step: "2",
            title: "Internal Hackathon (48 Hours)",
            desc: "All eligible teams participate in the 48-hour on-campus hackathon. Teams present their working prototypes or demos.",
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
          { criterion: "Presentation & Communication", weight: "15%", desc: "Clarity and effectiveness of the team's presentation." },
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
            q: "Can students from different departments form a team?",
            a: "Yes! Cross-department teams are encouraged as long as all members are enrolled at St. Xavier's College, Ranchi.",
          },
          {
            q: "Can the same idea be submitted by two different teams?",
            a: "No. Each idea submission must be unique. Plagiarism or identical submissions will result in disqualification of both teams.",
          },
          {
            q: "What if our team has fewer than 6 members?",
            a: "Strictly, 6 members are required. Teams with fewer members will not be considered eligible and their registration will be rejected.",
          },
          {
            q: "Can PG students team up with UG students?",
            a: "Yes. There is no restriction on mixing UG and PG students within a team, as long as all are enrolled at SXC Ranchi.",
          },
          {
            q: "What format should the idea presentation be in?",
            a: "The presentation must be submitted as a PDF file (max 10 MB). PowerPoint, Word, or other formats are not accepted.",
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
            a: "After submission, changes can only be made by contacting IQAC directly at iqac@sxcranchi.ac.in.",
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-accent-orange" />
              <span className="text-white/60 text-sm font-medium">Hackathon Guidelines</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Rules, Eligibility &{" "}
              <span className="text-gradient-cyan">Selection Process</span>
            </h1>
            <p className="mt-4 text-white/60 leading-relaxed max-w-xl">
              Everything you need to know about participating in the Internal SIH 2026 at{" "}
              <span className="text-white/80 font-semibold">{COLLEGE.name}</span>.
              Read carefully before registering.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Accordion type="multiple" defaultValue={["eligibility"]} className="space-y-3">
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
