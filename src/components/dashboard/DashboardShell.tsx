'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from '@/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'

// ── SVG Icon helper ──────────────────────────────────────────────────────────
function Icon({ d, size = 16 }: { d: string | string[]; size?: number }) {
  const paths = Array.isArray(d) ? d : [d]
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths.map((p, i) => <path key={i} d={p} />)}
    </svg>
  )
}

// ── Panel Toggle Icon (sidebar panel style) ───────────────────────────────────
function PanelIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {/* outer rectangle */}
      <rect x="3" y="3" width="18" height="18" rx="2" />
      {/* vertical divider - the "panel" line */}
      <line x1="9" y1="3" x2="9" y2="21" />
      {/* arrow inside right panel */}
      {collapsed
        ? <path d="M14 8l4 4-4 4" />
        : <path d="M18 8l-4 4 4 4" />
      }
    </svg>
  )
}

const icons = {
  home:       'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  project:    ['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z'],
  skill:      ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  experience: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
  about:      ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  education:  ['M22 10v6', 'M2 10l10-5 10 5-10 5z', 'M6 12v5c3 3 9 3 12 0v-5'],
  search:     ['M11 17.25a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5z', 'M16 16l4.5 4.5'],
  logout:     ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  external:   ['M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6', 'M15 3h6v6', 'M10 14 21 3'],
  sun:        ['M12 1v2', 'M12 21v2', 'M4.22 4.22l1.42 1.42', 'M18.36 18.36l1.42 1.42', 'M1 12h2', 'M21 12h2', 'M4.22 19.78l1.42-1.42', 'M18.36 5.64l1.42-1.42', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z'],
  moon:       'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  palette:    ['M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.1 0 2-.9 2-2 0-.55-.22-1.05-.59-1.41-.36-.36-.59-.86-.59-1.41 0-1.1.9-2 2-2h2.35c3.14 0 5.24-2.93 5.24-5.82C22.41 6.85 17.83 2 12 2z'],
  user:       ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  lock:       ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  check:      'M20 6 9 17l-5-5',
  eye:        ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  eyeOff:     ['M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24', 'M1 1l22 22'],
  chevronUp:  'm18 15-6-6-6 6',
  certificate: ['M6 9h12', 'M6 13h9', 'M6 17h12', 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const navItems = [
  { label: 'Overview',   href: '/dashboard',            icon: icons.home       },
  { label: 'Projects',   href: '/dashboard/projects',   icon: icons.project    },
  { label: 'Skills',     href: '/dashboard/skills',     icon: icons.skill      },
  { label: 'Experience', href: '/dashboard/experience', icon: icons.experience },
  { label: 'About',      href: '/dashboard/about',      icon: icons.about      },
  { label: 'Education',  href: '/dashboard/education',  icon: icons.education  },
  { label: 'Certificates', href: '/dashboard/certificates', icon: icons.certificate },
]

// ── Profile Modal ─────────────────────────────────────────────────────────────
function ProfileModal({ open, onClose, userEmail }: { open: boolean; onClose: () => void; userEmail: string }) {
  const [name, setName]           = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw]         = useState('')
  const [showCur, setShowCur]     = useState(false)
  const [showNew, setShowNew]     = useState(false)
  const [saving, setSaving]       = useState(false)
  const [msg, setMsg]             = useState<{ text: string; ok: boolean } | null>(null)
  const [tab, setTab]             = useState<'name' | 'password'>('name')

  if (!open) return null

  const handleSave = async () => {
    setSaving(true); setMsg(null)
    const body: Record<string, string> = {}
    if (tab === 'name' && name) body.name = name
    if (tab === 'password') { body.currentPassword = currentPw; body.newPassword = newPw }

    const res = await fetch('/api/admin/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) { setMsg({ text: 'Saved successfully!', ok: true }); setCurrentPw(''); setNewPw('') }
    else { const j = await res.json(); setMsg({ text: j.error ?? 'Failed to save.', ok: false }) }
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-primary)', color: 'var(--text-primary)',
    border: '1px solid var(--card-border)', borderRadius: 10,
    padding: '10px 12px', width: '100%', fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} />
      <div
        className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
              {userEmail?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>Admin Profile</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{userEmail}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--bg-primary)' }}>
          {(['name', 'password'] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setMsg(null) }}
              className="flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
              style={{
                background: tab === t ? 'var(--bg-card)' : 'transparent',
                color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
              }}>
              {t === 'name' ? 'Display Name' : 'Change Password'}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'name' ? (
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>New Display Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alvin Deo" style={inputStyle} />
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>Current Password</label>
              <div className="relative">
                <input type={showCur ? 'text' : 'password'} value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} onClick={() => setShowCur(!showCur)}>
                  <Icon d={showCur ? icons.eyeOff : icons.eye} size={15} />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide block mb-1.5" style={{ color: 'var(--text-muted)' }}>New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} onClick={() => setShowNew(!showNew)}>
                  <Icon d={showNew ? icons.eyeOff : icons.eye} size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {msg && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium" style={{
            background: msg.ok ? '#10b98118' : '#ef444418',
            color: msg.ok ? '#10b981' : '#ef4444',
            border: `1px solid ${msg.ok ? '#10b98130' : '#ef444430'}`,
          }}>
            <Icon d={msg.ok ? icons.check : 'M18 6 6 18M6 6l12 12'} size={14} />
            {msg.text}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)', border: '1px solid var(--card-border)' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85 disabled:opacity-40"
            style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── User Dropdown ─────────────────────────────────────────────────────────────
function UserDropdown({ session, collapsed }: { session: { user?: { email?: string | null; name?: string | null } } | null; collapsed: boolean }) {
  const [open, setOpen]           = useState(false)
  const [profileOpen, setProfile] = useState(false)
  const { theme, toggleTheme }    = useTheme()
  const ref                       = useRef<HTMLDivElement>(null)

  const displayName = session?.user?.name ?? session?.user?.email ?? 'Admin'
  const initial     = displayName.charAt(0).toUpperCase()
  const email       = session?.user?.email ?? ''

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const menuItem = (icon: typeof icons.user, label: string, onClick: () => void, danger = false) => (
    <button
      onClick={() => { onClick(); setOpen(false) }}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all hover:opacity-80"
      style={{ color: danger ? '#ef4444' : 'var(--text-primary)', background: 'transparent' }}
    >
      <span style={{ color: danger ? '#ef4444' : 'var(--text-muted)' }}><Icon d={icon} size={15} /></span>
      {label}
    </button>
  )

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl transition-all hover:opacity-80"
        style={{ background: open ? 'var(--accent-dim)' : 'transparent', border: open ? '1px solid var(--accent-border)' : '1px solid transparent' }}
      >
        {/* Avatar */}
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}
        >
          {initial}
        </div>

        {/* Name + chevron */}
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{displayName}</p>
              <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{email}</p>
            </div>
            <span className="shrink-0 transition-transform duration-200" style={{ color: 'var(--text-muted)', transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              <Icon d={icons.chevronUp} size={13} />
            </span>
          </>
        )}
      </button>

      {/* Dropdown panel — appears above the button */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 w-56 rounded-2xl shadow-2xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)', zIndex: 50 }}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <p className="text-xs font-bold truncate" style={{ color: 'var(--text-heading)' }}>{displayName}</p>
            <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{email}</p>
          </div>

          <div className="p-2 space-y-0.5">
            {/* Profile */}
            {menuItem(icons.user, 'Edit Profile', () => setProfile(true))}

            {/* Theme toggle */}
            <button
              onClick={() => { toggleTheme(); setOpen(false) }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all hover:opacity-80"
              style={{ color: 'var(--text-primary)', background: 'transparent' }}
            >
              <span style={{ color: 'var(--text-muted)' }}><Icon d={theme === 'dark' ? icons.sun[0] : icons.moon} size={15} /></span>
              <span className="flex-1">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              {/* Toggle pill */}
              <div className="w-8 h-4 rounded-full transition-colors relative" style={{ background: theme === 'dark' ? 'var(--card-border)' : 'var(--accent)' }}>
                <div className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all" style={{ left: theme === 'dark' ? 2 : 16 }} />
              </div>
            </button>

            <div className="border-t my-1" style={{ borderColor: 'var(--card-border)' }} />

            {/* View site */}
            <Link href="/" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{ color: 'var(--text-primary)', display: 'flex' }}
            >
              <span style={{ color: 'var(--text-muted)' }}><Icon d={icons.external} size={15} /></span>
              View Portfolio
            </Link>

            {/* Logout */}
            {menuItem(icons.logout, 'Sign Out', () => signOut({ callbackUrl: '/auth/login' }), true)}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <ProfileModal open={profileOpen} onClose={() => setProfile(false)} userEmail={email} />
    </div>
  )
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle, isMobile }: { collapsed: boolean; onToggle: () => void; isMobile: boolean }) {
  const pathname         = usePathname()
  const { data: session } = useSession()

  const sidebarWidth = 240

  const content = (
    <motion.aside
      key="sidebar"
      initial={isMobile ? { x: -sidebarWidth } : { width: 0, opacity: 0 }}
      animate={isMobile ? { x: collapsed ? -sidebarWidth : 0 } : { width: collapsed ? 0 : sidebarWidth, opacity: collapsed ? 0 : 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex flex-col h-screen sticky top-0 border-r shrink-0 overflow-hidden ${isMobile ? 'fixed z-50 shadow-2xl' : ''}`}
      style={{ 
        width: sidebarWidth, 
        minWidth: isMobile ? undefined : (collapsed ? 0 : sidebarWidth), 
        background: 'var(--bg-card)', 
        borderColor: 'var(--card-border)' 
      }}
    >
      <motion.div
        className="flex items-center px-4 border-b"
        style={{ borderColor: 'var(--card-border)', minHeight: 64 }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>A</div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-heading)' }}>Portfolio</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Admin Panel</p>
          </div>
        </div>
        {isMobile && (
          <button onClick={onToggle} className="ml-auto p-2" style={{ color: 'var(--text-muted)' }}>
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </motion.div>

      {/* Search */}
      <div className="px-3 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--card-border)' }}>
          <Icon d={icons.search} size={13} />
          <input placeholder="Search items..." className="bg-transparent text-xs outline-none flex-1 min-w-0" style={{ color: 'var(--text-primary)' }} />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        <p className="px-3 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Main Menu</p>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && onToggle()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active ? 'var(--accent-dim)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-muted)',
                border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
              }}
            >
              <span className="shrink-0"><Icon d={item.icon} size={16} /></span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-2" style={{ borderColor: 'var(--card-border)' }}>
        <UserDropdown session={session} collapsed={false} />
      </div>
    </motion.aside>
  )

  return (
    <>
      <AnimatePresence>
        {isMobile && !collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      {isMobile ? (
        <AnimatePresence>{!collapsed && content}</AnimatePresence>
      ) : content}
    </>
  )
}

// ── Topbar ────────────────────────────────────────────────────────────────────
function Topbar({ breadcrumb, onToggle, collapsed, isMobile }: { breadcrumb: string[]; onToggle: () => void; collapsed: boolean; isMobile: boolean }) {
  return (
    <header
      className="flex items-center gap-3 px-4 border-b"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--card-border)', height: 64, position: 'sticky', top: 0, zIndex: 10 }}
    >
      <button
        onClick={onToggle}
        className="p-2 rounded-xl transition-colors shrink-0"
        style={{ color: 'var(--text-muted)', background: 'var(--bg-primary)', border: '1px solid var(--card-border)' }}
      >
        {isMobile ? (
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        ) : (
          <PanelIcon collapsed={collapsed} />
        )}
      </button>

      <nav className="flex items-center gap-1.5 text-sm overflow-hidden whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
        {!isMobile && breadcrumb.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="mx-0.5">/</span>}
            <span style={{ color: i === breadcrumb.length - 1 ? 'var(--text-heading)' : undefined, fontWeight: i === breadcrumb.length - 1 ? 700 : 400 }}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
        {isMobile && <span className="font-bold truncate" style={{ color: 'var(--text-heading)' }}>{breadcrumb[breadcrumb.length - 1]}</span>}
      </nav>

      <div className="flex-1" />
      <Link href="/" className="text-[10px] sm:text-xs px-2.5 py-1.5 rounded-xl border font-medium transition-all hover:opacity-80 shrink-0"
        style={{ color: 'var(--text-muted)', borderColor: 'var(--card-border)' }}>
        {isMobile ? 'Exit' : 'View Site'} →
      </Link>
    </header>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────
export function DashboardShell({ children, title, breadcrumb }: {
  children: React.ReactNode; title: string; breadcrumb: string[]
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile]   = useState(false)

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) setCollapsed(true)
      else setCollapsed(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');`}</style>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} isMobile={isMobile} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar breadcrumb={breadcrumb} onToggle={() => setCollapsed(!collapsed)} collapsed={collapsed} isMobile={isMobile} />
        <motion.main
          key={breadcrumb.join('/')}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex-1 overflow-auto p-4 sm:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}

