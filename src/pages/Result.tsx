// src/pages/Result.tsx — REDESIGN: Dark Luxury / Cosmic Edition
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fromBase64 } from '../utils/string';

// ── Radial Score Ring ────────────────────────────────────────────
const RING_COLORS = [
  { stroke: '#f59e0b', glow: '#f59e0b' },
  { stroke: '#34d399', glow: '#34d399' },
  { stroke: '#60a5fa', glow: '#60a5fa' },
  { stroke: '#f472b6', glow: '#f472b6' },
  { stroke: '#a78bfa', glow: '#a78bfa' },
];

function RadialBar({
  label, value, max, index, rank,
}: { label: string; value: number; max: number; index: number; rank: number }) {
  const [progress, setProgress] = useState(0);
  const pct = max > 0 ? value / max : 0;
  const c = RING_COLORS[index % RING_COLORS.length];

  useEffect(() => {
    const id = setTimeout(() => setProgress(pct), 150 + index * 130);
    return () => clearTimeout(id);
  }, [pct, index]);

  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = circ * progress;

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        animation: `rSlideUp 0.5s ease both`,
        animationDelay: `${0.08 * index + 0.2}s`,
      }}
    >
      {/* Rank badge */}
      <span style={{
        width: 24, flexShrink: 0, textAlign: 'center',
        fontFamily: "'Courier New', monospace",
        fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 700,
      }}>#{rank}</span>

      {/* Mini ring */}
      <div style={{ flexShrink: 0, width: 54, height: 54, position: 'relative' }}>
        <svg width="54" height="54" viewBox="0 0 54 54" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="27" cy="27" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5" />
          <circle
            cx="27" cy="27" r={r} fill="none"
            stroke={c.stroke} strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 4px ${c.glow})` }}
          />
        </svg>
        <span style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Courier New', monospace", fontSize: 12, fontWeight: 700, color: c.stroke,
        }}>{value}</span>
      </div>

      {/* Label + bar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 15, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.85)',
        }}>{label.toUpperCase()}</span>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${c.glow}88, ${c.glow})`,
            width: `${progress * 100}%`,
            transition: 'width 1s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: `0 0 8px ${c.glow}66`,
          }} />
        </div>
      </div>
    </div>
  );
}

// ── Stat Pill ────────────────────────────────────────────────────
function StatPill({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{
      flex: 1, textAlign: 'center', padding: '20px 12px',
      borderRight: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 36, letterSpacing: '0.05em', color: '#f59e0b',
        lineHeight: 1,
        textShadow: '0 0 20px rgba(245,158,11,0.5)',
      }}>{value}</div>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)', marginTop: 6,
      }}>{label}</div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────
export default function Result() {
  const { key } = useParams<{ key?: string }>();
  const { t } = useTranslation();
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [userName, setUserName] = useState('');
  const [topCategory, setTopCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!key) return;
    const tryDecode = () => {
      for (const fn of [
        () => fromBase64(key),
        () => fromBase64(decodeURIComponent(key)),
        () => decodeURIComponent(escape(atob(key))),
        () => atob(key),
      ]) { try { return fn(); } catch {} }
      throw new Error('decode failed');
    };
    try {
      const p = JSON.parse(tryDecode());
      if (!p?.categoryScores) { window.location.href = '/'; return; }
      setScores(p.categoryScores);
      setUserName((p.name || '').replace(/\b(\w)/g, (m: string) => m.toUpperCase()));
      const sorted = Object.entries(p.categoryScores as Record<string, number>).sort((a, b) => b[1] - a[1]);
      if (sorted.length) setTopCategory(sorted[0][0]?.toLowerCase() ?? null);
      setTimeout(() => setVisible(true), 60);
    } catch { window.location.href = '/'; }
  }, [key]);

  if (!scores) return null;

  const imageMap: Record<string, string> = {
    technology: '/images/technology-min.png', tech: '/images/technology-min.png',
    it: '/images/technology-min.png', art: '/images/art-min.png',
    nature: '/images/nature-min.png', science: '/images/nature-min.png',
  };
  const imageSrc = topCategory ? (imageMap[topCategory] ?? `/images/${topCategory}-min.png`) : '/images/aptitude-min.png';
  const altText  = topCategory ? t(`${topCategory}-alt`) : t('aptitude');

  const sorted     = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxScore   = sorted[0]?.[1] ?? 1;
  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const avgScore   = Math.round(totalScore / Math.max(Object.keys(scores).length, 1));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Crimson+Pro:ital,wght@0,400;1,400&family=Courier+New&display=swap');

        @keyframes rSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes rFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rPopIn {
          0%   { opacity: 0; transform: scale(0.80) rotate(-4deg); }
          60%  { transform: scale(1.05) rotate(1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes rGlow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes rScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes rFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #05050f; }

        .rp-root {
          min-height: 100dvh;
          background: radial-gradient(ellipse 80% 60% at 50% -10%, #1a0f3a 0%, #05050f 60%);
          font-family: 'Crimson Pro', serif;
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative orbs */
        .rp-orb {
          position: fixed; border-radius: 50%; pointer-events: none;
          filter: blur(80px); animation: rGlow 4s ease-in-out infinite;
        }

        /* Noise grain overlay */
        .rp-root::after {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 180px;
          opacity: 0.35;
        }

        /* Top ticker */
        .rp-ticker {
          position: relative; z-index: 2;
          border-bottom: 1px solid rgba(245,158,11,0.2);
          background: rgba(245,158,11,0.04);
          padding: 9px 0; overflow: hidden; white-space: nowrap;
        }
        .rp-ticker-inner {
          display: inline-flex; gap: 0;
          animation: rScroll 28s linear infinite;
        }
        .rp-ticker-item {
          font-family: "'Courier New', monospace";
          font-size: 11px; letter-spacing: 0.15em;
          color: rgba(245,158,11,0.6);
          padding: 0 28px;
        }
        .rp-ticker-dot { color: #f59e0b; }

        /* Wrapper */
        .rp-wrap {
          position: relative; z-index: 1;
          max-width: 600px; margin: 0 auto; padding: 0 20px 100px;
        }

        /* Hero section */
        .rp-hero-section {
          display: flex; flex-direction: column; align-items: center;
          padding: 56px 0 40px; text-align: center; gap: 16px;
        }

        /* Category chip */
        .rp-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 99px; padding: 5px 14px;
          font-family: "'Courier New', monospace";
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #f59e0b;
          animation: rSlideUp 0.5s ease both;
        }

        /* Name */
        .rp-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 14vw, 7rem);
          letter-spacing: 0.04em; line-height: 0.9;
          color: #ffffff;
          text-shadow: 0 0 60px rgba(245,158,11,0.15);
          animation: rSlideUp 0.55s ease 0.1s both;
        }

        /* Image float */
        .rp-img-wrap {
          animation: rPopIn 0.7s ease 0.3s both;
        }
        .rp-img-wrap img {
          width: 90px; height: 90px; object-fit: contain;
          filter: drop-shadow(0 0 20px rgba(245,158,11,0.4));
          animation: rFloat 3s ease-in-out infinite;
        }

        /* Explanation */
        .rp-quote {
          font-style: italic; font-size: 17px; line-height: 1.75;
          color: rgba(255,255,255,0.55); max-width: 440px;
          animation: rSlideUp 0.55s ease 0.35s both;
        }

        /* Divider line */
        .rp-divider {
          width: 60px; height: 2px;
          background: linear-gradient(90deg, transparent, #f59e0b, transparent);
          margin: 4px auto;
        }

        /* Glass card */
        .rp-glass {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          backdrop-filter: blur(16px);
          overflow: hidden;
        }

        /* Stats row */
        .rp-stats {
          display: flex; border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .rp-stats .rp-stat:last-child { border-right: none; }

        /* Bars header */
        .rp-bars-head {
          padding: 18px 24px 4px;
          display: flex; align-items: center; gap: 10px;
        }
        .rp-bars-head-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,0.1), transparent);
        }
        .rp-bars-head-label {
          font-family: "'Courier New', monospace";
          font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.25);
        }

        /* Bars body */
        .rp-bars-body {
          padding: 8px 24px 16px;
        }

        /* Date stamp */
        .rp-date {
          text-align: center; padding: 20px 0;
          font-family: "'Courier New', monospace";
          font-size: 11px; letter-spacing: 0.15em;
          color: rgba(255,255,255,0.18);
          animation: rFadeIn 0.8s ease 0.6s both;
        }

        /* Home button */
        .rp-home {
          position: fixed; bottom: 28px; right: 28px;
          width: 52px; height: 52px; border-radius: 50%;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #f59e0b; text-decoration: none;
          backdrop-filter: blur(12px);
          transition: all 0.25s ease;
          z-index: 100;
        }
        .rp-home:hover {
          background: rgba(245,158,11,0.22);
          box-shadow: 0 0 20px rgba(245,158,11,0.2);
          transform: scale(1.08);
        }
      `}</style>

      {/* Decorative background orbs */}
      <div className="rp-orb" style={{
        width: 400, height: 400, top: -100, right: -120,
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        animationDelay: '0s',
      }} />
      <div className="rp-orb" style={{
        width: 300, height: 300, bottom: 100, left: -80,
        background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
        animationDelay: '2s',
      }} />

      <div
        className="rp-root"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        {/* Ticker */}
        <div className="rp-ticker" aria-hidden="true">
          <div className="rp-ticker-inner">
            {[1, 2].map(n =>
              sorted.map(([cat, val], i) => (
                <span key={`${n}-${i}`} className="rp-ticker-item">
                  {(t(cat.toLowerCase()) as string).toUpperCase()}&nbsp;
                  <span className="rp-ticker-dot">◆</span>&nbsp;{val}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="rp-wrap">

          {/* Hero */}
          <div className="rp-hero-section">
            <div className="rp-chip">
              <span>★</span>
              <span>{topCategory ? (t(topCategory) as string) : ''}</span>
            </div>

            <h1 className="rp-name">{userName || '—'}</h1>

            <div className="rp-img-wrap">
              <img src={imageSrc} alt={altText} loading="lazy" />
            </div>

            <div className="rp-divider" />

            <p
              className="rp-quote"
              dangerouslySetInnerHTML={{
                __html: t(`${topCategory ?? Object.keys(scores)[0] ?? ''}-explanation`) as string,
              }}
            />
          </div>

          {/* Glass card */}
          <div
            className="rp-glass"
            style={{ animation: 'rSlideUp 0.6s ease 0.4s both' }}
          >
            {/* Stats */}
            <div className="rp-stats">
              <StatPill value={maxScore}   label="Eng yuqori" />
              <StatPill value={totalScore} label="Jami ball" />
              <StatPill value={avgScore}   label="O'rtacha" />
              <StatPill value={sorted.length} label="Kategoriya" />
            </div>

            {/* Bars */}
            <div className="rp-bars-head">
              <span className="rp-bars-head-label">Natijalar tahlili</span>
              <div className="rp-bars-head-line" />
            </div>
            <div className="rp-bars-body">
              {sorted.map(([cat, val], i) => (
                <RadialBar
                  key={cat}
                  label={t(cat.toLowerCase()) as string}
                  value={val}
                  max={maxScore}
                  index={i}
                  rank={i + 1}
                />
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="rp-date">
            {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

        </div>

        {/* Home button */}
        <Link to="/" className="rp-home" title="Bosh sahifa">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
          </svg>
        </Link>
      </div>
    </>
  );
}
