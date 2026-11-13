import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  sublabel?: string;
  icon: LucideIcon;
  badge?: string;
  colorScheme?: "navy" | "orange" | "blue" | "emerald";
}

export default function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  badge,
  colorScheme = "navy",
}: StatCardProps) {
  const schemeStyles = {
    navy: "bg-[#102B46]/5 text-[#102B46] border-[#102B46]/20",
    orange: "bg-[#F28C28]/10 text-[#F28C28] border-[#F28C28]/20",
    blue: "bg-[#174A70]/10 text-[#174A70] border-[#174A70]/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#102B46] tracking-tight">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${schemeStyles[colorScheme]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(sublabel || badge) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{sublabel}</span>
          {badge && (
            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

