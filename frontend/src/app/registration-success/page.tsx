"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  User,
  Loader2,
  Building,
  Award,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get("id") || "NGI-REG-2026-PENDING";
  const institution = (searchParams.get("institution") || "NCET").toUpperCase();
  const candidateName = searchParams.get("name") || "Registered Candidate";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const isNCET = institution === "NCET";
  const campusLogo = isNCET ? "/images/ncet-logo.png" : "/images/ncms-logo.webp";
  const campusFullName = isNCET
    ? "Nagarjuna College of Engineering and Technology (NCET)"
    : "Nagarjuna College of Management Studies (NCMS)";
  const campusAffiliation = isNCET
    ? "An Autonomous Institution • Affiliated to VTU, Belagavi • Approved by AICTE • NAAC Accredited 'A' Grade"
    : "Affiliated to Bengaluru North University (BNU) • Approved by Govt. of Karnataka";
  const campusAddress = isNCET
    ? "Mudugurki, Venkatagirikote Post, Devanahalli, Bengaluru, Karnataka - 562110"
    : "Chikkaballapur Regional Campus, Bengaluru North University Affiliated, Karnataka - 562101";

  const submissionDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const submissionTime = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#F7F9FF] flex flex-col">
      {/* 1. PRINT-SPECIFIC CSS RULES (Enforces 1-Page Clean Fit with zero overflow) */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          html, body {
            background: #FFFFFF !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          nav, header, footer, .screen-only, button, a {
            display: none !important;
          }
          .printable-slip-wrapper {
            display: block !important;
            page-break-inside: avoid !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
        @media screen {
          .printable-slip-wrapper {
            display: none;
          }
        }
      `}</style>

      {/* Screen Navbar */}
      <div className="screen-only">
        <Navbar />
      </div>

      {/* ======================================================== */}
      {/* 2. OFFICIAL PRINTABLE SLIP (VISIBLE ONLY ON PRINT)       */}
      {/* ======================================================== */}
      <div className="printable-slip-wrapper">
        <div className="border-2 border-[#102B46] rounded-xl p-6 bg-white text-black font-sans space-y-4">
          {/* Institutional Header with Logos */}
          <div className="flex items-center justify-between border-b-2 border-[#102B46] pb-4 gap-4">
            {/* Left: NGi Logo */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <img
                src="/images/ngi-logo.png"
                alt="NGi Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Center: University & College Letterhead */}
            <div className="text-center flex-1 px-2">
              <p className="text-[11px] font-bold tracking-widest text-[#F28C28] uppercase">
                Nagarjuna Education Society
              </p>
              <h1 className="text-xl font-extrabold text-[#102B46] tracking-tight uppercase leading-tight">
                {campusFullName}
              </h1>
              <p className="text-[10px] text-slate-700 mt-0.5 font-medium leading-relaxed">
                {campusAffiliation}
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5">
                {campusAddress}
              </p>
            </div>

            {/* Right: College Logo */}
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <img
                src={campusLogo}
                alt={`${institution} Logo`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Slip Title Banner */}
          <div className="text-center py-1 bg-slate-100 rounded-md border border-slate-300">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-[#102B46]">
              Provisional Registration & Admission Acknowledgement Slip
            </h2>
            <p className="text-[10px] text-slate-600 font-semibold">
              Academic Session 2026 – 2027 • Central Registry Verification Copy
            </p>
          </div>

          {/* Registration Number High-Visibility Callout */}
          <div className="flex items-center justify-between border border-[#102B46] bg-slate-50 rounded-lg p-3">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Official Registration Number
              </span>
              <span className="text-2xl font-mono font-black text-[#102B46] tracking-wider">
                {registrationId}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-700 text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                Status: Confirmed & Logged
              </span>
              <span className="block text-[10px] text-slate-500 mt-1">
                Generated: {submissionDate} at {submissionTime}
              </span>
            </div>
          </div>

          {/* Candidate Record Details Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold bg-slate-100 text-slate-700 w-1/3">Candidate Full Name</td>
                  <td className="p-2.5 font-semibold text-slate-900">{decodeURIComponent(candidateName)}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold bg-slate-100 text-slate-700">Allocated Institution</td>
                  <td className="p-2.5 font-semibold text-slate-900">{campusFullName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold bg-slate-100 text-slate-700">Campus Facility</td>
                  <td className="p-2.5 text-slate-900 font-medium">{isNCET ? "Engineering & Technology Campus (Devanahalli)" : "Management Studies Campus (Chikkaballapur)"}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold bg-slate-100 text-slate-700">Registration Mode</td>
                  <td className="p-2.5 text-slate-900">Nagarjuna Connect Digital Academic Registry</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold bg-slate-100 text-slate-700">Submission Timestamp</td>
                  <td className="p-2.5 text-slate-900">{submissionDate} • {submissionTime} IST</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mandatory Instructions & Next Steps */}
          <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-1.5 text-[10px] text-slate-700">
            <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wide">
              Important Candidate Instructions:
            </p>
            <ol className="list-decimal pl-4 space-y-1 leading-normal">
              <li>Carry a printed copy of this acknowledgement slip when reporting to the Admissions Office.</li>
              <li>Present original and self-attested photocopies of 10th / 12th / Diploma / Degree marks cards, Transfer Certificate (TC), and Aadhaar / Identity proof.</li>
              <li>Official seat allotment, fee payment receipt, and orientation handbook will be issued following original document scrutiny.</li>
              <li>For any discrepancy or queries, contact the admissions office: <span className="font-semibold text-black">admissions@ncet.co.in | +91 80 6746 2700</span>.</li>
            </ol>
          </div>

          {/* Official Signatures & Seal Section */}
          <div className="pt-6 grid grid-cols-3 gap-6 text-center text-[10px]">
            <div className="flex flex-col justify-end">
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-700">
                {decodeURIComponent(candidateName)}
              </div>
              <span className="text-slate-500 font-medium">Candidate Signature</span>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-400 flex items-center justify-center text-[9px] font-bold text-slate-400 p-1 text-center">
                OFFICIAL SEAL<br />ADMISSIONS CELL<br />NGI
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <div className="border-b border-slate-400 pb-1 mb-1 font-semibold text-slate-800">
                Registrar / Dean Admissions
              </div>
              <span className="text-slate-500 font-medium">Authorized Signatory</span>
            </div>
          </div>

          {/* Slip Footer Security Note */}
          <div className="pt-2 border-t border-slate-200 text-[9px] text-slate-400 flex items-center justify-between">
            <span>Nagarjuna Connect System-Generated Document • No manual signature required if electronically sealed</span>
            <span className="font-mono">Ref: {registrationId}</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MODERN RESPONSIVE SCREEN VIEW (HIDDEN ON PRINT)       */}
      {/* ======================================================== */}
      <main className="screen-only flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Success Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 sm:p-10 text-center space-y-6">
            {/* Header: Institutional Branding with Logos */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 pb-4 border-b border-slate-100">
              <img
                src="/images/ngi-logo.png"
                alt="NGi Logo"
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
              />
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28C28] block">
                  Nagarjuna Group of Institutions
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#102B46] leading-tight">
                  {campusFullName}
                </h3>
              </div>
              <img
                src={campusLogo}
                alt={`${institution} Logo`}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain bg-white rounded-lg p-1 border border-slate-200 shrink-0"
              />
            </div>

            {/* Animated Emerald Badge */}
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                Official Submission Confirmed
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#102B46] tracking-tight">
                Registration Completed Successfully!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed text-justify">
                Thank you, <span className="font-bold text-[#102B46]">{decodeURIComponent(candidateName)}</span>. Your registration details have been securely logged in the Nagarjuna institutional registry.
              </p>
            </div>

            {/* Registration ID Credential Highlight Box (Zero Overflow Protected) */}
            <div className="bg-[#102B46] rounded-2xl p-5 sm:p-6 text-white text-left space-y-4 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
                  Your Unique Registration ID
                </span>
                <span className="text-[10px] font-bold bg-[#F28C28] text-white px-2.5 py-0.5 rounded-full">
                  {institution} Campus
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-wider text-[#F28C28] break-all">
                  {registrationId}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/15 min-h-[44px] self-start sm:self-auto shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy ID"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/10 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{decodeURIComponent(candidateName)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{submissionDate}</span>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-left space-y-3">
              <h4 className="font-bold text-sm text-[#102B46]">Onboarding Next Steps:</h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#174A70] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>Print your official Registration Slip below for campus verification.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#174A70] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>An admissions officer will review your application and send instructions via email / SMS.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#174A70] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>Present your Registration ID at the campus admissions desk during orientation.</span>
                </li>
              </ul>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full sm:w-auto bg-[#F28C28] hover:bg-[#d9771a] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 min-h-[46px]"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Registration Slip</span>
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 min-h-[46px]"
              >
                <span>Return to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-2">
              <Link
                href="/register"
                className="text-xs font-semibold text-[#174A70] hover:underline"
              >
                Register Another Candidate →
              </Link>
            </div>
          </div>

          {/* Institutional Help & Support */}
          <div className="text-center text-xs text-slate-400 space-y-1">
            <p>For questions regarding your registration, contact academic.connect@ncet.co.in or +91 80 6746 2700.</p>
            <p className="flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Nagarjuna Education Society • Autonomous VTU & BNU Affiliated</span>
            </p>
          </div>
        </div>
      </main>

      {/* Screen Footer */}
      <div className="screen-only">
        <Footer />
      </div>
    </div>
  );
}

export default function RegistrationSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9FF] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#174A70] animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}