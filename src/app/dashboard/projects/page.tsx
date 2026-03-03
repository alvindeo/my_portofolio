'use client'
import React, { useEffect, useRef, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  Btn, Spinner, Table, Td, Tr, Modal, Field, CheckField,
  ConfirmDelete, PageHeader, ToastContainer, useToast, tok
} from '@/components/dashboard/ui'

interface Project {
  id: string

  title: string
  tagline: string | null
  year: string | null
  imageUrl: string | null
  tags: string[]
  techStack: string[]
  techIcons: string[]
  liveUrl: string | null
  githubUrl: string | null
  featured: boolean
  description: string
  fullDescription: string | null
  highlights: string[]
  challenges: string | null
  outcome: string | null
  createdAt: string
}

const EMPTY = {
  title: '', tagline: '', year: '', imageUrl: '',
  tags: '',           // comma separated input
  techStack: '',      // one per line
  techIcons: '',      // one per line (matching techStack order)
  liveUrl: '', githubUrl: '', featured: false,
  description: '', fullDescription: '',
  highlights: '',     // one per line
  challenges: '', outcome: '',
}

type FormState = typeof EMPTY

// ── Section divider inside modal ─────────────────────────────────────────────
function Section({ title }: { title: string }) {
  return (
    <div className="pt-4 pb-1">
      <p className="text-xs font-bold uppercase tracking-widest" style={{ color: tok.accent }}>{title}</p>
      <div className="mt-2 h-px" style={{ background: tok.border }} />
    </div>
  )
}

export default function DashboardProjects() {
  const [items, setItems]       = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [delId, setDelId]       = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm]         = useState<FormState>(EMPTY)
  const [editId, setEditId]     = useState<string | null>(null)
  const [search, setSearch]     = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const parseLines = (s: string) => s.split('\n').map(l => l.trim()).filter(Boolean)
  const parseTags  = (s: string) => s.split(',').map(l => l.trim()).filter(Boolean)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      if (res.ok) setItems(await res.json())
      else toast.error('Failed to load projects')
    } catch { toast.error('Network error') }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (p: Project) => {
    setForm({
      title:           p.title,
      tagline:         p.tagline          ?? '',
      year:            p.year             ?? '',
      imageUrl:        p.imageUrl         ?? '',
      tags:            p.tags.join(', '),
      techStack:       p.techStack.join('\n'),
      techIcons:       p.techIcons.join('\n'),
      liveUrl:         p.liveUrl          ?? '',
      githubUrl:       p.githubUrl        ?? '',
      featured:        p.featured,
      description:     p.description,
      fullDescription: p.fullDescription  ?? '',
      highlights:      p.highlights.join('\n'),
      challenges:      p.challenges       ?? '',
      outcome:         p.outcome          ?? '',
    })
    setEditId(p.id); setModal(true)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', 'projects')
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setForm(f => ({ ...f, imageUrl: url }))
        toast.success('Image uploaded!')
      } else {
        const { error } = await res.json()
        toast.error(error || 'Upload failed')
      }
    } catch { toast.error('Upload failed') }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title dan Description wajib diisi'); return
    }
    setSaving(true)
    const payload = {
      title:           form.title,
      tagline:         form.tagline         || null,
      year:            form.year             || null,
      imageUrl:        form.imageUrl         || null,
      tags:            parseTags(form.tags),
      techStack:       parseLines(form.techStack),
      techIcons:       parseLines(form.techIcons),
      liveUrl:         form.liveUrl          || null,
      githubUrl:       form.githubUrl        || null,
      featured:        form.featured,
      description:     form.description,
      fullDescription: form.fullDescription  || null,
      highlights:      parseLines(form.highlights),
      challenges:      form.challenges       || null,
      outcome:         form.outcome          || null,
    }
    const res = editId
      ? await fetch(`/api/projects/${editId}`, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/projects',            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      toast.success(editId ? 'Project updated!' : 'Project created!')
      setModal(false); load()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error || 'Something went wrong.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!delId) return
    setDeleting(true)
    const res = await fetch(`/api/projects/${delId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Project deleted.'); load() }
    else toast.error('Failed to delete.')
    setDeleting(false); setDelId(null)
  }

  const filtered = items.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.tagline ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const f = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (v: string) => setForm({ ...form, [key]: v }),
  })


  return (
    <DashboardShell title="Projects" breadcrumb={['Dashboard', 'Projects']}>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          sub={`${items.length} projects`}
          action={<Btn onClick={openCreate}><span>+</span> Add Project</Btn>}
        />

        {/* Search bar */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border max-w-sm" style={{ background: tok.card, borderColor: tok.border }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: tok.muted }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
            className="bg-transparent text-sm outline-none flex-1" style={{ color: tok.text }} />
        </div>

        {loading ? <Spinner /> : (
          <Table headers={['Project', 'Tags', 'Stack', 'Links', 'Featured', 'Actions']} empty={filtered.length === 0}>
            {filtered.map((p) => (
              <Tr key={p.id}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = tok.accentDim }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
              >
                {/* Project */}
                <Td>
                  <div className="flex items-center gap-3">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                        style={{ border: `1px solid ${tok.border}` }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                    <div>
                      <p className="font-semibold" style={{ color: tok.heading }}>{p.title}</p>
                      {p.tagline && <p className="text-xs mt-0.5 line-clamp-1" style={{ color: tok.muted }}>{p.tagline}</p>}
                      {p.year && <span className="text-[10px] font-medium" style={{ color: tok.accent }}>{p.year}</span>}
                    </div>
                  </div>
                </Td>
                {/* Tags */}
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                        style={{ background: tok.accentDim, color: tok.accent, border: `1px solid ${tok.accentBor}` }}>
                        {t}
                      </span>
                    ))}
                    {p.tags.length > 2 && <span className="text-[10px]" style={{ color: tok.muted }}>+{p.tags.length - 2}</span>}
                  </div>
                </Td>
                {/* Tech Stack */}
                <Td muted>
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.slice(0, 3).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded text-[10px]"
                        style={{ background: tok.bg, border: `1px solid ${tok.border}`, color: tok.text }}>
                        {t}
                      </span>
                    ))}
                    {p.techStack.length > 3 && <span className="text-[10px]" style={{ color: tok.muted }}>+{p.techStack.length - 3}</span>}
                  </div>
                </Td>
                {/* Links */}
                <Td>
                  <div className="flex gap-2">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" className="text-xs underline" style={{ color: tok.accent }}>Live</a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" className="text-xs underline" style={{ color: tok.muted }}>GitHub</a>}
                    {!p.liveUrl && !p.githubUrl && <span style={{ color: tok.muted }}>—</span>}
                  </div>
                </Td>
                {/* Featured */}
                <Td>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: p.featured ? '#10b98118' : tok.bg, color: p.featured ? '#10b981' : tok.muted, border: `1px solid ${p.featured ? '#10b98130' : tok.border}` }}>
                    {p.featured ? '★ Featured' : 'Normal'}
                  </span>
                </Td>
                {/* Actions */}
                <Td>
                  <div className="flex items-center gap-2">
                    <Btn variant="ghost" onClick={() => openEdit(p)}>Edit</Btn>
                    <Btn variant="danger" onClick={() => setDelId(p.id)}>Delete</Btn>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </div>

      {/* ── MODAL FORM ─────────────────────────────────────────────────────── */}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Project' : 'New Project'}>
        <div className="space-y-3">

          {/* ── SECTION 1: Basic Info ── */}
          <Section title="Basic Info" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title *" name="title" placeholder="Cataract Detection System" required {...f('title')} />
            <Field label="Year" name="year" placeholder="2024" {...f('year')} />
          </div>
          <Field label="Tagline" name="tagline" placeholder="AI-powered eye disease detection using Computer Vision" {...f('tagline')} />
          
          {/* Image Upload instead of URL Field */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide block mb-3" style={{ color: tok.muted }}>Project Image</label>
            <div className="flex items-center gap-5 p-4 rounded-2xl border" style={{ borderColor: tok.border, background: tok.bg }}>
              <div className="w-24 h-16 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center" style={{ borderColor: tok.border, background: tok.accentDim }}>
                {form.imageUrl 
                  ? <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  : <span className="text-2xl" style={{ opacity: 0.3 }}>🖥</span>
                }
              </div>
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <Btn variant="ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? 'Uploading…' : '📁 Upload Image'}
                </Btn>
                <p className="text-[10px] mt-1.5" style={{ color: tok.muted }}>JPG, PNG, WEBP · Max 5MB</p>
                {form.imageUrl && <p className="text-[10px] mt-0.5 truncate max-w-[200px]" style={{ color: tok.accent }}>{form.imageUrl}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL" name="liveUrl" placeholder="https://myapp.com" {...f('liveUrl')} />
            <Field label="GitHub URL" name="githubUrl" placeholder="https://github.com/user/repo" {...f('githubUrl')} />
          </div>

          <CheckField label="Featured project (tampil di home)" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />

          {/* ── SECTION 2: Categories & Tech ── */}
          <Section title="Categories & Tech Stack" />
          <div>
            <Field label="Tags / Kategori (comma separated)" name="tags" placeholder="AI / ML, Computer Vision, Web" {...f('tags')} />
            <p className="text-xs mt-1" style={{ color: tok.muted }}>Dipakai sebagai filter & badge di halaman projects</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Field label="Tech Names (satu per baris)" name="techStack" as="textarea" rows={4}
                placeholder={"Python\nFlask\nOpenCV\nDocker"} {...f('techStack')} />
              <p className="text-xs mt-1" style={{ color: tok.muted }}>Nama tech untuk ditampilkan</p>
            </div>
            <div>
              <Field label="Tech Icons (satu per baris)" name="techIcons" as="textarea" rows={4}
                placeholder={"python\nflask\nopencv\ndocker"} {...f('techIcons')} />
              <p className="text-xs mt-1" style={{ color: tok.muted }}>Slug dari tech-stack-icons (urutan sama dengan Names)</p>
            </div>
          </div>

          {/* ── SECTION 3: Content ── */}
          <Section title="Content" />
          <Field label="Short Description * (untuk card list)" name="description" as="textarea" rows={2}
            placeholder="A Computer Vision system using YOLOv8 for automated cataract detection..." required {...f('description')} />
          <Field label="Full Description (untuk halaman detail — Overview)" name="fullDescription" as="textarea" rows={4}
            placeholder="Detail panjang tentang project, arsitektur, dan teknologi yang digunakan..." {...f('fullDescription')} />

          {/* ── SECTION 4: Detail Story ── */}
          <Section title="Detail — Highlights, Challenges & Outcome" />
          <div>
            <Field label="Key Highlights (satu per baris)" name="highlights" as="textarea" rows={4}
              placeholder={"Fine-tuned YOLOv8 on custom medical dataset\nAchieved 92%+ detection accuracy\nBuilt real-time inference API with Flask\nImplemented full data preprocessing pipeline"} {...f('highlights')} />
            <p className="text-xs mt-1" style={{ color: tok.muted }}>Ditampilkan sebagai card bullet points di detail page</p>
          </div>
          <Field label="Challenges & Solutions" name="challenges" as="textarea" rows={3}
            placeholder="The biggest challenge was collecting and annotating sufficient medical imaging data..." {...f('challenges')} />
          <Field label="Outcome" name="outcome" as="textarea" rows={2}
            placeholder="A deployable web application that assists clinicians in early cataract screening..." {...f('outcome')} />

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: tok.border }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Project'}</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!delId} onCancel={() => setDelId(null)} onConfirm={handleDelete} loading={deleting} />
      <ToastContainer toasts={toast.toasts} />
    </DashboardShell>
  )
}
