import React from "react";
import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
            className="border-t py-12 text-center text-sm"
            style={{ borderColor: "#393E46", color: "#EEEEEE40" }}
        >
            <div className="flex justify-center items-center gap-6 mb-8 mt-2">
                {/* github */}
                <Link 
                    href="https://github.com/alvinodeo" 
                    target="_blank"
                    className="hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/5" 
                    style={{ color: "#00ADB5" }}
                >
                    <Github size={20} />
                </Link>

                {/* instagram */}
                <Link 
                    href="https://instagram.com/alvndeoo" 
                    target="_blank"
                    className="hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/5" 
                    style={{ color: "#00ADB5" }}
                >
                    <Instagram size={20} />
                </Link>

                {/* linkedin */}
                <Link 
                    href="https://linkedin.com/in/alvindeoardiansyah" 
                    target="_blank"
                    className="hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/5" 
                    style={{ color: "#00ADB5" }}
                >
                    <Linkedin size={20} />
                </Link>

                {/* email */}
                <Link 
                    href="mailto:alvindeoardiansyah@gmail.com" 
                    className="hover:scale-110 transition-transform p-2 rounded-full hover:bg-white/5" 
                    style={{ color: "#00ADB5" }}
                >
                    <Mail size={20} />
                </Link>
            </div>

            <p className="font-medium tracking-wide">
                © {year} Alvin Deo Ardiansyah · Thank You For Visiting
            </p>
        </footer>
    );
}
