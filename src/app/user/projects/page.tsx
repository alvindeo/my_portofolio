'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/user/Navbar'
import Footer from '@/components/user/Footer'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import StackIcon from 'tech-stack-icons'

// ── DATA ──────────────────────────────────────────────────────────────────

const projectsData = [
  {
    id: 1,
    title: 'Cataract Detection System',
    description: 'A Computer Vision system using YOLOv8 for automated cataract detection. Built with full pipeline from data preprocessing, model fine-tuning, to web deployment with real-time inference.',
    image: '/projects/cataract.jpg',
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'Flask', icon: 'flask' },
      { name: 'OpenCV', icon: 'opencv' },
      { name: 'Docker', icon: 'docker' },
    ],
    tags: ['AI / ML', 'Computer Vision'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: true,
  },
  {
    id: 2,
    title: 'RAG-Based Chatbot',
    description: 'An intelligent chatbot integrated with LLM APIs using Retrieval-Augmented Generation to deliver context-aware and accurate responses based on a custom knowledge base.',
    image: '/projects/chatbot.jpg',
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'OpenAI', icon: 'openai' },
      { name: 'HuggingFace', icon: 'huggingface' },
      // { name: 'FastAPI', icon: 'fastapi' },
    ],
    tags: ['AI / ML', 'LLM'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: true,
  },
  {
    id: 3,
    title: 'Portfolio Dashboard',
    description: 'A full-stack personal portfolio with an admin dashboard for managing projects, skills, and experiences dynamically. Built with Next.js, Prisma, and PostgreSQL.',
    image: '/projects/portfolio.jpg',
    techStack: [
      { name: 'Next.js', icon: 'nextjs2' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Prisma', icon: 'prisma' },
    ],
    tags: ['Web', 'Fullstack'],
    liveUrl: 'https://alvin.dev',
    githubUrl: 'https://github.com/',
    featured: false,
  },
  {
    id: 4,
    title: 'E-Commerce Web App',
    description: 'A full-featured e-commerce platform built with Laravel including product management, cart, checkout, and order tracking system.',
    image: '/projects/ecommerce.jpg',
    techStack: [
      { name: 'Laravel', icon: 'laravel' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Tailwind', icon: 'tailwindcss' },
      { name: 'JavaScript', icon: 'js' },
    ],
    tags: ['Web', 'Backend'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: true,
  },
  {
    id: 5,
    title: 'Data Analysis Dashboard',
    description: 'Interactive data visualization dashboard for analyzing student performance metrics using Python and Jupyter Notebook with pandas and matplotlib.',
    image: '/projects/dashboard.jpg',
    techStack: [
      { name: 'Python', icon: 'python' },
      { name: 'Colab', icon: 'colab' },
      { name: 'Git', icon: 'git' },
    ],
    tags: ['Data', 'AI / ML'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: false,
  },
  {
    id: 6,
    title: 'Event Management System',
    description: 'A web-based event management system for organizing technology events, handling registrations, schedules, and participant management.',
    image: '/projects/event.jpg',
    techStack: [
      { name: 'Laravel', icon: 'laravel' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'Bootstrap', icon: 'bootstrap5' },
    ],
    tags: ['Web', 'Backend'],
    liveUrl: null,
    githubUrl: 'https://github.com/',
    featured: false,
  },
]

const allTags = ['All', ...Array.from(new Set(projectsData.flatMap((p) => p.tags)))]

// ── ANIMATION ─────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: 'easeOut' as const,
    },
  }),
}

// ── COMPONENTS ────────────────────────────────────────────────────────────

/**
 * ProjectsSection — used on Landing Page
 */
export function ProjectsSection() {
  const featuredOnly = projectsData.filter(p => p.featured).slice(0, 3)
  
  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-20 relative overflow-hidden">
      {/* <ProjectBackground /> */}
      <div className="flex items-end justify-between mb-12">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
            Projects
          </p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, color: "var(--text-heading)" }}>
            Featured work
          </h2>
        </motion.div>
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <Link href="/user/projects" className="text-sm font-medium transition-colors hover:opacity-80 flex items-center gap-2" style={{ color: "var(--accent)" }}>
            View all projects <span>→</span>
          </Link>
        </motion.div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredOnly.map((project, i) => (
          <motion.div
            key={project.id}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
            style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--card-border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
          >
            {/* Image container with hover zoom */}
            <div className="relative w-full h-56 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
              <motion.img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} 
              />
              {/* Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase">
                  View Detail
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <span className="text-5xl opacity-20">🖥</span>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1 gap-4">
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, j) => (
                  <span key={j} className="tag">{tag}</span>
                ))}
              </div>
              <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-muted)' }}>
                {project.description}
              </p>
              <div className="flex items-center gap-2 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
                <Link href="/user/projects" style={{ color: 'var(--accent)' }} className="text-sm font-semibold">
                  View Detail →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── FULL PAGE ─────────────────────────────────────────────────────────────

export default function PublicProjectsPage() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  
  const filtered = projectsData.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchTag = activeTag === 'All' || p.tags.includes(activeTag)
    return matchSearch && matchTag
  })

  return (
    <div className="relative overflow-hidden" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      {/* <ProjectBackground /> */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        .tag { display:inline-block; padding:3px 12px; border-radius:999px; font-size:11px; font-weight:500; background:var(--accent-dim); color:var(--accent); border:1px solid var(--accent-border); }
        .project-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .project-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(0,0,0,0.1); }
        .project-card:hover .case-study-btn { opacity: 1; transform: translateY(0); }
        .case-study-btn { transition: opacity 0.3s ease, transform 0.3s ease; opacity: 0; transform: translateY(8px); }
        .img-overlay { transition: opacity 0.3s ease; }
        .project-card:hover .img-overlay { opacity: 1; }
        ::selection { background: var(--accent); color: var(--bg-primary); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-primary); }
        ::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 3px; }
        input::placeholder { color: var(--text-muted); opacity: 0.4; }
      `}</style>

      <Navbar />

      {/* Hero, Search, Projects Grid content... (dipertahankan dari kode sebelumnya) */}
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(var(--card-border) 1px, transparent 1px), linear-gradient(90deg, var(--card-border) 1px, transparent 1px)',
          backgroundSize: '60px 60px', opacity: 0.2
        }} />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--accent)' }}>
            Projects
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, color: 'var(--text-heading)' }}>
            Things I've <br /> <span style={{ color: 'var(--accent)' }}>built & shipped</span>
          </motion.h1>
        </div>
      </section>

      <section className="pb-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--card-border)' }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button key={tag} onClick={() => setActiveTag(tag)}
                className="px-4 py-2 rounded-full text-xs font-medium transition-all"
                style={{
                  background: activeTag === tag ? 'var(--accent)' : 'var(--bg-card)',
                  color: activeTag === tag ? 'var(--bg-primary)' : 'var(--text-muted)',
                  border: activeTag === tag ? '1px solid var(--accent)' : '1px solid var(--card-border)'
                }}> {tag} </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, i) => (
            <motion.div key={project.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="project-card rounded-2xl overflow-hidden flex flex-col"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--card-border)' }}
            >
              <div className="relative h-48 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                <div className="img-overlay absolute inset-0 flex items-center justify-center opacity-0" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}>
                  <Link href={`/user/projects/${project.id}`} className="case-study-btn px-5 py-2.5 rounded-full text-sm font-semibold" style={{ background: 'var(--accent)', color: 'var(--bg-primary)' }}> View Case Study → </Link>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1 gap-4">
                <div className="flex flex-wrap gap-2">{project.tags.map((tag, j) => (<span key={j} className="tag">{tag}</span>))}</div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-heading)' }}>{project.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                <div className="flex items-center gap-2 mt-auto">
                   {project.techStack.map((tech, j) => (
                     <div key={j} className="w-8 h-8 rounded-lg flex items-center justify-center p-1.5" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
                       <StackIcon name={tech.icon} className="w-full h-full" />
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
