'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/user/Navbar'
import Link from 'next/link'
import Footer from '@/components/user/Footer'
import { motion } from 'framer-motion'

function BackgroundCircles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0 flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[var(--accent)] opacity-[0.03]"
          style={{
            width: `${(i + 1) * 250}px`,
            height: `${(i + 1) * 250}px`,
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-transparent to-[var(--bg-primary)] opacity-80" />
    </div>
  );
}

const contactInfo = [
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: 'Email',
    value: 'alvindeoardiansyah@gmail.com',
    href: 'mailto:alvindeoardiansyah@gmail.com',
  },
  {
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    label: 'GitHub',
    value: 'alvindeo',
    href: 'https://github.com/alvindeo',
  },
  {
    icon: (
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    label: 'LinkedIn',
    value: 'linkedin.com/in/alvin-deo-ardiansyah',
    href: 'https://www.linkedin.com/in/alvin-deo-ardiansyah-04b7602b4/',
  },
  {
    icon: (
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: 'Location',
    value: 'Semarang, Indonesia',
    href: null,
  },
]

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

// ── Shared form logic extracted as a hook-like component ──────────────────
function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [countdown, setCountdown] = useState(0)

  // Auto-reset: success resets in 4s, error clears in 5s
  React.useEffect(() => {
    if (status !== 'success' && status !== 'error') return
    const totalSeconds = status === 'success' ? 4 : 5
    setCountdown(totalSeconds)

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const timeout = setTimeout(() => {
      setStatus('idle')
      setErrorMsg('')
      if (status === 'success') {
        setForm({ name: '', email: '', subject: '', message: '' })
      }
    }, totalSeconds * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Terjadi kesalahan')
      }
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const inputStyle = {
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    padding: '12px 16px',
    width: '100%',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10">
      {/* Left — Contact Info */}
      <div className="md:col-span-2 flex flex-col gap-6">
        <div className="p-8 rounded-2xl h-full" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
          <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>Get in Touch</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
            I'm currently open to new opportunities and collaborations. Feel free to reach out!
          </p>
          <div className="space-y-5">
            {contactInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>{info.label}</p>
                  {info.href ? (
                    <a href={info.href} target={info.href.startsWith('http') ? '_blank' : undefined}
                      className="text-sm font-medium hover:text-[var(--accent)] transition-colors"
                      style={{ color: 'var(--text-primary)' }}>
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{info.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 p-4 rounded-xl flex items-center gap-3"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ background: 'var(--accent)' }} />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Available for freelance & full-time opportunities</p>
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="md:col-span-3">
        <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
          <h2 className="text-lg font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>Send a Message</h2>
          {status === 'success' && (
            <div className="mb-6 p-4 rounded-xl flex items-start gap-3 transition-all duration-500"
              style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <span style={{ color: 'var(--accent)', fontSize: '20px' }}>✓</span>
              <div className="flex-1">
                <p className="font-semibold text-sm" style={{ color: 'var(--accent)' }}>Pesan berhasil dikirim!</p>
                <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Terima kasih! Akan saya balas secepatnya.</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--accent-dim)', opacity: 0.3 }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: 'var(--accent)',
                        width: `${(countdown / 4) * 100}%`,
                        transition: 'width 1s linear',
                      }}
                    />
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--accent)' }}>Reset dalam {countdown}s</span>
                </div>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-6 p-4 rounded-xl transition-all duration-500"
              style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)' }}>
              <p className="text-sm font-semibold" style={{ color: '#ff6b6b' }}>⚠ {errorMsg}</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,80,80,0.2)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: '#ff6b6b',
                      width: `${(countdown / 5) * 100}%`,
                      transition: 'width 1s linear',
                    }}
                  />
                </div>
                <span className="text-xs shrink-0" style={{ color: '#ff6b6b' }}>Tutup dalam {countdown}s</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Full Name <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  placeholder="You're name" required className="input-field" style={inputStyle} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                  Email Address <span style={{ color: 'var(--accent)' }}>*</span>
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="[EMAIL_ADDRESS]" required className="input-field" style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Subject <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <input type="text" name="subject" value={form.subject} onChange={handleChange}
                placeholder="Project Collaboration" required className="input-field" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                Message <span style={{ color: 'var(--accent)' }}>*</span>
              </label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="Tell me about your project or just say hi..." required rows={6}
                className="input-field resize-none" style={inputStyle} />
            </div>
            <button type="submit" disabled={status === 'loading'}
              className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ── Named export for embedding in home page ────────────────────────────────
export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <BackgroundCircles />
      <style>{`
        .input-field:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-dim); }
      `}</style>
      <div className="max-w-6xl mx-auto text-center mb-14">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>Contact</p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>
          Let's work <span style={{ color: 'var(--accent)' }}>together</span>
        </h2>
        <p className="mt-3 text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
          Have a project in mind or just want to say hi? Fill out the form below and I'll get back to you soon.
        </p>
      </div>
      <ContactForm />
    </section>
  )
}

// ── Default export for standalone /contact page ───────────────────────────
export default function ContactPage() {
  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <BackgroundCircles />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .input-field:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px var(--accent-dim); }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 30px var(--accent-dim); }
        ::selection { background: var(--accent); color: var(--bg-primary); }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.2
        }} />
        <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)'
        }} />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>
            Contact
          </p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'var(--text-heading)'
          }}>
            Let's work <span style={{ color: 'var(--accent)' }}>together</span>
          </h1>
          <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
            Have a project in mind or just want to say hi? Fill out the form below and I'll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section className="pb-24 px-6">
        <ContactForm />
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  )
}