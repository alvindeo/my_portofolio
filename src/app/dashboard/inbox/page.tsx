'use client'

import React, { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { motion, AnimatePresence } from 'framer-motion'

interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function InboxPage() {
  const [msgs, setMsgs]         = useState<Contact[]>([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState<Contact | null>(null)
  const [filter, setFilter]     = useState<'all' | 'unread'>('all')

  const fetchMsgs = () =>
    fetch('/api/contact').then(r => r.json())
      .then(d => { if (Array.isArray(d)) setMsgs(d) })
      .catch(console.error)
      .finally(() => setLoading(false))

  useEffect(() => { fetchMsgs() }, [])

  const markRead = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: 'PATCH' })
    setMsgs(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m))
    setSelected(prev => prev?.id === id ? { ...prev, isRead: true } : prev)
  }

  const handleOpen = (msg: Contact) => {
    setSelected(msg)
    if (!msg.isRead) markRead(msg.id)
  }

  const displayed = filter === 'unread' ? msgs.filter(m => !m.isRead) : msgs
  const unreadCount = msgs.filter(m => !m.isRead).length

  return (
    <DashboardShell title="Inbox" breadcrumb={['Dashboard', 'Inbox']}>
      <div className="flex h-[calc(100vh-120px)] gap-4 min-h-0">

        {/* ── Message List ── */}
        <div className="w-80 shrink-0 flex flex-col rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>Messages</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex gap-1">
              {(['all', 'unread'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all"
                  style={{ background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? 'var(--bg-primary)' : 'var(--text-muted)' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 px-4 py-3 border-b animate-pulse" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="w-9 h-9 rounded-full shrink-0" style={{ background: 'var(--bg-secondary)' }} />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }} />
                    <div className="h-2.5 w-3/4 rounded-full" style={{ background: 'var(--bg-secondary)' }} />
                  </div>
                </div>
              ))
            ) : displayed.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
                <span className="text-4xl opacity-30">📭</span>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
                </p>
              </div>
            ) : (
              displayed.map(msg => (
                <button key={msg.id} onClick={() => handleOpen(msg)} className="w-full text-left"
                  style={{ borderBottom: '1px solid var(--card-border)', background: selected?.id === msg.id ? 'var(--accent-dim)' : msg.isRead ? 'transparent' : 'var(--bg-secondary)' }}>
                  <div className="flex items-start gap-3 px-4 py-3 hover:opacity-80 transition-all">
                    {/* Unread dot */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      {!msg.isRead && (
                        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                          style={{ background: 'var(--accent)', borderColor: 'var(--bg-card)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <p className="text-xs font-bold truncate" style={{ color: 'var(--text-heading)', fontWeight: msg.isRead ? 600 : 800 }}>{msg.name}</p>
                        <span className="text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                          {new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <p className="text-[11px] truncate" style={{ color: 'var(--accent)', fontWeight: 600 }}>{msg.subject}</p>
                      <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{msg.message}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Message Detail ── */}
        <div className="flex-1 rounded-2xl overflow-hidden flex flex-col" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div key={selected.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
                {/* Detail Header */}
                <div className="px-6 py-4 border-b flex items-start justify-between gap-4" style={{ borderColor: 'var(--card-border)' }}>
                  <div>
                    <h2 className="text-base font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{selected.subject}</h2>
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>From:</span>
                      <span className="font-semibold" style={{ color: 'var(--accent)' }}>{selected.name}</span>
                      <span>&lt;{selected.email}&gt;</span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(selected.createdAt)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                      style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 8 9 6 9-6"/><rect x="2" y="6" width="20" height="14" rx="2"/></svg>
                      Reply
                    </a>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)', lineHeight: 1.8 }}>
                      {selected.message}
                    </p>
                  </div>
                </div>

                {/* Contact info footer */}
                <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span>📧 <a href={`mailto:${selected.email}`} style={{ color: 'var(--accent)' }}>{selected.email}</a></span>
                    <span>🕒 {formatDate(selected.createdAt)}</span>
                    {selected.isRead && <span className="flex items-center gap-1">✅ Read</span>}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'var(--bg-secondary)' }}>📬</div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-heading)' }}>Select a message to read</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Click on any message from the list</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardShell>
  )
}
