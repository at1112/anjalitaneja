"use client";

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
      <div style={{ width: 8, height: 8, backgroundColor: "var(--accent)", flexShrink: 0 }} />
      <span style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.4 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
    </div>
  );
}

// Add your upcoming shows here
const shows: { date: string; venue: string; city: string; link?: string }[] = [
  // { date: "Jun 14, 2025", venue: "Baby's All Right", city: "Brooklyn, NY", link: "https://..." },
];

export default function ShowsPage() {
  return (
    <main style={{ padding: "3.5rem 2rem 6rem" }}>
      <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
        <SectionLabel>shows</SectionLabel>

        {shows.length === 0 ? (
          <div style={{ paddingTop: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 300, opacity: 0.35, letterSpacing: "0.06em", lineHeight: 2 }}>
              no upcoming shows right now.<br />
              <span style={{ opacity: 0.6 }}>check back soon.</span>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {shows.map((show, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "1.25rem 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "baseline", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.68rem", color: "var(--accent)", letterSpacing: "0.08em", flexShrink: 0 }}>{show.date}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 300 }}>{show.venue}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 300, opacity: 0.45 }}>{show.city}</span>
                </div>
                {show.link && (
                  <a href={show.link} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--accent)", textDecoration: "none", flexShrink: 0, opacity: 0.7, transition: "opacity 0.2s" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}>
                    tickets →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
