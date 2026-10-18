import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Sliders, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Search, 
  RotateCw, 
  ChevronRight, 
  ChevronLeft,
  X,
  Palette,
  Flame,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { PANTONE_BOOKS } from '../data/pantoneDeckData';

export default function PantoneFanDeck({ onSelectColor, onCopy, copiedHex, setActiveTab }) {
  // Active book selection: defaults to first book (Formula Guide Solid Coated)
  const [activeBookId, setActiveBookId] = useState('formula-coated');
  
  // Fan state: whether the book is open (true) or closed vertical tabs mode (false)
  const [isBookOpen, setIsBookOpen] = useState(true);
  
  // Fan spreading angle (in degrees): 0 = stacked, 75 = natural fan, 90 = wide peacock
  const [fanSpread, setFanSpread] = useState(74);
  
  // View mode: 'radial' (pivoted curved fan like reference photos) or 'horizontal' (horizontal strip ribbon)
  const [viewMode, setViewMode] = useState('radial');
  
  // Hovered card index in the active book
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);
  
  // Selected / active chip for the Apple Frosted Swatch Inspector
  const [activeChip, setActiveChip] = useState({
    hex: '#FFE600',
    code: 'PANTONE 102 C',
    name: 'Pure Solar',
    cmyk: '0, 2, 98, 0',
    formula: '96% Yellow, 4% Warm Red',
    bookTitle: 'FORMULA GUIDE Solid Coated',
    stripNumber: 'FC-01'
  });

  // Search / Hue filter
  const [searchQuery, setSearchQuery] = useState('');

  // Horizontal scroll container ref
  const horizontalScrollRef = useRef(null);

  // Active book object
  const currentBook = useMemo(() => {
    return PANTONE_BOOKS.find((b) => b.id === activeBookId) || PANTONE_BOOKS[0];
  }, [activeBookId]);

  // Handle Book Selection (clicking a vertical book tab)
  const handleSelectBook = (bookId) => {
    setActiveBookId(bookId);
    setIsBookOpen(true);
    setHoveredCardIdx(null);
    const book = PANTONE_BOOKS.find((b) => b.id === bookId);
    if (book && book.cards?.[0]?.chips?.[0]) {
      const firstChip = book.cards[0].chips[0];
      setActiveChip({
        ...firstChip,
        bookTitle: `${book.title} ${book.edition}`,
        stripNumber: book.cards[0].stripNumber
      });
    }
  };

  // Filter cards/chips based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return currentBook.cards;
    const q = searchQuery.toLowerCase().trim();
    return currentBook.cards.filter((card) => {
      const matchesFamily = card.family.toLowerCase().includes(q);
      const matchesStrip = card.stripNumber.toLowerCase().includes(q);
      const matchesChip = card.chips.some(
        (chip) =>
          chip.name.toLowerCase().includes(q) ||
          chip.code.toLowerCase().includes(q) ||
          chip.hex.toLowerCase().includes(q) ||
          (chip.formula && chip.formula.toLowerCase().includes(q))
      );
      return matchesFamily || matchesStrip || matchesChip;
    });
  }, [currentBook, searchQuery]);

  // Handle chip selection / click
  const handleChipClick = (chip, card, e) => {
    e.stopPropagation();
    setActiveChip({
      ...chip,
      bookTitle: `${currentBook.title} ${currentBook.edition}`,
      stripNumber: card.stripNumber
    });
    if (onCopy) {
      onCopy(chip.hex, 'HEX');
    }
  };

  // Scroll horizontal ribbon
  const scrollRibbon = (direction) => {
    if (horizontalScrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      horizontalScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="pantone-fan-deck-container" style={{ width: '100%', position: 'relative' }}>
      
      {/* 1. Ultra-Minimal Navigation & Controls Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        padding: '12px 20px',
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(20px)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        {/* Book Tabs Selector (Minimal Pill Tabs) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginRight: '4px' }}>
            Pantone Books:
          </span>
          {PANTONE_BOOKS.map((book) => {
            const isActive = activeBookId === book.id && isBookOpen;
            return (
              <button
                key={book.id}
                onClick={() => handleSelectBook(book.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? `1.5px solid ${book.coverColor}` : '1px solid var(--border-subtle)',
                  background: isActive ? `${book.coverColor}18` : 'var(--bg-secondary)',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? `0 2px 10px ${book.coverColor}26` : 'none'
                }}
              >
                <span style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: book.coverColor,
                  display: 'inline-block',
                  boxShadow: `0 0 6px ${book.coverColor}`
                }} />
                <span>{book.title}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.7, padding: '1px 5px', background: 'var(--bg-subtle)', borderRadius: '4px' }}>
                  {book.cards.length} strips
                </span>
              </button>
            );
          })}
        </div>

        {/* Interactive Fan & View Mode Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search shades (e.g. red, solar)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '6px 12px 6px 30px',
                fontSize: '0.82rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                width: '180px',
                outline: 'none',
                transition: 'width 0.2s ease, border-color 0.2s ease'
              }}
              onFocus={(e) => (e.target.style.width = '230px')}
              onBlur={(e) => (e.target.style.width = '180px')}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Spread Angle Slider (Only for Radial Fan Mode) */}
          {viewMode === 'radial' && isBookOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Spread: {fanSpread}°
              </span>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={fanSpread}
                onChange={(e) => setFanSpread(Number(e.target.value))}
                style={{ width: '80px', accentColor: currentBook.coverColor, cursor: 'pointer' }}
                title="Adjust Fan Spread Angle"
              />
            </div>
          )}

          {/* View Mode Toggle (Radial Arc vs Horizontal Ribbon) */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('radial')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: viewMode === 'radial' ? 'var(--text-primary)' : 'transparent',
                color: viewMode === 'radial' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Radial Fan Arc (Physical fan deck layout matching reference photo)"
            >
              <RotateCw size={13} />
              <span>Radial Fan</span>
            </button>
            <button
              onClick={() => setViewMode('horizontal')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: viewMode === 'horizontal' ? 'var(--text-primary)' : 'transparent',
                color: viewMode === 'horizontal' ? 'var(--bg-primary)' : 'var(--text-secondary)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Horizontal Ribbon (Side-by-side shade cards)"
            >
              <Layers size={13} />
              <span>Horizontal Ribbon</span>
            </button>
          </div>

          {/* Open / Close Stand Toggle */}
          <button
            onClick={() => setIsBookOpen(!isBookOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {isBookOpen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isBookOpen ? 'Stack Deck' : 'Spread Deck'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Fan Deck Stage (Apple Studio Desk Backdrop) */}
      <div style={{
        position: 'relative',
        minHeight: '680px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)',
        background: 'radial-gradient(ellipse at 50% 100%, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        overflow: 'hidden',
        padding: '36px 36px 48px 36px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Subtle Ambient Desk Lighting Glow */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '20%',
          width: '600px',
          height: '320px',
          background: `radial-gradient(circle, ${currentBook.coverColor}18 0%, transparent 70%)`,
          filter: 'blur(70px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Minimal Sub-header / Status Indicator */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: currentBook.coverColor, marginBottom: '4px' }}>
              <span>Official Physical Shade Book</span>
              <span>•</span>
              <span>{currentBook.edition}</span>
            </div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', margin: 0 }}>
              {currentBook.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '4px 0 0 0', maxWidth: '580px' }}>
              {currentBook.description}
            </p>
          </div>

          {/* Quick Active Book Specs Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-glass)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            backdropFilter: 'blur(12px)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span><strong>{filteredCards.length}</strong> Shade Strips</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span><strong>{filteredCards.reduce((acc, c) => acc + c.chips.length, 0)}</strong> Colors</span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ color: currentBook.coverColor, fontWeight: 700 }}>100% Authentic Formula</span>
          </div>
        </div>

        {/* 3. The Interactive Fan Deck Body */}
        {viewMode === 'radial' ? (
          /* RADIAL FAN OUT DECK (Matching Reference Photos) */
          <div style={{
            position: 'relative',
            flex: 1,
            width: '100%',
            minHeight: '560px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-start',
            paddingLeft: '14%',
            paddingBottom: '36px',
            zIndex: 5
          }}>
            {/* The Pivot Screw Assembly & Fan Cards Container */}
            <div style={{
              position: 'relative',
              width: '130px',
              height: '490px'
            }}>
              {/* SHADE CARDS (Fanning Out from the pivot rivet) */}
              {filteredCards.map((card, idx) => {
                const total = filteredCards.length;
                // Offset by 12 degrees so the cards spread out behind the front cover blade
                const angle = isBookOpen ? 12 + (idx / Math.max(total - 1, 1)) * fanSpread : 0;
                const isHovered = hoveredCardIdx === idx;
                const zIndex = isHovered ? 60 : idx + 2;

                return (
                  <div
                    key={card.id}
                    onMouseEnter={() => setHoveredCardIdx(idx)}
                    onMouseLeave={() => setHoveredCardIdx(null)}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '130px',
                      height: '480px',
                      borderRadius: '12px 12px 14px 14px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: isHovered
                        ? '0 24px 50px rgba(0,0,0,0.3), 0 0 0 2px var(--accent-apple-blue)'
                        : '0 8px 24px rgba(0,0,0,0.14), -2px 2px 8px rgba(0,0,0,0.06)',
                      transformOrigin: '28px calc(100% - 28px)', // Bottom screw pivot point
                      transform: `rotate(${angle}deg) translateY(${isHovered ? '-14px' : '0px'}) scale(${isHovered ? 1.03 : 1})`,
                      transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
                      zIndex: zIndex,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      border: '1px solid rgba(0,0,0,0.08)'
                    }}
                  >
                    {/* Top Strip Header */}
                    <div style={{
                      padding: '8px 10px 4px 10px',
                      background: '#FFFFFF',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #ECECEC'
                    }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D1D1F', letterSpacing: '0.04em' }}>
                        {card.stripNumber}
                      </span>
                      <span style={{ fontSize: '0.6rem', fontWeight: 600, color: '#86868B', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '68px' }}>
                        {card.family}
                      </span>
                    </div>

                    {/* Color Chips Stack (Separated by Crisp White Hairlines) */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {card.chips.map((chip, cIdx) => {
                        const isChipActive = activeChip?.code === chip.code;
                        return (
                          <div
                            key={chip.code || cIdx}
                            onClick={(e) => handleChipClick(chip, card, e)}
                            style={{
                              flex: 1,
                              backgroundColor: chip.hex,
                              position: 'relative',
                              borderBottom: cIdx < card.chips.length - 1 ? '1.5px solid #FFFFFF' : 'none',
                              display: 'flex',
                              alignItems: 'flex-end',
                              padding: '4px 6px',
                              transition: 'transform 0.15s ease, filter 0.15s ease',
                              cursor: 'pointer'
                            }}
                            title={`${chip.code} - ${chip.name} (${chip.hex})`}
                          >
                            {/* Color chip label on light/dark contrast */}
                            <div style={{
                              display: 'flex',
                              flexDirection: 'column',
                              width: '100%',
                              background: 'rgba(255, 255, 255, 0.92)',
                              backdropFilter: 'blur(4px)',
                              padding: '2px 5px',
                              borderRadius: '3px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
                                {chip.code}
                              </span>
                              <span style={{ fontSize: '0.54rem', color: '#555555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
                                {chip.name}
                              </span>
                            </div>

                            {/* Active Indicator Ring */}
                            {isChipActive && (
                              <div style={{
                                position: 'absolute',
                                inset: '1px',
                                border: '2px solid #FFFFFF',
                                boxShadow: 'inset 0 0 0 1px #000000',
                                pointerEvents: 'none'
                              }} />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom Pivot Base area */}
                    <div style={{
                      height: '48px',
                      background: '#FFFFFF',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: '12px'
                    }}>
                      <span style={{ fontSize: '0.56rem', fontWeight: 700, color: '#86868B', textTransform: 'uppercase' }}>
                        {currentBook.edition.substring(0, 14)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* FRONT COVER CARD (The Authentic Pantone / Asian Paints Cover Blade) */}
              <div
                onClick={() => setIsBookOpen(!isBookOpen)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '130px',
                  height: '480px',
                  borderRadius: '12px 12px 14px 14px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.25), -3px 3px 10px rgba(0,0,0,0.08)',
                  transformOrigin: '28px calc(100% - 28px)',
                  transform: 'rotate(0deg)',
                  transition: 'transform 0.4s ease, box-shadow 0.25s ease',
                  zIndex: 50,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              >
                {/* Top Colored Cover Block (Heavy Pantone Purple / Asian Paints Red) */}
                <div style={{
                  height: '255px',
                  backgroundColor: currentBook.coverColor,
                  color: currentBook.textColor,
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  {/* Subtle Subtitle Pill */}
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.9 }}>
                    {currentBook.edition}
                  </span>

                  {/* Vertical Bold Title (Like Asian Paints 'COLOUR' & Pantone 'FORMULA GUIDE') */}
                  <div style={{
                    fontSize: '1.32rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    textTransform: 'uppercase',
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    margin: 'auto 0'
                  }}>
                    {currentBook.title}
                  </div>

                  <span style={{ fontSize: '0.58rem', opacity: 0.8, letterSpacing: '0.04em' }}>
                    {currentBook.id === 'caseyx-choice' ? '.GRD MAP PACK' : 'COLOR SYSTEM'}
                  </span>
                </div>

                {/* Bottom White Half with Authentic Pantone Branding */}
                <div style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  padding: '16px 12px 52px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}>
                  <div>
                    <div style={{ fontSize: '0.94rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#1D1D1F', marginBottom: '4px' }}>
                      {currentBook.id === 'caseyx-choice' ? 'CASEYXLIVE®' : 'PANTONE®'}
                    </div>
                    <p style={{ fontSize: '0.6rem', color: '#555555', lineHeight: 1.35 }}>
                      {currentBook.subtitle}
                    </p>
                  </div>

                  <div style={{ fontSize: '0.58rem', color: '#86868B', fontWeight: 600 }}>
                    Click to {isBookOpen ? 'close' : 'open'}
                  </div>
                </div>
              </div>

              {/* AUTHENTIC METALLIC PIVOT SCREW RIVET (Bottom-Left Fastener) */}
              <div
                onClick={() => setIsBookOpen(!isBookOpen)}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4D4D8 45%, #8E8E93 100%)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4), inset 0 1px 1px #FFFFFF, inset 0 -1px 2px #333333',
                  zIndex: 70,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Screw Rivet Pivot — Click to toggle fan deck"
              >
                {/* Screw head cross slit */}
                <div style={{ width: '13px', height: '2px', backgroundColor: '#555559', transform: 'rotate(45deg)' }} />
              </div>
            </div>
          </div>
        ) : (
          /* HORIZONTAL STRIP RIBBON MODE (Side-by-Side Scrollable Shade Cards) */
          <div style={{ position: 'relative', flex: 1, width: '100%', minHeight: '520px', zIndex: 5 }}>
            {/* Scroll Navigation Arrows */}
            <button
              onClick={() => scrollRibbon('left')}
              style={{
                position: 'absolute',
                left: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                zIndex: 30,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scrollRibbon('right')}
              style={{
                position: 'absolute',
                right: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                zIndex: 30,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Scrollable Ribbon Track */}
            <div
              ref={horizontalScrollRef}
              style={{
                display: 'flex',
                gap: '20px',
                overflowX: 'auto',
                padding: '20px 10px 40px 10px',
                scrollBehavior: 'smooth'
              }}
            >
              {/* Cover Card Ribbon Anchor */}
              <div style={{
                flexShrink: 0,
                width: '130px',
                height: '470px',
                borderRadius: '12px 12px 14px 14px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  height: '250px',
                  backgroundColor: currentBook.coverColor,
                  color: currentBook.textColor,
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {currentBook.edition}
                  </span>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    margin: 'auto 0'
                  }}>
                    {currentBook.title}
                  </div>
                  <span style={{ fontSize: '0.58rem', opacity: 0.8 }}>
                    FRONT COVER
                  </span>
                </div>
                <div style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  padding: '16px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#1D1D1F' }}>
                      {currentBook.id === 'caseyx-choice' ? 'CASEYXLIVE®' : 'PANTONE®'}
                    </div>
                    <p style={{ fontSize: '0.62rem', color: '#666666', marginTop: '6px' }}>
                      {currentBook.subtitle}
                    </p>
                  </div>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4D4D8 45%, #8E8E93 100%)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{ width: '12px', height: '2px', backgroundColor: '#555559', transform: 'rotate(45deg)' }} />
                  </div>
                </div>
              </div>

              {/* Side-by-side Shade Cards */}
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  style={{
                    flexShrink: 0,
                    width: '130px',
                    height: '470px',
                    borderRadius: '12px 12px 14px 14px',
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 18px 36px rgba(0,0,0,0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }}
                >
                  {/* Strip Header */}
                  <div style={{
                    padding: '8px 10px',
                    background: '#FFFFFF',
                    borderBottom: '1px solid #EEEEEE',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1D1D1F' }}>
                      {card.stripNumber}
                    </span>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, color: '#888888', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65px' }}>
                      {card.family}
                    </span>
                  </div>

                  {/* Chips */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {card.chips.map((chip, cIdx) => (
                      <div
                        key={chip.code || cIdx}
                        onClick={(e) => handleChipClick(chip, card, e)}
                        style={{
                          flex: 1,
                          backgroundColor: chip.hex,
                          borderBottom: cIdx < card.chips.length - 1 ? '1.5px solid #FFFFFF' : 'none',
                          padding: '4px 6px',
                          display: 'flex',
                          alignItems: 'flex-end',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(4px)',
                          padding: '2px 5px',
                          borderRadius: '3px',
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chip.code}
                          </span>
                          <span style={{ fontSize: '0.54rem', color: '#555555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {chip.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Pivot Ring */}
                  <div style={{
                    height: '42px',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '14px'
                  }}>
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4D4D8 45%, #8E8E93 100%)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Apple Frosted Glass Swatch Inspector (HUD Drawer) */}
        {activeChip && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '320px',
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-apple-window)',
            padding: '16px',
            zIndex: 80
          }}>
            {/* Inspector Top Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              {/* Large Color Swatch Preview Block */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: activeChip.hex,
                border: '1.5px solid rgba(0,0,0,0.12)',
                boxShadow: `0 4px 16px ${activeChip.hex}44`,
                flexShrink: 0
              }} />

              {/* Title & Strip info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeChip.stripNumber ? `STRIP ${activeChip.stripNumber}` : 'SHADE CHIP'}
                </span>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {activeChip.name}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {activeChip.code}
                </div>
              </div>

              {/* Close HUD */}
              <button
                onClick={() => setActiveChip(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={14} />
              </button>
            </div>

            {/* Technical Formulas List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              background: 'var(--bg-secondary)',
              padding: '8px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', display: 'block' }}>HEX CODE</span>
                <button
                  onClick={() => onCopy && onCopy(activeChip.hex, 'HEX')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'none',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <span>{activeChip.hex}</span>
                  {copiedHex === activeChip.hex ? <Check size={12} color="#34C759" /> : <Copy size={12} color="var(--text-tertiary)" />}
                </button>
              </div>

              <div>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-tertiary)', display: 'block' }}>FORMULA / SPEC</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  {activeChip.formula || activeChip.cmyk || 'Standard Ink'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  if (onSelectColor) onSelectColor(activeChip.hex);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--text-primary)',
                  color: 'var(--bg-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <Palette size={13} />
                <span>Pair in Harmonies</span>
              </button>

              {activeChip.code?.startsWith('FIRE') || currentBook.id === 'caseyx-choice' ? (
                <button
                  onClick={() => setActiveTab && setActiveTab('gradients')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FF2D55',
                    color: '#FFFFFF',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  title="View in Casey's Choice 268 Gradients"
                >
                  <Flame size={13} />
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* 5. Standing Vertical Books Stand (Closed Shelf Mode / Rack) */}
      <div style={{ marginTop: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
              Physical Swatch Decks Shelf
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Click any vertical book tab below to spread it horizontally into live shade cards.
            </p>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            4 Master Volumes Available
          </span>
        </div>

        {/* 4 Standing Vertical Books as Interactive Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {PANTONE_BOOKS.map((book) => {
            const isCurrentlyActive = activeBookId === book.id;
            return (
              <div
                key={book.id}
                onClick={() => handleSelectBook(book.id)}
                style={{
                  display: 'flex',
                  gap: '16px',
                  background: isCurrentlyActive ? 'var(--bg-elevated)' : 'var(--bg-secondary)',
                  border: isCurrentlyActive ? `2px solid ${book.coverColor}` : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isCurrentlyActive ? `0 12px 30px ${book.coverColor}22` : 'var(--shadow-sm)',
                  transform: isCurrentlyActive ? 'translateY(-4px)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentlyActive) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = book.coverColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentlyActive) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }
                }}
              >
                {/* Mini Vertical Book Replica */}
                <div style={{
                  width: '64px',
                  height: '140px',
                  borderRadius: '6px 6px 8px 8px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}>
                  {/* Top Colored Spine */}
                  <div style={{
                    height: '80px',
                    backgroundColor: book.coverColor,
                    color: book.textColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {book.title}
                    </span>
                  </div>
                  {/* Bottom White Pivot Base */}
                  <div style={{
                    flex: 1,
                    backgroundColor: '#FFFFFF',
                    padding: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '0.45rem', fontWeight: 800, color: '#1D1D1F' }}>
                      {book.id === 'caseyx-choice' ? 'CASEYX' : 'PANTONE'}
                    </span>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4D4D8 45%, #8E8E93 100%)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </div>

                {/* Book Details */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: book.coverColor, textTransform: 'uppercase' }}>
                      {book.edition}
                    </span>
                    {isCurrentlyActive && (
                      <span style={{ fontSize: '0.62rem', padding: '1px 6px', background: `${book.coverColor}22`, color: book.coverColor, borderRadius: '4px', fontWeight: 800 }}>
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {book.title}
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', margin: '0 0 10px 0', lineHeight: 1.35 }}>
                    {book.subtitle}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                    <span>{book.cards.length} Shade Strips</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--accent-apple-blue)', fontWeight: 600 }}>
                      <span>Open Deck</span>
                      <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
