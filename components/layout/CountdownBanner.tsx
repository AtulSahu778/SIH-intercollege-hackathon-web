"use client";

import { useEffect, useState } from "react";
import { Timer, AlertCircle, Lock } from "lucide-react";
import { REGISTRATION_DEADLINE } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(): TimeLeft {
  const total = REGISTRATION_DEADLINE.getTime() - Date.now();
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, total };
}

function Digit({ value, label }: { value: number; label: string }) {
  const display = String(value).padStart(2, "0");
  return (
    <div className="flex items-baseline gap-0.5">
      <span className="font-semibold text-sm sm:text-base tabular-nums">
        {display}
      </span>
      <span className="text-[10px] font-medium text-white/70 uppercase">
        {label}
      </span>
    </div>
  );
}

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const t = getTimeLeft();
      setTimeLeft(t);
      setUrgent(t.total > 0 && t.total < 1000 * 60 * 60);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft === null) return null;

  const isClosed = timeLeft.total <= 0;

  if (isClosed) {
    return (
      <div className="w-full bg-red-700 text-white text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium relative z-[60]">
        <Lock className="w-4 h-4 flex-shrink-0" />
        <span>Registration is closed</span>
      </div>
    );
  }

  return (
    <div
      className={`w-full text-white py-2 px-4 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-1 relative z-[60] transition-colors duration-300 ${
        urgent
          ? "bg-red-600 border-b border-red-700"
          : "bg-accent-orange border-b border-orange-600"
      }`}
    >
      <div className="flex items-center gap-2">
        {urgent ? (
          <AlertCircle className="w-4 h-4 flex-shrink-0 opacity-90" />
        ) : (
          <Timer className="w-4 h-4 flex-shrink-0 opacity-90" />
        )}
        <span className="text-sm font-medium">
          Registration closes Thu, 13 Aug at midnight
        </span>
      </div>

      <div className="hidden sm:block w-px h-4 bg-white/20 mx-1" />

      <div className="flex items-center gap-3">
        {timeLeft.days > 0 && <Digit value={timeLeft.days} label="d" />}
        <Digit value={timeLeft.hours} label="h" />
        <Digit value={timeLeft.minutes} label="m" />
        <Digit value={timeLeft.seconds} label="s" />
      </div>
    </div>
  );
}
