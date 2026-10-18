import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles, SlidersHorizontal, Search, BookOpen, Layers, X } from 'lucide-react';
import { PANTONE_TRENDS } from '../data/colorCatalog';
import { hexToCmyk, hexToRgb, getClosestPantone } from '../utils/colorEngine';
import fullPantoneLibrary from '../data/pantoneFullMaster.json';

export default function PantoneTrends({ onSelectColor, onCopy, copiedHex }) {
  const [activeTabMode, setActiveTabMode] = useState('full-library'); // 'full-library' | 'trends' | 'tcx' | 'solid-coated'
  const [inspectColor, setInspectColor] = useState(PANTONE_TRENDS[0]);
  const [customColorInput, setCustomColorInput] = useState('#BB2649');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystemFilter, setSelectedSystemFilter] = useState('all');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 60;

  // Filter full 6,083 Pantone library by search and system filter
  const filteredLibrary = useMemo(() => {
    let result = fullPantoneLibrary;

    if (selectedSystemFilter === 'tcx') {
      result = result.filter(item => item.system && item.system.includes('TCX'));
    } else if (selectedSystemFilter === 'solid') {
      result = result.filter(item => item.system && (item.system.includes('Formula') || item.system.includes('Solid')));
    } else if (selectedSystemFilter === 'textile') {
      result = result.filter(item => item.system && item.system.includes('Textile'));
    }

    if (!searchQuery.trim()) return result;
    const q = searchQuery.toLowerCase().trim();
    return result.filter(item => 
      item.pantone.toLowerCase().includes(q) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      item.hex.toLowerCase().includes(q) ||
      (item.tags && item.tags.some(t => t.toLowerCase() === q || t.toLowerCase().includes(q)))
    );
  }, [searchQuery, selectedSystemFilter]);

  const displayedColors = activeTabMode === 'trends'
    ? PANTONE_TRENDS
    : filteredLibrary.slice(0, page * PAGE_SIZE);

  const hasMore = activeTabMode === 'full-library' && displayedColors.length < filteredLibrary.length;

  const matchedCustom = getClosestPantone(customColorInput);

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Hero Apple Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '780px', margin: '0 auto 40px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 113, 227, 0.1)',
          border: '1px solid rgba(0, 113, 227, 0.25)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '10px'
        }}>
          <BookOpen size={14} color="var(--accent-apple-blue)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-apple-blue)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Complete 6,083 Official Pantone® Database
          </span>
        </div>

        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginBottom: '16px'
        }}>
          The Complete Pantone Color System.
        </h1>
        <p style={{
          fontSize: '1.08rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          Browse all 6,083 official Pantone colors across Cotton TCX, Formula Guide Solid Coated PMS, and Textile Standards. Search by name, code (e.g. 19-4052, 102 C), or hex with instant CMYK print conversions.
        </p>
      </div>

      {/* Featured Pantone Spotlight Card (Apple Pro Product Card Style) */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        marginBottom: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '36px',
        alignItems: 'center',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Left: Dynamic Color Canvas Preview */}
        <div style={{
          position: 'relative',
          borderRadius: 'var(--radius-md)',
          minHeight: '280px',
          backgroundColor: inspectColor.hex,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px',
          boxShadow: `0 20px 40px ${inspectColor.hex}33`,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#000000',
              backdropFilter: 'blur(8px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em'
            }}>
              OFFICIAL PANTONE® TCX
            </span>
            <button
              onClick={() => onCopy(inspectColor.hex, 'HEX')}
              style={{
                background: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s ease'
              }}
            >
              {copiedHex === inspectColor.hex ? <Check size={14} color="#34C759" /> : <Copy size={14} />}
              <span>{copiedHex === inspectColor.hex ? 'Copied' : 'Copy HEX'}</span>
            </button>
          </div>

          <div>
            <h2 style={{
              fontSize: '2.1rem',
              fontWeight: 800,
              color: '#FFFFFF',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              marginBottom: '4px'
            }}>
              {inspectColor.name || inspectColor.pantone}
            </h2>
            <p style={{
              fontSize: '0.96rem',
              color: 'rgba(255,255,255,0.92)',
              fontFamily: 'var(--font-mono)',
              textShadow: '0 1px 4px rgba(0,0,0,0.3)',
              margin: 0
            }}>
              {inspectColor.pantone}
            </p>
          </div>
        </div>

        {/* Right: Technical Spec Sheet (Apple Developer Style) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <SlidersHorizontal size={18} color="var(--accent-apple-blue)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Color Specifications & Print Values
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            marginBottom: '24px'
          }}>
            <div style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>HEX Color</span>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
                {inspectColor.hex.toUpperCase()}
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>PANTONE Code</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {inspectColor.pantone}
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>RGB Screen</span>
              <p style={{ fontSize: '0.98rem', fontWeight: 600, fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
                rgb({hexToRgb(inspectColor.hex).r}, {hexToRgb(inspectColor.hex).g}, {hexToRgb(inspectColor.hex).b})
              </p>
            </div>

            <div style={{ background: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>CMYK Print</span>
              <p style={{ fontSize: '0.98rem', fontWeight: 600, fontFamily: 'var(--font-mono)', margin: '4px 0 0 0' }}>
                {hexToCmyk(inspectColor.hex).c}, {hexToCmyk(inspectColor.hex).m}, {hexToCmyk(inspectColor.hex).y}, {hexToCmyk(inspectColor.hex).k}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => onSelectColor(inspectColor.hex)}
              style={{
                flex: 1,
                padding: '12px 20px',
                background: 'var(--accent-apple-blue)',
                color: '#ffffff',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px var(--accent-glow)',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} />
              <span>Explore Harmonies for this Color</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Pantone Matcher for ANY Hex */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-subtle) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '24px 28px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            position: 'relative',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <input
              type="color"
              value={customColorInput}
              onChange={(e) => setCustomColorInput(e.target.value)}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                Live Pantone Proximity Matcher
              </h3>
              <span style={{
                background: 'rgba(0, 113, 227, 0.12)',
                color: 'var(--accent-apple-blue)',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                textTransform: 'uppercase'
              }}>2,625 Official TCX Colors</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Pick any hex: matches across the entire official Pantone Fashion + Home Cotton TCX database.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-secondary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            gap: '8px'
          }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>MATCH:</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{matchedCustom.pantone}</strong>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: '#34C75922',
              color: '#34C759'
            }}>
              {matchedCustom.matchScore}% Proximity
            </span>
          </div>

          <button
            onClick={() => {
              setInspectColor({
                hex: customColorInput,
                name: matchedCustom.name || matchedCustom.pantone,
                pantone: matchedCustom.pantone,
                cmyk: `${hexToCmyk(customColorInput).c}, ${hexToCmyk(customColorInput).m}, ${hexToCmyk(customColorInput).y}, ${hexToCmyk(customColorInput).k}`,
                rgb: `${hexToRgb(customColorInput).r}, ${hexToRgb(customColorInput).g}, ${hexToRgb(customColorInput).b}`
              });
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            Inspect in Detail
          </button>
        </div>
      </div>

      {/* Switcher & Live Search across all 2,625 Pantone Shades */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Toggle Pills: All 6,083 Colors vs Systems vs Curated Trends */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '4px'
        }}>
          <button
            onClick={() => { setActiveTabMode('full-library'); setSelectedSystemFilter('all'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: activeTabMode === 'full-library' && selectedSystemFilter === 'all' ? 700 : 500,
              background: activeTabMode === 'full-library' && selectedSystemFilter === 'all' ? 'var(--text-primary)' : 'transparent',
              color: activeTabMode === 'full-library' && selectedSystemFilter === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            All 6,083 Colors
          </button>

          <button
            onClick={() => { setActiveTabMode('full-library'); setSelectedSystemFilter('tcx'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: activeTabMode === 'full-library' && selectedSystemFilter === 'tcx' ? 700 : 500,
              background: activeTabMode === 'full-library' && selectedSystemFilter === 'tcx' ? 'var(--text-primary)' : 'transparent',
              color: activeTabMode === 'full-library' && selectedSystemFilter === 'tcx' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Cotton TCX (2,625)
          </button>

          <button
            onClick={() => { setActiveTabMode('full-library'); setSelectedSystemFilter('solid'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: activeTabMode === 'full-library' && selectedSystemFilter === 'solid' ? 700 : 500,
              background: activeTabMode === 'full-library' && selectedSystemFilter === 'solid' ? 'var(--text-primary)' : 'transparent',
              color: activeTabMode === 'full-library' && selectedSystemFilter === 'solid' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Solid Coated (1,148)
          </button>

          <button
            onClick={() => { setActiveTabMode('full-library'); setSelectedSystemFilter('textile'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: activeTabMode === 'full-library' && selectedSystemFilter === 'textile' ? 700 : 500,
              background: activeTabMode === 'full-library' && selectedSystemFilter === 'textile' ? 'var(--text-primary)' : 'transparent',
              color: activeTabMode === 'full-library' && selectedSystemFilter === 'textile' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Textile Standards (2,310)
          </button>

          <button
            onClick={() => { setActiveTabMode('trends'); setPage(1); }}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: activeTabMode === 'trends' ? 700 : 500,
              background: activeTabMode === 'trends' ? 'var(--text-primary)' : 'transparent',
              color: activeTabMode === 'trends' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            Trends
          </button>
        </div>

        {/* Live Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '380px' }}>
          <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Type 'red', 'blue', 'pink', code (19-4052) or hex..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            style={{
              width: '100%',
              padding: '9px 34px 9px 38px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
              outline: 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Quick Color Family Search Pills */}
      {activeTabMode === 'full-library' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '26px'
        }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginRight: '4px' }}>
            Quick Hue Search:
          </span>
          {[
            { label: 'Red', color: '#FF3B30' },
            { label: 'Orange', color: '#FF9500' },
            { label: 'Yellow', color: '#FFCC00' },
            { label: 'Green', color: '#34C759' },
            { label: 'Teal', color: '#30B0C7' },
            { label: 'Blue', color: '#007AFF' },
            { label: 'Purple', color: '#AF52DE' },
            { label: 'Pink', color: '#FF2D55' },
            { label: 'Brown', color: '#A2845E' },
            { label: 'Grey', color: '#8E8E93' },
            { label: 'Black', color: '#1C1C1E' }
          ].map((h) => {
            const isMatching = searchQuery.toLowerCase() === h.label.toLowerCase();
            return (
              <button
                key={h.label}
                onClick={() => {
                  setSearchQuery(isMatching ? '' : h.label.toLowerCase());
                  setPage(1);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  background: isMatching ? 'var(--text-primary)' : 'var(--bg-secondary)',
                  color: isMatching ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: isMatching ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: h.color }} />
                <span>{h.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Grid of All Pantone Colors */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {displayedColors.map((item, idx) => (
          <div
            key={idx}
            className="apple-card"
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={() => {
              setInspectColor({
                hex: item.hex,
                name: item.name || item.pantone,
                pantone: item.pantone,
                cmyk: `${hexToCmyk(item.hex).c}, ${hexToCmyk(item.hex).m}, ${hexToCmyk(item.hex).y}, ${hexToCmyk(item.hex).k}`,
                rgb: `${hexToRgb(item.hex).r}, ${hexToRgb(item.hex).g}, ${hexToRgb(item.hex).b}`
              });
              window.scrollTo({ top: 120, behavior: 'smooth' });
            }}
          >
            {/* Color preview block */}
            <div style={{
              height: '130px',
              backgroundColor: item.hex,
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '10px'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(item.hex, 'HEX');
                }}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.45)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.15s ease'
                }}
                title="Copy Hex"
              >
                {copiedHex === item.hex ? <Check size={12} color="#34C759" /> : <Copy size={12} />}
              </button>
            </div>

            {/* Swatch details */}
            <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 3px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name || item.pantone}
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', margin: 0 }}>
                  {item.pantone}
                </p>
              </div>

              <div style={{
                marginTop: '12px',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                  {item.hex.toUpperCase()}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectColor(item.hex);
                  }}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--accent-apple-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}
                >
                  Pair <Sparkles size={10} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Pagination for full 2,625 colors */}
      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={() => setPage(p => p + 1)}
            style={{
              padding: '12px 32px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              fontSize: '0.9rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            Load More Colors ({displayedColors.length} of {filteredLibrary.length})
          </button>
        </div>
      )}
    </div>
  );
}
