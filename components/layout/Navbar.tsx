"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLLEGE, HACKATHON } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import sihLogo from "@/app/images/SIH-Logo.png";
import sxcLogo from "@/app/images/sxclogo.jpg";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/register", label: "Register", highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setScrolled(currentScrollY > 20);

      // Auto-hide when scrolling down, show when scrolling up
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY.current + 8) {
          // Scrolling DOWN -> Hide navbar for distraction-free reading/form filling
          setVisible(false);
        } else if (currentScrollY < lastScrollY.current - 8) {
          // Scrolling UP -> Reveal navbar smoothly
          setVisible(true);
        }
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Don't render navbar in admin dashboard
  if (pathname.startsWith("/admin/dashboard")) {
    return null;
  }

  return (
    <>
      <div className={cn(
        "fixed left-0 right-0 z-50 flex justify-center transition-all duration-500 print:hidden px-4 sm:px-6",
        scrolled ? "top-4" : "top-[76px] sm:top-[48px]",
        visible || isOpen
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-28 opacity-0 pointer-events-none"
      )}>
        <header
          className={cn(
            "w-full max-w-7xl rounded-full transition-all duration-500 pointer-events-auto border bg-white/95 backdrop-blur-xl border-slate-200/60",
            scrolled ? "shadow-xl shadow-slate-200/50" : "shadow-lg shadow-slate-200/30"
          )}
          style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}
        >
          <div className="px-5 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="Go to homepage">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Image src={sxcLogo} alt="SXC Crest Logo" className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm" />
                <div className="h-7 sm:h-8 w-[1px] bg-slate-200" />
                <Image src={sihLogo} alt="SIH Logo" className="h-10 sm:h-12 w-auto max-w-[130px] sm:max-w-[150px] object-contain drop-shadow-sm" />
              </div>
              <div className="hidden lg:block border-l border-slate-200 pl-3">
                <div className="text-sm font-bold leading-none text-navy-primary transition-colors duration-200">
                  {HACKATHON.shortName}
                </div>
                <div className="text-xs mt-0.5 text-text-muted transition-colors duration-200">
                  {COLLEGE.shortName}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                if (link.highlight) {
                  return (
                    <Button key={link.href} asChild variant="default" size="sm" className="ml-2">
                      <Link href={link.href}>
                        {link.label}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                      pathname === link.href
                        ? "text-accent-orange bg-orange-50"
                        : "text-text-primary hover:text-accent-orange hover:bg-slate-50"
                    )}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {/* Admin link */}
              <Link
                href="/admin"
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200",
                  pathname === "/admin"
                    ? "text-accent-orange bg-orange-50"
                    : "text-text-muted hover:text-text-primary hover:bg-slate-50"
                )}
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className={cn(
                "md:hidden flex items-center justify-center w-11 h-11 -mr-2 rounded-xl transition-colors duration-200 focus:outline-none touch-target",
                isOpen
                  ? "bg-slate-100 text-navy-primary"
                  : "bg-transparent active:bg-slate-100 text-navy-primary"
              )}
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, scale: 0.75, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.75, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <X className="w-5 h-5 stroke-[2]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, scale: 0.75, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.75, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  >
                    <Menu className="w-5 h-5 stroke-[2]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-navy-primary/40 backdrop-blur-md md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-24 left-4 right-4 z-50 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden md:hidden"
            >
              <nav className="p-4 space-y-1.5" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 touch-target",
                        link.highlight
                          ? "bg-accent-orange text-white shadow-lg shadow-orange-500/25 active:bg-orange-600"
                          : pathname === link.href
                            ? "bg-orange-50/80 text-accent-orange font-bold"
                            : "text-text-primary hover:bg-slate-100/70"
                      )}
                    >
                      <span>{link.label}</span>
                      <ChevronRight className={cn("w-4 h-4 opacity-70", link.highlight && "opacity-100")} />
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2.5 border-t border-slate-100 mt-2.5">
                  <Link
                    href="/admin"
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-text-muted hover:text-navy-primary hover:bg-slate-100/70 transition-all duration-200"
                  >
                    <span>Admin Dashboard</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">Portal</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
