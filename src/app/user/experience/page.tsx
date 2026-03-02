'use client'

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { motion, type Variants } from "framer-motion";

interface Experience {
  role: string;
  org: string;
  desc: string;
  year: string;
  tags?: string[];
  achievements?: string[];
}

const experiences: Experience[] = [
  {
    role: "Software Engineer Intern",
    org: "PT Telkom Indonesia",
    desc: "Contributed to the development and maintenance of internal web applications, implementing new features and optimizing system performance.",
    year: "Feb 2025 - Present",
    tags: ["Project Management", "Web Development", "Backend", "Database", "API"],
    achievements: [
      "Developed and maintained CRUD features for internal company systems.",
      "Optimized database queries to improve application performance.",
      "Collaborated with cross-functional teams using Git-based workflow.",
    ]
  },
  {
    role: "Staff / Technology Division",
    org: "Himpunan Mahasiswa Teknik Informatika (HMTI)",
    desc: "Contributed to the planning and execution of technology-driven programs and student development initiatives within the Informatics Student Association.",
    year: "2023 - Present",
    tags: ["Leadership", "Project Management", "Event Technology", "Team Collaboration"],
    achievements: [
      "Organized and managed technical seminars and workshops with 100+ participants.",
      "Coordinated cross-division collaboration to ensure smooth event execution.",
      "Improved internal workflow documentation and digital coordination system.",
      "Actively contributed to student engagement and technology-based initiatives."
    ]
  }
];

// ── Background Effects ──────────────────────────────────────────────────────

function Sparkles() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[var(--accent)]"
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            boxShadow: '0 0 5px var(--accent)',
          }}
          animate={{
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

function ExperienceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
      <Sparkles />
      {/* Floating Beams */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] w-64 opacity-30"
          style={{
            top: `${15 + i * 15}%`,
            left: '-20%',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)',
            boxShadow: '0 0 8px var(--accent)',
          }}
          animate={{
            left: ['-20%', '120%'],
          }}
          transition={{
            duration: 7 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Vibrant Orbs */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
        style={{ background: 'var(--accent)' }}
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-[150px] opacity-15"
        style={{ background: 'var(--accent-dim)' }}
      />
    </div>
  );
}

// ── ANIMATION ─────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: 'easeOut' as const,
    },
  }),
}

/**
 * TREE VERSION - Specifically for the Home Page
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <ExperienceBackground />
      <style>{`
        .timeline-card { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; }
        .timeline-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px var(--accent-dim); }
        .tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:var(--accent-dim); color:var(--accent); border:1px solid var(--accent-border); }
        
        @media (max-width: 768px) {
          .timeline-line { left: 24px !important; }
          .timeline-dot { left: 24px !important; }
          .timeline-content { width: 100% !important; padding-left: 60px !important; padding-right: 0 !important; text-align: left !important; }
          .timeline-row { flex-direction: column !important; align-items: flex-start !important; }
          .timeline-content-right { padding-left: 60px !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>Experience</p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            color: "var(--text-heading)"
          }}>
            My Professional <span style={{ color: "var(--accent)" }}>Timeline</span>
          </h2>
        </div>

        <div className="relative">
          <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-px" style={{
            background: "linear-gradient(to bottom, transparent, var(--accent) 15%, var(--accent) 85%, transparent)",
            transform: "translateX(-50%)",
            opacity: 0.2
          }} />

          <div className="space-y-24">
            {experiences.map((exp, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className="timeline-row relative flex items-center justify-between">
                  {/* Dot */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="timeline-dot absolute left-1/2 w-4 h-4 rounded-full border-2 z-10" 
                    style={{
                      transform: "translateX(-50%)",
                      background: "var(--bg-primary)",
                      borderColor: "var(--accent)",
                      boxShadow: "0 0 15px var(--accent-dim)"
                    }} 
                  />

                  {/* Left Content */}
                  <div className={`timeline-content w-[45%] ${isEven ? 'text-right pr-2' : 'opacity-0 pointer-events-none hidden md:block'}`}>
                    {isEven && (
                      <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="timeline-card p-8 rounded-3xl" 
                        style={{ background: "var(--bg-card)", border: "1px solid var(--card-border)" }}
                      >
                        <span className="text-xs font-bold mb-3 block" style={{ color: "var(--accent)" }}>{exp.year}</span>
                        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>{exp.role}</h3>
                        <p className="text-sm font-medium mb-4" style={{ color: "var(--accent)" }}>{exp.org}</p>
                        <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{exp.desc}</p>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {exp.tags?.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className={`timeline-content timeline-content-right w-[45%] ${!isEven ? 'text-left pl-2' : 'opacity-0 pointer-events-none hidden md:block'}`}>
                    {!isEven && (
                      <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="timeline-card p-8 rounded-3xl" 
                        style={{ background: "var(--bg-card)", border: "1px solid var(--card-border)" }}
                      >
                        <span className="text-xs font-bold mb-3 block" style={{ color: "var(--accent)" }}>{exp.year}</span>
                        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>{exp.role}</h3>
                        <p className="text-sm font-medium mb-4" style={{ color: "var(--accent)" }}>{exp.org}</p>
                        <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{exp.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.tags?.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 text-center">
            <Link href="/user/experience" className="text-sm font-bold tracking-widest uppercase transition-colors" style={{ color: "var(--accent)" }}>
                Explore Full Experience →
            </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * DETAIL VERSION - For /user/experience Page
 */
export default function PublicExperiencePage() {
  return (
    <div className="relative overflow-hidden" style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <ExperienceBackground />
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>Portfolio</p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1,
            color: "var(--text-heading)"
          }}>
            Experience <br />
            <span style={{ color: "var(--accent)" }}>Detail & Achievements</span>
          </h1>
          <p className="mt-8 text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
            A comprehensive list of my professional contributions, leadership roles, and technical achievements.
          </p>
        </div>

        {/* Detailed List (No Tree) */}
        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <div key={i} className="group p-8 md:p-12 rounded-[2rem] transition-all duration-300" 
                 style={{ background: "var(--bg-card)", border: "1px solid var(--card-border)" }}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>
                      {exp.year}
                    </span>
                    {exp.tags?.map((tag, j) => (
                      <span key={j} className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10" style={{ color: "var(--text-muted)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>{exp.role}</h2>
                  <p className="text-xl font-medium mb-8" style={{ color: "var(--accent)" }}>{exp.org}</p>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest mb-4 font-bold" style={{ color: "var(--text-muted)", opacity: 0.6 }}>About Role</h4>
                      <p className="text-lg leading-relaxed" style={{ color: "var(--text-primary)", opacity: 0.8 }}>{exp.desc}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest mb-4 font-bold" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Key Achievements</h4>
                      <ul className="space-y-3">
                        {exp.achievements?.map((ach, k) => (
                          <li key={k} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 p-12 rounded-[2.5rem] text-center relative overflow-hidden" 
             style={{ background: "var(--bg-secondary)", border: "1px solid var(--card-border)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ background: "var(--accent)", transform: "translate(30%, -30%)" }} />
          <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>Have a project in mind?</h3>
          <Link href="/user/contact" 
                className="inline-block px-10 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_var(--accent-dim)]"
                style={{ background: "var(--accent)", color: "var(--bg-primary)" }}>
            Let's Talk Together
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
