import Link from "next/link";
import { Navbar } from "@/components/user/Navbar";

interface Project {
  title: string;
  desc: string;
  tags: string[];
}

export function ProjectsSection() {
  const projects: Project[] = [
    {
      title: "Project 1",
      desc: "Description 1",
      tags: ["tag1", "tag2"],
    },
    {
      title: "Project 2",
      desc: "Description 2",
      tags: ["tag3", "tag4"],
    },
    {
      title: "Project 3",
      desc: "Description 3",
      tags: ["tag5", "tag6"],
    },
  ];

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-12">
        <div>
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{ color: "#00ADB5" }}
          >
            Projects
          </p>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
            }}
          >
            Featured work
          </h2>
        </div>
        <Link
          href="/user/projects"
          className="text-sm font-medium transition-colors hover:text-white"
          style={{ color: "#00ADB5" }}
        >
          View all →
        </Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project: Project, i: number) => (
          <div
            key={i}
            className="p-6 rounded-2xl card-hover flex flex-col gap-4"
            style={{
              background: "#393E46",
              border: "1px solid rgba(0,173,181,0.1)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(0,173,181,0.12)" }}
            >
              {i === 0 ? "👁" : i === 1 ? "🤖" : "🌐"}
            </div>
            <div>
              <h3 className="font-semibold text-base mb-2">{project.title}</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#EEEEEE99" }}
              >
                {project.desc}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag: string, j: number) => (
                <span key={j} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function PublicProjectsPage() {
  return (
    <>
      <Navbar />
      <ProjectsSection />
    </>
  );
}
