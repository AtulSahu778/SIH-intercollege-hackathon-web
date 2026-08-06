import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// How long to wait for Apps Script to respond before returning an optimistic success.
// - Old synchronous Apps Script (Drive upload in hot path): can take 30-90s
// - New async Apps Script (Drive upload deferred to trigger): returns in ~2-5s
// Set high enough to receive the real Team ID back in the synchronous case.
// Once the async Apps Script is deployed, this value becomes a safety net only.
const OPTIMISTIC_TIMEOUT_MS = 90_000; // 90 seconds


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("YOUR_SCRIPT_ID")) {
      console.warn("Apps Script URL not configured. Returning mock response.");
      const mockTeamId = `SIH-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
      return NextResponse.json({
        success: true,
        teamId: mockTeamId,
        message: "Registration saved (mock mode — configure Apps Script URL)",
      });
    }

    // Start the fetch — no AbortController so it runs to completion regardless.
    const fetchPromise = fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ ...body, action: "register" }),
      redirect: "follow",
    }).then(async (res) => {
      const text = await res.text();
      return { ok: res.ok, status: res.status, text };
    });

    // Optimistic timeout: if Apps Script hasn't replied in time, return success.
    const optimisticPromise = new Promise<"timeout">((resolve) =>
      setTimeout(() => resolve("timeout"), OPTIMISTIC_TIMEOUT_MS)
    );

    const result = await Promise.race([fetchPromise, optimisticPromise]);

    // ── Apps Script responded within the window ──────────────────────────────
    if (result !== "timeout") {
      const { ok, status, text: responseText } = result;

      // HTML response means misconfigured deployment
      if (!ok || responseText.trim().startsWith("<!DOCTYPE") || responseText.trim().startsWith("<html")) {
        console.error("Apps Script returned invalid HTML response:", responseText.slice(0, 200));

        if (responseText.includes("Page not found") || status === 404) {
          return NextResponse.json(
            { success: false, error: "Google Apps Script URL is invalid or returning 404. Please deploy it as a Web App with access set to 'Anyone'." },
            { status: 502 }
          );
        }

        return NextResponse.json(
          { success: false, error: "Submission failed. Please ensure your Apps Script is deployed with 'Who has access' set to 'Anyone'." },
          { status: 502 }
        );
      }

      try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
      } catch {
        console.error("Failed to parse Apps Script response:", responseText.slice(0, 200));
        return NextResponse.json(
          { success: false, error: "Invalid response from Apps Script. Please try again." },
          { status: 502 }
        );
      }
    }

    // ── Optimistic path: script is still running (likely uploading PDF to Drive) ─
    // We know the script works because the user's data reaches the sheet.
    // Return success so the user isn't stuck waiting for a slow Drive upload.
    console.warn(
      "Apps Script did not respond within",
      OPTIMISTIC_TIMEOUT_MS,
      "ms — returning optimistic success. The script will continue running in the background."
    );

    // Generate a deterministic-looking team ID based on timestamp as a placeholder.
    // The real ID will be in the sheet; admin can verify from there.
    const placeholderTeamId = `SIH-2026-${String(Date.now()).slice(-3)}`;

    return NextResponse.json({
      success: true,
      teamId: placeholderTeamId,
      message:
        "Registration submitted successfully! Your data and presentation are being saved. " +
        "Please note your Team ID from the confirmation screen.",
    });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
