import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/user/Navbar";

interface Experience {
  role: string;
  org: string;
  desc: string;
  year: string;
}

export function ExperienceSection() {
  const experiences: Experience[] = [
    {
      role: "Event Leader",
      org: "Student Organization – Technology Division",
      desc: "Led technology events with hundreds of participants, managing end-to-end event operations.",
      year: "2024",
    },
    {
      role: "Software Engineer",
      org: "Academic Project",
      desc: "Developed structured, data-driven web solutions using Python, Laravel, and JavaScript.",
      year: "2023",
    },
  ];

  return (
    <section
      id="experience"
      className="py-20"
      style={{ background: "#1a1f26" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p
              className="text-xs tracking-widest uppercase mb-3"
              style={{ color: "#00ADB5" }}
            >
              Experience
            </p>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                fontWeight: 800,
              }}
            >
              Where I've contributed
            </h2>
          </div>
          <Link
            href="/user/experience"
            className="text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#00ADB5" }}
          >
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl card-hover flex items-start gap-6"
              style={{
                background: "#393E46",
                border: "1px solid rgba(0,173,181,0.1)",
              }}
            >
              <div
                className="text-sm font-mono pt-1 shrink-0"
                style={{ color: "#00ADB5" }}
              >
                {exp.year}
              </div>
              <div
                className="w-px self-stretch shrink-0"
                style={{ background: "rgba(0,173,181,0.2)" }}
              />
              <div>
                <h3 className="font-semibold text-base">{exp.role}</h3>
                <p className="text-sm mb-2" style={{ color: "#00ADB5" }}>
                  {exp.org}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#EEEEEE99" }}
                >
                  {exp.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PublicExperiencePage() {
  return (
    <>
      <Navbar />
      <ExperienceSection />
    </>
  );
}
