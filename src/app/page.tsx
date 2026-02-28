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
        setTimeout(() => setIsDeleting(true), 3000); // Pause setalah selesai mengetik
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
      className="selection:bg-[#00ADB5] selection:text-[#222831]"
      style={{
        background: "#222831",
        color: "#EEEEEE",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        html { scroll-behavior: smooth; }
        .tag { display:inline-block; padding:2px 10px; border-radius:999px; font-size:11px; font-weight:500; background:rgba(0,173,181,0.08); color:#00ADB5; border:1px solid rgba(0,173,181,0.2); }
        .card-hover { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,173,181,0.08); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #222831; }
        ::-webkit-scrollbar-thumb { background: #393E46; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00ADB5; }
        .cursor-type::after { content: '|'; animation: blink 1s step-end infinite; color: #00ADB5; margin-left: 2px; }
        @keyframes blink { from, to { opacity: 1; } 50% { opacity: 0; } }
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
              "linear-gradient(rgba(0,173,181,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,173,181,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(0,173,181,0.05) 0%, transparent 70%)",
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
            }}
          >
            <span className={fullName.length <= 9 ? "cursor-type" : ""}>
              {part1}
            </span>
            <br />
            <span 
              style={{ color: "#00ADB5" }}
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
            style={{ color: "#00ADB5" }}
          >
            Software Engineer <span className="mx-2 opacity-30">/</span> ML Enthusiast
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 max-w-xl text-lg leading-relaxed"
            style={{ color: "#EEEEEECC" }}
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
              className="px-8 py-4 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,173,181,0.3)] hover:-translate-y-1 active:scale-95"
              style={{ background: "#00ADB5", color: "#222831" }}
            >
              Explore Work
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full font-bold text-sm border-2 transition-all duration-300 hover:bg-white/5 hover:-translate-y-1 active:scale-95"
              style={{ borderColor: "#343a40", color: "#EEEEEE" }}
            >
              Get in Touch
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator with animation */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <div
            className="w-[2px] h-16 relative overflow-hidden"
            style={{ background: "rgba(238, 238, 238, 0.1)" }}
          >
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2"
              style={{ background: "#00ADB5" }}
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
                  background: "#393E46",
                  border: "1px solid rgba(0,173,181,0.1)",
                }}
              >
                <div
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Syne', sans-serif", color: "#00ADB5" }}
                >
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="text-sm mt-1" style={{ color: "#EEEEEE99" }}>
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
        <section id="skills" className="py-20" style={{ background: "#1a1f26" }}>
          <div className="max-w-6xl mx-auto px-6">
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "#00ADB5" }}
            >
              Skills
            </p>
            <h2
              className="mb-12"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
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
                    background: "#393E46",
                    border: "1px solid rgba(0,173,181,0.1)",
                  }}
                >
                  <p
                    className="text-xs font-semibold tracking-widest uppercase mb-4"
                    style={{ color: "#00ADB5" }}
                  >
                    {group.category}
                  </p>
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
