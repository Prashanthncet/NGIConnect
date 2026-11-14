"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Mail,
  Send,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Settings,
  Layers,
  FileText,
  Smartphone,
  Monitor,
  Loader2,
  Info,
  Columns,
  LayoutTemplate,
} from "lucide-react";

interface EmailStep {
  title: string;
  description: string;
}

interface EmailTemplateData {
  subject: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  institutionHeader: string;
  headerTitle: string;
  academicYear: string;
  welcomeMessage: string;
  highlightLabel: string;
  campusBadge: string;
  stepsHeading: string;
  steps: EmailStep[];
  supportEmail: string;
  supportPhone: string;
  footerAffiliation: string;
  footerCopyright: string;
  useCidLogo: boolean;
  logoUrl?: string;
}

const DEFAULT_TEMPLATE: EmailTemplateData = {
  subject: "Registration Confirmed: {{registrationId}} - {{campusName}}",
  fromName: "Nagarjuna Connect Admissions",
  fromEmail: "",
  replyTo: "",
  institutionHeader: "NAGARJUNA GROUP OF INSTITUTIONS (NGI)",
  headerTitle: "Registration Confirmation & Thank You",
  academicYear: "2026-2027",
  welcomeMessage:
    "Thank you for registering with <strong>Nagarjuna Connect</strong> for <strong>{{campusName}}</strong>. Your application has been successfully logged into our central academic admissions registry.",
  highlightLabel: "YOUR OFFICIAL REGISTRATION ID",
  campusBadge: "{{institution}} Campus • Academic Session {{academicYear}}",
  stepsHeading: "WHAT HAPPENS NEXT:",
  steps: [
    {
      title: "Document Review",
      description:
        "Our admissions team is reviewing your details and uploaded documents against program prerequisites.",
    },
    {
      title: "Print Acknowledgement Slip",
      description:
        "Keep a digital or printed copy of your Registration ID for campus visits, counseling, and document verification.",
    },
    {
      title: "Official Communications",
      description:
        "You will receive notifications via email and SMS regarding interview schedules, orientation dates, and fee challan procedures.",
    },
  ],
  supportEmail: "academic.connect@ncet.co.in",
  supportPhone: "+91 80 6746 2700",
  footerAffiliation:
    "Autonomous Institution • Affiliated to VTU / BNU • Approved by AICTE • Bengaluru",
  footerCopyright: "© 2026 Nagarjuna Education Society. All Rights Reserved.",
  useCidLogo: true,
  logoUrl: "",
};

export default function EmailTemplatesPage() {
  const [template, setTemplate] = useState<EmailTemplateData>(DEFAULT_TEMPLATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "steps" | "routing" | "footer">("content");
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [notification, setNotification] = useState<string | null>(null);

  // Send Test Email Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);

  // Load template from backend
  const loadTemplate = async () => {
    setLoading(true);
    try {
      const stored = localStorage.getItem("ngi_admin_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.email) setTestEmail(parsed.email);
        } catch {}
      }

      const res = await fetch(`/api/email-template?_t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok && data?.data) {
        setTemplate({
          ...DEFAULT_TEMPLATE,
          ...data.data,
          steps: data.data.steps && data.data.steps.length > 0 ? data.data.steps : DEFAULT_TEMPLATE.steps,
        });
      }
    } catch (err) {
      console.error("Failed to load email template:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplate();
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/email-template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(template),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to update email template");
        return;
      }
      showToast("Email template successfully saved and cached for all admissions!");
    } catch {
      showToast("Error connecting to server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setSendingTest(true);
    try {
      const res = await fetch("/api/email-template/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: testEmail.trim(),
          templateOverrides: template,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to send test email");
        return;
      }
      showToast(`Test email successfully dispatched to ${testEmail}! Check inbox.`);
      setTestModalOpen(false);
    } catch {
      showToast("Failed to dispatch test email.");
    } finally {
      setSendingTest(false);
    }
  };

  const handleAddStep = () => {
    setTemplate((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: `Step ${prev.steps.length + 1}`,
          description: "Enter detailed step instructions here...",
        },
      ],
    }));
  };

  const handleUpdateStep = (index: number, field: "title" | "description", value: string) => {
    setTemplate((prev) => {
      const updated = [...prev.steps];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, steps: updated };
    });
  };

  const handleRemoveStep = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, idx) => idx !== index),
    }));
  };

  const handleResetDefaults = () => {
    if (confirm("Restore standard Nagarjuna Group institutional template wording?")) {
      setTemplate(DEFAULT_TEMPLATE);
      showToast("Restored default template values. Click 'Save Template' to commit.");
    }
  };

  // Build sandboxed HTML string for IFRAME
  const generatePreviewHtml = () => {
    const candidateName = "Prashanth B";
    const regId = "NGI-NCMS-2026-82057";
    const campus = "Nagarjuna College of Management Studies (NCMS)";
    const inst = "NCMS";

    const replaceVars = (text: string) =>
      text
        .replace(/\{\{candidateName\}\}/gi, candidateName)
        .replace(/\{\{registrationId\}\}/gi, regId)
        .replace(/\{\{campusName\}\}/gi, campus)
        .replace(/\{\{institution\}\}/gi, inst)
        .replace(/\{\{academicYear\}\}/gi, template.academicYear);

    const logoHtml = template.useCidLogo
      ? `<div style="text-align:center;margin-bottom:14px;">
          <img src="/images/ngi-logo.png" alt="NGI Logo" style="width:64px;height:64px;object-fit:contain;display:inline-block;border-radius:12px;background:rgba(255,255,255,0.12);padding:4px;" />
        </div>`
      : "";

    const stepsHtml = template.steps
      .map(
        (step, idx) => `
        <li style="margin-bottom: 12px; line-height: 1.5; color: #334155;">
          <strong style="color: #0f172a;">${idx + 1}. ${replaceVars(step.title)}:</strong> ${replaceVars(step.description)}
        </li>
      `
      )
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f1f5f9; margin: 0; padding: 18px 8px; color: #1e293b; }
          .wrapper { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 8px 20px -4px rgba(16,43,70,0.08); }
          .header { background: linear-gradient(135deg, #0b1f33 0%, #102B46 100%); padding: 28px 22px; text-align: center; color: #ffffff; }
          .header-institution { margin: 0; font-size: 12px; color: #F28C28; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
          .header-title { margin: 8px 0 0; font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.3; }
          .body { padding: 28px 24px; background: #ffffff; }
          .greeting { font-size: 17px; font-weight: 700; color: #102B46; margin-bottom: 12px; }
          .highlight-card { background: linear-gradient(135deg, #102B46 0%, #15385b 100%); border-radius: 14px; padding: 20px 18px; color: #ffffff; text-align: center; margin: 22px 0; border: 1px solid #1e3a5f; }
          .reg-label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.12em; color: #94a3b8; font-weight: 700; }
          .reg-id { font-size: 24px; font-family: monospace; font-weight: 800; color: #F28C28; margin: 8px 0; letter-spacing: 1.5px; }
          .campus-badge { display: inline-block; background: rgba(242,140,40,0.18); color: #ffb066; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; border: 1px solid rgba(242,140,40,0.35); }
          .steps-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin: 22px 0; }
          .steps-heading { margin: 0 0 12px 0; font-size: 12px; color: #102B46; text-transform: uppercase; font-weight: 800; }
          .footer { background: #f8fafc; padding: 20px 22px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            ${logoHtml}
            <p class="header-institution">${replaceVars(template.institutionHeader)}</p>
            <h1 class="header-title">${replaceVars(template.headerTitle)}</h1>
          </div>
          <div class="body">
            <div class="greeting">Dear ${candidateName},</div>
            <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 18px 0;">
              ${replaceVars(template.welcomeMessage)}
            </p>
            <div class="highlight-card">
              <div class="reg-label">${replaceVars(template.highlightLabel)}</div>
              <div class="reg-id">${regId}</div>
              <div class="campus-badge">${replaceVars(template.campusBadge)}</div>
            </div>
            <div class="steps-card">
              <h3 class="steps-heading">${replaceVars(template.stepsHeading)}</h3>
              <ul style="padding-left: 20px; margin: 0;">
                ${stepsHtml}
              </ul>
            </div>
            <p style="font-size: 12.5px; color: #475569; line-height: 1.55; margin: 20px 0 0 0; padding-top: 14px; border-top: 1px solid #e2e8f0;">
              For immediate questions regarding your application status, reply directly to this email or reach our admissions helpdesk at 
              <strong style="color: #F28C28;">${template.supportEmail}</strong> or call 
              <strong style="color: #102B46;">${template.supportPhone}</strong>.
            </p>
          </div>
          <div class="footer">
            <p style="margin: 0 0 3px 0; color: #1e293b; font-weight: 700;">${campus}</p>
            <p style="margin: 0 0 5px 0; color: #64748b; font-size: 10.5px;">${replaceVars(template.footerAffiliation)}</p>
            <p style="margin: 0; color: #94a3b8; font-size: 10.5px;">${replaceVars(template.footerCopyright)}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  return (
    <>
      <AdminHeader title="Email Template Studio" onRefresh={loadTemplate} isRefreshing={loading} />

      <main className="p-4 sm:p-6 lg:p-8 space-y-5 flex-1 max-w-full overflow-y-auto">
        {/* Toast Notification */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm py-2 px-4 rounded-xl text-center font-bold animate-in fade-in shadow-xs">
            {notification}
          </div>
        )}

        {/* 1. Top Console Action Bar (Matches Registrations Top Bar Exactly) */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-[#102B46]/10 text-[#102B46] rounded-lg">
                  <Mail className="w-5 h-5" />
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#102B46] tracking-tight">
                  Admissions Email Template Studio
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Design and configure automated candidate confirmation emails, institutional branding, next steps, and SMTP credentials.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* View Switcher: Split / Editor / Preview */}
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                    viewMode === "split" ? "bg-[#102B46] text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("editor")}
                  className={`px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                    viewMode === "editor" ? "bg-[#102B46] text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Editor Only
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("preview")}
                  className={`px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                    viewMode === "preview" ? "bg-[#102B46] text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Preview Only
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleResetDefaults}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition flex items-center gap-1.5 min-h-[40px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Defaults</span>
              </button>

              <button
                type="button"
                onClick={() => setTestModalOpen(true)}
                className="px-4 py-2 text-xs font-bold text-[#F28C28] bg-orange-50/70 hover:bg-orange-100/80 border border-orange-200/80 rounded-xl transition flex items-center gap-1.5 min-h-[40px]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Test</span>
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 text-xs font-bold text-white bg-[#102B46] hover:bg-[#174A70] rounded-xl transition shadow-xs flex items-center gap-2 disabled:opacity-50 min-h-[40px]"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{saving ? "Saving..." : "Save Template"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Workspace: Side-by-Side Split or Full View */}
        <div
          className={`${
            viewMode === "split"
              ? "grid grid-cols-1 xl:grid-cols-12 gap-6 items-start"
              : viewMode === "editor"
              ? "max-w-5xl mx-auto space-y-4"
              : "max-w-4xl mx-auto space-y-4"
          }`}
        >
          {/* LEFT / EDITOR PANEL */}
          {(viewMode === "split" || viewMode === "editor") && (
            <div className={`${viewMode === "split" ? "xl:col-span-6 space-y-4" : "space-y-4"}`}>
              {/* Section Tabs */}
              <div className="bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === "content"
                      ? "bg-[#102B46] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Headings & Copy</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("steps")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === "steps"
                      ? "bg-[#102B46] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Steps ({template.steps.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("routing")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === "routing"
                      ? "bg-[#102B46] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Sender & Support</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("footer")}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    activeTab === "footer"
                      ? "bg-[#102B46] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Logo & Footer</span>
                </button>
              </div>

              {/* TAB 1: HEADINGS & COPY */}
              {activeTab === "content" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-[#102B46]">Email Titles & Candidate Welcome Message</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Available dynamic tokens:{" "}
                      <code className="text-[#F28C28] font-bold">{"{{candidateName}}"}</code>,{" "}
                      <code className="text-[#F28C28] font-bold">{"{{registrationId}}"}</code>,{" "}
                      <code className="text-[#F28C28] font-bold">{"{{campusName}}"}</code>,{" "}
                      <code className="text-[#F28C28] font-bold">{"{{academicYear}}"}</code>.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Subject Line
                    </label>
                    <input
                      type="text"
                      value={template.subject}
                      onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#102B46]/20 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Top Institution Subtitle
                      </label>
                      <input
                        type="text"
                        value={template.institutionHeader}
                        onChange={(e) => setTemplate({ ...template, institutionHeader: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Main Email Heading
                      </label>
                      <input
                        type="text"
                        value={template.headerTitle}
                        onChange={(e) => setTemplate({ ...template, headerTitle: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Welcome Introduction Note (HTML allowed)
                    </label>
                    <textarea
                      rows={4}
                      value={template.welcomeMessage}
                      onChange={(e) => setTemplate({ ...template, welcomeMessage: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#102B46]/20 font-medium leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Registration ID Card Label
                      </label>
                      <input
                        type="text"
                        value={template.highlightLabel}
                        onChange={(e) => setTemplate({ ...template, highlightLabel: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Academic Year / Session Badge
                      </label>
                      <input
                        type="text"
                        value={template.academicYear}
                        onChange={(e) => setTemplate({ ...template, academicYear: e.target.value })}
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden font-medium"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: STEPS */}
              {activeTab === "steps" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#102B46]">Admissions Action Checklist / Next Steps</h3>
                      <p className="text-xs text-slate-500">Provide clear action items for candidates following registration.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3 py-1.5 bg-[#F28C28]/10 text-[#F28C28] hover:bg-[#F28C28]/20 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Step</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Checklist Section Heading
                    </label>
                    <input
                      type="text"
                      value={template.stepsHeading}
                      onChange={(e) => setTemplate({ ...template, stepsHeading: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div className="space-y-3">
                    {template.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-2 hover:border-slate-300 transition"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold text-[#102B46] bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                            Step #{idx + 1}
                          </span>
                          {template.steps.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveStep(idx)}
                              className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition"
                              title="Delete step"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleUpdateStep(idx, "title", e.target.value)}
                          placeholder="Step Title (e.g. Document Verification)"
                          className="w-full text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden"
                        />
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => handleUpdateStep(idx, "description", e.target.value)}
                          placeholder="Step description details..."
                          className="w-full text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-2.5 focus:outline-hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ROUTING & SENDER */}
              {activeTab === "routing" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-[#102B46]">Sender Identity & Admissions Helpdesk</h3>
                    <p className="text-xs text-slate-500">
                      Configure from-name, institutional support helpline, and reply-to email address.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Sender Name (From Name)
                      </label>
                      <input
                        type="text"
                        value={template.fromName}
                        onChange={(e) => setTemplate({ ...template, fromName: e.target.value })}
                        placeholder="e.g. Nagarjuna Connect Admissions"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Sender Email Override
                      </label>
                      <input
                        type="text"
                        value={template.fromEmail}
                        onChange={(e) => setTemplate({ ...template, fromEmail: e.target.value })}
                        placeholder="Leave empty to use .env SMTP_USER"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Reply-To Email
                      </label>
                      <input
                        type="text"
                        value={template.replyTo}
                        onChange={(e) => setTemplate({ ...template, replyTo: e.target.value })}
                        placeholder="e.g. academic.connect@ncet.co.in"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Admissions Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={template.supportPhone}
                        onChange={(e) => setTemplate({ ...template, supportPhone: e.target.value })}
                        placeholder="+91 80 6746 2700"
                        className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Support Contact Email
                    </label>
                    <input
                      type="text"
                      value={template.supportEmail}
                      onChange={(e) => setTemplate({ ...template, supportEmail: e.target.value })}
                      placeholder="e.g. academic.connect@ncet.co.in"
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: LOGO & FOOTER */}
              {activeTab === "footer" && (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-[#102B46]">Institutional Logo & Legal Affiliation</h3>
                    <p className="text-xs text-slate-500">Configure visual branding and university accreditation details.</p>
                  </div>

                  <div className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#102B46]">Embed Official NGI Logo</p>
                      <p className="text-[11px] text-slate-500">Display official high-resolution crest in the email header.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={template.useCidLogo}
                        onChange={(e) => setTemplate({ ...template, useCidLogo: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#102B46]"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Affiliation & Accreditation Line
                    </label>
                    <textarea
                      rows={2}
                      value={template.footerAffiliation}
                      onChange={(e) => setTemplate({ ...template, footerAffiliation: e.target.value })}
                      className="w-full text-xs sm:text-sm p-3 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Copyright Notice
                    </label>
                    <input
                      type="text"
                      value={template.footerCopyright}
                      onChange={(e) => setTemplate({ ...template, footerCopyright: e.target.value })}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl font-medium"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RIGHT / PREVIEW PANEL */}
          {(viewMode === "split" || viewMode === "preview") && (
            <div className={`${viewMode === "split" ? "xl:col-span-6 space-y-4" : "space-y-4"}`}>
              {/* Preview Client Shell */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-3">
                {/* Mock Email Client Header */}
                <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[11px] font-bold text-slate-600 ml-2">Live Candidate Email Preview</span>
                  </div>

                  <div className="flex items-center bg-white px-1.5 py-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("desktop")}
                      className={`p-1 rounded-md transition ${
                        previewDevice === "desktop" ? "bg-slate-100 text-[#102B46]" : "text-slate-400 hover:text-slate-700"
                      }`}
                      title="Desktop View"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice("mobile")}
                      className={`p-1 rounded-md transition ${
                        previewDevice === "mobile" ? "bg-slate-100 text-[#102B46]" : "text-slate-400 hover:text-slate-700"
                      }`}
                      title="Mobile View"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Email Envelope Info */}
                <div className="px-4 py-2 bg-slate-50/70 rounded-xl text-[11px] text-slate-500 space-y-0.5 font-mono">
                  <div className="truncate">
                    <span className="font-bold text-slate-700">From:</span> {template.fromName || "Nagarjuna Connect Admissions"} &lt;{template.fromEmail || "admissions@ngi.org.in"}&gt;
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-700">Subject:</span> {template.subject.replace(/\{\{registrationId\}\}/g, "NGI-NCMS-2026-82057").replace(/\{\{campusName\}\}/g, "NCMS")}
                  </div>
                </div>

                {/* Completely Sandboxed Iframe (Prevents ANY style leakage to page body) */}
                <div className="flex justify-center bg-[#F8FAFC] p-2.5 sm:p-4 rounded-2xl border border-slate-100">
                  <iframe
                    srcDoc={generatePreviewHtml()}
                    title="Live Candidate Email Preview"
                    className={`w-full h-[620px] rounded-xl border-0 transition-all ${
                      previewDevice === "mobile" ? "max-w-[390px]" : "max-w-[580px]"
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Send Test Email Modal */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F28C28]/10 text-[#F28C28] rounded-xl">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#102B46]">Send Live Test Email</h3>
              </div>
              <button
                type="button"
                onClick={() => setTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTestEmail} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="e.g. prashanth123@ncetmail.com"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#102B46]/20 font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Sends a real test email with current draft template customizations via your SMTP service.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setTestModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest || !testEmail}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#102B46] hover:bg-[#174A70] rounded-xl transition shadow flex items-center gap-2 disabled:opacity-50"
                >
                  {sendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{sendingTest ? "Sending..." : "Dispatch Test"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
