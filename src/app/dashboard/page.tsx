'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { Spinner, tok } from '@/components/dashboard/ui'

// ── KPI Card ────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, icon, href, color }: {
  label: string; value: number | string; sub: string; icon: string; href: string; color: string
}) {
  return (
    <Link href={href}>
      <div
        className="p-5 rounded-2xl border flex items-start justify-between gap-4 transition-all hover:-translate-y-0.5 cursor-pointer group"
        style={{ background: tok.card, borderColor: tok.border }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: tok.muted }}>{label}</p>
          <p className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: tok.heading }}>{value}</p>
          <p className="text-xs mt-1.5" style={{ color: tok.muted }}>{sub}</p>
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: color + '22' }}>
          {icon}
        </div>
      </div>
    </Link>
  )
}

// ── Recent activity row ─────────────────────────────────────────────────────
function Row({ label, sub, badge, href }: { label: string; sub: string; badge?: string; href: string }) {
  return (
    <Link href={href}>
      <div
        className="flex items-center justify-between gap-3 py-3 px-4 rounded-xl transition-all hover:opacity-80 cursor-pointer"
        style={{ background: tok.bg }}
      >
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: tok.heading }}>{label}</p>
          <p className="text-xs truncate" style={{ color: tok.muted }}>{sub}</p>
        </div>
        {badge && (
          <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: tok.accentDim, color: tok.accent, border: `1px solid ${tok.accentBor}` }}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  )
}

// ── Nav shortcut ─────────────────────────────────────────────────────────────
function Shortcut({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <Link href={href}>
      <div
        className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border text-center transition-all hover:-translate-y-0.5 cursor-pointer"
        style={{ background: tok.card, borderColor: tok.border }}
      >
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-semibold" style={{ color: tok.muted }}>{label}</span>
      </div>
    </Link>
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
            <KpiCard label="Projects"   value={stats.projects}   sub="in database"         icon="📁" href="/dashboard/projects"   color="#00ADB5" />
            <KpiCard label="Skills"     value={stats.skills}     sub="across all stacks"    icon="⚡" href="/dashboard/skills"     color="#8b5cf6" />
            <KpiCard label="Experience" value={stats.experience} sub="work experiences"     icon="💼" href="/dashboard/experience" color="#f59e0b" />
            <KpiCard label="Education"  value={stats.education}  sub="academic records"     icon="🎓" href="/dashboard/education"  color="#10b981" />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="rounded-2xl border p-5 space-y-3" style={{ background: tok.card, borderColor: tok.border }}>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold" style={{ color: tok.heading }}>Recent Projects</h2>
              <Link href="/dashboard/projects" className="text-xs font-medium" style={{ color: tok.accent }}>View all →</Link>
            </div>
            {loading ? <Spinner /> : projects.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: tok.muted }}>No projects yet.</p>
            ) : (
              projects.map((p) => (
                <Row
                  key={p.id}
                  label={p.title}
                  sub={p.techStack.slice(0, 3).join(' · ')}
                  badge={p.featured ? '★ Featured' : undefined}
                  href="/dashboard/projects"
                />
              ))
            )}
          </div>

          {/* Quick shortcuts */}
          <div className="rounded-2xl border p-5" style={{ background: tok.card, borderColor: tok.border }}>
            <h2 className="text-sm font-bold mb-4" style={{ color: tok.heading }}>Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <Shortcut icon="📁" label="Projects"   href="/dashboard/projects"   />
              <Shortcut icon="⚡" label="Skills"     href="/dashboard/skills"     />
              <Shortcut icon="💼" label="Experience" href="/dashboard/experience" />
              <Shortcut icon="🎓" label="Education"  href="/dashboard/education"  />
              <Shortcut icon="👤" label="About"      href="/dashboard/about"      />
              <Shortcut icon="🌐" label="View Site"  href="/"                     />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="rounded-2xl border p-5" style={{ background: tok.card, borderColor: tok.border }}>
          <h2 className="text-sm font-bold mb-4" style={{ color: tok.heading }}>Content Completion</h2>
          <div className="space-y-3">
            {[
              { label: 'Projects',   val: stats.projects,   max: 10, color: '#00ADB5' },
              { label: 'Skills',     val: stats.skills,     max: 20, color: '#8b5cf6' },
              { label: 'Experience', val: stats.experience, max: 5,  color: '#f59e0b' },
              { label: 'Education',  val: stats.education,  max: 3,  color: '#10b981' },
            ].map((item) => {
              const pct = Math.min(100, Math.round((item.val / item.max) * 100))
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs w-20 shrink-0 font-medium" style={{ color: tok.muted }}>{item.label}</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: tok.bg }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: item.color }} />
                  </div>
                  <span className="text-xs w-12 text-right font-semibold" style={{ color: item.color }}>{item.val}/{item.max}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
