import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

export async function GET() {
  try {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      // Return empty mock data for development
      console.warn("Apps Script URL not configured. Returning mock data.");
      return NextResponse.json({
        success: true,
        data: [],
        message: "No data — configure NEXT_PUBLIC_APPS_SCRIPT_URL",
      });
    }

    const response = await fetch(
      `${APPS_SCRIPT_URL}?action=getRegistrations`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch from Apps Script" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Registrations GET error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      return NextResponse.json({
        success: true,
        message: "Status updated (mock mode)",
      });
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, action: "updateStatus" }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Apps Script error" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Registrations POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
