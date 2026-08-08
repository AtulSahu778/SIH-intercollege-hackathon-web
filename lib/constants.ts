// ─────────────────────────────────────────────────────────────────────────────
// College Info
// ─────────────────────────────────────────────────────────────────────────────
export const COLLEGE = {
  name: "St. Xavier's College, Ranchi",
  shortName: "SXC Ranchi",
  tagline: "Excellence, Knowledge, Leadership",
  iqac: "Internal Quality Assurance Cell (IQAC)",
  address: "",
  email: "",
  phone: "+91-9341936886",
  website: "https://sxcranchi.ac.in",
  estYear: "1944",
};

// ─────────────────────────────────────────────────────────────────────────────
// Hackathon Info
// ─────────────────────────────────────────────────────────────────────────────
export const HACKATHON = {
  name: "Internal Smart India Hackathon 2026",
  shortName: "iSIH 2026",
  year: "2026",
  edition: "SIH 2026 Internal Selection Round",
  sihUrl: "https://sih.gov.in",
  whatsappUrl: "https://chat.whatsapp.com/LZWZi1rK36VJTrDY1sqtLG?s=cl&p=a&ilr=0",
};

export const WHATSAPP_GROUP_URL = HACKATHON.whatsappUrl;

// ─────────────────────────────────────────────────────────────────────────────
// Timeline
// ─────────────────────────────────────────────────────────────────────────────
export const TIMELINE = [
  {
    id: 1,
    phase: "Registrations Open",
    date: "Aug 10, 2026",
    description: "Team leaders register their teams on this portal.",
    status: "upcoming",
    icon: "ClipboardList",
  },
  {
    id: 2,
    phase: "Registration Deadline",
    date: "Sep 5, 2026",
    description: "Last date to submit team registrations and idea presentations.",
    status: "upcoming",
    icon: "Clock",
  },
  {
    id: 3,
    phase: "Internal Hackathon",
    date: "Sep 20–21, 2026",
    description: "24-hour on-campus hackathon. All registered teams participate.",
    status: "upcoming",
    icon: "Zap",
  },
  {
    id: 4,
    phase: "Evaluation & Shortlisting",
    date: "Sep 25, 2026",
    description: "Expert panel evaluates projects. Top teams shortlisted.",
    status: "upcoming",
    icon: "CheckCircle",
  },
  {
    id: 5,
    phase: "SIH 2026 Nomination",
    date: "Oct 1, 2026",
    description: "Shortlisted teams nominated to represent SXC at SIH 2026.",
    status: "upcoming",
    icon: "Trophy",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SXC Ranchi Department Groups
// ─────────────────────────────────────────────────────────────────────────────
export const DEPARTMENT_GROUPS = [
  {
    category: "Computer Science & IT",
    options: [
      "B.Sc. Information Technology",
      "B.Sc. Computer Application",
      "BCA",
    ],
  },
  {
    category: "Science",
    options: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Statistics",
      "Botany",
      "Zoology",
      "Geology",
      "Biotechnology",
    ],
  },
  {
    category: "Commerce & Management",
    options: [
      "Commerce (Regular UG & PG)",
      "Business Administration (BBA)",
      "Banking & Insurance",
      "Financial Market Operation",
      "International Accounts",
    ],
  },
  {
    category: "Vocational & Self-Finance",
    options: [
      "English Language & Literature",
      "Animation & Interior Design",
      "Journalism & Mass Communication",
      "Advertising & Marketing",
      "Office Management & Secretarial Practice",
      "Retail Management",
      "Building Construction Management",
      "Fashion Technology",
    ],
  },
  {
    category: "Arts & Humanities / Others",
    options: [
      "Arts & Humanities",
      "Other Department",
    ],
  },
];

export const DEPARTMENTS = DEPARTMENT_GROUPS.flatMap((g) => g.options);

// ─────────────────────────────────────────────────────────────────────────────
// Academic Years
// ─────────────────────────────────────────────────────────────────────────────
export const ACADEMIC_YEARS = [
  "First Year (1st)",
  "Second Year (2nd)",
  "Third Year (3rd)",
  "Fourth Year (4th)",
];

// ─────────────────────────────────────────────────────────────────────────────
// Hackathon Categories
// ─────────────────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { value: "software", label: "Software", description: "Apps, platforms, AI/ML solutions" },
  { value: "hardware", label: "Hardware", description: "IoT, embedded systems, robotics" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Validation Constants
// ─────────────────────────────────────────────────────────────────────────────
export const VALIDATION = {
  TEAM_SIZE: 6,
  MIN_FEMALE_MEMBERS: 2,
  MAX_PDF_SIZE_MB: 10,
  MAX_PDF_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_DESCRIPTION_WORDS: 300,
  TEAM_ID_PREFIX: "SIH-2026",
};

// ─────────────────────────────────────────────────────────────────────────────
// Idea Presentation Template Info
// ─────────────────────────────────────────────────────────────────────────────
export const TEMPLATE = {
  name: "Official SIH Idea Presentation Format",
  filename: "SIH2025-IDEA-Presentation-Format.pptx",
  downloadUrl: "/api/template",
  format: "PPTX / PDF",
  description: "Official presentation template prescribed for Smart India Hackathon. Teams MUST download and strictly follow this template format. Submissions in any other format will be disqualified.",
};

export const AUTH_LETTER = {
  name: "College Authorization Letter",
  filename: "College-Authorization-letter-SIH2026.docx",
  downloadUrl: "/api/auth-letter",
  format: "PDF",
  maxSizeMB: 5,
  maxSizeBytes: 5 * 1024 * 1024,
  description: "Official authorization letter template. Fill in all 6 member details + up to 2 mentors. Must be signed by the Principal/Director on college letterhead and uploaded as a PDF.",
};


// ─────────────────────────────────────────────────────────────────────────────
// Feature Cards
// ─────────────────────────────────────────────────────────────────────────────
export const FEATURES = [
  {
    icon: "Lightbulb",
    title: "Innovation-First",
    description: "Tackle real-world problems using technology, creativity, and teamwork.",
    color: "from-orange-500/20 to-orange-600/10",
    iconColor: "text-accent-orange",
  },
  {
    icon: "Users",
    title: "Open to All SXC Departments",
    description: "Open for students across all departments and streams of St. Xavier's College, Ranchi.",
    color: "from-cyan-500/20 to-cyan-600/10",
    iconColor: "text-accent-cyan",
  },
  {
    icon: "Target",
    title: "Problem Solving",
    description: "Work on curated problem statements aligned with government & industry needs.",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-400",
  },
  {
    icon: "GraduationCap",
    title: "Expert Mentorship",
    description: "Get guidance from faculty mentors and industry professionals during the event.",
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
  },
  {
    icon: "Globe",
    title: "National Platform",
    description: "Top teams earn the chance to represent SXC Ranchi at Smart India Hackathon 2026.",
    color: "from-green-500/20 to-green-600/10",
    iconColor: "text-success",
  },
  {
    icon: "Award",
    title: "Certificates & Awards",
    description: "All participants receive participation certificates. Winners get merit recognition.",
    color: "from-yellow-500/20 to-yellow-600/10",
    iconColor: "text-yellow-400",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────────────────────────────────────
export const ADMIN_SESSION_KEY = "sxc_sih_admin_session";
