'use client'
import React, { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  Btn, Spinner, Table, Td, Tr, Modal, Field,
  ConfirmDelete, PageHeader, ToastContainer, useToast, tok
} from '@/components/dashboard/ui'

interface Experience {
  id: string
  company: string
  role: string
  description: string
  period: string
  tags: string
  achievements: string
}

const EMPTY: Omit<Experience, 'id'> = {
  company:      '',
  role:         '',
  description:  '',
  period:       '',
  tags:         '',
  achievements: '',
}

export default function DashboardExperience() {
  const [items, setItems]         = useState<Experience[]>([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [delId, setDelId]         = useState<string | null>(null)
  const [saving, setSaving]       = useState(false)
  const [deleting, setDeleting]   = useState(false)
  const [form, setForm]           = useState(EMPTY)
  const [editId, setEditId]       = useState<string | null>(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/experience')
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      } else toast.error('Failed to load experience data')
    } catch (err) {
      console.error(err)
      toast.error('Network error')
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (e: Experience) => {
    setForm({
      company:      e.company,
      role:         e.role,
      description:  e.description,
      period:       e.period,
      tags:         e.tags,
      achievements: e.achievements,
    })
    setEditId(e.id); setModal(true)
  }

  const handleSave = async () => {
    if (!form.company || !form.role || !form.description || !form.period) {
      toast.error('Harap isi field wajib: Company, Role, Description, Period')
      return
    }
    setSaving(true)
    const payload = {
      company:      form.company,
      role:         form.role,
      description:  form.description,
      period:       form.period,
      tags:         form.tags,
      achievements: form.achievements,
    }
    const res = editId
      ? await fetch(`/api/experience/${editId}`, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/experience',            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      toast.success(editId ? 'Experience updated!' : 'Experience created!')
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
    const res = await fetch(`/api/experience/${delId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted.'); load() }
    else toast.error('Failed to delete.')
    setDeleting(false); setDelId(null)
  }

  // Helper: tags string → array preview (maks 3)
  const parseTags = (s: string) =>
    s.split('\n').map(t => t.trim()).filter(Boolean)

  return (
    <DashboardShell title="Experience" breadcrumb={['Dashboard', 'Experience']}>
      <div className="space-y-6">
        <PageHeader
          title="Experience"
          sub={`${items.length} work experiences`}
          action={<Btn onClick={openCreate}><span>+</span> Add Experience</Btn>}
        />

        {loading ? <Spinner /> : (
          <Table headers={['Role', 'Company', 'Period', 'Tags Preview', 'Actions']} empty={items.length === 0}>
            {items.map((e) => (
              <Tr key={e.id}
                onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = tok.accentDim }}
                onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = '' }}
              >
                {/* Role */}
                <Td>
                  <p className="font-semibold" style={{ color: tok.heading }}>{e.role}</p>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: tok.muted }}>{e.description}</p>
                </Td>

                {/* Company */}
                <Td muted>{e.company}</Td>

                {/* Period */}
                <Td>
                  <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: tok.accentDim, color: tok.accent, border: `1px solid ${tok.accentBor}` }}>
                    {e.period}
                  </span>
                </Td>

                {/* Tags preview */}
                <Td>
                  <div className="flex flex-wrap gap-1">
                    {parseTags(e.tags).slice(0, 3).map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: tok.accentDim, color: tok.accent }}>
                        {t}
                      </span>
                    ))}
                    {parseTags(e.tags).length > 3 && (
                      <span className="text-[10px]" style={{ color: tok.muted }}>+{parseTags(e.tags).length - 3} more</span>
                    )}
                  </div>
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
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Experience' : 'New Experience'}>
        <div className="space-y-4">

          {/* Row 1 – Role & Company */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Role / Position *"
              name="role"
              value={form.role}
              onChange={(v) => setForm({ ...form, role: v })}
              placeholder="Software Engineer Intern"
              required
            />
            <Field
              label="Company / Organization *"
              name="company"
              value={form.company}
              onChange={(v) => setForm({ ...form, company: v })}
              placeholder="PT Telkom Indonesia"
              required
            />
          </div>

          {/* Period */}
          <Field
            label="Period *"
            name="period"
            value={form.period}
            onChange={(v) => setForm({ ...form, period: v })}
            placeholder="Feb 2025 – Present  atau  2023 – 2024"
            required
          />

          {/* Description */}
          <Field
            label="Description *"
            name="description"
            value={form.description}
            onChange={(v) => setForm({ ...form, description: v })}
            as="textarea"
            rows={3}
            placeholder="Describe your role and responsibilities..."
            required
          />

          {/* Tags — satu tag per baris */}
          <div>
            <Field
              label="Tags (satu per baris)"
              name="tags"
              value={form.tags}
              onChange={(v) => setForm({ ...form, tags: v })}
              as="textarea"
              rows={3}
              placeholder={"Web Development\nBackend\nDatabase\nAPI"}
            />
            <p className="text-xs mt-1" style={{ color: tok.muted }}>
              Contoh: Web Development, Backend — tulis satu tag per baris
            </p>
          </div>

          {/* Achievements — satu achievement per baris */}
          <div>
            <Field
              label="Achievements (satu per baris)"
              name="achievements"
              value={form.achievements}
              onChange={(v) => setForm({ ...form, achievements: v })}
              as="textarea"
              rows={4}
              placeholder={"Developed CRUD features for internal systems.\nOptimized database queries.\nCollaborated with cross-functional teams."}
            />
            <p className="text-xs mt-1" style={{ color: tok.muted }}>
              Tulis satu achievement per baris
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>
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
