"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  { href: "/admin", label: "Dashboard", icon: "fa-gauge" },
  { href: "/admin/vacancies", label: "Vacancies", icon: "fa-briefcase" },
  { href: "/admin/applications", label: "Applications", icon: "fa-address-card" },
  { href: "/admin/employers", label: "Employer Inquiries", icon: "fa-building" },
  { href: "/admin/settings", label: "Settings", icon: "fa-gear" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside style={{ width: 230, background: "var(--navy)", color: "var(--white)", padding: "24px 18px", flexShrink: 0 }}>
      <div className="logo" style={{ marginBottom: 30 }}>
        <div className="logo-mark">PB</div>
        <div className="logo-text">
          PAK BOLAN<span style={{ display: "block", fontSize: ".6rem", color: "var(--gold)" }}>ADMIN</span>
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 5,
                fontSize: ".85rem",
                fontWeight: 600,
                color: active ? "var(--navy)" : "rgba(255,255,255,.8)",
                background: active ? "var(--gold)" : "transparent",
              }}
            >
              <i className={`fa-solid ${it.icon}`} /> {it.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ marginTop: 30, borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        <a href="/" target="_blank" rel="noopener" className="admin-nav-item" style={{ color: "rgba(255,255,255,.8)", fontSize: ".8rem", padding: "8px 12px" }}>
          <i className="fa-solid fa-arrow-up-right-from-square" /> View Website
        </a>
        <button
          onClick={logout}
          style={{ color: "rgba(255,255,255,.8)", fontSize: ".8rem", padding: "8px 12px", textAlign: "left" }}
        >
          <i className="fa-solid fa-right-from-bracket" /> Log Out
        </button>
      </div>
    </aside>
  );
}
