import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(34,40,49,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,173,181,0.15)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <span
          className="font-bold text-lg tracking-tight"
          style={{ color: "#00ADB5" }}
        >
          alvin.dev
        </span>
        <div className="hidden md:flex items-center gap-8">
          {["About", "Skills", "Projects", "Experience", "Contact"].map(
            (item) => {
              let href = `#${item.toLowerCase()}`;
              // redirect to dedicated pages rather than anchors
              if (item === "Projects") href = "/user/projects";
              else if (item === "Experience") href = "/user/experience";
              else if (item === "Contact") href = "/user/contact";
              return (
                <a
                  key={item}
                  href={href}
                  className="text-sm tracking-wide transition-colors duration-200 hover:text-[#00ADB5]"
                  style={{ color: "#EEEEEE99" }}
                >
                  {item}
                </a>
              );
            }
          )}
        </div>
        <Link
          href="/dashboard"
          className="text-xs px-4 py-2 rounded-full border transition-all duration-200 hover:bg-[#00ADB5] hover:border-[#00ADB5] hover:text-[#222831]"
          style={{ borderColor: "#00ADB5", color: "#00ADB5" }}
        >
          Dashboard
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
