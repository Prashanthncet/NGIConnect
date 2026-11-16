import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  School,
  ExternalLink,
  Users,
  Building2,
  Handshake,
  BookOpen,
  TrendingUp,
  Network,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Award,
  GraduationCap,
  Sparkles,
  Compass,
  Cpu,
  Briefcase,
  Layers,
  HeartHandshake,
  Bell,
  Globe2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative bg-[#F7F9FF] border-b border-slate-200/80 pt-8 pb-14 sm:pt-12 sm:pb-18 lg:py-20 overflow-hidden">
          {/* Subtle background dot grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "radial-gradient(#174A70 0.75px, transparent 0.75px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Heading, Subtext, CTAs */}
              <div className="lg:col-span-6 space-y-5 sm:space-y-6 text-center lg:text-left">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#F28C28] text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-pulse"></span>
                  <span>PUC & +2 Admissions 2026</span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold text-[#102B46] tracking-tight leading-[1.15]">
                  Connect. Collaborate.{" "}
                  <span className="text-[#F28C28]">Create Opportunities.</span>
                </h1>

                {/* Supporting Description */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 text-justify">
                  Nagarjuna Connect brings together students, alumni, faculty members, and the wider Nagarjuna community through
                  a shared platform. Discover academic programs, explore campus opportunities, participate in activities,
                  and build connections that support your learning and professional journey.
                </p>

                {/* Dual Prominent College Registration CTAs for PUC Students */}
                <div className="space-y-2.5 max-w-xl mx-auto lg:mx-0">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <Link
                      href="/register?institution=NCET"
                      className="bg-[#102B46] hover:bg-[#174A70] text-white px-2 sm:px-4 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 text-center min-h-[46px]"
                    >
                      <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 shrink-0" />
                      <span className="leading-tight">Register for NCET</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline-block" />
                    </Link>

                    <Link
                      href="/register?institution=NCMS"
                      className="bg-[#F28C28] hover:bg-[#d9771a] text-white px-2 sm:px-4 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 text-center min-h-[46px]"
                    >
                      <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
                      <span className="leading-tight">Register for NCMS</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline-block" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-4 pt-1">
                    <Link
                      href="#colleges"
                      className="text-xs font-bold text-[#174A70] hover:text-[#F28C28] transition-colors flex items-center gap-1.5 py-1"
                    >
                      <span>Explore Both Colleges & Academic Courses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* 5 Core Pillars Mini Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-200/80 text-left">
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-slate-100">
                    <Users className="w-4 h-4 text-[#F28C28] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700">Community Network</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-slate-100">
                    <Compass className="w-4 h-4 text-[#174A70] shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700">Career Guidance</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] font-semibold text-slate-700">Campus Activities</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white p-2 sm:p-2.5">
                  <div className="relative h-[280px] sm:h-[400px] rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src="/images/ncet-campus.jpg"
                      alt="Nagarjuna College of Engineering and Technology (NCET) Main Campus Gate & Clock Tower"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Bottom overlay badge */}
                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 bg-[#102B46]/95 backdrop-blur-md p-3 sm:p-4 rounded-xl text-white border border-white/10 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <img
                          src="/images/ncet-logo.png"
                          alt="NCET Logo"
                          className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-white rounded-lg p-0.5 sm:p-1 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-sm sm:text-base leading-tight">NCET Campus</span>
                            <span className="text-[9px] bg-[#F28C28] text-white px-2 py-0.5 rounded-full font-bold">
                              Bengaluru
                            </span>
                          </div>
                          <p className="text-[10px] sm:text-xs text-slate-300 truncate mt-0.5">
                            Autonomous • Affiliated to VTU • NAAC A+
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/register?institution=NCET"
                        className="text-xs font-bold bg-[#F28C28] hover:bg-[#d9771a] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors shrink-0 shadow-sm"
                      >
                        Register
                      </Link>
                    </div>
                  </div>

                  {/* Institution Quick Switcher Indicators */}
                  <div className="flex items-center justify-between px-2 pt-2.5 pb-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-600">Nagarjuna Group of Institutions</span>
                    <span className="text-[11px] font-bold text-[#F28C28]">NH-44 Campus Ecosystem</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PLACEMENT HIGHLIGHTS RIBBON - 100% FULL WIDTH */}
        <section className="w-full bg-[#F7F9FF] border-b border-slate-200/80 py-8 lg:py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(16,43,70,0.06)] overflow-hidden p-6 sm:p-8 lg:p-10">
              {/* Top Accent Ribbon Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#102B46] via-[#F28C28] to-[#102B46]" />

              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 gap-6 sm:gap-0 items-center text-center">
                <div className="sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-50 text-[#F28C28] mb-2 sm:mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F28C28] tracking-tight leading-none">
                    150+
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-bold mt-2 sm:mt-3">
                    Companies Visited
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Top MNCs & Global Tech Recruiters</p>
                </div>

                <div className="sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-[#174A70] mb-2 sm:mb-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F28C28] tracking-tight leading-none">
                    800+
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-bold mt-2 sm:mt-3">
                    Students Placed Since 2024
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Career & Placement Milestone</p>
                </div>

                <div className="sm:px-6 lg:px-8 py-2 sm:py-3 flex flex-col items-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 mb-2 sm:mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#F28C28] tracking-tight leading-none">
                    20 LPA
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-700 font-bold mt-2 sm:mt-3">
                    Highest Package
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Premier Tier-1 Offers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. ABOUT SECTION: A GROWING NETWORK OF THE NAGARJUNA COMMUNITY */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Authentic Student Community Image */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                    alt="Indian college students collaborating with laptop in campus library"
                    className="w-full h-[300px] sm:h-[400px] object-cover"
                    loading="lazy"
                  />
                  {/* Floating Highlight Card */}
                  <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-sm p-3.5 rounded-xl border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 text-[#174A70] shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#102B46]">Collaborative Network</h4>
                        <p className="text-[11px] text-slate-500">Students, Faculty & Mentors</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Copy */}
              <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 text-[#174A70] text-xs uppercase font-bold tracking-wider">
                  <span className="w-6 h-0.5 bg-[#174A70]"></span>
                  <span>About Nagarjuna Connect</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102B46] tracking-tight leading-snug">
                  A Growing Network of the <span className="text-[#F28C28]">Nagarjuna Community</span>
                </h2>

                <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed text-justify">
                  Nagarjuna Connect is designed to strengthen relationships across the Nagarjuna community. It creates a common
                  space where students, alumni, faculty, and institutions can stay connected, discover opportunities, and
                  contribute to a growing academic and professional network.
                </p>

                {/* 6 Core Value Pillars (Zero Dummy Stats) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#102B46]">Student Participation</h4>
                      <p className="text-[11px] text-slate-500">Mentorship and academic engagement.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#102B46]">Alumni Engagement</h4>
                      <p className="text-[11px] text-slate-500">Career awareness and professional insights.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#102B46]">Institutional Collaboration</h4>
                      <p className="text-[11px] text-slate-500">Cross-departmental learning initiatives.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#102B46]">Knowledge Sharing</h4>
                      <p className="text-[11px] text-slate-500">Seminars, workshops, and project showcases.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#102B46]">Career Awareness</h4>
                      <p className="text-[11px] text-slate-500">Industry readiness and skill development.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#102B46]">Community Development</h4>
                      <p className="text-[11px] text-slate-500">Fostering lifelong academic associations.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-[#F28C28] font-bold text-xs sm:text-sm hover:translate-x-1 transition-transform"
                  >
                    <span>Register to Join the Network</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. COLLEGE SELECTION & SHOWCASE: NCET & NCMS FOR PUC STUDENTS */}
        <div id="institutions" />
        <section className="py-14 sm:py-20 bg-[#F7F8FA] border-b border-slate-200" id="colleges">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
              <span className="text-[#174A70] text-xs font-bold uppercase tracking-wider">
                Explore Premier Institutions
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102B46] tracking-tight mt-1">
                Choose Your Academic Path
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                Designed for PUC and +2 students exploring their next educational milestone. Discover verified offerings,
                campus facilities, and training pipelines across engineering and management.
              </p>
            </div>

            {/* Two Distinct College Profile Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* College 1: NCET (Engineering & Technology) */}
              <article
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                id="ncet"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#102B46] rounded-t-2xl" />
                <div className="space-y-4">
                  {/* Header Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0">
                        <img
                          src="/images/ncet-logo.png"
                          alt="NCET Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider">
                          Engineering & Technology
                        </span>
                        <h3 className="text-base sm:text-xl font-bold text-[#102B46] leading-tight">
                          Nagarjuna College of Engineering and Technology
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Autonomous • Affiliated to VTU • NAAC A+ Grade</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#F28C28] shrink-0" />
                      <span>Established 2001</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F28C28] shrink-0" />
                      <span>Devanahalli, Bengaluru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#174A70] shrink-0" />
                      <span>Autonomous • VTU & AICTE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#174A70] shrink-0" />
                      <span>NAAC &apos;A+&apos; Accredited</span>
                    </div>
                  </div>

                  {/* College Overview */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                    Established in 2001 under the aegis of Nagarjuna Education Society, NCET is an autonomous engineering
                    institution spread across a scenic 72-acre campus in Devanahalli, Bengaluru near Kempegowda International Airport.
                    Recognized as a Centre of Innovative Science and Engineering Education by VGST, NCET empowers students through
                    hands-on experiential labs, cutting-edge AI curricula, industry certifications, and dedicated placement coaching.
                  </p>

                  {/* Verified Programs List */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold text-[#102B46] uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>Key Academic Programs (UG & PG):</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-700">
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">CSE</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">CSE (AI & ML)</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">Information Science (ISE)</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">CSE (Data Science)</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">ECE</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">Mechanical</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">Civil</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">MBA & MCA</span>
                    </div>
                  </div>

                  {/* Campus & Facilities Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174A70]"></span>
                      <span>Scenic 72-acre green campus with Wi-Fi smart classrooms & digital central library</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174A70]"></span>
                      <span>Dedicated TORII Placement Academy with AWS, Cisco, and Oracle certifications</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174A70]"></span>
                      <span>Modern AI, robotics, & IoT laboratories with active innovation incubation cells</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#174A70]"></span>
                      <span>On-campus residential hostels for boys & girls, sports complex, and cafeteria</span>
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href="https://ncet.co.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#174A70] hover:underline flex items-center gap-1"
                  >
                    <span>Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href="/register?institution=NCET"
                    className="bg-[#102B46] hover:bg-[#174A70] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Register for NCET</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>

              {/* College 2: NCMS (Management & Commerce) */}
              <article
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group"
                id="ncms"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F28C28] rounded-t-2xl" />
                <div className="space-y-4">
                  {/* Header Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1 shrink-0">
                        <img
                          src="/images/ncms-logo.webp"
                          alt="NCMS Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#F28C28] uppercase tracking-wider">
                          Management, Commerce & IT
                        </span>
                        <h3 className="text-base sm:text-xl font-bold text-[#102B46] leading-tight">
                          Nagarjuna College of Management Studies
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">Affiliated to Bengaluru North University (BNU)</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#F28C28] shrink-0" />
                      <span>Established 2015</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#F28C28] shrink-0" />
                      <span>Chikkaballapur, NH-44</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#174A70] shrink-0" />
                      <span>BNU Affiliation & AICTE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-[#174A70] shrink-0" />
                      <span>Industry Skill Integrated</span>
                    </div>
                  </div>

                  {/* College Overview */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed text-justify">
                    NCMS provides accessible, high-standard management and commerce education designed for leadership
                    and career success. Located on an expansive campus beside NH-44, it empowers students with pragmatic
                    case studies, business analytics, and corporate immersion.
                  </p>

                  {/* Verified Programs List */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold text-[#102B46] uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#F28C28]" />
                      <span>Key Academic Programs (UG & PG):</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-700">
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">BBA</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">B.Com</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">B.Com - BDA</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">B.Sc - PMCs</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">B.Sc - AI</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">B.Sc - DS</span>
                      <span className="bg-white px-2 py-1 rounded-md border border-slate-200 font-medium">MBA (PG)</span>
                    </div>
                  </div>

                  {/* Campus & Facilities Highlights */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]"></span>
                      <span>Smart audio-visual classrooms & modern business analytics labs</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]"></span>
                      <span>Value-added certifications in digital marketing, Tally, and data tools</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F28C28]"></span>
                      <span>Corporate mentoring, interview workshops, and active sports amenities</span>
                    </p>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href="https://ncms.co.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#174A70] hover:underline flex items-center gap-1"
                  >
                    <span>Official Website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href="/register?institution=NCMS"
                    className="bg-[#F28C28] hover:bg-[#d9771a] text-white text-xs font-bold px-4 sm:px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Register for NCMS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 5. WHY NAGARJUNA CONNECT SECTION (Meaningful Participation, Lasting Value) */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-200" id="benefits">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-[#174A70] text-xs font-bold uppercase tracking-wider">Why Nagarjuna Connect?</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#102B46] tracking-tight mt-1">
                Meaningful Participation, Lasting Value
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Empowering students, alumni, and educators through a purposeful academic community.
              </p>
            </div>

            {/* 6 Structured Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#174A70] hover:shadow-xs transition-all group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3.5 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#102B46]">1. One Connected Community</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Build connections with students, alumni, faculty, and the wider Nagarjuna network.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#174A70] hover:shadow-xs transition-all group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3.5 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#102B46]">2. Discover Opportunities</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Stay informed about relevant academic activities, events, and career-related opportunities.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#174A70] hover:shadow-xs transition-all group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3.5 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#102B46]">3. Learn and Share</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Exchange ideas, knowledge, and experiences with the community.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#174A70] hover:shadow-xs transition-all group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3.5 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#102B46]">4. Stay Updated</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Access relevant institutional announcements, activities, and updates.
                </p>
              </div>

              {/* Card 5 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#174A70] hover:shadow-xs transition-all group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3.5 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Network className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#102B46]">5. Build Your Network</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Develop meaningful relationships that can support your academic and professional journey.
                </p>
              </div>

              {/* Card 6 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 sm:p-6 hover:border-[#174A70] hover:shadow-xs transition-all group">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3.5 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Globe2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm sm:text-base text-[#102B46]">6. Be Part of Something Bigger</h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Participate in a community that encourages learning, collaboration, and growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. REGISTRATION CTA BANNER */}
        <section className="py-12 sm:py-16 bg-[#F7F8FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#102B46] rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
              <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
                <span className="text-xs uppercase font-bold text-orange-300 tracking-wider">
                  Admissions Open for Academic Year 2026
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Be Part of Nagarjuna Connect
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Take the first step toward your degree. Complete your registration and connect directly with campus
                  admissions counsellors.
                </p>
              </div>
              <div className="z-10 shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  href="/register?institution=NCET"
                  className="bg-white hover:bg-slate-100 text-[#102B46] px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 text-center min-h-[44px]"
                >
                  <span>Register for NCET</span>
                  <ArrowRight className="w-4 h-4 text-[#F28C28]" />
                </Link>
                <Link
                  href="/register?institution=NCMS"
                  className="bg-[#F28C28] hover:bg-[#d9771a] text-white px-5 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 text-center min-h-[44px]"
                >
                  <span>Register for NCMS</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
