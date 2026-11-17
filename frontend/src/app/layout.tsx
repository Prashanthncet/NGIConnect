import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import ThemeRegistry from "@/theme/ThemeRegistry";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

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
    <html lang="en" className={`scroll-smooth ${poppins.variable} ${inter.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
      </head>
      <body className={`min-h-screen bg-[#F7F8FA] text-[#102B46] antialiased flex flex-col font-sans ${poppins.className}`}>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
