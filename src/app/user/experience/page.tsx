'use client'

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";
import { motion } from "framer-motion";

interface Experience {
  role: string;
  org: string;
  desc: string;
  year: string;
  tags?: string[];
  achievements?: string[];
}

const experiences: Experience[] = [
  {
    role: "Event Leader",
    org: "Student Organization – Technology Division",
    desc: "Led technology events with hundreds of participants, managing end-to-end event operations from planning to execution.",
    year: "2024 - Present",
    tags: ["Leadership", "Event Management", "Technology"],
    achievements: [
      "Coordinated a team of 20+ volunteers for multiple tech workshops.",
      "Successfully managed event budgets and sponsorship acquisitions.",
      "Increased student engagement in division activities by 40%."
    ]
  },
  {
    role: "Software Engineer",
    org: "Academic Project",
    desc: "Developed structured, data-driven web solutions using Python, Laravel, and JavaScript for real-world use cases.",
    year: "2024",
    tags: ["Python", "Laravel", "JavaScript"],
    achievements: [
      "Built a full-stack inventory management system.",
      "Optimized database queries decreasing load times by 30%.",
      "Implemented secure authentication and role-based access control."
    ]
  },
];

/**
 * TREE VERSION - Specifically for the Home Page
 */
export function ExperienceSection() {
  return (
    <section id="experience" className="py-24 relative overflow-hidden" style={{ background: "#1a1f26" }}>
      <style>{`
        .timeline-card { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; }
        .timeline-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,173,181,0.12); }
        .tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:rgba(0,173,181,0.08); color:#00ADB5; border:1px solid rgba(0,173,181,0.2); }
        
        @media (max-width: 768px) {
          .timeline-line { left: 24px !important; }
          .timeline-dot { left: 24px !important; }
          .timeline-content { width: 100% !important; padding-left: 60px !important; padding-right: 0 !important; text-align: left !important; }
          .timeline-row { flex-direction: column !important; align-items: flex-start !important; }
          .timeline-content-right { padding-left: 60px !important; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-20">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#00ADB5" }}>Experience</p>
          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 800,
            lineHeight: 1.1,
          }}>
            My Professional <span style={{ color: "#00ADB5" }}>Timeline</span>
          </h2>
        </div>

        <div className="relative">
          <div className="timeline-line absolute left-1/2 top-0 bottom-0 w-px" style={{
            background: "linear-gradient(to bottom, transparent, #00ADB5 15%, #00ADB5 85%, transparent)",
            transform: "translateX(-50%)",
            opacity: 0.2
          }} />

          <div className="space-y-24">
            {experiences.map((exp, i) => {
              const isEven = i % 2 === 0;
              return (
                <div key={i} className="timeline-row relative flex items-center justify-between">
                  {/* Dot */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="timeline-dot absolute left-1/2 w-4 h-4 rounded-full border-2 z-10" 
                    style={{
                      transform: "translateX(-50%)",
                      background: "#222831",
                      borderColor: "#00ADB5",
                      boxShadow: "0 0 15px rgba(0,173,181,0.4)"
                    }} 
                  />

                  {/* Left Content */}
                  <div className={`timeline-content w-[45%] ${isEven ? 'text-right pr-2' : 'opacity-0 pointer-events-none hidden md:block'}`}>
                    {isEven && (
                      <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="timeline-card p-8 rounded-3xl" 
                        style={{ background: "#393E46", border: "1px solid rgba(0,173,181,0.1)" }}
                      >
                        <span className="text-xs font-bold mb-3 block" style={{ color: "#00ADB5" }}>{exp.year}</span>
                        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{exp.role}</h3>
                        <p className="text-sm font-medium mb-4" style={{ color: "#00ADB5" }}>{exp.org}</p>
                        <p className="text-base leading-relaxed mb-6" style={{ color: "#EEEEEE99" }}>{exp.desc}</p>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {exp.tags?.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Content */}
                  <div className={`timeline-content timeline-content-right w-[45%] ${!isEven ? 'text-left pl-2' : 'opacity-0 pointer-events-none hidden md:block'}`}>
                    {!isEven && (
                      <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="timeline-card p-8 rounded-3xl" 
                        style={{ background: "#393E46", border: "1px solid rgba(0,173,181,0.1)" }}
                      >
                        <span className="text-xs font-bold mb-3 block" style={{ color: "#00ADB5" }}>{exp.year}</span>
                        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>{exp.role}</h3>
                        <p className="text-sm font-medium mb-4" style={{ color: "#00ADB5" }}>{exp.org}</p>
                        <p className="text-base leading-relaxed mb-6" style={{ color: "#EEEEEE99" }}>{exp.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {exp.tags?.map((tag, j) => <span key={j} className="tag">{tag}</span>)}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 text-center">
            <Link href="/user/experience" className="text-sm font-bold tracking-widest uppercase hover:text-white transition-colors" style={{ color: "#00ADB5" }}>
                Explore Full Experience →
            </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * DETAIL VERSION - For /user/experience Page
 */
export default function PublicExperiencePage() {
  return (
    <div style={{ background: "#222831", color: "#EEEEEE", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-20">
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "#00ADB5" }}>Portfolio</p>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 800,
            lineHeight: 1,
          }}>
            Experience <br />
            <span style={{ color: "#00ADB5" }}>Detail & Achievements</span>
          </h1>
          <p className="mt-8 text-lg max-w-2xl" style={{ color: "#EEEEEE99" }}>
            A comprehensive list of my professional contributions, leadership roles, and technical achievements.
          </p>
        </div>

        {/* Detailed List (No Tree) */}
        <div className="space-y-12">
          {experiences.map((exp, i) => (
            <div key={i} className="group p-8 md:p-12 rounded-[2rem] transition-all duration-300 hover:bg-[#2c323c]" 
                 style={{ background: "#393E46", border: "1px solid rgba(0,173,181,0.05)" }}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(0,173,181,0.1)", color: "#00ADB5" }}>
                      {exp.year}
                    </span>
                    {exp.tags?.map((tag, j) => (
                      <span key={j} className="px-4 py-1.5 rounded-full text-xs font-medium border border-white/10" style={{ color: "#EEEEEE99" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>{exp.role}</h2>
                  <p className="text-xl font-medium mb-8" style={{ color: "#00ADB5" }}>{exp.org}</p>
                  
                  <div className="grid md:grid-cols-2 gap-12">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest mb-4 font-bold" style={{ color: "#EEEEEE40" }}>About Role</h4>
                      <p className="text-lg leading-relaxed" style={{ color: "#EEEEEECC" }}>{exp.desc}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-widest mb-4 font-bold" style={{ color: "#EEEEEE40" }}>Key Achievements</h4>
                      <ul className="space-y-3">
                        {exp.achievements?.map((ach, k) => (
                          <li key={k} className="flex items-start gap-3 text-sm" style={{ color: "#EEEEEE99" }}>
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#00ADB5" }} />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-32 p-12 rounded-[2.5rem] text-center relative overflow-hidden" 
             style={{ background: "#1a1f26", border: "1px solid rgba(0,173,181,0.1)" }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ background: "#00ADB5", transform: "translate(30%, -30%)" }} />
          <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>Have a project in mind?</h3>
          <Link href="/user/contact" 
                className="inline-block px-10 py-4 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(0,173,181,0.2)]"
                style={{ background: "#00ADB5", color: "#222831" }}>
            Let's Talk Together
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
