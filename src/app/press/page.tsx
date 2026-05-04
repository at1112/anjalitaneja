"use client";

const photos = [
  { gradient: "linear-gradient(160deg, #c8a87a 0%, #9a7850 100%)", rot: -1.2 },
  { gradient: "linear-gradient(160deg, #c4a882 0%, #9a8060 100%)", rot:  0.7 },
  { gradient: "linear-gradient(160deg, #a8906a 0%, #7a6040 100%)", rot: -0.5 },
];

const coverage = [
  { publication: "The FADER",        headline: "Anjali Taneja's debut is everything indie R&B needed right now",     url: "#" },
  { publication: "Ones To Watch",    headline: "The 10 artists you need to hear this month",                         url: "#" },
  { publication: "NME",              headline: "Golden Linings is a breakthrough moment, delicate and devastating",  url: "#" },
  { publication: "Pigeons & Planes", headline: "Her voice carries a warmth that doesn't ask for anything in return", url: "#" },
];

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.25rem" }}>
      <div style={{ width: 8, height: 8, backgroundColor: "var(--accent)", flexShrink: 0 }} />
      <span style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.4 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
    </div>
  );
}

export default function PressPage() {
  return (
    <main style={{ paddingBottom: "5rem" }}>

      {/* Photos */}
      <section style={{ padding: "4rem 2rem 2rem" }}>
        <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
          <SectionLabel>photos</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {photos.map((p, i) => (
              <div
                key={i}
                style={{ aspectRatio: "2/3", borderRadius: 2, overflow: "hidden", background: p.gradient, position: "relative", transform: `rotate(${p.rot}deg)`, boxShadow: "0 2px 4px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.14), 0 16px 40px rgba(0,0,0,0.1)", transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s", cursor: "pointer" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "rotate(0deg) translateY(-6px)"; el.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1), 0 12px 32px rgba(0,0,0,0.2), 0 24px 60px rgba(0,0,0,0.14)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = `rotate(${p.rot}deg)`; el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08), 0 6px 20px rgba(0,0,0,0.14), 0 16px 40px rgba(0,0,0,0.1)"; }}
              >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,0,0.42) 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(to bottom, rgba(255,255,255,0.06), transparent)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", fontFamily: "'Courier New', monospace", fontSize: "0.48rem", color: "rgba(240,237,232,0.22)", letterSpacing: "0.1em" }}>
                  /images/press-{i + 1}.jpg
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section style={{ padding: "3rem 2rem" }}>
        <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
          <SectionLabel>coverage</SectionLabel>
          <div>
            {coverage.map((item, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "baseline", gap: "2.5rem", padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}
              >
                <span style={{ fontSize: "0.62rem", fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.38, flexShrink: 0, width: "9rem" }}>
                  {item.publication}
                </span>
                <span style={{ fontSize: "0.9375rem", fontWeight: 300, flex: 1, lineHeight: 1.6, fontStyle: "italic" }}>
                  &ldquo;{item.headline}&rdquo;
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "0.62rem", fontWeight: 400, color: "var(--accent)", textDecoration: "none", letterSpacing: "0.1em", flexShrink: 0, opacity: 0.65, transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.65")}
                >
                  read →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{ padding: "2rem 2rem" }}>
        <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
          <div style={{ padding: "2.75rem 3rem", borderRadius: 2, backgroundColor: "var(--surface)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
            {/* Corner mark */}
            <div style={{ position: "absolute", top: 14, right: 14, width: 14, height: 14, borderTop: "1px solid var(--border)", borderRight: "1px solid var(--border)" }} />
            <SectionLabel>contact</SectionLabel>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.85, fontWeight: 300, opacity: 0.6, maxWidth: "40ch", margin: "0 0 1.5rem 0" }}>
              For press inquiries, sync licensing, and booking, reach out directly.
            </p>
            <a
              href="mailto:hello@anjalitaneja.com"
              style={{ fontSize: "0.875rem", fontWeight: 400, color: "var(--accent)", textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.6")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              hello@anjalitaneja.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
