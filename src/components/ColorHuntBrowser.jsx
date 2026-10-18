import React, { useState } from 'react';
import { Heart, Copy, Check, Sparkles, Bookmark, Search, X, RotateCcw } from 'lucide-react';
import { HUNT_PALETTES, PALETTE_TAGS } from '../data/colorCatalog';
import { hexToRgb } from '../utils/colorEngine';

// Color Hunt's signature primary search color dots
export const SEARCH_COLOR_WHEEL = [
  { name: 'Red', hex: '#FF3B30', bgClass: '#EF4444' },
  { name: 'Orange', hex: '#FF9500', bgClass: '#F97316' },
  { name: 'Yellow', hex: '#FFCC00', bgClass: '#EAB308' },
  { name: 'Green', hex: '#34C759', bgClass: '#22C55E' },
  { name: 'Mint', hex: '#00C7BE', bgClass: '#14B8A6' },
  { name: 'Teal', hex: '#30B0C7', bgClass: '#06B6D4' },
  { name: 'Cyan', hex: '#32ADE6', bgClass: '#0EA5E9' },
  { name: 'Blue', hex: '#007AFF', bgClass: '#3B82F6' },
  { name: 'Indigo', hex: '#5856D6', bgClass: '#6366F1' },
  { name: 'Purple', hex: '#AF52DE', bgClass: '#A855F7' },
  { name: 'Pink', hex: '#FF2D55', bgClass: '#EC4899' },
  { name: 'Brown', hex: '#A2845E', bgClass: '#854D0E' },
  { name: 'Grey', hex: '#8E8E93', bgClass: '#6B7280' },
  { name: 'Black', hex: '#1C1C1E', bgClass: '#18181B' },
  { name: 'White', hex: '#FFFFFF', bgClass: '#F8FAFC' }
];

// Helper to check if a color is perceptually close to a target hue
function isColorClose(hex1, hex2, threshold = 95) {
  try {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    const rDiff = c1.r - c2.r;
    const gDiff = c1.g - c2.g;
    const bDiff = c1.b - c2.b;
    const dist = Math.sqrt(2 * rDiff * rDiff + 4 * gDiff * gDiff + 3 * bDiff * bDiff);
    return dist < threshold;
  } catch {
    return false;
  }
}

export default function ColorHuntBrowser({ onSelectColor, onCopy, copiedHex }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedColorFilter, setSelectedColorFilter] = useState(null); // Color Hunt-style color circle filter
  const [likedPalettes, setLikedPalettes] = useState({});
  const [savedCollection, setSavedCollection] = useState([]);
  const [viewMode, setViewMode] = useState('all'); // 'all' | 'saved'
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle Like with instant tactile feedback
  const handleToggleLike = (id, e) => {
    e.stopPropagation();
    setLikedPalettes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Save to user collection
  const handleToggleSave = (palette, e) => {
    e.stopPropagation();
    const exists = savedCollection.some(p => p.id === palette.id);
    if (exists) {
      setSavedCollection(savedCollection.filter(p => p.id !== palette.id));
    } else {
      setSavedCollection([...savedCollection, palette]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedTag('All');
    setSelectedColorFilter(null);
    setSearchQuery('');
    setViewMode('all');
  };

  // Filter logic
  const sourceList = viewMode === 'saved' ? savedCollection : HUNT_PALETTES;
  
  const filteredPalettes = sourceList.filter(p => {
    // 1. Tag Filter
    const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
    
    // 2. Search Text
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      p.title.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.colors.some(c => c.hex.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.pantone.toLowerCase().includes(q));

    // 3. Color Dot Filter (Color Hunt Search by Color)
    let matchesColor = true;
    if (selectedColorFilter) {
      matchesColor = p.colors.some(c => isColorClose(c.hex, selectedColorFilter.hex, 110));
    }

    return matchesTag && matchesQuery && matchesColor;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Apple-styled Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px', maxWidth: '780px', margin: '0 auto 32px auto' }}>
        <span style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--accent-apple-blue)',
          display: 'inline-block',
          marginBottom: '8px'
        }}>
          Hand-Picked Curated Harmonies
        </span>
        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginBottom: '14px'
        }}>
          Search & Discover Color Palettes.
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          Search palettes by specific color hue, mood, or Pantone reference. Proportional 4-band swatches with instant copy & hover HUD.
        </p>
      </div>

      {/* Control Card (Color Hunt Search by Color + Tag Filter) */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '22px 24px',
        marginBottom: '36px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Row 1: Search Input + Collection Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '20px'
        }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '16px' }} />
            <input
              type="text"
              placeholder="Search by color name, tag (Pastel, Cyberpunk...), or hex code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 40px 11px 44px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '14px', color: 'var(--text-secondary)', display: 'flex' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Collection / All Switcher */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setViewMode('all')}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'all' ? 700 : 500,
                background: viewMode === 'all' ? 'var(--text-primary)' : 'var(--bg-subtle)',
                color: viewMode === 'all' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              All Palettes ({HUNT_PALETTES.length})
            </button>
            <button
              onClick={() => setViewMode('saved')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: viewMode === 'saved' ? 700 : 500,
                background: viewMode === 'saved' ? 'var(--text-primary)' : 'var(--bg-subtle)',
                color: viewMode === 'saved' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
            >
              <Bookmark size={14} />
              <span>Saved ({savedCollection.length})</span>
            </button>
          </div>
        </div>

        {/* Row 2: Color Hunt Search by Color Swatch Dots */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '18px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
              Search Palettes Containing Color:
            </span>
            {selectedColorFilter && (
              <button
                onClick={() => setSelectedColorFilter(null)}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: 'var(--accent-apple-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Clear color filter <X size={12} />
              </button>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'none'
          }}>
            {SEARCH_COLOR_WHEEL.map((swatch) => {
              const isActive = selectedColorFilter?.name === swatch.name;
              return (
                <button
                  key={swatch.name}
                  onClick={() => setSelectedColorFilter(isActive ? null : swatch)}
                  title={`Filter by ${swatch.name} palettes`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px 4px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--text-primary)' : 'var(--bg-subtle)',
                    color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: isActive ? '1px solid var(--text-primary)' : '1px solid var(--border-subtle)',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isActive ? 'scale(1.05)' : 'scale(1)'
                  }}
                >
                  <span style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: swatch.hex,
                    display: 'inline-block',
                    border: swatch.name === 'White' ? '1px solid rgba(0,0,0,0.2)' : 'none',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                  }} />
                  <span>{swatch.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Color Hunt Tags Pill Bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '14px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          {PALETTE_TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 600 : 500,
                  background: isSelected ? 'var(--accent-apple-blue)' : 'var(--bg-subtle)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid transparent' : '1px solid var(--border-subtle)',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Status Feedback Banner */}
      {(selectedColorFilter || selectedTag !== 'All' || searchQuery) && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '10px 18px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Filtered by:</span>
            {selectedColorFilter && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'var(--bg-secondary)',
                fontWeight: 600
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: selectedColorFilter.hex }} />
                Color: {selectedColorFilter.name}
              </span>
            )}
            {selectedTag !== 'All' && (
              <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}>
                Tag: {selectedTag}
              </span>
            )}
            {searchQuery && (
              <span style={{ padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', fontWeight: 600 }}>
                Query: "{searchQuery}"
              </span>
            )}
            <span style={{ color: 'var(--text-tertiary)' }}>({filteredPalettes.length} matches)</span>
          </div>

          <button
            onClick={resetFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent-apple-blue)',
              fontWeight: 600,
              fontSize: '0.78rem'
            }}
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>
      )}

      {/* 4-Band Proportional Swatch Card Grid (Color Hunt Classic) */}
      {filteredPalettes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            No palettes found matching this combination.
          </p>
          <button
            onClick={resetFilters}
            style={{
              marginTop: '12px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-apple-blue)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 600
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '28px'
        }}>
          {filteredPalettes.map((palette) => {
            const isLiked = likedPalettes[palette.id];
            const isSaved = savedCollection.some(p => p.id === palette.id);
            const totalLikes = palette.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={palette.id}
                className="apple-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative'
                }}
              >
                {/* 4-Band Proportional Swatch (Color Hunt Signature) */}
                <div style={{
                  height: '220px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)'
                }}>
                  {palette.colors.map((c, idx) => {
                    const heights = ['38%', '28%', '20%', '14%'];
                    const isCopied = copiedHex === c.hex;
                    return (
                      <div
                        key={idx}
                        onClick={() => onCopy(c.hex, 'HEX')}
                        style={{
                          height: heights[idx] || '25%',
                          backgroundColor: c.hex,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0 16px',
                          cursor: 'pointer',
                          transition: 'opacity 0.15s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          const child = e.currentTarget.querySelector('.swatch-hover-info');
                          if (child) child.style.opacity = '1';
                        }}
                        onMouseLeave={(e) => {
                          const child = e.currentTarget.querySelector('.swatch-hover-info');
                          if (child) child.style.opacity = '0';
                        }}
                        title={`Click to copy ${c.hex} • ${c.pantone}`}
                      >
                        {/* Hover Overlay with Hex & Pantone */}
                        <div
                          className="swatch-hover-info"
                          style={{
                            opacity: 0,
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            alignItems: 'center',
                            transition: 'opacity 0.2s ease',
                            pointerEvents: 'none'
                          }}
                        >
                          <span style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: '#ffffff',
                            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}>
                            {isCopied ? 'COPIED!' : c.hex.toUpperCase()}
                          </span>

                          <span style={{
                            fontSize: '0.7rem',
                            color: '#ffffff',
                            textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                            background: 'rgba(0,0,0,0.4)',
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}>
                            {c.pantone}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Footer: Color Hunt-style Likes + Pantone Badge + Save Bookmark */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '4px'
                }}>
                  {/* Like Button with live counter */}
                  <button
                    onClick={(e) => handleToggleLike(palette.id, e)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: isLiked ? '#FF2D5518' : 'var(--bg-subtle)',
                      border: isLiked ? '1px solid #FF2D5544' : '1px solid var(--border-subtle)',
                      color: isLiked ? '#FF2D55' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <Heart size={14} fill={isLiked ? '#FF2D55' : 'none'} color={isLiked ? '#FF2D55' : 'currentColor'} />
                    <span>{totalLikes.toLocaleString()}</span>
                  </button>

                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {palette.created}
                  </span>

                  {/* Quick Action: Pair or Save */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={(e) => handleToggleSave(palette, e)}
                      title={isSaved ? 'Remove from collection' : 'Save to collection'}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: isSaved ? 'var(--text-primary)' : 'var(--bg-subtle)',
                        color: isSaved ? 'var(--bg-primary)' : 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <Bookmark size={13} fill={isSaved ? 'currentColor' : 'none'} />
                    </button>

                    <button
                      onClick={() => onSelectColor(palette.colors[0].hex)}
                      title="Inspect harmonies with this anchor"
                      style={{
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-subtle)',
                        color: 'var(--accent-apple-blue)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      Pair <Sparkles size={11} />
                    </button>
                  </div>
                </div>

                {/* Subtle Tags Pill Line */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {palette.tags.slice(0, 3).map((t, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedTag(t)}
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer'
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
