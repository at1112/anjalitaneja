"use client";

import { useEffect } from "react";

interface Song {
  title: string;
  year?: string;
  coverColor: string;
  coverGradient?: string;
  story: string;
  spotifyUrl: string;
  videoUrl?: string;
}

export default function SongWorld({ song, onClose }: { song: Song; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", flexDirection: "column", overflowY: "auto", backgroundColor: "#111", color: "#e8e5e0" }}>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "rgba(17,17,17,0.96)", backdropFilter: "blur(10px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
          {/* Small colored square — echoes the boombox accent squares */}
          <div style={{ width: 8, height: 8, backgroundColor: "#b82020", flexShrink: 0 }} />
          <span style={{ fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 500, opacity: 0.45 }}>
            {song.title}{song.year ? ` — ${song.year}` : ""}
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ background: "none", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(232,229,224,0.45)", fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", padding: "0.4rem 0.9rem", borderRadius: 2, transition: "border-color 0.2s, color 0.2s" }}
          onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.3)"; el.style.color = "rgba(232,229,224,0.9)"; }}
          onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.12)"; el.style.color = "rgba(232,229,224,0.45)"; }}
        >
          esc · close
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: "60rem", margin: "0 auto", width: "100%", padding: "5rem 2.5rem 6rem" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "5rem", alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* Cover / video */}
          <div style={{ flex: "0 0 auto", width: "min(100%, 22rem)" }}>
            {song.videoUrl ? (
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 2, overflow: "hidden", boxShadow: "0 8px 60px rgba(0,0,0,0.7)" }}>
                <iframe src={song.videoUrl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} allow="autoplay; fullscreen" allowFullScreen title={song.title} />
              </div>
            ) : (
              <div style={{ width: "100%", aspectRatio: "1/1", background: song.coverGradient || song.coverColor, borderRadius: 2, position: "relative", overflow: "hidden", boxShadow: "0 8px 60px rgba(0,0,0,0.7)" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.38) 100%)" }} />
              </div>
            )}
          </div>

          {/* Story */}
          <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: "1.75rem", paddingTop: "0.5rem" }}>
            <div>
              {song.year && (
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", opacity: 0.28, fontWeight: 400, marginBottom: "0.75rem" }}>{song.year}</div>
              )}
              <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 300, lineHeight: 1, letterSpacing: "-0.02em", margin: 0, color: "#e8e5e0" }}>{song.title}</h2>
            </div>

            <div style={{ width: "2rem", height: 2, backgroundColor: "#b82020" }} />

            <p style={{ fontSize: "0.9rem", lineHeight: 1.95, fontStyle: "italic", fontWeight: 300, opacity: 0.6, maxWidth: "38ch", margin: 0, color: "#e8e5e0" }}>
              {song.story}
            </p>

            <a
              href={song.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: "#b82020", textDecoration: "none", alignSelf: "flex-start", padding: "0.75rem 1.25rem", border: "1px solid rgba(184,32,32,0.35)", borderRadius: 2, transition: "background-color 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(184,32,32,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.224-2.724a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.517.781.781 0 01.517-.973c3.632-1.102 8.147-.568 11.236 1.328a.78.78 0 01.257 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.527-1.07 9.401-.863 13.105 1.337a.937.937 0 01-.944 1.612z" />
              </svg>
              Listen on Spotify
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
