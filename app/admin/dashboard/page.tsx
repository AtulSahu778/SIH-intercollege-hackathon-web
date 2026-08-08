"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import sxcLogo from "@/app/images/sxclogo.jpg";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import {
  Users, Clock, CheckCircle2, XCircle, RefreshCw, Download,
  Search, Eye, LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getRegistrations, updateRegistrationStatus } from "@/lib/api/appsScript";
import { RegistrationRecord, RegistrationStatus } from "@/types/registration";
import { ADMIN_SESSION_KEY, COLLEGE, HACKATHON, CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Colors
// ─────────────────────────────────────────────────────────────────────────────
const PIE_COLORS = { Male: "#0B2545", Female: "#FF7A1A", Other: "#06B6D4", "Prefer not to say": "#10B981" };

// ─────────────────────────────────────────────────────────────────────────────
// Stats Card
// ─────────────────────────────────────────────────────────────────────────────
function StatsCard({
  title, value, icon: Icon, color, bg
}: {
  title: string; value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string; bg: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <span className="text-xs sm:text-sm font-medium text-text-muted truncate">{title}</span>
        <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${bg} flex-shrink-0 flex items-center justify-center`}>
          <Icon className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${color}`} />
        </div>
      </div>
      <div className="text-2xl sm:text-3xl font-black text-text-primary">{value}</div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedReg, setSelectedReg] = useState<RegistrationRecord | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Auth guard
  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!session) {
      router.push("/admin");
    }
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

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats = {
    total: registrations.length,
    pending: registrations.filter((r) => r.status === "Pending").length,
    approved: registrations.filter((r) => r.status === "Approved").length,
    rejected: registrations.filter((r) => r.status === "Rejected").length,
  };

  // ── Charts ────────────────────────────────────────────────────────────────
  const deptData = Object.entries(
    registrations.reduce<Record<string, number>>((acc, r) => {
      const dept = r.department?.split(" ").slice(0, 2).join(" ") || "Other";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const genderData = Object.entries(
    registrations.flatMap((r) => r.members || []).reduce<Record<string, number>>((acc, m) => {
      acc[m.gender] = (acc[m.gender] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const categoryData = CATEGORIES.map((cat) => ({
    name: cat.label,
    count: registrations.filter((r) => r.category === cat.value).length,
  }));

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = registrations.filter((r) => {
    const matchSearch =
      !search ||
      r.teamName?.toLowerCase().includes(search.toLowerCase()) ||
      r.teamId?.toLowerCase().includes(search.toLowerCase()) ||
      r.department?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // ── Status Update ─────────────────────────────────────────────────────────
  const handleStatusUpdate = async (teamId: string, status: RegistrationStatus) => {
    setUpdatingId(teamId);
    const result = await updateRegistrationStatus(teamId, status);
    if (result.success) {
      setRegistrations((prev) =>
        prev.map((r) => (r.teamId === teamId ? { ...r, status } : r))
      );
      toast.success(`Status updated to ${status}`);
      if (selectedReg?.teamId === teamId) {
        setSelectedReg((prev) => prev ? { ...prev, status } : null);
      }
    } else {
      toast.error("Failed to update status", { description: result.error });
    }
    setUpdatingId(null);
  };

  // ── Export CSV ────────────────────────────────────────────────────────────
  const exportCSV = () => {
    const headers = ["Team ID", "Team Name", "Department", "Academic Year", "Category", "Idea Title", "Status", "Timestamp"];
    const rows = registrations.map((r) => [
      r.teamId, r.teamName, r.department, r.academicYear, r.category,
      r.ideaTitle, r.status, r.timestamp
    ]);
    const csv = [headers, ...rows].map((row) => row.map((v) => `"${v ?? ""}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SIH2026-Registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exported!");
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin");
  };

  const statusBadgeVariant = (status: RegistrationStatus) => {
    if (status === "Approved") return "approved";
    if (status === "Rejected") return "rejected";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="bg-navy-primary border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center overflow-hidden shadow-sm border border-white/20">
              <Image src={sxcLogo} alt="College Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Admin Dashboard</div>
              <div className="text-white/40 text-xs hidden sm:block">{HACKATHON.shortName} · {COLLEGE.shortName}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="glass"
              size="icon"
              className="sm:w-auto sm:px-3 h-9 w-9"
              onClick={loadData}
              disabled={isLoading}
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              <span className="hidden sm:inline ml-2">Refresh</span>
            </Button>
            <Button variant="glass" size="icon" className="sm:w-auto sm:px-3 h-9 w-9" onClick={exportCSV} title="Export CSV">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>
            <Button variant="glass" size="icon" className="sm:w-auto sm:px-3 h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={logout} title="Logout">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard title="Total Registrations" value={stats.total} icon={Users} color="text-navy-primary" bg="bg-blue-50" />
          <StatsCard title="Pending Review" value={stats.pending} icon={Clock} color="text-amber-500" bg="bg-amber-50" />
          <StatsCard title="Approved" value={stats.approved} icon={CheckCircle2} color="text-success" bg="bg-emerald-50" />
          <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} color="text-error" bg="bg-red-50" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h2 className="font-bold text-text-primary mb-5">Department Distribution</h2>
            {deptData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={deptData} margin={{ top: 0, right: 0, bottom: 20, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                  />
                  <Bar dataKey="count" fill="#0B2545" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-text-muted text-sm">
                No data yet
              </div>
            )}
          </div>

          {/* Gender pie */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h2 className="font-bold text-text-primary mb-5">Gender Distribution</h2>
            {genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {genderData.map((entry) => (
                      <Cell key={entry.name} fill={(PIE_COLORS as Record<string, string>)[entry.name] || "#8B5CF6"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-text-muted text-sm">No data yet</div>
            )}
          </div>
        </div>

        {/* Category chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm overflow-hidden">
          <h2 className="font-bold text-text-primary mb-4 sm:mb-5">Category Distribution</h2>
          <div className="flex overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-3 md:flex md:flex-wrap gap-3 sm:gap-6 snap-x hide-scrollbar">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex-1 min-w-[140px] sm:min-w-0 snap-start text-center p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="text-xl sm:text-2xl font-black text-text-primary">{cat.count}</div>
                <div className="text-[10px] sm:text-xs text-text-muted mt-1 leading-tight">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-text-primary">All Registrations</h2>
              <Badge variant="outline" className="sm:hidden">{filtered.length} Total</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input
                  placeholder="Search by name, ID, dept…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-10 sm:h-9 text-sm w-full rounded-xl"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 sm:h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange/30 w-full sm:w-40 flex-shrink-0"
              >
                {["All", "Pending", "Approved", "Rejected"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          {/* Data Content */}
          <div className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-10 h-10 rounded-full border-4 border-accent-orange/20 border-t-accent-orange animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-text-muted text-sm px-4">
                {registrations.length === 0
                  ? "No registrations yet. Share the registration link with students!"
                  : "No registrations match your search."}
              </div>
            ) : (
              <>
                {/* Mobile List View (visible only on small screens) */}
                <div className="block sm:hidden divide-y divide-slate-100">
                  {filtered.map((reg) => (
                    <div key={reg.teamId} className="p-4 flex flex-col gap-3 hover:bg-slate-50/50 active:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedReg(reg)}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-text-primary text-sm line-clamp-1">{reg.teamName}</h3>
                          <p className="font-mono text-[10px] text-navy-primary font-bold mt-0.5">{reg.teamId}</p>
                        </div>
                        <Badge variant={statusBadgeVariant(reg.status as RegistrationStatus)} className="flex-shrink-0 text-[10px] px-2 py-0.5">
                          {reg.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-[11px] text-text-muted line-clamp-1 flex-1 pr-2">{reg.department}</p>
                        <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {reg.status !== "Approved" && (
                            <Button variant="success" size="icon" className="h-7 w-7 rounded-lg shadow-sm" disabled={updatingId === reg.teamId} onClick={() => handleStatusUpdate(reg.teamId, "Approved")} title="Approve">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          {reg.status !== "Rejected" && (
                            <Button variant="destructive" size="icon" className="h-7 w-7 rounded-lg shadow-sm" disabled={updatingId === reg.teamId} onClick={() => handleStatusUpdate(reg.teamId, "Rejected")} title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (hidden on small screens) */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm" role="table" aria-label="Registrations table">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/80">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Team ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Team Name</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Department</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide hidden lg:table-cell">Category</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-text-muted uppercase tracking-wide">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filtered.map((reg) => (
                        <tr key={reg.teamId} className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs font-bold text-navy-primary">{reg.teamId}</td>
                          <td className="px-4 py-3 font-semibold text-text-primary max-w-[160px] truncate">{reg.teamName}</td>
                          <td className="px-4 py-3 text-text-muted max-w-[140px] truncate text-xs">{reg.department}</td>
                          <td className="px-4 py-3 text-text-muted hidden lg:table-cell text-xs capitalize">{reg.category?.replace("_", " ")}</td>
                          <td className="px-4 py-3">
                            <Badge variant={statusBadgeVariant(reg.status as RegistrationStatus)}>
                              {reg.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-muted hover:text-navy-primary" onClick={() => setSelectedReg(reg)} title="View">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {reg.status !== "Approved" && (
                                <Button variant="success" size="sm" className="h-7 px-2.5 text-xs" disabled={updatingId === reg.teamId} onClick={() => handleStatusUpdate(reg.teamId, "Approved")}>
                                  Approve
                                </Button>
                              )}
                              {reg.status !== "Rejected" && (
                                <Button variant="destructive" size="sm" className="h-7 px-2.5 text-xs" disabled={updatingId === reg.teamId} onClick={() => handleStatusUpdate(reg.teamId, "Rejected")}>
                                  Reject
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Table footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-text-muted">
              Showing {filtered.length} of {registrations.length} registrations
            </div>
          )}
        </div>
      </div>

      {/* Team Detail Modal */}
      <Dialog open={!!selectedReg} onOpenChange={(open) => !open && setSelectedReg(null)}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
          {selectedReg && (
            <>
              <DialogHeader className="p-4 sm:p-6 pb-4 sm:pb-5 sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div>
                    <DialogTitle>{selectedReg.teamName}</DialogTitle>
                    <DialogDescription className="font-mono text-xs mt-0.5">
                      {selectedReg.teamId}
                    </DialogDescription>
                  </div>
                  <Badge variant={statusBadgeVariant(selectedReg.status as RegistrationStatus)} className="sm:ml-auto w-fit">
                    {selectedReg.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-5">
                {/* Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Department", value: selectedReg.department },
                    { label: "Academic Year", value: selectedReg.academicYear },
                    { label: "Category", value: selectedReg.category?.replace("_", " ") },
                    { label: "Submitted", value: selectedReg.timestamp },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-text-muted font-medium">{item.label}</p>
                      <p className="font-semibold text-text-primary capitalize">{item.value || "—"}</p>
                    </div>
                  ))}
                </div>

                {/* Project (if available) */}
                {(selectedReg.ideaTitle || selectedReg.problemStatement || selectedReg.presentationUrl) && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    {selectedReg.problemStatement && (
                      <>
                        <p className="text-xs text-text-muted font-medium mb-1">Problem Statement</p>
                        <p className="text-sm font-medium text-text-primary">{selectedReg.problemStatement}</p>
                      </>
                    )}
                    {selectedReg.ideaTitle && (
                      <>
                        <p className="text-xs text-text-muted font-medium mt-3 mb-1">Idea Title</p>
                        <p className="text-sm font-bold text-text-primary">{selectedReg.ideaTitle}</p>
                      </>
                    )}
                    {selectedReg.ideaDescription && (
                      <>
                        <p className="text-xs text-text-muted font-medium mt-3 mb-1">Description</p>
                        <p className="text-xs text-text-muted leading-relaxed">{selectedReg.ideaDescription}</p>
                      </>
                    )}
                    {selectedReg.presentationUrl && (
                      <a
                        href={selectedReg.presentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-accent-orange font-semibold hover:underline"
                      >
                        View Presentation PDF →
                      </a>
                    )}
                  </div>
                )}

                {/* Members */}
                {selectedReg.members?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Team Members</p>
                    <div className="space-y-2">
                      {selectedReg.members.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-sm">
                          <div className={cn(
                            "w-2 h-2 rounded-full flex-shrink-0",
                            m.gender === "Female" ? "bg-accent-orange" : "bg-navy-primary/30"
                          )} />
                          <span className="font-semibold text-text-primary flex-1 truncate">{m.fullName}</span>
                          <span className="text-text-muted text-xs">{m.gender}</span>
                          <span className="text-text-muted text-xs hidden sm:block truncate max-w-[150px]">{m.email}</span>
                          {m.memberType === "Leader" && (
                            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-accent-orange text-xs font-semibold">Leader</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-100">
                  {selectedReg.status !== "Approved" && (
                    <Button
                      variant="success"
                      className="flex-1"
                      disabled={updatingId === selectedReg.teamId}
                      onClick={() => handleStatusUpdate(selectedReg.teamId, "Approved")}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Team
                    </Button>
                  )}
                  {selectedReg.status !== "Rejected" && (
                    <Button
                      variant="destructive"
                      className="flex-1"
                      disabled={updatingId === selectedReg.teamId}
                      onClick={() => handleStatusUpdate(selectedReg.teamId, "Rejected")}
                    >
                      <XCircle className="w-4 h-4" /> Reject Team
                    </Button>
                  )}
                  {selectedReg.status !== "Pending" && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={updatingId === selectedReg.teamId}
                      onClick={() => handleStatusUpdate(selectedReg.teamId, "Pending")}
                    >
                      Reset to Pending
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
