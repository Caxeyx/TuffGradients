import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, ShieldCheck, Download, Code2 } from 'lucide-react';
import { getHarmonies, getAccessibility, getClosestPantone, formatCodeSnippet } from '../utils/colorEngine';
import { CURATED_PALETTES } from '../data/colorCatalog';

export default function HarmoniesView({ baseColor, setBaseColor, onCopy, copiedHex }) {
  const [harmonyType, setHarmonyType] = useState('complementary');
  const [exportFormat, setExportFormat] = useState('css');
  const [showExportModal, setShowExportModal] = useState(false);

  const harmonies = getHarmonies(baseColor);
  const accessibility = getAccessibility(baseColor);
  const pantoneMatch = getClosestPantone(baseColor);

  const harmonyTypesList = [
    { id: 'complementary', label: 'Complementary', desc: 'Direct 180° contrast for dynamic energy & focal buttons' },
    { id: 'analogous', label: 'Analogous', desc: 'Serene neighboring colors for cohesive, calm editorial design' },
    { id: 'triadic', label: 'Triadic', desc: 'Equidistant 120° harmony providing rich visual variety' },
    { id: 'splitComplementary', label: 'Split-Complementary', desc: 'Sophisticated contrast with reduced visual tension' },
    { id: 'tetradic', label: 'Tetradic (4-Color)', desc: 'Balanced dual complementary pairs for multifaceted UI' },
    { id: 'monochromatic', label: 'Monochromatic Tints', desc: 'Pure tonal hierarchy for light/dark surfaces and shadows' }
  ];

  const activeHarmonies = harmonies ? (harmonies[harmonyType] || []) : [];
  const fullPalette = [baseColor, ...activeHarmonies];

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '750px', margin: '0 auto 36px auto' }}>
        <span style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--accent-apple-blue)',
          display: 'inline-block',
          marginBottom: '8px'
        }}>
          Color Relationship Engine
        </span>
        <h1 style={{
          fontSize: '2.6rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginBottom: '14px'
        }}>
          What Colors Go Together?
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          Explore scientifically balanced harmonies based on the optical color wheel, with real-time accessibility contrast scoring and instant Pantone reference.
        </p>
      </div>

      {/* Main Base Color Controller (Apple Studio Dial Style) */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '30px',
        marginBottom: '36px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          {/* Base color picker + input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              overflow: 'hidden',
              boxShadow: `0 8px 24px ${baseColor}55`,
              border: '2px solid rgba(255,255,255,0.4)'
            }}>
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  cursor: 'pointer',
                  border: 'none'
                }}
              />
            </div>
            <div>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Anchor Color</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    width: '120px'
                  }}
                />
                <button
                  onClick={() => onCopy(baseColor, 'HEX')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-subtle)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--text-secondary)'
                  }}
                >
                  {copiedHex === baseColor ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                Matched Pantone: <strong>{pantoneMatch.pantone}</strong> ({pantoneMatch.name})
              </p>
            </div>
          </div>

          {/* Quick Apple Accessibility Badges */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{
              background: 'var(--bg-subtle)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldCheck size={18} color="var(--accent-apple-blue)" />
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>White Contrast</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{accessibility.contrastOnWhite}:1 ({accessibility.wcagScoreWhite})</span>
              </div>
            </div>

            <div style={{
              background: 'var(--bg-subtle)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <ShieldCheck size={18} color="var(--accent-apple-blue)" />
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Black Contrast</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{accessibility.contrastOnBlack}:1 ({accessibility.wcagScoreBlack})</span>
              </div>
            </div>

            {/* Export Palette Button */}
            <button
              onClick={() => setShowExportModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--text-primary)',
                color: 'var(--bg-primary)',
                fontWeight: 600,
                fontSize: '0.84rem'
              }}
            >
              <Code2 size={16} />
              <span>Export Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Harmony Category Selector (Apple Segmented Bar) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
        marginBottom: '32px'
      }}>
        {harmonyTypesList.map((item) => {
          const isSelected = harmonyType === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setHarmonyType(item.id)}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--bg-secondary)' : 'transparent',
                border: isSelected ? '2px solid var(--accent-apple-blue)' : '1px solid var(--border-subtle)',
                textAlign: 'left',
                boxShadow: isSelected ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? 'var(--accent-apple-blue)' : 'var(--text-primary)', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* The Active Harmony Palette Ribbon (Apple Horizontal Swatch Strip) */}
      <div style={{ marginBottom: '48px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Generated Harmony: {harmonyTypesList.find(h => h.id === harmonyType)?.label}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
            ({fullPalette.length} matched shades)
          </span>
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${fullPalette.length}, 1fr)`,
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)',
          minHeight: '220px'
        }}>
          {fullPalette.map((col, idx) => {
            const pInfo = getClosestPantone(col);
            const a11y = getAccessibility(col);
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: col,
                  padding: '20px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: a11y.recommendedTextColor,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => onCopy(col, 'HEX')}
                title="Click to copy HEX"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: a11y.isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)'
                  }}>
                    {idx === 0 ? 'Anchor' : `Pair ${idx}`}
                  </span>
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: a11y.isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {copiedHex === col ? <Check size={12} /> : <Copy size={12} />}
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', margin: '0 0 2px 0' }}>
                    {col.toUpperCase()}
                  </h4>
                  <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.85 }}>
                    {pInfo.pantone}
                  </p>
                  <p style={{ fontSize: '0.7rem', margin: '2px 0 0 0', opacity: 0.7 }}>
                    {pInfo.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Editorial Combinations (Pre-balanced 2026 Combinations for Designers) */}
      <div>
        <div style={{ marginBottom: '22px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-apple-blue)', letterSpacing: '0.08em' }}>
            Artistic & Industrial Palettes
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', margin: '4px 0 0 0' }}>
            Curated Designer Combinations
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '24px'
        }}>
          {CURATED_PALETTES.map((pal) => (
            <div
              key={pal.id}
              className="apple-card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--accent-apple-blue)', textTransform: 'uppercase' }}>
                    {pal.year} • {pal.category}
                  </span>
                  <button
                    onClick={() => setBaseColor(pal.colors[0].hex)}
                    style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    Adopt Anchor <ArrowRight size={12} />
                  </button>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 6px 0' }}>{pal.title}</h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '16px' }}>
                  {pal.concept}
                </p>
              </div>

              {/* Swatch Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${pal.colors.length}, 1fr)`,
                height: '74px',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                marginBottom: '14px',
                border: '1px solid var(--border-subtle)'
              }}>
                {pal.colors.map((c, i) => (
                  <div
                    key={i}
                    onClick={() => onCopy(c.hex, 'HEX')}
                    style={{
                      backgroundColor: c.hex,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '6px',
                      position: 'relative'
                    }}
                    title={`${c.name} (${c.hex}) - Click to copy`}
                  >
                    <span style={{
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#ffffff',
                      textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                      fontWeight: 600
                    }}>
                      {c.hex}
                    </span>
                  </div>
                ))}
              </div>

              {/* Roles Breakdown */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                {pal.colors.map((c, i) => (
                  <span key={i} style={{ textAlign: 'center' }}>
                    {c.role}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Code Modal (Apple Sheet Style) */}
      {showExportModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '580px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-apple-window)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Export Color Palette</h3>
              <button
                onClick={() => setShowExportModal(false)}
                style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}
              >
                Done
              </button>
            </div>

            {/* Format buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['css', 'tailwind', 'figma-tokens', 'json'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: exportFormat === fmt ? 'var(--accent-apple-blue)' : 'var(--bg-subtle)',
                    color: exportFormat === fmt ? '#ffffff' : 'var(--text-secondary)'
                  }}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Code Box */}
            <pre style={{
              background: 'var(--bg-primary)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px'
            }}>
              {formatCodeSnippet(fullPalette, exportFormat)}
            </pre>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  onCopy(formatCodeSnippet(fullPalette, exportFormat), exportFormat.toUpperCase());
                  setShowExportModal(false);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--accent-apple-blue)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.86rem'
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
