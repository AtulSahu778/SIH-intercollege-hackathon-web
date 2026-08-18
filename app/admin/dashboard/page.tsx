"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import sxcLogo from "@/app/images/sxclogo.jpg";

import {
  Users, Clock, RefreshCw, Download,
  Search, LogOut, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getRegistrations } from "@/lib/api/appsScript";
import { RegistrationRecord } from "@/types/registration";
import { ADMIN_SESSION_KEY, COLLEGE, HACKATHON, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) router.push("/admin");
  }, [router]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const result = await getRegistrations();
    if (result.success && result.data) {
      setRegistrations(result.data);
    } else {
      toast.error("Failed to load registrations", { description: result.error });
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const stats = {
    total: registrations.length,
  };

  const filtered = registrations.filter((r) => {
    return !search || r.teamName?.toLowerCase().includes(search.toLowerCase()) || r.teamId?.toLowerCase().includes(search.toLowerCase()) || r.department?.toLowerCase().includes(search.toLowerCase());
  });

  const exportCSV = () => {
    const headers = [ "Team ID", "Team Name", "Department", "Academic Year", "Category", "Problem Statement", "Idea Title", "Idea Description", "Idea Submitted At", "Registered At" ];
    const rows = registrations.map((r) => [ r.teamId, r.teamName, r.department, r.academicYear, r.category, r.problemStatement || "", r.ideaTitle || "", r.ideaDescription || "", r.ideaSubmittedAt || "", r.timestamp ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SIH2026-Registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans selection:bg-slate-200 text-slate-900 pb-20">
      
      {/* ── Minimal Header ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={sxcLogo} alt="Logo" className="w-8 h-8 rounded border border-slate-200 object-contain p-0.5 bg-white" />
            <div className="hidden sm:block">
              <h1 className="font-semibold text-sm leading-tight">Admin Dashboard</h1>
              <p className="text-[11px] text-slate-500 font-medium">{HACKATHON.shortName} • {COLLEGE.shortName}</p>
            </div>
            <div className="block sm:hidden">
              <h1 className="font-semibold text-sm leading-tight">Admin</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button variant="outline" size="sm" className="h-8 w-8 sm:w-auto px-0 sm:px-3 shadow-none border-slate-200 hover:bg-slate-50" onClick={loadData} disabled={isLoading} title="Sync">
              <RefreshCw className={cn("w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-2", isLoading && "animate-spin")} /> 
              <span className="hidden sm:inline text-xs">Sync</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 sm:w-auto px-0 sm:px-3 shadow-none border-slate-200 hover:bg-slate-50" onClick={exportCSV} title="Export CSV">
              <Download className="w-4 h-4 sm:w-3.5 sm:h-3.5 sm:mr-2" /> 
              <span className="hidden sm:inline text-xs">Export</span>
            </Button>
            <div className="w-px h-4 bg-slate-200 mx-1 sm:mx-2"></div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100" onClick={logout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ── Stats ── */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Total Registrations</div>
            <div className="text-4xl font-semibold text-slate-900">{stats.total}</div>
          </div>
          <Users className="w-12 h-12 text-slate-200" />
        </div>

        {/* ── Table ── */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Search registrations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm w-full bg-white border-slate-200 shadow-none focus-visible:ring-1 focus-visible:ring-slate-300" />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-slate-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-sm text-slate-500">No registrations found.</div>
            ) : (
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="px-6 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Team ID</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Team Name</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-[11px] font-medium text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((reg) => (
                    <tr key={reg.teamId} className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelectedReg(reg)}>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600">{reg.teamId}</td>
                      <td className="px-6 py-4 font-medium">{reg.teamName}</td>
                      <td className="px-6 py-4 text-slate-600">{reg.department}</td>
                      <td className="px-6 py-4 text-slate-600 capitalize">{reg.category?.replace("_", " ")}</td>
                      <td className="px-6 py-4 text-right">
                         <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500" onClick={() => setSelectedReg(reg)}>
                           View Details <ChevronRight className="w-3.5 h-3.5 ml-1" />
                         </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500 text-center sm:text-left">
              Showing {filtered.length} of {registrations.length} registrations
            </div>
          )}
        </div>
      </main>

      {/* ── Clean Modal ── */}
      <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="max-w-[100vw] sm:max-w-3xl w-full h-[100dvh] sm:h-auto sm:max-h-[90vh] overflow-hidden p-0 bg-white border-0 sm:border sm:border-slate-200 rounded-none sm:rounded-xl shadow-xl flex flex-col gap-0 m-0">
          {selectedReg && (
            <>
              <DialogHeader className="p-6 border-b border-slate-200 bg-white flex-shrink-0">
                <div className="flex flex-col text-left">
                  <DialogTitle className="text-xl font-semibold mb-1 break-words">{selectedReg.teamName}</DialogTitle>
                  <DialogDescription className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200 break-all">{selectedReg.teamId}</span>
                    <span className="text-slate-300 hidden sm:inline">•</span>
                    <span className="w-full sm:w-auto">Registered on {selectedReg.timestamp}</span>
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="p-6 overflow-y-auto space-y-8 text-sm text-left flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Department", value: selectedReg.department },
                    { label: "Year", value: selectedReg.academicYear },
                    { label: "Category", value: selectedReg.category?.replace("_", " ") },
                    { label: "Size", value: `${selectedReg.members?.length || 0} Members` },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="font-medium capitalize text-slate-900 truncate">{item.value || "—"}</div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold mb-4">Project Idea</h3>
                  {(selectedReg.ideaTitle || selectedReg.problemStatement || selectedReg.ideaDescription || selectedReg.presentationUrl) ? (
                    <div className="space-y-5 bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-5 break-words">
                      {selectedReg.ideaSubmittedAt && (
                        <div className="text-xs text-slate-500 mb-2">Submitted on: {selectedReg.ideaSubmittedAt}</div>
                      )}
                      {selectedReg.ideaTitle && (
                        <div>
                          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Title</div>
                          <div className="font-medium text-base">{selectedReg.ideaTitle}</div>
                        </div>
                      )}
                      {selectedReg.problemStatement && (
                        <div>
                          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Problem Statement</div>
                          <div className="text-slate-700">{selectedReg.problemStatement}</div>
                        </div>
                      )}
                      {selectedReg.ideaDescription && (
                        <div>
                          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">Description</div>
                          <div className="text-slate-700 whitespace-pre-wrap">{selectedReg.ideaDescription}</div>
                        </div>
                      )}
                      {selectedReg.presentationUrl && (
                        <div className="pt-2">
                          <a href={selectedReg.presentationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 break-all">
                            <Download className="w-4 h-4 mr-2 flex-shrink-0" /> Download PDF
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                      No project idea submitted yet.
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-semibold mb-4">Team Roster</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {selectedReg.members?.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 border border-slate-200 flex-shrink-0">
                          {m.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-sm truncate">{m.fullName}</div>
                            {m.memberType === "Leader" && (
                              <Badge variant="outline" className="h-4 px-1 text-[9px] uppercase shadow-none bg-slate-50 text-slate-600 flex-shrink-0">Leader</Badge>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 truncate">{m.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

