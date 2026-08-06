import Link from "next/link";
import { Phone, ExternalLink, Heart } from "lucide-react";
import { COLLEGE, HACKATHON } from "@/lib/constants";
import Image from "next/image";
import sihLogo from "@/app/images/SIH2026-logo.png";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "Guidelines", href: "/guidelines" },
  { label: "Register", href: "/register" },
  { label: "Admin Dashboard", href: "/admin" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-primary text-white relative overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />

      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent-orange/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent-cyan/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl backdrop-blur-sm border border-white/10 flex-wrap">
                <Image src={sihLogo} alt="SIH 2026" className="h-14 w-auto max-w-[200px] object-contain" />
              </div>
              <div>
                <div className="font-bold text-base text-white">{HACKATHON.name}</div>
                <div className="text-xs text-white/50 mt-0.5">Internal Selection Round</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              An internal hackathon organized by{" "}
              <span className="text-white/80 font-medium">{COLLEGE.name}</span> in
              association with the{" "}
              <span className="text-white/80 font-medium">{COLLEGE.iqac}</span>.
              Top teams will be shortlisted to represent SXC at the national SIH 2026.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/10 text-xs text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                Registrations Open
              </span>


            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-accent-orange/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={COLLEGE.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1.5"
                >
                  <span className="w-1 h-1 rounded-full bg-accent-cyan/60" />
                  College Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-5">
              Contact
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href={`tel:${COLLEGE.phone}`}
                  className="flex items-center gap-3 text-sm text-white/50 hover:text-white/80 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-accent-cyan flex-shrink-0" />
                  <span>{COLLEGE.phone}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>
            © {currentYear} {COLLEGE.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Designed & Developed with <Heart className="w-2 h-2 text-accent-orange fill-accent-orange" /> by{" "}
            <span className="text-white/50 font-medium">Atul Sahu</span>
          </p>
        </div>
      </div>
    </footer>
  );  
}
