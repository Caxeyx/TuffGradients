import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Copy, Check, BookOpen, ChevronRight, X, Sparkles } from 'lucide-react';

/**
 * Booklet Component
 * 
 * Requirements:
 * - Shows a closed cover with a title and a color strip
 * - On hover it lifts with a soft shadow (Apple design tokens)
 * - On click, uses GSAP to rotate the cover open on its left edge (3D perspective, transformOrigin: 'left center')
 * - Reveals a list of swatch pages
 * - Each swatch has name, hex, and RGB value
 * - Clicking any swatch copies the hex code
 * - Preserves existing Apple-style design tokens & micro-interactions
 */
export default function Booklet({ booklet, onCopy, copiedHex }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLocal, setCopiedLocal] = useState('');
  
  const bookletWrapperRef = useRef(null);
  const coverRef = useRef(null);
  const innerPagesRef = useRef(null);
  const swatchItemsRef = useRef([]);

  // Animate cover opening/closing with GSAP
  useEffect(() => {
    if (!coverRef.current || !innerPagesRef.current) return;

    gsap.killTweensOf(coverRef.current);
    gsap.killTweensOf(innerPagesRef.current);
    swatchItemsRef.current.forEach((el) => {
      if (el) gsap.killTweensOf(el);
    });

    if (isOpen) {
      // 1. Rotate the cover open on its left edge (3D book opening effect)
      gsap.to(coverRef.current, {
        rotationY: -145,
        z: 30,
        boxShadow: '-16px 20px 40px rgba(0, 0, 0, 0.35)',
        duration: 0.75,
        ease: 'power3.out'
      });

      // 2. Animate inner pages container visibility & subtle depth
      gsap.to(innerPagesRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out'
      });

      // 3. Stagger reveal swatch items
      const validSwatches = swatchItemsRef.current.filter(Boolean);
      gsap.fromTo(
        validSwatches,
        {
          opacity: 0,
          x: 16,
          scale: 0.96
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.05,
          delay: 0.15,
          ease: 'power2.out'
        }
      );
    } else {
      // Close cover back to flat state
      gsap.to(coverRef.current, {
        rotationY: 0,
        z: 0,
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
        duration: 0.6,
        ease: 'power3.inOut'
      });

      gsap.to(innerPagesRef.current, {
        opacity: 0.15,
        pointerEvents: 'none',
        duration: 0.4,
        ease: 'power2.inOut'
      });
    }
  }, [isOpen]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSwatchCopy = (hex, e) => {
    e.stopPropagation();
    if (onCopy) {
      onCopy(hex, 'HEX');
    } else if (navigator?.clipboard) {
      navigator.clipboard.writeText(hex);
    }
    setCopiedLocal(hex);
    setTimeout(() => {
      setCopiedLocal('');
    }, 1800);
  };

  const isCopied = (hex) => copiedHex === hex || copiedLocal === hex;

  return (
    <div
      ref={bookletWrapperRef}
      style={{
        position: 'relative',
        perspective: '1200px',
        width: '100%',
        maxWidth: '380px',
        height: '460px',
        margin: '0 auto',
        userSelect: 'none'
      }}
    >
      {/* 
        INNER SWATCH PAGES (Under the cover)
        Revealed as the cover swings open
      */}
      <div
        ref={innerPagesRef}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          zIndex: 1,
          opacity: 0,
          pointerEvents: 'none',
          transition: 'box-shadow 0.3s ease'
        }}
      >
        {/* Header of open booklet */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '10px'
        }}>
          <div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-secondary)'
            }}>
              Swatch Palette Pages
            </span>
            <h4 style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              margin: '2px 0 0 0'
            }}>
              {booklet.title}
            </h4>
          </div>

          <button
            onClick={handleToggle}
            title="Close Booklet"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'var(--bg-subtle)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* List of Swatch Pages */}
        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            paddingRight: '2px'
          }}
        >
          {booklet.swatches.map((swatch, idx) => {
            const rgbStr = `rgb(${swatch.rgb.r}, ${swatch.rgb.g}, ${swatch.rgb.b})`;
            const copied = isCopied(swatch.hex);

            return (
              <div
                key={swatch.hex + idx}
                ref={(el) => (swatchItemsRef.current[idx] = el)}
                onClick={(e) => handleSwatchCopy(swatch.hex, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '9px 12px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.borderColor = 'var(--accent-apple-blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                }}
                title={`Click to copy ${swatch.hex}`}
              >
                {/* Color Pill */}
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: swatch.hex,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.06)',
                  flexShrink: 0
                }} />

                {/* Info Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {swatch.name}
                    </span>
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase'
                    }}>
                      {swatch.role || `Stop ${idx + 1}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}>
                      {swatch.hex}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--text-secondary)'
                    }}>
                      {rgbStr}
                    </span>
                  </div>
                </div>

                {/* Copy Status Icon */}
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: copied ? 'rgba(52, 199, 89, 0.15)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: copied ? '#34C759' : 'var(--text-tertiary)',
                  flexShrink: 0
                }}>
                  {copied ? <Check size={14} /> : <Copy size={13} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '10px',
          marginTop: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
            Tap any swatch to copy HEX
          </span>
          <button
            onClick={handleToggle}
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--accent-apple-blue)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <span>Close Cover</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* 
        FRONT COVER (Rotates open on left edge)
        transformOrigin: 'left center'
        Transforms with GSAP on click and lifts with soft shadow on hover
      */}
      <div
        ref={coverRef}
        onClick={handleToggle}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '20px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
          transformOrigin: 'left center', // Rotate like a real book cover!
          transformStyle: 'preserve-3d',
          zIndex: 10,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.transform = 'translateY(-6px) scale(1.015)';
            e.currentTarget.style.boxShadow = '0 24px 50px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.06)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)';
          }
        }}
      >
        {/* Book Spine Crease Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '18px',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.06) 60%, transparent 100%)',
          zIndex: 25,
          pointerEvents: 'none'
        }} />

        {/* Top Gradient Hero Cover */}
        <div style={{
          height: '56%',
          background: booklet.coverGradient,
          position: 'relative',
          padding: '24px 20px 24px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#FFFFFF'
        }}>
          {/* Subtle Edition Tag */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              background: 'rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(10px)',
              padding: '4px 10px',
              borderRadius: '9999px'
            }}>
              {booklet.subtitle.split('•')[0] || 'EDITION'}
            </span>
            <BookOpen size={16} opacity={0.85} />
          </div>

          {/* Spine Title */}
          <div>
            <h3 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              margin: '0 0 6px 0',
              textShadow: '0 2px 8px rgba(0,0,0,0.35)'
            }}>
              {booklet.title}
            </h3>
            <span style={{
              fontSize: '0.72rem',
              opacity: 0.9,
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              {booklet.swatches.length} Swatch Pages • Tap to Open
            </span>
          </div>
        </div>

        {/* 
          COLOR STRIP (Spine / Horizontal Bar on Cover)
          Shows all colors in sequence across the cover
        */}
        <div style={{
          height: '14px',
          display: 'flex',
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 15
        }}>
          {booklet.colorStrip.map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: c
              }}
            />
          ))}
        </div>

        {/* Bottom White Cover Area */}
        <div style={{
          flex: 1,
          backgroundColor: 'var(--bg-secondary)',
          padding: '22px 20px 22px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'block',
              marginBottom: '4px'
            }}>
              Colorway Collection
            </span>
            <p style={{
              fontSize: '0.84rem',
              color: 'var(--text-primary)',
              lineHeight: 1.45,
              margin: 0,
              fontWeight: 500
            }}>
              {booklet.subtitle}
            </p>
          </div>

          {/* Action indicator button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--accent-apple-blue)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>Open Swatches</span>
              <ChevronRight size={14} />
            </span>

            <span style={{
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)'
            }}>
              HEX • RGB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
