/**
 * ══════════════════════════════════════════════════════════════════════════════
 * INTERNAL SIH 2026 — GOOGLE APPS SCRIPT
 * St. Xavier's College, Ranchi — IQAC
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste this entire file, replacing the default code
 * 3. Set DRIVE_FOLDER_ID below to your Google Drive folder ID
 * 4. Click Deploy → New Deployment → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. Paste it into your .env.local as NEXT_PUBLIC_APPS_SCRIPT_URL
 *
 * SHEET NAMES: "Registrations", "Team Members", "Uploads"
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — Update these before deploying
// ─────────────────────────────────────────────────────────────────────────────
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const DRIVE_FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID"; // ← Replace this!

const SHEET_NAMES = {
  REGISTRATIONS: "Registrations",
  TEAM_MEMBERS: "Team Members",
  UPLOADS: "Uploads",
};

// ─────────────────────────────────────────────────────────────────────────────
// CORS Response Helper
// ─────────────────────────────────────────────────────────────────────────────
function corsResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET Handler — Routes by action param
// ─────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter?.action || "getRegistrations";

    if (action === "getRegistrations") {
      return corsResponse(getRegistrations());
    }

    return corsResponse({ success: false, error: "Unknown action" });
  } catch (err) {
    return corsResponse({ success: false, error: String(err) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler — Routes by action field in body
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;

    if (action === "register") {
      return corsResponse(registerTeam(body));
    }

    if (action === "updateStatus") {
      return corsResponse(updateStatus(body.teamId, body.status));
    }

    return corsResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return corsResponse({ success: false, error: "Parse error: " + String(err) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER TEAM
// ─────────────────────────────────────────────────────────────────────────────
function registerTeam(data) {
  // ── Validate ──────────────────────────────────────────────────────────────
  if (!data.teamName || !data.department || !data.category) {
    return { success: false, error: "Missing required team information" };
  }

  if (!Array.isArray(data.members) || data.members.length !== 6) {
    return { success: false, error: "Exactly 6 members are required" };
  }

  const femaleCount = data.members.filter(m => m.gender === "Female").length;
  if (femaleCount < 2) {
    return { success: false, error: "Minimum 2 female members required" };
  }

  const emails = data.members.map(m => m.email.toLowerCase());
  if (new Set(emails).size !== emails.length) {
    return { success: false, error: "All member emails must be unique" };
  }

  // ── Check for duplicate team registration (same team name or leader email)
  const regSheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  const existingData = regSheet.getDataRange().getValues();
  const leaderEmail = data.members[0]?.email?.toLowerCase();

  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][2]?.toLowerCase() === data.teamName?.toLowerCase()) {
      return { success: false, error: "A team with this name is already registered" };
    }
  }

  // Check in Team Members sheet for duplicate leader email
  const membersSheet = getSheet(SHEET_NAMES.TEAM_MEMBERS);
  const existingMembers = membersSheet.getDataRange().getValues();
  for (let i = 1; i < existingMembers.length; i++) {
    if (existingMembers[i][2] === "Leader" && existingMembers[i][4]?.toLowerCase() === leaderEmail) {
      return { success: false, error: "A registration with this team leader email already exists" };
    }
  }

  // ── Generate Team ID ───────────────────────────────────────────────────────
  const teamId = generateTeamId();

  // ── Upload PDF to Drive ────────────────────────────────────────────────────
  let pdfUrl = "";
  if (data.pdfBase64 && data.pdfFileName) {
    try {
      pdfUrl = uploadPDF(data.pdfBase64, data.pdfFileName, teamId);
    } catch (err) {
      return { success: false, error: "PDF upload failed: " + String(err) };
    }
  } else {
    return { success: false, error: "Idea presentation PDF is required" };
  }

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // ── Save to Registrations sheet ───────────────────────────────────────────
  regSheet.appendRow([
    timestamp,                   // A: Timestamp
    teamId,                      // B: Team ID
    data.teamName,               // C: Team Name
    data.department,             // D: Department
    data.academicYear,           // E: Academic Year
    data.category,               // F: Category
    data.problemStatement,       // G: Problem Statement
    data.ideaTitle,              // H: Idea Title
    data.ideaDescription,        // I: Idea Description
    "Pending",                   // J: Status
  ]);

  // ── Save Team Members ─────────────────────────────────────────────────────
  data.members.forEach((member) => {
    membersSheet.appendRow([
      teamId,                    // A: Team ID
      member.memberType,         // B: Member Type
      member.fullName,           // C: Name
      member.gender,             // D: Gender
      member.email,              // E: Email
      member.mobile,             // F: Mobile
    ]);
  });

  // ── Save Upload record ────────────────────────────────────────────────────
  const uploadsSheet = getSheet(SHEET_NAMES.UPLOADS);
  uploadsSheet.appendRow([
    teamId,                      // A: Team ID
    pdfUrl,                      // B: PDF URL
    timestamp,                   // C: Submission Time
  ]);

  return {
    success: true,
    teamId: teamId,
    message: "Registration successful!",
    pdfUrl: pdfUrl,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET REGISTRATIONS
// ─────────────────────────────────────────────────────────────────────────────
function getRegistrations() {
  const regSheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  const membersSheet = getSheet(SHEET_NAMES.TEAM_MEMBERS);
  const uploadsSheet = getSheet(SHEET_NAMES.UPLOADS);

  const regData = regSheet.getDataRange().getValues();
  const membersData = membersSheet.getDataRange().getValues();
  const uploadsData = uploadsSheet.getDataRange().getValues();

  if (regData.length <= 1) {
    return { success: true, data: [] };
  }

  // Build member and upload lookups
  const membersByTeam = {};
  for (let i = 1; i < membersData.length; i++) {
    const row = membersData[i];
    const teamId = row[0];
    if (!membersByTeam[teamId]) membersByTeam[teamId] = [];
    membersByTeam[teamId].push({
      memberType: row[1],
      fullName: row[2],
      gender: row[3],
      email: row[4],
      mobile: row[5],
    });
  }

  const uploadsByTeam = {};
  for (let i = 1; i < uploadsData.length; i++) {
    const row = uploadsData[i];
    uploadsByTeam[row[0]] = row[1]; // teamId → pdfUrl
  }

  // Build registrations array
  const registrations = [];
  for (let i = 1; i < regData.length; i++) {
    const row = regData[i];
    const teamId = row[1];
    registrations.push({
      timestamp: String(row[0]),
      teamId: teamId,
      teamName: row[2],
      department: row[3],
      academicYear: row[4],
      category: row[5],
      problemStatement: row[6],
      ideaTitle: row[7],
      ideaDescription: row[8],
      status: row[9] || "Pending",
      members: membersByTeam[teamId] || [],
      presentationUrl: uploadsByTeam[teamId] || "",
    });
  }

  return { success: true, data: registrations };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE STATUS
// ─────────────────────────────────────────────────────────────────────────────
function updateStatus(teamId, status) {
  if (!teamId || !status) {
    return { success: false, error: "teamId and status are required" };
  }

  const validStatuses = ["Pending", "Approved", "Rejected"];
  if (!validStatuses.includes(status)) {
    return { success: false, error: "Invalid status. Must be: Pending, Approved, or Rejected" };
  }

  const sheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === teamId) {
      sheet.getRange(i + 1, 10).setValue(status); // Column J = Status
      return { success: true, message: `Status updated to ${status}` };
    }
  }

  return { success: false, error: `Team ID ${teamId} not found` };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD PDF TO DRIVE
// ─────────────────────────────────────────────────────────────────────────────
function uploadPDF(base64Data, fileName, teamId) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

  // Decode base64
  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, "application/pdf", `${teamId}_${fileName}`);

  // Create file in Drive
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE TEAM ID
// ─────────────────────────────────────────────────────────────────────────────
function generateTeamId() {
  const sheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  const lastRow = sheet.getLastRow();
  const count = Math.max(lastRow, 1); // At least 1 (header row)
  const teamNumber = String(count).padStart(3, "0");
  return `SIH-2026-${teamNumber}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET SHEET (create if missing)
// ─────────────────────────────────────────────────────────────────────────────
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);

  if (!sheet) {
    sheet = ss.insertSheet(name);
    setupSheetHeaders(sheet, name);
  }

  return sheet;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP HEADERS (first run)
// ─────────────────────────────────────────────────────────────────────────────
function setupSheetHeaders(sheet, name) {
  const headers = {
    [SHEET_NAMES.REGISTRATIONS]: [
      "Timestamp", "Team ID", "Team Name", "Department", "Academic Year",
      "Category", "Problem Statement", "Idea Title", "Idea Description", "Status"
    ],
    [SHEET_NAMES.TEAM_MEMBERS]: [
      "Team ID", "Member Type", "Name", "Gender", "Email", "Mobile"
    ],
    [SHEET_NAMES.UPLOADS]: [
      "Team ID", "Presentation PDF URL", "Submission Time"
    ],
  };

  const headerRow = headers[name];
  if (headerRow) {
    const range = sheet.getRange(1, 1, 1, headerRow.length);
    range.setValues([headerRow]);
    range.setFontWeight("bold");
    range.setBackground("#0B2545");
    range.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT — Run this manually once after pasting to set up sheets
// ─────────────────────────────────────────────────────────────────────────────
function initializeSheets() {
  Object.values(SHEET_NAMES).forEach(name => getSheet(name));
  SpreadsheetApp.getUi().alert("✅ All sheets initialized successfully!");
}
