import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// In-memory cache for ultra-fast verification (30s TTL)
interface VerifyCacheEntry {
  data: Record<string, unknown>;
  timestamp: number;
}
const verifyCache = new Map<string, VerifyCacheEntry>();
const CACHE_TTL_MS = 30_000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const teamId = searchParams.get("teamId")?.trim().toUpperCase();

  if (!teamId) {
    return NextResponse.json({ success: false, error: "teamId is required" }, { status: 400 });
  }

  // 1. Check in-memory cache
  const cached = verifyCache.get(teamId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
    const mockMatch = /^SIH-2026-\d{3}$/.test(teamId);
    const result = mockMatch
      ? { success: true, exists: true, teamName: "Mock Team (Dev Mode)" }
      : { success: false, exists: false, error: "Team not found" };
    return NextResponse.json(result);
  }

  try {
    // 2. Query dedicated verifyTeamId action
    const url = `${APPS_SCRIPT_URL}?action=verifyTeamId&teamId=${encodeURIComponent(teamId)}`;
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "follow",
    });

    const text = await response.text();
    let data: { success?: boolean; error?: string; alreadySubmitted?: boolean; exists?: boolean; teamName?: string } | null = null;
    try {
      data = JSON.parse(text);
    } catch {
      // not JSON (e.g. HTML or cold start)
    }

    if (data && (data.success !== false || (data.error && !data.error.includes("Unknown action")))) {
      verifyCache.set(teamId, { data, timestamp: Date.now() });
      return NextResponse.json(data);
    }

    // 3. Fallback: If older deployment returns "Unknown action"
    const fallbackUrl = `${APPS_SCRIPT_URL}?action=getRegistrations`;
    const fallbackRes = await fetch(fallbackUrl, { cache: "no-store", redirect: "follow" });
    const fallbackText = await fallbackRes.text();
    
    let fallbackData: { data?: { teamId?: string; teamName?: string }[] } | null = null;
    try {
      fallbackData = JSON.parse(fallbackText);
    } catch {
      console.error("Failed to parse registrations response:", fallbackText.slice(0, 200));
    }

    if (fallbackData && Array.isArray(fallbackData.data)) {
      const match = fallbackData.data.find(
        (r) => r.teamId?.trim().toUpperCase() === teamId
      );

      if (match) {
        const result = {
          success: true,
          exists: true,
          alreadySubmitted: false,
          teamName: match.teamName || "Registered Team",
        };
        verifyCache.set(teamId, { data: result, timestamp: Date.now() });
        return NextResponse.json(result);
      } else {
        const result = {
          success: false,
          exists: false,
          error: "Team ID not found. Please verify your SIH Team ID.",
        };
        return NextResponse.json(result);
      }
    }

    return NextResponse.json({
      success: false,
      error: "Unable to verify Team ID right now. Please verify that your script is deployed as a Web App.",
    }, { status: 500 });
  } catch (error) {
    console.error("verify-team error:", error);
    return NextResponse.json({ success: false, error: "Network error. Please try again." }, { status: 500 });
  }
}



