"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FormFieldRenderer from "@/components/FormFieldRenderer";
import { IForm, IFormField } from "@/types";
import { defaultForms } from "@/lib/defaultForms";
import {
  GraduationCap,
  RotateCcw,
  Send,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Building2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Institution toggle: NCET or NCMS
  const initialInst = searchParams.get("institution") === "NCMS" ? "NCMS" : "NCET";
  const [selectedInstitution, setSelectedInstitution] = useState<"NCET" | "NCMS">(initialInst);

  // Instant 0ms render with default verified campus schema, no loading delay
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<IForm | null>(() => defaultForms[initialInst]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Sync state when URL param changes
  useEffect(() => {
    const instParam = searchParams.get("institution");
    if (instParam === "NCMS" || instParam === "NCET") {
      setSelectedInstitution(instParam);
      setForm(defaultForms[instParam]);
    }
  }, [searchParams]);

  // Helper to initialize default field values
  const initFormDefaults = (targetForm: IForm) => {
    const initialVals: Record<string, any> = {};
    targetForm.fields.forEach((field: IFormField) => {
      if (field.defaultValue) {
        initialVals[field.id] = field.defaultValue;
      }
    });
    setResponses((prev) => ({ ...initialVals, ...prev }));
  };

  // Revalidate form from API in background without blocking UI
  useEffect(() => {
    async function revalidateForm() {
      setGeneralError(null);

      try {
        const res = await fetch(`/api/forms?institution=${selectedInstitution}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data && data.data.length > 0) {
            const publishedForm = data.data.find((f: IForm) => f.status === "published") || data.data[0];
            setForm(publishedForm);
            initFormDefaults(publishedForm);
          }
        }
      } catch (err: any) {
        // Silently preserve verified schema
      }
    }

    revalidateForm();
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

      const val = responses[field.id];
      if (isVisible && field.required && !["section_heading", "description"].includes(field.type)) {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          validationErrors[field.id] = field.validation?.customErrorMessage || `Question "${field.label}" is required.`;
        }
      }

      // Enhanced client-side validations for PUC applicant fields
      if (val && (field.type === "phone" || field.id === "phone" || field.id.includes("phone"))) {
        const clean = String(val).replace(/\D/g, "");
        if (clean.length !== 10) {
          validationErrors[field.id] = "Please enter an exact 10-digit mobile number.";
        } else if (!/^[6-9]\d{9}$/.test(clean)) {
          validationErrors[field.id] = "Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";
        }
      }
      if (val && (field.type === "email" || field.id === "email")) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val).trim())) {
          validationErrors[field.id] = "Please enter a valid email address.";
        }
      }
      if (val && field.id === "full_name" && String(val).trim().length < 3) {
        validationErrors[field.id] = "Full name must be at least 3 characters.";
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

      let result: any = null;
      try {
        result = await res.json();
      } catch (jsonErr) {
        // Non-JSON response (e.g. 502 Bad Gateway HTML)
      }

      if (!res.ok || !result || !result.success) {
        if (result?.fieldId) {
          setErrors({ [result.fieldId]: result.error });
        }
        if (res.status === 409 && result?.registrationId) {
          setGeneralError(
            result.error ||
              `A registration with this email already exists (Registration ID: ${result.registrationId}).`
          );
        } else {
          setGeneralError(
            result?.error ||
              "Unable to reach server right now. The database server may be waking up. Please wait 10 seconds and try submitting again."
          );
        }
        return;
      }

      // Success redirect with generated Registration ID
      const regId = result.registrationId;
      const candidateName = encodeURIComponent(result.candidateName || "");
      router.push(`/registration-success?id=${regId}&institution=${selectedInstitution}&name=${candidateName}`);
    } catch (err: any) {
      setGeneralError(
        "Network connection interrupted. Please ensure you are connected to the internet and click Submit Registration again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FF] flex flex-col">
      <Navbar />

      <main className="flex-1 py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6">
          {/* Responsive Institution Selector Switcher: Tabbed Side-by-Side on all devices */}
          <div className="bg-white p-1 sm:p-2 rounded-2xl border border-slate-200/90 shadow-xs grid grid-cols-2 gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedInstitution("NCET");
                router.replace("/register?institution=NCET");
              }}
              className={`py-2 sm:py-3 px-1.5 sm:px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 min-h-[46px] ${
                selectedInstitution === "NCET"
                  ? "bg-[#102B46] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <img
                src="/images/ncet-logo.png"
                alt="NCET Logo"
                className="w-5 h-5 sm:w-7 sm:h-7 object-contain bg-white rounded p-0.5 shrink-0"
              />
              <div className="text-left flex flex-col justify-center min-w-0">
                <span className="text-[11px] sm:text-sm font-bold leading-tight">NCET Campus</span>
                <span
                  className={`text-[8.5px] sm:text-[10px] font-semibold leading-tight whitespace-nowrap ${
                    selectedInstitution === "NCET" ? "text-orange-300" : "text-slate-400"
                  }`}
                >
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
              className={`py-2 sm:py-3 px-1.5 sm:px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2.5 min-h-[46px] ${
                selectedInstitution === "NCMS"
                  ? "bg-[#174A70] text-white shadow-sm"
                  : "bg-transparent text-slate-600 hover:bg-slate-50"
              }`}
            >
              <img
                src="/images/ncms-logo.webp"
                alt="NCMS Logo"
                className="w-5 h-5 sm:w-7 sm:h-7 object-contain bg-white rounded p-0.5 shrink-0"
              />
              <div className="text-left flex flex-col justify-center min-w-0">
                <span className="text-[11px] sm:text-sm font-bold leading-tight">NCMS Campus</span>
                <span
                  className={`text-[8.5px] sm:text-[10px] font-semibold leading-tight whitespace-nowrap ${
                    selectedInstitution === "NCMS" ? "text-orange-300" : "text-slate-400"
                  }`}
                >
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
          {!loading && !form && (
            <div className="bg-white rounded-2xl border border-red-200 p-8 text-center space-y-4 shadow-xs">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <div>
                <p className="text-base font-bold text-slate-800">Registration System Notice</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{generalError || "Unable to load registration form."}</p>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#102B46] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#174A70] transition flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading Form</span>
              </button>
            </div>
          )}

          {!loading && form && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Header Top Accent Bar */}
                <div
                  className={`h-2 sm:h-2.5 w-full ${
                    selectedInstitution === "NCET" ? "bg-[#102B46]" : "bg-[#174A70]"
                  }`}
                />

                <div className="p-4 sm:p-8 space-y-3.5 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={selectedInstitution === "NCET" ? "/images/ncet-logo.png" : "/images/ncms-logo.webp"}
                          alt={`${selectedInstitution} Logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#F28C28]">
                            {selectedInstitution} Official Registry
                          </span>
                        </div>
                        <h2 className="text-sm sm:text-lg font-bold text-[#102B46] leading-tight">
                          {selectedInstitution === "NCET"
                            ? "Nagarjuna College of Engineering & Technology"
                            : "Nagarjuna College of Management Studies"}
                        </h2>
                      </div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
                      Academic Year 2026
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#102B46] tracking-tight">
                    {form.title}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                    {form.description}
                  </p>
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
