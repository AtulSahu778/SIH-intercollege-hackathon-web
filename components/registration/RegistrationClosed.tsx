"use client";

import { motion } from "framer-motion";
import { Clock, AlertCircle, Home, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { COLLEGE, REGISTRATION_DEADLINE } from "@/lib/constants";

export default function RegistrationClosed() {
  const deadlineStr = REGISTRATION_DEADLINE.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white rounded-3xl border border-red-100 shadow-2xl shadow-red-100/50 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
          </div>
          
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6"
          >
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-red-100 relative z-10">
              <Clock className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.35 }}
            className="relative z-10 text-3xl sm:text-4xl font-black text-red-600 mb-3 tracking-tight"
          >
            Registration Closed
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.45 }}
            className="relative z-10 text-red-900/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
          >
            The registration deadline has passed
          </motion.p>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-6">
          {/* Deadline Info */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-900 mb-1">Strict Deadline Reached</h3>
                <p className="text-sm text-red-800/80 leading-relaxed">
                  Team registrations were open until{" "}
                  <strong className="font-bold text-red-900">{deadlineStr}</strong>.
                  No new registrations or late submissions will be accepted.
                </p>
              </div>
            </div>
          </div>

          {/* What to Do */}
          <div>
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">?</span>
              What can you do?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-slate-600">1</span>
                </div>
                <p>
                  If you believe there's an exceptional circumstance, contact the IQAC office at{" "}
                  <a href={`mailto:${COLLEGE.email}`} className="font-semibold text-accent-orange hover:underline">
                    {COLLEGE.email}
                  </a>
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-slate-600">2</span>
                </div>
                <p>
                  Already registered teams can still submit their authorization letters through the portal
                </p>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-slate-600">3</span>
                </div>
                <p>
                  Watch for next year's hackathon announcement on the college website
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <Button asChild variant="default" size="lg" className="flex-1 rounded-xl">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 rounded-xl">
              <a href={`mailto:${COLLEGE.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Contact IQAC
              </a>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
