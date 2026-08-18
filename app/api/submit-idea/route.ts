import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";
const TIMEOUT_MS = 60_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { teamId, problemStatement, ideaTitle, ideaDescription } = body;

    if (!teamId || !problemStatement || !ideaTitle || !ideaDescription) {
      return NextResponse.json(
        { success: false, error: "teamId, problemStatement, ideaTitle, and ideaDescription are required." },
        { status: 400 }
      );
    }

    // Mock mode when Apps Script URL is not configured
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      return NextResponse.json({
        success: true,
        message: "Idea submitted successfully (mock mode).",
      });
    }

    const fetchPromise = fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "submitIdea",
        teamId,
        problemStatement,
        ideaTitle,
        ideaDescription,
      }),
      redirect: "follow",
    }).then(async (res) => {
      const text = await res.text();
      return { ok: res.ok, text };
    });

    const timeoutPromise = new Promise<"timeout">((resolve) =>
      setTimeout(() => resolve("timeout"), TIMEOUT_MS)
    );

    const result = await Promise.race([fetchPromise, timeoutPromise]);

    if (result === "timeout") {
      return NextResponse.json({
        success: true,
        message: "Your idea has been submitted and is being processed.",
      });
    }

    if (
      !result.ok ||
      result.text.trim().startsWith("<!DOCTYPE") ||
      result.text.trim().startsWith("<html")
    ) {
      console.error("Apps Script submit-idea error:", result.text.slice(0, 200));
      return NextResponse.json(
        { success: false, error: "Submission failed. Please try again." },
        { status: 502 }
      );
    }

    try {
      const data = JSON.parse(result.text);
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid response from server. Please try again." },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("submit-idea error:", error);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
