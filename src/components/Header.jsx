import React from 'react';
import { Sparkles, Layers, Sliders, Palette, Moon, Sun, Compass } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, isDark, setIsDark, onRandomize }) {
  const navItems = [
    { id: 'home', label: 'Overview', icon: Sparkles },
    { id: 'explore-hunt', label: 'Explore Palettes', icon: Compass },
    { id: 'pantone-trends', label: 'Pantone & Trends', icon: Palette },
    { id: 'harmonies', label: 'Harmonies', icon: Layers },
    { id: 'gradients', label: "Casey's Gradients", icon: Layers },
    { id: 'studio-preview', label: 'Studio Canvas', icon: Sliders }
  ];

  return (
    <header className="sticky top-0 z-50 apple-glass" style={{
      position: 'sticky',
      top: 0,
      width: '100%',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('explore-hunt')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '11px',
            background: 'linear-gradient(135deg, #FFBE98 0%, #AF52DE 50%, #0071E3 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 113, 227, 0.3)'
          }}>
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.22rem', fontWeight: 700, letterSpacing: '-0.03em' }}>AURA</span>
              <span style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: '9999px',
                background: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em'
              }}>Studio 2026</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, marginTop: '-2px' }}>
              Pantone Precision & Apple UI Harmonies
            </p>
          </div>
        </div>

        {/* Apple Segmented Navigation Pill */}
        <nav 
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-subtle)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)',
            maxWidth: '100%',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-secondary)' : 'transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                <Icon size={15} style={{ opacity: isActive ? 1 : 0.7 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions: Randomize + Dark Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={onRandomize}
            title="Surprise me with a fresh curated harmony"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--text-tertiary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
          >
            <Sparkles size={14} color="#0071E3" />
            <span>Generate Mood</span>
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              transition: 'all 0.2s ease'
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
