import type { Metadata } from "next";
import ThemeRegistry from "@/theme/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nagarjuna Connect | Nagarjuna Group of Institutions",
  description:
    "Unified institutional networking, collaboration, and dynamic registration platform connecting Nagarjuna College of Engineering and Technology (NCET) and Nagarjuna College of Management Studies (NCMS).",
  keywords: "NGI, NCET, NCMS, Nagarjuna College, Engineering, Management, Bangalore, VTU, BNU, Registrations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F7F8FA] text-[#102B46] antialiased flex flex-col font-sans">
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
