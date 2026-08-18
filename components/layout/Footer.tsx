import Link from "next/link";
import { Phone, ExternalLink } from "lucide-react";
import { COLLEGE, HACKATHON, WHATSAPP_GROUP_URL } from "@/lib/constants";
import Image from "next/image";
import sihLogo from "@/app/images/SIH2026-logo.png";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "Submit Idea", href: "/submit-idea" },
  { label: "Admin Dashboard", href: "/admin" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-primary text-white relative overflow-hidden print:hidden border-t border-white/5">
      {/* Background grid pattern & ambient glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-orange/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      
      {/* Top wavy separator (optional, or just gradient line) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/10">

          {/* Brand Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <div className="inline-flex items-center justify-center bg-white p-3 rounded-2xl shadow-xl shadow-white/5">
                <Image src={sihLogo} alt="SIH 2026" className="h-12 w-auto object-contain" />
              </div>
              <div>
                <h2 className="font-black text-xl text-white tracking-tight">{HACKATHON.name}</h2>
                <div className="text-xs font-semibold uppercase tracking-widest text-accent-orange mt-1">Internal Selection Round</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-md">
              An internal hackathon organized by <strong className="text-white/90 font-semibold">{COLLEGE.name}</strong> in
              association with the <strong className="text-white/90 font-semibold">{COLLEGE.iqac}</strong>.
              Top teams will be shortlisted to represent SXC at the national Smart India Hackathon 2026.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/80 shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                Registrations Open
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 hidden lg:block" />

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-orange/40" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={COLLEGE.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-accent-cyan transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/40" />
                  <span className="flex items-center gap-1.5">
                    College Website
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              Contact & Support
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${COLLEGE.phone}`}
                  className="flex items-start gap-3.5 text-sm text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-accent-cyan/20 group-hover:border-accent-cyan/30 transition-colors">
                    <Phone className="w-4 h-4 text-accent-cyan" />
                  </div>
                  <div>
                    <div className="font-medium text-white/90">Support & Queries</div>
                    <div className="mt-1 flex flex-col gap-0.5 text-[13px]">
                      <span>Atul: +91 9341936886</span>
                      <span>Ayur: +91 8825193783</span>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_GROUP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 text-sm text-white/70 hover:text-white transition-colors duration-300 group"
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#25D366]/20 group-hover:border-[#25D366]/30 transition-colors">
                    <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.74.949 3.71 1.45 5.71 1.45h.005c6.554 0 11.89-5.335 11.893-11.893 0-3.18-1.238-6.167-3.488-8.414" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-white/90">Participant WhatsApp Group</div>
                    <div className="mt-0.5 text-xs">Join for updates & queries</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>
            © {currentYear} <span className="font-semibold text-white/60">{COLLEGE.shortName}</span>. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Developed by{" "}
            <a href="https://github.com/atulsahu" target="_blank" rel="noreferrer" className="text-white/80 font-semibold hover:text-white transition-colors hover:underline underline-offset-4 decoration-accent-orange/50">
              Atul Sahu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );  
}
