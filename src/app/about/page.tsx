"use client";

import { useState } from "react";
import SongWorld from "@/components/SongWorld";

const songs = [
  {
    id: "my-side",
    title: "My Side",
    year: "2024",
    coverColor: "#c4956a",
    coverGradient: "linear-gradient(135deg, #c4956a 0%, #a07050 100%)",
    imageUrl: "/images/my-side.jpg",
    story: "A",
    spotifyUrl: "https://open.spotify.com/track/2acl3sdl3Pdp4LUw72nol1",
  },
  {
    id: "golden-linings",
    title: "Golden Linings",
    year: "2024",
    coverColor: "#d4a855",
    coverGradient: "linear-gradient(135deg, #d4a855 0%, #b88830 100%)",
    imageUrl: "/images/golden-linings.jpg",
    story: "B",
    spotifyUrl: "https://open.spotify.com/track/6hm4HEbg2VQGmRubQC7Ly3",
  },
  {
    id: "forever-you",
    title: "Forever You",
    year: "2023",
    coverColor: "#8b6944",
    coverGradient: "linear-gradient(135deg, #8b6944 0%, #6a5030 100%)",
    imageUrl: "/images/forever-you.jpg",
    story: "C",
    spotifyUrl: "https://open.spotify.com/track/4bUxpM2lK4xzMrqFxS8wGi",
    videoUrl: "https://www.youtube.com/watch?v=CkdaoWhwkLY",
  },
];

const cardRotations = [-1.5, 0.5, -0.8];

function SpotifyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.224-2.724a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.517.781.781 0 01.517-.973c3.632-1.102 8.147-.568 11.236 1.328a.78.78 0 01.257 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.527-1.07 9.401-.863 13.105 1.337a.937.937 0 01-.944 1.612z" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
      <div style={{ width: 8, height: 8, backgroundColor: "var(--accent)", flexShrink: 0 }} />
      <span style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", color: "var(--foreground)", opacity: 0.4 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
    </div>
  );
}

export default function AboutPage() {
  const [activeSong, setActiveSong] = useState<(typeof songs)[number] | null>(null);

  return (
    <>
      <main>
        {/* ── Hero ── */}
        <section style={{ padding: "3.5rem 2rem 2rem" }}>
          <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem", paddingInline: "0.25rem" }}>
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.58rem", color: "var(--muted)", letterSpacing: "0.2em", opacity: 0.5 }}>35MM · 5219</span>
              <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)", opacity: 0.6 }} />
              <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.58rem", color: "var(--muted)", opacity: 0.5 }}>◼ 1A</span>
            </div>

            <div style={{ borderRadius: 3, overflow: "hidden", border: "2px solid #1a1a1a", boxShadow: "0 4px 8px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.16)" }}>
              <div style={{ backgroundColor: "#1a1a1a", padding: "5px 8px", display: "flex", gap: "5px", overflow: "hidden" }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{ width: 17, height: 11, borderRadius: 2, backgroundColor: "#f0ede8", opacity: 0.1, flexShrink: 0 }} />
                ))}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", borderTop: "1px solid #2a2a2a", borderBottom: "1px solid #2a2a2a", backgroundColor: "#eae7e0" }}>
                <div style={{ width: "clamp(140px, 40%, 280px)", minHeight: 300, flexShrink: 0, position: "relative", overflow: "hidden", background: "linear-gradient(160deg, #8a8888 0%, #5a5858 60%, #3a3838 100%)", borderRight: "1px solid #2a2a2a" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/hero.jpg" alt="Anjali Taneja" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, transparent 35%, rgba(0,0,0,0.4) 100%)" }} />
                  {[{ top: 8, left: 8 }, { top: 8, right: 8 }, { bottom: 8, left: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
                    <div key={i} style={{ position: "absolute", ...pos, width: 12, height: 12, borderTop: i < 2 ? "1px solid rgba(255,255,255,0.18)" : undefined, borderBottom: i >= 2 ? "1px solid rgba(255,255,255,0.18)" : undefined, borderLeft: i % 2 === 0 ? "1px solid rgba(255,255,255,0.18)" : undefined, borderRight: i % 2 === 1 ? "1px solid rgba(255,255,255,0.18)" : undefined }} />
                  ))}
                </div>

                <div style={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", padding: "clamp(1.5rem,5vw,3rem) clamp(1.5rem,5vw,3.5rem)", gap: "1.25rem" }}>
                  <div style={{ lineHeight: 0.88 }}>
                    <div style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 300, color: "var(--foreground)", letterSpacing: "-0.02em" }}>anjali</div>
                    <div style={{ fontSize: "clamp(2.5rem, 7vw, 5.5rem)", fontWeight: 500, color: "var(--accent)", letterSpacing: "-0.02em" }}>taneja</div>
                  </div>
                  <div style={{ width: "2rem", height: 2, backgroundColor: "var(--accent)", opacity: 0.5 }} />
                    <div style={{ fontSize: "0.8125rem", lineHeight: 1.85, fontWeight: 300, opacity: 0.65, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <p style={{ margin: 0 }}>Anjali Taneja blends jazz-trained musicianship with vintage soul and modern R&B. Based in New York City, her sound is defined by velvety vocals, emotional storytelling, and a refined musical sensibility.</p>
                    <p style={{ margin: 0 }}>Drawing inspiration from Etta James to Sade, Anjali creates music that feels both timeless and deeply personal. Her recent releases, including &ldquo;Forever You,&rdquo; &ldquo;Keepsake,&rdquo; and &ldquo;Golden Linings&rdquo; build a rich, immersive sonic world.</p>
                    <p style={{ margin: 0 }}>She first gained attention with &ldquo;Only Love&rdquo; alongside Pav Dharia, and has since landed on major Spotify editorial playlists like Fresh Finds and New Music Friday. With over 1M streams and a steadily growing audience, Anjali has performed at iconic venues including Terminal 5 and the Kennedy Center Millennium Stage, and toured with Red Baraat.</p>
                    <p style={{ margin: 0 }}>Anjali is building a sonic and visual world rooted in identity, nostalgia, and emotional depth, inviting listeners to step inside and grow with her as the story unfolds.</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    {[
                      { href: "https://open.spotify.com/artist/1A7CIDrLklSiVgGJjdhdDX",        icon: <SpotifyIcon />,    label: "Spotify" },
                      { href: "https://music.apple.com/us/artist/anjali-taneja/1264329314",    icon: <AppleMusicIcon />, label: "Apple Music" },
                      { href: "https://www.instagram.com/anjalixmusic",                        icon: <InstagramIcon />,  label: "Instagram" },
                      { href: "https://www.youtube.com/c/AnjaliTaneja",                        icon: <YouTubeIcon />,    label: "YouTube" },
                    ].map(({ href, icon, label }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                        style={{ color: "var(--foreground)", opacity: 0.35, transition: "opacity 0.2s, color 0.2s", display: "flex" }}
                        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "1"; el.style.color = "var(--accent)"; }}
                        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.opacity = "0.35"; el.style.color = "var(--foreground)"; }}>
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#1a1a1a", padding: "5px 8px", display: "flex", gap: "5px", overflow: "hidden" }}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} style={{ width: 17, height: 11, borderRadius: 2, backgroundColor: "#f0ede8", opacity: 0.1, flexShrink: 0 }} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.3rem", paddingInline: "0.25rem" }}>
              {[2, 3, 4, 5, 6, 7].map((n) => (
                <span key={n} style={{ fontFamily: "'Courier New', monospace", fontSize: "0.52rem", color: "var(--muted)", opacity: 0.35 }}>{n}▸</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Music ── */}
        <section style={{ padding: "3rem 2rem 6rem" }}>
          <div style={{ maxWidth: "60rem", margin: "0 auto" }}>
            <SectionLabel>music</SectionLabel>
            <div className="song-grid">
              {songs.map((song, idx) => (
                <button key={song.id} onClick={() => setActiveSong(song)}
                  style={{ cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left", transform: `rotate(${cardRotations[idx]}deg)`, transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "rotate(0deg) translateY(-6px)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = `rotate(${cardRotations[idx]}deg)`; }}>
                  <div style={{ width: "100%", aspectRatio: "1/1", background: song.coverGradient, borderRadius: 2, marginBottom: "0.875rem", position: "relative", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.18)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={song.imageUrl} alt={song.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.32) 100%)" }} />
                  </div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 400, letterSpacing: "0.03em", color: "var(--foreground)", marginBottom: "0.2rem" }}>{song.title}</div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 300, color: "var(--muted)", letterSpacing: "0.08em", opacity: 0.6 }}>{song.year} · tap to explore</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {activeSong && <SongWorld song={activeSong} onClose={() => setActiveSong(null)} />}
    </>
  );
}
