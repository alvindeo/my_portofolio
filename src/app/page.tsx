"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AboutSection } from "./user/about/page";
import { ProjectsSection } from "./user/projects/page";
import { ExperienceSection } from "./user/experience/page";
import { ContactSection } from "./user/contact/page";
import { Navbar } from "@/components/user/Navbar";

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(end: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// ── Data ───────────────────────────────────────────────────────────────────
const skills = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  { category: "Backend", items: ["Python", "Laravel", "Node.js", "REST API"] },
  {
    category: "AI / ML",
    items: ["YOLOv8", "RAG", "LLM APIs", "Computer Vision"],
  },
  { category: "Tools", items: ["Git", "Figma", "PostgreSQL", "Docker"] },
];

interface Experience {
  date: string;
  role: string;
  org: string;
  desc: string;
  tags: string[];
}

const experiences: Experience[] = [
  {
    role: "Event Leader",
    org: "Student Organization – Technology Division",
    date: "March 2024 – Present",
    desc: "Led technology events with hundreds of participants, managing end-to-end event operations from planning to execution.",
    tags: ["Leadership", "Event Management", "Technology"],
  },
  {
    role: "Software Engineer",
    org: "Academic Project",
    date: "January 2024 – June 2024",
    desc: "Developed structured, data-driven web solutions using Python, Laravel, and JavaScript for real-world use cases.",
    tags: ["Python", "Laravel", "JavaScript"],
  },
  // {
  //   role: "AI Developer",
  //   org: "Personal Projects",
  //   date: "2023 – Present",
  //   desc: "Built a Computer Vision system using YOLOv8 for cataract detection and developed a RAG-based chatbot integrated with LLM APIs.",
  //   tags: ["YOLOv8", "RAG", "LLM APIs", "Computer Vision"],
  // },
];

// ── Main ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [visible, setVisible] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const projects_count = useCounter(10, 1200, statsVisible);
  const experience_count = useCounter(3, 1200, statsVisible);
  const tech_count = useCounter(15, 1200, statsVisible);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        background: "#222831",
        color: "#EEEEEE",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html { scroll-behavior: smooth; }
        .tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:rgba(0,173,181,0.12); color:#00ADB5; border:1px solid rgba(0,173,181,0.25); }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,173,181,0.12); }
        .fade-up { opacity:0; transform:translateY(24px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity:1; transform:translateY(0); }
        ::selection { background: #00ADB5; color: #222831; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #222831; }
        ::-webkit-scrollbar-thumb { background: #393E46; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ADB5; }
      `}</style>
      <Navbar />
      {/* ── HERO ── */}
      <section
        className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6"
        style={{ paddingTop: "80px" }}
      >
        {/* background grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,173,181,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,173,181,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,173,181,0.08) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div
            className={`fade-up ${visible ? "visible" : ""}`}
            style={{ transitionDelay: "0.1s" }}
          >
            <span className="tag mb-6 inline-block">
              Available for opportunities
            </span>
          </div>

          <h1
            className={`fade-up ${visible ? "visible" : ""}`}
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              transitionDelay: "0.2s",
            }}
          >
            Alvin Deo
            <br />
            <span style={{ color: "#00ADB5" }}>Ardiansyah</span>
          </h1>

          <p
            className={`fade-up ${
              visible ? "visible" : ""
            } mt-4 text-base font-medium tracking-wide`}
            style={{ color: "#00ADB5", transitionDelay: "0.3s" }}
          >
            Frontend & UI/UX Enthusiast · Software Engineer · Data Analyst
          </p>

          <p
            className={`fade-up ${
              visible ? "visible" : ""
            } mt-6 max-w-xl text-base leading-relaxed`}
            style={{ color: "#EEEEEE99", transitionDelay: "0.4s" }}
          >
            Informatics Engineering student passionate about AI, Machine
            Learning, and web-based systems. Building real-world solutions from
            Computer Vision to intelligent chatbots.
          </p>

          <div
            className={`fade-up ${
              visible ? "visible" : ""
            } mt-10 flex flex-wrap gap-4`}
            style={{ transitionDelay: "0.5s" }}
          >
            <a
              href="#projects"
              className="px-7 py-3 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ background: "#00ADB5", color: "#222831" }}
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-7 py-3 rounded-full font-semibold text-sm border transition-all duration-200 hover:bg-white/5"
              style={{ borderColor: "#393E46", color: "#EEEEEE" }}
            >
              Get in Touch
            </a>
          </div>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: "#EEEEEE99" }}
          >
            scroll
          </span>
          <div
            className="w-px h-10 animate-pulse"
            style={{
              background: "linear-gradient(to bottom, #00ADB5, transparent)",
            }}
          />
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-3 gap-6">
          {[
            { value: projects_count, suffix: "+", label: "Projects Built" },
            { value: experience_count, suffix: "+", label: "Years Learning" },
            { value: tech_count, suffix: "+", label: "Technologies" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl card-hover"
              style={{
                background: "#393E46",
                border: "1px solid rgba(0,173,181,0.1)",
              }}
            >
              <div
                className="text-4xl font-bold"
                style={{ fontFamily: "'Syne', sans-serif", color: "#00ADB5" }}
              >
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-sm mt-1" style={{ color: "#EEEEEE99" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ── ABOUT ── */}
      <section id="about">
        <AboutSection />
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="py-20" style={{ background: "#1a1f26" }}>
        <div className="max-w-6xl mx-auto px-6">
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "#00ADB5" }}
          >
            Skills
          </p>
          <h2
            className="mb-12"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
            }}
          >
            Technologies I work with
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((group, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl card-hover"
                style={{
                  background: "#393E46",
                  border: "1px solid rgba(0,173,181,0.1)",
                }}
              >
                <p
                  className="text-xs font-semibold tracking-widest uppercase mb-4"
                  style={{ color: "#00ADB5" }}
                >
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, j) => (
                    <span key={j} className="tag">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <ProjectsSection />

      {/* ── EXPERIENCE ── */}
      <section
        id="experience"
        className="py-24"
        style={{ background: "#1a1f26" }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .timeline-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .timeline-card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,173,181,0.15); }
        .tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:rgba(0,173,181,0.12); color:#00ADB5; border:1px solid rgba(0,173,181,0.25); }
        @media (max-width: 768px) {
          .timeline-left { padding-right: 0 !important; text-align: left !important; align-items: flex-start !important; }
          .timeline-right { padding-left: 0 !important; }
          .timeline-connector-left { display: none; }
          .timeline-connector-right { display: none; }
          .timeline-line { left: 16px !important; }
          .timeline-dot { left: 8px !important; right: auto !important; }
          .timeline-row { flex-direction: column !important; padding-left: 48px !important; }
        }
      `}</style>

        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "#00ADB5", fontFamily: "'DM Sans', sans-serif" }}
            >
              Experience
            </p>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
                color: "#EEEEEE",
                lineHeight: 1.1,
              }}
            >
              Where I've contributed
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical center line */}
            <div
              className="timeline-line absolute top-0 bottom-0 w-px"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                background:
                  "linear-gradient(to bottom, transparent, #00ADB5 10%, #00ADB5 90%, transparent)",
                opacity: 0.3,
              }}
            />

            <div className="space-y-16">
              {experiences.slice(0, 3).map((exp, i) => {
                const isRight = i % 2 === 0;
                const isViewAll = i === 1;
                const descText = isViewAll
                  ? exp.desc.slice(0, 100) + "..."
                  : exp.desc;

                return (
                  <div
                    key={i}
                    className="timeline-row relative flex items-center"
                    style={{ minHeight: "120px" }}
                  >
                    {/* LEFT SIDE */}
                    <div
                      className={`timeline-left w-1/2 pr-12 flex flex-col ${
                        isRight
                          ? "items-end text-right opacity-0 pointer-events-none"
                          : "items-end text-right"
                      }`}
                    >
                      {!isRight && (
                        <div
                          className="timeline-card p-6 rounded-2xl w-full max-w-sm"
                          style={{
                            background: "#393E46",
                            border: "1px solid rgba(0,173,181,0.15)",
                          }}
                        >
                          <p
                            className="text-xs font-mono mb-2"
                            style={{ color: "#00ADB5" }}
                          >
                            {exp.date}
                          </p>
                          <h3
                            className="font-semibold text-base mb-1"
                            style={{
                              color: "#EEEEEE",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {exp.role}
                          </h3>
                          <p
                            className="text-sm mb-3"
                            style={{
                              color: "#00ADB5",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {exp.org}
                          </p>
                          <p
                            className="text-sm leading-relaxed mb-4"
                            style={{
                              color: "#EEEEEE99",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {exp.desc}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {exp.tags.map((tag, j) => (
                              <span key={j} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CENTER DOT */}
                    <div
                      className="timeline-dot absolute z-10 w-4 h-4 rounded-full border-2"
                      style={{
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#222831",
                        borderColor: "#00ADB5",
                        boxShadow: "0 0 12px rgba(0,173,181,0.5)",
                      }}
                    />

                    {/* RIGHT SIDE */}
                    <div
                      className={`timeline-right w-1/2 pl-12 flex flex-col ${
                        !isRight
                          ? "items-start opacity-0 pointer-events-none"
                          : "items-start"
                      }`}
                    >
                      {isRight && (
                        <div
                          className="timeline-card p-6 rounded-2xl w-full max-w-sm"
                          style={{
                            background: "#393E46",
                            border: "1px solid rgba(0,173,181,0.15)",
                          }}
                        >
                          <p
                            className="text-xs font-mono mb-2"
                            style={{ color: "#00ADB5" }}
                          >
                            {exp.date}
                          </p>
                          <h3
                            className="font-semibold text-base mb-1"
                            style={{
                              color: "#EEEEEE",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {exp.role}
                          </h3>
                          <p
                            className="text-sm mb-3"
                            style={{
                              color: "#00ADB5",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {exp.org}
                          </p>
                          <p
                            className="text-sm leading-relaxed mb-4"
                            style={{
                              color: "#EEEEEE99",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {descText}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {exp.tags.map((tag, j) => (
                              <span key={j} className="tag">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* VIEW ALL BUTTON - CENTER */}
                    {isViewAll && (
                      <div
                        className="absolute left-1/2 transform -translate-x-1/2 z-20"
                        style={{ top: "100%" }}
                      >
                        <div
                          className="mt-8 pt-4 border-t"
                          style={{ borderColor: "rgba(0,173,181,0.2)" }}
                        >
                          <Link
                            href="/user/experience"
                            className="text-sm font-medium whitespace-nowrap"
                            style={{ color: "#00ADB5" }}
                          >
                            View all experiences →
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <ContactSection />

      {/* ── FOOTER ── */}
      <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: "#393E46", color: "#EEEEEE40" }}
      >
        <p>© 2026 Alvin Deo Ardiansyah · Built with Next.js & ❤️</p>
      </footer>
    </div>
  );
}
