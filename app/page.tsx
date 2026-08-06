import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TimelineSection from "@/components/home/TimelineSection";
import EligibilitySection from "@/components/home/EligibilitySection";
import { COLLEGE, HACKATHON } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${HACKATHON.name} | ${COLLEGE.shortName}`,
  description: `Register your team for the Internal SIH 2026 at ${COLLEGE.name}. Top teams will represent SXC at the national Smart India Hackathon 2026.`,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TimelineSection />
      <EligibilitySection />
    </>
  );
}
