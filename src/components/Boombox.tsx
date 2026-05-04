"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface KnobValues { vol: number; bass: number; treb: number; speed: number; reverb: number; }
interface BoomboxProps {
  frequency: string;
  needlePercent: number;
  playing: boolean;
  onKnobChange?: (knob: keyof KnobValues, value: number) => void;
  onPlay?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onStop?: () => void;
}

// 5 knobs in one row inside the panel (x=266–394), y=338
const KNOB_DEFS = [
  { key: "vol"    as const, label: "VOL",   cx: 287, cy: 338 },
  { key: "bass"   as const, label: "BASS",  cx: 308, cy: 338 },
  { key: "treb"   as const, label: "TREB",  cx: 329, cy: 338 },
  { key: "speed"  as const, label: "SPEED", cx: 350, cy: 338 },
  { key: "reverb" as const, label: "REV",   cx: 371, cy: 338 },
];

// SVG viewBox dimensions — used to convert SVG coords → CSS percentages
const VB_W = 660;
const VB_H = 430;

function valToAngle(v: number) { return -135 + (v / 100) * 270; }

// Visual-only knob — NO event handlers; interactivity handled by HTML overlays
function Knob({ def, value }: { def: typeof KNOB_DEFS[number]; value: number }) {
  const angle = valToAngle(value);
  const rad   = ((angle - 90) * Math.PI) / 180;
  const dotX  = def.cx + 7 * Math.cos(rad);
  const dotY  = def.cy + 7 * Math.sin(rad);

  return (
    <g>
      <defs>
        <radialGradient id={`kg_${def.key}`} cx="35%" cy="30%">
          <stop offset="0%"   stopColor="#d4b870" />
          <stop offset="45%"  stopColor="#a07840" />
          <stop offset="100%" stopColor="#6a4c20" />
        </radialGradient>
      </defs>

      <ellipse cx={def.cx+1} cy={def.cy+2.5} rx={10} ry={4}  fill="rgba(0,0,0,0.28)" />
      <circle  cx={def.cx}   cy={def.cy}      r={10}          fill="#6a5428" />
      <circle  cx={def.cx}   cy={def.cy}      r={9}           fill={`url(#kg_${def.key})`} />
      <circle  cx={def.cx}   cy={def.cy}      r={6}  fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.2" />
      <circle  cx={def.cx}   cy={def.cy}      r={6}  fill="none" stroke="#b82020" strokeWidth="1.6"
        strokeDasharray={`${(value / 100) * 18.85} 37.7`}
        strokeDashoffset="4.7"
        transform={`rotate(-135,${def.cx},${def.cy})`} opacity="0.9" />
      <circle cx={dotX} cy={dotY} r={1.5} fill="#1a1008" />
      <ellipse cx={def.cx-2.5} cy={def.cy-2.5} rx={3} ry={2} fill="rgba(255,255,255,0.22)" transform={`rotate(-30,${def.cx},${def.cy})`} />
      <text x={def.cx} y={def.cy+16} textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="4.5" fill="#5a3a18" opacity="0.75">{def.label}</text>
    </g>
  );
}

export default function Boombox({ frequency, needlePercent, playing, onKnobChange, onPlay, onPrev, onNext, onStop }: BoomboxProps) {
  const waveRef    = useRef<SVGPolylineElement>(null);
  const rafRef     = useRef<number>(0);
  const tRef       = useRef(0);
  const playingRef = useRef(playing);
  const [knobs, setKnobs]        = useState<KnobValues>({ vol: 70, bass: 55, treb: 45, speed: 50, reverb: 20 });
  const [pressedBtn, setPressed] = useState<number | null>(null);

  useEffect(() => { playingRef.current = playing; }, [playing]);

  const handleKnob = useCallback((key: keyof KnobValues, val: number) => {
    setKnobs(p => ({ ...p, [key]: val }));
    onKnobChange?.(key, val);
  }, [onKnobChange]);

  // HTML overlay knob drag — works in Safari because it's a plain HTML div, not SVG
  function startKnobDrag(key: keyof KnobValues, startVal: number, startClientY: number) {
    const onMove = (ev: MouseEvent | TouchEvent) => {
      ev.preventDefault();
      const y = "touches" in ev ? ev.touches[0].clientY : (ev as MouseEvent).clientY;
      const newVal = Math.min(100, Math.max(0, Math.round(startVal + (startClientY - y) * 0.9)));
      handleKnob(key, newVal);
    };
    const onEnd = () => {
      window.removeEventListener("mousemove",  onMove as EventListener);
      window.removeEventListener("mouseup",    onEnd);
      window.removeEventListener("touchmove",  onMove as EventListener);
      window.removeEventListener("touchend",   onEnd);
    };
    window.addEventListener("mousemove",  onMove as EventListener);
    window.addEventListener("mouseup",    onEnd);
    window.addEventListener("touchmove",  onMove as EventListener, { passive: false });
    window.addEventListener("touchend",   onEnd);
  }

  // RAF loop — drives waveform only (reels use CSS animation)
  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    const go = () => {
      tRef.current += 0.045;
      const t = tRef.current;
      const isPlaying = playingRef.current;
      const pts: string[] = [];
      for (let i = 0; i <= 34; i++) {
        const x   = 273 + i * 2;
        const amp = isPlaying ? 4 + Math.sin(t * 2.2 + i * 0.5) * 3 : 1.8;
        pts.push(`${x.toFixed(1)},${(168 + Math.sin(t * (isPlaying ? 1 : 0.4) + i * 0.4) * amp).toFixed(1)}`);
      }
      wave.setAttribute("points", pts.join(" "));
      rafRef.current = requestAnimationFrame(go);
    };
    rafRef.current = requestAnimationFrame(go);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const needleX = 272 + (needlePercent / 100) * 106;

  // Button actions
  const btnActions = [
    () => { onPrev?.(); onPrev?.(); },
    () => onPrev?.(),
    () => onPlay?.(),
    () => onNext?.(),
    () => onStop?.(),
  ];

  return (
    /* Outer wrapper: position:relative so HTML overlays can be absolutely placed.
       Drop shadow on an inner div — never on the SVG itself, because a CSS filter
       on <svg> makes Safari composite it as a static bitmap (blocks all repaints). */
    <div className="w-full max-w-2xl mx-auto select-none" style={{ position: "relative" }}>

      {/* Inner div carries the drop-shadow */}
      <div style={{ filter: "drop-shadow(0 18px 48px rgba(42,24,8,0.35))" }}>
        <svg viewBox="0 0 660 430" xmlns="http://www.w3.org/2000/svg"
          style={{ width: "100%", display: "block" }}>
          <defs>
            {/* ── Body gradients ── */}
            <linearGradient id="bodyFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#e8d88a" />
              <stop offset="40%"  stopColor="#d4c478" />
              <stop offset="100%" stopColor="#b8aa60" />
            </linearGradient>
            <linearGradient id="bodyTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f4eca8" />
              <stop offset="100%" stopColor="#d8c87c" />
            </linearGradient>
            <linearGradient id="bodySide" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#8a7830" />
              <stop offset="100%" stopColor="#6a5c20" />
            </linearGradient>

            {/* ── Handle gradients ── */}
            <linearGradient id="handleTop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#e0b870" />
              <stop offset="100%" stopColor="#c09040" />
            </linearGradient>
            <linearGradient id="handleFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#c09040" />
              <stop offset="100%" stopColor="#8a6020" />
            </linearGradient>
            <linearGradient id="handleSide" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#6a4818" />
              <stop offset="100%" stopColor="#503810" />
            </linearGradient>

            {/* ── Speaker gradients ── */}
            <radialGradient id="spkMount" cx="40%" cy="35%">
              <stop offset="0%"   stopColor="#a09880" />
              <stop offset="70%"  stopColor="#787060" />
              <stop offset="100%" stopColor="#504840" />
            </radialGradient>
            <radialGradient id="spkSurround" cx="40%" cy="35%">
              <stop offset="0%"   stopColor="#5a5448" />
              <stop offset="100%" stopColor="#2a2418" />
            </radialGradient>
            <radialGradient id="spkCone" cx="38%" cy="33%">
              <stop offset="0%"   stopColor="#585048" />
              <stop offset="30%"  stopColor="#302820" />
              <stop offset="100%" stopColor="#100c08" />
            </radialGradient>
            <radialGradient id="spkHub" cx="32%" cy="28%">
              <stop offset="0%"   stopColor="#c8b898" />
              <stop offset="60%"  stopColor="#908070" />
              <stop offset="100%" stopColor="#585048" />
            </radialGradient>

            {/* ── Panel / cassette gradients ── */}
            <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#d0c070" />
              <stop offset="100%" stopColor="#b8a850" />
            </linearGradient>
            <linearGradient id="tunerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f8f0c0" />
              <stop offset="100%" stopColor="#e8dc98" />
            </linearGradient>
            <radialGradient id="reelGrad" cx="35%" cy="30%">
              <stop offset="0%"   stopColor="#4a4030" />
              <stop offset="100%" stopColor="#1a1408" />
            </radialGradient>

            {/* ── Filters ── */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#2a1808" floodOpacity="0.3" />
            </filter>
            <filter id="insetShadow" x="-5%" y="-5%" width="110%" height="110%">
              <feFlood floodColor="#2a1808" floodOpacity="0.4" result="flood" />
              <feComposite in="flood" in2="SourceGraphic" operator="in" result="shadow" />
              <feGaussianBlur in="shadow" stdDeviation="2" result="blurred" />
              <feComposite in="SourceGraphic" in2="blurred" operator="over" />
            </filter>
            <filter id="glassReflect">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* clip waveform to display box */}
            <clipPath id="waveClip">
              <rect x="271" y="155" width="72" height="26" rx="1.5" />
            </clipPath>
          </defs>

          {/* ══════════════════════════════════════════
              HANDLE — 3D box: top face + front face + side
              ══════════════════════════════════════════ */}
          {/* handle side (right) */}
          <polygon points="420,14 428,20 428,70 420,64" fill="url(#handleSide)" />
          {/* handle top face */}
          <polygon points="228,14 420,14 428,20 236,20" fill="url(#handleTop)" />
          {/* handle front face */}
          <rect x="228" y="20" width="192" height="44" rx="0" fill="url(#handleFront)" />
          {/* handle hollow cutout (top face) */}
          <polygon points="250,19 400,19 408,25 242,25" fill="#f0e8d4" />
          {/* handle hollow (front face) */}
          <rect x="250" y="25" width="150" height="30" rx="0" fill="#e8e0cc" />
          {/* inner hollow shadow */}
          <rect x="250" y="25" width="150" height="6" fill="rgba(0,0,0,0.12)" />
          {/* handle top edge highlight */}
          <line x1="228" y1="14" x2="420" y2="14" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />

          {/* Cassette tapes resting on top */}
          <g transform="rotate(-6,148,60)">
            <rect x="100" y="48" width="92" height="22" rx="2" fill="#ddd8b8" />
            <rect x="102" y="50" width="88" height="7"  rx="1" fill="#b82020" opacity="0.9" />
            <text x="146" y="66" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="5" fill="#5a3010" opacity="0.7">ANJALI MIX VOL.1</text>
            <rect x="116" y="52" width="12" height="3" rx="1" fill="#e8e0b8" opacity="0.6" />
            <rect x="136" y="52" width="12" height="3" rx="1" fill="#e8e0b8" opacity="0.6" />
          </g>
          <g transform="rotate(5,510,55)">
            <rect x="464" y="42" width="92" height="22" rx="2" fill="#d4ccac" />
            <rect x="466" y="44" width="88" height="7"  rx="1" fill="#4a3018" opacity="0.8" />
            <text x="510" y="60" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="5" fill="#5a3010" opacity="0.7">LATE NIGHT FEELS</text>
            <rect x="480" y="46" width="12" height="3" rx="1" fill="#e8e0b8" opacity="0.6" />
            <rect x="500" y="46" width="12" height="3" rx="1" fill="#e8e0b8" opacity="0.6" />
          </g>

          {/* ══════════════════════════════════════════
              BODY — 3D box: top face + side + front
              ══════════════════════════════════════════ */}
          {/* body side face (right depth edge) */}
          <polygon points="628,72 644,82 644,364 628,354" fill="url(#bodySide)" />
          {/* body top face */}
          <polygon points="14,66 628,66 644,80 30,80" fill="url(#bodyTop)" />
          {/* top face edge highlight */}
          <line x1="14" y1="66" x2="628" y2="66" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

          {/* main front body */}
          <rect x="14" y="80" width="614" height="274" rx="0" fill="url(#bodyFront)" />

          {/* bottom face / floor shadow */}
          <rect x="14" y="350" width="614" height="8" fill="rgba(0,0,0,0.15)" />
          <polygon points="14,358 628,358 644,368 30,368" fill="#8a7a38" opacity="0.6" />

          {/* front face — subtle horizontal light banding */}
          <rect x="14" y="80" width="614" height="50" fill="rgba(255,255,255,0.06)" />
          <rect x="14" y="130" width="614" height="1" fill="rgba(0,0,0,0.06)" />

          {/* ── Left vent grille (recessed look) ── */}
          <rect x="20" y="88" width="50" height="258" rx="2" fill="rgba(0,0,0,0.08)" />
          {Array.from({length:10}).map((_,i) => (
            <g key={i}>
              <rect x={24+i*4} y="92" width="2" height="250" rx="1" fill="rgba(0,0,0,0.25)" />
              <rect x={25+i*4} y="92" width="1" height="250" rx="1" fill="rgba(255,255,255,0.1)" />
            </g>
          ))}

          {/* ── Right vent grille ── */}
          <rect x="590" y="88" width="50" height="258" rx="2" fill="rgba(0,0,0,0.08)" />
          {Array.from({length:10}).map((_,i) => (
            <g key={i}>
              <rect x={594+i*4} y="92" width="2" height="250" rx="1" fill="rgba(0,0,0,0.25)" />
              <rect x={595+i*4} y="92" width="1" height="250" rx="1" fill="rgba(255,255,255,0.1)" />
            </g>
          ))}

          {/* ══════════════════════════════════════════
              LEFT SPEAKER — realistic 3D cone
              ══════════════════════════════════════════ */}
          {/* cast shadow on body */}
          <ellipse cx="157" cy="228" rx="104" ry="12" fill="rgba(0,0,0,0.12)" />
          {/* mounting plate */}
          <circle cx="157" cy="220" r="104" fill="url(#spkMount)" />
          {/* plate bevel highlight */}
          <circle cx="157" cy="220" r="104" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <circle cx="157" cy="220" r="102" fill="none" stroke="rgba(0,0,0,0.3)"       strokeWidth="1" />
          {/* outer surround */}
          <circle cx="157" cy="220" r="95"  fill="url(#spkSurround)" />
          <circle cx="157" cy="220" r="93"  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          {/* surround rings — 3D depth */}
          {[88,82,76].map((r,i) => (
            <g key={r}>
              <circle cx="157" cy="220" r={r}   fill="none" stroke="rgba(0,0,0,0.5)"         strokeWidth={2-i*0.3} />
              <circle cx="157" cy="220" r={r-1} fill="none" stroke="rgba(255,255,255,0.06)"  strokeWidth="1" />
            </g>
          ))}
          {/* cone body */}
          <circle cx="157" cy="220" r="70"  fill="url(#spkCone)" />
          {/* cone rings */}
          {[60,50,40].map((r) => (
            <g key={r}>
              <circle cx="157" cy="220" r={r}   fill="none" stroke="rgba(0,0,0,0.55)"   strokeWidth="1.8" />
              <circle cx="157" cy="220" r={r-1} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </g>
          ))}
          {/* dust cap */}
          <circle cx="157" cy="220" r="28"  fill="#1a1408" />
          <circle cx="157" cy="220" r="22"  fill="#201810" />
          {/* hub */}
          <circle cx="157" cy="220" r="16"  fill="url(#spkHub)" />
          <circle cx="157" cy="220" r="9"   fill="#c0b090" />
          <circle cx="157" cy="220" r="5"   fill="#e8ddb0" />
          <circle cx="157" cy="220" r="2"   fill="#f8f0d0" />
          {/* specular arc — simulates top-left light hit */}
          <path d="M 108,178 A 62,62 0 0 1 160,168" stroke="rgba(255,255,255,0.18)" strokeWidth="8"  fill="none" strokeLinecap="round" />
          <path d="M 112,182 A 56,56 0 0 1 158,173" stroke="rgba(255,255,255,0.10)" strokeWidth="4"  fill="none" strokeLinecap="round" />
          {/* mounting screws */}
          {[[80,128],[234,128],[80,312],[234,312]].map(([sx,sy],i) => (
            <g key={i}>
              <circle cx={sx} cy={sy} r="5" fill="#9a8a60" />
              <circle cx={sx} cy={sy} r="3.5" fill="#b8a870" />
              <line x1={sx-2} y1={sy} x2={sx+2} y2={sy} stroke="#6a5828" strokeWidth="0.8" />
              <line x1={sx} y1={sy-2} x2={sx} y2={sy+2} stroke="#6a5828" strokeWidth="0.8" />
            </g>
          ))}

          {/* ══════════════════════════════════════════
              RIGHT SPEAKER
              ══════════════════════════════════════════ */}
          <ellipse cx="503" cy="228" rx="104" ry="12" fill="rgba(0,0,0,0.12)" />
          <circle cx="503" cy="220" r="104" fill="url(#spkMount)" />
          <circle cx="503" cy="220" r="104" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <circle cx="503" cy="220" r="102" fill="none" stroke="rgba(0,0,0,0.3)"       strokeWidth="1" />
          <circle cx="503" cy="220" r="95"  fill="url(#spkSurround)" />
          <circle cx="503" cy="220" r="93"  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
          {[88,82,76].map((r,i) => (
            <g key={r}>
              <circle cx="503" cy="220" r={r}   fill="none" stroke="rgba(0,0,0,0.5)"        strokeWidth={2-i*0.3} />
              <circle cx="503" cy="220" r={r-1} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            </g>
          ))}
          <circle cx="503" cy="220" r="70"  fill="url(#spkCone)" />
          {[60,50,40].map((r) => (
            <g key={r}>
              <circle cx="503" cy="220" r={r}   fill="none" stroke="rgba(0,0,0,0.55)"       strokeWidth="1.8" />
              <circle cx="503" cy="220" r={r-1} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            </g>
          ))}
          <circle cx="503" cy="220" r="28"  fill="#1a1408" />
          <circle cx="503" cy="220" r="22"  fill="#201810" />
          <circle cx="503" cy="220" r="16"  fill="url(#spkHub)" />
          <circle cx="503" cy="220" r="9"   fill="#c0b090" />
          <circle cx="503" cy="220" r="5"   fill="#e8ddb0" />
          <circle cx="503" cy="220" r="2"   fill="#f8f0d0" />
          <path d="M 454,178 A 62,62 0 0 1 506,168" stroke="rgba(255,255,255,0.18)" strokeWidth="8"  fill="none" strokeLinecap="round" />
          <path d="M 458,182 A 56,56 0 0 1 504,173" stroke="rgba(255,255,255,0.10)" strokeWidth="4"  fill="none" strokeLinecap="round" />
          {[[426,128],[580,128],[426,312],[580,312]].map(([sx,sy],i) => (
            <g key={i}>
              <circle cx={sx} cy={sy} r="5" fill="#9a8a60" />
              <circle cx={sx} cy={sy} r="3.5" fill="#b8a870" />
              <line x1={sx-2} y1={sy} x2={sx+2} y2={sy} stroke="#6a5828" strokeWidth="0.8" />
              <line x1={sx} y1={sy-2} x2={sx} y2={sy+2} stroke="#6a5828" strokeWidth="0.8" />
            </g>
          ))}

          {/* ══════════════════════════════════════════
              CENTER CONTROL PANEL — recessed
              ══════════════════════════════════════════ */}
          {/* outer bevel (raised surround) */}
          <rect x="262" y="86" width="136" height="280" rx="4" fill="#c4b460" filter="url(#softShadow)" />
          {/* bevel top highlight */}
          <rect x="262" y="86" width="136" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
          {/* bevel left highlight */}
          <rect x="262" y="86" width="3" height="280" fill="rgba(255,255,255,0.15)" />
          {/* inner panel (recessed) */}
          <rect x="266" y="90" width="128" height="272" rx="2" fill="url(#panelGrad)" />
          {/* inner top shadow (recessed illusion) */}
          <rect x="266" y="90" width="128" height="8" fill="rgba(0,0,0,0.12)" />
          <rect x="266" y="90" width="4"   height="272" fill="rgba(0,0,0,0.08)" />

          {/* ── Tuner strip (recessed) ── */}
          <rect x="269" y="94"  width="122" height="56" rx="3" fill="rgba(0,0,0,0.12)" />
          <rect x="270" y="95"  width="120" height="54" rx="2" fill="url(#tunerGrad)" />
          {/* inner shadow top */}
          <rect x="270" y="95" width="120" height="5" fill="rgba(0,0,0,0.08)" />
          {/* frequency ticks & labels */}
          {["75","80","85","88","90","92","96","100","104"].map((f,i) => (
            <g key={f}>
              <line x1={274+i*13} y1="97" x2={274+i*13} y2={i%2===0?"108":"104"} stroke="#8a7040" strokeWidth="0.9" opacity="0.8" />
              {i%2===0 && <text x={274+i*13} y="118" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="5.5" fill="#6a5020" opacity="0.85">{f}</text>}
            </g>
          ))}
          {/* FM label */}
          <text x="276" y="143" fontFamily="'Courier New', monospace" fontSize="5.5" fill="#8a6828" opacity="0.6" letterSpacing="1">FM STEREO</text>
          {/* Red needle */}
          <g style={{ transition: "transform 0.7s cubic-bezier(0.34,1.4,0.64,1)", transform: `translateX(${needleX - 320}px)` }}>
            <rect x="318.5" y="95" width="2" height="46" rx="1" fill="#b82020" />
            <polygon points="316,95 323,95 319.5,89" fill="#b82020" />
            {/* needle glow */}
            <rect x="318.5" y="95" width="2" height="46" rx="1" fill="rgba(184,32,32,0.25)" transform="scale(2.5,1) translate(-7.6,0)" />
          </g>
          {/* tuner glass sheen */}
          <rect x="270" y="95" width="120" height="16" rx="2" fill="rgba(255,255,255,0.14)" />

          {/* ── Mini display + waveform ── */}
          <rect x="270" y="154" width="74" height="28" rx="2" fill="rgba(0,0,0,0.18)" />
          <rect x="271" y="155" width="72" height="26" rx="1.5" fill="#c4b44c" />
          <rect x="271" y="155" width="72" height="7"  rx="1.5" fill="rgba(255,255,255,0.12)" />
          {/* no clipPath — Safari suppresses repaints on clipped elements updated by JS */}
          <polyline ref={waveRef} points="275,168 295,168 315,168 335,168" fill="none" stroke="#b82020" strokeWidth="1.8" opacity="0.85" />

          {/* Frequency readout */}
          <rect x="349" y="154" width="44" height="28" rx="2" fill="rgba(0,0,0,0.18)" />
          <rect x="350" y="155" width="42" height="26" rx="1.5" fill="#c4b44c" />
          <rect x="350" y="155" width="42" height="7"  rx="1.5" fill="rgba(255,255,255,0.12)" />
          <text x="371" y="171" textAnchor="middle" dominantBaseline="middle" fontFamily="'Courier New', monospace" fontSize="7.5" fontWeight="bold" fill="#2a1808" letterSpacing="0.5">{frequency.replace(" FM","")}</text>

          {/* ── Knobs (visual only — events handled by HTML overlays) ── */}
          {KNOB_DEFS.map(def => (
            <Knob key={def.key} def={def} value={knobs[def.key]} />
          ))}

          {/* ══════════════════════════════════════════
              CASSETTE DECK — recessed window
              ══════════════════════════════════════════ */}
          {/* outer recess shadow */}
          <rect x="269" y="186" width="122" height="116" rx="3" fill="rgba(0,0,0,0.3)" />
          {/* deck housing */}
          <rect x="270" y="187" width="120" height="114" rx="2" fill="#201808" />
          {/* inner face */}
          <rect x="272" y="189" width="116" height="110" rx="1.5" fill="#181008" />

          {/* Cassette label area */}
          <rect x="274" y="192" width="112" height="32" rx="2" fill="#e0d8c0" />
          {/* label shine */}
          <rect x="274" y="192" width="112" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
          {/* label red stripe */}
          <rect x="276" y="194" width="108" height="9" rx="1" fill="#b82020" />

          {/* Left reel housing */}
          <circle cx="300" cy="258" r="28" fill="#2a2010" />
          <circle cx="300" cy="258" r="25" fill="url(#reelGrad)" />
          <circle cx="300" cy="258" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          {/* CSS animation — transform-box:fill-box makes transform-origin:center
              relative to the group's own bounding box, which is required in Safari */}
          <g style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: playing ? "reel-spin 1s linear infinite" : "none",
          }}>
            <line x1="300" y1="258" x2="315" y2="258" stroke="#5a4828" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="300" y1="258" x2="292" y2="271" stroke="#5a4828" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="300" y1="258" x2="292" y2="245" stroke="#5a4828" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <circle cx="300" cy="258" r="9"  fill="#3a2e18" />
          <circle cx="300" cy="258" r="6"  fill="#8a7848" />
          <ellipse cx="298" cy="255" rx="3" ry="2" fill="rgba(255,255,255,0.18)" />

          {/* Right reel housing */}
          <circle cx="360" cy="258" r="28" fill="#2a2010" />
          <circle cx="360" cy="258" r="25" fill="url(#reelGrad)" />
          <circle cx="360" cy="258" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <g style={{
            transformBox: "fill-box",
            transformOrigin: "center",
            animation: playing ? "reel-spin 1s linear infinite" : "none",
          }}>
            <line x1="360" y1="258" x2="375" y2="258" stroke="#5a4828" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="360" y1="258" x2="352" y2="271" stroke="#5a4828" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="360" y1="258" x2="352" y2="245" stroke="#5a4828" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          <circle cx="360" cy="258" r="9"  fill="#3a2e18" />
          <circle cx="360" cy="258" r="6"  fill="#8a7848" />
          <ellipse cx="358" cy="255" rx="3" ry="2" fill="rgba(255,255,255,0.18)" />

          {/* Tape path between reels */}
          <path d="M 316,258 Q 330,270 344,258" stroke="#b82020" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9" />
          {/* tape guide post left */}
          <rect x="313" y="275" width="5" height="8" rx="2" fill="#4a3a20" />
          <rect x="343" y="275" width="5" height="8" rx="2" fill="#4a3a20" />
          {/* tape slot */}
          <rect x="314" y="285" width="32" height="5" rx="2.5" fill="#0a0808" />

          {/* Cassette window plastic glass sheen */}
          <rect x="272" y="189" width="116" height="30" rx="1.5" fill="rgba(255,255,255,0.04)" />
          <path d="M 274,191 Q 330,196 386,191" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none" />

          {/* ── Push buttons row — VISUAL ONLY (events handled by HTML overlays) ── */}
          {(["◀◀","◀","▶","▶▶","■"] as const).map((label, i) => {
            const pressed = pressedBtn === i;
            const dy = pressed ? 2 : 0;
            return (
              <g key={i}>
                {/* visuals only — no event handlers */}
                {!pressed && <rect x={271+i*24} y="308" width="20" height="14" rx="2.5" fill="rgba(0,0,0,0.3)" />}
                <rect x={270+i*24} y={305+dy} width="20" height="14" rx="2.5" fill="#a09040" />
                <rect x={271+i*24} y={305+dy} width="18" height="5"  rx="2"   fill={pressed ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.2)"} />
                <rect x={271+i*24} y={307+dy} width="18" height="10" rx="2"   fill={pressed ? "#8a7830" : "#b8a850"} />
                <text x={280+i*24} y={314+dy} textAnchor="middle" dominantBaseline="middle" fontSize="5.5" fill="#3a2808" opacity="0.85">{label}</text>
              </g>
            );
          })}

          {/* ── Knob section divider ── */}
          <rect x="268" y="322" width="124" height="1"  fill="rgba(0,0,0,0.18)" />
          <rect x="268" y="323" width="124" height="0.5" fill="rgba(255,255,255,0.12)" />
          <text x="330" y="332" textAnchor="middle" fontFamily="'Courier New',monospace" fontSize="4.5" fill="#5a3a18" opacity="0.5" letterSpacing="1.5">EQ  ·  FX</text>

          {/* ══════════════════════════════════════════
              FINAL BODY OVERLAYS
              ══════════════════════════════════════════ */}
          {/* overall top-left body sheen */}
          <rect x="14" y="80" width="614" height="60" fill="rgba(255,255,255,0.05)" />
          {/* right edge inner shadow */}
          <rect x="600" y="80" width="28" height="270" fill="rgba(0,0,0,0.06)" />
        </svg>
      </div>{/* end filter div */}

      {/* ══════════════════════════════════════════════════════════════
          HTML OVERLAYS — absolutely positioned directly in the wrapper.
          No pointer-events:none parent wrapper — Safari doesn't reliably
          fire events on children of pointer-events:none elements.
          Each overlay is a direct child of the position:relative wrapper.
          Coords: left = svgX/VB_W*100%, top = svgY/VB_H*100%
          ══════════════════════════════════════════════════════════════ */}

      {/* ── Knob hit areas (drag up/down to change value) ── */}
      {KNOB_DEFS.map(def => (
        <div
          key={`knob-overlay-${def.key}`}
          style={{
            position: "absolute",
            left:            `${(def.cx - 14) / VB_W * 100}%`,
            top:             `${(def.cy - 14) / VB_H * 100}%`,
            width:           `${28 / VB_W * 100}%`,
            height:          `${28 / VB_H * 100}%`,
            cursor:          "ns-resize",
            touchAction:     "none",
            background:      "rgba(0,0,0,0)",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            WebkitTapHighlightColor: "transparent" as any,
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            startKnobDrag(def.key, knobs[def.key], e.clientY);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            startKnobDrag(def.key, knobs[def.key], e.touches[0].clientY);
          }}
        />
      ))}

      {/* ── Transport button hit areas ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={`btn-overlay-${i}`}
          style={{
            position: "absolute",
            left:        `${(269 + i * 24) / VB_W * 100}%`,
            top:         `${303 / VB_H * 100}%`,
            width:       `${24 / VB_W * 100}%`,
            height:      `${20 / VB_H * 100}%`,
            cursor:      "pointer",
            touchAction: "manipulation",
            background:  "rgba(0,0,0,0)",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            WebkitTapHighlightColor: "transparent" as any,
          }}
          onMouseDown={() => setPressed(i)}
          onMouseUp={() => setPressed(null)}
          onMouseLeave={() => setPressed(null)}
          onClick={() => btnActions[i]?.()}
          onTouchStart={(e) => { e.preventDefault(); setPressed(i); }}
          onTouchEnd={(e) => { e.preventDefault(); setPressed(null); btnActions[i]?.(); }}
        />
      ))}

    </div>
  );
}
