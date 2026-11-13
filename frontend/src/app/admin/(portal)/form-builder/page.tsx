"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import { IForm, IFormField, FieldType } from "@/types";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  Save,
  Send,
  Type,
  AlignLeft,
  Mail,
  Phone,
  Hash,
  Calendar,
  ListFilter,
  CheckSquare,
  Radio,
  UploadCloud,
  Link as LinkIcon,
  Heading,
  HelpCircle,
  Loader2,
  ExternalLink,
  Layers,
  Settings,
  Check,
} from "lucide-react";

export default function AdminFormBuilderPage() {
  const [selectedCampus, setSelectedCampus] = useState<"NCET" | "NCMS">("NCET");
  const [forms, setForms] = useState<IForm[]>([]);
  const [currentForm, setCurrentForm] = useState<IForm | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishSuccessOpen, setPublishSuccessOpen] = useState(false);
  const [publishedVersion, setPublishedVersion] = useState<number | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [activeMobileView, setActiveMobileView] = useState<"canvas" | "palette" | "inspector">("canvas");

  // Field Palette Categories
  const paletteCategories = [
    {
      category: "Basic Fields",
      items: [
        { type: "short_text" as FieldType, label: "Short Text", icon: Type },
        { type: "long_text" as FieldType, label: "Paragraph", icon: AlignLeft },
        { type: "email" as FieldType, label: "Email Address", icon: Mail },
        { type: "phone" as FieldType, label: "Phone / WhatsApp", icon: Phone },
        { type: "number" as FieldType, label: "Number", icon: Hash },
      ],
    },
    {
      category: "Choice & Select",
      items: [
        { type: "dropdown" as FieldType, label: "Dropdown Select", icon: ListFilter },
        { type: "radio" as FieldType, label: "Single Choice (Radio)", icon: Radio },
        { type: "checkbox" as FieldType, label: "Multiple Choice", icon: CheckSquare },
      ],
    },
    {
      category: "Advanced & Media",
      items: [
        { type: "date" as FieldType, label: "Date Picker", icon: Calendar },
        { type: "file" as FieldType, label: "File Upload", icon: UploadCloud },
        { type: "url" as FieldType, label: "Portfolio / URL", icon: LinkIcon },
      ],
    },
    {
      category: "Layout Elements",
      items: [
        { type: "section_heading" as FieldType, label: "Section Heading", icon: Heading },
        { type: "description" as FieldType, label: "Instructions Note", icon: HelpCircle },
      ],
    },
  ];

  // Load Form from MongoDB
  const loadForms = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/forms?institution=${selectedCampus}&_t=${Date.now()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setForms(data.data);
        const activeForm = data.data[0];
        setCurrentForm(activeForm);
        if (activeForm.fields && activeForm.fields.length > 0) {
          setSelectedFieldId(activeForm.fields[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load forms", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, [selectedCampus]);

  // Lock background scrolling completely when preview modal is open
  useEffect(() => {
    if (previewOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [previewOpen]);

  const activeField = currentForm?.fields.find((f) => f.id === selectedFieldId) || currentForm?.fields[0];

  const handleAddField = (type: FieldType, defaultLabel: string) => {
    if (!currentForm) return;

    const newId = `${type}_${Date.now()}`;
    const newField: IFormField = {
      id: newId,
      label: `New ${defaultLabel}`,
      type,
      required: false,
      placeholder: "",
      description: "",
      order: currentForm.fields.length + 1,
      options: ["dropdown", "radio", "checkbox"].includes(type) ? ["Option 1", "Option 2"] : undefined,
    };

    const updatedFields = [...currentForm.fields, newField];
    setCurrentForm({ ...currentForm, fields: updatedFields });
    setSelectedFieldId(newId);
    setActiveMobileView("canvas"); // Return to canvas on mobile
  };

  const updateActiveField = (updates: Partial<IFormField>) => {
    if (!currentForm || !activeField) return;

    const updatedFields = currentForm.fields.map((f) =>
      f.id === activeField.id ? { ...f, ...updates } : f
    );
    setCurrentForm({ ...currentForm, fields: updatedFields });
  };

  const handleMoveField = (index: number, direction: "up" | "down") => {
    if (!currentForm) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= currentForm.fields.length) return;

    const fields = [...currentForm.fields];
    const [moved] = fields.splice(index, 1);
    fields.splice(newIndex, 0, moved);

    setCurrentForm({ ...currentForm, fields });
  };

  const handleDuplicateField = (index: number) => {
    if (!currentForm) return;
    const source = currentForm.fields[index];
    const duplicated: IFormField = {
      ...source,
      id: `${source.type}_${Date.now()}`,
      label: `${source.label} (Copy)`,
    };

    const fields = [...currentForm.fields];
    fields.splice(index + 1, 0, duplicated);
    setCurrentForm({ ...currentForm, fields });
    setSelectedFieldId(duplicated.id);
  };

  const handleDeleteField = (index: number) => {
    if (!currentForm) return;
    if (currentForm.fields.length <= 1) {
      alert("A form must have at least one field.");
      return;
    }
    const fields = currentForm.fields.filter((_, i) => i !== index);
    setCurrentForm({ ...currentForm, fields });
    setSelectedFieldId(fields[0]?.id || null);
  };

  const handleSaveDraft = async () => {
    if (!currentForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${currentForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentForm.title,
          description: currentForm.description,
          fields: currentForm.fields,
          settings: currentForm.settings,
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setNotification("Draft saved to MongoDB successfully!");
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      alert("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const executePublish = async () => {
    if (!currentForm) return;

    setPublishing(true);
    setPublishError(null);
    try {
      await fetch(`/api/forms/${currentForm._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: currentForm.title,
          description: currentForm.description,
          fields: currentForm.fields,
        }),
        credentials: "include",
      });

      const res = await fetch(`/api/forms/${currentForm._id}/publish`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const newVersion = data.version;
        setCurrentForm({
          ...currentForm,
          currentPublishedVersion: newVersion,
          status: "published",
        });
        setPublishedVersion(newVersion);
        setPublishModalOpen(false);
        setPublishSuccessOpen(true);
      } else {
        setPublishError(data.error || "Unable to publish form changes.");
      }
    } catch {
      setPublishError("Network communication failure while publishing form.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F7F9FF]">
      {/* 1. TOP RESPONSIVE ACTION BAR */}
      <div className="border-b border-slate-200 bg-white px-3 sm:px-6 py-3 shrink-0 z-20 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Title & Campus Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider bg-[#102B46] text-white px-2.5 py-1 rounded-lg">
              Form Studio
            </span>

            {/* Campus Selector Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedCampus("NCET")}
                className={`px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                  selectedCampus === "NCET" ? "bg-[#102B46] text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                NCET
              </button>
              <button
                type="button"
                onClick={() => setSelectedCampus("NCMS")}
                className={`px-3 py-1.5 rounded-lg transition-colors min-h-[36px] ${
                  selectedCampus === "NCMS" ? "bg-[#174A70] text-white" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                NCMS
              </button>
            </div>

            <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
              v{currentForm?.currentPublishedVersion || 1} Live
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[42px]"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSaveDraft}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102B46] text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-50 min-h-[42px]"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              disabled={publishing}
              onClick={() => setPublishModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#F28C28] hover:bg-[#d9771a] text-white text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 min-h-[42px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Changes →</span>
            </button>
          </div>
        </div>

        {/* Mobile View Selector Bar (< 1200px / xl) */}
        <div className="xl:hidden flex items-center justify-between border-t border-slate-100 mt-2.5 pt-2 gap-1">
          <button
            onClick={() => setActiveMobileView("canvas")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[38px] ${
              activeMobileView === "canvas" ? "bg-[#102B46] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Questions ({currentForm?.fields.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveMobileView("palette")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[38px] ${
              activeMobileView === "palette" ? "bg-[#102B46] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Field</span>
          </button>

          <button
            onClick={() => setActiveMobileView("inspector")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 min-h-[38px] ${
              activeMobileView === "inspector" ? "bg-[#102B46] text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Properties</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 text-center font-bold animate-in fade-in shrink-0">
          {notification}
        </div>
      )}

      {/* 2. ADAPTIVE 3-PANEL STUDIO LAYOUT */}
      <div className="flex-1 flex flex-col xl:flex-row overflow-hidden min-h-0">
        {/* PANEL 1: Field Palette (Fixed in Desktop) */}
        <div
          className={`${
            activeMobileView === "palette" ? "block" : "hidden"
          } xl:block w-full xl:w-72 xl:h-full bg-white border-r border-slate-200 shrink-0 xl:overflow-hidden hover:xl:overflow-y-auto xl:overscroll-contain p-4 space-y-5`}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">Components</span>
            <h3 className="font-bold text-sm text-[#102B46]">Question Palette</h3>
            <p className="text-xs text-slate-400">Click any type to append to form</p>
          </div>

          <div className="space-y-4">
            {paletteCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#102B46] uppercase tracking-wider block px-1">
                  {cat.category}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-1.5">
                  {cat.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={itemIdx}
                        type="button"
                        onClick={() => handleAddField(item.type, item.label)}
                        className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-[#174A70] hover:bg-slate-50 transition flex items-center gap-2.5 text-xs font-semibold text-slate-700 min-h-[44px]"
                      >
                        <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PANEL 2: Form Canvas (Desktop center: The ONLY panel that scrolls) */}
        <div
          className={`${
            activeMobileView === "canvas" ? "block" : "hidden"
          } xl:block flex-1 h-full ${previewOpen ? "overflow-hidden" : "overflow-y-auto"} p-3 sm:p-6 lg:p-8 space-y-4`}
        >
          <div className="max-w-3xl mx-auto space-y-4 pb-24">
            {/* Form Title & Description Card */}
            {currentForm && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="h-2 bg-[#102B46] w-full" />
                <div className="p-4 sm:p-6 space-y-3">
                  <input
                    type="text"
                    value={currentForm.title}
                    onChange={(e) => setCurrentForm({ ...currentForm, title: e.target.value })}
                    placeholder="Form Title"
                    className="w-full text-lg sm:text-2xl font-extrabold text-[#102B46] focus:outline-hidden border-b border-transparent hover:border-slate-300 focus:border-[#102B46] pb-1 min-h-[44px]"
                  />
                  <textarea
                    rows={2}
                    value={currentForm.description}
                    onChange={(e) => setCurrentForm({ ...currentForm, description: e.target.value })}
                    placeholder="Form Description / Subtitle..."
                    className="w-full text-xs sm:text-sm text-slate-600 focus:outline-hidden border-b border-transparent hover:border-slate-300 focus:border-[#102B46] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Questions List */}
            {currentForm?.fields.map((field, index) => {
              const isSelected = field.id === selectedFieldId;
              return (
                <div
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className={`bg-white rounded-2xl border transition p-4 sm:p-5 shadow-xs relative cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#102B46] ring-2 ring-[#102B46]/10"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xs font-bold text-slate-400 w-5 shrink-0">#{index + 1}</span>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          const newFields = currentForm.fields.map((f, i) =>
                            i === index ? { ...f, label: e.target.value } : f
                          );
                          setCurrentForm({ ...currentForm, fields: newFields });
                        }}
                        className="font-bold text-xs sm:text-sm text-[#102B46] focus:outline-hidden border-b border-transparent hover:border-slate-300 focus:border-[#174A70] px-1 py-1 w-full min-h-[38px]"
                      />
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full shrink-0">
                        {field.type.replace(/_/g, " ")}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFieldId(field.id);
                          setActiveMobileView("inspector");
                        }}
                        className="xl:hidden p-1 rounded-lg text-slate-400 hover:text-slate-800"
                        title="Open properties"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Question Description */}
                  <div className="mt-2">
                    <input
                      type="text"
                      value={field.description || ""}
                      onChange={(e) => {
                        const newFields = currentForm.fields.map((f, i) =>
                          i === index ? { ...f, description: e.target.value } : f
                        );
                        setCurrentForm({ ...currentForm, fields: newFields });
                      }}
                      placeholder="Optional helper text or instructions for candidate..."
                      className="w-full text-xs text-slate-500 focus:outline-hidden border-b border-transparent hover:border-slate-200 focus:border-slate-400 py-1"
                    />
                  </div>

                  {/* Options for dropdown, radio, checkbox */}
                  {["dropdown", "radio", "checkbox"].includes(field.type) && (
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Choices / Options:
                      </span>
                      <div className="space-y-1.5">
                        {field.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const updatedOpts = [...(field.options || [])];
                                updatedOpts[optIdx] = e.target.value;
                                const newFields = currentForm.fields.map((f, i) =>
                                  i === index ? { ...f, options: updatedOpts } : f
                                );
                                setCurrentForm({ ...currentForm, fields: newFields });
                              }}
                              className="flex-1 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:border-[#174A70] min-h-[36px]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedOpts = field.options?.filter((_, i) => i !== optIdx);
                                const newFields = currentForm.fields.map((f, i) =>
                                  i === index ? { ...f, options: updatedOpts } : f
                                );
                                setCurrentForm({ ...currentForm, fields: newFields });
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-500 min-h-[36px] min-w-[36px]"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const updatedOpts = [
                              ...(field.options || []),
                              `Option ${(field.options?.length || 0) + 1}`,
                            ];
                            const newFields = currentForm.fields.map((f, i) =>
                              i === index ? { ...f, options: updatedOpts } : f
                            );
                            setCurrentForm({ ...currentForm, fields: newFields });
                          }}
                          className="text-xs text-[#F28C28] font-bold hover:underline pt-1 inline-block min-h-[36px]"
                        >
                          + Add Choice Option
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Question Bottom Reordering & Required Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(index, "up");
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 min-h-[36px] min-w-[36px]"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === currentForm.fields.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveField(index, "down");
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 min-h-[36px] min-w-[36px]"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateField(index);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 ml-1 min-h-[36px] min-w-[36px]"
                        title="Duplicate Question"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteField(index);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 min-h-[36px] min-w-[36px]"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <label
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer min-h-[36px] px-1"
                      >
                        <span>Required</span>
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const newFields = currentForm.fields.map((f, i) =>
                              i === index ? { ...f, required: e.target.checked } : f
                            );
                            setCurrentForm({ ...currentForm, fields: newFields });
                          }}
                          className="w-4 h-4 text-[#F28C28] rounded focus:ring-[#F28C28]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 3: Property Inspector (Fixed in Desktop) */}
        <div
          className={`${
            activeMobileView === "inspector" ? "block" : "hidden"
          } xl:block w-full xl:w-80 xl:h-full bg-white border-l border-slate-200 shrink-0 xl:overflow-hidden hover:xl:overflow-y-auto xl:overscroll-contain p-4 sm:p-5 space-y-5`}
        >
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28]">
              Settings
            </span>
            <h3 className="font-bold text-sm text-[#102B46]">Field Properties</h3>
            <p className="text-xs text-slate-400">Configure validations &amp; rules</p>
          </div>

          {activeField ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Field ID / Key</label>
                <input
                  type="text"
                  value={activeField.id}
                  onChange={(e) => updateActiveField({ id: e.target.value })}
                  className="w-full font-mono text-xs border border-slate-200 rounded-lg p-2.5 bg-slate-50 min-h-[40px]"
                />
                <p className="text-[10px] text-slate-400">Column header key in Excel export</p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Placeholder Text</label>
                <input
                  type="text"
                  value={activeField.placeholder || ""}
                  onChange={(e) => updateActiveField({ placeholder: e.target.value })}
                  placeholder="Enter placeholder..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2.5 min-h-[40px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-3">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                  Validation Rules
                </span>

                <label className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 cursor-pointer min-h-[44px]">
                  <span className="font-semibold">Mark as Mandatory</span>
                  <input
                    type="checkbox"
                    checked={activeField.required}
                    onChange={(e) => updateActiveField({ required: e.target.checked })}
                    className="w-4 h-4 text-[#F28C28] rounded focus:ring-[#F28C28]"
                  />
                </label>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 block">Custom Error Message</label>
                  <input
                    type="text"
                    value={activeField.validation?.customErrorMessage || ""}
                    onChange={(e) =>
                      updateActiveField({
                        validation: { ...activeField.validation, customErrorMessage: e.target.value },
                      })
                    }
                    placeholder="e.g. Please select your enrolled branch"
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 min-h-[40px]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-400">
              Select a question card to inspect its properties.
            </div>
          )}
        </div>
      </div>

      {/* Responsive Live Form Preview Modal - Background Scroll Completely Locked */}
      {previewOpen && currentForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overscroll-none"
          onClick={() => setPreviewOpen(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                  Candidate Preview
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#102B46]">{currentForm.title}</h3>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {currentForm.description}
              </p>

              <div className="space-y-3">
                {currentForm.fields.map((field) => (
                  <div key={field.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5 shadow-2xs">
                    <label className="block text-xs font-bold text-slate-800">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.description && <p className="text-[11px] text-slate-500">{field.description}</p>}
                    <input
                      disabled
                      placeholder={field.placeholder || "Candidate answer preview"}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 cursor-not-allowed min-h-[40px]"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 bg-slate-50">
              <Link
                href={`/register?institution=${selectedCampus}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#174A70] hover:underline flex items-center gap-1"
              >
                <span>Open Live Registration Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#102B46] text-white text-xs font-bold min-h-[44px]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional SweetAlert: Publish Confirmation Modal */}
      {publishModalOpen && currentForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            {/* Animated Alert Badge */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F28C28] flex items-center justify-center text-white shadow-sm animate-pulse">
                <Send className="w-5 h-5 translate-x-0.5" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F28C28] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 inline-block mb-2">
                Production Release
              </span>
              <h3 className="text-xl font-extrabold text-[#102B46] tracking-tight">
                Publish Changes Live?
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                You are about to publish the latest schema changes directly to the public candidate portal for{" "}
                <strong className="text-[#102B46]">{selectedCampus} Campus</strong>.
              </p>
            </div>

            {/* Scope Summary Box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-[11px] font-semibold">Target Campus:</span>
                <span className="font-bold text-[#102B46]">{selectedCampus} ({currentForm.title})</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-[11px] font-semibold">Configured Fields:</span>
                <span className="font-bold text-[#102B46]">
                  {currentForm.fields.length} questions ({currentForm.fields.filter((f) => f.required).length} mandatory)
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span className="text-[11px] font-semibold">New Active Version:</span>
                <span className="font-bold text-emerald-600">
                  v{(currentForm.currentPublishedVersion || 1) + 1} (Live)
                </span>
              </div>
            </div>

            {publishError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {publishError}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                disabled={publishing}
                onClick={() => {
                  setPublishModalOpen(false);
                  setPublishError(null);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition min-h-[46px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={publishing}
                onClick={executePublish}
                className="flex-1 py-3 px-4 rounded-xl bg-[#F28C28] hover:bg-[#d9771a] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 min-h-[46px]"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Yes, Publish Live</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional SweetAlert: Publish Success Modal */}
      {publishSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200/80 p-6 sm:p-7 space-y-5 text-center relative animate-in zoom-in-95 duration-200">
            {/* Animated Success Check */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                Deployment Complete
              </span>
              <h3 className="text-xl font-extrabold text-[#102B46] tracking-tight">
                Published Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Version <strong className="text-emerald-700">v{publishedVersion || 1}</strong> is now live on the {selectedCampus} candidate registration portal. Applicants will immediately see your updated question fields.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/register?institution=${selectedCampus}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setPublishSuccessOpen(false)}
                className="w-full py-3 px-4 rounded-xl bg-[#102B46] hover:bg-[#174A70] text-white text-xs font-bold transition flex items-center justify-center gap-2 min-h-[46px]"
              >
                <span>View Live Form on Portal</span>
                <ExternalLink className="w-4 h-4 text-[#F28C28]" />
              </Link>
              <button
                type="button"
                onClick={() => setPublishSuccessOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:text-slate-900 text-xs font-bold transition"
              >
                Continue Working in Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

