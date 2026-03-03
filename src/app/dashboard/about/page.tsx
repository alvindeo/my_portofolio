'use client'
import React, { useEffect, useRef, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { motion } from 'framer-motion'
import {
  Btn, Spinner, Modal, Field, PageHeader, ToastContainer, useToast, tok
} from '@/components/dashboard/ui'

interface About {
  id?: string
  name: string
  title?: string
  bio?: string
  bio2?: string
  bio3?: string
  bio4?: string
  photoUrl?: string
  email?: string
  phone?: string
  location?: string
  github?: string
  linkedin?: string
  cvUrl?: string
}

const EMPTY: About = {
  name: '', title: '', bio: '', bio2: '', bio3: '', bio4: '',
  photoUrl: '', email: '', phone: '', location: '',
  github: '', linkedin: '', cvUrl: '',
}

// ── Stacked photo (replicates the portfolio look) ───────────────────────────
function StackedPhoto({ src, name }: { src?: string; name?: string }) {
  return (
    <div className="relative w-52 h-64 flex-shrink-0">
      {/* Back layers */}
      <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--bg-secondary)', transform: 'rotate(6deg) translate(10px,10px)', border: '1px solid var(--card-border)' }} />
      <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--bg-card)', transform: 'rotate(3deg) translate(5px,5px)', border: '1px solid var(--accent-border)' }} />
      {/* Front photo */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--accent-border)', boxShadow: '0 8px 40px rgba(0,0,0,0.25)' }}>
        {src ? (
          <img src={src} alt={name ?? 'Profile'} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl font-bold" style={{ background: tok.accentDim, color: tok.accent }}>
            {name?.charAt(0).toUpperCase() ?? 'A'}
          </div>
        )}
      </div>
      {/* Badge */}
      <div className="absolute -bottom-4 -right-4 px-3 py-1.5 rounded-xl text-xs font-semibold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        Open to Work ✦
      </div>
    </div>
  )
}

export default function DashboardAbout() {
  const [data, setData]         = useState<About>(EMPTY)
  const [loading, setLoad]      = useState(true)
  const [saving, setSaving]     = useState(false)
  const [modal, setModal]       = useState(false)
  const [form, setForm]         = useState<About>(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]   = useState<string>('')
  const fileRef                 = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const load = async () => {
    setLoad(true)
    const res = await fetch('/api/about')
    const json = await res.json()
    if (json) { setData(json); setForm(json); setPreview(json.photoUrl ?? '') }
    setLoad(false)
  }
  useEffect(() => { load() }, [])

  // ── File upload ────────────────────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Local preview
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    // Upload to server
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm((f) => ({ ...f, photoUrl: url }))
      setPreview(url)
      toast.success('Photo uploaded!')
    } else {
      const { error } = await res.json()
      toast.error(error ?? 'Upload failed.')
      setPreview(form.photoUrl ?? '')
    }
    setUploading(false)
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { toast.success('About updated!'); setModal(false); load() }
    else toast.error('Failed to update.')
    setSaving(false)
  }

  // ── Social links (mirrors portfolio) ──────────────────────────────────────
  const socials = [
    { label: 'GitHub',   href: data.github   || undefined, icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
    { label: 'LinkedIn', href: data.linkedin  || undefined, icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
    { label: 'Email',    href: data.email ? `mailto:${data.email}` : undefined, icon: <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  ]

  const bios = [data.bio, data.bio2, data.bio3, data.bio4].filter(Boolean) as string[]

  return (
    <DashboardShell title="About" breadcrumb={['Dashboard', 'About']}>
      <div className="space-y-6">
        <PageHeader
          title="About Me"
          sub="Manage your profile shown on the portfolio homepage."
          action={<Btn onClick={() => { setForm(data); setPreview(data.photoUrl ?? ''); setModal(true) }}>Edit Profile</Btn>}
        />

        {loading ? <Spinner /> : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Preview mirrors the portfolio About section ── */}
            <div className="rounded-2xl border p-8 md:p-12" style={{ background: tok.card, borderColor: tok.border }}>
              <p className="text-xs tracking-widest uppercase mb-6 font-semibold" style={{ color: tok.accent }}>About Me — Preview</p>

              <div className="flex flex-col md:flex-row gap-12 items-start">
                {/* Stacked photo */}
                <StackedPhoto src={data.photoUrl} name={data.name} />

                {/* Bio */}
                <div className="flex-1 pt-2">
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, color: tok.heading }}>
                    {data.name || 'Your Name'}
                  </h2>
                  <p className="mt-2 text-sm font-medium tracking-wide" style={{ color: tok.accent }}>
                    {data.title || 'Your title / role here'}
                  </p>

                  <div className="mt-6 space-y-4">
                    {bios.length > 0 ? bios.map((b, i) => (
                      <p key={i} className="text-base leading-relaxed" style={{ color: tok.text }}>{b}</p>
                    )) : (
                      <p className="text-base leading-relaxed" style={{ color: tok.muted }}>No bio set yet. Click Edit Profile to add one.</p>
                    )}
                  </div>

                  {/* Social links */}
                  <div className="mt-8 flex flex-wrap gap-3">
                    {socials.filter((s) => s.href).map((s) => (
                      <a key={s.label} href={s.href} target={s.href?.startsWith('http') ? '_blank' : undefined}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: 'var(--bg-primary)', color: tok.text, border: `1px solid ${tok.border}` }}>
                        {s.icon} {s.label}
                      </a>
                    ))}
                    {data.cvUrl && (
                      <a href={data.cvUrl} target="_blank"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
                        style={{ background: tok.accent, color: 'var(--bg-primary)' }}>
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download CV
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[{ label: 'Email', val: data.email }, { label: 'Phone', val: data.phone }, { label: 'Location', val: data.location }, { label: 'GitHub', val: data.github }].map((c) => (
                <div key={c.label} className="rounded-xl border p-4" style={{ background: tok.card, borderColor: tok.border }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: tok.muted }}>{c.label}</p>
                  <p className="text-sm truncate" style={{ color: c.val ? tok.text : tok.muted }}>{c.val || '—'}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      <Modal open={modal} onClose={() => setModal(false)} title="Edit About Me">
        <div className="space-y-5">

          {/* Photo upload */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-3" style={{ color: tok.muted }}>Profile Photo</label>
            <div className="flex items-center gap-5">
              {/* Preview */}
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 flex items-center justify-center" style={{ borderColor: tok.accentBor, background: tok.accentDim }}>
                {preview
                  ? <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  : <span className="text-2xl font-bold" style={{ color: tok.accent }}>{form.name?.charAt(0).toUpperCase() || 'A'}</span>
                }
              </div>
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Btn variant="ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Uploading…' : '📁 Upload Photo'}
                </Btn>
                <p className="text-xs mt-1.5" style={{ color: tok.muted }}>JPG, PNG, WEBP · Max 5MB</p>
                {form.photoUrl && (
                  <p className="text-xs mt-1 truncate" style={{ color: tok.accent }}>{form.photoUrl}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t" style={{ borderColor: tok.border }} />

          {/* Basic info */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Title / Role" name="title" value={form.title ?? ''} onChange={(v) => setForm({ ...form, title: v })} placeholder="Frontend & UI/UX Enthusiast · …" />
          </div>

          {/* Bio paragraphs */}
          <Field label="Bio — Paragraph 1" name="bio" value={form.bio ?? ''} onChange={(v) => setForm({ ...form, bio: v })} as="textarea" rows={2} />
          <Field label="Bio — Paragraph 2" name="bio2" value={form.bio2 ?? ''} onChange={(v) => setForm({ ...form, bio2: v })} as="textarea" rows={2} />
          <Field label="Bio — Paragraph 3 (optional)" name="bio3" value={form.bio3 ?? ''} onChange={(v) => setForm({ ...form, bio3: v })} as="textarea" rows={2} />
          <Field label="Bio — Paragraph 4 (optional)" name="bio4" value={form.bio4 ?? ''} onChange={(v) => setForm({ ...form, bio4: v })} as="textarea" rows={2} />

          <div className="border-t" style={{ borderColor: tok.border }} />

          {/* Contact + socials */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Email" name="email" type="email" value={form.email ?? ''} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Phone" name="phone" value={form.phone ?? ''} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+62 xxx" />
            <Field label="Location" name="location" value={form.location ?? ''} onChange={(v) => setForm({ ...form, location: v })} placeholder="Semarang, Indonesia" />
            <Field label="GitHub URL" name="github" value={form.github ?? ''} onChange={(v) => setForm({ ...form, github: v })} placeholder="https://github.com/yourusername" />
            <Field label="LinkedIn URL" name="linkedin" value={form.linkedin ?? ''} onChange={(v) => setForm({ ...form, linkedin: v })} placeholder="https://linkedin.com/in/yourusername" />
            <Field label="CV / Resume URL" name="cvUrl" value={form.cvUrl ?? ''} onChange={(v) => setForm({ ...form, cvUrl: v })} placeholder="https://drive.google.com/…" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving || uploading}>{saving ? 'Saving…' : 'Save Changes'}</Btn>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toast.toasts} />
    </DashboardShell>
  )
}
