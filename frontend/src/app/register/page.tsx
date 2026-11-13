"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormFieldRenderer from "@/components/FormFieldRenderer";
import { IForm, IFormField } from "@/types";
import {
  GraduationCap,
  ShieldCheck,
  RotateCcw,
  Send,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Institution toggle: NCET or NCMS
  const initialInst = searchParams.get("institution") === "NCMS" ? "NCMS" : "NCET";
  const [selectedInstitution, setSelectedInstitution] = useState<"NCET" | "NCMS">(initialInst);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<IForm | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Sync state when URL param changes
  useEffect(() => {
    const instParam = searchParams.get("institution");
    if (instParam === "NCMS" || instParam === "NCET") {
      setSelectedInstitution(instParam);
    }
  }, [searchParams]);

  // Load the published form for the selected institution dynamically from MongoDB
  useEffect(() => {
    async function loadForm() {
      setLoading(true);
      setGeneralError(null);
      try {
        // Use timestamp to prevent browser or intermediate caching, ensuring real-time dynamic changes
        const res = await fetch(`/api/forms?institution=${selectedInstitution}&_t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          const publishedForm = data.data.find((f: IForm) => f.status === "published") || data.data[0];
          setForm(publishedForm);

          // Initialize default field values
          const initialVals: Record<string, any> = {};
          publishedForm.fields.forEach((field: IFormField) => {
            if (field.defaultValue) {
              initialVals[field.id] = field.defaultValue;
            }
          });
          setResponses(initialVals);
        } else {
          setGeneralError("No registration form found for this campus. Please contact the administrator.");
        }
      } catch (err: any) {
        setGeneralError("Failed to load registration form. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    }

    loadForm();
  }, [selectedInstitution]);

  // Handle individual question value change
  const handleFieldChange = (fieldId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  // Submit candidate registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!form) return;

    // Client-side validation against dynamic form schema
    const validationErrors: Record<string, string> = {};
    form.fields.forEach((field: IFormField) => {
      // Evaluate conditional visibility
      let isVisible = true;
      if (field.conditionalLogic?.enabled && field.conditionalLogic.fieldId) {
        const dependentValue = responses[field.conditionalLogic.fieldId];
        if (field.conditionalLogic.operator === "equals") {
          isVisible = dependentValue === field.conditionalLogic.value;
        }
      }

      if (isVisible && field.required && !["section_heading", "description"].includes(field.type)) {
        const val = responses[field.id];
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          validationErrors[field.id] = field.validation?.customErrorMessage || `Question "${field.label}" is required.`;
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGeneralError("Please complete all required questions marked with * before submitting.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formId: form._id,
          formSlug: form.slug,
          institutionShortName: selectedInstitution,
          responses,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        if (result.fieldId) {
          setErrors({ [result.fieldId]: result.error });
        }
        setGeneralError(result.error || "Submission failed. Please verify your details.");
        return;
      }

      // Success redirect with generated Registration ID
      const regId = result.registrationId;
      const candidateName = encodeURIComponent(result.candidateName || "");
      router.push(`/registration-success?id=${regId}&institution=${selectedInstitution}&name=${candidateName}`);
    } catch (err: any) {
      setGeneralError("Network error occurred during submission. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FF] flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Responsive Institution Selector Switcher: Tabbed Side-by-Side on all devices */}
          <div className="bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedInstitution("NCET");
                router.replace("/register?institution=NCET");
              }}
              className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 min-h-[48px] ${
                selectedInstitution === "NCET"
                  ? "bg-[#102B46] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <img
                src="/images/ncet-logo.png"
                alt="NCET Logo"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain bg-white rounded p-0.5 shrink-0"
              />
              <div className="text-left flex flex-col justify-center min-w-0">
                <span className="text-xs sm:text-sm font-bold truncate leading-tight">NCET Campus</span>
                <span className={`text-[9px] sm:text-[10px] font-semibold truncate ${
                  selectedInstitution === "NCET" ? "text-orange-300" : "text-slate-400"
                }`}>
                  Engineering & Tech
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedInstitution("NCMS");
                router.replace("/register?institution=NCMS");
              }}
              className={`py-2 sm:py-3 px-2 sm:px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 min-h-[48px] ${
                selectedInstitution === "NCMS"
                  ? "bg-[#174A70] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <img
                src="/images/ncms-logo.webp"
                alt="NCMS Logo"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain bg-white rounded p-0.5 shrink-0"
              />
              <div className="text-left flex flex-col justify-center min-w-0">
                <span className="text-xs sm:text-sm font-bold truncate leading-tight">NCMS Campus</span>
                <span className={`text-[9px] sm:text-[10px] font-semibold truncate ${
                  selectedInstitution === "NCMS" ? "text-orange-300" : "text-slate-400"
                }`}>
                  Management & Commerce
                </span>
              </div>
            </button>
          </div>

          {/* Loading State Skeleton */}
          {loading && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center space-y-3 shadow-xs">
              <Loader2 className="w-8 h-8 text-[#174A70] animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Loading {selectedInstitution} registration form...</p>
              <p className="text-xs text-slate-400">Fetching dynamic schema live from database</p>
            </div>
          )}

          {/* Form Header Card */}
          {!loading && form && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Header Top Accent Bar */}
                <div
                  className={`h-2.5 w-full ${
                    selectedInstitution === "NCET" ? "bg-[#102B46]" : "bg-[#174A70]"
                  }`}
                />

                <div className="p-5 sm:p-8 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={selectedInstitution === "NCET" ? "/images/ncet-logo.png" : "/images/ncms-logo.webp"}
                          alt={`${selectedInstitution} Logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                            {selectedInstitution} Official Registry
                          </span>
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-[#102B46] leading-tight">
                          {selectedInstitution === "NCET"
                            ? "Nagarjuna College of Engineering & Technology"
                            : "Nagarjuna College of Management Studies"}
                        </h2>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                      Academic Year 2026
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#102B46] tracking-tight">
                    {form.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                    {form.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Official Verification Pipeline
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">
                      Version v{form.currentPublishedVersion || 1}
                    </span>
                  </div>
                </div>
              </div>

              {/* General Error Alert */}
              {generalError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-800 text-xs sm:text-sm">
                  <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-bold">Registration Alert</p>
                    <p className="text-red-700 mt-0.5">{generalError}</p>
                  </div>
                </div>
              )}

              {/* Dynamic Questions Render Loop */}
              <div className="space-y-4">
                {form.fields.map((field) => {
                  // Evaluate conditional logic dynamically
                  if (field.conditionalLogic?.enabled && field.conditionalLogic.fieldId) {
                    const dependentValue = responses[field.conditionalLogic.fieldId];
                    if (field.conditionalLogic.operator === "equals" && dependentValue !== field.conditionalLogic.value) {
                      return null;
                    }
                  }

                  return (
                    <FormFieldRenderer
                      key={field.id}
                      field={field}
                      value={responses[field.id]}
                      onChange={(val) => handleFieldChange(field.id, val)}
                      error={errors[field.id]}
                    />
                  );
                })}
              </div>

              {/* Form Bottom Submission Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    const emptyVals: Record<string, any> = {};
                    setResponses(emptyVals);
                    setErrors({});
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 min-h-[44px]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear Responses</span>
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#F28C28] hover:bg-[#d9771a] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 min-h-[48px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Registration...</span>
                    </>
                  ) : (
                    <>
                      <span>{form.settings?.submitButtonText || "Complete Registration"}</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F9FF]">
          <Loader2 className="w-8 h-8 text-[#174A70] animate-spin" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
