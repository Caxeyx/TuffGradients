import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Copy, Check, X, Palette, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import { PANTONE_BOOKS } from '../data/pantoneDeckData';

export default function MinimalShadeDeck({ onSelectColor, onCopy, copiedHex, setActiveTab }) {
  // Current active book volume
  const [activeBookId, setActiveBookId] = useState('formula-coated');

  // Open state: false = closed vertical book, true = giant radial fan filling the WHOLE SCREEN
  const [isOpen, setIsOpen] = useState(false);

  // Selected color chip for properties modal
  const [activeChip, setActiveChip] = useState(null);

  // Hovered card index for zIndex & shadow
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);

  // Active page slice for rendering in the fan (10 cards fanned at once for instantaneous 60fps)
  const [pageIndex, setPageIndex] = useState(0);
  const CARDS_PER_FAN = 10;

  // Current active book & cards
  const currentBook = useMemo(() => {
    return PANTONE_BOOKS.find((b) => b.id === activeBookId) || PANTONE_BOOKS[0];
  }, [activeBookId]);

  const allBookCards = currentBook.cards;
  const maxPages = Math.max(1, Math.ceil(allBookCards.length / CARDS_PER_FAN));

  // Windowed visible cards for instantaneous 60fps GSAP fan performance
  const cards = useMemo(() => {
    const start = pageIndex * CARDS_PER_FAN;
    return allBookCards.slice(start, start + CARDS_PER_FAN);
  }, [allBookCards, pageIndex, CARDS_PER_FAN]);

  // Deck container & cards ref
  const deckContainerRef = useRef(null);
  const cardElementsRef = useRef([]);

  // Dynamic fan rotation offset state
  const [rotationOffset, setRotationOffset] = useState(0);
  const rotOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);
  const hasDraggedRef = useRef(false);

  const coverCardRef = useRef(null);

  // Directly update card rotations on wheel/drag
  const updateCardRotations = (offset) => {
    const cardsDom = cardElementsRef.current.filter(Boolean);
    const total = cardsDom.length;
    if (total === 0) return;
    const totalSpread = 150;
    const startAngle = -totalSpread / 2 + offset;
    const step = totalSpread / Math.max(1, total - 1);

    cardsDom.forEach((el, idx) => {
      const targetAngle = startAngle + idx * step;
      gsap.to(el, {
        rotation: targetAngle,
        duration: 0.15,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    });
  };

  // Wheel listener when open: rotate fan reliably
  useEffect(() => {
    if (!isOpen) return;

    const onWheel = (e) => {
      e.preventDefault();
      const rawDelta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const delta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta) * 0.05, 5);
      
      const newOffset = Math.max(-45, Math.min(45, rotOffsetRef.current + delta));
      rotOffsetRef.current = newOffset;
      setRotationOffset(newOffset);
      updateCardRotations(newOffset);
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [isOpen, cards]);

  // Pointer drag listeners for rotating fan deck
  const onPointerDown = (e) => {
    if (!isOpen) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartRotRef.current = rotOffsetRef.current;
  };

  const onPointerMove = (e) => {
    if (!isDraggingRef.current || !isOpen) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const diffPixels = clientX - dragStartXRef.current;
    if (Math.abs(diffPixels) > 5) {
      hasDraggedRef.current = true;
    }
    const diff = diffPixels * 0.12;
    const newOffset = Math.max(-45, Math.min(45, dragStartRotRef.current + diff));
    rotOffsetRef.current = newOffset;
    setRotationOffset(newOffset);
    updateCardRotations(newOffset);
  };

  const onPointerUp = () => {
    isDraggingRef.current = false;
  };

  // Click on empty screen backdrop closes the deck
  const handleBackdropClick = (e) => {
    if (hasDraggedRef.current) {
      return;
    }
    if (isOpen) {
      setIsOpen(false);
      setActiveChip(null);
    }
  };

  // Animate Open / Close with GSAP to fill the WHOLE SCREEN with buttery 60fps continuity
  useEffect(() => {
    if (!deckContainerRef.current) return;

    const cardsDom = cardElementsRef.current.filter(Boolean);
    const total = cardsDom.length;
    const coverEl = coverCardRef.current;

    cardsDom.forEach((el) => gsap.killTweensOf(el));
    if (coverEl) gsap.killTweensOf(coverEl);
    gsap.killTweensOf(deckContainerRef.current);

    if (isOpen) {
      const totalSpread = 150;
      const startAngle = -totalSpread / 2;
      const step = totalSpread / Math.max(1, total - 1);

      rotOffsetRef.current = 0;
      setRotationOffset(0);

      if (coverEl) {
        gsap.to(coverEl, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.25,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      }

      cardsDom.forEach((el, idx) => {
        const targetAngle = startAngle + idx * step;
        gsap.to(el, {
          rotation: targetAngle,
          opacity: 1,
          duration: 0.55,
          delay: idx * 0.02,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    } else {
      rotOffsetRef.current = 0;
      setRotationOffset(0);

      cardsDom.forEach((el, idx) => {
        gsap.to(el, {
          rotation: 0,
          opacity: idx === 0 ? 1 : 0.85,
          duration: 0.45,
          delay: (total - 1 - idx) * 0.015,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      });

      if (coverEl) {
        gsap.to(coverEl, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: 0.35,
          delay: 0.15,
          ease: 'power2.inOut',
          overwrite: 'auto'
        });
      }
    }
  }, [isOpen, pageIndex, activeBookId]);

  // Click to toggle deck
  const handleToggleDeck = () => {
    setIsOpen(!isOpen);
    setActiveChip(null);
  };

  // Click on a color chip -> Opens properties modal
  const handleChipClick = (chip, card, e) => {
    e.stopPropagation();
    setActiveChip({
      ...chip,
      stripNumber: card.stripNumber,
      family: card.family,
      edition: currentBook.edition,
      bookTitle: currentBook.title
    });
    if (onCopy) {
      onCopy(chip.hex, 'HEX');
    }
  };

  // Switch book volume
  const handleSelectBook = (bookId, e) => {
    if (e) e.stopPropagation();
    setActiveBookId(bookId);
    setPageIndex(0);
    setActiveChip(null);
  };

  return (
    <div
      onClick={handleBackdropClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FBFBFD',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontFamily: 'var(--font-sans)',
        paddingBottom: '20px',
        cursor: isOpen ? 'grab' : 'default'
      }}
    >
      {/* Top Floating Book Selector Bar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(20px)',
          padding: '5px 8px',
          borderRadius: '9999px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.06)'
        }}
      >
        {PANTONE_BOOKS.map((book) => {
          const isActive = activeBookId === book.id;
          return (
            <button
              key={book.id}
              onClick={(e) => handleSelectBook(book.id, e)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
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

        {isOpen && maxPages > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            paddingLeft: '6px',
            borderLeft: '1px solid rgba(0,0,0,0.1)'
          }}>
            <button
              disabled={pageIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                setPageIndex((p) => Math.max(0, p - 1));
              }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: 'none',
                background: pageIndex === 0 ? 'rgba(0,0,0,0.04)' : '#F0F0F4',
                color: pageIndex === 0 ? '#BBBBBB' : '#1D1D1F',
                cursor: pageIndex === 0 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Previous Shade Strips"
            >
              <ChevronLeft size={14} />
            </button>

            <span style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: '#555555',
              padding: '0 6px',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {pageIndex + 1}/{maxPages}
            </span>

            <button
              disabled={pageIndex >= maxPages - 1}
              onClick={(e) => {
                e.stopPropagation();
                setPageIndex((p) => Math.min(maxPages - 1, p + 1));
              }}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: 'none',
                background: pageIndex >= maxPages - 1 ? 'rgba(0,0,0,0.04)' : '#F0F0F4',
                color: pageIndex >= maxPages - 1 ? '#BBBBBB' : '#1D1D1F',
                cursor: pageIndex >= maxPages - 1 ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              title="Next Shade Strips"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {isOpen && (
          <button
            onClick={handleToggleDeck}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: 'none',
              background: '#1D1D1F',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            <X size={13} />
            <span>Close Deck</span>
          </button>
        )}
      </div>

      {/* WHOLE SCREEN RADIAL FAN DECK STAGE 
          Width: 240px, Height: 88vh (reaches almost the very top of the 100vh viewport!) 
          Anchored at bottom center with transformOrigin at bottom fastener */}
      <div
        ref={deckContainerRef}
        style={{
          position: 'relative',
          width: '240px',
          height: '88vh',
          zIndex: 10,
          transformOrigin: '50% calc(100% - 30px)'
        }}
      >
        {/* SHADE CARDS (Fanning across the WHOLE SCREEN from left edge to right edge) */}
        {cards.map((card, idx) => {
          const isHovered = hoveredCardIdx === idx;
          const zIndex = isHovered ? 90 : 10 + idx;

          return (
            <div
              key={card.id || idx}
              ref={(el) => (cardElementsRef.current[idx] = el)}
              onMouseEnter={() => setHoveredCardIdx(idx)}
              onMouseLeave={() => setHoveredCardIdx(null)}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOpen) {
                  handleToggleDeck();
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '240px',
                height: '88vh',
                borderRadius: '20px 20px 28px 28px',
                backgroundColor: '#FFFFFF',
                boxShadow: isHovered && isOpen
                  ? '0 24px 60px rgba(0,0,0,0.22), 0 0 0 2px var(--accent-apple-blue)'
                  : '0 10px 30px rgba(0,0,0,0.08), -1px 2px 8px rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
                transformOrigin: '50% calc(100% - 30px)', // Bottom center pivot screw!
                willChange: 'transform',
                transform: 'translateZ(0)'
              }}
            >
              {/* Strip Header Tab */}
              <div style={{
                padding: '16px 18px 10px 18px',
                background: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ECECEC'
              }}>
                <span style={{ fontSize: '0.96rem', fontWeight: 900, color: '#1D1D1F', letterSpacing: '0.04em' }}>
                  {card.stripNumber}
                </span>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.04em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                  {card.family}
                </span>
              </div>

              {/* Color Chips Stack (Crisp White Hairlines, Stretching Full Height) */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {card.chips.map((chip, cIdx) => (
                  <div
                    key={chip.code || cIdx}
                    onClick={(e) => handleChipClick(chip, card, e)}
                    style={{
                      flex: 1,
                      backgroundColor: chip.hex,
                      borderBottom: cIdx < card.chips.length - 1 ? '2.5px solid #FFFFFF' : 'none',
                      padding: '8px 14px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    title={`${chip.code} - ${chip.name} (${chip.hex})`}
                  >
                    {/* Chip Label Box */}
                    <div style={{
                      background: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      maxWidth: '85%'
                    }}>
                      <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.15 }}>
                        {chip.code}
                      </div>
                      <div style={{ fontSize: '0.64rem', color: '#555555', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.15 }}>
                        {chip.name}
                      </div>
                    </div>

                    {/* Tap / Click Indicator */}
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8
                    }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#1D1D1F' }}>+</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Pivot Base area */}
              <div style={{
                height: '70px',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                borderTop: '1px solid #F0F0F0'
              }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase' }}>
                  {currentBook.edition.substring(0, 18)}
                </span>
                <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#AAAAAA' }}>
                  {card.stripNumber}
                </span>
              </div>
            </div>
          );
        })}

        {/* FRONT COVER CARD (Continuous in DOM with GSAP opacity) */}
        <div
          ref={coverCardRef}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOpen) {
              handleToggleDeck();
            }
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '240px',
            height: '88vh',
            borderRadius: '20px 20px 28px 28px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 30px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            cursor: !isOpen ? 'pointer' : 'default',
            zIndex: 75,
            opacity: 1,
            transformOrigin: '50% calc(100% - 30px)',
            transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease'
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.currentTarget.style.transform = 'translateY(-14px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 45px 100px rgba(0,0,0,0.26)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.2), 0 8px 24px rgba(0,0,0,0.08)';
          }}
        >
          {/* Top Color Cover */}
          <div style={{
            height: '52%',
            backgroundColor: currentBook.coverColor,
            color: currentBook.textColor,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>
              {currentBook.edition}
            </span>

            <div style={{
              fontSize: '2.1rem',
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

            <span style={{ fontSize: '0.72rem', opacity: 0.85, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {currentBook.id === 'caseyx-choice' ? '268 GRADIENT MAPS' : 'COLOR SYSTEM'}
            </span>
          </div>

          {/* Bottom White Half */}
          <div style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            padding: '28px 24px 75px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#1D1D1F', marginBottom: '6px' }}>
                {currentBook.id === 'caseyx-choice' ? 'CASEYXLIVE®' : 'PANTONE®'}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#666666', lineHeight: 1.4, margin: 0 }}>
                {currentBook.subtitle}
              </p>
            </div>

            <div style={{ fontSize: '0.74rem', color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {allBookCards.length} Shade Strips • {currentBook.totalColors} Colors • Click to Fan Open
            </div>
          </div>
        </div>

        {/* METALLIC PIVOT SCREW RIVET (Bottom center pivot fastener) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleToggleDeck();
          }}
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #D4D4D8 45%, #8E8E93 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.45), inset 0 1px 2px #FFFFFF, inset 0 -1px 2px #333333',
            zIndex: 95,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Screw Rivet Pivot — Click to Fan Open / Close"
        >
          <div style={{ width: '16px', height: '2.5px', backgroundColor: '#555559', transform: 'rotate(45deg)' }} />
        </div>
      </div>

      {/* COLOR PROPERTIES MODAL (When clicking any color chip) */}
      {activeChip && (
        <div
          onClick={() => setActiveChip(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            {/* Color Swatch Header */}
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
                    background: 'rgba(255,255,255,0.88)',
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
                <span style={{ fontSize: '0.9rem', color: '#FFFFFF', opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.4)', fontFamily: 'var(--font-mono)' }}>
                  {activeChip.code}
                </span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
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
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D1D1F', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeChip.formula || activeChip.cmyk || '100% Solid Ink'}
                  </span>
                </div>

                {/* CMYK */}
                {activeChip.cmyk && (
                  <div style={{ background: '#F8F8FA', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>CMYK SPEC</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.84rem', fontWeight: 700, color: '#1D1D1F' }}>
                      {activeChip.cmyk}
                    </span>
                  </div>
                )}

                {/* Color System Book */}
                <div style={{ background: '#F8F8FA', padding: '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.68rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>COLOR SYSTEM</span>
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
