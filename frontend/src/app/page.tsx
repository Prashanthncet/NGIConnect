import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  School,
  ExternalLink,
  Users,
  Building,
  Handshake,
  BookOpen,
  TrendingUp,
  Network,
  CheckCircle2,
  Calendar,
  MapPin,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="relative bg-[#F7F9FF] border-b border-slate-200/80 pt-10 pb-16 lg:py-20 overflow-hidden">
          {/* Subtle background grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "radial-gradient(#174A70 0.75px, transparent 0.75px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column Copy */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/70 border border-orange-200 text-[#F28C28] text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#F28C28] animate-pulse"></span>
                  <span>Nagarjuna Connect</span>
                </div>

                {/* Primary Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#102B46] tracking-tight leading-[1.15]">
                  Connect. Collaborate.{" "}
                  <span className="text-[#F28C28]">Create Opportunities.</span>
                </h1>

                {/* Supporting Description with Justified Text Alignment */}
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 text-justify">
                  Be part of Nagarjuna Connect, an initiative bringing together the Nagarjuna educational community through
                  meaningful connections, collaboration and shared opportunities across engineering and management.
                </p>

                {/* CTAs: Side-by-Side in a Single Row on all Devices */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-2 w-full max-w-xl mx-auto lg:mx-0">
                  <Link
                    href="/register"
                    className="bg-[#F28C28] hover:bg-[#d9771a] text-white px-2.5 sm:px-6 py-3 sm:py-4 rounded-xl text-xs sm:text-base font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2 active:scale-95 text-center leading-tight min-h-[46px]"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
                  </Link>
                  <Link
                    href="#institutions"
                    className="px-2 sm:px-6 py-3 sm:py-4 rounded-xl border-2 border-[#102B46] text-[#102B46] hover:bg-slate-100 text-xs sm:text-base font-bold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-center leading-tight min-h-[46px]"
                  >
                    <span>Explore Institutions</span>
                    <School className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0 hidden xs:inline" />
                  </Link>
                </div>

                {/* Quick Network Stat Badges */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#102B46]">15,000+</p>
                    <p className="text-xs text-slate-500 font-medium">Community Network</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#102B46]">2</p>
                    <p className="text-xs text-slate-500 font-medium">Premier Campuses</p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-[#F28C28]">100%</p>
                    <p className="text-xs text-slate-500 font-medium">Dynamic Access</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Card with Official NCET Campus Gate */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2.5">
                  <div className="relative h-[320px] sm:h-[420px] rounded-xl overflow-hidden bg-slate-900">
                    <img
                      src="/images/ncet-campus.jpg"
                      alt="Nagarjuna College of Engineering and Technology (NCET) Main Campus Gate & Clock Tower"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Bottom overlay badge */}
                    <div className="absolute bottom-4 left-4 right-4 bg-[#102B46]/95 backdrop-blur-md p-4 rounded-xl text-white border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src="/images/ncet-logo.png"
                          alt="NCET Logo"
                          className="w-10 h-10 object-contain bg-white rounded-lg p-1 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-base sm:text-lg">NCET Main Campus</span>
                            <span className="text-[10px] bg-[#F28C28] text-white px-2 py-0.5 rounded-full font-bold">
                              Bengaluru
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Autonomous Institute • Affiliated to VTU • NAAC A+
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/register?institution=NCET"
                        className="hidden sm:inline-flex text-xs font-bold bg-[#F28C28] hover:bg-[#d9771a] text-white px-3.5 py-2 rounded-lg transition-colors shrink-0 shadow-sm"
                      >
                        Register
                      </Link>
                    </div>
                  </div>

                  {/* Carousel pagination indicator dots */}
                  <div className="flex items-center justify-center gap-2 pt-3 pb-1">
                    <span className="w-6 h-2 rounded-full bg-[#F28C28]"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PLACEMENT STATISTICS BANNER - 100% FULL WIDTH ABOVE ABOUT SECTION */}
        <section className="w-full bg-[#F7F9FF] border-b border-slate-200/80 py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 gap-6 sm:gap-0 items-center text-center">
                <div className="sm:px-6 lg:px-8 py-3">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F28C28] tracking-tight leading-none">150+</p>
                  <p className="text-sm sm:text-base text-slate-600 font-semibold mt-3">Companies Visited</p>
                </div>
                <div className="sm:px-6 lg:px-8 py-3">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F28C28] tracking-tight leading-none">800+</p>
                  <p className="text-sm sm:text-base text-slate-600 font-semibold mt-3">Students Placed Since 2024</p>
                </div>
                <div className="sm:px-6 lg:px-8 py-3">
                  <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#F28C28] tracking-tight leading-none">20 LPA</p>
                  <p className="text-sm sm:text-base text-slate-600 font-semibold mt-3">Highest Package</p>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm font-extrabold text-[#174A70] tracking-[0.2em] uppercase text-center mt-4">
              Placement Statistics — Since 2024
            </p>
          </div>
        </section>

        {/* 3. ABOUT SECTION */}
        <section className="py-20 bg-white border-b border-slate-200" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Authentic Student Community Image */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
                    alt="Indian college students collaborating with laptop in campus library"
                    className="w-full h-[360px] sm:h-[440px] object-cover"
                  />
                  {/* Floating Highlight Card */}
                  <div className="absolute -bottom-1 left-4 right-4 sm:right-auto sm:max-w-xs bg-white p-4 rounded-xl border border-slate-200 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-blue-50 text-[#174A70]">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#102B46]">Unified Community</h4>
                        <p className="text-xs text-slate-500">Students, Alumni, Faculty & Deans</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Editorial Copy */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 text-[#174A70] text-xs uppercase font-bold tracking-wider">
                  <span className="w-6 h-0.5 bg-[#174A70]"></span>
                  <span>About Nagarjuna Connect</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-[#102B46] tracking-tight leading-snug">
                  A Growing Network of the <span className="text-[#F28C28]">Nagarjuna Community</span>
                </h2>

                <p className="text-base text-slate-600 leading-relaxed text-justify">
                  Nagarjuna Connect brings together students, alumni, faculty and stakeholders from the Nagarjuna Group of
                  Institutions to build meaningful connections, share knowledge and explore collaborative opportunities
                  across institutions.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#102B46]">Institutional Engagement</h4>
                      <p className="text-xs text-slate-500">
                        Direct interaction with campus mentors, departments, and academic leadership.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#102B46]">Cross-Campus Knowledge Sharing</h4>
                      <p className="text-xs text-slate-500">
                        Access research papers, tech symposiums, hackathons, and management case studies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm text-[#102B46]">Alumni & Career Opportunities</h4>
                      <p className="text-xs text-slate-500">
                        Placement referrals, internship pipelines, and ongoing career development.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-[#F28C28] font-bold text-sm hover:translate-x-1 transition-transform"
                  >
                    <span>Learn More & Register</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. INSTITUTIONS SECTION */}
        <section className="py-20 bg-[#F7F8FA] border-b border-slate-200" id="institutions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#174A70] text-xs font-bold uppercase tracking-wider">
                Institutions Behind the Connection
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#102B46] tracking-tight mt-1">
                Our Institutions
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Discover the premier campuses managed by the Nagarjuna Education Society delivering academic excellence.
              </p>
            </div>

            {/* Two Institutional Profile Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Profile 1: NCET */}
              <article
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                id="ncet"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#102B46] rounded-t-2xl" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1.5 shrink-0">
                        <img
                          src="/images/ncet-logo.png"
                          alt="NCET Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#102B46]">
                          Nagarjuna College of Engineering and Technology
                        </h3>
                        <p className="text-xs text-slate-500">Autonomous • Affiliated to VTU • NAAC A+</p>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Meta Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F28C28]" />
                      <span>Established in 2001</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F28C28]" />
                      <span>Devanahalli, Bengaluru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#174A70]" />
                      <span>Autonomous VTU Status</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#174A70]" />
                      <span>Engineering & Tech (UG/PG)</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed pt-2 text-justify">
                    Managed by the Nagarjuna Education Society. NCET focuses on engineering, technology, academic
                    excellence, innovation, research, and holistic professional development.
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href="https://ncet.co.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#174A70] hover:underline flex items-center gap-1"
                  >
                    Official Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href="/register?institution=NCET"
                    className="bg-[#F28C28] hover:bg-[#d9771a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Explore NCET & Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>

              {/* Profile 2: NCMS */}
              <article
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group"
                id="ncms"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#174A70] rounded-t-2xl" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-1.5 shrink-0">
                        <img
                          src="/images/ncms-logo.webp"
                          alt="NCMS Logo"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#102B46]">
                          Nagarjuna College of Management Studies
                        </h3>
                        <p className="text-xs text-slate-500">Affiliated to Bengaluru North University</p>
                      </div>
                    </div>
                  </div>

                  {/* Institutional Meta Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3 text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#F28C28]" />
                      <span>Established in 2015</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#F28C28]" />
                      <span>Chikkaballapur, Karnataka</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#174A70]" />
                      <span>BNU Affiliation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#174A70]" />
                      <span>Management Programmes</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed pt-2 text-justify">
                    Managed by the Nagarjuna Education Society. Offers management and other professional academic
                    programmes focusing on practical learning, leadership development, and corporate immersion.
                  </p>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <a
                    href="https://www.ncms.co.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-[#174A70] hover:underline flex items-center gap-1"
                  >
                    Official Site <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href="/register?institution=NCMS"
                    className="bg-[#F28C28] hover:bg-[#d9771a] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Explore NCMS & Register</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* 4. WHY NAGARJUNA CONNECT SECTION (6-Grid Icons) */}
        <section className="py-20 bg-white border-b border-slate-200" id="benefits">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#174A70] text-xs font-bold uppercase tracking-wider">Why Nagarjuna Connect?</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#102B46] tracking-tight mt-1">
                Meaningful Participation, Lasting Value
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Empowering the Nagarjuna educational ecosystem with structured collaboration.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {/* Item 1 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center hover:border-[#174A70] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#102B46]">Community Connection</h4>
                <p className="text-[11px] text-slate-500 mt-1">Cross-batch network</p>
              </div>

              {/* Item 2 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center hover:border-[#174A70] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Building className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#102B46]">Institutional Engagement</h4>
                <p className="text-[11px] text-slate-500 mt-1">Campus initiatives</p>
              </div>

              {/* Item 3 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center hover:border-[#174A70] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Handshake className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#102B46]">Collaboration</h4>
                <p className="text-[11px] text-slate-500 mt-1">Inter-college ventures</p>
              </div>

              {/* Item 4 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center hover:border-[#174A70] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#102B46]">Knowledge Sharing</h4>
                <p className="text-[11px] text-slate-500 mt-1">Research & projects</p>
              </div>

              {/* Item 5 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center hover:border-[#174A70] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#102B46]">Opportunities</h4>
                <p className="text-[11px] text-slate-500 mt-1">Career & placements</p>
              </div>

              {/* Item 6 */}
              <div className="bg-[#F7F9FF] border border-slate-200/80 rounded-2xl p-5 text-center flex flex-col items-center hover:border-[#174A70] hover:shadow-sm transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#174A70] mb-3 group-hover:bg-[#102B46] group-hover:text-white transition-colors">
                  <Network className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#102B46]">Professional Networking</h4>
                <p className="text-[11px] text-slate-500 mt-1">Alumni global chapters</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. REGISTRATION CTA BANNER */}
        <section className="py-16 bg-[#F7F8FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#102B46] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left z-10 max-w-xl">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Be Part of Nagarjuna Connect</h3>
                <p className="text-sm sm:text-base text-slate-300">
                  Take the first step. Complete your registration and become part of the Nagarjuna Connect community.
                </p>
              </div>
              <div className="z-10 shrink-0">
                <Link
                  href="/register"
                  className="bg-[#F28C28] hover:bg-[#d9771a] text-white px-8 py-4 rounded-xl text-base font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <span>Start Registration</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
