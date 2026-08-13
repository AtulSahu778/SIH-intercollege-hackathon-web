import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

const MOCK_TEAMS = Array.from({ length: 11 }, (_, i) => {
  const num = String(i + 1).padStart(3, "0");
  return {
    teamId: `SIH-2026-${num}`,
    teamName: `Team ${i + 1}`,
    department: "SXC Ranchi",
  };
});

export async function GET() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
    return NextResponse.json({
      success: true,
      teams: MOCK_TEAMS,
    });
  }

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?action=getRegistrations`, {
      cache: "no-store",
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json({ success: true, teams: MOCK_TEAMS });
    }

    const data = await response.json();
    if (data && Array.isArray(data.data) && data.data.length > 0) {
      const teams = data.data.map((r: { teamId?: string; teamName?: string; department?: string; members?: { memberType?: string; fullName?: string }[] }) => {
        const leader = r.members?.find((m) => m.memberType === "Leader")?.fullName;
        return {
          teamId: r.teamId || "",
          teamName: r.teamName || "Unnamed Team",
          department: r.department || "",
          leaderName: leader || "",
        };
      }).filter((t: { teamId: string }) => Boolean(t.teamId));

      return NextResponse.json({ success: true, teams });
    }

    return NextResponse.json({ success: true, teams: MOCK_TEAMS });
  } catch (error) {
    console.error("teams fetch error:", error);
    return NextResponse.json({ success: true, teams: MOCK_TEAMS });
  }
}
