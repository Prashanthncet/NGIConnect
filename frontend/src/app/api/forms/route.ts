import { NextResponse } from "next/server";
import { defaultForms, defaultNcetForm, defaultNcmsForm } from "@/lib/defaultForms";

export const revalidate = 60; // 60s Edge CDN caching on Vercel

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const institutionParam = (searchParams.get("institution") || "NCET").toUpperCase() as "NCET" | "NCMS";
  const slug = searchParams.get("slug");

  const edgeHeaders = {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
  };

  const backendBase =
    process.env.BACKEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://ngiconnect-api.onrender.com"
      : "http://127.0.0.1:5000");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const query = new URLSearchParams();
    if (institutionParam) query.set("institution", institutionParam);
    if (slug) query.set("slug", slug);

    const backendRes = await fetch(`${backendBase}/api/forms?${query.toString()}`, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timeoutId);

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        return NextResponse.json(data, { headers: edgeHeaders });
      }
    }
  } catch (err) {
    // Backend offline, sleeping, or unreachable
  }

  // Resilient fallback: Return verified default PUC form schema for the requested college
  const selectedForm = institutionParam === "NCMS" ? defaultNcmsForm : defaultNcetForm;
  return NextResponse.json(
    {
      success: true,
      data: [selectedForm],
      isFallback: true,
    },
    { headers: edgeHeaders }
  );
}
