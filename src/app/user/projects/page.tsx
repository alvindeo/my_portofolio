'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import Link from 'next/link'
import { motion, type Variants, AnimatePresence } from 'framer-motion'
import { SafeStackIcon } from "@/components/ui/SafeStackIcon";
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// ── TYPES ─────────────────────────────────────────────────────────────────────
interface Project {
  id: string
  title: string
  description: string
  imageUrl?: string | null
  techStack?: string[]
  tags?: string[]
  liveUrl?: string | null
  githubUrl?: string | null
  featured?: boolean
}

// ── ANIMATION ─────────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
}

// ── EMPTY STATE ───────────────────────────────────────────────────────────────
function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center gap-4">
      <span className="text-6xl opacity-30">🚀</span>
      <p className="text-lg font-semibold" style={{ color: 'var(--text-heading)' }}>
        No projects yet
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Projects will appear here once added from the dashboard.
      </p>
    </div>
  )
}

// ── SKELETON ──────────────────────────────────────────────────────────────────
function ProjectSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
      <div className="h-48" style={{ background: 'var(--bg-secondary)' }} />
      <div className="p-6 space-y-3">
        <div className="h-3 w-1/3 rounded-full" style={{ background: 'var(--bg-secondary)' }} />
        <div className="h-5 w-2/3 rounded-full" style={{ background: 'var(--bg-secondary)' }} />
        <div className="h-3 w-full rounded-full" style={{ background: 'var(--bg-secondary)' }} />
        <div className="h-3 w-4/5 rounded-full" style={{ background: 'var(--bg-secondary)' }} />
      </div>
    </div>
  )
}

// ── FEATURED SECTION (dipakai dari home page) ─────────────────────────────────
export function ProjectsSection() {
  const { data: projects = [], isLoading } = useSWR<Project[]>('/api/projects', fetcher, {
    refreshInterval: 10000,
  })

  const featured = projects.filter((p) => p.featured).slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 relative overflow-hidden">
      <div className="flex items-end justify-between mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>Projects</p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--text-heading)" }}>Featured work</h2>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <Link href="/user/projects" className="text-sm font-medium transition-colors hover:opacity-80 flex items-center gap-2" style={{ color: "var(--accent)" }}>View all projects <span>→</span></Link>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0,1,2].map(i => <ProjectSkeleton key={i} />)}
        </div>
      ) : featured.length === 0 ? (
        <EmptyProjects />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((project, i) => (
            <motion.div key={project.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -10 }}
              className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
            >
              <div className="relative w-full h-56 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                {project.imageUrl && (
                  <motion.img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden' }} />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase">View Detail</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center -z-10"><span className="text-5xl opacity-20">🖥</span></div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex flex-wrap gap-2">{(project.techStack ?? []).map((tag, j) => (<span key={j} className="tag">{tag}</span>))}</div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{project.title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                  <Link href={`/user/projects/${project.id}`} style={{ color: 'var(--accent)' }} className="text-sm font-semibold">View Detail →</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── FULL PAGE ─────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')

  const { data: projects = [], isLoading } = useSWR<Project[]>('/api/projects', fetcher, {
    refreshInterval: 10000, // Sync setiap 10 detik agar pengunjung melihat info terbaru
  })

  // Build tag list dynamically from DB data
  const allTags = ['All', ...Array.from(new Set(projects.flatMap((p) => p.techStack ?? [])))]

  const filtered = projects.filter((p) => {
    const title = p.title || ''
    const desc = p.description || ''
    const tags = p.techStack ?? []
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === 'All' || tags.includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .tag { display:inline-block; padding:3px 12px; border-radius:999px; font-size:11px; font-weight:500; background:var(--accent-dim); color:var(--accent); border:1px solid var(--accent-border); }
        .project-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .project-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.2 }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>Projects</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, color: 'var(--text-heading)' }}>Things I&apos;ve <br /> <span style={{ color: 'var(--accent)' }}>built &amp; shipped</span></motion.h1>
        </div>
      </section>

      {/* ── FILTER ── */}
      {!isLoading && projects.length > 0 && (
        <section className="pb-10 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header content: tags, search, dll */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <div className="flex flex-wrap gap-2">
                {!isLoading && allTags.map((tag) => (
                  <button key={tag} onClick={() => setActiveTag(tag)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${activeTag === tag ? "bg-white text-black scale-105" : "bg-white/5 text-white/50 hover:bg-white/10"}`}>
                    {tag}
                  </button>
                ))}
              </div>
              <div className="relative group w-full md:w-80">
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search project name..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none focus:border-[var(--accent)] transition-all" />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within:opacity-100 transition-opacity" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── GRID ── */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[0,1,2,3,4,5].map(i => <ProjectSkeleton key={i} />)}
            </div>
          ) : projects.length === 0 ? (
            <EmptyProjects />
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No projects match your search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((project, i) => (
                <motion.div key={project.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="project-card rounded-2xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
                  <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                    {!project.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-5xl opacity-20">🖥</span></div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex flex-wrap gap-2">{(project.techStack ?? []).map((tag, j) => (<span key={j} className="tag">{tag}</span>))}</div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{project.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                    <div className="flex items-center justify-between pt-4 mt-auto border-t" style={{ borderColor: 'var(--card-border)' }}>
                      <Link href={`/user/projects/${project.id}`} className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>View Detail →</Link>
                      <div className="flex gap-2">
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform"><svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg></a>}
                        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform" style={{ color: 'var(--accent)' }}><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
