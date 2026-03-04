'use client'
import React, { useEffect, useRef, useState } from 'react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { motion } from 'framer-motion'
import {
  Btn, Spinner, Field, PageHeader, ToastContainer, useToast, tok
} from '@/components/dashboard/ui'
import { useSession } from 'next-auth/react'
import { mutate } from 'swr'

interface UserProfile {
  id: string
  email: string
  name: string | null
  image: string | null
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [data, setData] = useState<UserProfile | null>(null)
  const [loading, setLoad] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // States for form
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const load = async () => {
    setLoad(true)
    try {
      const res = await fetch('/api/admin/profile')
      if (res.ok) {
        const json = await res.json()
        setData(json)
        setName(json.name || '')
        setImage(json.image || '')
        setPreview(json.image || null)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load profile')
    }
    setLoad(false)
  }

  useEffect(() => { load() }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (res.ok) {
        const { url } = await res.json()
        setImage(url)
        setPreview(url)
        toast.success('Photo uploaded!')
      } else {
        toast.error('Upload failed')
        setPreview(image || null)
      }
    } catch (err) {
      toast.error('Upload failed')
      setPreview(image || null)
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (newPw && !currentPw) {
      toast.error('Current password is required to set a new password')
      return
    }

    setSaving(true)
    try {
      const body: any = { name, image }
      if (newPw) {
        body.currentPassword = currentPw
        body.newPassword = newPw
      }

      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success('Profile updated!')
        setCurrentPw('')
        setNewPw('')
        load()
        // Update session to reflect name/image change in UI
        update({ name, image })
      } else {
        const json = await res.json()
        toast.error(json.error || 'Update failed')
      }
    } catch (err) {
      toast.error('Update failed')
    }
    setSaving(false)
  }

  return (
    <DashboardShell title="Profile" breadcrumb={['Dashboard', 'Profile']}>
      <div className="max-w-2xl">
        <PageHeader 
          title="Account Settings" 
          sub="Update your personal information and login credentials."
        />

        {loading ? <Spinner /> : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Profile Photo Section */}
            <div className="p-8 rounded-2xl border" style={{ background: tok.card, borderColor: tok.border }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: tok.accent }}>Profile Photo</h3>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div 
                  className="w-32 h-32 rounded-3xl overflow-hidden border-2 flex items-center justify-center shrink-0 relative group"
                  style={{ borderColor: tok.accentBor, background: tok.accentDim }}
                >
                  {preview ? (
                    <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold" style={{ color: tok.accent }}>
                      {data?.name?.charAt(0).toUpperCase() || data?.email?.charAt(0).toUpperCase() || 'A'}
                    </span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-3 text-center sm:text-left">
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <Btn onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? 'Uploading...' : 'Change Photo'}
                    </Btn>
                    {image && (
                      <Btn variant="ghost" onClick={() => { setImage(''); setPreview(null) }}>
                        Remove
                      </Btn>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: tok.muted }}>
                    This photo will be displayed in the admin dashboard and portfolio management area.<br/>
                    Supported formats: JPG, PNG, WEBP. Max size: 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* General Info */}
            <div className="p-8 rounded-2xl border" style={{ background: tok.card, borderColor: tok.border }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: tok.accent }}>General Information</h3>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field 
                    label="Display Name" 
                    name="displayName"
                    value={name} 
                    onChange={setName} 
                    placeholder="e.g. Alvin Deo"
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wide opacity-50 block">Email Address</label>
                    <div className="px-4 py-3 rounded-xl border opacity-50 cursor-not-allowed text-sm" style={{ background: 'var(--bg-primary)', borderColor: tok.border }}>
                      {data?.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="p-8 rounded-2xl border" style={{ background: tok.card, borderColor: tok.border }}>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: tok.accent }}>Change Password</h3>
              <p className="text-xs mb-6 -mt-4 opacity-60">Leave blank if you don't want to change your password.</p>
              <div className="space-y-5">
                <Field 
                  label="Current Password" 
                  name="currentPassword"
                  type="password" 
                  value={currentPw} 
                  onChange={setCurrentPw} 
                  placeholder="Required to set new password"
                />
                <Field 
                  label="New Password" 
                  name="newPassword"
                  type="password" 
                  value={newPw} 
                  onChange={setNewPw} 
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4">
               <Btn variant="ghost" onClick={load} disabled={saving}>Reset Changes</Btn>
               <Btn onClick={handleSave} disabled={saving || uploading}>
                {saving ? 'Saving Changes...' : 'Save All Changes'}
               </Btn>
            </div>
          </motion.div>
        )}
      </div>

      <ToastContainer toasts={toast.toasts} />
    </DashboardShell>
  )
}
