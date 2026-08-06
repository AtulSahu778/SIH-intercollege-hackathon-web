import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      // Return mock response for development when Apps Script is not configured
      console.warn("Apps Script URL not configured. Returning mock response.");
      const mockTeamId = `SIH-2026-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`;
      return NextResponse.json({
        success: true,
        teamId: mockTeamId,
        message: "Registration saved (mock mode — configure Apps Script URL)",
      });
    }

    // Forward to Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...body, action: "register" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { success: false, error: `Apps Script error: ${errorText}` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
