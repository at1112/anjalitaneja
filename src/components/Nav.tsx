"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const links = [
    { href: "/about",  label: "about" },
    { href: "/",       label: "radio" },
    { href: "/press",  label: "press" },
    { href: "/shows",  label: "shows" },
  ];

  return (
    <nav style={{ backgroundColor: "var(--nav-bg)", borderBottom: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: "60rem",
          margin: "0 auto",
          padding: "1.1rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/"
          style={{
            color: "var(--foreground)",
            fontWeight: 500,
            textDecoration: "none",
            fontSize: "0.68rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          Anjali Taneja
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
          {links.map((link, i) => (
            <span key={link.href} style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
              {i > 0 && (
                <span
                  style={{
                    color: "var(--border)",
                    fontSize: "0.68rem",
                    paddingInline: "0.15rem",
                    userSelect: "none",
                  }}
                >
                  /
                </span>
              )}
              <Link
                href={link.href}
                style={{
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  fontWeight: pathname === link.href ? 500 : 300,
                  color: pathname === link.href ? "var(--accent)" : "var(--foreground)",
                  opacity: pathname === link.href ? 1 : 0.55,
                  textDecoration: "none",
                  transition: "opacity 0.2s, color 0.2s",
                }}
              >
                {link.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}
