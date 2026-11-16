"use client";

import React, { useState, useRef, useEffect } from "react";
import { IFormField } from "@/types";
import { UploadCloud, CheckSquare, Calendar, Link as LinkIcon, FileText, ChevronDown, Check } from "lucide-react";

interface CustomDropdownProps {
  options?: string[];
  value: any;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

function CustomDropdown({ options, value, onChange, placeholder, error }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const selectedValue = value || "";

  return (
    <div ref={dropdownRef} className="relative w-full max-w-full">
      {/* Trigger Button - Always clamped to 100% container width */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-4 py-2.5 rounded-xl border ${
          error
            ? "border-red-400 ring-1 ring-red-400"
            : isOpen
            ? "border-[#174A70] ring-2 ring-[#174A70]/20"
            : "border-slate-200 hover:border-slate-300"
        } bg-white text-sm text-left flex items-center justify-between gap-2 transition cursor-pointer select-none`}
      >
        <span className={`block truncate ${selectedValue ? "font-semibold text-slate-800" : "text-slate-400"}`}>
          {selectedValue || placeholder || "-- Please Select --"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#174A70]" : ""
          }`}
        />
      </button>

      {/* Embedded Dropdown Menu - Strictly bounded within container width */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 left-0 right-0 top-full mt-1.5 w-full max-w-full bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100"
        >
          {options && options.length > 0 ? (
            options.map((opt, i) => {
              const isSelected = value === opt;
              return (
                <div
                  key={i}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer transition flex items-center justify-between gap-2 text-left ${
                    isSelected
                      ? "bg-orange-50/80 font-bold text-[#102B46]"
                      : "text-slate-700 hover:bg-slate-50 hover:text-[#102B46]"
                  }`}
                >
                  <span className="leading-snug break-words flex-1">{opt}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#F28C28] shrink-0 ml-2" />}
                </div>
              );
            })
          ) : (
            <div className="px-4 py-3 text-xs text-slate-400 text-center">No options available</div>
          )}
        </div>
      )}
    </div>
  );
}

interface FormFieldRendererProps {
  field: IFormField;
  value: any;
  onChange: (val: any) => void;
  error?: string;
}

export default function FormFieldRenderer({ field, value, onChange, error }: FormFieldRendererProps) {
  // 1. Layout: Section Heading
  if (field.type === "section_heading") {
    return (
      <div className="pt-6 pb-2 border-b-2 border-slate-200">
        <h3 className="text-xl font-bold text-[#102B46]">{field.label}</h3>
        {field.description && <p className="text-sm text-slate-500 mt-1">{field.description}</p>}
      </div>
    );
  }

  // 2. Layout: Description / Instructions
  if (field.type === "description") {
    return (
      <div className="bg-blue-50/60 border border-blue-200/80 p-4 rounded-xl text-sm text-slate-700 leading-relaxed">
        <p className="font-semibold text-[#174A70] mb-1">{field.label}</p>
        {field.description && <p className="text-slate-600">{field.description}</p>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs hover:border-slate-300 transition-all space-y-3">
      {/* Label and Required asterisk */}
      <div>
        <label className="block text-sm font-semibold text-slate-800">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        {field.description && <p className="text-xs text-slate-500 mt-1">{field.description}</p>}
      </div>

      {/* Render Appropriate Input Based on Type */}
      <div className="mt-2">
        {/* Short Text */}
        {field.type === "short_text" && (
          <input
            type="text"
            placeholder={field.placeholder || "Enter your answer"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
            } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
          />
        )}

        {/* Email */}
        {field.type === "email" && (
          <input
            type="email"
            placeholder={field.placeholder || "name@domain.com"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
            } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
          />
        )}

        {/* Phone */}
        {field.type === "phone" && (
          <input
            type="tel"
            placeholder={field.placeholder || "+91 98765 43210"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
            } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
          />
        )}

        {/* Number */}
        {field.type === "number" && (
          <input
            type="number"
            placeholder={field.placeholder || "0"}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
            } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
          />
        )}

        {/* Long Text / Textarea */}
        {field.type === "long_text" && (
          <textarea
            rows={4}
            placeholder={field.placeholder || "Type your detailed response here..."}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
            } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition resize-y`}
          />
        )}

        {/* Date */}
        {field.type === "date" && (
          <div className="relative">
            <input
              type="date"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
              } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
            />
          </div>
        )}

        {/* Dropdown / Select - Custom Mobile-Safe Dropdown */}
        {field.type === "dropdown" && (
          <CustomDropdown
            options={field.options}
            value={value}
            onChange={(val) => onChange(val)}
            placeholder={field.placeholder || "-- Please Select --"}
            error={error}
          />
        )}

        {/* Single Choice / Radio Buttons */}
        {field.type === "radio" && (
          <div className="space-y-2.5 pt-1">
            {field.options?.map((opt, i) => {
              const isOther =
                opt.trim().toLowerCase() === "other" ||
                opt.trim().toLowerCase().startsWith("other (") ||
                opt.trim().toLowerCase().startsWith("other:");

              let isChecked = false;
              let otherCustomText = "";

              if (isOther) {
                if (typeof value === "string") {
                  const s = value.trim().toLowerCase();
                  if (s === "other" || s.startsWith("other:") || s.startsWith("other (") || s.startsWith("other -")) {
                    isChecked = true;
                    if (value.toLowerCase().startsWith("other:")) {
                      otherCustomText = value.substring(value.indexOf(":") + 1).trim();
                    } else if (value.toLowerCase().startsWith("other (") && value.endsWith(")")) {
                      otherCustomText = value.substring(7, value.length - 1).trim();
                    } else if (value.toLowerCase().startsWith("other -")) {
                      otherCustomText = value.substring(7).trim();
                    } else if (value.trim().toLowerCase() !== "other") {
                      otherCustomText = value.trim();
                    }
                  }
                }
              } else {
                isChecked = value === opt;
              }

              return (
                <div
                  key={i}
                  className={`rounded-xl border transition ${
                    isChecked
                      ? "border-[#174A70] bg-[#174A70]/5 text-[#102B46]"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <label className="flex items-center gap-3 p-3 cursor-pointer select-none">
                    <input
                      type="radio"
                      name={field.id}
                      value={opt}
                      checked={isChecked}
                      onChange={() => {
                        if (isOther) {
                          const initialVal = otherCustomText.trim() ? `Other: ${otherCustomText.trim()}` : "Other";
                          onChange(initialVal);
                        } else {
                          onChange(opt);
                        }
                      }}
                      className="w-4 h-4 text-[#174A70] border-slate-300 focus:ring-[#174A70] shrink-0"
                    />
                    <span className={`text-sm ${isChecked ? "font-semibold text-[#102B46]" : ""}`}>{opt}</span>
                  </label>

                  {/* Radio Other Text Input */}
                  {isOther && isChecked && (
                    <div className="px-3.5 pb-3.5 pt-0">
                      <input
                        type="text"
                        placeholder="Please specify other details..."
                        value={otherCustomText}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const text = e.target.value;
                          const newVal = text.trim() ? `Other: ${text}` : "Other";
                          onChange(newVal);
                        }}
                        className="w-full px-3.5 py-2 text-sm rounded-lg border border-blue-300 bg-white focus:outline-hidden focus:border-[#174A70] focus:ring-2 focus:ring-[#174A70]/20 transition placeholder:text-slate-400 text-slate-800"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Multiple Choice / Checkboxes */}
        {field.type === "checkbox" && (
          <div className="space-y-2.5 pt-1">
            {field.options?.map((opt, i) => {
              const currentArray: string[] = Array.isArray(value) ? value : [];
              const isOther =
                opt.trim().toLowerCase() === "other" ||
                opt.trim().toLowerCase().startsWith("other (") ||
                opt.trim().toLowerCase().startsWith("other:");

              let isChecked = false;
              let otherCustomText = "";

              if (isOther) {
                const found = currentArray.find((item) => {
                  const s = String(item).trim().toLowerCase();
                  return s === "other" || s.startsWith("other:") || s.startsWith("other (") || s.startsWith("other -");
                });
                if (found) {
                  isChecked = true;
                  if (found.toLowerCase().startsWith("other:")) {
                    otherCustomText = found.substring(found.indexOf(":") + 1).trim();
                  } else if (found.toLowerCase().startsWith("other (") && found.endsWith(")")) {
                    otherCustomText = found.substring(7, found.length - 1).trim();
                  } else if (found.toLowerCase().startsWith("other -")) {
                    otherCustomText = found.substring(7).trim();
                  } else if (found.trim().toLowerCase() !== "other") {
                    otherCustomText = found.trim();
                  }
                }
              } else {
                isChecked = currentArray.includes(opt);
              }

              return (
                <div
                  key={i}
                  className={`rounded-xl border transition ${
                    isChecked
                      ? "border-[#F28C28] bg-orange-50/40 text-[#102B46]"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <label className="flex items-center gap-3 p-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      value={opt}
                      checked={isChecked}
                      onChange={(e) => {
                        if (isOther) {
                          const withoutOther = currentArray.filter((item) => {
                            const s = String(item).trim().toLowerCase();
                            return !(s === "other" || s.startsWith("other:") || s.startsWith("other (") || s.startsWith("other -"));
                          });
                          if (e.target.checked) {
                            const initialVal = otherCustomText.trim() ? `Other: ${otherCustomText.trim()}` : "Other";
                            onChange([...withoutOther, initialVal]);
                          } else {
                            onChange(withoutOther);
                          }
                        } else {
                          if (e.target.checked) {
                            onChange([...currentArray, opt]);
                          } else {
                            onChange(currentArray.filter((item) => item !== opt));
                          }
                        }
                      }}
                      className="w-4 h-4 rounded text-[#F28C28] border-slate-300 focus:ring-[#F28C28] shrink-0"
                    />
                    <span className={`text-sm ${isChecked ? "font-semibold text-[#102B46]" : ""}`}>{opt}</span>
                  </label>

                  {/* Other Option Text Input - Opens smoothly when user selects Other */}
                  {isOther && isChecked && (
                    <div className="px-3.5 pb-3.5 pt-0">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Please enter your specific interest(s)..."
                          value={otherCustomText}
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            const text = e.target.value;
                            const withoutOther = currentArray.filter((item) => {
                              const s = String(item).trim().toLowerCase();
                              return !(s === "other" || s.startsWith("other:") || s.startsWith("other (") || s.startsWith("other -"));
                            });
                            const newVal = text.trim() ? `Other: ${text}` : "Other";
                            onChange([...withoutOther, newVal]);
                          }}
                          className="w-full px-3.5 py-2 text-sm rounded-lg border border-orange-300 bg-white focus:outline-hidden focus:border-[#F28C28] focus:ring-2 focus:ring-[#F28C28]/20 transition placeholder:text-slate-400 text-slate-800"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 pl-0.5">
                        Specify details for your selection above.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* URL Input */}
        {field.type === "url" && (
          <div className="relative">
            <input
              type="url"
              placeholder={field.placeholder || "https://..."}
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
              } text-sm focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
            />
          </div>
        )}

        {/* File Upload Placeholder */}
        {field.type === "file" && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-300 transition cursor-pointer bg-slate-50/50">
            <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-700">Click or drag & drop files to upload</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, or JPG up to 10MB</p>
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && <p className="text-xs font-medium text-red-500 pt-1">{error}</p>}
    </div>
  );
}

