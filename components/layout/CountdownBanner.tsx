"use client";

import { useEffect, useState } from "react";
import { Zap, Timer } from "lucide-react";
import { PORTAL_CLOSED } from "@/lib/constants";

const HACKATHON_DATE = new Date("2026-09-07T09:00:00+05:30");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(): TimeLeft {
  const total = HACKATHON_DATE.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, total };
}

function Tile({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white/10 rounded-lg px-3 py-1.5 min-w-[48px]">
      <span className="text-lg sm:text-2xl font-black tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-white/60 mt-0.5">
        {label}
      </span>
    </div>
  );
}

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!PORTAL_CLOSED) return null;
  if (timeLeft === null) return null;

  const hackathonOver = timeLeft.total <= 0;

  if (hackathonOver) return null;

  return (
    <div className="w-full relative z-[60] overflow-hidden bg-gradient-to-r from-navy-primary via-[#1a2a6c] to-navy-primary border-b border-white/10">
      {/* subtle animated shimmer */}
      <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.04)_50%,transparent_60%)] animate-[shimmer_3s_linear_infinite] bg-[length:200%_100%] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left — label */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent-orange/20 flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-accent-orange" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-black text-sm sm:text-base leading-tight tracking-tight">
              Internal Hackathon — 7 September 2026
            </p>
            <p className="text-white/55 text-[11px] sm:text-xs font-medium">
              iSIH 2026 · St. Xavier&apos;s College, Ranchi
            </p>
          </div>
        </div>

        {/* Right — countdown */}
        <div className="flex items-center gap-2">
          <Timer className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
          <span className="text-white/40 text-xs font-medium mr-1">Starts in</span>
          <div className="flex items-center gap-1.5">
            <Tile value={timeLeft.days} label="days" />
            <span className="text-white/30 font-bold text-lg mb-1">:</span>
            <Tile value={timeLeft.hours} label="hrs" />
            <span className="text-white/30 font-bold text-lg mb-1">:</span>
            <Tile value={timeLeft.minutes} label="min" />
            <span className="text-white/30 font-bold text-lg mb-1">:</span>
            <Tile value={timeLeft.seconds} label="sec" />
          </div>
        </div>
      </div>
    </div>
  );
}
