"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  Trash2,
  Edit2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Check,
  KeyRound,
} from "lucide-react";

interface AdminUserRecord {
  _id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "coordinator";
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [notification, setNotification] = useState<string | null>(null);

  // Current logged in admin info
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createRole, setCreateRole] = useState<"admin" | "super_admin" | "coordinator">("admin");
  const [createPassword, setCreatePassword] = useState("AdminNGI@2026");

  // Edit User Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserRecord | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "super_admin" | "coordinator">("admin");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editNewPassword, setEditNewPassword] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [usersRes, meRes] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/auth/me", { credentials: "include" }),
      ]);

      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.admin?.adminId) setCurrentAdminId(meData.admin.adminId);
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        if (data.success) {
          setUsers(data.data || []);
        }
      }
    } catch (e) {
      console.error("Load admin users error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createName,
          email: createEmail,
          role: createRole,
          password: createPassword,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to create administrator account");
        return;
      }

      setNotification(`Administrator "${createName}" successfully added.`);
      setTimeout(() => setNotification(null), 3500);

      setCreateName("");
      setCreateEmail("");
      setCreateRole("admin");
      setCreatePassword("AdminNGI@2026");
      setCreateModalOpen(false);
      loadUsers();
    } catch {
      alert("Failed to communicate with the server.");
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (u: AdminUserRecord) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditRole(u.role);
    setEditIsActive(u.isActive);
    setEditNewPassword("");
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);

    try {
      const payload: any = {
        name: editName,
        role: editRole,
        isActive: editIsActive,
      };
      if (editNewPassword.trim().length >= 6) {
        payload.password = editNewPassword.trim();
      }

      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to update administrator");
        return;
      }

      setNotification(`Account for "${editName}" updated successfully.`);
      setTimeout(() => setNotification(null), 3500);
      setEditModalOpen(false);
      loadUsers();
    } catch {
      alert("Failed to save changes.");
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteUser = async (u: AdminUserRecord) => {
    if (u._id === currentAdminId) {
      alert("You cannot delete your own active administrator account.");
      return;
    }

    if (!confirm(`Are you sure you want to delete administrator account "${u.name}" (${u.email})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${u._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "Failed to delete administrator account");
        return;
      }

      setNotification(`Administrator "${u.name}" removed.`);
      setTimeout(() => setNotification(null), 3500);
      loadUsers();
    } catch {
      alert("Failed to delete user.");
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <ShieldAlert className="w-3 h-3 text-purple-600" />
            Super Admin
          </span>
        );
      case "coordinator":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Coordinator
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3 h-3 text-blue-600" />
            Administrator
          </span>
        );
    }
  };

  return (
    <>
      <AdminHeader
        title="User Management & Access Control"
        onRefresh={loadUsers}
        isRefreshing={loading}
      />

      <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1 max-w-full overflow-y-auto">
        {notification && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm py-2.5 px-4 rounded-xl text-center font-bold animate-in fade-in shadow-xs">
            {notification}
          </div>
        )}

        {/* Top Control Bar: Search, Role Filter & Add User Button */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search administrator name or email address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#174A70] transition min-h-[44px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-hidden min-h-[44px]"
              >
                <option value="ALL">All Roles</option>
                <option value="super_admin">Super Admins</option>
                <option value="admin">Standard Admins</option>
                <option value="coordinator">Coordinators</option>
              </select>

              {/* Add New Administrator Button */}
              <button
                type="button"
                onClick={() => setCreateModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F28C28] hover:bg-[#d9771a] text-white text-xs font-bold transition shadow-xs min-h-[44px]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Administrator</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Grid Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Desktop Table (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Administrator</th>
                  <th className="py-3.5 px-6">Institutional Email</th>
                  <th className="py-3.5 px-6">Role / Scope</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Created Date</th>
                  <th className="py-3.5 px-6 text-right whitespace-nowrap min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#174A70] mx-auto mb-2" />
                      Loading administrative accounts...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      No administrative users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const initials = u.name
                      ? u.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()
                      : "AD";

                    const isCurrent = u._id === currentAdminId;

                    return (
                      <tr key={u._id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#102B46] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span>{u.name}</span>
                                {isCurrent && (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-mono text-slate-600">{u.email}</td>
                        <td className="py-3.5 px-6">{getRoleBadge(u.role)}</td>
                        <td className="py-3.5 px-6">
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Disabled
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-slate-500">
                          {new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(u)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition inline-flex items-center gap-1 min-h-[36px]"
                              title="Edit Administrator"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-[#174A70]" />
                              <span>Edit</span>
                            </button>
                            <button
                              disabled={isCurrent}
                              onClick={() => handleDeleteUser(u)}
                              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition min-h-[36px] min-w-[36px] flex items-center justify-center disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                              title={isCurrent ? "Cannot delete self" : "Delete administrator account"}
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

          {/* Mobile Stacked Card View (< sm) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-[#174A70] mx-auto mb-2" />
                Loading accounts...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">No accounts found.</div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u._id} className="p-4 space-y-2.5 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{u.name}</span>
                    {getRoleBadge(u.role)}
                  </div>
                  <p className="text-xs text-slate-500 font-mono truncate">{u.email}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className={u.isActive ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                      {u.isActive ? "● Active" : "● Disabled"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs"
                      >
                        Edit
                      </button>
                      <button
                        disabled={u._id === currentAdminId}
                        onClick={() => handleDeleteUser(u)}
                        className="p-1.5 text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Modal 1: Add New Administrator */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F28C28]/10 text-[#F28C28] flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#102B46]">Add Administrator</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Institutional Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@ngi.org.in"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Administrative Role</label>
                <select
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                >
                  <option value="admin">Administrator (Registry & Studio Access)</option>
                  <option value="super_admin">Super Admin (Root Master Permissions)</option>
                  <option value="coordinator">Coordinator (Review & Inspection)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Initial / Master Password</label>
                <input
                  type="text"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="AdminNGI@2026"
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400">Can authenticate via password or secure OTP verification.</p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 rounded-xl bg-[#102B46] hover:bg-[#174A70] text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  <span>{creating ? "Creating..." : "Create Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Administrator */}
      {editModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#174A70] flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-base text-[#102B46]">Edit Administrator</h3>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Institutional Email (Read-Only)</label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Administrative Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                >
                  <option value="admin">Administrator (Registry & Studio Access)</option>
                  <option value="super_admin">Super Admin (Root Master Permissions)</option>
                  <option value="coordinator">Coordinator (Review & Inspection)</option>
                </select>
              </div>

              <div className="space-y-1 pt-1">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <div>
                    <span className="font-bold text-slate-800 block">Account Active</span>
                    <span className="text-[10px] text-slate-400">Disable to suspend console access</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Reset Password (Optional)</label>
                <input
                  type="password"
                  placeholder="Leave blank to preserve existing password"
                  value={editNewPassword}
                  onChange={(e) => setEditNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#174A70] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{savingEdit ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

