import React from "react";

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer
        className="border-t py-8 text-center text-sm"
        style={{ borderColor: "#393E46", color: "#EEEEEE40" }}
        >
        <p>© {year} Alvin Deo Ardiansyah · Built with Next.js & ❤️</p>
        </footer>
    );
}
