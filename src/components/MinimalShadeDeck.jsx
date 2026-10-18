import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Copy, Check, X, Palette, ChevronLeft, ChevronRight, Compass, Sparkles, Layers, Sliders, Menu } from 'lucide-react';
import gsap from 'gsap';
import { PANTONE_BOOKS } from '../data/pantoneDeckData';

export default function MinimalShadeDeck({ onSelectColor, onCopy, copiedHex, setActiveTab }) {
  // Current active book volume
  const [activeBookId, setActiveBookId] = useState('formula-coated');

  // Open state: false = closed vertical book, true = giant radial fan filling the WHOLE SCREEN
  const [isOpen, setIsOpen] = useState(false);

  // Selected color chip for properties modal
  const [activeChip, setActiveChip] = useState(null);

  // Hovered card index for z-index layering
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);

  // Mobile Discovery drawer state
  const [showNavSheet, setShowNavSheet] = useState(false);

  // Responsive viewport width detection
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const isMobile = viewportWidth < 768;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Card dimensions: responsive on mobile vs desktop
  const cardWidth = isMobile ? Math.min(180, viewportWidth * 0.48) : 240;
  const cardHeight = isMobile ? '70vh' : '88vh';
  const totalSpread = isMobile ? 110 : 150;

  // Active page slice for rendering in the fan (7 cards on mobile for neat spacing, 10 on desktop)
  const [pageIndex, setPageIndex] = useState(0);
  const CARDS_PER_FAN = isMobile ? 7 : 10;

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
    const currentSpread = totalSpread;
    const startAngle = -currentSpread / 2 + offset;
    const step = currentSpread / Math.max(1, total - 1);

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
      const currentSpread = totalSpread;
      const startAngle = -currentSpread / 2;
      const step = currentSpread / Math.max(1, total - 1);

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
  }, [isOpen, pageIndex, activeBookId, totalSpread]);

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
      {/* Top Floating Controls Bar (Responsive: Menu button + Horizontally scrollable book pill) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: isMobile ? '12px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: 'calc(100vw - 24px)',
          width: isMobile ? 'calc(100vw - 24px)' : 'auto',
          justifyContent: isMobile ? 'space-between' : 'center'
        }}
      >
        {/* Mobile Discovery Menu Trigger */}
        {isMobile && (
          <button
            onClick={() => setShowNavSheet(true)}
            aria-label="Open Explore & Harmonies Navigation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(0,0,0,0.08)',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#1D1D1F',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            <Compass size={15} color="#0071E3" />
            <span>Explore</span>
          </button>
        )}

        {/* Scrollable Books & Page Switcher Pill */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '4px' : '8px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '4px 6px',
            borderRadius: '9999px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid rgba(0,0,0,0.06)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            maxWidth: isMobile ? 'calc(100% - 90px)' : 'none'
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
                  gap: '6px',
                  padding: isMobile ? '5px 10px' : '6px 16px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isActive ? '#1D1D1F' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#666666',
                  fontSize: isMobile ? '0.74rem' : '0.8rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: book.coverColor,
                  display: 'inline-block'
                }} />
                <span>{isMobile ? book.title.replace('Pantone ', '').replace('Coated', '') : book.title}</span>
              </button>
            );
          })}

          {isOpen && maxPages > 1 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              paddingLeft: '4px',
              borderLeft: '1px solid rgba(0,0,0,0.1)',
              flexShrink: 0
            }}>
              <button
                disabled={pageIndex === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  setPageIndex((p) => Math.max(0, p - 1));
                }}
                style={{
                  width: '24px',
                  height: '24px',
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
                <ChevronLeft size={13} />
              </button>

              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#555555',
                padding: '0 4px',
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
                  width: '24px',
                  height: '24px',
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
                <ChevronRight size={13} />
              </button>
            </div>
          )}

          {isOpen && (
            <button
              onClick={handleToggleDeck}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: isMobile ? '5px 10px' : '6px 14px',
                borderRadius: '9999px',
                border: 'none',
                background: '#1D1D1F',
                color: '#FFFFFF',
                fontSize: isMobile ? '0.72rem' : '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: '2px',
                flexShrink: 0
              }}
            >
              <X size={12} />
              <span>{isMobile ? 'Close' : 'Close Deck'}</span>
            </button>
          )}
        </div>
      </div>

      {/* WHOLE SCREEN RADIAL FAN DECK STAGE 
          Responsive width and height scaled cleanly on mobile vs desktop
          Anchored at bottom center with transformOrigin at bottom fastener */}
      <div
        ref={deckContainerRef}
        style={{
          position: 'relative',
          width: `${cardWidth}px`,
          height: cardHeight,
          zIndex: 10,
          transformOrigin: '50% calc(100% - 30px)'
        }}
      >
        {/* SHADE CARDS (Fanning across the screen) */}
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
                width: `${cardWidth}px`,
                height: cardHeight,
                borderRadius: isMobile ? '16px 16px 22px 22px' : '20px 20px 28px 28px',
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
                      padding: isMobile ? '2px 5px' : '3px 8px',
                      borderRadius: '5px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      maxWidth: '85%'
                    }}>
                      <div style={{ fontSize: isMobile ? '0.66rem' : '0.74rem', fontWeight: 900, color: '#1D1D1F', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.15 }}>
                        {chip.code}
                      </div>
                      <div style={{ fontSize: isMobile ? '0.58rem' : '0.64rem', color: '#555555', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.15 }}>
                        {chip.name}
                      </div>
                    </div>

                    {/* Tap / Click Indicator */}
                    <div style={{
                      width: isMobile ? '16px' : '20px',
                      height: isMobile ? '16px' : '20px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.8
                    }}>
                      <span style={{ fontSize: isMobile ? '0.58rem' : '0.65rem', fontWeight: 800, color: '#1D1D1F' }}>+</span>
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
            width: `${cardWidth}px`,
            height: cardHeight,
            borderRadius: isMobile ? '16px 16px 22px 22px' : '20px 20px 28px 28px',
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
            padding: isMobile ? '18px 16px' : '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <span style={{ fontSize: isMobile ? '0.72rem' : '0.82rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.9 }}>
              {currentBook.edition}
            </span>

            <div style={{
              fontSize: isMobile ? '1.6rem' : '2.1rem',
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

            <span style={{ fontSize: isMobile ? '0.64rem' : '0.72rem', opacity: 0.85, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {currentBook.id === 'caseyx-choice' ? '268 GRADIENT MAPS' : 'COLOR SYSTEM'}
            </span>
          </div>

          {/* Bottom White Half */}
          <div style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            padding: isMobile ? '18px 16px 65px 16px' : '28px 24px 75px 24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: isMobile ? '1.18rem' : '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', color: '#1D1D1F', marginBottom: '4px' }}>
                {currentBook.id === 'caseyx-choice' ? 'CASEYXLIVE®' : 'PANTONE®'}
              </div>
              <p style={{ fontSize: isMobile ? '0.7rem' : '0.78rem', color: '#666666', lineHeight: 1.35, margin: 0 }}>
                {currentBook.subtitle}
              </p>
            </div>

            <div style={{ fontSize: isMobile ? '0.65rem' : '0.74rem', color: '#888888', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {allBookCards.length} Strips • {currentBook.totalColors} Colors • Tap to Open
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
            padding: isMobile ? '16px' : '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: '#FFFFFF',
              borderRadius: isMobile ? '20px' : '24px',
              boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              border: '1px solid rgba(0,0,0,0.08)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Color Swatch Header */}
            <div style={{
              height: isMobile ? '140px' : '180px',
              backgroundColor: activeChip.hex,
              padding: isMobile ? '16px' : '20px',
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
                  fontSize: isMobile ? '1.5rem' : '2rem',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  margin: 0,
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  lineHeight: 1.15
                }}>
                  {activeChip.name}
                </h3>
                <span style={{ fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#FFFFFF', opacity: 0.95, textShadow: '0 1px 4px rgba(0,0,0,0.4)', fontFamily: 'var(--font-mono)' }}>
                  {activeChip.code}
                </span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div style={{ padding: isMobile ? '16px' : '24px', overflowY: 'auto' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: isMobile ? '8px' : '12px',
                marginBottom: isMobile ? '14px' : '20px'
              }}>
                {/* Hex code */}
                <div style={{ background: '#F8F8FA', padding: isMobile ? '10px' : '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.65rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>HEX CODE</span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '0.86rem' : '0.95rem', fontWeight: 800 }}>{activeChip.hex}</span>
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
                <div style={{ background: '#F8F8FA', padding: isMobile ? '10px' : '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.65rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>INK FORMULA / STOP</span>
                  <span style={{ fontSize: isMobile ? '0.74rem' : '0.82rem', fontWeight: 700, color: '#1D1D1F', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeChip.formula || activeChip.cmyk || '100% Solid Ink'}
                  </span>
                </div>

                {/* CMYK */}
                {activeChip.cmyk && (
                  <div style={{ background: '#F8F8FA', padding: isMobile ? '10px' : '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <span style={{ fontSize: '0.65rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>CMYK SPEC</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '0.76rem' : '0.84rem', fontWeight: 700, color: '#1D1D1F' }}>
                      {activeChip.cmyk}
                    </span>
                  </div>
                )}

                {/* Color System Book */}
                <div style={{ background: '#F8F8FA', padding: isMobile ? '10px' : '12px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: '0.65rem', color: '#888888', fontWeight: 600, display: 'block', marginBottom: '2px' }}>COLOR SYSTEM</span>
                  <span style={{ fontSize: isMobile ? '0.74rem' : '0.82rem', fontWeight: 700, color: '#1D1D1F' }}>
                    {activeChip.edition}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: isMobile ? '8px' : '10px' }}>
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
                    padding: isMobile ? '10px 14px' : '12px',
                    borderRadius: '9999px',
                    background: '#1D1D1F',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: isMobile ? '0.78rem' : '0.86rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Palette size={15} />
                  <span>{isMobile ? 'Harmonies' : 'Generate Color Harmonies'}</span>
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
                    padding: isMobile ? '10px 16px' : '12px 20px',
                    borderRadius: '9999px',
                    background: '#F0F0F4',
                    color: '#1D1D1F',
                    fontWeight: 700,
                    fontSize: isMobile ? '0.78rem' : '0.86rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Copy size={15} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Discovery Bottom Sheet / Drawer */}
      {showNavSheet && (
        <div
          onClick={() => setShowNavSheet(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '20px 20px 36px 20px',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
              borderTop: '1px solid rgba(0,0,0,0.08)'
            }}
          >
            {/* Grab Handle */}
            <div style={{
              width: '36px',
              height: '4px',
              backgroundColor: '#D1D1D6',
              borderRadius: '9999px',
              margin: '0 auto 16px auto'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1D1D1F', margin: 0 }}>
                  AURA Discovery
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#888888', margin: 0 }}>
                  Explore 6,000+ Pantone shades & Apple harmonies
                </p>
              </div>
              <button
                onClick={() => setShowNavSheet(false)}
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#F0F0F4',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1D1D1F',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Navigation Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { id: 'explore-hunt', label: 'Color Hunt', desc: 'Curated 4-shade palettes', icon: Compass, color: '#0071E3' },
                { id: 'pantone-trends', label: 'Pantone Trends', desc: 'Peach Fuzz, Mocha & trends', icon: Palette, color: '#FF9500' },
                { id: 'harmonies', label: 'Color Harmonies', desc: 'Monochrome, Analogous & Triads', icon: Layers, color: '#AF52DE' },
                { id: 'gradients', label: "Casey's Gradients", desc: '268 high-precision maps', icon: Sparkles, color: '#34C759' },
                { id: 'studio-preview', label: 'Studio Canvas', desc: 'Interactive UI mockups', icon: Sliders, color: '#FF2D55' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowNavSheet(false);
                      if (setActiveTab) setActiveTab(item.id);
                    }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '12px 14px',
                      background: '#F8F8FA',
                      borderRadius: '16px',
                      border: '1px solid rgba(0,0,0,0.04)',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: `${item.color}15`,
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      <Icon size={16} />
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1D1D1F' }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#888888', marginTop: '2px', lineHeight: 1.2 }}>
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
