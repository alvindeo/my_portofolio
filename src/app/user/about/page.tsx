import React from "react";

export function AboutSection() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <p
        className="text-xs tracking-widest uppercase mb-3"
        style={{ color: "#00ADB5" }}
      >
        About Me
      </p>
      <h2
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          lineHeight: 1.1,
        }}
      >
        Building solutions
        <br />
        that create
        <br />
        <span style={{ color: "#00ADB5" }}>real impact</span>
      </h2>
      <div className="space-y-4 mt-8">
        <p className="text-base leading-relaxed" style={{ color: "#EEEEEE99" }}>
          I am an Informatics Engineering student with a strong interest in
          Artificial Intelligence, Machine Learning, and web-based system
          development.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "#EEEEEE99" }}>
          I have experience building a Computer Vision system using YOLOv8 for
          cataract detection, and developed a RAG-based chatbot integrated with
          LLM APIs to deliver intelligent, context-aware responses.
        </p>
        <p className="text-base leading-relaxed" style={{ color: "#EEEEEE99" }}>
          Beyond technical skills, I actively contribute as both a team member
          and event leader in student organizations, managing technology events
          with hundreds of participants.
        </p>
      </div>
    </div>
  );
}

export default function PublicAboutPage() {
  return <AboutSection />;
}
