"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || menuOpen ? "rgba(34,40,49,0.96)" : "transparent",
        backdropFilter: scrolled || menuOpen ? "blur(12px)" : "none",
        borderBottom: scrolled || menuOpen ? "1px solid rgba(0,173,181,0.15)" : "none",
      }}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00ADB5] origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between" ref={menuRef}>
        
        {/* Logo */}
        <Link href="/" className="font-bold text-lg tracking-tight hover:scale-105 transition-transform" style={{ color: "#00ADB5", fontFamily: "'Syne', sans-serif" }}>
          Alvin
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm tracking-wide transition-colors duration-200 hover:text-[#00ADB5]"
              style={{ color: "#EEEEEE99" }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 relative z-50"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 transition-all duration-300 origin-center"
            style={{
              background: "#00ADB5",
              transform: menuOpen ? "translateY(8px) rotate(45deg)" : "none",
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300"
            style={{
              background: "#00ADB5",
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? "scaleX(0)" : "none",
            }}
          />
          <span
            className="block w-6 h-0.5 transition-all duration-300 origin-center"
            style={{
              background: "#00ADB5",
              transform: menuOpen ? "translateY(-8px) rotate(-45deg)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: menuOpen ? "400px" : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div
          className="px-6 pb-6 flex flex-col gap-1"
          style={{ borderTop: "1px solid rgba(0,173,181,0.1)" }}
        >
          {navItems.map((item, i) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-[#393E46] hover:text-[#00ADB5]"
              style={{
                color: "#EEEEEE99",
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;