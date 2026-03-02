"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="relative w-14 h-7 rounded-full flex items-center px-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        background: isDark
          ? "rgba(0, 173, 181, 0.15)"
          : "rgba(0, 151, 160, 0.12)",
        border: "1px solid var(--accent-border)",
        transition: "background 0.3s ease",
      }}
    >
      {/* Track icons: Moon (left) & Sun (right) */}
      <span
        className="absolute left-1.5 flex items-center justify-center w-4 h-4 opacity-50"
        style={{ color: "var(--accent)" }}
      >
        <Moon size={11} strokeWidth={2.5} />
      </span>
      <span
        className="absolute right-1.5 flex items-center justify-center w-4 h-4 opacity-50"
        style={{ color: "var(--accent)" }}
      >
        <Sun size={11} strokeWidth={2.5} />
      </span>

      {/* Thumb */}
      <motion.div
        layout
        animate={{ x: isDark ? 0 : 28 }}
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
        style={{ background: "var(--accent)" }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -30, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 30, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
              style={{ color: "#222831" }}
            >
              <Moon size={10} strokeWidth={3} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 30, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -30, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
              style={{ color: "#f1f5f9" }}
            >
              <Sun size={10} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}
