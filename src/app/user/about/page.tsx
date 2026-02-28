'use client'

import React from 'react'
import { Navbar } from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import Link from 'next/link'
import { motion } from 'framer-motion'

const skills = [
  { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma'] },
  { category: 'Backend', items: ['Python', 'Laravel', 'Node.js', 'REST API', 'PostgreSQL'] },
  { category: 'AI / ML', items: ['YOLOv8', 'RAG', 'LLM APIs', 'Computer Vision', 'Machine Learning'] },
  { category: 'Tools', items: ['Git', 'Docker', 'VS Code', 'Postman', 'Linux'] },
]

const stats = [
  { value: '10+', label: 'Projects Built' },
  { value: '3+', label: 'Years Learning' },
  { value: '15+', label: 'Technologies' },
  { value: '100+', label: 'Event Participants' },
]

export function AboutSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full pointer-events-none opacity-50" style={{
        background: 'radial-gradient(circle, rgba(0,173,181,0.07) 0%, transparent 70%)'
      }} />

      <div className="relative z-10">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#00ADB5' }}>
          About Me
        </p>

        <div className="flex flex-col md:flex-row gap-14 items-start">
          {/* Stacked Photo - From Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-48 h-56 md:w-56 md:h-64 flex-shrink-0"
          >
            <div className="absolute inset-0 rounded-2xl" style={{
              background: '#2a2f38',
              transform: 'rotate(6deg) translate(10px, 10px)',
              border: '1px solid rgba(0,173,181,0.1)',
            }} />
            <div className="absolute inset-0 rounded-2xl" style={{
              background: '#323840',
              transform: 'rotate(3deg) translate(5px, 5px)',
              border: '1px solid rgba(0,173,181,0.15)',
            }} />
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{
              border: '1px solid rgba(0,173,181,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}>
              <img
                src="/foto_alvin.jpg"
                alt="Alvin Deo Ardiansyah"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Bio - From Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex-1"
          >
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
            }}>
              Alvin Deo Ardiansyah
            </h2>

            <p className="mt-3 text-sm font-medium tracking-wide" style={{ color: '#00ADB5' }}>
              Frontend & UI/UX Enthusiast · Software Engineer · Data Analyst
            </p>

            <div className="mt-6 space-y-4">
              <p className="text-base leading-relaxed" style={{ color: '#EEEEEE99' }}>
                I am an Informatics Engineering student with a strong interest in Artificial Intelligence,
                Machine Learning, and web-based system development.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#EEEEEE99' }}>
                I have experience building a Computer Vision system using YOLOv8 for cataract detection,
                and developed a RAG-based chatbot integrated with LLM APIs to deliver intelligent, context-aware responses.
              </p>
              <div className="pt-4">
                <Link
                  href="/user/about"
                  className="text-sm font-medium transition-colors duration-200 hover:text-[#00ADB5]"
                  style={{ color: '#00ADB5' }}
                >
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

export default function AboutPage() {
  return (
    <div style={{ background: '#222831', color: '#EEEEEE', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:rgba(0,173,181,0.12); color:#00ADB5; border:1px solid rgba(0,173,181,0.25); }
        .card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,173,181,0.12); }
        ::selection { background: #00ADB5; color: #222831; }
      `}</style>

      <Navbar />
      
      <div className="pt-32 pb-10 px-6 max-w-6xl mx-auto">
        <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00ADB5' }}>About</p>
        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 800,
          lineHeight: 1,
        }}>
          My Professional <br />
          <span style={{ color: '#00ADB5' }}>Journey & Skills</span>
        </h1>
      </div>

      {/* ── STATS ── */}
      <section className="py-14 px-6" style={{ background: '#1a1f26' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl card-hover"
              style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.1)' }}>
              <div className="text-3xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: '#00ADB5' }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: '#EEEEEE99' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00ADB5' }}>Skills</p>
          <h2 className="mb-12" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
          }}>
            Technologies I work with
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((group, i) => (
              <div key={i} className="p-6 rounded-2xl card-hover"
                style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.1)' }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#00ADB5' }}>
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item, j) => (
                    <span key={j} className="tag">{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="py-20 px-6" style={{ background: '#1a1f26' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#00ADB5' }}>Education</p>
          <h2 className="mb-12" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
          }}>
            Academic background
          </h2>
          <div className="p-8 rounded-2xl card-hover" style={{ background: '#393E46', border: '1px solid rgba(0,173,181,0.1)' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Informatics Engineering
                </h3>
                <p className="text-base font-medium" style={{ color: '#00ADB5' }}>
                  Universitas Dian Nuswantoro (UDINUS)
                </p>
                <p className="text-sm mt-2" style={{ color: '#EEEEEE99' }}>
                  Focusing on Artificial Intelligence, Machine Learning, and Software Engineering
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="tag text-xs px-4 py-1.5">2022 – Present</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="mb-4" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 800,
          }}>
            Want to work together?
          </h2>
          <p className="text-base mb-10" style={{ color: '#EEEEEE99' }}>
            I'm currently open to new opportunities. Let's build something amazing together.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
              style={{ background: '#00ADB5', color: '#222831' }}
            >
              Get in Touch
            </Link>
            <Link
              href="/projects"
              className="px-8 py-3.5 rounded-full font-semibold text-sm border transition-all duration-200 hover:bg-white/5"
              style={{ borderColor: '#393E46', color: '#EEEEEE' }}
            >
              View Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  )
}
