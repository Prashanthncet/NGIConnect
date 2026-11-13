"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { IRegistration, IForm } from "@/types";
import {
  Users,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Calendar,
  Building,
  User,
  Mail,
  Phone,
  Loader2,
  Check,
  Edit3,
  Save,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

const ALL_STATUSES = ["Verified", "Pending", "Under Review", "Rejected"] as const;

function RegistrationsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [registrations, setRegistrations] = useState<IRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [institution, setInstitution] = useState("ALL");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, limit: 10 });

  // Selected row IDs for bulk operations
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Inspection Drawer state
  const [selectedReg, setSelectedReg] = useState<IRegistration | null>(null);
  const [pairedForm, setPairedForm] = useState<IForm | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // In-Drawer Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editCandidateName, setEditCandidateName] = useState("");
  const [editCandidateEmail, setEditCandidateEmail] = useState("");
  const [editCandidatePhone, setEditCandidatePhone] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editResponses, setEditResponses] = useState<Record<string, any>>({});

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const statusParam = selectedStatuses.length > 0 ? selectedStatuses.join(",") : "ALL";
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        institution,
        status: statusParam,
        search,
      });

      const res = await fetch(`/api/registrations?${params.toString()}`, { credentials: "include" });
      const data = await res.json();

      if (data.success) {
        setRegistrations(data.data || []);
        if (data.pagination) setPagination(data.pagination);
      }
    } catch (e) {
      console.error("Fetch registrations error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [page, institution, selectedStatuses]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRegistrations();
  };

  // Toggle individual status filter checkbox
  const handleToggleStatusFilter = (st: string) => {
    setPage(1);
    setSelectedStatuses((prev) => {
      if (prev.includes(st)) {
        return prev.filter((item) => item !== st);
      } else {
        return [...prev, st];
      }
    });
  };

  const handleClearStatusFilters = () => {
    setPage(1);
    setSelectedStatuses([]);
  };

  // Row selection handlers
  const handleSelectAllRows = () => {
    if (selectedRowIds.length === registrations.length && registrations.length > 0) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(registrations.map((r) => r.registrationId));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk status update
  const handleBulkStatusChange = async (newStatus: string) => {
    if (selectedRowIds.length === 0) return;
    setBulkUpdating(true);
    try {
      await Promise.all(
        selectedRowIds.map((regId) =>
          fetch(`/api/registrations/${regId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
            credentials: "include",
          })
        )
      );

      setRegistrations((prev) =>
        prev.map((r) =>
          selectedRowIds.includes(r.registrationId) ? { ...r, status: newStatus as any } : r
        )
      );

      setNotification(`Updated ${selectedRowIds.length} candidate(s) to ${newStatus}`);
      setSelectedRowIds([]);
      setTimeout(() => setNotification(null), 3500);
    } catch {
      alert("Failed to update all selected registrations.");
    } finally {
      setBulkUpdating(false);
    }
  };

  // Inspect registration & load form questions
  const openInspector = async (reg: IRegistration) => {
    setSelectedReg(reg);
    setIsEditing(false);
    setEditCandidateName(reg.candidateName || "");
    setEditCandidateEmail(reg.candidateEmail || "");
    setEditCandidatePhone(reg.candidatePhone || "");
    setEditDepartment(reg.department || "");
    setEditCategory(reg.category || "");
    setEditResponses(reg.responses ? { ...reg.responses } : {});
    setDrawerOpen(true);

    try {
      const res = await fetch(`/api/registrations/${reg._id || reg.registrationId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.form) {
        setPairedForm(data.form);
      }
    } catch (e) {
      console.error("Error loading form details:", e);
    }
  };

  // Single status change
  const handleStatusChange = async (newStatus: string) => {
    if (!selectedReg) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/registrations/${selectedReg._id || selectedReg.registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReg({ ...selectedReg, status: newStatus as any });
        setRegistrations((prev) =>
          prev.map((r) =>
            r.registrationId === selectedReg.registrationId ? { ...r, status: newStatus as any } : r
          )
        );
        setNotification(`Registration status updated to ${newStatus}`);
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (e) {
      console.error("Failed to update status:", e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Save in-drawer edits
  const handleSaveInspectEdit = async () => {
    if (!selectedReg) return;
    setIsSavingEdit(true);

    try {
      const payload = {
        candidateName: editCandidateName,
        candidateEmail: editCandidateEmail,
        candidatePhone: editCandidatePhone,
        department: editDepartment,
        category: editCategory,
        responses: editResponses,
      };

      const res = await fetch(`/api/registrations/${selectedReg._id || selectedReg.registrationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (data.success) {
        const updatedRecord: IRegistration = {
          ...selectedReg,
          candidateName: editCandidateName,
          candidateEmail: editCandidateEmail,
          candidatePhone: editCandidatePhone,
          department: editDepartment,
          category: editCategory,
          responses: editResponses,
        };

        setSelectedReg(updatedRecord);
        setRegistrations((prev) =>
          prev.map((r) => (r.registrationId === selectedReg.registrationId ? updatedRecord : r))
        );

        setIsEditing(false);
        setNotification("Candidate information and responses saved successfully!");
        setTimeout(() => setNotification(null), 3500);
      } else {
        alert(data.error || "Failed to save record modifications.");
      }
    } catch (e) {
      console.error("Save edit error:", e);
      alert("Network error while saving modifications.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async (regId: string) => {
    if (!confirm(`Are you sure you want to permanently delete registration ${regId}?`)) return;
    try {
      const res = await fetch(`/api/registrations/${regId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.registrationId !== regId));
        if (selectedReg?.registrationId === regId) {
          setDrawerOpen(false);
        }
      }
    } catch {
      alert("Failed to delete registration");
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const statusParam = selectedStatuses.length > 0 ? selectedStatuses.join(",") : "ALL";
      const params = new URLSearchParams({
        institution,
        status: statusParam,
        search,
      });
      const res = await fetch(`/api/registrations/export?${params.toString()}`, { credentials: "include" });
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
      alert("Export failed");
    } finally {
      setExporting(false);
    }
  };

  const copyRegId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <>
      <AdminHeader title="Registrations Console" onRefresh={fetchRegistrations} isRefreshing={loading} />

      <main className="p-4 sm:p-6 lg:p-8 space-y-5 flex-1 max-w-full overflow-y-auto">
        {notification && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm py-2 px-4 rounded-xl text-center font-bold animate-in fade-in shadow-xs">
            {notification}
          </div>
        )}

        {/* 1. Console Top Bar: Search, Campus Filter, Export */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search candidate name, ID, email, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#174A70] transition min-h-[44px]"
              />
            </form>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Institution Filter */}
              <select
                value={institution}
                onChange={(e) => {
                  setInstitution(e.target.value);
                  setPage(1);
                }}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden min-h-[44px]"
              >
                <option value="ALL">All Campuses (NCET & NCMS)</option>
                <option value="NCET">NCET Engineering</option>
                <option value="NCMS">NCMS Management</option>
              </select>

              {/* Excel Export Button */}
              <button
                onClick={handleExport}
                disabled={exporting}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#102B46] hover:bg-[#174A70] text-white text-xs font-bold transition shadow-2xs disabled:opacity-50 min-h-[44px]"
              >
                <Download className={`w-3.5 h-3.5 text-[#F28C28] ${exporting ? "animate-bounce" : ""}`} />
                <span>{exporting ? "Generating..." : "Export Excel (.xlsx)"}</span>
              </button>
            </div>
          </div>

          {/* 2. Interactive Status Filter Checkboxes (Requirement 1) */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                Filter by Status:
              </span>
              {selectedStatuses.length > 0 && (
                <button
                  onClick={handleClearStatusFilters}
                  className="text-[11px] font-bold text-[#F28C28] hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* 'All' Toggle Pill */}
              <label
                onClick={handleClearStatusFilters}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                  selectedStatuses.length === 0
                    ? "bg-[#102B46] text-white border-[#102B46]"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.length === 0}
                  readOnly
                  className="w-3.5 h-3.5 rounded text-[#102B46] cursor-pointer"
                />
                <span>All Statuses</span>
              </label>

              {/* Checkbox for Verified */}
              <label
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                  selectedStatuses.includes("Verified")
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("Verified")}
                  onChange={() => handleToggleStatusFilter("Verified")}
                  className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                <span>Verified</span>
              </label>

              {/* Checkbox for Pending */}
              <label
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                  selectedStatuses.includes("Pending")
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                    : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("Pending")}
                  onChange={() => handleToggleStatusFilter("Pending")}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
                <span>Pending</span>
              </label>

              {/* Checkbox for Under Review */}
              <label
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                  selectedStatuses.includes("Under Review")
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                    : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("Under Review")}
                  onChange={() => handleToggleStatusFilter("Under Review")}
                  className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                <span>Under Review</span>
              </label>

              {/* Checkbox for Rejected */}
              <label
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition ${
                  selectedStatuses.includes("Rejected")
                    ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                    : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/70"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes("Rejected")}
                  onChange={() => handleToggleStatusFilter("Rejected")}
                  className="w-3.5 h-3.5 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                <span>Rejected</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Bulk Action Floating Bar (when rows are checked) */}
        {selectedRowIds.length > 0 && (
          <div className="bg-[#102B46] text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="bg-[#F28C28] text-white px-2 py-0.5 rounded-md font-mono">
                {selectedRowIds.length}
              </span>
              <span>Candidate(s) Selected</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-300 font-semibold mr-1">Mark selected as:</span>
              <button
                disabled={bulkUpdating}
                onClick={() => handleBulkStatusChange("Verified")}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" />
                Verified
              </button>
              <button
                disabled={bulkUpdating}
                onClick={() => handleBulkStatusChange("Pending")}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
              >
                <Clock className="w-3.5 h-3.5" />
                Pending
              </button>
              <button
                disabled={bulkUpdating}
                onClick={() => handleBulkStatusChange("Rejected")}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
              >
                <XCircle className="w-3.5 h-3.5" />
                Rejected
              </button>
              <button
                onClick={() => setSelectedRowIds([])}
                className="px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white text-xs font-semibold"
              >
                Deselect
              </button>
            </div>
          </div>
        )}

        {/* 4. Data Grid Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop & Tablet Table (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        registrations.length > 0 && selectedRowIds.length === registrations.length
                      }
                      onChange={handleSelectAllRows}
                      className="w-4 h-4 rounded text-[#174A70] focus:ring-[#174A70] cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4">Registration ID</th>
                  <th className="py-3.5 px-6">Candidate</th>
                  <th className="py-3.5 px-4">Campus</th>
                  <th className="py-3.5 px-6">Program / Department</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-6 text-right whitespace-nowrap min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#174A70] mx-auto mb-2" />
                      Loading candidate registrations...
                    </td>
                  </tr>
                ) : registrations.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No registrations found matching the selected filters.
                    </td>
                  </tr>
                ) : (
                  registrations.map((reg) => {
                    const isSelected = selectedRowIds.includes(reg.registrationId);
                    return (
                      <tr
                        key={reg._id}
                        className={`transition ${isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/70"}`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleRow(reg.registrationId)}
                            className="w-4 h-4 rounded text-[#174A70] focus:ring-[#174A70] cursor-pointer"
                          />
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#102B46]">
                          {reg.registrationId}
                        </td>
                        <td className="py-3.5 px-6">
                          <div className="font-semibold text-slate-800">{reg.candidateName}</div>
                          <div className="text-[11px] text-slate-400">{reg.candidateEmail}</div>
                        </td>
                        <td className="py-3.5 px-4">
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
                        <td className="py-3.5 px-4">
                          <StatusBadge status={reg.status} />
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(reg.submittedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                            <button
                              onClick={() => openInspector(reg)}
                              className="px-3 py-1.5 rounded-xl bg-[#174A70]/10 text-[#174A70] hover:bg-[#174A70]/20 font-bold transition inline-flex items-center gap-1.5 min-h-[36px] shrink-0"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Inspect</span>
                            </button>
                            <button
                              onClick={() => handleDelete(reg.registrationId)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                              title="Delete submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Stacked Card View (< sm: 640px) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#174A70] mx-auto mb-2" />
                Loading candidate registrations...
              </div>
            ) : registrations.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No registrations found matching the criteria.
              </div>
            ) : (
              registrations.map((reg) => (
                <div key={reg._id} className="p-4 space-y-3 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-[#102B46]">{reg.registrationId}</span>
                    <StatusBadge status={reg.status} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{reg.candidateName}</p>
                    <p className="text-slate-400 text-xs truncate">{reg.candidateEmail}</p>
                    <p className="text-slate-600 text-xs mt-1">
                      {reg.institutionShortName} • {reg.department || "General"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-400">
                      {new Date(reg.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openInspector(reg)}
                        className="px-3 py-1.5 rounded-lg bg-[#174A70] text-white font-bold text-xs flex items-center gap-1 min-h-[38px]"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect
                      </button>
                      <button
                        onClick={() => handleDelete(reg.registrationId)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 min-h-[38px] min-w-[38px]"
                        title="Delete submission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              Showing Page <span className="font-bold">{page}</span> of{" "}
              <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} total records)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 min-h-[40px] min-w-[40px] flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Slide-out Inspection & Edit Drawer (Requirement 3) */}
      {drawerOpen && selectedReg && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-full sm:max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 bg-[#102B46] text-white flex items-center justify-between shrink-0">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base sm:text-lg font-mono break-all">{selectedReg.registrationId}</span>
                  <button
                    onClick={() => copyRegId(selectedReg.registrationId)}
                    className="p-1 text-slate-300 hover:text-white"
                  >
                    {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 truncate">
                  Submitted for {selectedReg.institutionShortName} Registry
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Mode Toggle Button */}
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 min-h-[38px]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#F28C28]" />
                    <span>Edit Record</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset edits
                      setEditCandidateName(selectedReg.candidateName || "");
                      setEditCandidateEmail(selectedReg.candidateEmail || "");
                      setEditCandidatePhone(selectedReg.candidatePhone || "");
                      setEditDepartment(selectedReg.department || "");
                      setEditResponses(selectedReg.responses ? { ...selectedReg.responses } : {});
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition flex items-center gap-1 min-h-[38px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                )}

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 text-slate-400 hover:text-white rounded-lg bg-white/10 min-h-[38px] min-w-[38px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
              {/* Status Updater Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 text-sm">Candidate Status</span>
                  <StatusBadge status={selectedReg.status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ALL_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      disabled={updatingStatus || selectedReg.status === st}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition min-h-[44px] ${
                        selectedReg.status === st
                          ? "bg-[#102B46] text-white border-[#102B46]"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                      } disabled:opacity-50`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant Identity Card (Editable or Read-Only) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#102B46]">
                    Candidate Profile
                  </h4>
                  {isEditing && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Editing Enabled
                    </span>
                  )}
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/60">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Full Name</span>
                      <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedReg.candidateName}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Email Address</span>
                      <p className="font-semibold text-slate-800 text-xs mt-0.5 break-all">{selectedReg.candidateEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Contact Number</span>
                      <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedReg.candidatePhone || "—"}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Department / Program</span>
                      <p className="font-semibold text-slate-800 text-xs mt-0.5">{selectedReg.department || "—"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border border-[#174A70]/30 bg-blue-50/20">
                    <div className="space-y-1">
                      <label className="text-slate-600 text-[11px] uppercase font-bold block">Full Name</label>
                      <input
                        type="text"
                        value={editCandidateName}
                        onChange={(e) => setEditCandidateName(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174A70]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 text-[11px] uppercase font-bold block">Email Address</label>
                      <input
                        type="email"
                        value={editCandidateEmail}
                        onChange={(e) => setEditCandidateEmail(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174A70]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 text-[11px] uppercase font-bold block">Contact Number</label>
                      <input
                        type="text"
                        value={editCandidatePhone}
                        onChange={(e) => setEditCandidatePhone(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174A70]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-600 text-[11px] uppercase font-bold block">Department / Program</label>
                      <input
                        type="text"
                        value={editDepartment}
                        onChange={(e) => setEditDepartment(e.target.value)}
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#174A70]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Question Responses (Editable or Read-Only) */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#102B46]">
                  Dynamic Form Responses
                </h4>

                <div className="space-y-2.5">
                  {!isEditing ? (
                    Object.entries(selectedReg.responses || {}).map(([key, val]) => {
                      const matchedField = pairedForm?.fields.find((f) => f.id === key);
                      const label = matchedField ? matchedField.label : key;

                      return (
                        <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
                          <p className="font-bold text-slate-700 text-xs mb-1.5">{label}</p>
                          <p className="text-slate-900 bg-slate-50 p-2 rounded-lg font-mono text-[11px] break-all">
                            {Array.isArray(val) ? val.join(", ") : String(val)}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <>
                      {/* Render paired form fields as editable controls */}
                      {pairedForm?.fields
                        ?.filter((f) => !["section_heading", "description"].includes(f.type))
                        ?.map((field) => {
                          const currentVal =
                            editResponses[field.id] !== undefined
                              ? editResponses[field.id]
                              : selectedReg.responses?.[field.id] || "";

                          return (
                            <div key={field.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                              <label className="font-bold text-slate-800 text-xs block">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                              </label>

                              {field.type === "long_text" ? (
                                <textarea
                                  rows={2}
                                  value={currentVal}
                                  onChange={(e) =>
                                    setEditResponses({ ...editResponses, [field.id]: e.target.value })
                                  }
                                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#174A70] focus:outline-hidden resize-none"
                                />
                              ) : field.type === "dropdown" && field.options && field.options.length > 0 ? (
                                <select
                                  value={currentVal}
                                  onChange={(e) =>
                                    setEditResponses({ ...editResponses, [field.id]: e.target.value })
                                  }
                                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                                >
                                  <option value="">Select option...</option>
                                  {field.options.map((opt, i) => (
                                    <option key={i} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type="text"
                                  value={Array.isArray(currentVal) ? currentVal.join(", ") : currentVal}
                                  onChange={(e) =>
                                    setEditResponses({ ...editResponses, [field.id]: e.target.value })
                                  }
                                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                                />
                              )}
                            </div>
                          );
                        })}

                      {/* Any existing response key that wasn't in pairedForm fields */}
                      {Object.entries(editResponses || {}).map(([key, val]) => {
                        const inPaired = pairedForm?.fields?.some((f) => f.id === key);
                        if (inPaired) return null;

                        return (
                          <div key={key} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                            <label className="font-bold text-slate-700 text-xs block capitalize">
                              {key.replace(/_/g, " ")}
                            </label>
                            <input
                              type="text"
                              value={Array.isArray(val) ? val.join(", ") : String(val || "")}
                              onChange={(e) =>
                                setEditResponses({ ...editResponses, [key]: e.target.value })
                              }
                              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                            />
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              {isEditing ? (
                <div className="flex items-center gap-2 w-full justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition min-h-[42px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingEdit}
                    onClick={handleSaveInspectEdit}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 min-h-[42px]"
                  >
                    {isSavingEdit ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{isSavingEdit ? "Saving..." : "Save Record Changes"}</span>
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleDelete(selectedReg.registrationId)}
                    className="px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 rounded-xl bg-[#174A70] hover:bg-[#102B46] text-white text-xs font-bold transition flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition min-h-[44px]"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminRegistrationsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#174A70]" />
        </div>
      }
    >
      <RegistrationsContent />
    </Suspense>
  );
}
