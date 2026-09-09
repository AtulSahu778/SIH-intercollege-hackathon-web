import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import TimelineSection from "@/components/home/TimelineSection";
import EligibilitySection from "@/components/home/EligibilitySection";
import HackathonEnded from "@/components/home/HackathonEnded";
import { COLLEGE, HACKATHON, HACKATHON_ENDED, HACKATHON_ENDED_DATE } from "@/lib/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: HACKATHON_ENDED
    ? `${HACKATHON.name} — Concluded Successfully | ${COLLEGE.shortName}`
    : `${HACKATHON.name} | ${COLLEGE.shortName}`,
  description: HACKATHON_ENDED
    ? `The Internal Smart India Hackathon 2026 at ${COLLEGE.name} concluded successfully on ${HACKATHON_ENDED_DATE}. Evaluation and nominations for SIH 2026 national round are in progress.`
    : `Register your team for the Internal SIH 2026 at ${COLLEGE.name}. Top teams will represent SXC at the national Smart India Hackathon 2026.`,
};

export default function HomePage() {
  if (HACKATHON_ENDED) {
    return <HackathonEnded />;
  }

  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <TimelineSection />
      <EligibilitySection />
    </>
  );
}
