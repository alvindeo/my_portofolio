'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Design Tokens ────────────────────────────────────────────────────────────
export const tok = {
  bg:       'var(--bg-primary)',
  card:     'var(--bg-card)',
  border:   'var(--card-border)',
  accent:   'var(--accent)',
  accentDim:'var(--accent-dim)',
  accentBor:'var(--accent-border)',
  text:     'var(--text-primary)',
  muted:    'var(--text-muted)',
  heading:  'var(--text-heading)',
}

// ── Toast ────────────────────────────────────────────────────────────────────
interface Toast { id: number; msg: string; type: 'success' | 'error' }

export function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const add = (msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }
  return { toasts, success: (m: string) => add(m, 'success'), error: (m: string) => add(m, 'error') }
}

export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            exit={{    opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-lg pointer-events-auto"
            style={{
              background: t.type === 'success' ? '#10b981' : '#ef4444',
              color: '#fff',
              minWidth: 240,
            }}
          >
            <span>{t.type === 'success' ? '✓' : '✕'}</span>
            {t.msg}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({
  open, onClose, title, children,
}: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
          <motion.div
            key="modal-content"
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.93, y: 16 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6 space-y-5"
            style={{ background: tok.card, border: `1px solid ${tok.border}` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color: tok.heading }}>{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: tok.muted }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Form helpers ─────────────────────────────────────────────────────────────
export function Field({
  label, name, value, onChange, type = 'text', placeholder, required, as, rows,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean
  as?: 'textarea'; rows?: number
}) {
  const base: React.CSSProperties = {
    background: tok.bg, color: tok.text,
    border: `1px solid ${tok.border}`, borderRadius: 10,
    padding: '10px 12px', width: '100%', fontSize: 14, outline: 'none',
    fontFamily: 'inherit',
  }
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: tok.muted }}>{label}{required && ' *'}</label>
      {as === 'textarea'
        ? <textarea name={name} value={value} onChange={(e) => onChange(e.target.value)}
            rows={rows ?? 4} placeholder={placeholder} style={base} />
        : <input name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} required={required} style={base} />
      }
    </div>
  )
}

export function CheckField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className="w-5 h-5 rounded flex items-center justify-center transition-all"
        style={{ background: checked ? tok.accent : tok.bg, border: `2px solid ${checked ? tok.accent : tok.border}` }}
        onClick={() => onChange(!checked)}
      >
        {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>}
      </div>
      <span className="text-sm" style={{ color: tok.text }}>{label}</span>
    </label>
  )
}

// ── Buttons ──────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', type = 'button', disabled, className }: {
  children: React.ReactNode; onClick?: () => void
  variant?: 'primary' | 'ghost' | 'danger'; type?: 'button' | 'submit'; disabled?: boolean; className?: string
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: tok.accent,  color: tok.bg,   border: `1px solid ${tok.accent}` },
    ghost:   { background: 'transparent', color: tok.muted, border: `1px solid ${tok.border}` },
    danger:  { background: '#ef444418', color: '#ef4444', border: '1px solid #ef444430' },
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-85 active:scale-95 disabled:opacity-40 ${className ?? ''}`}
      style={styles[variant]}
    >
      {children}
    </button>
  )
}

// ── Table shell ──────────────────────────────────────────────────────────────
export function Table({ headers, children, empty }: {
  headers: string[]; children: React.ReactNode; empty?: boolean
}) {
  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: tok.border }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: `1px solid ${tok.border}`, background: tok.bg }}>
            {headers.map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: tok.muted }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && (
        <div className="text-center py-16" style={{ color: tok.muted }}>
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm">No data yet. Add your first entry.</p>
        </div>
      )}
    </div>
  )
}

export function Tr({ children, onMouseEnter, onMouseLeave, index }: {
  children: React.ReactNode
  onMouseEnter?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
  index?: number
}) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: (index ?? 0) * 0.04, ease: 'easeOut' }}
      style={{ borderBottom: `1px solid ${tok.border}` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.tr>
  )
}

export function Td({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className="px-4 py-3" style={{ color: muted ? tok.muted : tok.text }}>{children}</td>
  )
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide whitespace-nowrap" style={{ color: tok.muted }}>{children}</th>
  )
}

// ── Page header ──────────────────────────────────────────────────────────────
export function PageHeader({ title, sub, action }: {
  title: string; sub?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: tok.heading }}>{title}</h1>
        {sub && <p className="text-sm mt-1" style={{ color: tok.muted }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Confirm delete dialog ─────────────────────────────────────────────────────
export function ConfirmDelete({ open, onCancel, onConfirm, loading }: {
  open: boolean; onCancel: () => void; onConfirm: () => void; loading?: boolean
}) {
  return (
    <Modal open={open} onClose={onCancel} title="Confirm Delete">
      <p className="text-sm" style={{ color: tok.muted }}>
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3 pt-2">
        <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
        <Btn variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? 'Deleting…' : 'Delete'}
        </Btn>
      </div>
    </Modal>
  )
}

// ── Loading spinner ───────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: tok.accentBor, borderTopColor: tok.accent }} />
    </div>
  )
}
