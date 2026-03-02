"use client";
import React from "react";
import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <>
            {/* Inline style for hover effect using CSS variables */}
            <style>{`
                .footer-icon-link {
                    color: var(--accent);
                    border-radius: 50%;
                    padding: 8px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.2s ease, background 0.2s ease;
                    background: transparent;
                }
                .footer-icon-link:hover {
                    transform: scale(1.1);
                    background: var(--accent-dim);
                }
            `}</style>

            <footer
                className="border-t py-12 text-center text-sm"
                style={{
                    borderColor: "var(--card-border)",
                    color: "var(--text-muted)",
                    background: "var(--footer-bg)",
                }}
            >
                <div className="flex justify-center items-center gap-6 mb-8 mt-2">
                    {/* github */}
                    <Link
                        href="https://github.com/alvinodeo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-icon-link"
                        aria-label="GitHub"
                    >
                        <Github size={20} />
                    </Link>

                    {/* instagram */}
                    <Link
                        href="https://instagram.com/alvndeoo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-icon-link"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </Link>

                    {/* linkedin */}
                    <Link
                        href="https://linkedin.com/in/alvindeoardiansyah"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-icon-link"
                        aria-label="LinkedIn"
                    >
                        <Linkedin size={20} />
                    </Link>

                    {/* email */}
                    <Link
                        href="mailto:alvindeoardiansyah@gmail.com"
                        className="footer-icon-link"
                        aria-label="Email"
                    >
                        <Mail size={20} />
                    </Link>
                </div>

                <p className="font-medium tracking-wide">
                    © {year} Alvin Deo Ardiansyah · Thank You For Visiting
                </p>
            </footer>
        </>
    );
}
