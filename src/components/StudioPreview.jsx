import React, { useState } from 'react';
import { Smartphone, Monitor, ShoppingBag, Layers, Play, Check, Copy } from 'lucide-react';
import { CURATED_PALETTES, PREMIUM_GRADIENTS } from '../data/colorCatalog';
import OptionWheelDemo from './ui/option-wheel-demo';

export default function StudioPreview({ activePalette, onCopy, copiedHex }) {
  const [deviceView, setDeviceView] = useState('mobile'); // 'mobile' | 'desktop'
  const [selectedTheme, setSelectedTheme] = useState(CURATED_PALETTES[0]);

  const p = selectedTheme.colors;
  const cSurface = p[0]?.hex || '#0D0E15';
  const cPrimary = p[1]?.hex || '#1E2235';
  const cIndigo = p[2]?.hex || '#4F46E5';
  const cAccent = p[3]?.hex || '#38BDF8';
  const cLight = p[4]?.hex || '#F8FAFC';

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
          Real-World Simulation
        </span>
        <h1 style={{
          fontSize: '2.6rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginBottom: '14px'
        }}>
          Studio Live Canvas: Test on Real UI
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          Colors behave differently in isolation versus inside an interface. Test your schemes instantly on simulated Apple iOS and macOS mockups.
        </p>
      </div>

      {/* Control bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Preset Selector */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {CURATED_PALETTES.map((pal) => (
            <button
              key={pal.id}
              onClick={() => setSelectedTheme(pal)}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: selectedTheme.id === pal.id ? 700 : 500,
                background: selectedTheme.id === pal.id ? 'var(--text-primary)' : 'var(--bg-secondary)',
                color: selectedTheme.id === pal.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                whiteSpace: 'nowrap'
              }}
            >
              {pal.title}
            </button>
          ))}
        </div>

        {/* Device toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-subtle)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => setDeviceView('mobile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: deviceView === 'mobile' ? 600 : 500,
              background: deviceView === 'mobile' ? 'var(--bg-secondary)' : 'transparent',
              color: deviceView === 'mobile' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: deviceView === 'mobile' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Smartphone size={14} />
            <span>iPhone Frame</span>
          </button>
          <button
            onClick={() => setDeviceView('desktop')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: deviceView === 'desktop' ? 600 : 500,
              background: deviceView === 'desktop' ? 'var(--bg-secondary)' : 'transparent',
              color: deviceView === 'desktop' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: deviceView === 'desktop' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            <Monitor size={14} />
            <span>macOS Window</span>
          </button>
        </div>
      </div>

      {/* Simulator Stage */}
      <div style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '48px 24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '620px',
        overflow: 'hidden'
      }}>
        {deviceView === 'mobile' ? (
          /* Apple iPhone Frame */
          <div style={{
            width: '360px',
            borderRadius: '44px',
            background: cSurface,
            border: '8px solid #2D2D30',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3), inset 0 0 2px rgba(255,255,255,0.4)',
            overflow: 'hidden',
            color: cLight,
            fontFamily: 'var(--font-sans)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Dynamic Island */}
            <div style={{ padding: '14px 20px 0 20px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '110px',
                height: '26px',
                borderRadius: '20px',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px'
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1c1c1e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cAccent }} />
              </div>
            </div>

            {/* Simulated UI Content */}
            <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* App bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedTheme.title}
                </span>
                <span style={{ fontSize: '0.8rem', color: cAccent, fontWeight: 600 }}>Active</span>
              </div>

              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                Spatial Sound & Optical Precision.
              </h2>

              {/* Card component */}
              <div style={{
                background: cPrimary,
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div style={{
                  height: '110px',
                  borderRadius: '14px',
                  background: `linear-gradient(135deg, ${cIndigo} 0%, ${cAccent} 100%)`,
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.25)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                  </div>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0' }}>Pantone Calibrated UI</h4>
                <p style={{ fontSize: '0.78rem', opacity: 0.8, lineHeight: 1.45, margin: 0 }}>
                  Rendered in {cAccent} and {cIndigo} complementary accents.
                </p>
              </div>

              {/* Call to action button */}
              <button style={{
                background: cAccent,
                color: '#000000',
                padding: '14px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '0.92rem',
                boxShadow: `0 8px 20px ${cAccent}44`
              }}>
                Confirm Interaction
              </button>
            </div>
          </div>
        ) : (
          /* macOS App Window Frame */
          <div style={{
            width: '840px',
            maxWidth: '100%',
            borderRadius: '16px',
            background: cSurface,
            boxShadow: '0 30px 90px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            color: cLight
          }}>
            {/* Window title bar */}
            <div style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              background: 'rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F56' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27C93F' }} />
              </div>
              <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 500, margin: '0 auto' }}>
                Studio Dashboard — {selectedTheme.title}
              </span>
            </div>

            {/* macOS Body */}
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '380px' }}>
              {/* Sidebar */}
              <div style={{
                background: 'rgba(0,0,0,0.15)',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                padding: '20px'
              }}>
                <span style={{ fontSize: '0.72rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>Workspace</span>
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', background: `${cAccent}22`, color: cAccent, fontSize: '0.82rem', fontWeight: 600 }}>
                    Overview
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', opacity: 0.7, fontSize: '0.82rem' }}>
                    Asset Library
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: '8px', opacity: 0.7, fontSize: '0.82rem' }}>
                    Pantone Palettes
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Design System Metrics</h3>
                    <p style={{ fontSize: '0.82rem', opacity: 0.7, margin: '4px 0 0 0' }}>Live contrast verified on macOS retina display.</p>
                  </div>
                  <button style={{
                    background: cAccent,
                    color: '#000000',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700
                  }}>
                    Export Theme
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {selectedTheme.colors.slice(0, 3).map((col, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: cPrimary,
                        padding: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: col.hex, marginBottom: '10px' }} />
                      <div style={{ fontSize: '0.72rem', opacity: 0.6 }}>{col.role}</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{col.name}</div>
                      <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', opacity: 0.8 }}>{col.hex}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive 3D Option Wheel Playground Section */}
      <div style={{
        marginTop: '60px',
        padding: '36px',
        borderRadius: '24px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent-apple-blue)',
            display: 'inline-block',
            marginBottom: '6px'
          }}>
            Physics-Based Kinetic UI
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.03em' }}>
            Interactive Option Wheel Component
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, maxWidth: '600px', margin: '0 auto' }}>
            Drag vertically, scroll your mouse wheel, or use arrow keys to spin the 3D cylindrical option wheel.
          </p>
        </div>

        <OptionWheelDemo />
      </div>
    </div>
  );
}
