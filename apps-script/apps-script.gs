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
 * 4. Click Deploy → New Deployment (or Manage Deployments → New Version) → Web App
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL
 * 6. Paste it into your .env.local as NEXT_PUBLIC_APPS_SCRIPT_URL
 *
 * SHEET NAMES:
 *   - "Registrations"  — Stores team information and approval status
 *   - "Team Members"   — Stores leader and member details
 *   - "Teams Idea"     — Stores submitted project ideas
 *   - "Uploads"        — Presentation file links (optional)
 *   - "Auth Letters"   — Authorization letter links (legacy)
 *
 * ACTIONS (POST):
 *   register         — Register a new team
 *   submitIdea       — Submit idea details (saved into "Teams Idea" sheet)
 *   updateStatus     — Admin: update team approval status
 *   verifyTeamId     — Verify a team ID exists
 *   uploadAuthLetter — (Legacy) Upload authorization letter PDF
 *
 * ACTIONS (GET):
 *   getRegistrations — Fetch all teams (Admin dashboard)
 *   verifyTeamId     — Same verify, via GET query param
 */

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION — Update these before deploying
// ─────────────────────────────────────────────────────────────────────────────
const DRIVE_FOLDER_ID = "1myhKtKh60lSuvsRSBuy7wkl6NJB1_0xm";           // Presentations folder
const AUTH_LETTER_FOLDER_ID = "1pUZTHNsHJ7-tX094c9QR12GH5vd6TDLr";    // Auth Letters folder (legacy)

const SHEET_NAMES = {
  REGISTRATIONS: "Registrations",
  TEAM_MEMBERS: "Team Members",
  TEAMS_IDEA: "Teams Idea",
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
// GET Handler
// ─────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || "getRegistrations";

    if (action === "getRegistrations") return corsResponse(getRegistrations());

    if (action === "verifyTeamId") {
      const teamId = e && e.parameter && e.parameter.teamId;
      if (!teamId) return corsResponse({ success: false, error: "teamId parameter is required" });
      return corsResponse(verifyTeamId(teamId));
    }

    return corsResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return corsResponse({ success: false, error: String(err) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    let body = {};
    if (e && e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); }
      catch (parseErr) { body = (e && e.parameter) || {}; }
    } else if (e && e.parameter) {
      body = e.parameter;
    }

    const action = body.action || (e && e.parameter && e.parameter.action);

    if (action === "register")         return corsResponse(registerTeam(body));
    if (action === "submitIdea")       return corsResponse(submitIdeaForTeam(body));
    if (action === "updateStatus")     return corsResponse(updateStatus(body.teamId, body.status));
    if (action === "verifyTeamId")     return corsResponse(verifyTeamId(body.teamId || (e && e.parameter && e.parameter.teamId)));
    if (action === "uploadAuthLetter") return corsResponse(uploadAuthLetterForTeam(body));

    return corsResponse({ success: false, error: "Unknown action: " + action });
  } catch (err) {
    return corsResponse({ success: false, error: "Parse error: " + String(err) });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER TEAM
// ─────────────────────────────────────────────────────────────────────────────
function registerTeam(data) {
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

  // Duplicate check — team name
  const regSheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  const existingData = regSheet.getDataRange().getValues();
  const leaderEmail = data.members[0] && data.members[0].email && data.members[0].email.toLowerCase();

  for (let i = 1; i < existingData.length; i++) {
    if (existingData[i][2] &&
        existingData[i][2].toLowerCase() === data.teamName.toLowerCase()) {
      return { success: false, error: "A team with this name is already registered" };
    }
  }

  // Duplicate check — leader email
  const membersSheet = getSheet(SHEET_NAMES.TEAM_MEMBERS);
  const existingMembers = membersSheet.getDataRange().getValues();
  for (let i = 1; i < existingMembers.length; i++) {
    if (existingMembers[i][1] === "Leader" &&
        existingMembers[i][4] && existingMembers[i][4].toLowerCase() === leaderEmail) {
      return { success: false, error: "A registration with this team leader email already exists" };
    }
  }

  const teamId = generateTeamId();
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  // Save registration row
  regSheet.appendRow([
    timestamp,         // A: Timestamp
    teamId,            // B: Team ID
    data.teamName,     // C: Team Name
    data.department,   // D: Department
    data.academicYear, // E: Academic Year
    data.category,     // F: Category
    "Pending",         // G: Status
  ]);

  // Save team members
  data.members.forEach(function(member) {
    membersSheet.appendRow([
      teamId,
      member.memberType,
      member.fullName,
      member.gender,
      member.email,
      member.mobile,
    ]);
  });

  return {
    success: true,
    teamId: teamId,
    message: "Registration successful! Your team has been registered.",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT IDEA FOR TEAM (Saved directly to "Teams Idea" sheet)
// ─────────────────────────────────────────────────────────────────────────────
function submitIdeaForTeam(data) {
  var teamId           = data.teamId;
  var problemStatement = data.problemStatement;
  var ideaTitle        = data.ideaTitle;
  var ideaDescription  = data.ideaDescription;

  if (!teamId || !problemStatement || !ideaTitle || !ideaDescription) {
    return {
      success: false,
      error: "teamId, problemStatement, ideaTitle, and ideaDescription are required.",
    };
  }

  var normId = String(teamId).trim().toUpperCase();

  // 1. Verify team exists in Registrations sheet
  var regSheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  var regData  = regSheet.getDataRange().getValues();
  var teamRow  = null;

  for (var i = 1; i < regData.length; i++) {
    if (String(regData[i][1]).trim().toUpperCase() === normId) {
      teamRow = regData[i];
      break;
    }
  }

  if (!teamRow) {
    return { success: false, error: "Team ID not found. Please verify your SIH Team ID." };
  }

  var teamName     = teamRow[2] || "";
  var department   = teamRow[3] || "";
  var academicYear = teamRow[4] || "";
  var category     = teamRow[5] || "";

  // 2. Check if team already submitted in "Teams Idea" sheet
  var ideasSheet = getSheet(SHEET_NAMES.TEAMS_IDEA);
  var ideasData  = ideasSheet.getDataRange().getValues();

  for (var j = 1; j < ideasData.length; j++) {
    if (String(ideasData[j][1]).trim().toUpperCase() === normId) {
      return {
        success: false,
        alreadySubmittedIdea: true,
        error: "Team " + teamName + " (" + normId + ") has already submitted an idea in the Teams Idea sheet.",
      };
    }
  }

  // 3. Append to "Teams Idea" sheet
  var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  ideasSheet.appendRow([
    timestamp,        // A: Timestamp
    normId,           // B: Team ID
    teamName,         // C: Team Name
    department,       // D: Department
    academicYear,     // E: Academic Year
    category,         // F: Category
    problemStatement, // G: Problem Statement
    ideaTitle,        // H: Idea Title
    ideaDescription,  // I: Idea Description
  ]);

  console.log("Saved to Teams Idea sheet for team:", normId, "- Title:", ideaTitle);

  return {
    success: true,
    teamId: normId,
    message: "Idea submitted successfully to Teams Idea sheet!",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GET REGISTRATIONS (Admin dashboard)
// Merges Registrations, Team Members, Teams Idea, and Uploads
// ─────────────────────────────────────────────────────────────────────────────
function getRegistrations() {
  var regSheet     = getSheet(SHEET_NAMES.REGISTRATIONS);
  var membersSheet = getSheet(SHEET_NAMES.TEAM_MEMBERS);
  var ideasSheet   = getSheet(SHEET_NAMES.TEAMS_IDEA);
  var uploadsSheet = getSheet(SHEET_NAMES.UPLOADS);

  var regData     = regSheet.getDataRange().getValues();
  var membersData = membersSheet.getDataRange().getValues();
  var ideasData   = ideasSheet.getDataRange().getValues();
  var uploadsData = uploadsSheet.getDataRange().getValues();

  if (regData.length <= 1) return { success: true, data: [] };

  // Build member lookup
  var membersByTeam = {};
  for (var i = 1; i < membersData.length; i++) {
    var row = membersData[i];
    var tid = row[0];
    if (!membersByTeam[tid]) membersByTeam[tid] = [];
    membersByTeam[tid].push({
      memberType: row[1],
      fullName:   row[2],
      gender:     row[3],
      email:      row[4],
      mobile:     row[5],
    });
  }

  // Build ideas lookup from "Teams Idea" sheet
  var ideasByTeam = {};
  for (var m = 1; m < ideasData.length; m++) {
    var iRow = ideasData[m];
    var iTid = String(iRow[1]).trim().toUpperCase();
    ideasByTeam[iTid] = {
      timestamp:        String(iRow[0] || ""),
      problemStatement: iRow[6] || "",
      ideaTitle:        iRow[7] || "",
      ideaDescription:  iRow[8] || "",
    };
  }

  // Build uploads lookup
  var uploadsByTeam = {};
  for (var j = 1; j < uploadsData.length; j++) {
    uploadsByTeam[uploadsData[j][0]] = uploadsData[j][1];
  }

  // Build registrations array
  var registrations = [];
  for (var k = 1; k < regData.length; k++) {
    var r = regData[k];
    var teamId = String(r[1]).trim().toUpperCase();
    var ideaInfo = ideasByTeam[teamId] || {};

    // Support both older layout (status in col G or J) and new layout
    var status = r[6] || r[9] || "Pending";
    if (status !== "Approved" && status !== "Rejected" && status !== "Pending") {
      status = r[9] || "Pending";
    }

    registrations.push({
      timestamp:        String(r[0]),
      teamId:           teamId,
      teamName:         r[2],
      department:       r[3],
      academicYear:     r[4],
      category:         r[5],
      problemStatement: ideaInfo.problemStatement || (r[6] !== status ? r[6] : "") || "",
      ideaTitle:        ideaInfo.ideaTitle || r[7] || "",
      ideaDescription:  ideaInfo.ideaDescription || r[8] || "",
      status:           status,
      ideaSubmittedAt:  ideaInfo.timestamp || r[10] || "",
      members:          membersByTeam[teamId] || [],
      presentationUrl:  uploadsByTeam[teamId] || "",
    });
  }

  return { success: true, data: registrations };
}

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE STATUS
// ─────────────────────────────────────────────────────────────────────────────
function updateStatus(teamId, status) {
  if (!teamId || !status) return { success: false, error: "teamId and status are required" };

  var validStatuses = ["Pending", "Approved", "Rejected"];
  if (validStatuses.indexOf(status) === -1) {
    return { success: false, error: "Invalid status. Must be: Pending, Approved, or Rejected" };
  }

  var sheet = getSheet(SHEET_NAMES.REGISTRATIONS);
  var data  = sheet.getDataRange().getValues();
  var normId = String(teamId).trim().toUpperCase();

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][1]).trim().toUpperCase() === normId) {
      // If status column is col G (7) or col J (10)
      var statusCol = data[0].indexOf("Status") + 1;
      if (statusCol <= 0) statusCol = 7;
      sheet.getRange(i + 1, statusCol).setValue(status);
      return { success: true, message: "Status updated to " + status };
    }
  }

  return { success: false, error: "Team ID " + teamId + " not found" };
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY TEAM ID
// ─────────────────────────────────────────────────────────────────────────────
function verifyTeamId(teamId) {
  if (!teamId) return { success: false, error: "teamId is required" };

  try {
    var normId = String(teamId).trim().toUpperCase();

    // 1. Registrations sheet
    var regSheet = getSheet(SHEET_NAMES.REGISTRATIONS);
    var regData  = regSheet.getDataRange().getValues();
    var teamName = null;

    for (var i = 1; i < regData.length; i++) {
      if (String(regData[i][1]).trim().toUpperCase() === normId) {
        teamName = regData[i][2] || "Registered Team";
        break;
      }
    }

    if (!teamName) {
      return { success: false, exists: false, error: "Team ID not found. Please verify your SIH Team ID." };
    }

    // 2. Teams Idea sheet
    var ideasSheet = getSheet(SHEET_NAMES.TEAMS_IDEA);
    var ideasData  = ideasSheet.getDataRange().getValues();
    var ideaAlreadySubmitted = false;

    for (var k = 1; k < ideasData.length; k++) {
      if (String(ideasData[k][1]).trim().toUpperCase() === normId) {
        ideaAlreadySubmitted = true;
        break;
      }
    }

    // 3. Auth Letters sheet (legacy)
    var authSheet = getSheet(SHEET_NAMES.AUTH_LETTERS);
    var authData  = authSheet.getDataRange().getValues();
    var authLetterSubmitted = false;

    for (var j = 1; j < authData.length; j++) {
      if (String(authData[j][0]).trim().toUpperCase() === normId) {
        authLetterSubmitted = true;
        break;
      }
    }

    return {
      success:              true,
      exists:               true,
      teamName:             teamName,
      alreadySubmittedIdea: ideaAlreadySubmitted,
      alreadySubmitted:     authLetterSubmitted,
    };
  } catch (err) {
    return { success: false, error: "Error verifying team: " + String(err) };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD AUTH LETTER (legacy — kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────
function uploadAuthLetterForTeam(data) {
  var teamId   = data.teamId;
  var base64   = data.base64;
  var fileName = data.fileName;

  if (!teamId || !base64 || !fileName) {
    return { success: false, error: "teamId, base64, and fileName are required." };
  }

  var normId = String(teamId).trim().toUpperCase();
  var verify = verifyTeamId(normId);

  if (!verify.exists)          return { success: false, error: verify.error || "Team not found." };
  if (verify.alreadySubmitted) return { success: false, alreadySubmitted: true, error: "Your team has already submitted an authorization letter." };

  var authSheet    = getSheet(SHEET_NAMES.AUTH_LETTERS);
  var existingData = authSheet.getDataRange().getValues();
  for (var i = 1; i < existingData.length; i++) {
    if (String(existingData[i][0]).trim().toUpperCase() === normId) {
      return { success: false, alreadySubmitted: true, error: "Your team has already submitted an authorization letter." };
    }
  }

  var timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  try {
    var letterUrl = uploadToFolder(base64, fileName, normId, AUTH_LETTER_FOLDER_ID);
    authSheet.appendRow([normId, letterUrl, timestamp]);
    return { success: true, message: "Authorization letter submitted successfully.", url: letterUrl };
  } catch (err) {
    console.error("uploadAuthLetterForTeam error:", String(err));
    return { success: false, error: "Failed to upload file. Please try again." };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD PDF TO DRIVE
// ─────────────────────────────────────────────────────────────────────────────
function uploadPDF(base64Data, fileName, teamId) {
  var folderId = DRIVE_FOLDER_ID;
  if (folderId.indexOf("/folders/") !== -1) {
    folderId = folderId.split("/folders/")[1].split("?")[0].split("/")[0];
  }
  var folder  = DriveApp.getFolderById(folderId);
  var decoded = Utilities.base64Decode(base64Data);
  var blob    = Utilities.newBlob(decoded, "application/pdf", teamId + "_" + fileName);
  var file    = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD FILE TO DRIVE (generic)
// ─────────────────────────────────────────────────────────────────────────────
function uploadToFolder(base64Data, fileName, teamId, folderId) {
  if (folderId.indexOf("/folders/") !== -1) {
    folderId = folderId.split("/folders/")[1].split("?")[0].split("/")[0];
  }
  var folder  = DriveApp.getFolderById(folderId);
  var decoded = Utilities.base64Decode(base64Data);
  var blob    = Utilities.newBlob(decoded, "application/pdf", teamId + "_" + fileName);
  var file    = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE TEAM ID
// ─────────────────────────────────────────────────────────────────────────────
function generateTeamId() {
  var sheet   = getSheet(SHEET_NAMES.REGISTRATIONS);
  var lastRow = sheet.getLastRow();
  var count   = Math.max(lastRow, 1);
  return "SIH-2026-" + String(count).padStart(3, "0");
}

// ─────────────────────────────────────────────────────────────────────────────
// GET SHEET (automatically creates tab and styled headers if missing)
// ─────────────────────────────────────────────────────────────────────────────
function getSheet(name) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    setupSheetHeaders(sheet, name);
  }
  return sheet;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETUP HEADERS
// ─────────────────────────────────────────────────────────────────────────────
function setupSheetHeaders(sheet, name) {
  var headers = {};
  headers[SHEET_NAMES.REGISTRATIONS] = [
    "Timestamp", "Team ID", "Team Name", "Department", "Academic Year", "Category", "Status",
  ];
  headers[SHEET_NAMES.TEAM_MEMBERS] = [
    "Team ID", "Member Type", "Name", "Gender", "Email", "Mobile",
  ];
  headers[SHEET_NAMES.TEAMS_IDEA] = [
    "Timestamp", "Team ID", "Team Name", "Department", "Academic Year",
    "Category", "Problem Statement", "Idea Title", "Idea Description",
  ];
  headers[SHEET_NAMES.UPLOADS] = [
    "Team ID", "Presentation PDF URL", "Submission Time",
  ];
  headers[SHEET_NAMES.AUTH_LETTERS] = [
    "Team ID", "Authorization Letter URL", "Submission Time",
  ];

  var headerRow = headers[name];
  if (headerRow) {
    var range = sheet.getRange(1, 1, 1, headerRow.length);
    range.setValues([headerRow]);
    range.setFontWeight("bold");
    range.setBackground("#0B2545");
    range.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT — Run this manually once from Apps Script editor to create all sheets
// ─────────────────────────────────────────────────────────────────────────────
function initializeSheets() {
  Object.values(SHEET_NAMES).forEach(function(name) { getSheet(name); });
  SpreadsheetApp.getUi().alert("All sheets (including 'Teams Idea') initialized successfully!");
}
