"use client";
import { useEffect, useState } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#vacancies", label: "Vacancies" },
    { href: "#employers", label: "Employers" },
    { href: "#apply", label: "Apply" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="container nav-wrap">
        <a href="#home" className="logo">
          <div className="logo-mark">PB</div>
          <div className="logo-text">
            PAK BOLAN
            <span style={{ display: "block", fontSize: ".62rem", color: "var(--gold)", fontWeight: 500, letterSpacing: ".08em" }}>
              INTERNATIONAL
            </span>
          </div>
        </a>
        <ul className="nav-links" style={{ display: open ? "flex" : undefined }}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/admin" className="admin-link">
              <i className="fa-solid fa-lock" /> Admin
            </a>
          </li>
        </ul>
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          style={{ display: "none" }}
          className="nav-toggle"
        >
          <i className="fa-solid fa-bars" />
        </button>
      </div>
    </header>
  );
}
