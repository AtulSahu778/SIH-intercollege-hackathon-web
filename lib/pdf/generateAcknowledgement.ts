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
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 25;

  const primaryColor: [number, number, number] = [11, 37, 69];
  const accentColor: [number, number, number] = [255, 122, 26];
  const successColor: [number, number, number] = [16, 185, 129];
  const mutedColor: [number, number, number] = [100, 116, 139];
  const white: [number, number, number] = [255, 255, 255];

  // ── Header Banner ─────────────────────────────────────────────────────────
  doc.setFillColor(...primaryColor);
  doc.roundedRect(margin, y, contentWidth, 32, 4, 4, "F");

  doc.setTextColor(...white);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("REGISTRATION ACKNOWLEDGEMENT", margin + contentWidth / 2, y + 11, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(HACKATHON.name, margin + contentWidth / 2, y + 20, { align: "center" });

  doc.setFontSize(8);
  doc.text(COLLEGE.name, margin + contentWidth / 2, y + 27, { align: "center" });

  y += 40;

  // ── Team ID Badge ─────────────────────────────────────────────────────────
  doc.setFillColor(...accentColor);
  doc.roundedRect(margin, y, contentWidth, 14, 3, 3, "F");
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Team ID: ${registration.teamId}`, margin + contentWidth / 2, y + 9.5, { align: "center" });
  y += 22;

  // ── Status ─────────────────────────────────────────────────────────────────
  doc.setFillColor(...successColor);
  doc.setTextColor(...white);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  const statusText = "✓  REGISTRATION SUCCESSFUL — PENDING REVIEW";
  const statusWidth = doc.getTextWidth(statusText) + 12;
  doc.roundedRect(margin + contentWidth / 2 - statusWidth / 2, y, statusWidth, 8, 2, 2, "F");
  doc.text(statusText, margin + contentWidth / 2, y + 5.5, { align: "center" });
  y += 16;

  // ── Helper: section heading ────────────────────────────────────────────────
  const sectionHeading = (title: string) => {
    doc.setFillColor(247, 249, 252);
    doc.roundedRect(margin, y, contentWidth, 8, 2, 2, "F");
    doc.setTextColor(...primaryColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), margin + 4, y + 5.5);
    y += 12;
  };

  // ── Helper: label-value row ────────────────────────────────────────────────
  const row = (label: string, value: string) => {
    doc.setTextColor(...mutedColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin + 2, y);

    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(value || "—", margin + 52, y);
    y += 6;
  };

  // ── Team Information ───────────────────────────────────────────────────────
  sectionHeading("Team Information");
  row("Team Name", registration.teamName || "");
  row("Department", registration.department || "");
  row("Academic Year", registration.academicYear || "");
  row("Category", registration.category || "");
  row("Idea Title", registration.ideaTitle || "");
  y += 4;

  // ── Team Members ───────────────────────────────────────────────────────────
  if (registration.members?.length) {
    sectionHeading("Team Members");
    registration.members.forEach((member, i) => {
      const label = member.memberType === "Leader" ? "Team Leader" : `Member ${i}`;
      doc.setFillColor(i === 0 ? 255 : 248, i === 0 ? 122 : 250, i === 0 ? 26 : 252);
      if (i === 0) {
        doc.setFillColor(255, 250, 245);
        doc.roundedRect(margin, y - 2, contentWidth, 14, 2, 2, "F");
      }

      doc.setTextColor(...mutedColor);
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.text(label.toUpperCase(), margin + 2, y + 3);

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8.5);
      doc.text(`${member.fullName}  ·  ${member.gender}`, margin + 2, y + 8);

      doc.setTextColor(...mutedColor);
      doc.setFontSize(7.5);
      doc.text(`${member.email}  ·  ${member.mobile}`, margin + 2, y + 13);
      y += 18;
    });
    y += 2;
  }

  // ── Submission Details ─────────────────────────────────────────────────────
  sectionHeading("Submission Details");
  const now = new Date();
  row("Submitted On", format(now, "dd MMM yyyy, hh:mm a"));
  row("Status", "Pending Review");
  row("IQAC", COLLEGE.iqac);
  y += 6;

  // ── Footer ─────────────────────────────────────────────────────────────────
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, footerY, margin + contentWidth, footerY);

  doc.setTextColor(...mutedColor);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `${COLLEGE.name} · ${COLLEGE.address} · Generated: ${format(now, "dd/MM/yyyy HH:mm")}`,
    margin + contentWidth / 2,
    footerY + 5,
    { align: "center" }
  );
  doc.text(
    "This is a system-generated acknowledgement. Keep it for your records.",
    margin + contentWidth / 2,
    footerY + 10,
    { align: "center" }
  );

  // ── Save ───────────────────────────────────────────────────────────────────
  doc.save(`SIH2026-Acknowledgement-${registration.teamId}.pdf`);
}
