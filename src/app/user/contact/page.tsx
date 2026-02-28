import React from "react";
import { Navbar } from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

export function ContactSection() {
  return (
    <section id="contact" className="max-w-6xl mx-auto px-6 py-24 text-center">
      <p
        className="text-xs tracking-widest uppercase mb-3"
        style={{ color: "#00ADB5" }}
      >
        Contact
      </p>
      <h2
        className="mb-4"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
          fontWeight: 800,
        }}
      >
        Let's work together
      </h2>
      <p
        className="text-base max-w-md mx-auto mb-10"
        style={{ color: "#EEEEEE99" }}
      >
        I'm currently open to new opportunities. Whether you have a project in
        mind or just want to say hi — my inbox is always open.
      </p>
      <a
        href="mailto:alvin@email.com"
        className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-105"
        style={{ background: "#00ADB5", color: "#222831" }}
      >
        Say Hello 👋
      </a>
    </section>
  );
}

export default function PublicContactPage() {
  return (
    <div style={{ background: "#222831", minHeight: "100vh" }}>
      <Navbar />
      <div className="pt-20">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
}
