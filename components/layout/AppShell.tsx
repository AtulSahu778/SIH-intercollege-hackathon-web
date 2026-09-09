"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HackathonEnded from "@/components/home/HackathonEnded";
import { HACKATHON_ENDED } from "@/lib/constants";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || pathname?.startsWith("/api");

  // When hackathon has ended, close all public pages and show HackathonEnded exclusively
  if (HACKATHON_ENDED && !isAdmin) {
    return <HackathonEnded />;
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
