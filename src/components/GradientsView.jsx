import React, { useState, useRef } from 'react';
import { Copy, Check, Sparkles, Sliders, Layers, Plus, Trash2, Crown, Upload, FileUp, AlertCircle, Zap, Search, X, BookOpen } from 'lucide-react';
import { PREMIUM_GRADIENTS } from '../data/colorCatalog';
import { getClosestPantone } from '../utils/colorEngine';
import { parseGrdArrayBuffer } from '../utils/grdParser';
import rawCaseyxPackData from '../data/caseyxGrdPack.json';
import Booklet from './Booklet';
import { BOOKLETS } from '../data/bookletData';

// Unify CaseyX Pack as the official Casey's Choice collection
const CASEYS_CHOICE_FULL = rawCaseyxPackData.map(g => ({
  ...g,
  badge: "Casey's Choice",
  category: "Casey's Choice"
}));

export default function GradientsView({ onCopy, copiedHex }) {
  const [activeCategory, setActiveCategory] = useState("Casey's Choice (268)");
  const [importedGradients, setImportedGradients] = useState([]);
  const [searchGrdQuery, setSearchGrdQuery] = useState('');
  const [isParsingGrd, setIsParsingGrd] = useState(false);
  const [grdStatus, setGrdStatus] = useState('');
  const fileInputRef = useRef(null);
  
  // Custom Live Gradient Studio state
  const [customAngle, setCustomAngle] = useState(135);
  const [customType, setCustomType] = useState('linear');
  const [gradientStops, setGradientStops] = useState(
    CASEYS_CHOICE_FULL[3]?.stops || [
      { color: '#1B003A', position: 0 },
      { color: '#7928CA', position: 38 },
      { color: '#FF0080', position: 72 },
      { color: '#00F0FF', position: 100 }
    ]
  );

  const categories = [
    "Casey's Choice (268)", 
    'All', 
    ...(importedGradients.length > 0 ? ['Imported .GRD'] : []),
    'aurora', 
    'sunset', 
    'apple-mesh', 
    'titanium', 
    'zenith', 
    'cosmic'
  ];

  const allCombinedGradients = [...CASEYS_CHOICE_FULL, ...importedGradients, ...PREMIUM_GRADIENTS];

  const baseGradients = activeCategory === "Casey's Choice (268)"
    ? CASEYS_CHOICE_FULL
    : activeCategory === 'Imported .GRD'
    ? importedGradients
    : activeCategory === 'All'
    ? allCombinedGradients
    : allCombinedGradients.filter(g => g.category === activeCategory);

  // Filter by search query if any
  const filteredGradients = baseGradients.filter(g => {
    if (!searchGrdQuery) return true;
    const q = searchGrdQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.subtitle && g.subtitle.toLowerCase().includes(q)) ||
      g.stops.some(s => s.color.toLowerCase().includes(q))
    );
  });

  // Generate CSS string for a gradient
  const buildCssGradient = (type, angle, stops) => {
    const stopsString = stops.map(s => `${s.color} ${s.position}%`).join(', ');
    if (type === 'radial') {
      return `radial-gradient(circle at center, ${stopsString})`;
    }
    if (type === 'conic') {
      return `conic-gradient(from ${angle}deg at 50% 50%, ${stopsString})`;
    }
    return `linear-gradient(${angle}deg, ${stopsString})`;
  };

  const customCss = buildCssGradient(customType, customAngle, gradientStops);

  const handleUpdateStopColor = (index, newColor) => {
    const next = [...gradientStops];
    next[index].color = newColor;
    setGradientStops(next);
  };

  const handleUpdateStopPos = (index, newPos) => {
    const next = [...gradientStops];
    next[index].position = Number(newPos);
    setGradientStops(next);
  };

  const addStop = () => {
    if (gradientStops.length >= 5) return;
    setGradientStops([...gradientStops, { color: '#00F0FF', position: 80 }]);
  };

  const removeStop = (index) => {
    if (gradientStops.length <= 2) return;
    setGradientStops(gradientStops.filter((_, i) => i !== index));
  };

  // Handle uploading and parsing Photoshop .GRD binary files
  const handleGrdFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingGrd(true);
    setGrdStatus(`Reading ${file.name}...`);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const extracted = parseGrdArrayBuffer(arrayBuffer);

      if (extracted && extracted.length > 0) {
        setImportedGradients(prev => [...extracted, ...prev]);
        setActiveCategory('Imported .GRD');
        setGrdStatus(`Successfully imported ${extracted.length} gradient(s) from "${file.name}"!`);
        
        const first = extracted[0];
        setCustomAngle(first.angle || 135);
        setCustomType(first.type || 'linear');
        setGradientStops(first.stops.map(s => ({ color: s.color, position: s.position })));
      } else {
        setGrdStatus(`No recognized gradient color stops found in "${file.name}".`);
      }
    } catch (err) {
      console.error('Error parsing .GRD file:', err);
      setGrdStatus(`Failed to parse "${file.name}". Ensure it is a valid Photoshop .GRD preset.`);
    } finally {
      setIsParsingGrd(false);
      setTimeout(() => setGrdStatus(''), 6000);
    }
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '36px 24px' }}>
      {/* Apple Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px', maxWidth: '780px', margin: '0 auto 36px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 45, 85, 0.1)',
          border: '1px solid rgba(255, 45, 85, 0.25)',
          padding: '4px 14px',
          borderRadius: 'var(--radius-full)',
          marginBottom: '10px'
        }}>
          <Crown size={14} color="#FF2D55" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FF2D55', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Casey's Choice Curations
          </span>
        </div>

        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1.15,
          color: 'var(--text-primary)',
          marginBottom: '14px'
        }}>
          Casey's Choice & Premium Gradients.
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6
        }}>
          Casey's complete collection of 268 signature gradients decoded from the official Photoshop GRD map pack, with real-time CSS conversion and live studio tuning.
        </p>
      </div>

      {/* Featured Banner: Casey's Choice Spotlight Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(121, 40, 202, 0.08) 0%, rgba(255, 0, 128, 0.08) 100%)',
        border: '1px solid rgba(255, 45, 85, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 30px rgba(255, 45, 85, 0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #1B003A 0%, #7928CA 40%, #FF0080 75%, #00F0FF 100%)',
            boxShadow: '0 8px 24px rgba(255, 0, 128, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Crown size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>Casey's Choice Section</h2>
              <span style={{
                background: '#FF2D55',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>268 Gradients Active</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Featuring your full CASEYXLIVE gradient collection (Fire, Blood, Toxic, B&W, and vibrant mesh tones) ready for web, UI, and graphics.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveCategory("Casey's Choice (268)");
            const fire = CASEYS_CHOICE_FULL[3] || CASEYS_CHOICE_FULL[0];
            setCustomAngle(fire.angle || 135);
            setCustomType(fire.type || 'linear');
            setGradientStops(fire.stops.map(s => ({ color: s.color, position: s.position })));
            window.scrollTo({ top: 380, behavior: 'smooth' });
          }}
          style={{
            padding: '10px 22px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--text-primary)',
            color: 'var(--bg-primary)',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Sparkles size={15} color="#FF2D55" />
          <span>Load Casey's Favorite (FIRE 1)</span>
        </button>
      </div>

      {/* Interactive Gradient Swatch Booklets Section */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '8px',
                background: 'rgba(0, 113, 227, 0.12)',
                color: '#0071E3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BookOpen size={15} />
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Gradient Swatch Booklets
              </h2>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              Physical-style edition booklets. Hover to lift, click to swing the cover open with 3D GSAP animation, and tap any swatch page to copy its HEX.
            </p>
          </div>

          <span style={{
            fontSize: '0.74rem',
            fontWeight: 700,
            color: 'var(--text-secondary)',
            background: 'var(--bg-subtle)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            {BOOKLETS.length} Curated Editions • Extensible in <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-apple-blue)' }}>bookletData.js</code>
          </span>
        </div>

        {/* Booklets Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px',
          padding: '12px 0 24px 0'
        }}>
          {BOOKLETS.map((booklet) => (
            <Booklet
              key={booklet.id}
              booklet={booklet}
              onCopy={onCopy}
              copiedHex={copiedHex}
            />
          ))}
        </div>
      </section>

      {/* Photoshop .GRD File Import Dropzone */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px dashed var(--border-focus)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 28px',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileUp size={20} color="var(--accent-apple-blue)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
              Import More Photoshop .GRD Presets
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>
              Want to decode another <code>.GRD</code> file? Drop it here to parse into the live canvas.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="file"
            ref={fileInputRef}
            accept=".grd"
            onChange={handleGrdFileUpload}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isParsingGrd}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--accent-apple-blue)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px var(--accent-glow)'
            }}
          >
            <Upload size={14} />
            <span>{isParsingGrd ? 'Parsing...' : 'Upload .GRD File'}</span>
          </button>
        </div>

        {grdStatus && (
          <div style={{
            width: '100%',
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'var(--bg-subtle)',
            fontSize: '0.82rem',
            color: 'var(--accent-apple-blue)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Sparkles size={14} />
            <span>{grdStatus}</span>
          </div>
        )}
      </div>

      {/* Featured Interactive Studio Canvas */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        marginBottom: '48px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '36px',
        boxShadow: 'var(--shadow-md)'
      }}>
        {/* Left: Giant Live Fluid Screen */}
        <div style={{
          borderRadius: 'var(--radius-md)',
          background: customCss,
          minHeight: '340px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 25px 50px rgba(0,0,0,0.18)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              background: 'rgba(0,0,0,0.45)',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 600,
              backdropFilter: 'blur(10px)'
            }}>
              {customType.toUpperCase()} • {customAngle}°
            </span>

            <button
              onClick={() => onCopy(`background: ${customCss};`, 'CSS')}
              style={{
                background: 'rgba(255,255,255,0.92)',
                color: '#000000',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '7px 16px',
                fontSize: '0.82rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              {copiedHex.includes('background') ? <Check size={14} color="#34C759" /> : <Copy size={14} />}
              <span>Copy CSS</span>
            </button>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            color: '#ffffff'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0' }}>Live Custom Studio</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.85, fontFamily: 'var(--font-mono)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              background: {customCss}
            </p>
          </div>
        </div>

        {/* Right: Studio Gradient Fine-Tuning Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
              <Sliders size={18} color="var(--accent-apple-blue)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
                Gradient Geometry & Color Stops
              </span>
            </div>

            {/* Angle Slider + Type Picker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Angle</label>
                  <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{customAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={customAngle}
                  onChange={(e) => setCustomAngle(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-apple-blue)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Gradient Style</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['linear', 'radial', 'conic'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setCustomType(t)}
                      style={{
                        flex: 1,
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: customType === t ? 'var(--accent-apple-blue)' : 'var(--bg-subtle)',
                        color: customType === t ? '#ffffff' : 'var(--text-secondary)',
                        textTransform: 'capitalize'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Color Stops Editor */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Color Stops ({gradientStops.length})</span>
                {gradientStops.length < 8 && (
                  <button
                    onClick={addStop}
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--accent-apple-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={13} /> Add Stop
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                {gradientStops.map((stop, i) => {
                  const pMatch = getClosestPantone(stop.color);
                  return (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--bg-subtle)',
                        padding: '6px 10px',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <input
                        type="color"
                        value={stop.color}
                        onChange={(e) => handleUpdateStopColor(i, e.target.value)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                      />

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                            {stop.color.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                            {stop.position}%
                          </span>
                        </div>
                        <span style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>
                          {pMatch.pantone}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) => handleUpdateStopPos(i, e.target.value)}
                        style={{ width: '70px', accentColor: 'var(--accent-apple-blue)' }}
                      />

                      {gradientStops.length > 2 && (
                        <button
                          onClick={() => removeStop(i)}
                          style={{ color: '#FF3B30', padding: '2px' }}
                          title="Remove stop"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick preset loader */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', alignSelf: 'center' }}>Quick Picks:</span>
            {CASEYS_CHOICE_FULL.slice(3, 7).map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setCustomAngle(g.angle);
                  setCustomType(g.type);
                  setGradientStops(g.stops.map(s => ({ color: s.color, position: s.position })));
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 45, 85, 0.1)',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#FF2D55'
                }}
              >
                {g.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '26px'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map((c) => {
            const isSelected = activeCategory === c;
            const isCasey = c.startsWith("Casey's Choice");
            const isImported = c === 'Imported .GRD';
            return (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.84rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected 
                    ? (isCasey ? '#FF2D55' : isImported ? 'var(--accent-apple-blue)' : 'var(--text-primary)') 
                    : (isCasey ? 'rgba(255, 45, 85, 0.1)' : 'var(--bg-secondary)'),
                  color: isSelected ? '#ffffff' : (isCasey ? '#FF2D55' : 'var(--text-secondary)'),
                  border: isSelected ? 'none' : (isCasey ? '1px solid rgba(255, 45, 85, 0.3)' : '1px solid var(--border-subtle)'),
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                {isCasey && <Crown size={14} />}
                {isImported && <FileUp size={14} />}
                <span>{c}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input for Gradients */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search gradients (Fire, Toxic...)"
            value={searchGrdQuery}
            onChange={(e) => setSearchGrdQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 32px 8px 36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          {searchGrdQuery && (
            <button
              onClick={() => setSearchGrdQuery('')}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Catalog of Designer Gradients */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '26px'
      }}>
        {filteredGradients.map((item) => {
          const cssGrad = buildCssGradient(item.type, item.angle, item.stops);
          const isCaseyGrad = item.badge === "Casey's Choice" || item.category === "Casey's Choice";
          const isImported = item.category === 'imported';

          return (
            <div
              key={item.id}
              className="apple-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: isCaseyGrad ? '1px solid rgba(255, 45, 85, 0.35)' : isImported ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
                boxShadow: isCaseyGrad ? '0 10px 30px rgba(255, 45, 85, 0.08)' : 'var(--shadow-sm)'
              }}
            >
              {/* Visual preview */}
              <div
                style={{
                  height: '190px',
                  background: cssGrad,
                  position: 'relative',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {isCaseyGrad && (
                    <span style={{
                      background: '#FF2D55',
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}>
                      <Crown size={11} /> CASEY'S CHOICE
                    </span>
                  )}

                  {isImported && (
                    <span style={{
                      background: 'var(--accent-apple-blue)',
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FileUp size={11} /> PHOTOSHOP .GRD
                    </span>
                  )}

                  <span style={{
                    background: 'rgba(0,0,0,0.5)',
                    color: '#ffffff',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backdropFilter: 'blur(8px)'
                  }}>
                    {item.angle}° {item.type}
                  </span>
                </div>

                <button
                  onClick={() => onCopy(`background: ${cssGrad};`, 'CSS')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255,255,255,0.92)',
                    color: '#000000',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                >
                  <Copy size={12} />
                  <span>Copy CSS</span>
                </button>
              </div>

              {/* Card Meta */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.22rem', fontWeight: 800, margin: '0 0 4px 0' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '14px' }}>
                    {item.subtitle}
                  </p>
                </div>

                {/* Pantone stops indicator */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                    Color Stops ({item.stops.length}):
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.stops.map((s, i) => (
                      <div
                        key={i}
                        onClick={() => onCopy(s.color, 'HEX')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'var(--bg-subtle)',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title={`Click to copy ${s.color}`}
                      >
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: s.color }} />
                        <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{s.color}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{s.position}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Load to editor button */}
                <button
                  onClick={() => {
                    setCustomAngle(item.angle);
                    setCustomType(item.type);
                    setGradientStops(item.stops.map(s => ({ color: s.color, position: s.position })));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  style={{
                    marginTop: '16px',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: isCaseyGrad ? 'rgba(255, 45, 85, 0.1)' : 'var(--bg-subtle)',
                    color: isCaseyGrad ? '#FF2D55' : 'var(--text-primary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'center'
                  }}
                >
                  Tune in Studio Canvas ↑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
