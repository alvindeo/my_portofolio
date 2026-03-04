'use client'
import React, { useEffect, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  Btn, Spinner, Table, Td, Tr, Modal, Field,
  ConfirmDelete, PageHeader, ToastContainer, useToast, tok, SafeStackIcon
} from '@/components/dashboard/ui'

interface Skill { id: string; name: string; category: string; level: number; icon: string | null }
const EMPTY = { name: '', category: '', level: 80, icon: '' }

const LEVEL_COLORS = (lvl: number) =>
  lvl >= 80 ? '#10b981' : lvl >= 60 ? '#f59e0b' : '#ef4444'

export default function DashboardSkills() {
  const [items, setItems]       = useState<Skill[]>([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [delId, setDelId]       = useState<string | null>(null)
  const [saving, setSaving]     = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm]         = useState(EMPTY)
  const [editId, setEditId]     = useState<string | null>(null)
  const [debouncedIcon, setDebouncedIcon] = useState('')
  const toast = useToast()

  // Debounce icon preview — hanya render setelah 400ms berhenti mengetik
  useEffect(() => {
    const t = setTimeout(() => setDebouncedIcon(form.icon.trim()), 400)
    return () => clearTimeout(t)
  }, [form.icon])

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/skills')
    if (res.ok) {
       const data = await res.json()
       setItems(Array.isArray(data) ? data : [])
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit   = (s: Skill) => { 
    setForm({ name: s.name, category: s.category, level: s.level, icon: s.icon ?? '' })
    setEditId(s.id); setModal(true) 
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, level: Number(form.level), icon: form.icon || null }
    const res = editId
      ? await fetch(`/api/skills/${editId}`, { method: 'PUT',  headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/skills',            { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { toast.success(editId ? 'Skill updated!' : 'Skill added!'); setModal(false); load() }
    else toast.error('Something went wrong.')
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!delId) return
    setDeleting(true)
    const res = await fetch(`/api/skills/${delId}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Skill deleted.'); load() }
    else toast.error('Failed to delete.')
    setDeleting(false); setDelId(null)
  }

  // Group by category
  const grouped: Record<string, Skill[]> = {}
  items.forEach((s) => { grouped[s.category] = [...(grouped[s.category] ?? []), s] })

  return (
    <DashboardShell title="Skills" breadcrumb={['Dashboard', 'Skills']}>
      <div className="space-y-6">
        <PageHeader
          title="Skills"
          sub={`${items.length} skills across ${Object.keys(grouped).length} categories`}
          action={<Btn onClick={openCreate}><span>+</span> Add Skill</Btn>}
        />

        {loading ? <Spinner /> : (
          <Table headers={['Icon', 'Skill', 'Category', 'Level', 'Actions']} empty={items.length === 0}>
            {Object.entries(grouped).map(([cat, skills]) => (
              <React.Fragment key={cat}>
                <tr style={{ background: 'var(--bg-secondary, #f4f4f5)' }}>
                  <td colSpan={5} className="px-4 py-2" style={{ borderTop: `1px solid ${tok.border}`, borderBottom: `1px solid ${tok.border}` }}>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: tok.muted, opacity: 0.7 }}>{cat || 'Uncategorized'}</span>
                  </td>
                </tr>
                {skills.map((s) => (
                  <Tr key={s.id}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = tok.accentDim }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '' }}
                  >
                    <Td>
                       {s.icon ? (
                         <div className="w-8 h-8 flex items-center justify-center p-1 rounded-lg border" style={{ background: 'var(--bg-secondary)', borderColor: tok.border }}>
                          <SafeStackIcon name={s.icon} className="w-full h-full" />
                         </div>
                       ) : (
                         <div className="w-8 h-8 flex items-center justify-center rounded-lg text-[10px]" style={{ background: 'var(--bg-secondary)', color: tok.muted }}>N/A</div>
                       )}
                    </Td>
                    <Td><span className="font-semibold" style={{ color: tok.heading }}>{s.name}</span></Td>
                    <Td muted>{s.category}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: tok.bg, minWidth: 80 }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${s.level}%`, background: LEVEL_COLORS(s.level) }} />
                        </div>
                        <span className="text-xs font-semibold w-8 text-right" style={{ color: LEVEL_COLORS(s.level) }}>{s.level}%</span>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-2">
                        <Btn variant="ghost" onClick={() => openEdit(s)}>Edit</Btn>
                        <Btn variant="danger" onClick={() => setDelId(s.id)}>Delete</Btn>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </React.Fragment>
            ))}
          </Table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Edit Skill' : 'New Skill'}>
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr,64px] gap-4 items-end">
            <Field label="Skill Name" name="name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required placeholder="e.g. React" />
            <div className="flex flex-col gap-2">
               <label className="text-xs font-semibold uppercase tracking-wide opacity-50">Icon</label>
               <div className="w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center bg-zinc-50 dark:bg-zinc-800" style={{ borderColor: tok.border }}>
                  {debouncedIcon
                    ? <SafeStackIcon name={debouncedIcon} className="w-8 h-8" />
                    : <span className="opacity-20 text-[10px]">?</span>
                  }
               </div>
            </div>
          </div>

          <div>
            <Field 
              label="Icon Slug (tech-stack-icons)" 
              name="icon" 
              value={form.icon} 
              onChange={(v) => setForm({ ...form, icon: v.toLowerCase() })} 
              placeholder="e.g. react, nextjs, tailwindcss, nodejs"
            />
            <p className="text-xs mt-1" style={{ color: tok.muted }}>
              Cek slug di{' '}
              <a href="https://www.npmjs.com/package/tech-stack-icons" target="_blank" rel="noopener noreferrer" style={{ color: tok.accent }}>
                tech-stack-icons
              </a>
            </p>
          </div>

          <Field label="Category" name="category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} placeholder="Frontend / Backend / AI / Tools" />
          
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: tok.muted }}>
              Profiency Level: <span style={{ color: LEVEL_COLORS(Number(form.level)) }}>{form.level}%</span>
            </label>
            <input type="range" min="0" max="100" value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
              className="w-full mt-2" style={{ accentColor: tok.accent }} />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: tok.border }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Skill'}</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDelete open={!!delId} onCancel={() => setDelId(null)} onConfirm={handleDelete} loading={deleting} />
      <ToastContainer toasts={toast.toasts} />
    </DashboardShell>
  )
}

