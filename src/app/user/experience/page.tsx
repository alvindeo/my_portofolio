'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { motion, type Variants } from "framer-motion";
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Experience {
  role: string;
  org: string;
  desc: string;
  year: string;
  tags?: string[];
  achievements?: string[];
}

interface DbExperience {
  id: string;
  company: string;
  role: string;
  description: string;
  period: string;
  tags: string;
  achievements: string;
}

// Helper: parse newline-separated string → array
function parseLines(s: string): string[] {
  return (s || '').split('\n').map(l => l.trim()).filter(Boolean)
}

function dbToExp(e: DbExperience): Experience {
  return {
    role: e.role, org: e.company, desc: e.description,
    year: e.period, tags: parseLines(e.tags), achievements: parseLines(e.achievements),
  }
}

// ── BACKGROUND EFFECTS ────────────────────────────────────────────────────────
function Sparkles() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-[var(--accent)]"
          style={{ width: Math.random() * 3 + 1 + 'px', height: Math.random() * 3 + 1 + 'px', top: Math.random() * 100 + '%', left: Math.random() * 100 + '%', boxShadow: '0 0 5px var(--accent)' }}
          animate={{ opacity: [0.1, 0.6, 0.1], scale: [1, 1.5, 1] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 5, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ExperienceBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
      <Sparkles />
      {[...Array(6)].map((_, i) => (
        <motion.div key={i} className="absolute h-[2px] w-64 opacity-30"
          style={{ top: `${15 + i * 15}%`, left: '-20%', background: 'linear-gradient(90deg, transparent, var(--accent), transparent)', boxShadow: '0 0 8px var(--accent)' }}
          animate={{ left: ['-20%', '120%'] }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, delay: i * 1.5, ease: "linear" }}
        />
      ))}
      <motion.div animate={{ x: [0, 80, 0], y: [0, 50, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[130px] opacity-20" style={{ background: 'var(--accent)' }} />
      <motion.div animate={{ x: [0, -80, 0], y: [0, 100, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full blur-[150px] opacity-15" style={{ background: 'var(--accent-dim)' }} />
    </div>
  );
}

// ── ANIMATION ─────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const } }),
}

// ── SKELETON ──────────────────────────────────────────────────────────────────
function ExperienceSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
      <div className="h-4 w-24 rounded-full mb-4" style={{ background: 'var(--bg-secondary)' }} />
      <div className="h-6 w-2/3 rounded-full mb-2" style={{ background: 'var(--bg-secondary)' }} />
      <div className="h-4 w-1/3 rounded-full mb-6" style={{ background: 'var(--bg-secondary)' }} />
      <div className="space-y-2">
        <div className="h-3 w-full rounded-full" style={{ background: 'var(--bg-secondary)' }} />
        <div className="h-3 w-4/5 rounded-full" style={{ background: 'var(--bg-secondary)' }} />
      </div>
    </div>
  );
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
function EmptyExperience() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <span className="text-6xl opacity-30">💼</span>
      <p className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>No experience yet</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Experience entries will appear here once added from the dashboard.</p>
    </div>
  );
}

// ── ACCORDION CARD (Mobile) ───────────────────────────────────────────────────
function AccordionExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  const [open, setOpen] = React.useState(false);
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index}
      className="rounded-2xl overflow-hidden border transition-all duration-300"
      style={{ background: "var(--bg-card)", borderColor: open ? "var(--accent-border)" : "var(--card-border)" }}
    >
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <div className="flex-1 min-w-0">
          <p className="text-base font-bold" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>{exp.role}</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--accent)" }}>{exp.org}</p>
          <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>{exp.year}</p>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: open ? "var(--accent-dim)" : "var(--bg-primary)", border: "1px solid var(--card-border)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </motion.div>
      </button>
      <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} transition={{ duration: 0.35, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
        <div className="px-5 pb-6 space-y-4 border-t" style={{ borderColor: "var(--card-border)" }}>
          {exp.tags && exp.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">{exp.tags.map((tag, j) => <span key={j} className="tag">{tag}</span>)}</div>
          )}
          <div>
            <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: "var(--text-muted)", opacity: 0.6 }}>About Role</p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)", opacity: 0.85 }}>{exp.desc}</p>
          </div>
          {exp.achievements && exp.achievements.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-bold mb-3" style={{ color: "var(--text-muted)", opacity: 0.6 }}>Key Achievements</p>
              <ul className="space-y-2">{exp.achievements.map((ach, k) => (
                <li key={k} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-muted)" }}>
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />{ach}
                </li>
              ))}</ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── SECTION (dipakai dari Home Page) ─────────────────────────────────────────
export function ExperienceSection() {
  const { data: dbItems = [], isLoading } = useSWR<DbExperience[]>('/api/experience', fetcher, {
    refreshInterval: 12000
  })
  const items = dbItems.slice(0, 2).map(dbToExp)

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
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, color: "var(--text-heading)" }}>
            My Professional <span style={{ color: "var(--accent)" }}>Timeline</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="space-y-6">{[0, 1].map(i => <ExperienceSkeleton key={i} />)}</div>
        ) : items.length === 0 ? (
          <EmptyExperience />
        ) : (
          <div className="relative">
            <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, var(--accent) 15%, var(--accent) 85%, transparent)", transform: "translateX(-50%)", opacity: 0.2 }} />
            <div className="space-y-24">
              {items.map((exp, i) => {
                const isEven = i % 2 === 0;
                return (
                  <div key={i} className="timeline-row relative flex items-center justify-between">
                    <motion.div initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: false }} transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="timeline-dot absolute left-1/2 w-4 h-4 rounded-full border-2 z-10"
                      style={{ transform: "translateX(-50%)", background: "var(--bg-primary)", borderColor: "var(--accent)", boxShadow: "0 0 15px var(--accent-dim)" }} />
                    <div className={`timeline-content w-[45%] ${isEven ? 'text-right pr-2' : 'opacity-0 pointer-events-none hidden md:block'}`}>
                      {isEven && (
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.8, ease: "easeOut" }}
                          className="timeline-card p-8 rounded-3xl" style={{ background: "var(--bg-card)", border: "1px solid var(--card-border)" }}>
                          <span className="text-xs font-bold mb-3 block" style={{ color: "var(--accent)" }}>{exp.year}</span>
                          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>{exp.role}</h3>
                          <p className="text-sm font-medium mb-4" style={{ color: "var(--accent)" }}>{exp.org}</p>
                          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{exp.desc}</p>
                          <div className="flex flex-wrap gap-2 justify-end">{exp.tags?.map((tag, j) => <span key={j} className="tag">{tag}</span>)}</div>
                        </motion.div>
                      )}
                    </div>
                    <div className={`timeline-content timeline-content-right w-[45%] ${!isEven ? 'text-left pl-2' : 'opacity-0 pointer-events-none hidden md:block'}`}>
                      {!isEven && (
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}
                          className="timeline-card p-8 rounded-3xl" style={{ background: "var(--bg-card)", border: "1px solid var(--card-border)" }}>
                          <span className="text-xs font-bold mb-3 block" style={{ color: "var(--accent)" }}>{exp.year}</span>
                          <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>{exp.role}</h3>
                          <p className="text-sm font-medium mb-4" style={{ color: "var(--accent)" }}>{exp.org}</p>
                          <p className="text-base leading-relaxed mb-6" style={{ color: "var(--text-muted)" }}>{exp.desc}</p>
                          <div className="flex flex-wrap gap-2">{exp.tags?.map((tag, j) => <span key={j} className="tag">{tag}</span>)}</div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link href="/user/experience" className="text-sm font-bold tracking-widest uppercase transition-colors" style={{ color: "var(--accent)" }}>
            Explore Full Experience →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── FULL PAGE ─────────────────────────────────────────────────────────────────
export default function PublicExperiencePage() {
  const { data: dbItems = [], isLoading } = useSWR<DbExperience[]>('/api/experience', fetcher, {
    refreshInterval: 12000
  })
  const items = dbItems.map(dbToExp)

  return (
    <div className="relative overflow-hidden" style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <ExperienceBackground />
      <style>{`.tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:var(--accent-dim); color:var(--accent); border:1px solid var(--accent-border); }`}</style>
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="mb-20">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>Portfolio</p>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, lineHeight: 1, color: "var(--text-heading)" }}>
            Experience <br /><span style={{ color: "var(--accent)" }}>Detail &amp; Achievements</span>
          </h1>
          <p className="mt-8 text-lg max-w-2xl" style={{ color: "var(--text-muted)" }}>
            A comprehensive list of my professional contributions, leadership roles, and technical achievements.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">{[0, 1, 2].map(i => <ExperienceSkeleton key={i} />)}</div>
        ) : items.length === 0 ? (
          <EmptyExperience />
        ) : (
          <div className="space-y-4 md:space-y-12">
            {/* Mobile: accordion */}
            <div className="md:hidden space-y-3">
              {items.map((exp, i) => <AccordionExperienceCard key={i} exp={exp} index={i} />)}
            </div>
            {/* Desktop: full cards */}
            <div className="hidden md:block space-y-12">
              {items.map((exp, i) => (
                <div key={i} className="group p-8 md:p-12 rounded-[2rem] transition-all duration-300" style={{ background: "var(--bg-card)", border: "1px solid var(--card-border)" }}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-3 mb-6">
                        <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "var(--accent-dim)", color: "var(--accent)" }}>{exp.year}</span>
                        {exp.tags?.map((tag, j) => (
                          <span key={j} className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10" style={{ color: "var(--text-muted)" }}>{tag}</span>
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
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />{ach}
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
          </div>
        )}

        {/* CTA */}
        <div className="mt-32 p-12 rounded-[2.5rem] text-center relative overflow-hidden" style={{ background: "var(--bg-secondary)", border: "1px solid var(--card-border)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ background: "var(--accent)", transform: "translate(30%, -30%)" }} />
          <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif", color: "var(--text-heading)" }}>Have a project in mind?</h3>
          <Link href="/#contact" className="inline-block px-10 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_var(--accent-dim)]" style={{ background: "var(--accent)", color: "var(--bg-primary)" }}>
            Let&apos;s Talk Together
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
