'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Folder, 
  Zap, 
  Briefcase, 
  GraduationCap, 
  User, 
  Globe, 
  ArrowRight, 
  Star,
  LayoutDashboard,
  ExternalLink
} from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Spinner, tok } from '@/components/dashboard/ui'

// ── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon: Icon, href, color, index }: {
  label: string; value: number | string; sub: string; icon: any; href: string; color: string; index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={href}>
        <div
          className="p-5 rounded-2xl border flex items-start justify-between gap-4 transition-all hover:shadow-lg hover:shadow-black/5 cursor-pointer group relative overflow-hidden"
          style={{ background: tok.card, borderColor: tok.border }}
        >
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: tok.muted }}>{label}</p>
            <p className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: tok.heading }}>{value}</p>
            <p className="text-[11px] mt-1.5 opacity-70" style={{ color: tok.muted }}>{sub}</p>
          </div>
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3" 
            style={{ background: color + '15', color: color }}
          >
            <Icon size={20} strokeWidth={2.5} />
          </div>
          
          {/* Subtle background glow */}
          <div 
            className="absolute -right-4 -bottom-4 w-24 h-24 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{ background: color }}
          />
        </div>
      </Link>
    </motion.div>
  )
}

// ── Recent activity row ─────────────────────────────────────────────────────
function Row({ label, sub, badge, href, index }: { label: string; sub: string; badge?: string; href: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
    >
      <Link href={href}>
        <div
          className="flex items-center justify-between gap-3 py-3.5 px-4 rounded-xl transition-all hover:bg-white/[0.03] group border border-transparent hover:border-white/[0.05]"
        >
          <div className="min-w-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: tok.bg, border: `1px solid ${tok.border}` }}>
              <Folder size={14} style={{ color: tok.muted }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate group-hover:text-white transition-colors" style={{ color: tok.heading }}>{label}</p>
              <p className="text-[11px] truncate opacity-60" style={{ color: tok.muted }}>{sub}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {badge && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ background: tok.accentDim + '44', color: tok.accent, border: `1px solid ${tok.accentBor}33` }}>
                <Star size={10} fill="currentColor" />
                {badge.replace('★ ', '')}
              </span>
            )}
            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: tok.accent }} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Nav shortcut ─────────────────────────────────────────────────────────────
function Shortcut({ icon: Icon, label, href, index }: { icon: any; label: string; href: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
    >
      <Link href={href}>
        <div
          className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all hover:border-white/20 hover:bg-white/[0.02] group cursor-pointer"
          style={{ background: tok.card, borderColor: tok.border }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-white/[0.05]" style={{ background: tok.bg }}>
            <Icon size={20} className="transition-colors group-hover:text-white" style={{ color: tok.muted }} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider transition-colors group-hover:text-white" style={{ color: tok.muted }}>{label}</span>
        </div>
      </Link>
    </motion.div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experience: 0, education: 0 })
  const [projects, setProjects] = useState<{ id: string; title: string; featured: boolean; techStack: string[] }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/projects').then((r) => r.json()),
      fetch('/api/skills').then((r) => r.json()),
      fetch('/api/experience').then((r) => r.json()),
      fetch('/api/education').then((r) => r.json()),
    ]).then(([p, s, e, ed]) => {
      setStats({ projects: p.length, skills: s.length, experience: e.length, education: ed.length })
      setProjects(p.slice(0, 5))
      setLoading(false)
    })
  }, [])

  return (
    <DashboardShell title="Overview" breadcrumb={['Dashboard', 'Overview']}>
      <div className="space-y-7">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: tok.heading }}>
            Dashboard Overview
          </h1>
          <p className="text-sm mt-1" style={{ color: tok.muted }}>
            Welcome back! Here&apos;s a summary of your portfolio content.
          </p>
        </div>

        {/* KPI cards */}
        {loading ? <Spinner /> : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard index={0} label="Projects"   value={stats.projects}   sub="in database"         icon={Folder} href="/dashboard/projects"   color="#00ADB5" />
            <KpiCard index={1} label="Skills"     value={stats.skills}     sub="across all stacks"    icon={Zap} href="/dashboard/skills"     color="#8b5cf6" />
            <KpiCard index={2} label="Experience" value={stats.experience} sub="work experiences"     icon={Briefcase} href="/dashboard/experience" color="#f59e0b" />
            <KpiCard index={3} label="Education"  value={stats.education}  sub="academic records"     icon={GraduationCap} href="/dashboard/education"  color="#10b981" />
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-3 rounded-2xl border p-6 space-y-4" style={{ background: tok.card, borderColor: tok.border }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <LayoutDashboard size={18} style={{ color: tok.accent }} />
                <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: tok.heading }}>Recent Projects</h2>
              </div>
              <Link href="/dashboard/projects" className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-70 transition-opacity" style={{ color: tok.accent }}>
                View all <ArrowRight size={12} />
              </Link>
            </div>
            
            <div className="space-y-1">
              {loading ? <Spinner /> : projects.length === 0 ? (
                <div className="py-12 text-center" style={{ color: tok.muted }}>
                  <Folder className="mx-auto mb-3 opacity-20" size={40} />
                  <p className="text-sm font-medium">No projects yet.</p>
                </div>
              ) : (
                projects.map((p, i) => (
                  <Row
                    key={p.id}
                    index={i}
                    label={p.title}
                    sub={p.techStack.slice(0, 3).join(' · ')}
                    badge={p.featured ? '★ Featured' : undefined}
                    href="/dashboard/projects"
                  />
                ))
              )}
            </div>
          </div>

          {/* Quick shortcuts */}
          <div className="lg:col-span-2 rounded-2xl border p-6" style={{ background: tok.card, borderColor: tok.border }}>
            <div className="flex items-center gap-2 mb-6">
              <Zap size={18} style={{ color: tok.accent }} />
              <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: tok.heading }}>Quick Actions</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Shortcut index={0} icon={Folder} label="Projects"   href="/dashboard/projects"   />
              <Shortcut index={1} icon={Zap} label="Skills"     href="/dashboard/skills"     />
              <Shortcut index={2} icon={Briefcase} label="Experience" href="/dashboard/experience" />
              <Shortcut index={3} icon={GraduationCap} label="Education"  href="/dashboard/education"  />
              <Shortcut index={4} icon={User} label="About"      href="/dashboard/about"      />
              <Shortcut index={5} icon={Globe} label="View Site"  href="/"                     />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-2xl border p-6" style={{ background: tok.card, borderColor: tok.border }}
        >
          <div className="flex items-center gap-2 mb-6">
            <ExternalLink size={18} style={{ color: tok.accent }} />
            <h2 className="text-sm font-black uppercase tracking-widest" style={{ color: tok.heading }}>Content Completion</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              { label: 'Projects',   val: stats.projects,   max: 10, color: '#00ADB5' },
              { label: 'Skills',     val: stats.skills,     max: 20, color: '#8b5cf6' },
              { label: 'Experience', val: stats.experience, max: 5,  color: '#f59e0b' },
              { label: 'Education',  val: stats.education,  max: 3,  color: '#10b981' },
            ].map((item) => {
              const pct = Math.min(100, Math.round((item.val / item.max) * 100))
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tok.muted }}>{item.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.val}/{item.max} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: tok.bg, border: `1px solid ${tok.border}` }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'circOut', delay: 0.6 }}
                      className="h-full rounded-full" 
                      style={{ background: item.color }} 
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  )
}
