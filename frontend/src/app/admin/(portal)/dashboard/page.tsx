"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBadge from "@/components/admin/StatusBadge";
import { IDashboardStats, IRegistration } from "@/types";
import {
  Users,
  Calendar,
  Clock,
  Download,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  Loader2,
  FileEdit,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [recentRegistrations, setRecentRegistrations] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      await fetch("/api/seed");

      const [statsRes, regsRes] = await Promise.all([
        fetch("/api/stats", { credentials: "include" }),
        fetch("/api/registrations?limit=6", { credentials: "include" }),
      ]);

      if (statsRes.status === 401 || regsRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const statsData = await statsRes.json();
      const regsData = await regsRes.json();

      if (statsData.success) setStats(statsData.data);
      if (regsData.success) setRecentRegistrations(regsData.data || []);
    } catch (e) {
      console.error("Dashboard error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router]);

  const handleExport = async (institution: string = "ALL") => {
    setExporting(true);
    try {
      const res = await fetch(`/api/registrations/export?institution=${institution}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NGI_Registrations_${institution}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert("Failed to export Excel report. Please verify permissions.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <AdminHeader title="Executive Overview" onRefresh={loadData} isRefreshing={loading} />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 max-w-full overflow-y-auto">
        {/* Top Responsive Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#102B46] tracking-tight">
              Institutional Metrics
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Live multi-campus candidate registry and dynamic form performance
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleExport("ALL")}
              disabled={exporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-2xs disabled:opacity-50 min-h-[44px]"
            >
              <Download className={`w-4 h-4 text-[#174A70] ${exporting ? "animate-bounce" : ""}`} />
              <span>{exporting ? "Generating..." : "Export Excel (.xlsx)"}</span>
            </button>

            <Link
              href="/admin/form-builder"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#102B46] hover:bg-[#174A70] text-white text-xs font-bold transition shadow-xs min-h-[44px]"
            >
              <FileEdit className="w-4 h-4 text-[#F28C28]" />
              <span>Form Studio</span>
            </Link>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && !stats ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-[#174A70] animate-spin" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Syncing database metrics...</p>
          </div>
        ) : stats ? (
          <>
            {/* 1. KEY KPI CARDS - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <StatCard
                label="Total Submissions"
                value={stats.total.toLocaleString()}
                sublabel="All active records"
                icon={Users}
                colorScheme="navy"
                badge="+12% growth"
              />
              <StatCard
                label="Today's Submissions"
                value={stats.today}
                sublabel="Recorded today"
                icon={Calendar}
                colorScheme="orange"
              />
              <StatCard
                label="7-Day Velocity"
                value={stats.week}
                sublabel="Past 7 days intake"
                icon={Clock}
                colorScheme="blue"
              />
              <StatCard
                label="Verified Candidates"
                value={stats.verifiedCount}
                sublabel={`${Math.round((stats.verifiedCount / (stats.total || 1)) * 100)}% verified`}
                icon={CheckCircle2}
                colorScheme="emerald"
              />
            </div>

            {/* 2. CAMPUS DISTRIBUTION & 14-DAY TREND */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Campus Share */}
              <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#102B46] tracking-tight mb-1">Campus Distribution</h3>
                  <p className="text-xs text-slate-500 mb-6">Proportional breakdown across NCET and NCMS</p>

                  <div className="space-y-5">
                    {/* NCET */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="flex items-center gap-2 text-slate-700">
                          <span className="w-3 h-3 rounded-full bg-[#102B46]"></span>
                          NCET Engineering & Tech
                        </span>
                        <span className="text-[#102B46] font-bold">
                          {stats.ncetCount} ({Math.round((stats.ncetCount / (stats.total || 1)) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#102B46] h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${(stats.ncetCount / (stats.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* NCMS */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1.5">
                        <span className="flex items-center gap-2 text-slate-700">
                          <span className="w-3 h-3 rounded-full bg-[#F28C28]"></span>
                          NCMS Management Studies
                        </span>
                        <span className="text-[#F28C28] font-bold">
                          {stats.ncmsCount} ({Math.round((stats.ncmsCount / (stats.total || 1)) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#F28C28] h-2.5 rounded-full transition-all duration-700"
                          style={{ width: `${(stats.ncmsCount / (stats.total || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => handleExport("NCET")}
                    className="text-[#102B46] font-bold hover:underline py-1"
                  >
                    Export NCET (.xlsx)
                  </button>
                  <button
                    onClick={() => handleExport("NCMS")}
                    className="text-[#F28C28] font-bold hover:underline py-1"
                  >
                    Export NCMS (.xlsx)
                  </button>
                </div>
              </div>

              {/* Right: 14-Day Submission Volume Visual */}
              <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#102B46] tracking-tight">14-Day Registration Volume</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#102B46]"></span> NCET
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F28C28]"></span> NCMS
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-6">Daily submission volume trend</p>

                  {/* Responsive Bar Visualizer */}
                  <div className="overflow-x-auto pb-2">
                    <div className="h-44 min-w-[340px] flex items-end gap-1.5 sm:gap-2.5 pt-6">
                      {stats.trends.map((item, idx) => {
                        const maxVal = Math.max(...stats.trends.map((t) => t.total), 5);
                        const heightPct = Math.max((item.total / maxVal) * 100, 6);
                        const ncetHeight = item.total ? (item.ncet / item.total) * 100 : 50;
                        const ncmsHeight = item.total ? (item.ncms / item.total) * 100 : 50;

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                            <div
                              className="w-full max-w-[24px] rounded-t-md overflow-hidden flex flex-col transition-all group-hover:opacity-90"
                              style={{ height: `${heightPct}%` }}
                            >
                              <div className="bg-[#F28C28]" style={{ height: `${ncmsHeight}%` }} />
                              <div className="bg-[#102B46]" style={{ height: `${ncetHeight}%` }} />
                            </div>
                            <span className="text-[10px] text-slate-400 mt-2 truncate w-full text-center">
                              {item.date.split(" ")[1]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Past 14 Days</span>
                  <span className="font-semibold text-slate-700">Multi-campus intake velocity</span>
                </div>
              </div>
            </div>

            {/* 3. RECENT REGISTRATIONS FEED */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#102B46]">Recent Submissions</h3>
                  <p className="text-xs text-slate-500">Latest candidate registrations across all campuses</p>
                </div>
                <Link
                  href="/admin/registrations"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#174A70] hover:text-[#102B46] transition py-1"
                >
                  <span>Open Console</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Desktop Data Grid */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-3.5 px-6">Registration ID</th>
                      <th className="py-3.5 px-6">Candidate</th>
                      <th className="py-3.5 px-6">Campus</th>
                      <th className="py-3.5 px-6">Department</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No registrations found yet.
                        </td>
                      </tr>
                    ) : (
                      recentRegistrations.map((reg) => (
                        <tr key={reg._id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-6 font-mono font-bold text-[#102B46]">
                            {reg.registrationId}
                          </td>
                          <td className="py-3.5 px-6 font-medium text-slate-800">
                            <div>{reg.candidateName}</div>
                            <div className="text-[11px] text-slate-400">{reg.candidateEmail}</div>
                          </td>
                          <td className="py-3.5 px-6">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                reg.institutionShortName === "NCET"
                                  ? "bg-blue-50 text-[#174A70]"
                                  : "bg-orange-50 text-[#F28C28]"
                              }`}
                            >
                              {reg.institutionShortName}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-slate-600 truncate max-w-[200px]">
                            {reg.department || "—"}
                          </td>
                          <td className="py-3.5 px-6">
                            <StatusBadge status={reg.status} />
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <Link
                              href={`/admin/registrations?search=${reg.registrationId}`}
                              className="inline-flex items-center gap-1 text-[#174A70] font-bold hover:underline py-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Inspect
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Card View (< sm: 640px) */}
              <div className="sm:hidden divide-y divide-slate-100">
                {recentRegistrations.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No registrations found yet.
                  </div>
                ) : (
                  recentRegistrations.map((reg) => (
                    <div key={reg._id} className="p-4 space-y-2 hover:bg-slate-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-[#102B46]">{reg.registrationId}</span>
                        <StatusBadge status={reg.status} />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-800">{reg.candidateName}</p>
                        <p className="text-slate-400 text-[11px] truncate">{reg.candidateEmail}</p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-500">{reg.institutionShortName} • {reg.department || "General"}</span>
                        <Link
                          href={`/admin/registrations?search=${reg.registrationId}`}
                          className="font-bold text-[#174A70] hover:underline"
                        >
                          Inspect →
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>
    </>
  );
}

