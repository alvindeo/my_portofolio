'use client'
import React, { useEffect, useState, useRef } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  Btn, Spinner, Table, Td, Tr, Modal, Field,
  ConfirmDelete, PageHeader, ToastContainer, useToast, tok
} from '@/components/dashboard/ui'
import { Image as ImageIcon, MapPin } from 'lucide-react'

interface Education {
  id: string
  degree: string
  institution: string
  field: string
  period: string
  description: string
  gpa?: string
  imageUrl?: string
  location?: string
}

const EMPTY = {
  degree: '',
  institution: '',
  field: '',
  period: '',
  description: '',
  gpa: '',
  imageUrl: '',
  location: '',
}

export default function DashboardEducation() {
  const [items, setItems]         = useState<Education[]>([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [delId, setDelId]         = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [editId, setEditId]       = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/education')
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } else {
        toast.error('Failed to load education data')
      }
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (e: Education) => {
    setForm({
      degree:      e.degree,
      institution: e.institution,
      field:       e.field,
      period:      e.period,
      description: e.description,
      gpa:         e.gpa      ?? '',
      imageUrl:    e.imageUrl ?? '',
      location:    e.location ?? '',
    })
    setEditId(e.id); setModal(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', f)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm(prev => ({ ...prev, imageUrl: url }))
      toast.success('Logo uploaded!')
    } else toast.error('Upload failed')
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.degree || !form.institution || !form.field || !form.period || !form.description) {
      toast.error('Harap isi semua field wajib (Degree, Institution, Field, Period, Description)')
      return
    }
    setSaving(true)
    const payload = {
      degree:      form.degree,
      institution: form.institution,
      field:       form.field,
      period:      form.period,
      description: form.description,
      gpa:         form.gpa      || null,
      imageUrl:    form.imageUrl || null,
      location:    form.location || null,
    }
    const res = editId
      ? await fetch(`/api/education/${editId}`, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/education',            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })

    if (res.ok) {
      toast.success(editId ? 'Education updated!' : 'Education created!')
      setModal(false)
      load()
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err?.error || 'Something went wrong.')
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!delId) return
    setDeleting(true)
    const res = await fetch(`/api/education/${delId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted.'); load() }
    else toast.error('Failed to delete.')
    setDeleting(false); setDelId(null)
  }

  return (
    <DashboardShell title="Education" breadcrumb={['Dashboard', 'Education']}>
      <div className="space-y-6">
        <PageHeader
          title="Education"
          sub={`${items.length} education records`}
          action={<Btn onClick={openCreate}><span>+</span> Add Education</Btn>}
        />

        {loading ? <Spinner /> : (
          <Table headers={['Logo', 'Degree & Field', 'Institution', 'Period', 'Location', 'GPA', 'Actions']} empty={items.length === 0}>
            {items.map((e) => (
              <Tr key={e.id}
                onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = tok.accentDim }}
                onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = '' }}
              >
                {/* Logo */}
                <Td>
                  {e.imageUrl
                    ? <img src={e.imageUrl} className="w-10 h-10 rounded-lg object-contain border" style={{ borderColor: tok.border }} alt="Logo" />
                    : <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-xs opacity-20">N/A</div>
                  }
                </Td>

                {/* Degree & Field */}
                <Td>
                  <p className="font-semibold" style={{ color: tok.heading }}>{e.degree}</p>
                  <p className="text-xs mt-0.5" style={{ color: tok.muted }}>{e.field}</p>
                </Td>

                {/* Institution */}
                <Td muted>{e.institution}</Td>

                {/* Period */}
                <Td>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: tok.accentDim, color: tok.accent, border: `1px solid ${tok.accentBor}` }}>
                    {e.period}
                  </span>
                </Td>

                {/* Location */}
                <Td muted>
                  {e.location
                    ? <span className="flex items-center gap-1 text-xs"><MapPin size={11} />{e.location}</span>
                    : <span style={{ color: tok.muted }}>—</span>
                  }
                </Td>

                {/* GPA */}
                <Td>
                  {e.gpa
                    ? <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: tok.accentDim, color: tok.accent, border: `1px solid ${tok.accentBor}` }}>
                        {e.gpa}
                      </span>
                    : <span style={{ color: tok.muted }}>—</span>
                  }
                </Td>

                {/* Actions */}
                <Td>
                  <div className="flex items-center gap-2">
                    <Btn variant="ghost" onClick={() => openEdit(e)}>Edit</Btn>
                    <Btn variant="danger" onClick={() => setDelId(e.id)}>Delete</Btn>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </div>

      {/* ── MODAL FORM ── */}
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Education' : 'New Education'}>
        <div className="space-y-4">

          {/* Logo Upload */}
          <div className="flex items-center gap-4 py-2 border-y" style={{ borderColor: tok.border }}>
            <div className="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden"
              style={{ borderColor: tok.accentBor, background: 'var(--accent-dim)' }}>
              {form.imageUrl
                ? <img src={form.imageUrl} className="w-full h-full object-contain" alt="Logo" />
                : <ImageIcon size={20} className="opacity-20" />
              }
            </div>
            <div className="flex-1">
              <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleUpload} />
              <Btn variant="ghost" className="text-xs" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : '📁 Upload Institution Logo'}
              </Btn>
              <p className="text-xs mt-1" style={{ color: tok.muted }}>PNG, JPG, SVG recommended</p>
            </div>
          </div>

          {/* Row 1 – Degree & Institution */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Degree *"
              name="degree"
              value={form.degree}
              onChange={(v) => setForm({ ...form, degree: v })}
              placeholder="S1 Teknik Informatika"
              required
            />
            <Field
              label="Institution *"
              name="institution"
              value={form.institution}
              onChange={(v) => setForm({ ...form, institution: v })}
              placeholder="Universitas Dian Nuswantoro"
              required
            />
          </div>

          {/* Row 2 – Field & Period */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Field of Study *"
              name="field"
              value={form.field}
              onChange={(v) => setForm({ ...form, field: v })}
              placeholder="Informatika"
              required
            />
            <Field
              label="Period *"
              name="period"
              value={form.period}
              onChange={(v) => setForm({ ...form, period: v })}
              placeholder="2023 – Present  atau  2019 – 2022"
              required
            />
          </div>

          {/* Description */}
          <Field
            label="Description *"
            name="description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            as="textarea"
            rows={3}
            placeholder="Focusing on Artificial Intelligence, Machine Learning, and Software Engineering."
            required
          />

          {/* Row 3 – Location & GPA */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={(v) => setForm({ ...form, location: v })}
              placeholder="Semarang, Indonesia"
            />
            <Field
              label="GPA (optional)"
              name="gpa"
              value={form.gpa}
              onChange={(v) => setForm({ ...form, gpa: v })}
              placeholder="3.77 / 4.0"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving || uploading}>
              {saving ? 'Saving…' : 'Save'}
            </Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!delId} onCancel={() => setDelId(null)} onConfirm={handleDelete} loading={deleting} />
      <ToastContainer toasts={toast.toasts} />
    </DashboardShell>
  )
}