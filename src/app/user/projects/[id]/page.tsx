'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Navbar } from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import StackIcon from 'tech-stack-icons'
import { projectsData } from '@/data/projects'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

// Normalise DB project → same shape as ProjectDetail
interface ProjectDetail {
  id: string | number
  title: string
  tagline: string
  image: string
  tags: string[]
  year: string
  liveUrl: string | null
  githubUrl: string | null
  fullDescription: string
  highlights: string[]
  challenges: string
  outcome: string
  techStack: { name: string; icon: string }[]
}

function Skeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
    </div>
  )
}

export default function ProjectCaseStudy() {
  const { id } = useParams()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [next, setNext]       = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      // 1. Try fetch from DB first
      const res = await fetch(`/api/projects/${id}`).catch(() => null)
      if (res?.ok) {
        const db = await res.json()
        const mapped: ProjectDetail = {
          id:              db.id,
          title:           db.title,
          tagline:         db.tagline         ?? '',
          image:           db.imageUrl        ?? '',
          tags:            db.tags            ?? [],
          year:            db.year            ?? '',
          liveUrl:         db.liveUrl,
          githubUrl:       db.githubUrl,
          fullDescription: db.fullDescription ?? db.description ?? '',
          highlights:      db.highlights      ?? [],
          challenges:      db.challenges      ?? '',
          outcome:         db.outcome         ?? '',
          techStack:       (db.techStack as string[]).map((name: string, i: number) => ({
            name,
            icon: (db.techIcons as string[])[i] ?? name.toLowerCase().replace(/\s+/g, ''),
          })),
        }
        setProject(mapped)

        // Load next: get all projects and find next
        const allRes = await fetch('/api/projects').catch(() => null)
        if (allRes?.ok) {
          const all: typeof db[] = await allRes.json()
          const idx = all.findIndex((p: typeof db) => p.id === db.id)
          const nxt = all[(idx + 1) % all.length]
          if (nxt && nxt.id !== db.id) {
            setNext({
              id: nxt.id, title: nxt.title,
              tagline: nxt.tagline ?? '', image: nxt.imageUrl ?? '',
              tags: nxt.tags ?? [], year: nxt.year ?? '',
              liveUrl: nxt.liveUrl, githubUrl: nxt.githubUrl,
              fullDescription: '', highlights: [], challenges: '', outcome: '',
              techStack: [],
            })
          }
        }
        setLoading(false)
        return
      }

      // 2. Fallback: try static data (numeric id)
      const staticP = projectsData.find((p) => p.id === Number(id))
      if (staticP) {
        setProject({
          id:              staticP.id,
          title:           staticP.title,
          tagline:         staticP.tagline,
          image:           staticP.image,
          tags:            staticP.tags,
          year:            staticP.year,
          liveUrl:         staticP.liveUrl,
          githubUrl:       staticP.githubUrl,
          fullDescription: staticP.fullDescription,
          highlights:      staticP.highlights,
          challenges:      staticP.challenges,
          outcome:         staticP.outcome,
          techStack:       staticP.techStack,
        })
        const nxtStatic = projectsData.find((p) => p.id === staticP.id + 1) ?? projectsData[0]
        setNext({
          id: nxtStatic.id, title: nxtStatic.title,
          tagline: nxtStatic.tagline, image: nxtStatic.image,
          tags: nxtStatic.tags, year: nxtStatic.year,
          liveUrl: nxtStatic.liveUrl, githubUrl: nxtStatic.githubUrl,
          fullDescription: '', highlights: [], challenges: '', outcome: '',
          techStack: nxtStatic.techStack,
        })
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <Skeleton />

  if (notFound || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Navbar />
        <div className="text-center mt-20">
          <p className="text-6xl font-bold mb-4" style={{ color: 'var(--accent)' }}>404</p>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-heading)' }}>Project not found</h1>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The project you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/user/projects" className="px-6 py-3 rounded-full font-semibold text-sm"
            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
            ← Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .tag { display:inline-block; padding:3px 12px; border-radius:999px; font-size:11px; font-weight:500; background:var(--accent-dim); color:var(--accent); border:1px solid var(--accent-border); }
      `}</style>

      <Navbar />

      {/* ── HERO BANNER ───────────────────────────────────────── */}
      <section className="relative pt-28 pb-0 overflow-hidden">
        <div className="absolute inset-0 -z-0">
          {project.image && (
            <div className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${project.image}')`, opacity: 0.15 }} />
          )}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, var(--bg-primary) 0%, transparent 40%, var(--bg-primary) 100%)' }} />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/user/projects" className="inline-flex items-center gap-2 text-sm mb-8 transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Projects
            </Link>
          </motion.div>

          {/* Tags + year */}
          <motion.div className="flex flex-wrap gap-2 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            {project.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
            {project.year && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
                {project.year}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 800, lineHeight: 1.05, color: 'var(--text-heading)' }}>
            {project.title}
          </motion.h1>

          {/* Tagline */}
          {project.tagline && (
            <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="mt-4 text-lg max-w-2xl" style={{ color: 'var(--text-muted)' }}>
              {project.tagline}
            </motion.p>
          )}

          {/* Buttons */}
          <motion.div className="flex flex-wrap gap-3 mt-8 mb-16" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95 border"
                style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--card-border)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
                Live Demo
              </a>
            )}
          </motion.div>
        </div>

        {/* Hero image */}
        {project.image && (
          <motion.div className="max-w-6xl mx-auto px-6 relative z-10" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="w-full h-[300px] md:h-[460px] rounded-2xl overflow-hidden" style={{ border: '1px solid var(--card-border)' }}>
              <img src={project.image} alt={project.title} className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  const p = el.parentElement
                  if (p) { p.style.background = 'var(--bg-card)'; p.style.display = 'flex'; p.style.alignItems = 'center'; p.style.justifyContent = 'center'; p.innerHTML = '<span style="font-size:5rem;opacity:0.2">🖥</span>' }
                }} />
            </div>
          </motion.div>
        )}
      </section>

      {/* ── CONTENT ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Left — Main content */}
          <div className="md:col-span-2 space-y-16">
            {/* Overview */}
            {project.fullDescription && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--accent)' }}>Overview</h2>
                <p className="text-lg leading-relaxed" style={{ color: 'var(--text-primary)', opacity: 0.85 }}>{project.fullDescription}</p>
              </motion.div>
            )}

            {/* Highlights */}
            {project.highlights.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-6" style={{ color: 'var(--accent)' }}>Key Highlights</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {project.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
                      <div className="mt-1 w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{h}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--accent)' }}>Challenges & Solutions</h2>
                <div className="p-6 rounded-xl border-l-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)', borderLeftColor: 'var(--accent)', borderLeftWidth: '4px' }}>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{project.challenges}</p>
                </div>
              </motion.div>
            )}

            {/* Outcome */}
            {project.outcome && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--accent)' }}>Outcome</h2>
                <div className="p-6 rounded-xl" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-heading)' }}>{project.outcome}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right — Sidebar */}
          <div className="space-y-8">
            {/* Tech Stack */}
            {project.techStack.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
                <h2 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--accent)' }}>Tech Stack</h2>
                <div className="space-y-3">
                  {project.techStack.map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl transition-all"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center p-1.5 shrink-0"
                        style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                        <StackIcon name={tech.icon} className="w-full h-full" />
                      </div>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Project Info */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
              <h2 className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--accent)' }}>Project Info</h2>
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--card-border)' }}>
                {[
                  { label: 'Year',     value: project.year || '—' },
                  { label: 'Category', value: project.tags.join(', ') || '—' },
                  { label: 'Status',   value: project.liveUrl ? 'Live' : 'Development' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center px-4 py-3 border-b last:border-b-0"
                    style={{ background: 'var(--bg-card)', borderColor: 'var(--card-border)' }}>
                    <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Links */}
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2} className="space-y-3">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 border"
                  style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', borderColor: 'var(--card-border)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                  </svg>
                  GitHub Repository
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Live Demo
                </a>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── NEXT PROJECT ── */}
        {next && (
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-24">
            <p className="text-xs uppercase tracking-widest font-bold mb-6 text-center" style={{ color: 'var(--text-muted)' }}>Next Project</p>
            <Link href={`/user/projects/${next.id}`}>
              <div className="group p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center gap-8 transition-all duration-300 hover:-translate-y-1"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden shrink-0" style={{ background: 'var(--bg-secondary)' }}>
                  {next.image && (
                    <img src={next.image} alt={next.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {next.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{next.title}</h3>
                  {next.tagline && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{next.tagline}</p>}
                </div>
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all group-hover:bg-[var(--accent)] group-hover:text-[var(--bg-primary)]"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--card-border)', color: 'var(--accent)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
