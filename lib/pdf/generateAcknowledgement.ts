import { RegistrationRecord } from "@/types/registration";
import jsPDF from "jspdf";
import { COLLEGE, HACKATHON } from "@/lib/constants";
import { format } from "date-fns";

export function generateAcknowledgementPDF(
  registration: Partial<RegistrationRecord> & {
    teamId: string;
    teamName: string;
    ideaTitle?: string;
    members?: RegistrationRecord["members"];
  }
): void {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = doc.internal.pageSize.getWidth();   // 210
  const H = doc.internal.pageSize.getHeight();  // 297
  const m = 16; // margin
  const cw = W - m * 2;                         // content width

  // ── Palette ──────────────────────────────────────────────────────────────
  const navy:    [number, number, number] = [11,  37,  69];
  const navyMid: [number, number, number] = [18,  60, 122];
  const orange:  [number, number, number] = [255, 122, 26];
  const orangeL: [number, number, number] = [255, 237, 213];
  const green:   [number, number, number] = [16,  185, 129];
  const greenL:  [number, number, number] = [209, 250, 229];
  const white:   [number, number, number] = [255, 255, 255];
  const slate50: [number, number, number] = [248, 250, 252];
  const slate100:[number, number, number] = [241, 245, 249];
  const slate400:[number, number, number] = [148, 163, 184];
  const slate700:[number, number, number] = [51,  65,  85];
  const ink:     [number, number, number] = [15,  23,  42];

  let y = 0;

  // ════════════════════════════════════════════════════════════════════════════
  // 1. FULL-WIDTH HEADER BAND
  // ════════════════════════════════════════════════════════════════════════════
  // Dark navy base
  doc.setFillColor(...navy);
  doc.rect(0, 0, W, 52, "F");

  // Decorative accent strip (orange) along top edge
  doc.setFillColor(...orange);
  doc.rect(0, 0, W, 3, "F");

  // Dot-grid watermark pattern (subtle circles)
  doc.setFillColor(255, 255, 255);
  for (let row = 8; row < 52; row += 8) {
    for (let col = 4; col < W; col += 12) {
      doc.circle(col, row, 0.5, "F");
    }
  }

  // Hackathon short name (large, bold)
  doc.setTextColor(...white);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(HACKATHON.shortName, m, 18);

  // Full hackathon name (smaller, below)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 215, 235);
  doc.text(HACKATHON.name, m, 25);

  // College name right-aligned
  doc.setFontSize(7.5);
  doc.setTextColor(200, 215, 235);
  doc.text(COLLEGE.name, W - m, 18, { align: "right" });
  doc.setFontSize(7);
  doc.text(COLLEGE.shortName, W - m, 25, { align: "right" });

  // "REGISTRATION ACKNOWLEDGEMENT" label at bottom of header
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...orange);
  doc.text("REGISTRATION ACKNOWLEDGEMENT", m, 43);

  // Divider line inside header
  doc.setDrawColor(...navyMid);
  doc.setLineWidth(0.3);
  doc.line(m, 46, W - m, 46);

  // Timestamp
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(150, 170, 195);
  const now = new Date();
  doc.text(`Generated: ${format(now, "dd MMM yyyy, hh:mm a")}`, W - m, 43, { align: "right" });

  y = 58;

  // ════════════════════════════════════════════════════════════════════════════
  // 2. TICKET TEAM ID + STATUS
  // ════════════════════════════════════════════════════════════════════════════
  const slate200: [number, number, number] = [226, 232, 240];

  // Outer background box
  doc.setFillColor(...slate50);
  doc.roundedRect(m, y, cw, 24, 2, 2, "F");

  // Label
  doc.setTextColor(...slate400);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("YOUR TEAM ID", W / 2, y + 4.5, { align: "center" });

  // Ticket Box
  const tw = cw * 0.75;
  const tx = m + (cw - tw) / 2;
  const ty = y + 6.5;
  const th = 11;
  
  doc.setDrawColor(...slate200);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(tx, ty, tw, th, 1.5, 1.5, "FD");
  doc.setLineDashPattern([], 0); // reset dash

  // Value
  doc.setTextColor(...navy);
  doc.setFontSize(16);
  doc.setFont("courier", "bold"); // monospace
  doc.text(registration.teamId, W / 2, ty + 8, { align: "center" });

  // Side Cutouts (filled with slate50 to match outer box, erasing ticket border)
  doc.setFillColor(...slate50);
  // doc.circle(x, y, r, style)
  doc.circle(tx, ty + th / 2, 2.5, "F");
  doc.circle(tx + tw, ty + th / 2, 2.5, "F");
  
  // Cutout borders (arc-like simulation)
  doc.setDrawColor(...slate200);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([1.5, 1.5], 0);
  // Just a simple circle stroke over the cutout to restore the dashed edge
  doc.circle(tx, ty + th / 2, 2.5, "S");
  doc.circle(tx + tw, ty + th / 2, 2.5, "S");
  doc.setLineDashPattern([], 0);

  // Status Badge
  const statusW = 40;
  const statusX = W / 2 - statusW / 2;
  doc.setFillColor(...greenL);
  doc.roundedRect(statusX, y + 19, statusW, 4, 1.5, 1.5, "F");
  doc.setDrawColor(...green);
  doc.setLineWidth(0.3);
  doc.roundedRect(statusX, y + 19, statusW, 4, 1.5, 1.5, "S");

  doc.setTextColor(...green);
  doc.setFontSize(6.5);
  doc.setFont("helvetica", "bold");
  doc.text("✓ Pending IQAC Review", W / 2, y + 21.8, { align: "center" });

  y += 28;

  // ════════════════════════════════════════════════════════════════════════════
  // 3. HELPERS
  // ════════════════════════════════════════════════════════════════════════════
  const footerH = 22;
  const maxY = H - footerH - 4;

  const sectionHeading = (title: string) => {
    if (y + 10 > maxY) return;
    // Left accent bar
    doc.setFillColor(...orange);
    doc.rect(m, y, 3, 7, "F");
    // Section background
    doc.setFillColor(...slate100);
    doc.rect(m + 3, y, cw - 3, 7, "F");

    doc.setTextColor(...navy);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), m + 7, y + 5);
    y += 10;
  };

  const row = (label: string, value: string, maxChars = 55) => {
    if (y + 6 > maxY) return;
    const safeVal = (value || "—").substring(0, maxChars);
    doc.setTextColor(...slate400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label, m + 4, y);
    doc.setTextColor(...ink);
    doc.setFont("helvetica", "bold");
    doc.text(safeVal, m + 52, y);
    y += 5.5;
  };

  const twoCol = (
    label1: string, val1: string,
    label2: string, val2: string
  ) => {
    if (y + 6 > maxY) return;
    const half = cw / 2;
    doc.setTextColor(...slate400);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label1, m + 4, y);
    doc.text(label2, m + half + 4, y);
    doc.setTextColor(...ink);
    doc.setFont("helvetica", "bold");
    doc.text((val1 || "—").substring(0, 24), m + 4, y + 4.5);
    doc.text((val2 || "—").substring(0, 24), m + half + 4, y + 4.5);
    y += 9;
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 4. TEAM INFORMATION SECTION
  // ════════════════════════════════════════════════════════════════════════════
  sectionHeading("Team Information");

  twoCol("Team Name", registration.teamName || "", "Department", registration.department || "");
  twoCol("Academic Year", registration.academicYear || "", "Category", registration.category || "");

  // Idea title — full width highlighted box
  if (y + 14 <= maxY) {
    doc.setFillColor(...slate50);
    doc.setDrawColor(...slate100);
    doc.setLineWidth(0.3);
    doc.roundedRect(m, y, cw, 13, 2, 2, "FD");

    // Left accent
    doc.setFillColor(...orange);
    doc.roundedRect(m, y, 3, 13, 1, 1, "F");

    doc.setTextColor(...slate400);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text("IDEA TITLE", m + 6, y + 4.5);

    doc.setTextColor(...ink);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text((registration.ideaTitle || "—").substring(0, 60), m + 6, y + 10.5);
    y += 17;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 5. TEAM MEMBERS SECTION
  // ════════════════════════════════════════════════════════════════════════════
  if (registration.members?.length && y + 10 <= maxY) {
    sectionHeading("Team Members");

    registration.members.forEach((member, i) => {
      const rowH = 13;
      if (y + rowH > maxY) return;

      const isLeader = member.memberType === "Leader";
      const bgColor: [number, number, number] = isLeader ? [255, 247, 237] : slate50;
      const borderColor: [number, number, number] = isLeader ? orangeL : slate100;

      // Card background
      doc.setFillColor(...bgColor);
      doc.setDrawColor(...borderColor);
      doc.setLineWidth(0.3);
      doc.roundedRect(m, y, cw, rowH, 2, 2, "FD");

      // Leader gets orange left bar, members get navy
      doc.setFillColor(...(isLeader ? orange : navyMid));
      doc.roundedRect(m, y, 3, rowH, 1, 1, "F");

      // Avatar circle with number
      const cx = m + 10;
      const cy = y + rowH / 2;
      doc.setFillColor(...(isLeader ? orange : navyMid));
      doc.circle(cx, cy, 3.5, "F");
      doc.setTextColor(...white);
      doc.setFontSize(6.5);
      doc.setFont("helvetica", "bold");
      doc.text(isLeader ? "L" : String(i), cx, cy + 2.3, { align: "center" });

      // Name + type badge
      doc.setTextColor(...ink);
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text(member.fullName || "—", m + 17, y + 5);

      // Badge for leader
      if (isLeader) {
        const badgeX = m + 17 + doc.getTextWidth(member.fullName || "—") + 3;
        doc.setFillColor(...orange);
        doc.roundedRect(badgeX, y + 1.5, 16, 4.5, 1, 1, "F");
        doc.setTextColor(...white);
        doc.setFontSize(5.5);
        doc.setFont("helvetica", "bold");
        doc.text("LEADER", badgeX + 2, y + 4.5);
      }

      // Gender
      doc.setTextColor(...slate400);
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.text(member.gender || "", W - m - 4, y + 5, { align: "right" });

      // Email + mobile
      doc.setTextColor(...slate700);
      doc.setFontSize(7);
      doc.text(`${member.email || ""}   ·   ${member.mobile || ""}`, m + 17, y + 10.5);

      y += rowH + 2;
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 6. SUBMISSION DETAILS
  // ════════════════════════════════════════════════════════════════════════════
  if (y + 10 <= maxY) {
    y += 2;
    sectionHeading("Submission Details");
    twoCol(
      "Submitted On", format(now, "dd MMM yyyy, hh:mm a"),
      "IQAC Contact", COLLEGE.iqac || ""
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 7. IMPORTANT NOTICE BOX
  // ════════════════════════════════════════════════════════════════════════════
  if (y + 16 <= maxY) {
    y += 2;
    doc.setFillColor(254, 252, 232); // amber-50
    doc.setDrawColor(253, 230, 138); // amber-200
    doc.setLineWidth(0.4);
    doc.roundedRect(m, y, cw, 14, 2, 2, "FD");

    doc.setFillColor(245, 158, 11); // amber-500
    doc.roundedRect(m, y, 3, 14, 1, 1, "F");

    doc.setTextColor(146, 64, 14); // amber-800
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT", m + 6, y + 5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(
      "Keep your Team ID safe. It is required for all future IQAC communications and result announcements.",
      m + 6, y + 10.5
    );
    y += 18;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // 8. FOOTER
  // ════════════════════════════════════════════════════════════════════════════
  // Navy footer band
  doc.setFillColor(...navy);
  doc.rect(0, H - footerH, W, footerH, "F");

  // Orange top accent on footer
  doc.setFillColor(...orange);
  doc.rect(0, H - footerH, W, 1.5, "F");

  doc.setTextColor(...white);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.text(COLLEGE.name, W / 2, H - footerH + 7, { align: "center" });

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(170, 190, 215);
  doc.text(COLLEGE.address || "", W / 2, H - footerH + 13, { align: "center" });

  doc.setFontSize(6);
  doc.setTextColor(120, 145, 175);
  doc.text(
    "This is a system-generated acknowledgement. No signature required.",
    W / 2, H - footerH + 18.5,
    { align: "center" }
  );

  // Enforce strictly 1 page by deleting any extra pages jsPDF might have auto-added
  const totalPages = (doc.internal as any).getNumberOfPages ? (doc.internal as any).getNumberOfPages() : 1;
  for (let i = totalPages; i > 1; i--) {
    doc.setPage(i);
    doc.deletePage(i);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  doc.save(`SIH2026-Acknowledgement-${registration.teamId}.pdf`);
}
