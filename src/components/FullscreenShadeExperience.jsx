import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Copy, 
  Check, 
  X, 
  RotateCw, 
  Layers, 
  Palette, 
  Crown, 
  Maximize2, 
  Compass, 
  Sparkles, 
  Sliders, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Volume2,
  Info
} from 'lucide-react';
import gsap from 'gsap';
import { PANTONE_BOOKS } from '../data/pantoneDeckData';

export default function FullscreenShadeExperience({ onSelectColor, onCopy, copiedHex, setActiveTab }) {
  // Active Book ID
  const [activeBookId, setActiveBookId] = useState('formula-coated');
  
  // Selected color chip for the inspector modal
  const [activeChip, setActiveChip] = useState(null);

  // Active book object
  const currentBook = useMemo(() => {
    return PANTONE_BOOKS.find((b) => b.id === activeBookId) || PANTONE_BOOKS[0];
  }, [activeBookId]);

  // All cards of the current book
  const cards = currentBook.cards;

  // Rotation / Scroll offset state (in units of card indices, fractional for silky inertia)
  const rotationIndexRef = useRef(0);
  const targetRotationRef = useRef(0);
  const [displayIndex, setDisplayIndex] = useState(0);

  // DOM container ref
  const stageRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);

  // Switch book
  const handleSelectBook = (bookId) => {
    setActiveBookId(bookId);
    targetRotationRef.current = 0;
    rotationIndexRef.current = 0;
    setDisplayIndex(0);
  };

  // Wheel listener with smooth inertia
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (e) => {
      // Prevent normal scroll when interacting with fullscreen shade carousel
      e.preventDefault();

      // Normalize delta
      const delta = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * 0.003;
      
      const maxIndex = cards.length - 1;
      targetRotationRef.current = Math.max(-0.5, Math.min(maxIndex + 0.5, targetRotationRef.current + delta));
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [cards.length]);

  // Touch and Mouse Drag Support
  const onPointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartRotRef.current = targetRotationRef.current;
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diff = (dragStartXRef.current - clientX) * 0.005;
    const maxIndex = cards.length - 1;
    targetRotationRef.current = Math.max(-0.5, Math.min(maxIndex + 0.5, dragStartRotRef.current + diff));
  };

  const onPointerUp = () => {
    isDraggingRef.current = false;
    // Snap to nearest integer on release
    targetRotationRef.current = Math.round(targetRotationRef.current);
    const maxIndex = cards.length - 1;
    targetRotationRef.current = Math.max(0, Math.min(maxIndex, targetRotationRef.current));
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (activeChip) return; // if modal is open, let Esc close it
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetRotationRef.current = Math.min(cards.length - 1, Math.round(targetRotationRef.current + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetRotationRef.current = Math.max(0, Math.round(targetRotationRef.current - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cards.length, activeChip]);

  // GSAP Ticker for 60fps buttery-smooth cinematic physics interpolation (lerp)
  useEffect(() => {
    const updateTick = () => {
      // Smooth lerp (A24-style fluid damping)
      const diff = targetRotationRef.current - rotationIndexRef.current;
      rotationIndexRef.current += diff * 0.12;
      
      // Update display index integer for active card metadata
      const currentInt = Math.round(rotationIndexRef.current);
      setDisplayIndex(Math.max(0, Math.min(cards.length - 1, currentInt)));

      // Render 3D transforms on each card DOM element
      if (cardsContainerRef.current) {
        const cardElements = cardsContainerRef.current.children;
        const currentRot = rotationIndexRef.current;

        for (let i = 0; i < cardElements.length; i++) {
          const el = cardElements[i];
          const dist = i - currentRot; // distance from focal center
          
          // A24 Cinematic 3D Arc calculation:
          // Center card: x = 0, y = 0, scale = 1.05, rotateZ = 0, rotateY = 0, opacity = 1
          // Side cards: curve away on an elliptical radial arc, rotateZ fan angle, rotateY tilt, scaled down
          const xOffset = dist * 260; // horizontal spacing in px
          const yOffset = Math.abs(dist) * 35; // gentle parabolic dip
          const zIndex = 50 - Math.round(Math.abs(dist) * 10);
          const rotateZ = dist * 8; // subtle fan angle
          const rotateY = dist * -14; // 3D perspective turn
          const scale = Math.max(0.72, 1 - Math.abs(dist) * 0.12);
          const opacity = Math.max(0.18, 1 - Math.abs(dist) * 0.35);

          gsap.set(el, {
            x: xOffset,
            y: yOffset,
            scale: scale,
            rotationZ: rotateZ,
            rotationY: rotateY,
            transformPerspective: 1200,
            zIndex: zIndex,
            opacity: opacity,
            overwrite: 'auto'
          });
        }
      }
    };

    gsap.ticker.add(updateTick);
    return () => gsap.ticker.remove(updateTick);
  }, [cards.length]);

  // Current active focal card
  const activeCard = cards[displayIndex] || cards[0];

  // Handle color chip click -> opens color properties inspector
  const handleChipClick = (chip, card, e) => {
    e.stopPropagation();
    setActiveChip({
      ...chip,
      stripNumber: card.stripNumber,
      family: card.family,
      bookTitle: currentBook.title,
      edition: currentBook.edition,
      coverColor: currentBook.coverColor
    });
    if (onCopy) {
      onCopy(chip.hex, 'HEX');
    }
  };

  return (
    <div 
      ref={stageRef}
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - 64px)',
        height: '92vh',
        overflow: 'hidden',
        backgroundColor: '#F8F8FA',
        color: '#1D1D1F',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        userSelect: 'none',
        cursor: 'grab'
      }}
    >
      {/* Subtle Analog Grain Overlay (A24-inspired) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.04,
        pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        zIndex: 1
      }} />

      {/* Top Editorial Bar: Book Switcher & Navigation */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 36px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Book Volume Tabs (Minimalist Monograph Style) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.85)', padding: '5px 8px', borderRadius: '9999px', backdropFilter: 'blur(16px)', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          {PANTONE_BOOKS.map((book) => {
            const isActive = activeBookId === book.id;
            return (
              <button
                key={book.id}
                onClick={() => handleSelectBook(book.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isActive ? '#1D1D1F' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#666666',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: book.coverColor,
                  display: 'inline-block'
                }} />
                <span>{book.title}</span>
              </button>
            );
          })}
        </div>

        {/* Minimal Scroll Instruction Hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: '#888888', fontWeight: 500 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RotateCw size={13} />
            <span>Scroll Wheel / Drag to Rotate Deck</span>
          </span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>
            {displayIndex + 1} / {cards.length}
          </span>
        </div>
      </div>

      {/* Top-Left Active Card Dossier (A24-Style Editorial Tabular Metadata) */}
      <div style={{
        position: 'absolute',
        top: '90px',
        left: '36px',
        maxWidth: '360px',
        zIndex: 25,
        pointerEvents: 'none'
      }}>
        {/* Film / Shade Strip Title in Editorial Serif */}
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(2.2rem, 3.8vw, 3.4rem)',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          color: '#1D1D1F',
          margin: '0 0 16px 0',
          textTransform: 'uppercase'
        }}>
          {activeCard?.family || currentBook.title}
        </h2>

        {/* Technical Metadata Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {/* Row 1 */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
            <span style={{ color: '#888888', fontWeight: 600, letterSpacing: '0.05em' }}>STRIP NUMBER</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#1D1D1F' }}>{activeCard?.stripNumber}</span>
          </div>

          {/* Row 2 */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
            <span style={{ color: '#888888', fontWeight: 600, letterSpacing: '0.05em' }}>COLOR SYSTEM</span>
            <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{currentBook.edition}</span>
          </div>

          {/* Row 3 */}
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
            <span style={{ color: '#888888', fontWeight: 600, letterSpacing: '0.05em' }}>SHADE COUNT</span>
            <span style={{ fontWeight: 600, color: '#1D1D1F' }}>{activeCard?.chips.length} Precise Inks</span>
          </div>
        </div>
      </div>

      {/* CENTER: Fullscreen 3D Rotating Shade Cards Gallery (Stage) */}
      <div style={{
        position: 'relative',
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1400px',
        zIndex: 10
      }}>
        {/* Hand-drawn editorial focus loop around the center card (A24-inspired delight) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '240px',
          height: '560px',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 45
        }}>
          <svg viewBox="0 0 240 560" fill="none" style={{ width: '100%', height: '100%' }}>
            <rect
              x="6"
              y="6"
              width="228"
              height="548"
              rx="22"
              stroke="#1D1D1F"
              strokeWidth="2"
              strokeDasharray="14 10"
              opacity="0.18"
            />
          </svg>
        </div>

        {/* 3D Rotating Cards Container */}
        <div 
          ref={cardsContainerRef}
          style={{
            position: 'relative',
            width: '210px',
            height: '530px',
            transformStyle: 'preserve-3d'
          }}
        >
          {cards.map((card, idx) => {
            return (
              <div
                key={card.id || idx}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '210px',
                  height: '530px',
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transformOrigin: '50% 100%'
                }}
              >
                {/* Strip Top Tab (Authentic Pantone Header) */}
                <div style={{
                  padding: '12px 14px 8px 14px',
                  background: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #EEEEEE'
                }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 900, color: '#1D1D1F', letterSpacing: '0.04em' }}>
                    {card.stripNumber}
                  </span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {card.family}
                  </span>
                </div>

                {/* Color Chips Stack (Hairline White Dividers, Clickable) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {card.chips.map((chip, cIdx) => (
                    <div
                      key={chip.code || cIdx}
                      onClick={(e) => handleChipClick(chip, card, e)}
                      style={{
                        flex: 1,
                        backgroundColor: chip.hex,
                        borderBottom: cIdx < card.chips.length - 1 ? '2px solid #FFFFFF' : 'none',
                        padding: '6px 10px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'filter 0.15s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.filter = 'none')}
                    >
                      {/* Frosted chip label pill */}
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(6px)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                        maxWidth: '85%'
                      }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
                          {chip.code}
                        </div>
                        <div style={{ fontSize: '0.58rem', color: '#666666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
                          {chip.name}
                        </div>
                      </div>

                      {/* Tap/click icon hint */}
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.7
                      }}>
                        <span style={{ fontSize: '0.55rem', fontWeight: 800, color: '#1D1D1F' }}>+</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Rivet Pivot Base */}
                <div style={{
                  height: '48px',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 16px',
                  borderTop: '1px solid #F0F0F0'
                }}>
                  <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase' }}>
                    {currentBook.id === 'caseyx-choice' ? 'CASEYX .GRD' : 'PANTONE® FORMULA'}
                  </span>
                  {/* Metal rivet grommet */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4D4D8 45%, #8E8E93 100%)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.25)'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Editorial Bar: Quick Controls & Navigation Buttons */}
      <div style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '24px 36px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Left: Interactive Navigation Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              targetRotationRef.current = Math.max(0, Math.round(targetRotationRef.current - 1));
            }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.1)',
              color: '#1D1D1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Previous Shade Strip (Arrow Left)"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            onClick={() => {
              targetRotationRef.current = Math.min(cards.length - 1, Math.round(targetRotationRef.current + 1));
            }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid rgba(0,0,0,0.1)',
              color: '#1D1D1F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Next Shade Strip (Arrow Right)"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Center / Right: Film / Shade Quote */}
        <div style={{ textAlign: 'right', maxWidth: '420px' }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.25rem',
            fontStyle: 'italic',
            color: '#1D1D1F',
            margin: '0 0 4px 0',
            lineHeight: 1.3
          }}>
            “Color is the place where our brain and the universe meet.”
          </p>
          <span style={{ fontSize: '0.72rem', color: '#888888', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {currentBook.description}
          </span>
        </div>
      </div>

      {/* COLOR PROPERTIES MODAL / INSPECTOR (A24-Style Cinematic Dialog) */}
      {activeChip && (
        <div 
          onClick={() => setActiveChip(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Giant Color Header Preview */}
            <div style={{
              height: '180px',
              backgroundColor: activeChip.hex,
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: 'rgba(0,0,0,0.6)',
                  color: '#FFFFFF',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}>
                  {activeChip.stripNumber} • {activeChip.family}
                </span>

                <button
                  onClick={() => setActiveChip(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)',
                    border: 'none',
                    color: '#1D1D1F',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div>
                <h3 style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)'
                }}>
                  {activeChip.name}
                </h3>
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF', opacity: 0.9, textShadow: '0 1px 4px rgba(0,0,0,0.4)', fontFamily: 'var(--font-mono)' }}>
                  {activeChip.code}
                </span>
              </div>
            </div>

            {/* Properties Technical Grid */}
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px'
              }}>
                {/* Hex code */}
                <div style={{ background: '#F8F8FA', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>HEX CODE</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 800 }}>{activeChip.hex}</span>
                    <button
                      onClick={() => onCopy && onCopy(activeChip.hex, 'HEX')}
                      style={{ background: 'none', border: 'none', color: '#1D1D1F', cursor: 'pointer', padding: '4px' }}
                      title="Copy HEX"
                    >
                      {copiedHex === activeChip.hex ? <Check size={14} color="#34C759" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                {/* Ink Formula */}
                <div style={{ background: '#F8F8FA', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>INK FORMULA / STOP</span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1D1D1F', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeChip.formula || activeChip.cmyk || '100% Solid Ink'}
                  </span>
                </div>

                {/* CMYK */}
                {activeChip.cmyk && (
                  <div style={{ background: '#F8F8FA', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>CMYK PRINT SPEC</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700, color: '#1D1D1F' }}>
                      {activeChip.cmyk}
                    </span>
                  </div>
                )}

                {/* Color System Book */}
                <div style={{ background: '#F8F8FA', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>CATALOG VOLUME</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D1D1F' }}>
                    {activeChip.edition}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    if (onSelectColor) onSelectColor(activeChip.hex);
                    setActiveChip(null);
                  }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '9999px',
                    background: '#1D1D1F',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Palette size={16} />
                  <span>Generate Color Harmonies</span>
                </button>

                <button
                  onClick={() => {
                    if (onCopy) onCopy(activeChip.hex, 'HEX');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '12px 20px',
                    borderRadius: '9999px',
                    background: '#F0F0F4',
                    color: '#1D1D1F',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={16} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
