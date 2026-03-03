'use client'
import React, { useEffect, useState, useRef } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import {
  Btn, Spinner, Modal, Field, PageHeader, ToastContainer, useToast, Tr, Td, Table, tok
} from '@/components/dashboard/ui'
import { Plus, Pencil, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'

interface Certificate {
  id?: string
  title: string
  issuer: string
  year: string
  imageUrl?: string
  url?: string
}

const EMPTY: Certificate = { title: '', issuer: '', year: '', imageUrl: '', url: '' }

export default function DashboardCertificates() {
  const [items, setItems] = useState<Certificate[]>([])
  const [loading, setLoad] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<Certificate>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const load = async () => {
    setLoad(true)
    try {
      const res = await fetch('/api/certificates')
      if (res.ok) {
        const data = await res.json()
        setItems(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error(err)
    }
    setLoad(false)
  }
  useEffect(() => { load() }, [])

  const handleEdit = (it: Certificate) => { setForm(it); setModal(true) }
  const handleAdd = () => { setForm(EMPTY); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    const url = form.id ? `/api/certificates/${form.id}` : '/api/certificates'
    const method = form.id ? 'PUT' : 'POST'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) { toast.success('Certificate saved'); setModal(false); load() }
    else toast.error('Failed to save')
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate?')) return
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' })
    if (res.ok) { toast.success('Deleted'); load() }
    else toast.error('Failed deletion')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    setUploading(true)
    const fd = new FormData(); fd.append('file', f)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (res.ok) {
      const { url } = await res.json()
      setForm((prev) => ({ ...prev, imageUrl: url }))
      toast.success('Certificate image uploaded!')
    } else toast.error('Upload failed')
    setUploading(false)
  }

  return (
    <DashboardShell title="Certificates" breadcrumb={['Dashboard', 'Certificates']}>
      <div className="space-y-6">
        <PageHeader
          title="Certifications"
          sub="Showcase your professional achievements and credentials."
          action={<Btn onClick={handleAdd} className="flex items-center gap-2"><span>+</span> Add New</Btn>}
        />

        {loading ? <Spinner /> : (
          <Table headers={['Preview', 'Certificate & Issuer', 'Year', 'Actions']} empty={items.length === 0}>
            {items.map((it, idx) => (
              <Tr key={it.id || idx} index={idx}
                onMouseEnter={(ev) => { (ev.currentTarget as HTMLElement).style.background = tok.accentDim }}
                onMouseLeave={(ev) => { (ev.currentTarget as HTMLElement).style.background = '' }}
              >
                <Td>
                  {it.imageUrl ? (
                    <div className="w-14 h-10 rounded-lg overflow-hidden border shadow-sm" style={{ borderColor: tok.border }}>
                      <img src={it.imageUrl} className="w-full h-full object-cover" alt="Cert" />
                    </div>
                  ) : <div className="w-14 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-[10px] opacity-20">N/A</div>}
                </Td>
                <Td>
                  <div className="font-bold" style={{ color: tok.heading }}>{it.title}</div>
                  <div className="text-xs font-medium opacity-60" style={{ color: tok.accent }}>{it.issuer}</div>
                  {it.url && (
                    <a href={it.url} target="_blank" className="inline-flex items-center gap-1 text-[10px] mt-1 hover:underline opacity-50 hover:opacity-100" style={{ color: tok.accent }}>
                      <ExternalLink size={10}/> Verify Credential
                    </a>
                  )}
                </Td>
                <Td><span className="text-sm font-semibold">{it.year}</span></Td>
                <Td>
                  <div className="flex gap-2">
                    <Btn variant="ghost" onClick={() => handleEdit(it)}>Edit</Btn>
                    <Btn variant="danger" onClick={() => it.id && handleDelete(it.id)}>Delete</Btn>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={form.id ? 'Edit Certificate' : 'New Certificate'}>
        <div className="space-y-4">
          <Field label="Certificate Title" name="title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required placeholder="e.g. Meta Frontend Developer Professional Certificate" />
          <Field label="Issuing Organization" name="issuer" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} required placeholder="Coursera, Google, Microsoft, dsb." />
          
          <div className="flex items-center gap-4 py-3 border-y" style={{ borderColor: tok.border }}>
            <div className="w-20 h-14 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden" 
              style={{ borderColor: tok.accentBor, background: 'var(--accent-dim)' }}>
              {form.imageUrl 
                ? <img src={form.imageUrl} className="w-full h-full object-cover" alt="Preview"/>
                : <ImageIcon size={20} className="opacity-20"/>
              }
            </div>
            <div className="flex-1">
              <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleUpload}/>
              <Btn variant="ghost" className="text-xs" onClick={() => fileRef.current?.click()} disabled={uploading}>
                 {uploading ? 'Uploading...' : '📁 Upload Certificate Image'}
              </Btn>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year" name="year" value={form.year} onChange={(v) => setForm({ ...form, year: v })} placeholder="2025" />
            <Field label="Verify URL (Link Sertif)" name="url" value={form.url ?? ''} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://..." />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: tok.border }}>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
            <Btn onClick={handleSave} disabled={saving || uploading}>{saving ? 'Saving...' : 'Save Certificate'}</Btn>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toast.toasts} />
    </DashboardShell>
  )
}
