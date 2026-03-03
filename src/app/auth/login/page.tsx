"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { InteractiveGridPattern } from "@/components/ui/GridPattern";
import { useTheme } from "@/context/ThemeContext";

// ── Time-based image logic ──
const images = [
  { src: '/login/biasa.jpg', label: 'Pagi',},
  { src: '/login/marah.png', label: 'Siang',},
  { src: '/login/sasuke.png', label: 'Malam',},
];

function getTimeBasedImage() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)  return images[0]; // 05:00 – 11:59  → pagi
  if (hour >= 12 && hour < 18) return images[1]; // 12:00 – 17:59  → siang
  return images[2];                               // 18:00 – 04:59  → malam
}

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(images[0]);

  // Set image on client-side only to avoid hydration mismatch
  useState(() => {
    setCurrentImage(getTimeBasedImage());
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email atau password salah!");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden p-4"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Interactive glowing grid background */}
      <InteractiveGridPattern
        cellSize={50}
        glowColor="rgba(0, 173, 181, 0.35)"
        borderColor="rgba(0, 173, 181, 0.08)"
        proximity={120}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 30%, var(--bg-primary) 80%)',
        }}
      />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-20 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--card-border)",
          color: "var(--text-muted)"
        }}
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
            <span>Light</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
            </svg>
            <span>Dark</span>
          </>
        )}
      </button>

      {/* ── Main Card: split layout (image left + form right) ── */}
      <div
        className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
        style={{ border: "1px solid var(--card-border)" }}
      >
        {/* LEFT: Illustration Panel */}
        <div
          className="relative hidden md:flex md:w-[45%] flex-col items-center justify-center p-10 overflow-hidden"
          style={{ background: "var(--bg-secondary)" }}
        >
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{
              backgroundImage: `url('${currentImage.src}')`,
              opacity: 0.45,
            }}
          />
          {/* Top-left gradient to blend */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, var(--bg-secondary) 0%, transparent 60%)",
            }}
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background: "linear-gradient(to top, var(--bg-secondary), transparent)",
            }}
          />
          {/* Accent glow */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
            style={{ background: "var(--accent)", opacity: 0.1 }}
          />
        </div>

        {/* RIGHT: Form Panel */}
        <div
          className="flex-1 p-8 md:p-12 flex flex-col justify-center"
          style={{ background: "var(--bg-card)" }}
        >
          <div className="mb-8">
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--accent)" }}>
              Welcome back <strong> alvin ganteng</strong>
            </p>
            <h1 className="text-2xl font-bold" style={{ color: "var(--text-heading)", fontFamily: "'Syne', sans-serif" }}>
              Sign in to Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Enter your credentials to continue
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5 text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs font-semibold tracking-wide mb-2 uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--card-border)",
                }}
                required
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold tracking-wide mb-2 uppercase"
                style={{ color: "var(--text-muted)" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border transition-all"
                style={{
                  background: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "var(--card-border)",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: "var(--accent)", color: "var(--bg-primary)" }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
