"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import {
  CheckCircle2, Download, Printer, Home, Copy, CalendarDays, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { COLLEGE, HACKATHON } from "@/lib/constants";

// Type declaration for print window flag
declare global {
  interface Window {
    __printWindowOpen?: boolean;
  }
}

async function downloadPDF(teamId: string, teamName: string, ideaTitle: string) {
  const { generateAcknowledgementPDF } = await import("@/lib/pdf/generateAcknowledgement");
  generateAcknowledgementPDF({ teamId, teamName, ideaTitle, department: "", academicYear: "", category: "", members: [] });
}

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  const teamId   = params.get("teamId")    || "SIH-2026-001";
  const teamName = params.get("teamName")  || "Your Team";
  const ideaTitle = params.get("ideaTitle") || "Your Idea";

  const copyTeamId = async () => {
    await navigator.clipboard.writeText(teamId);
    toast.success("Team ID copied!", { description: teamId });
  };

  const handleDownload = async () => {
    await downloadPDF(teamId, teamName, ideaTitle);
    toast.success("Acknowledgement downloaded!");
  };

  /* ─────────────────────────────────────────────────────────────────────────
     handlePrint — opens a blank popup with ONLY the receipt HTML so the
     browser print dialog always outputs exactly one A4 page.
  ───────────────────────────────────────────────────────────────────────── */
  const handlePrint = () => {
    const now = new Date();
    const pDate = now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const sDate = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    
    // Prevent double-printing by checking if a print window is already open
    if (window.__printWindowOpen) {
      toast.info("Print window is already open");
      return;
    }
    window.__printWindowOpen = true;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>SIH 2026 Receipt – ${teamId}</title>
<style>
  @page { size: A4 portrait; margin: 0; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    width: 210mm; height: 297mm; overflow: hidden;
    font-family: Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color: #0F172A;
  }

  /* Page shell — flex column so header + body + footer stack perfectly */
  .page {
    width: 210mm; height: 297mm;
    display: flex; flex-direction: column;
    overflow: hidden; background: #fff;
  }

  /* ── HEADER ─────────────────────────────────────────────── */
  .hd {
    background: #0B2545;
    padding: 13mm 18mm 9mm;
    position: relative; flex-shrink: 0;
  }
  .hd-stripe {
    position: absolute; top: 0; left: 0; right: 0;
    height: 2.5mm; background: #FF7A1A;
  }
  .hd-top {
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .hd-title { color: #fff; font-size: 22pt; font-weight: 900; letter-spacing: -0.5pt; line-height: 1; }
  .hd-sub   { color: #7FA8CC; font-size: 7.5pt; margin-top: 1.5mm; letter-spacing: 0.02em; }
  .hd-right { text-align: right; }
  .hd-college { color: #C8DAF0; font-size: 8pt; font-weight: 700; }
  .hd-city    { color: #7FA8CC; font-size: 7pt;  margin-top: 1mm; }
  .hd-bar {
    margin-top: 7mm; border-top: 0.3mm solid #1D3A5E; padding-top: 4.5mm;
    display: flex; justify-content: space-between; align-items: center;
  }
  .hd-label { color: #FF7A1A; font-size: 7.5pt; font-weight: 800; letter-spacing: 0.12em; }
  .hd-time  { color: #526A82;  font-size: 6.5pt; }

  /* ── BODY ────────────────────────────────────────────────── */
  .bd {
    flex: 1; overflow: hidden;
    padding: 7mm 18mm 0;
    display: flex; flex-direction: column; gap: 5.5mm;
  }

  /* Ticket ID Card */
  .ticket-box {
    background: #F8FAFC; border-radius: 3mm; padding: 5mm;
    display: flex; flex-direction: column; align-items: center;
  }
  .ticket-lbl { color: #64748B; font-size: 6.5pt; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; margin-bottom: 3.5mm; }
  .ticket {
    background: #fff; border: 0.5mm dashed #CBD5E1; border-radius: 3mm;
    padding: 4mm 10mm; position: relative; width: 85%;
    display: flex; justify-content: center; align-items: center;
  }
  .ticket-cut-l { position: absolute; left: -3.5mm; top: 50%; transform: translateY(-50%); width: 7mm; height: 7mm; border-radius: 50%; background: #F8FAFC; border-right: 0.5mm dashed #CBD5E1; }
  .ticket-cut-r { position: absolute; right: -3.5mm; top: 50%; transform: translateY(-50%); width: 7mm; height: 7mm; border-radius: 50%; background: #F8FAFC; border-left: 0.5mm dashed #CBD5E1; }
  .ticket-val { color: #0B2545; font-size: 20pt; font-weight: 900; letter-spacing: 0.15em; font-family: monospace; line-height: 1; }
  
  /* Status Badge */
  .status-badge {
    margin-top: 3.5mm; background: #ECFDF5; border: 0.4mm solid #6EE7B7;
    border-radius: 4mm; padding: 1.5mm 4mm;
    color: #059669; font-size: 7pt; font-weight: 800; letter-spacing: 0.05em;
  }

  /* Section heading */
  .sec { display: flex; flex-direction: column; gap: 3.5mm; }
  .sec-hd { display: flex; align-items: stretch; height: 7mm; }
  .sec-bar   { width: 2.5mm; background: #FF7A1A; border-radius: 1mm 0 0 1mm; flex-shrink: 0; }
  .sec-label {
    background: #F1F5F9; flex: 1; border-radius: 0 1mm 1mm 0;
    padding: 0 4mm; display: flex; align-items: center;
    color: #0B2545; font-size: 6.5pt; font-weight: 900; letter-spacing: 0.14em;
  }

  /* 3-column info grid */
  .info-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    border: 0.3mm solid #E2E8F0; border-radius: 2mm; overflow: hidden;
  }
  .ic {
    padding: 3mm 4mm;
    border-right: 0.3mm solid #E2E8F0;
  }
  .ic:last-child { border-right: none; }
  .ic-lbl { color: #94A3B8; font-size: 5.5pt; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 1.5mm; }
  .ic-val { color: #0F172A; font-size: 8.5pt; font-weight: 700; }

  /* Idea highlight */
  .idea {
    display: flex; align-items: stretch;
    border: 0.3mm solid #FED7AA; border-radius: 2mm; overflow: hidden;
  }
  .idea-stripe { width: 3mm; background: #FF7A1A; flex-shrink: 0; }
  .idea-body   { padding: 3.5mm 5mm; }
  .idea-lbl    { color: #C2621A; font-size: 5.5pt; font-weight: 800; letter-spacing: 0.12em; margin-bottom: 1.5mm; }
  .idea-val    { color: #0F172A; font-size: 11pt; font-weight: 900; line-height: 1.25; }

  /* Motivation & Steps grid */
  .split-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6mm; align-items: stretch; }
  
  .sih-card {
    background: #0B2545; border-radius: 2mm; padding: 4.5mm 5mm;
    display: flex; flex-direction: column; justify-content: center;
    position: relative; overflow: hidden;
  }
  .sih-card::before { content: ""; position: absolute; right: -5mm; top: -5mm; width: 25mm; height: 25mm; background: rgba(255,255,255,0.1); border-radius: 50%; }
  .sih-title { color: #fff; font-size: 10pt; font-weight: 900; margin-bottom: 1.5mm; }
  .sih-desc { color: rgba(255,255,255,0.75); font-size: 7.5pt; line-height: 1.4; }
  
  .steps-list { display: flex; flex-direction: column; gap: 2.5mm; justify-content: center; }
  .step  { display: flex; gap: 2.5mm; align-items: flex-start; }
  .step-n {
    width: 4.5mm; height: 4.5mm; border-radius: 50%; flex-shrink: 0;
    background: #FFF7ED; border: 0.5mm solid #FF7A1A;
    display: flex; align-items: center; justify-content: center;
    color: #FF7A1A; font-size: 5.5pt; font-weight: 900;
    margin-top: 0.5mm;
  }
  .step-t { color: #475569; font-size: 7.5pt; line-height: 1.35; }

  /* Notice */
  .notice {
    display: flex; align-items: stretch;
    border: 0.4mm solid #FDE68A; border-radius: 2mm; overflow: hidden;
  }
  .notice-stripe { width: 3mm; background: #F59E0B; flex-shrink: 0; }
  .notice-body   { padding: 3mm 5mm; background: #FFFBEB; flex: 1; }
  .notice-lbl    { color: #B45309; font-size: 5.5pt; font-weight: 800; letter-spacing: 0.12em; margin-bottom: 1.5mm; }
  .notice-txt    { color: #78350F; font-size: 7.5pt; line-height: 1.4; }

  /* ── FOOTER ─────────────────────────────────────────────── */
  .ft {
    flex-shrink: 0;
    background: #0B2545; border-top: 2mm solid #FF7A1A;
    padding: 5mm 18mm;
    display: flex; flex-direction: column; align-items: center; gap: 1.5mm;
  }
  .ft-name { color: #fff;    font-size: 8pt;   font-weight: 800; letter-spacing: 0.03em; }
  .ft-addr { color: #7A9BBD; font-size: 6.5pt; }
  .ft-note { color: #4A6A8A; font-size: 6pt;   }
</style>
</head>
<body>
<div class="page">

  <!-- HEADER -->
  <div class="hd">
    <div class="hd-stripe"></div>
    <div class="hd-top">
      <div>
        <div class="hd-title">iSIH 2026</div>
        <div class="hd-sub">Internal Smart India Hackathon 2026</div>
      </div>
      <div class="hd-right">
        <div class="hd-college">SXC Ranchi</div>
        <div class="hd-city">Ranchi, Jharkhand</div>
      </div>
    </div>
    <div class="hd-bar">
      <div class="hd-label">REGISTRATION ACKNOWLEDGEMENT</div>
      <div class="hd-time">Generated: ${pDate}</div>
    </div>
  </div>

  <!-- BODY -->
  <div class="bd">

    <!-- Ticket ID Card -->
    <div class="ticket-box">
      <div class="ticket-lbl">Your Team ID</div>
      <div class="ticket">
        <div class="ticket-cut-l"></div>
        <div class="ticket-cut-r"></div>
        <div class="ticket-val">${teamId}</div>
      </div>
      <div class="status-badge">&#10003; Pending IQAC Review</div>
    </div>

    <!-- Team Information -->
    <div class="sec">
      <div class="sec-hd">
        <div class="sec-bar"></div>
        <div class="sec-label">TEAM INFORMATION</div>
      </div>
      <div class="info-grid">
        <div class="ic">
          <div class="ic-lbl">Team Name</div>
          <div class="ic-val">${teamName}</div>
        </div>
        <div class="ic">
          <div class="ic-lbl">Registered On</div>
          <div class="ic-val">${sDate}</div>
        </div>
        <div class="ic">
          <div class="ic-lbl">Review Status</div>
          <div class="ic-val">Pending IQAC</div>
        </div>
      </div>
      <div class="idea">
        <div class="idea-stripe"></div>
        <div class="idea-body">
          <div class="idea-lbl">IDEA TITLE</div>
          <div class="idea-val">${ideaTitle}</div>
        </div>
      </div>
    </div>

    <!-- What Happens Next / Motivation -->
    <div class="sec">
      <div class="sec-hd">
        <div class="sec-bar"></div>
        <div class="sec-label">WHAT HAPPENS NEXT</div>
      </div>
      <div class="split-grid">
        <div class="steps-list">
          <div class="step"><div class="step-n">1</div><div class="step-t">Your registration is under review by IQAC</div></div>
          <div class="step"><div class="step-n">2</div><div class="step-t">You&apos;ll receive confirmation at your registered email</div></div>
          <div class="step"><div class="step-n">3</div><div class="step-t">Watch for hackathon schedule and venue details</div></div>
          <div class="step"><div class="step-n">4</div><div class="step-t">Shortlisted teams will be announced after evaluation</div></div>
        </div>
        
        <div class="sih-card">
          <div class="sih-title">Aim for SIH 2026!</div>
          <div class="sih-desc">The top-performing teams will be nominated to represent <strong>${COLLEGE.shortName}</strong> at the national level.</div>
        </div>
      </div>
    </div>

    <!-- Important Notice -->
    <div class="notice">
      <div class="notice-stripe"></div>
      <div class="notice-body">
        <div class="notice-lbl">IMPORTANT</div>
        <div class="notice-txt">Keep your Team ID <strong>${teamId}</strong> safe. It is required for all future IQAC communications and result announcements.</div>
      </div>
    </div>

  </div><!-- /bd -->

  <!-- FOOTER -->
  <div class="ft">
    <div class="ft-name">St. Xavier's College, Ranchi</div>
    <div class="ft-addr">Mahuatand, Purulia Road, Ranchi, Jharkhand – 834001</div>
    <div class="ft-note">System-generated acknowledgement · No signature required</div>
  </div>

</div>
<script>
  (function() {
    let printed = false;
    window.onload = function () {
      if (!printed) {
        printed = true;
        window.print();
      }
    };
    window.onafterprint = function () { 
      setTimeout(function() { window.close(); }, 100); 
    };
  })();
</script>
</body>
</html>`;

    const win = window.open("", "_blank", "width=850,height=1050");
    if (win) { 
      win.document.write(html); 
      win.document.close(); 
      
      // Reset flag when window closes
      const resetFlag = () => {
        window.__printWindowOpen = false;
      };
      
      // Monitor window close
      const checkClosed = setInterval(() => {
        if (win.closed) {
          clearInterval(checkClosed);
          resetFlag();
        }
      }, 500);
    } else {
      window.__printWindowOpen = false;
    }
  };

  const nextSteps = [
    "Your registration is under review by IQAC",
    "You'll receive confirmation at your registered email",
    "Watch for hackathon schedule and venue details",
    "Shortlisted teams will be announced after evaluation",
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden py-12 px-4 flex items-center justify-center">
      {/* Background decorative orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-orange/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-2xl w-full mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/50 overflow-hidden"
        >
          {/* ── HEADER ── */}
          <div className="bg-navy-primary relative px-8 py-12 text-center overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-primary via-transparent to-transparent" />
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="relative flex items-center justify-center w-24 h-24 mx-auto mb-6"
            >
              <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse duration-2000" />
              <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] border-4 border-success/30 relative z-10">
                <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="relative z-10 text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight"
            >
              Registration Successful!
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="relative z-10 text-white/70 text-sm sm:text-base leading-relaxed max-w-md mx-auto"
            >
              Your team has been successfully registered for the{" "}
              <span className="text-white font-semibold">{HACKATHON.name}</span> at {COLLEGE.shortName}.
            </motion.p>
          </div>

          {/* ── TICKET ID ── */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="px-6 sm:px-10 py-8 border-b border-slate-100 bg-slate-50/50"
          >
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-4">
              Your Team ID
            </p>
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 sm:p-6 flex items-center justify-between shadow-sm relative group hover:border-accent-orange/30 transition-colors">
              {/* Ticket cutouts */}
              <div className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-slate-50 rounded-full border-r-2 border-dashed border-slate-200 group-hover:border-accent-orange/30 transition-colors" />
              <div className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 w-6 sm:w-8 h-6 sm:h-8 bg-slate-50 rounded-full border-l-2 border-dashed border-slate-200 group-hover:border-accent-orange/30 transition-colors" />
              
              <div className="ml-4 sm:ml-8">
                <span className="text-3xl sm:text-4xl font-black text-navy-primary tracking-widest font-mono">
                  {teamId}
                </span>
              </div>
              <Button 
                variant="ghost" size="icon" onClick={copyTeamId} 
                className="mr-2 sm:mr-6 h-12 w-12 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-navy-primary"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 text-center mt-4 font-medium">
              Keep this ID safe. It is required for all future IQAC communications.
            </p>
          </motion.div>

          {/* ── INFO ── */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="px-6 sm:px-10 py-6 border-b border-slate-100 grid grid-cols-2 gap-6"
          >
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Team Name</p>
              <p className="font-bold text-navy-primary text-base">{teamName}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Idea Title</p>
              <p className="font-bold text-navy-primary text-base line-clamp-2">{ideaTitle}</p>
            </div>
          </motion.div>

          {/* ── NEXT STEPS & MOTIVATION ── */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="px-6 sm:px-10 py-8 border-b border-slate-100"
          >
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Left: Steps */}
              <div>
                <h3 className="font-bold text-navy-primary mb-5 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <CalendarDays className="w-4 h-4 text-accent-orange" />
                  What happens next?
                </h3>
                <ul className="space-y-4">
                  {nextSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-50 border border-orange-100 text-accent-orange text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </div>
                      <span className="text-sm text-slate-600 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: Motivation Card */}
              <div className="bg-gradient-to-br from-navy-primary to-navy-secondary rounded-2xl p-6 text-white relative overflow-hidden group shadow-inner">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-500" />
                <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-accent-orange/20 rounded-full blur-2xl" />
                
                <Trophy className="w-8 h-8 text-accent-orange mb-4 relative z-10" />
                <h4 className="font-bold text-lg mb-2 relative z-10">Aim for SIH 2026!</h4>
                <p className="text-sm text-white/70 leading-relaxed relative z-10">
                  The top-performing teams will be nominated to represent <strong>{COLLEGE.name}</strong> at the national level.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── ACTIONS ── */}
          <motion.div 
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="px-6 sm:px-10 py-8 bg-slate-50/50 flex flex-col sm:flex-row gap-4"
          >
            <Button 
              variant="default" onClick={handleDownload} 
              className="flex-1 h-14 text-base rounded-2xl shadow-lg shadow-accent-orange/20 hover:shadow-accent-orange/40 hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-5 h-5 mr-2" /> Download PDF
            </Button>
            <Button 
              variant="outline" onClick={handlePrint} 
              className="flex-1 h-14 text-base rounded-2xl border-slate-200 hover:border-slate-300 hover:bg-white transition-all"
            >
              <Printer className="w-5 h-5 mr-2 text-slate-500" /> Print Receipt
            </Button>
            <Button 
              variant="ghost" onClick={() => router.push("/")} 
              className="h-14 px-6 text-base rounded-2xl text-slate-500 hover:text-navy-primary hover:bg-slate-100"
            >
              <Home className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center text-xs text-slate-400 mt-8"
        >
          For queries, contact{" "}
          <a href={`mailto:${COLLEGE.email}`} className="text-accent-orange hover:underline font-medium">
            {COLLEGE.email}
          </a>
        </motion.p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-accent-orange/20 border-t-accent-orange animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
