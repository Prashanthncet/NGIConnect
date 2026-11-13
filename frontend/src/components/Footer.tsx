import React from "react";
import Link from "next/link";
import { GraduationCap, ExternalLink, ShieldCheck, Mail, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#102B46] text-white border-t border-slate-800 print:hidden" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 p-1 flex items-center justify-center">
                <img
                  src="/images/ngi-logo.png"
                  alt="NGi Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                NGi <span className="text-[#F28C28]">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              The collaborative initiative bridging students, alumni, faculty, and industry partners across Nagarjuna
              Group of Institutions. Fostering continuous education, placement support, and inter-campus research.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Accredited Academic Ecosystem • Autonomous Standards</span>
            </div>
          </div>

          {/* NCET Campus */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/images/ncet-logo.png"
                alt="NCET Logo"
                className="w-8 h-8 object-contain bg-white rounded p-0.5"
              />
              <div>
                <span className="font-bold text-white text-sm block leading-tight">NCET Campus</span>
                <span className="text-[10px] bg-orange-500/20 text-[#F28C28] px-1.5 py-0.2 rounded font-semibold">Engg & Tech</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Mudugurki, Venkatagirikote Post, Devanahalli, Bengaluru, Karnataka 562110
            </p>
            <a
              href="https://ncet.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#F28C28] hover:underline pt-1"
            >
              Visit ncet.co.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* NCMS Campus */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                src="/images/ncms-logo.webp"
                alt="NCMS Logo"
                className="w-8 h-8 object-contain bg-white rounded p-0.5"
              />
              <div>
                <span className="font-bold text-white text-sm block leading-tight">NCMS Campus</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded font-semibold">Management</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Chikkaballapur Regional Campus, Bengaluru North University Affiliated, Karnataka 562101
            </p>
            <a
              href="https://www.ncms.co.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#F28C28] hover:underline pt-1"
            >
              Visit ncms.co.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Quick Portal Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Portals & Links</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/register" className="hover:text-[#F28C28] transition-colors">
                  Registration Portal
                </Link>
              </li>
              <li>
                <Link href="/#institutions" className="hover:text-[#F28C28] transition-colors">
                  Academic Profiles
                </Link>
              </li>
              <li>
                <Link href="/#benefits" className="hover:text-[#F28C28] transition-colors">
                  Why NGi Connect
                </Link>
              </li>
              <li>
                <a href="https://ngi.org.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F28C28] transition-colors flex items-center gap-1">
                  NGi Central Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Nagarjuna Group of Institutions (NGi). All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Institutional Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Engagement</span>
            <span className="hover:text-white transition-colors cursor-pointer">Data Protection Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
