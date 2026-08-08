// ─────────────────────────────────────────────────────────────────────────────
// Registration Types
// ─────────────────────────────────────────────────────────────────────────────

export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";
export type MemberType = "Leader" | "Member";
export type RegistrationStatus = "Pending" | "Approved" | "Rejected";
export type HackathonCategory = "software" | "hardware" | "student_innovation";

export interface TeamMember {
  memberType: MemberType;
  fullName: string;
  gender: Gender;
  email: string;
  mobile: string;
}

export interface RegistrationFormData {
  // Section 1 — Team Info
  teamName: string;
  department: string;
  academicYear: string;
  category: HackathonCategory;

  // Section 2 — Team Details (leader + 5 members)
  members: TeamMember[];

  // Section 3 — Project Details
  problemStatement: string;
  ideaTitle: string;
  ideaDescription: string;

}

export interface RegistrationRecord {
  timestamp: string;
  teamId: string;
  teamName: string;
  department: string;
  academicYear: string;
  category: string;
  problemStatement: string;
  ideaTitle: string;
  ideaDescription: string;
  presentationUrl: string;
  status: RegistrationStatus;
  members: TeamMember[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  teamId?: string;
  message?: string;
}

export interface RegistrationSubmitPayload {
  teamName: string;
  department: string;
  academicYear: string;
  category: string;
  problemStatement: string;
  ideaTitle: string;
  ideaDescription: string;
  members: TeamMember[];
  pdfBase64: string;
  pdfFileName: string;
  authLetterBase64: string;
  authLetterFileName: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byDepartment: { name: string; count: number }[];
  byCategory: { name: string; count: number }[];
  genderDistribution: { name: string; value: number }[];
}
