'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import SafeStackIcon from '@/components/ui/SafeStackIcon'

// ── TYPES ──────────────────────────────────────────────────────────────────

interface AboutData {
  id?: string
  name: string
  title: string
  bio: string
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

interface EducationData {
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

interface CertificateData {
  id: string
  title: string
  issuer: string
  year: string
  imageUrl?: string
  url?: string
}

interface SkillData {
  id: string
  name: string
  category: string
  level: number
  icon: string | null
}

// ── FALLBACK DATA ──────────────────────────────────────────────────────────

const fallbackSkillGroups = [
  {
    category: 'Frontend',
    skills: [
      { name: 'React', icon: 'react' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Tailwind CSS', icon: 'tailwindcss' },
      { name: 'Figma', icon: 'figma' },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'Python', icon: 'python' },
      { name: 'Laravel', icon: 'laravel' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'PostgreSQL', icon: 'postgresql' },
    ],
  },
  {
    category: 'AI / ML',
    skills: [
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'OpenAI', icon: 'openai' },
      { name: 'Google Colab', icon: 'colab' },
    ],
  },
  {
    category: 'Tools',
    skills: [
      { name: 'Git', icon: 'git' },
      { name: 'GitHub', icon: 'github' },
      { name: 'Docker', icon: 'docker' },
      { name: 'VS Code', icon: 'vscode' },
      { name: 'Postman', icon: 'postman' },
    ],
  },
]

const fallbackEducation = [
  {
    id: '1',
    degree: 'S1 Informatics Engineering',
    institution: 'Universitas Dian Nuswantoro (UDINUS)',
    period: '2023 – Present',
    description: 'Focusing on Artificial Intelligence, Machine Learning, and Software Engineering.',
    gpa: '3.77 / 4.0',
    image: '/education/udinus.png',
    location: 'Semarang, Indonesia',
  },
  {
    id: '2',
    degree: 'SMA Negeri 5 Semarang',
    institution: 'SMA Negeri 5 Semarang',
    period: '2019 – 2022',
    description: 'Focusing on Science and Mathematics.',
    gpa: '84.94 / 100',
    image: '/education/sma.png',
    location: 'Semarang, Indonesia',
  },
]

const fallbackCertifications = [
  {
    id: '1',
    title: 'Artificial Intelligence Essentials V2',
    issuer: 'Coursera – DeepLearning.AI',
    year: '2025',
    image: '/certif/Artificial_Intelliegence.png',
    url: 'https://www.credly.com/badges/74fc8006-f5eb-454f-9705-5925a6d064ce/linked_in_profile',
  },
]

// ── ANIMATION ─────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.08,
      ease: 'easeOut' as const,
    },
  }),
}

// ── UTILITIES ─────────────────────────────────────────────────────────────



// ── SHARED COMPONENT ────────────────────────────────────────────────────────

export function AboutSection() {
  const [about, setAbout] = useState<AboutData | null>(null)

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((d) => { if (d?.name) setAbout(d) })
      .catch(console.error)
  }, [])

  const name  = about?.name    ?? 'Alvin Deo Ardiansyah'
  const title = about?.title   ?? 'Frontend & UI/UX Enthusiast · Software Engineer · Data Analyst'
  const bio   = about?.bio     ?? 'I am an Informatics Engineering student with a strong interest in Artificial Intelligence, Machine Learning, and web-based system development.'
  const bio2  = about?.bio2    ?? 'I have experience building a Computer Vision system using YOLOv8 for cataract detection, and developed a RAG-based chatbot integrated with LLM APIs.'
  const photo = about?.photoUrl ?? '/foto_alvin.jpg'

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-50" style={{
        background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)'
      }} />

      <div className="relative z-10">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>About Me</p>

        <div className="flex flex-col md:flex-row gap-14 items-start">
          {/* Stacked Photo */}
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-48 h-56 md:w-56 md:h-64 flex-shrink-0"
          >
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--bg-secondary)', transform: 'rotate(6deg) translate(10px, 10px)', border: '1px solid var(--card-border)' }} />
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--bg-card)', transform: 'rotate(3deg) translate(5px, 5px)', border: '1px solid var(--accent-border)' }} />
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--accent-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex-1"
          >
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, color: 'var(--text-heading)' }}>
              {name}
            </h2>
            <p className="mt-3 text-sm font-medium tracking-wide" style={{ color: 'var(--accent)' }}>{title}</p>
            <div className="mt-6 space-y-4">
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{bio}</p>
              {bio2 && <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{bio2}</p>}
              <div className="pt-4">
                <Link href="/user/about" className="text-sm font-medium transition-colors duration-200" style={{ color: 'var(--accent)' }}>
                  Read more about my journey →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

// ── PAGE ─────────────────────────────────────────────────────────────

export default function AboutPage() {
  const [about, setAbout]       = useState<AboutData | null>(null)
  const [eduList, setEduList]   = useState<EducationData[]>([])
  const [certList, setCertList] = useState<CertificateData[]>([])
  const [skillList, setSkillList] = useState<SkillData[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aRes, eRes, cRes, sRes] = await Promise.all([
          fetch('/api/about'),
          fetch('/api/education'),
          fetch('/api/certificates'),
          fetch('/api/skills'),
        ])
        
        if (aRes.ok) {
          const d = await aRes.json()
          if (d && d.name) setAbout(d)
        }
        
        if (eRes.ok) {
          const d = await eRes.json()
          if (Array.isArray(d) && d.length > 0) setEduList(d)
        }

        if (cRes.ok) {
          const d = await cRes.json()
          if (Array.isArray(d) && d.length > 0) setCertList(d)
        }

        if (sRes.ok) {
           const d = await sRes.json()
           if (Array.isArray(d) && d.length > 0) setSkillList(d)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Derived Values
  const name = about?.name ?? 'Alvin Deo Ardiansyah'
  const title = about?.title ?? 'Frontend & UI/UX Enthusiast · Software Engineer · Data Analyst'
  const photo = about?.photoUrl ?? '/foto_alvin.jpg'
  const bios = [
    about?.bio ?? 'I am an Informatics Engineering student with a strong interest in Artificial Intelligence, Machine Learning, and web-based system development.',
    about?.bio2 ?? 'I have experience building a Computer Vision system using YOLOv8 for cataract detection, and developed a RAG-based chatbot integrated with LLM APIs.',
    about?.bio3,
    about?.bio4
  ].filter(Boolean) as string[]

  const displayEdu = eduList.length > 0 ? eduList : (fallbackEducation as any[])
  const displayCert = certList.length > 0 ? certList : (fallbackCertifications as any[])
  
  // Group real skills
  const groupedSkills: Record<string, SkillData[]> = {}
  skillList.forEach(s => {
    groupedSkills[s.category] = [...(groupedSkills[s.category] ?? []), s]
  })
  
  const displaySkillGroups = skillList.length > 0 
    ? Object.entries(groupedSkills).map(([cat, sks]) => ({ category: cat, skills: sks.map(s => ({ name: s.name, icon: s.icon })) }))
    : fallbackSkillGroups

  const github = about?.github ?? 'https://github.com/alvindeo'
  const linkedin = about?.linkedin ?? 'https://www.linkedin.com/in/alvin-deo-ardiansyah-04b7602b4/'
  const email = about?.email ?? 'alvindeoardiansyah@gmail.com'
  const cvLink = about?.cvUrl ?? 'https://drive.google.com/file/d/1a2l6_3NT6NldrmckVo0H-aszMaTcqg5_/view?usp=sharing'

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', transition: 'background 0.3s ease, color 0.3s ease' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .skill-card { transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
        .skill-card:hover { transform: translateY(-6px) scale(1.05); box-shadow: 0 12px 32px var(--accent-glow); border-color: var(--accent-border) !important; }
        .tag { background: var(--accent-dim); color: var(--accent); padding: 4px 12px; border-radius: 99px; font-size: 0.7rem; font-weight: 700; border: 1px solid var(--accent-border); }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute -top-20 left-1/3 w-96 h-96 rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)'
        }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, color: 'var(--text-heading)' }}>
            My Professional <br />
            <span style={{ color: 'var(--accent)' }}>Journey & Skills</span>
          </motion.h1>
        </div>
      </section>

      {/* ── BIO + PHOTO ── */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-14 items-start">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative w-52 h-64 md:w-64 md:h-80 flex-shrink-0 mx-auto md:mx-0 mt-4"
          >
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--bg-secondary)', transform: 'rotate(6deg) translate(10px, 10px)', border: '1px solid var(--card-border)' }} />
            <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--bg-card)', transform: 'rotate(3deg) translate(5px, 5px)', border: '1px solid var(--accent-border)' }} />
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ border: '1px solid var(--accent-border)', boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
              <img src={photo} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl text-xs font-semibold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)', boxShadow: '0 4px 20px var(--accent-glow)' }}>Open to Work ✦</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }} className="flex-1 pt-4">
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, lineHeight: 1.15, color: 'var(--text-heading)' }}>{name}</h2>
            <p className="mt-2 text-sm font-medium tracking-wide" style={{ color: 'var(--accent)' }}>{title}</p>
            <div className="mt-6 space-y-4">
              {bios.map((text, i) => (
                <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{text}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: 'GitHub', href: github, icon: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
                { label: 'LinkedIn', href: linkedin, icon: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
                { label: 'Email', href: `mailto:${email}`, icon: <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 hover:opacity-80 hover:scale-105" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }}>{s.icon} {s.label}</a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Skills</p>
          <h2 className="mb-14" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Technologies I work with</h2>
          <div className="grid md:grid-cols-2 gap-12">
            {displaySkillGroups.map((group, gi) => (
              <div key={gi}>
                <div className="flex items-center gap-4 mb-6"><span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>{group.category}</span><div className="flex-1 h-px" style={{ background: 'var(--card-border)' }} /></div>
                <div className="flex flex-wrap gap-4">
                  {group.skills.map((skill, si) => (
                    <motion.div key={si} custom={si} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="skill-card flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default w-24" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
                      <div className="w-10 h-10 flex items-center justify-center">
                         {skill.icon ? <SafeStackIcon name={skill.icon} className="w-10 h-10" /> : <div className="text-[10px] opacity-20">N/A</div>}
                      </div>
                      <span className="text-xs font-medium text-center leading-tight" style={{ color: 'var(--text-muted)' }}>{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Education</p>
          <h2 className="mb-12" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Academic background</h2>
          <div className="flex flex-col gap-6">
          {displayEdu.map((edu, i) => (
            <motion.div key={edu.id || i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-2xl overflow-hidden card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}>
              <div className="flex flex-col md:flex-row">
                <div className="flex items-center justify-center p-8 shrink-0" style={{ minWidth: '240px', background: 'var(--bg-skills)', borderRight: '1px solid var(--card-border)', minHeight: '200px' }}>
                  {(edu.imageUrl || (edu as any).image) ? <img src={edu.imageUrl || (edu as any).image} alt={edu.institution} className="max-h-28 max-w-[200px] object-contain" /> : <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>🎓</div>}
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="tag">
                      {edu.period ?? (edu as any).period}
                      </span>
                      {edu.location && (
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                          </svg>
                          {edu.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{edu.degree}</h3>
                    <p className="text-base font-semibold mb-3" style={{ color: 'var(--accent)' }}>{edu.institution}</p>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{edu.description}</p>
                  </div>
                  {edu.gpa && <div className="flex items-center gap-3"><div className="px-4 py-2 rounded-xl flex items-center gap-2" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}><svg width="13" height="13" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>GPA {edu.gpa}</span></div></div>}
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: 'var(--accent)' }}>Certifications</p>
          <h2 className="mb-12" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Credentials & achievements</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCert.map((cert, i) => (
              <motion.a key={cert.id || i} href={cert.url || '#'} target="_blank" rel="noopener noreferrer" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} whileHover={{ y: -8 }} className="group block rounded-2xl overflow-hidden cursor-pointer" style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                <div className="relative w-full overflow-hidden" style={{ height: '180px', background: 'var(--bg-secondary)' }}>
                  {(cert.imageUrl || (cert as any).image) ? <img src={cert.imageUrl || (cert as any).image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--accent-dim)' }}><svg width="40" height="40" fill="none" stroke="var(--accent)" strokeWidth="1.5" viewBox="0 0 24 24" opacity="0.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div>}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>{cert.year}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-sm leading-tight mb-1 group-hover:underline" style={{ color: 'var(--text-heading)' }}>{cert.title}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--accent)' }}>{cert.issuer}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, var(--hero-glow) 0%, transparent 70%)' }} />
        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="mb-4" style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: 'var(--text-heading)' }}>Want to work together?</h2>
            <p className="text-base mb-10" style={{ color: 'var(--text-muted)' }}>I'm currently open to new opportunities. Let's build something amazing together.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/#contact" className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}>Get in Touch</Link>
              <a href={cvLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm border transition-all duration-200 hover:opacity-80 hover:scale-105" style={{ borderColor: 'var(--btn-outline-border)', color: 'var(--btn-outline-text)' }}><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download CV</a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
