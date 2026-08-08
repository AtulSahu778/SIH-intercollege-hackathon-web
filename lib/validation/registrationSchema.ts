import { z } from "zod";
import { VALIDATION } from "@/lib/constants";

const genderEnum = z.enum(["Male", "Female", "Other", "Prefer not to say"]);

const memberSchema = z.object({
  memberType: z.enum(["Leader", "Member"]),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Name too long"),
  gender: genderEnum,
  email: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
});

export const registrationSchema = z
  .object({
    // Section 1
    teamName: z
      .string()
      .min(3, "Team name must be at least 3 characters")
      .max(60, "Team name is too long"),
    department: z.union([
      z.array(z.string()).min(1, "Please select at least one department"),
      z.string().min(1, "Please select at least one department")
    ]),
    academicYear: z.string().min(1, "Please select academic year"),
    category: z.enum(["software", "hardware", "student_innovation"], {
      errorMap: () => ({ message: "Please select a hackathon category" }),
    }),

    // Section 2 — exactly 6 members (1 leader + 5)
    members: z
      .array(memberSchema)
      .length(VALIDATION.TEAM_SIZE, `Exactly ${VALIDATION.TEAM_SIZE} members required`),

    // Optional Project Details
    problemStatement: z.string().optional(),
    ideaTitle: z.string().optional(),
    ideaDescription: z.string().optional(),
  })
  // ── Refinements ──────────────────────────────────────────────────────────
  .refine(
    (data) => {
      const femaleCount = data.members.filter((m) => m.gender === "Female").length;
      return femaleCount >= VALIDATION.MIN_FEMALE_MEMBERS;
    },
    {
      message: `Minimum ${VALIDATION.MIN_FEMALE_MEMBERS} female members are required`,
      path: ["members"],
    }
  )
  .refine(
    (data) => {
      const emails = data.members.map((m) => m.email.toLowerCase());
      return new Set(emails).size === emails.length;
    },
    {
      message: "All member email addresses must be unique",
      path: ["members"],
    }
  )
  .refine(
    (data) => {
      const mobiles = data.members.map((m) => m.mobile);
      return new Set(mobiles).size === mobiles.length;
    },
    {
      message: "All member mobile numbers must be unique",
      path: ["members"],
    }
  )
;

export type RegistrationSchemaType = z.infer<typeof registrationSchema>;
