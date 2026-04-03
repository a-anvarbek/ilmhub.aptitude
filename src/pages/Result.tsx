// src/pages/Result.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fromBase64 } from '../utils/string';


// ── Animatsiyali gorizontal bar ──────────────────────────────────
const COLORS = [
  { bg: '#fde68a', accent: '#b45309', label: '#92400e' },
  { bg: '#bbf7d0', accent: '#059669', label: '#065f46' },
  { bg: '#bfdbfe', accent: '#2563eb', label: '#1e3a8a' },
  { bg: '#fecaca', accent: '#dc2626', label: '#7f1d1d' },
];

function ScoreBar({
  label, value, max, index, rank
}: { label: string; value: number; max: number; index: number; rank: number }) {
  const [width, setWidth] = useState('0%');
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const c = COLORS[index % COLORS.length];

  useEffect(() => {
    const id = setTimeout(() => setWidth(`${pct}%`), 100 + index * 120);
    return () => clearTimeout(id);
  }, [pct, index]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      animation: `slideIn 0.5s ease both`, animationDelay: `${0.1 + index * 0.1}s`
    }}>
      {/* Rank */}
      <span style={{
        width: 28, textAlign: 'right', flexShrink: 0,
        fontFamily: "'Courier Prime', monospace",
        fontSize: 13, color: '#9ca3af', fontWeight: 700
      }}>#{rank}</span>

      {/* Label */}
      <span style={{
        width: 100, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 13, letterSpacing: '0.04em', textTransform: 'uppercase',
        color: '#374151'
      }}>{label}</span>

      {/* Bar track */}
      <div style={{
        flex: 1, height: 28, background: '#f3f4f6', borderRadius: 6, overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, height: '100%',
          width, borderRadius: 6,
          background: c.bg,
          transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          paddingRight: 10
        }}>
          {parseInt(width) > 15 && (
            <span style={{
              fontFamily: "'Courier Prime', monospace",
              fontSize: 12, fontWeight: 700, color: c.label
            }}>{value}</span>
          )}
        </div>
        {/* Accent line */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 4, background: c.accent, borderRadius: '6px 0 0 6px'
        }}/>
      </div>

      {/* Score */}
      <span style={{
        width: 36, textAlign: 'right', flexShrink: 0,
        fontFamily: "'Courier Prime', monospace",
        fontSize: 16, fontWeight: 700, color: c.accent
      }}>{value}</span>
    </div>
  );
}

// ── Asosiy sahifa ─────────────────────────────────────────────────
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
  const altText = topCategory ? t(`${topCategory}-alt`) : t('aptitude');
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxScore = sorted[0]?.[1] ?? 1;
  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Courier+Prime:wght@400;700&family=Lora:ital,wght@0,400;1,400&display=swap');

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.88); }
          70%  { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        * { box-sizing: border-box; }

        .rp-root {
          min-height: 100dvh;
          background: #fafaf8;
          font-family: 'Syne', sans-serif;
        }

        /* Ticker şerit */
        .ticker-wrap {
          background: #1a1a1a; overflow: hidden;
          padding: 10px 0; white-space: nowrap;
        }
        .ticker-inner {
          display: inline-block;
          animation: marquee 22s linear infinite;
        }
        .ticker-inner span {
          font-family: 'Courier Prime', monospace;
          font-size: 12px; letter-spacing: 0.1em; color: #e5e7eb;
          padding: 0 32px;
        }
        .ticker-inner span.dot { color: #f59e0b; padding: 0 8px; }

        /* Header */
        .rp-header {
          border-bottom: 2px solid #1a1a1a;
          padding: 28px 32px 0;
          display: flex; justify-content: space-between; align-items: flex-end;
          flex-wrap: wrap; gap: 16px;
        }
        .rp-header-label {
          font-family: 'Courier Prime', monospace;
          font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
          color: #9ca3af; margin-bottom: 6px;
        }
        .rp-date {
          font-family: 'Courier Prime', monospace;
          font-size: 12px; color: #9ca3af; padding-bottom: 12px;
        }

        /* Ism bloki */
        .rp-name {
          font-family: 'Syne', sans-serif; font-weight: 800;
          font-size: clamp(3rem, 9vw, 5.5rem);
          line-height: 0.95; letter-spacing: -0.02em;
          color: #1a1a1a;
          animation: fadeDown 0.7s ease 0.1s both;
        }

        /* Karta */
        .rp-card {
          border: 1.5px solid #e5e7eb;
          border-radius: 16px;
          background: #fff;
          overflow: hidden;
        }

        /* Natija kartasi yuqori qismi */
        .rp-hero {
          display: flex; gap: 0; align-items: stretch;
          flex-wrap: wrap;
        }
        .rp-hero-img {
          width: 160px; flex-shrink: 0;
          background: #f9fafb;
          border-right: 1.5px solid #e5e7eb;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: popIn 0.6s ease 0.2s both;
        }
        .rp-hero-body {
          flex: 1; padding: 24px 28px;
          display: flex; flex-direction: column; gap: 12px;
        }

        /* Izoh matni */
        .rp-explanation {
          font-family: 'Lora', serif; font-style: italic;
          font-size: 15px; line-height: 1.8; color: #4b5563;
          border-left: 3px solid #f59e0b;
          padding-left: 16px; margin: 0;
        }

        /* Statistika qatori */
        .rp-stats {
          display: flex; gap: 0;
          border-top: 1.5px solid #e5e7eb;
          flex-wrap: wrap;
        }
        .rp-stat {
          flex: 1; min-width: 100px;
          padding: 16px 20px;
          border-right: 1.5px solid #e5e7eb;
          text-align: center;
        }
        .rp-stat:last-child { border-right: none; }
        .rp-stat-val {
          font-family: 'Courier Prime', monospace;
          font-size: 26px; font-weight: 700;
          color: #1a1a1a; display: block;
        }
        .rp-stat-lbl {
          font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: #9ca3af;
        }

        /* Barlar bo'limi */
        .rp-bars-header {
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: #9ca3af; font-family: 'Courier Prime', monospace;
          padding: 20px 24px 12px; border-bottom: 1px solid #f3f4f6;
        }
        .rp-bars-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 14px; }

        /* Bosh sahifa tugmasi */
        .rp-home {
          position: fixed; bottom: 24px; right: 24px;
          width: 48px; height: 48px; border-radius: 50%;
          background: #1a1a1a; border: none;
          display: flex; align-items: center; justify-content: center;
          color: #fff; text-decoration: none;
          transition: transform 0.2s ease, background 0.2s ease;
          z-index: 10;
        }
        .rp-home:hover { background: #374151; transform: scale(1.1); }
      `}</style>

      <div className="rp-root" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}>

        {/* Ticker */}
        <div className="ticker-wrap">
          <div className="ticker-inner" aria-hidden="true">
            {[1,2].map(n => (
              <span key={n}>
                {sorted.map(([cat, val], i) => (
                  <>
                    <span key={`${n}-${i}`}>{(t(cat.toLowerCase()) as string).toUpperCase()} — {val}</span>
                    <span className="dot">◆</span>
                  </>
                ))}
                <span>{(t('aptitude') as string).toUpperCase()}</span>
                <span className="dot">◆</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 100px' }}>

          {/* Header */}
          <div className="rp-header">
            <div>
              <p className="rp-header-label">{t('aptitude')}</p>
              <h1 className="rp-name">{userName || '—'}</h1>
            </div>
            <div className="rp-date">
              {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div style={{ height: 32 }} />

          {/* Asosiy karta */}
          <div className="rp-card" style={{ animation: 'slideIn 0.6s ease 0.2s both' }}>

            {/* Hero qator */}
            <div className="rp-hero">
              <div className="rp-hero-img">
                <img src={imageSrc} alt={altText} width="100" height="100"
                  style={{ objectFit: 'contain' }} loading="lazy" />
              </div>
              <div className="rp-hero-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    background: '#fef3c7', color: '#b45309',
                    fontFamily: "'Courier Prime', monospace",
                    fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                    padding: '4px 10px', borderRadius: 4, fontWeight: 700
                  }}>
                    ★ {topCategory ? (t(topCategory) as string) : ''}
                  </div>
                </div>
                <p className="rp-explanation"
                  dangerouslySetInnerHTML={{
                    __html: t(`${topCategory ?? Object.keys(scores)[0] ?? ''}-explanation`) as string
                  }} />
              </div>
            </div>

            {/* Statistika */}
            <div className="rp-stats">
              <div className="rp-stat">
                <span className="rp-stat-val">{maxScore}</span>
                <span className="rp-stat-lbl">Eng yuqori ball</span>
              </div>
              <div className="rp-stat">
                <span className="rp-stat-val">{totalScore}</span>
                <span className="rp-stat-lbl">Jami ball</span>
              </div>
              <div className="rp-stat">
                <span className="rp-stat-val">{Object.keys(scores).length}</span>
                <span className="rp-stat-lbl">Kategoriya</span>
              </div>
            </div>

            {/* Barlar */}
            <div className="rp-bars-header">Natijalar tahlili</div>
            <div className="rp-bars-body">
              {sorted.map(([cat, val], i) => (
                <ScoreBar
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

        </div>

        {/* Bosh sahifa */}
        <Link to="/" className="rp-home" title="Bosh sahifa">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
          </svg>
        </Link>
      </div>
    </>
  );
}