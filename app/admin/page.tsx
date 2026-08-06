"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import sxcLogo from "@/app/images/sxclogo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COLLEGE, HACKATHON, ADMIN_SESSION_KEY } from "@/lib/constants";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 600)); // UX delay

    const correctPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin@sxc2026";

    if (password === correctPassword) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      toast.success("Welcome, Admin!", { description: "Loading dashboard…" });
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password. Please try again.");
      toast.error("Authentication failed");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-navy-primary relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-orange/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-cyan/8 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-navy-primary to-navy-secondary px-8 py-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl bg-white p-1.5 shadow-lg border border-white/20 overflow-hidden">
              <Image src={sxcLogo} alt="College Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-black text-white mb-1">Admin Access</h1>
            <p className="text-white/60 text-xs">{HACKATHON.name}</p>
            <p className="text-white/40 text-xs mt-0.5">{COLLEGE.shortName}</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="flex items-center gap-2 mb-6 text-text-muted">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Enter your admin password to continue</span>
            </div>

            <form onSubmit={handleLogin} noValidate>
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-semibold text-text-primary mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    error={!!error}
                    className="pr-12"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-1.5 text-xs text-error mt-1.5"
                    role="alert"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    {error}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !password}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating…
                  </>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </form>

            <p className="text-center text-xs text-text-muted mt-5">
              For access issues, contact{" "}
              <a href={`mailto:${COLLEGE.email}`} className="text-accent-orange hover:underline">
                {COLLEGE.email}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
