"use client";

import { motion } from "framer-motion";

export default function HackathonEnded() {
  return (
    <div className="fixed inset-0 z-50 bg-white text-slate-900 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8"
      >
        {/* Hackathon Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Internal Smart India Hackathon 2026
        </h1>

        {/* Ended Successfully */}
        <div className="text-3xl sm:text-5xl md:text-6xl font-black text-emerald-600 tracking-tight">
          Ended Successfully!
        </div>

        {/* Divider */}
        <div className="w-16 h-1 bg-slate-200 mx-auto rounded-full my-4" />

        {/* Concluded On Date */}
        <div className="space-y-2">
          <p className="text-lg sm:text-2xl font-medium text-slate-500">
            The Hackathon Successfully Concluded on
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            9th September 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
