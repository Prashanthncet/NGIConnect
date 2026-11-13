"use client";

import React from "react";
import { IFormField } from "@/types";
import { UploadCloud, CheckSquare, Calendar, Link as LinkIcon, FileText } from "lucide-react";

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
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 transition-all space-y-3">
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

        {/* Dropdown / Select */}
        {field.type === "dropdown" && (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:border-[#174A70] focus:ring-[#174A70]"
            } text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-opacity-20 transition`}
          >
            <option value="">-- Please Select --</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {/* Single Choice / Radio Buttons */}
        {field.type === "radio" && (
          <div className="space-y-2.5 pt-1">
            {field.options?.map((opt, i) => (
              <label
                key={i}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  value === opt
                    ? "border-[#174A70] bg-[#174A70]/5 text-[#102B46] font-medium"
                    : "border-slate-200 hover:bg-slate-50 text-slate-700"
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="w-4 h-4 text-[#174A70] border-slate-300 focus:ring-[#174A70]"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {/* Multiple Choice / Checkboxes */}
        {field.type === "checkbox" && (
          <div className="space-y-2.5 pt-1">
            {field.options?.map((opt, i) => {
              const currentArray: string[] = Array.isArray(value) ? value : [];
              const isChecked = currentArray.includes(opt);
              return (
                <label
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    isChecked
                      ? "border-[#F28C28] bg-orange-50/50 text-[#102B46] font-medium"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={opt}
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange([...currentArray, opt]);
                      } else {
                        onChange(currentArray.filter((item) => item !== opt));
                      }
                    }}
                    className="w-4 h-4 rounded text-[#F28C28] border-slate-300 focus:ring-[#F28C28]"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
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

