'use client'
import React, { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  Btn, Spinner, Table, Td, Tr, Modal, Field, CheckField,
  ConfirmDelete, PageHeader, ToastContainer, useToast, tok
} from '@/components/dashboard/ui'

interface Project {
  id: string; title: string; description: string; imageUrl?: string
  techStack: string[]; liveUrl?: string; githubUrl?: string; featured: boolean
  createdAt: string
}

const EMPTY: Omit<Project, 'id' | 'createdAt'> = {
  title: '', description: '', imageUrl: '', techStack: [], liveUrl: '', githubUrl: '', featured: false
}

export default function DashboardProjects() {
  const [items, setItems]       = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [delId, setDelId]       = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState<string | null>(null)
  const [search, setSearch]     = useState('')
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/projects')
    setItems(await res.json())
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (p: Project) => {
    setForm({ title: p.title, description: p.description, imageUrl: p.imageUrl ?? '', techStack: p.techStack, liveUrl: p.liveUrl ?? '', githubUrl: p.githubUrl ?? '', featured: p.featured })
    setEditId(p.id); setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, techStack: typeof form.techStack === 'string' ? (form.techStack as string).split(',').map((s) => s.trim()).filter(Boolean) : form.techStack }
    const res = editId
      ? await fetch(`/api/projects/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/projects',              { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { toast.success(editId ? 'Project updated!' : 'Project created!'); setModal(false); load() }
    else toast.error('Something went wrong.')
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

  const filtered = items.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardShell title="Projects" breadcrumb={['Dashboard', 'Projects']}>
      <div className="space-y-6">
        <PageHeader
          title="Projects"
          sub={`${items.length} projects in database`}
          action={<Btn onClick={openCreate}><span>+</span> Add Project</Btn>}
        />

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border flex-1 max-w-sm" style={{ background: tok.card, borderColor: tok.border }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: tok.muted, flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects…"
              className="bg-transparent text-sm outline-none flex-1" style={{ color: tok.text }} />
          </div>
        </div>

        {loading ? <Spinner /> : (
          <Table headers={['Title', 'Tech Stack', 'Live', 'GitHub', 'Featured', 'Actions']} empty={filtered.length === 0}>
            {filtered.map((p) => (
              <Tr key={p.id}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = tok.accentDim }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
              >
                <Td>
                  <div>
                    <p className="font-semibold" style={{ color: tok.heading }}>{p.title}</p>
                    <p className="text-xs mt-0.5 line-clamp-1" style={{ color: tok.muted }}>{p.description}</p>
                  </div>
                </Td>
                <Td muted>
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full text-xs" style={{ background: tok.accentDim, color: tok.accent, border: `1px solid ${tok.accentBor}` }}>{t}</span>
                    ))}
                    {p.techStack.length > 3 && <span className="text-xs" style={{ color: tok.muted }}>+{p.techStack.length - 3}</span>}
                  </div>
                </Td>
                <Td muted>{p.liveUrl ? <a href={p.liveUrl} target="_blank" className="text-xs underline" style={{ color: tok.accent }}>Link</a> : '—'}</Td>
                <Td muted>{p.githubUrl ? <a href={p.githubUrl} target="_blank" className="text-xs underline" style={{ color: tok.accent }}>Link</a> : '—'}</Td>
                <Td>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: p.featured ? '#10b98118' : tok.bg, color: p.featured ? '#10b981' : tok.muted, border: `1px solid ${p.featured ? '#10b98130' : tok.border}` }}>
                    {p.featured ? '★ Featured' : 'Normal'}
                  </span>
                </Td>
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

      {/* Create/Edit Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Project' : 'New Project'}>
        <div className="space-y-4">
          <Field label="Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
          <Field label="Description" name="description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} as="textarea" rows={3} />
          <Field label="Tech Stack (comma separated)" name="techStack" value={Array.isArray(form.techStack) ? form.techStack.join(', ') : form.techStack} onChange={(v) => setForm({ ...form, techStack: v as unknown as string[] })} placeholder="React, TypeScript, Prisma" />
          <Field label="Image URL" name="imageUrl" value={form.imageUrl ?? ''} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="/projects/my-project.jpg" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Live URL" name="liveUrl" value={form.liveUrl ?? ''} onChange={(v) => setForm({ ...form, liveUrl: v })} placeholder="https://…" />
            <Field label="GitHub URL" name="githubUrl" value={form.githubUrl ?? ''} onChange={(v) => setForm({ ...form, githubUrl: v })} placeholder="https://github.com/…" />
          </div>
          <CheckField label="Featured project" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
          <div className="flex justify-end gap-3 pt-2">
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
