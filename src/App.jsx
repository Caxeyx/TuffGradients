import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import HomeView from './components/HomeView';
import ColorHuntBrowser from './components/ColorHuntBrowser';
import PantoneTrends from './components/PantoneTrends';
import HarmoniesView from './components/HarmoniesView';
import GradientsView from './components/GradientsView';
import StudioPreview from './components/StudioPreview';
import { PANTONE_TRENDS } from './data/colorCatalog';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isDark, setIsDark] = useState(false);
  const [baseColor, setBaseColor] = useState('#0071E3'); // Apple signature blue
  const [copiedHex, setCopiedHex] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Handle system or manual dark theme sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const triggerToast = (text) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage('');
    }, 2400);
  };

  const handleCopy = (text, type = 'HEX') => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    triggerToast(`Copied ${type}: ${text.length > 25 ? text.substring(0, 22) + '...' : text}`);
    
    // Subtle Apple-like sparkle
    try {
      confetti({
        particleCount: 22,
        spread: 45,
        origin: { y: 0.85 },
        colors: ['#0071E3', '#AF52DE', '#FFBE98', '#34C759']
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setCopiedHex('');
    }, 2000);
  };

  const handleSelectColorFromTrend = (hex) => {
    setBaseColor(hex);
    setActiveTab('harmonies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomizeMood = () => {
    const randomIndex = Math.floor(Math.random() * PANTONE_TRENDS.length);
    const chosen = PANTONE_TRENDS[randomIndex];
    setBaseColor(chosen.hex);
    triggerToast(`Generated Mood: ${chosen.name} (${chosen.pantone})`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Apple Frosted Glass Header (hidden on home page for pure minimal whole screen experience) */}
      {activeTab !== 'home' && (
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isDark={isDark}
          setIsDark={setIsDark}
          onRandomize={handleRandomizeMood}
        />
      )}

      {/* Main View Area with Framer Motion Page Transitions */}
      <main style={{ flex: 1, position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%' }}
          >
            {activeTab === 'home' && (
              <HomeView
                setActiveTab={setActiveTab}
                onSelectColor={handleSelectColorFromTrend}
                onCopy={handleCopy}
                copiedHex={copiedHex}
              />
            )}

            {activeTab === 'explore-hunt' && (
              <ColorHuntBrowser
                onSelectColor={handleSelectColorFromTrend}
                onCopy={handleCopy}
                copiedHex={copiedHex}
              />
            )}

            {activeTab === 'pantone-trends' && (
              <PantoneTrends
                onSelectColor={handleSelectColorFromTrend}
                onCopy={handleCopy}
                copiedHex={copiedHex}
              />
            )}

            {activeTab === 'harmonies' && (
              <HarmoniesView
                baseColor={baseColor}
                setBaseColor={setBaseColor}
                onCopy={handleCopy}
                copiedHex={copiedHex}
              />
            )}

            {activeTab === 'gradients' && (
              <GradientsView
                onCopy={handleCopy}
                copiedHex={copiedHex}
              />
            )}

            {activeTab === 'studio-preview' && (
              <StudioPreview
                activePalette={baseColor}
                onCopy={handleCopy}
                copiedHex={copiedHex}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Apple-grade Minimal Footer (Hidden on home page for pure whole screen experience) */}
      {activeTab !== 'home' && (
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '36px 24px',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          fontSize: '0.84rem'
        }}>
          <div style={{ maxWidth: '1360px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>AURA Color & Gradient System</span>
              <span>• Inspired by Color Hunt simplicity with Apple craft</span>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Pantone® TCX Standard</span>
              <span>WCAG 2.1 AAA Contrast</span>
              <span>CSS3 / Tailwind / Figma Tokens</span>
            </div>
          </div>
        </footer>
      )}

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="toast-pill">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
