"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { COLLEGE, HACKATHON } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guidelines", label: "Guidelines" },
  { href: "/register", label: "Register", highlight: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHeroSection, setIsHeroSection] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setIsHeroSection(window.scrollY < 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isHomePage = pathname === "/";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm"
            : isHomePage
            ? "bg-transparent"
            : "bg-navy-primary/95 backdrop-blur-xl border-b border-white/10"
        )}
        style={{ paddingLeft: "env(safe-area-inset-left)", paddingRight: "env(safe-area-inset-right)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Go to homepage">
              <div className={cn(
                "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                "bg-accent-orange group-hover:bg-orange-500 shadow-md group-hover:shadow-lg"
              )}>
                <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="hidden sm:block">
                <div className={cn(
                  "text-sm font-bold leading-none transition-colors duration-200",
                  scrolled ? "text-navy-primary" : "text-white"
                )}>
                  {HACKATHON.shortName}
                </div>
                <div className={cn(
                  "text-xs mt-0.5 transition-colors duration-200",
                  scrolled ? "text-text-muted" : "text-white/60"
                )}>
                  {COLLEGE.shortName}
                </div>
              </div>
              {/* Mobile logo text */}
              <div className="sm:hidden">
                <div className={cn(
                  "text-sm font-bold transition-colors duration-200",
                  scrolled ? "text-navy-primary" : "text-white"
                )}>
                  iSIH 2026
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
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      pathname === link.href
                        ? scrolled
                          ? "text-accent-orange bg-orange-50"
                          : "text-accent-orange bg-white/10"
                        : scrolled
                        ? "text-text-primary hover:text-accent-orange hover:bg-slate-50"
                        : "text-white/80 hover:text-white hover:bg-white/10"
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
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname.startsWith("/admin")
                    ? scrolled
                      ? "text-accent-orange bg-orange-50"
                      : "text-accent-orange bg-white/10"
                    : scrolled
                    ? "text-text-muted hover:text-text-primary hover:bg-slate-50"
                    : "text-white/50 hover:text-white/80 hover:bg-white/10"
                )}
              >
                Admin
              </Link>
            </nav>

            {/* Mobile Hamburger */}
            <button
              className={cn(
                "md:hidden flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200",
                scrolled ? "text-navy-primary hover:bg-slate-50" : "text-white hover:bg-white/10"
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
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

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
              className="fixed inset-0 z-40 bg-navy-primary/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              ref={menuRef}
              id="mobile-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-16 left-4 right-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden md:hidden"
            >
              <nav className="p-4 space-y-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 touch-target",
                        link.highlight
                          ? "bg-accent-orange text-white shadow-md"
                          : pathname === link.href
                          ? "bg-orange-50 text-accent-orange"
                          : "text-text-primary hover:bg-slate-50"
                      )}
                    >
                      {link.label}
                      {link.highlight && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-3 rounded-xl text-sm text-text-muted hover:bg-slate-50 transition-colors duration-200"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar on non-hero pages */}
      {pathname !== "/" && <div className="h-16 lg:h-18" />}
    </>
  );
}
