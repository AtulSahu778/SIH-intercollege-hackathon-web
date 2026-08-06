"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VALIDATION } from "@/lib/constants";

interface FemaleBadgeProps {
  count: number;
}

export default function FemaleBadge({ count }: FemaleBadgeProps) {
  const required = VALIDATION.MIN_FEMALE_MEMBERS;
  const satisfied = count >= required;

  return (
    <motion.div
      layout
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-500",
        satisfied
          ? "bg-emerald-50 border-emerald-200"
          : count > 0
          ? "bg-amber-50 border-amber-200"
          : "bg-red-50 border-red-100"
      )}
      role="status"
      aria-live="polite"
      aria-label={`Female members: ${count} of ${required} required`}
    >
      <div className="flex items-center gap-2.5">
        <Users className={cn(
          "w-4 h-4 transition-colors duration-300",
          satisfied ? "text-success" : count > 0 ? "text-amber-500" : "text-error"
        )} />
        <span className="text-sm font-semibold text-text-primary">
          Female Members
        </span>
        <span className="text-xs text-text-muted">
          (min. {required} required)
        </span>
      </div>

      <div className="flex items-center gap-2">
        {/* Count pill */}
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={cn(
            "flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300",
            satisfied
              ? "bg-success text-white"
              : count > 0
              ? "bg-amber-500 text-white"
              : "bg-red-400 text-white"
          )}
        >
          <AnimatePresence mode="wait">
            {satisfied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Check className="w-3 h-3" strokeWidth={3} />
                {count} / {required}
              </motion.span>
            ) : (
              <motion.span
                key="count"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                {count} / {required}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Status text */}
        <AnimatePresence mode="wait">
          {satisfied ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              className="text-xs font-semibold text-success"
            >
              ✓ Satisfied
            </motion.span>
          ) : (
            <motion.span
              key="need"
              initial={{ opacity: 0, x: 4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              className="text-xs font-semibold text-amber-600"
            >
              Need {required - count} more
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
