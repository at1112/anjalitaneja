"use client";

import { useState, useEffect, useRef } from "react";
import Boombox from "@/components/Boombox";

// ─── Song streaming links — replace with your real URLs ───────────────────
// ─── Replace each value with the direct track URL when ready ──────────────
const songLinks: Record<string, { spotify: string; apple: string }> = {
  "Golden Linings": {
    spotify: "https://open.spotify.com/track/6hm4HEbg2VQGmRubQC7Ly3",
    apple:   "https://music.apple.com/us/album/golden-linings/1711174533?i=1711174537",
  },
  "My Side": {
    spotify: "https://open.spotify.com/track/2acl3sdl3Pdp4LUw72nol1",
    apple:   "https://music.apple.com/us/album/my-side-single/1711174497",
  },
  "Forever You": {
    spotify: "https://open.spotify.com/track/4bUxpM2lK4xzMrqFxS8wGi",
    apple:   "https://music.apple.com/us/album/forever-you-single/1707861861",
  },
};

// ─── Add audioUrl once you drop .mp3 files into /public/audio/ ───────────
const tracks = {
  goldenLinings: { title: "Golden Linings", artist: "Anjali Taneja", audioUrl: "" /* "/audio/golden-linings.mp3" */ },
  mySide:        { title: "My Side",        artist: "Anjali Taneja", audioUrl: "" /* "/audio/my-side.mp3" */ },
  foreverYou:    { title: "Forever You",    artist: "Anjali Taneja", audioUrl: "" /* "/audio/forever-you.mp3" */ },
  keepsake:      { title: "Keepsake",       artist: "Anjali Taneja", audioUrl: "" /* "/audio/keepsake.mp3" */ },
  jindMahi:      { title: "Jind Mahi",       artist: "Anjali Taneja", audioUrl: "" /* "/audio/jind-mahi.mp3" */ },
  
};

const stations = [
  { id: "nostalgic", name: "nostalgic", desc: "warmth, memory",  freq: "88.7 FM", freqNum: 88.7, tracks: [tracks.keepsake]  },
  { id: "alt-rnb",   name: "alt r&b",   desc: "♡",  freq: "91.3 FM", freqNum: 91.3, tracks: [tracks.mySide, tracks.foreverYou]  },
  { id: "soul",      name: "soul",       desc: "",         freq: "94.5 FM", freqNum: 94.5, tracks: [tracks.foreverYou, tracks.goldenLinings] },
  { id: "punjabi",   name: "punjabi",    desc: "",           freq: "97.1 FM", freqNum: 97.1, tracks: [tracks.jindMahi] },
];

const FREQ_MIN = 87.5;
const FREQ_MAX = 108.0;
function freqToPercent(freq: number) { return ((freq - FREQ_MIN) / (FREQ_MAX - FREQ_MIN)) * 100; }

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
      <div style={{ width: 8, height: 8, backgroundColor: "var(--accent)", flexShrink: 0 }} />
      <span style={{ fontSize: "0.62rem", fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase", opacity: 0.4 }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, backgroundColor: "var(--border)" }} />
    </div>
  );
}

function SpotifyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.622.622 0 01-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.622.622 0 11-.277-1.215c3.809-.87 7.077-.496 9.712 1.115a.622.622 0 01.207.857zm1.224-2.724a.78.78 0 01-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 01-.973-.517.781.781 0 01.517-.973c3.632-1.102 8.147-.568 11.236 1.328a.78.78 0 01.257 1.071zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71a.937.937 0 11-.543-1.794c3.527-1.07 9.401-.863 13.105 1.337a.937.937 0 01-.944 1.612z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export default function RadioPage() {
  const [activeStation, setActiveStation] = useState(stations[0]);
  const [playing, setPlaying]       = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [progress, setProgress]     = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef   = useRef<number>(0);

  const currentTrack = activeStation.tracks[trackIndex];

  // ── Wire up audio element events (timeupdate + ended) ──────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime  = () => { if (audio.duration) setProgress(audio.currentTime / audio.duration); };
    const onEnded = () => { setTrackIndex(i => (i + 1) % activeStation.tracks.length); setProgress(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => { audio.removeEventListener("timeupdate", onTime); audio.removeEventListener("ended", onEnded); };
  }, [activeStation]);

  // ── Load + play/pause real audio when track or playing changes ──────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack.audioUrl) return;
    if (audio.src !== window.location.origin + currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }
    if (playing) audio.play().catch(() => {});
    else audio.pause();
  }, [playing, currentTrack]);

  // ── Fake progress timer — only runs when there's no audio file ──────────
  useEffect(() => {
    if (!playing || currentTrack.audioUrl) { cancelAnimationFrame(rafRef.current); return; }
    const start = performance.now() - progress * 180000;
    const tick  = (now: number) => {
      const p = Math.min((now - start) / 180000, 1);
      setProgress(p);
      if (p >= 1) { setTrackIndex(i => (i + 1) % activeStation.tracks.length); setProgress(0); }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, currentTrack, activeStation]);

  const handleStation = (s: typeof stations[number]) => {
    setActiveStation(s); setTrackIndex(0); setProgress(0); setPlaying(true);
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.src = ""; }
  };
  const links = songLinks[currentTrack.title];

  return (
    <main style={{ paddingBottom: "7rem" }}>
      {/* Hidden audio element — src is set dynamically when audioUrl is provided */}
      <audio ref={audioRef} preload="metadata" />
      {/* Boombox */}
      <section style={{ paddingTop: "2.5rem", paddingBottom: "0.5rem", paddingInline: "2rem" }}>
        <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
          <Boombox
            frequency={activeStation.freq}
            needlePercent={freqToPercent(activeStation.freqNum)}
            playing={playing}
            onPlay={() => setPlaying(p => !p)}
            onPrev={() => { setTrackIndex(i => i === 0 ? activeStation.tracks.length - 1 : i - 1); setProgress(0); }}
            onNext={() => { setTrackIndex(i => (i + 1) % activeStation.tracks.length); setProgress(0); }}
            onStop={() => { setPlaying(false); setProgress(0); setTrackIndex(0); }}
          />
          <p style={{ textAlign: "center", fontSize: "0.58rem", letterSpacing: "0.18em", opacity: 0.28, marginTop: "0.5rem", fontFamily: "'Courier New', monospace" }}>
            drag knobs · tap stations
          </p>
        </div>
      </section>

      {/* Stations */}
      <section style={{ padding: "2rem 2rem" }}>
        <div style={{ maxWidth: "40rem", margin: "0 auto" }}>
          <SectionLabel>stations</SectionLabel>
          <div className="station-grid">
            {stations.map((s) => {
              const active = s.id === activeStation.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleStation(s)}
                  style={{
                    textAlign: "left",
                    padding: "1.25rem 1.5rem",
                    borderRadius: 2,
                    cursor: "pointer",
                    border: `1px solid ${active ? "rgba(184,32,32,0.4)" : "var(--border)"}`,
                    backgroundColor: active ? "rgba(184,32,32,0.06)" : "var(--surface)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "background-color 0.2s, border-color 0.2s",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--nav-bg)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface)"; }}
                >
                  {active && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, backgroundColor: "var(--accent)" }} />}
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: "0.62rem", color: active ? "var(--accent)" : "var(--muted)", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
                    {s.freq}
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: active ? 500 : 300, color: "var(--foreground)", marginBottom: "0.2rem" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: "0.62rem", fontWeight: 300, color: "var(--muted)", opacity: 0.6 }}>
                    {s.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Now playing */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, backgroundColor: "var(--nav-bg)", borderTop: "1px solid var(--border)" }}>
        {/* Progress bar */}
        <div style={{ height: 2, backgroundColor: "var(--border)" }}>
          <div style={{ height: "100%", width: `${progress * 100}%`, backgroundColor: "var(--accent)", transition: playing ? "width 1s linear" : "none", boxShadow: "1px 0 8px rgba(184,32,32,0.4)" }} />
        </div>

        <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "0.875rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          {/* Signal + track + stream links */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", minWidth: 0, flex: 1 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, backgroundColor: playing ? "var(--accent)" : "var(--border)", boxShadow: playing ? "0 0 8px rgba(184,32,32,0.6)" : "none", transition: "background-color 0.3s, box-shadow 0.3s" }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: "0.8125rem", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentTrack.title}</div>
              <div style={{ fontSize: "0.62rem", fontWeight: 300, opacity: 0.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.06em" }}>{activeStation.name} · {activeStation.freq}</div>
            </div>
            {/* Streaming links */}
            {links && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                <a href={links.spotify} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--foreground)", opacity: 0.35, display: "flex", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.35"; }}
                  aria-label="Listen on Spotify">
                  <SpotifyIcon />
                </a>
                <a href={links.apple} target="_blank" rel="noopener noreferrer"
                  style={{ color: "var(--foreground)", opacity: 0.35, display: "flex", transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.35"; }}
                  aria-label="Listen on Apple Music">
                  <AppleIcon />
                </a>
              </div>
            )}
          </div>

          {/* Playback controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", flexShrink: 0 }}>
            <button onClick={() => { setTrackIndex((i) => i === 0 ? activeStation.tracks.length - 1 : i - 1); setProgress(0); }} aria-label="prev"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)", opacity: 0.4, padding: "0.25rem", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.4")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" /></svg>
            </button>

            <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"}
              style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--accent)", color: "#f0e8d4", border: "none", cursor: "pointer", boxShadow: "0 2px 10px rgba(184,32,32,0.3)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}>
              {playing
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                : <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
            </button>

            <button onClick={() => { setTrackIndex((i) => (i + 1) % activeStation.tracks.length); setProgress(0); }} aria-label="next"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground)", opacity: 0.4, padding: "0.25rem", transition: "opacity 0.2s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")} onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.4")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6l5.5 3.9V8.1L8.5 12zM16 6h2v12h-2z" /></svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
