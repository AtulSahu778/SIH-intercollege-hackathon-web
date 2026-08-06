import { RegistrationSubmitPayload, ApiResponse, RegistrationRecord } from "@/types/registration";

const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL || "";

// ─────────────────────────────────────────────────────────────────────────────
// Submit Registration
// ─────────────────────────────────────────────────────────────────────────────
export async function submitRegistration(
  payload: RegistrationSubmitPayload
): Promise<ApiResponse<{ teamId: string }>> {
  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, action: "register" }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: errorText || "Submission failed. Please try again." };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Network error. Please check your connection and try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Get All Registrations (Admin)
// ─────────────────────────────────────────────────────────────────────────────
export async function getRegistrations(): Promise<ApiResponse<RegistrationRecord[]>> {
  try {
    const response = await fetch("/api/registrations", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to fetch registrations." };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return { success: false, error: "Network error. Could not load registrations." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Update Registration Status (Admin)
// ─────────────────────────────────────────────────────────────────────────────
export async function updateRegistrationStatus(
  teamId: string,
  status: "Approved" | "Rejected" | "Pending"
): Promise<ApiResponse> {
  try {
    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateStatus", teamId, status }),
    });

    if (!response.ok) {
      return { success: false, error: "Failed to update status." };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "Network error." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Convert File to Base64
// ─────────────────────────────────────────────────────────────────────────────
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export { APPS_SCRIPT_URL };
