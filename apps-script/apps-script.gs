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
const DRIVE_FOLDER_ID = "1myhKtKh60lSuvsRSBuy7wkl6NJB1_0xm"; // Presentations folder
const AUTH_LETTER_FOLDER_ID = "1pUZTHNsHJ7-tX094c9QR12GH5vd6TDLr"; // Authorization Letters folder

const SHEET_NAMES = {
  REGISTRATIONS: "Registrations",
  TEAM_MEMBERS: "Team Members",
  UPLOADS: "Uploads",
  AUTH_LETTERS: "Auth Letters",
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
// PDF upload is queued asynchronously via a time-based trigger so that
// this function returns immediately without blocking on Drive I/O.
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

  // ── Check for duplicate team registration (same team name or leader email) ─
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

  // NOTE: PDF/PPT submission is a separate phase after registration.
  // The pdfBase64 / pdfFileName fields are optional here.

  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // ── Save to Registrations sheet immediately ────────────────────────────────
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

  // ── Save Team Members immediately ─────────────────────────────────────────
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

  // ── Queue PDF upload via PropertiesService + time-based trigger ───────────
  // PDF upload is optional at registration — only queue if payload is present.
  if (data.pdfBase64 && data.pdfFileName) {
    try {
      const props = PropertiesService.getScriptProperties();
      const pendingKey = "pdf_pending_" + teamId;
      props.setProperty(pendingKey, JSON.stringify({
        teamId: teamId,
        pdfBase64: data.pdfBase64,
        pdfFileName: data.pdfFileName,
        timestamp: timestamp,
      }));

      // Create a one-time trigger to fire in 1 minute
      ScriptApp.newTrigger("processPendingPdfUploads")
        .timeBased()
        .after(60 * 1000) // 1 minute from now
        .create();
    } catch (triggerErr) {
      // Trigger creation failed — attempt synchronous fallback upload
      console.warn("Async trigger failed, attempting sync upload:", triggerErr);
      try {
        const pdfUrl = uploadPDF(data.pdfBase64, data.pdfFileName, teamId);
        const uploadsSheet = getSheet(SHEET_NAMES.UPLOADS);
        uploadsSheet.appendRow([teamId, pdfUrl, timestamp]);
      } catch (uploadErr) {
        // Log but don't fail — data is already saved
        console.error("Sync PDF upload also failed:", uploadErr);
      }
    }
  }

  // ── Queue Auth Letter upload ──────────────────────────────────────────────
  // Required — queue for async upload to the Auth Letters Drive folder.
  if (data.authLetterBase64 && data.authLetterFileName) {
    try {
      const props = PropertiesService.getScriptProperties();
      const letterKey = "auth_letter_pending_" + teamId;
      props.setProperty(letterKey, JSON.stringify({
        teamId: teamId,
        base64: data.authLetterBase64,
        fileName: data.authLetterFileName,
        timestamp: timestamp,
      }));

      ScriptApp.newTrigger("processPendingAuthLetters")
        .timeBased()
        .after(60 * 1000)
        .create();
    } catch (triggerErr) {
      console.warn("Auth letter trigger failed, attempting sync upload:", triggerErr);
      try {
        const letterUrl = uploadToFolder(data.authLetterBase64, data.authLetterFileName, teamId, AUTH_LETTER_FOLDER_ID);
        const authSheet = getSheet(SHEET_NAMES.AUTH_LETTERS);
        authSheet.appendRow([teamId, letterUrl, timestamp]);
      } catch (uploadErr) {
        console.error("Sync auth letter upload failed:", uploadErr);
      }
    }
  }

  // ── Respond immediately ───────────────────────────────────────────────────
  return {
    success: true,
    teamId: teamId,
    message: "Registration successful! Your team has been registered.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC PDF UPLOAD PROCESSOR
// Called by the time-based trigger created in registerTeam().
// Reads all pending PDF jobs from PropertiesService, uploads them to Drive,
// and records the URL in the Uploads sheet.
// ─────────────────────────────────────────────────────────────────────────────
function processPendingPdfUploads() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();
  const uploadsSheet = getSheet(SHEET_NAMES.UPLOADS);

  let processed = 0;

  for (const key in allProps) {
    if (!key.startsWith("pdf_pending_")) continue;

    try {
      const job = JSON.parse(allProps[key]);
      const pdfUrl = uploadPDF(job.pdfBase64, job.pdfFileName, job.teamId);

      uploadsSheet.appendRow([
        job.teamId,    // A: Team ID
        pdfUrl,        // B: PDF URL
        job.timestamp, // C: Submission Time
      ]);

      props.deleteProperty(key);
      processed++;
      console.log("PDF uploaded for team:", job.teamId, "->", pdfUrl);
    } catch (err) {
      console.error("Failed to upload PDF for key:", key, String(err));
      // Leave the property so it can be retried on the next trigger run
    }
  }

  // Clean up completed triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "processPendingPdfUploads") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  console.log("processPendingPdfUploads: processed", processed, "job(s)");
}

// ─────────────────────────────────────────────────────────────────────────────
// ASYNC AUTH LETTER UPLOAD PROCESSOR
// Called by the time-based trigger created in registerTeam().
// Reads all pending auth letter jobs, uploads to the Auth Letters Drive folder,
// and records the URL in the Auth Letters sheet.
// ─────────────────────────────────────────────────────────────────────────────
function processPendingAuthLetters() {
  const props = PropertiesService.getScriptProperties();
  const allProps = props.getProperties();
  const authSheet = getSheet(SHEET_NAMES.AUTH_LETTERS);

  let processed = 0;

  for (const key in allProps) {
    if (!key.startsWith("auth_letter_pending_")) continue;

    try {
      const job = JSON.parse(allProps[key]);
      const letterUrl = uploadToFolder(job.base64, job.fileName, job.teamId, AUTH_LETTER_FOLDER_ID);

      authSheet.appendRow([
        job.teamId,    // A: Team ID
        letterUrl,     // B: File URL
        job.timestamp, // C: Submission Time
      ]);

      props.deleteProperty(key);
      processed++;
      console.log("Auth letter uploaded for team:", job.teamId, "->", letterUrl);
    } catch (err) {
      console.error("Failed to upload auth letter for key:", key, String(err));
      // Leave the property so it can be retried on the next trigger run
    }
  }

  // Clean up completed triggers
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "processPendingAuthLetters") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  console.log("processPendingAuthLetters: processed", processed, "job(s)");
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
  let folderId = DRIVE_FOLDER_ID;
  if (folderId.includes("/folders/")) {
    folderId = folderId.split("/folders/")[1].split("?")[0].split("/")[0];
  }
  const folder = DriveApp.getFolderById(folderId);

  // Decode base64
  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, "application/pdf", `${teamId}_${fileName}`);

  // Create file in Drive
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}
// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD FILE TO DRIVE (generic — supports any folder)
// ─────────────────────────────────────────────────────────────────────────────
function uploadToFolder(base64Data, fileName, teamId, folderId) {
  // Strip any full URL down to just the ID
  if (folderId.includes("/folders/")) {
    folderId = folderId.split("/folders/")[1].split("?")[0].split("/")[0];
  }
  const folder = DriveApp.getFolderById(folderId);

  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, "application/pdf", `${teamId}_${fileName}`);

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return file.getUrl();
}


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
    [SHEET_NAMES.AUTH_LETTERS]: [
      "Team ID", "Authorization Letter URL", "Submission Time"
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
