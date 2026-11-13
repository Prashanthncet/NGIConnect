"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [regCount, setRegCount] = useState(0);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/admin/login");
          return;
        }

        // Fetch count for badge
        const statsRes = await fetch("/api/stats", { credentials: "include" });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (statsData.success) {
            setRegCount(statsData.data?.total || 0);
          }
        }
      } catch {
        router.push("/admin/login");
      } finally {
        setChecking(false);
      }
    }
    verifyAuth();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F7F9FF] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#174A70] animate-spin" />
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col lg:flex-row bg-[#F7F8FA]">
      <AdminSidebar registrationCount={regCount} />
      <div className="flex-1 flex flex-col min-w-0 h-full lg:overflow-hidden overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

