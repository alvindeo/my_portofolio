"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { AboutSection } from "./user/about/page";
import { ProjectsSection } from "./user/projects/page";
import { ExperienceSection } from "./user/experience/page";
import { ContactSection } from "./user/contact/page";
import { Navbar } from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";


import { Code2, Server, Brain, Terminal } from "lucide-react";


// ── Components ─────────────────────────────────────────────────────────────

function ScrollReveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}

// ── Animated counter hook ──────────────────────────────────────────────────
function useCounter(end: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

// ── Data ───────────────────────────────────────────────────────────────────
const skills = [
  { category: 'Frontend', icon: <Code2 size={20} />, items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Figma'] },
  { category: 'Backend', icon: <Server size={20} />, items: ['Python', 'Laravel', 'Node.js', 'REST API', 'PostgreSQL'] },
  { category: 'AI / ML', icon: <Brain size={20} />, items: ['YOLOv8', 'RAG', 'LLM APIs', 'Computer Vision', 'Machine Learning'] },
  { category: 'Tools', icon: <Terminal size={20} />, items: ['Git', 'Docker', 'VS Code', 'Postman'] },
]

// ── Typewriter Hook ──────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 100, delay = 1000) {
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    const timeout = setTimeout(() => {
      if (!isDeleting && index < text.length) {
        setIndex(prev => prev + 1);
      } else if (isDeleting && index > 0) {
        setIndex(prev => prev - 1);
      } else if (!isDeleting && index === text.length) {
        setTimeout(() => setIsDeleting(true), 3000);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [index, isDeleting, text, speed, started]);

  return text.substring(0, index);
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Home() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const fullName = useTypewriter("Alvin Deo Ardiansyah", 120, 500);
  const part1 = fullName.slice(0, 9);
  const part2 = fullName.slice(9).trim();

  const projects_count = useCounter(10, 1200, statsVisible);
  const experience_count = useCounter(3, 1200, statsVisible);
  const tech_count = useCounter(15, 1200, statsVisible);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStatsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="selection:bg-[var(--accent)] selection:text-white"
      style={{
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        fontFamily: "'DM Sans', sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      <Navbar />

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6"
      >
        {/* Parallax background grid */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            y: backgroundY,
            backgroundImage:
              `linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--hero-glow) 0%, transparent 70%)",
          }}
        />

        <motion.div 
          className="max-w-6xl mx-auto w-full relative z-10"
          style={{ y: textY, opacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span className="tag mb-8 inline-block">
              Available for opportunities
            </span>
          </motion.div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(3rem, 10vw, 6.5rem)",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              color: "var(--text-heading)",
            }}
          >
            <span className={fullName.length <= 9 ? "cursor-type" : ""}>
              {part1}
            </span>
            <br />
            <span 
              style={{ color: "var(--accent)" }}
              className={fullName.length > 9 ? "cursor-type" : ""}
            >
              {part2}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-lg font-medium tracking-wide uppercase"
            style={{ color: "var(--accent)" }}
          >
            Software Engineer <span className="mx-2 opacity-30">/</span> ML Enthusiast
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 max-w-xl text-lg leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            Informatics student crafting elegant digital experiences through clean code and intelligent systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-wrap gap-6"
          >
            <a
              href="#projects"
              className="px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                background: "var(--accent)",
                color: "var(--bg-primary)",
                boxShadow: "0 0 0 0 var(--accent-glow)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 0 var(--accent-glow)";
              }}
            >
              Explore Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full font-bold text-sm border-2 transition-all duration-300 hover:-translate-y-1 active:scale-95"
              style={{
                borderColor: "var(--btn-outline-border)",
                color: "var(--btn-outline-text)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--accent-dim)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-border)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--btn-outline-border)";
              }}
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div
            className="w-[2px] h-16 relative overflow-hidden"
            style={{ background: "var(--section-divider)" }}
          >
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{ background: "var(--accent)" }}
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <ScrollReveal>
        <div ref={statsRef} className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: projects_count, suffix: "+", label: "Projects Built" },
              { value: experience_count, suffix: "+", label: "Years Learning" },
              { value: tech_count, suffix: "+", label: "Technologies" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl card-hover"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Syne', sans-serif", color: "var(--accent)" }}
                >
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ── ABOUT ── */}
      <ScrollReveal>
        <section id="about">
          <AboutSection />
        </section>
      </ScrollReveal>

      {/* ── SKILLS ── */}
      <ScrollReveal>
        <section
          id="skills"
          className="py-20"
          style={{ background: "var(--bg-skills)" }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "var(--accent)" }}
            >
              Skills
            </p>
            <h2
              className="mb-12"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
                color: "var(--text-heading)",
              }}
            >
              Technologies I work with
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((group, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl card-hover"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ 
                        background: "var(--accent-dim)", 
                        border: "1px solid var(--accent-border)",
                        color: "var(--accent)"
                      }}
                    >
                      {group.icon}
                    </div>
                    <p
                      className="text-xs font-semibold tracking-widest uppercase"
                      style={{ color: "var(--accent)" }}
                    >
                      {group.category}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item, j) => (
                      <span key={j} className="tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── PROJECTS ── */}
      <ScrollReveal>
        <ProjectsSection />
      </ScrollReveal>

      {/* ── EXPERIENCE ── */}
      <ScrollReveal>
        <ExperienceSection />
      </ScrollReveal>

      {/* ── CONTACT ── */}
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
