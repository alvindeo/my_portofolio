'use client'

import React, { useState } from "react";
import { Navbar } from "@/components/user/Navbar";
import { motion, type Variants } from "framer-motion";
import { SafeStackIcon } from "@/components/ui/SafeStackIcon";
import Footer from "@/components/user/Footer";
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// ── TYPES ──────────────────────────────────────────────────────────────────
interface AboutData {
  name: string;
  title?: string;
  bio?: string;
  bio2?: string;
  bio3?: string;
  bio4?: string;
  photoUrl?: string;
  github?: string;
  linkedin?: string;
}

interface SkillData {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

interface EducationData {
  id: string;
  degree: string;
  institution: string;
  period: string;
  description: string;
  gpa?: string;
  imageUrl?: string;
  location?: string;
}

interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  year: string;
  imageUrl?: string;
  url?: string;
}

// ── ANIMATION ─────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0, 1] }
  }),
};

// ── SECTION (dipakai dari home page) ─────────────────────────────────────────
export function AboutSection() {
  const { data: about } = useSWR<AboutData>('/api/about', fetcher)
  
  const bio = about?.bio || "Loading bio..."
  const photoUrl = about?.photoUrl || "/alvin.jpg"

  return (
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-6 font-bold" style={{ color: "var(--accent)" }}>About Me</p>
        <h2 className="mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.1, color: "var(--text-heading)" }}>
          I craft <span style={{ color: "var(--accent)" }}>digital</span> experiences.
        </h2>
        <div className="space-y-6 text-lg leading-relaxed mb-10" style={{ color: "var(--text-muted)" }}>
          <p>{bio}</p>
        </div>
        <Link href="/user/about" className="inline-flex items-center gap-2 group text-sm font-bold uppercase tracking-widest border-b-2 py-1 transition-all hover:opacity-70" style={{ borderColor: 'var(--accent)', color: 'var(--text-heading)' }}>
          Read Full Story <span className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
        <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-700 shadow-2xl" style={{ border: '8px solid var(--bg-card)' }}>
          <img src={photoUrl} alt="Alvin Deo" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </div>
      </motion.div>
    </div>
  )
}

// ── PAGE ─────────────────────────────────────────────────────────────
export default function AboutPage() {
  // SWR for Real-time data sync (12s interval)
  const { data: about } = useSWR<AboutData>('/api/about', fetcher)
  const { data: skillList = [], isLoading: skillLoading } = useSWR<SkillData[]>('/api/skills', fetcher, { refreshInterval: 12000 })
  const { data: eduList = [], isLoading: eduLoading } = useSWR<EducationData[]>('/api/education', fetcher, { refreshInterval: 12000 })
  const { data: certList = [], isLoading: certLoading } = useSWR<CertificationData[]>('/api/certificates', fetcher, { refreshInterval: 12000 })

  const loading = skillLoading || eduLoading || certLoading

  const bioParagraphs = [
    about?.bio,
    about?.bio2,
    about?.bio3,
    about?.bio4
  ].filter(Boolean) as string[]

  const displayEdu = eduList
  const displayCert = certList

  // Group real skills by category
  const groupedSkills: Record<string, SkillData[]> = {}
  skillList.forEach(s => { groupedSkills[s.category] = [...(groupedSkills[s.category] ?? []), s] })
  const displaySkillGroups = Object.entries(groupedSkills).map(([cat, sks]) => ({ category: cat, skills: sks.map(s => ({ name: s.name, icon: s.icon })) }))

  const github = about?.github ?? 'https://github.com/alvindeo'
  const linkedin = about?.linkedin ?? 'https://www.linkedin.com/in/alvin-deo-ardiansyah-04b7602b4/'

  return (
    <div className="relative overflow-hidden" style={{ background: "var(--bg-primary)", color: "var(--text-primary)", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`.tag { display:inline-block; padding:2px 12px; border-radius:999px; font-size:12px; font-weight:600; background:var(--accent-dim); color:var(--accent); border:1px solid var(--accent-border); }`}</style>
      <Navbar />

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* ── HERO SECTION ── */}
          <section className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <p className="text-xs tracking-[0.3em] uppercase mb-6 font-bold" style={{ color: "var(--accent)" }}>About Me</p>
              <h1 className="mb-8" style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.5rem, 8vw, 4.5rem)", fontWeight: 800, lineHeight: 1, color: "var(--text-heading)" }}>
                I craft <span style={{ color: "var(--accent)" }}>digital</span> experiences.
              </h1>
              <div className="space-y-6 text-lg leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {bioParagraphs.length > 0 ? bioParagraphs.map((p, i) => <p key={i}>{p}</p>) : <p>Loading bio...</p>}
              </div>
              <div className="flex gap-6 mt-12">
                <a href={github} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest border-b-2 transition-all hover:opacity-70" style={{ borderColor: 'var(--accent)', color: 'var(--text-heading)' }}>Github</a>
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-bold uppercase tracking-widest border-b-2 transition-all hover:opacity-70" style={{ borderColor: 'var(--accent)', color: 'var(--text-heading)' }}>LinkedIn</a>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={2} className="relative">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden rotate-2 transition-transform hover:rotate-0 duration-700" style={{ border: '8px solid var(--bg-card)', boxShadow: '40px 40px 80px rgba(0,0,0,0.3)' }}>
                <img src={about?.photoUrl || "/alvin.jpg"} alt="Alvin Deo" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-3xl p-6 flex flex-col justify-end" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                <span className="text-4xl font-bold mb-2">1+</span>
                <span className="text-xs font-bold uppercase tracking-widest leading-tight">Years of Experience</span>
              </div>
            </motion.div>
          </section>

          {/* ── SKILLS ── */}
          <section className="mb-32">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Skills</p>
            <h2 className="mb-14" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Technologies I work with</h2>
            {loading ? (
              <div className="grid md:grid-cols-2 gap-12">
                {[0,1,2,3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-3 w-24 rounded-full mb-6" style={{ background: 'var(--bg-secondary)' }} />
                    <div className="flex flex-wrap gap-4">
                      {[0,1,2,3].map(j => <div key={j} className="w-24 h-28 rounded-2xl" style={{ background: 'var(--bg-secondary)' }} />)}
                    </div>
                  </div>
                ))}
              </div>
            ) : displaySkillGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <span className="text-5xl opacity-30">⚡</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No skills yet. Add them from dashboard.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-12">
                {displaySkillGroups.map((group, gi) => (
                  <div key={gi}>
                    <div className="flex items-center gap-4 mb-6"><span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>{group.category}</span><div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} /></div>
                    <div className="flex flex-wrap gap-4">
                      {group.skills.map((skill, si) => (
                        <motion.div key={si} custom={si} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default w-24 border transition-all hover:translate-y-[-4px]" style={{ background: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
                          <div className="w-10 h-10 flex items-center justify-center">
                            {skill.icon ? <SafeStackIcon name={skill.icon} className="w-10 h-10" /> : <div className="text-[10px] opacity-20">N/A</div>}
                          </div>
                          <span className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--text-muted)' }}>{skill.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── EDUCATION ── */}
          <section className="mb-32">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Education</p>
            <h2 className="mb-12" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Academic background</h2>
            {eduLoading ? (
              <div className="space-y-6">{[0,1].map(i => <div key={i} className="h-48 rounded-2xl animate-pulse" style={{ background: 'var(--bg-card)' }} />)}</div>
            ) : displayEdu.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <span className="text-5xl opacity-30">🎓</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No education records yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {displayEdu.map((edu, i) => (
                  <motion.div key={edu.id || i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-2xl overflow-hidden border transition-all hover:border-[var(--accent-border)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
                    <div className="flex flex-col md:flex-row">
                      <div className="flex items-center justify-center p-8 shrink-0" style={{ minWidth: '240px', background: 'var(--bg-skills)', borderRight: '1px solid var(--card-border)', minHeight: '200px' }}>
                        {edu.imageUrl ? <img src={edu.imageUrl} alt={edu.institution} className="max-h-28 max-w-[200px] object-contain" /> : <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>🎓</div>}
                      </div>
                      <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                        <div>
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="tag">{edu.period}</span>
                            {edu.location && <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>{edu.location}</span>}
                          </div>
                          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{edu.degree}</h3>
                          <p className="text-base font-semibold mb-3" style={{ color: 'var(--accent)' }}>{edu.institution}</p>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{edu.description}</p>
                        </div>
                        {edu.gpa && <div className="flex items-center gap-3"><div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}><svg width="13" height="13" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>GPA {edu.gpa}</span></div></div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* ── CERTIFICATIONS ── */}
          <section className="mb-32">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Certifications</p>
            <h2 className="mb-12" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Credentials & achievements</h2>
            {certLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{[0,1,2].map(i => <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: 'var(--bg-card)' }} />)}</div>
            ) : displayCert.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <span className="text-5xl opacity-30">🏆</span>
                <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No certificates yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayCert.map((cert, i) => (
                  <motion.a key={cert.id || i} href={cert.url || '#'} target="_blank" rel="noopener noreferrer" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -8 }} className="group block rounded-2xl overflow-hidden cursor-pointer border" style={{ background: 'var(--bg-card)', borderColor: 'var(--card-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <div className="relative w-full overflow-hidden" style={{ height: '180px', background: 'var(--bg-secondary)' }}>
                      {cert.imageUrl ? <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}><svg width="40" height="40" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>}
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>{cert.year}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:underline transition-all" style={{ color: 'var(--text-heading)' }}>{cert.title}</h3>
                      <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{cert.issuer}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </section>

          {/* ── CALL TO ACTION ── */}
          <section className="p-12 md:p-20 rounded-[3rem] text-center relative overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] opacity-10" style={{ background: 'var(--accent)', transform: 'translate(40%, -40%)' }} />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>Interested in working together?</h2>
              <p className="text-lg max-w-xl mx-auto mb-12" style={{ color: "var(--text-muted)" }}>I'm always open to new opportunities, collaborations, or just a friendly chat about design and tech.</p>
              <a href="/#contact" className="inline-block px-10 py-5 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.2)]" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>Get In Touch</a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
