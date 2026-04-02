// src/pages/Result.tsx — REDESIGN v4: Retro Arcade / Y2K Neon Scoreboard
import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fromBase64 } from '../utils/string';

// ── Scanline canvas overlay ──────────────────────────────────────
function Scanlines() {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 99,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
    }} />
  );
}

// ── Pixel score bar ──────────────────────────────────────────────
const NEON = ['#ff006e', '#00f5d4', '#fee440', '#8338ec', '#fb5607'];

function PixelBar({ label, value, max, index, rank }:
  { label: string; value: number; max: number; index: number; rank: number }) {
  const [blocks, setBlocks] = useState(0);
  const totalBlocks = 20;
  const filled = max > 0 ? Math.round((value / max) * totalBlocks) : 0;
  const color = NEON[index % NEON.length];

  useEffect(() => {
    let cur = 0;
    const id = setInterval(() => {
      cur++;
      setBlocks(cur);
      if (cur >= filled) clearInterval(id);
    }, 40 + index * 10);
    const delay = setTimeout(() => {}, 200 + index * 120);
    return () => { clearInterval(id); clearTimeout(delay); };
  }, [filled, index]);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '36px 1fr auto',
      alignItems: 'center', gap: 12,
      padding: '10px 0',
      animation: `arcSlide 0.4s ease both`,
      animationDelay: `${0.07 * index + 0.3}s`,
    }}>
      {/* Rank */}
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 9, color: color,
        textShadow: `0 0 8px ${color}`,
      }}>#{rank}</span>

      <div>
        {/* Label */}
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 9, color: '#e2e8f0', marginBottom: 6,
          letterSpacing: '0.05em',
          textShadow: '0 0 6px rgba(255,255,255,0.3)',
        }}>{label.toUpperCase()}</div>
        {/* Pixel blocks */}
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: totalBlocks }).map((_, i) => (
            <div key={i} style={{
              width: 10, height: 10,
              background: i < blocks ? color : 'rgba(255,255,255,0.07)',
              boxShadow: i < blocks ? `0 0 6px ${color}` : 'none',
              transition: 'background 0.1s ease, box-shadow 0.1s ease',
            }} />
          ))}
        </div>
      </div>

      {/* Score */}
      <span style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 14, color,
        textShadow: `0 0 12px ${color}, 0 0 24px ${color}55`,
        minWidth: 40, textAlign: 'right',
      }}>{value}</span>
    </div>
  );
}

// ── Blinking cursor ──────────────────────────────────────────────
function Blink({ children }: { children: React.ReactNode }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 600);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0 }}>{children}</span>;
}

// ── Main ─────────────────────────────────────────────────────────
export default function Result() {
  const { key } = useParams<{ key?: string }>();
  const { t } = useTranslation();
  const [scores, setScores] = useState<Record<string, number> | null>(null);
  const [userName, setUserName] = useState('');
  const [topCategory, setTopCategory] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [bootDone, setBootDone] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);

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

      // Boot sequence
      const lines = [
        '> APTITUDE SYSTEM v2.4.1',
        '> Loading neural modules... OK',
        '> Scanning profile data... OK',
        `> User identified: ${(p.name || '').toUpperCase()}`,
        '> Generating report...',
        '> DONE ✓',
      ];
      let i = 0;
      const iv = setInterval(() => {
        setBootLines(prev => [...prev, lines[i]]);
        i++;
        if (i >= lines.length) {
          clearInterval(iv);
          setTimeout(() => { setBootDone(true); setVisible(true); }, 400);
        }
      }, 320);
    } catch { window.location.href = '/'; }
  }, [key]);

  if (!scores && bootLines.length === 0) return null;

  const imageMap: Record<string, string> = {
    technology: '/images/technology-min.png', tech: '/images/technology-min.png',
    it: '/images/technology-min.png', art: '/images/art-min.png',
    nature: '/images/nature-min.png', science: '/images/nature-min.png',
  };
  const imageSrc  = topCategory ? (imageMap[topCategory] ?? `/images/${topCategory}-min.png`) : '/images/aptitude-min.png';
  const altText   = topCategory ? t(`${topCategory}-alt`) : t('aptitude');
  const sorted    = scores ? Object.entries(scores).sort((a, b) => b[1] - a[1]) : [];
  const maxScore  = sorted[0]?.[1] ?? 1;
  const totalScore = scores ? Object.values(scores).reduce((s, v) => s + v, 0) : 0;
  const topColor  = NEON[0];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap');

        @keyframes arcSlide {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes arcFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes arcPop {
          0%   { transform: scale(0); opacity: 0; }
          70%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes arcGlitch {
          0%,95%,100% { transform: none; clip-path: none; }
          96% { transform: translate(-3px, 1px) skewX(-3deg); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
          98% { transform: translate(3px, -1px) skewX(2deg); clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%); }
        }
        @keyframes arcPulse {
          0%,100% { box-shadow: 0 0 10px ${topColor}55, inset 0 0 10px ${topColor}22; }
          50%      { box-shadow: 0 0 30px ${topColor}99, inset 0 0 20px ${topColor}44; }
        }
        @keyframes arcFloat {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes arcSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes arcBoot {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes arcGrid {
          from { background-position: 0 0; }
          to   { background-position: 0 40px; }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050a0f; }

        .arc-root {
          min-height: 100dvh;
          background: #050a0f;
          background-image:
            linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: arcGrid 3s linear infinite;
          font-family: 'VT323', monospace;
          position: relative;
          overflow-x: hidden;
        }

        /* Boot screen */
        .arc-boot {
          min-height: 100dvh; display: flex; flex-direction: column;
          justify-content: center; align-items: flex-start;
          padding: 40px; max-width: 600px; margin: 0 auto;
        }
        .arc-boot-line {
          font-family: 'Press Start 2P', monospace;
          font-size: 11px; color: #00f5d4; line-height: 2.4;
          animation: arcBoot 0.2s ease both;
          text-shadow: 0 0 8px #00f5d4;
        }

        /* Main */
        .arc-wrap { max-width: 640px; margin: 0 auto; padding: 0 20px 100px; }

        /* Header */
        .arc-header {
          border-bottom: 2px solid ${topColor};
          padding: 24px 0 16px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 2px 20px ${topColor}33;
          animation: arcFadeIn 0.5s ease both;
        }
        .arc-logo {
          font-family: 'Press Start 2P', monospace;
          font-size: 10px; color: ${topColor};
          text-shadow: 0 0 12px ${topColor};
          letter-spacing: 0.1em;
        }
        .arc-header-score {
          font-family: 'Press Start 2P', monospace;
          font-size: 10px; color: #fee440;
          text-shadow: 0 0 10px #fee440;
        }

        /* Hero block */
        .arc-hero {
          padding: 40px 0 32px; text-align: center;
          animation: arcFadeIn 0.5s ease 0.2s both;
        }

        /* Category tag */
        .arc-tag {
          display: inline-block;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px; padding: 8px 16px;
          background: transparent;
          border: 2px solid ${topColor};
          color: ${topColor};
          text-shadow: 0 0 8px ${topColor};
          box-shadow: 0 0 12px ${topColor}44, inset 0 0 8px ${topColor}22;
          letter-spacing: 0.12em;
          margin-bottom: 24px;
          animation: arcPop 0.5s ease 0.4s both;
        }

        /* Name */
        .arc-name {
          font-family: 'Press Start 2P', monospace;
          font-size: clamp(1.4rem, 7vw, 2.8rem);
          color: #fff;
          letter-spacing: 0.04em; line-height: 1.3;
          text-shadow: 3px 3px 0 ${topColor}, 6px 6px 0 ${topColor}55;
          animation: arcGlitch 6s ease infinite, arcFadeIn 0.5s ease 0.3s both;
          margin-bottom: 24px;
        }

        /* Image */
        .arc-img {
          animation: arcFloat 3s ease-in-out infinite, arcPop 0.6s ease 0.5s both;
          filter: drop-shadow(0 0 16px ${topColor}) drop-shadow(0 0 32px ${topColor}55);
          margin-bottom: 20px;
        }

        /* Quote */
        .arc-quote {
          font-family: 'VT323', monospace;
          font-size: 20px; color: rgba(255,255,255,0.55);
          line-height: 1.5; max-width: 440px; margin: 0 auto;
        }

        /* Stats row */
        .arc-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 12px; margin-bottom: 28px;
          animation: arcFadeIn 0.5s ease 0.35s both;
        }
        .arc-stat-box {
          border: 1px solid;
          padding: 16px 12px; text-align: center;
          position: relative; overflow: hidden;
          animation: arcPulse 3s ease-in-out infinite;
        }
        .arc-stat-box::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .arc-stat-val {
          font-family: 'Press Start 2P', monospace;
          font-size: 24px; display: block; line-height: 1;
          margin-bottom: 8px;
        }
        .arc-stat-lbl {
          font-family: 'VT323', monospace;
          font-size: 16px; color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* Divider */
        .arc-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 8px;
          animation: arcFadeIn 0.5s ease 0.4s both;
        }
        .arc-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
        .arc-divider-label {
          font-family: 'Press Start 2P', monospace;
          font-size: 8px; color: rgba(255,255,255,0.3);
          letter-spacing: 0.15em; white-space: nowrap;
        }

        /* Bars */
        .arc-bars {
          border: 1px solid rgba(255,255,255,0.08);
          padding: 20px;
          background: rgba(255,255,255,0.02);
          animation: arcFadeIn 0.5s ease 0.45s both;
        }

        /* Footer */
        .arc-footer {
          text-align: center; padding: 32px 0;
          font-family: 'Press Start 2P', monospace;
          font-size: 8px; color: rgba(255,255,255,0.15);
          letter-spacing: 0.1em; line-height: 2;
          animation: arcFadeIn 0.5s ease 0.6s both;
        }

        /* Home */
        .arc-home {
          position: fixed; bottom: 24px; right: 24px;
          width: 52px; height: 52px;
          border: 2px solid ${topColor};
          background: #050a0f;
          color: ${topColor}; text-decoration: none;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s ease; z-index: 100;
          box-shadow: 0 0 16px ${topColor}44;
        }
        .arc-home:hover {
          background: ${topColor}22;
          box-shadow: 0 0 32px ${topColor}88;
          transform: scale(1.1);
        }
      `}</style>

      <Scanlines />

      {/* Boot sequence */}
      {!bootDone && (
        <div className="arc-root" style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#050a0f' }}>
          <div className="arc-boot">
            {bootLines.map((line, i) => (
              <div key={i} className="arc-boot-line" style={{ animationDelay: `${i * 0.05}s` }}>
                {line}
                {i === bootLines.length - 1 && <Blink>_</Blink>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main UI */}
      {scores && (
        <div className="arc-root" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          <div className="arc-wrap">

            {/* Header */}
            <div className="arc-header">
              <div className="arc-logo">APTITUDE.EXE</div>
              <div className="arc-header-score">
                SCORE: {totalScore.toString().padStart(6, '0')}
              </div>
            </div>

            {/* Hero */}
            <div className="arc-hero">
              <div className="arc-tag">
                ★ {topCategory ? (t(topCategory) as string).toUpperCase() : ''}
              </div>
              <h1 className="arc-name">{userName || '???'}</h1>
              <div className="arc-img">
                <img src={imageSrc} alt={altText} width="80" height="80"
                  style={{ objectFit: 'contain' }} loading="lazy" />
              </div>
              <p className="arc-quote" dangerouslySetInnerHTML={{
                __html: t(`${topCategory ?? Object.keys(scores)[0] ?? ''}-explanation`) as string,
              }} />
            </div>

            {/* Stats */}
            <div className="arc-stats">
              {[
                { val: maxScore,   lbl: 'TOP SCORE', color: NEON[0] },
                { val: totalScore, lbl: 'TOTAL',     color: NEON[1] },
                { val: sorted.length, lbl: 'STAGES', color: NEON[2] },
              ].map(({ val, lbl, color }) => (
                <div key={lbl} className="arc-stat-box" style={{ borderColor: color + '66', animationDelay: '1s' }}>
                  <span className="arc-stat-val" style={{ color, textShadow: `0 0 12px ${color}` }}>{val}</span>
                  <span className="arc-stat-lbl">{lbl}</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="arc-divider">
              <div className="arc-divider-line" />
              <span className="arc-divider-label">LEADERBOARD</span>
              <div className="arc-divider-line" />
            </div>
            <div className="arc-bars">
              {sorted.map(([cat, val], i) => (
                <PixelBar
                  key={cat}
                  label={t(cat.toLowerCase()) as string}
                  value={val}
                  max={maxScore}
                  index={i}
                  rank={i + 1}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="arc-footer">
              <div>INSERT COIN TO CONTINUE</div>
              <Blink>▼</Blink>
              <div style={{ marginTop: 12 }}>
                {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

          </div>

          {/* Home */}
          <Link to="/" className="arc-home" title="Bosh sahifa">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
              <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
            </svg>
          </Link>
        </div>
      )}
    </>
  );
}
