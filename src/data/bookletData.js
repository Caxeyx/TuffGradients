/**
 * bookletData.js
 * 
 * Curated gradient booklets and color collections.
 * You can easily add your own gradient booklets here!
 * 
 * Each booklet contains:
 * - id: unique identifier string
 * - title: display title on booklet cover
 * - subtitle: short description / edition info
 * - coverGradient: CSS gradient string for the front cover styling
 * - colorStrip: array of hex colors displayed as a preview spine/strip on the cover
 * - swatches: array of color swatch pages { name, hex, rgb: { r, g, b }, role, stopPosition }
 */

export const BOOKLETS = [
  {
    id: 'caseyx-supernova',
    title: "Casey's Supernova",
    subtitle: "Edition 01 • Hyper-Vibrant Spectrum",
    coverGradient: "linear-gradient(145deg, #18002E 0%, #7928CA 45%, #FF0080 80%, #00F0FF 100%)",
    colorStrip: ['#18002E', '#7928CA', '#FF0080', '#FF7A00', '#00F0FF'],
    swatches: [
      { name: 'Abyssal Violet', hex: '#18002E', rgb: { r: 24, g: 0, b: 46 }, role: 'Deep Base' },
      { name: 'Electric Orchid', hex: '#7928CA', rgb: { r: 121, g: 40, b: 202 }, role: 'Core Midtone' },
      { name: 'Neon Magenta', hex: '#FF0080', rgb: { r: 255, g: 0, b: 128 }, role: 'Vibrant Accent' },
      { name: 'Hyper Tangerine', hex: '#FF7A00', rgb: { r: 255, g: 122, b: 0 }, role: 'Warm Transition' },
      { name: 'Cyber Cyan', hex: '#00F0FF', rgb: { r: 0, g: 240, b: 255 }, role: 'High Peak' }
    ]
  },
  {
    id: 'apple-silicon-titanium',
    title: 'Titanium Luminescence',
    subtitle: 'Edition 02 • Apple Industrial Materials',
    coverGradient: 'linear-gradient(145deg, #1C1D21 0%, #3A3B40 40%, #8E8E93 75%, #E5D0BA 100%)',
    colorStrip: ['#1C1D21', '#3A3B40', '#636366', '#8E8E93', '#E5D0BA'],
    swatches: [
      { name: 'Space Black', hex: '#1C1D21', rgb: { r: 28, g: 29, b: 33 }, role: 'Shadow Texture' },
      { name: 'Graphite Shadow', hex: '#3A3B40', rgb: { r: 58, g: 59, b: 64 }, role: 'Anodized Steel' },
      { name: 'Natural Slate', hex: '#636366', rgb: { r: 99, g: 99, b: 102 }, role: 'Brushed Core' },
      { name: 'Titanium Gray', hex: '#8E8E93', rgb: { r: 142, g: 142, b: 147 }, role: 'Specular Luster' },
      { name: 'Desert Gold Sheen', hex: '#E5D0BA', rgb: { r: 229, g: 208, b: 186 }, role: 'Warm Specular' }
    ]
  },
  {
    id: 'aurora-borealis-nordic',
    title: 'Nordic Aurora',
    subtitle: 'Edition 03 • Atmospheric Midnight',
    coverGradient: 'linear-gradient(145deg, #051923 0%, #003554 35%, #006466 65%, #06D6A0 100%)',
    colorStrip: ['#051923', '#003554', '#006466', '#06D6A0', '#48CAE4'],
    swatches: [
      { name: 'Arctic Night', hex: '#051923', rgb: { r: 5, g: 25, b: 35 }, role: 'Deep Sky' },
      { name: 'Deep Fjord', hex: '#003554', rgb: { r: 0, g: 53, b: 84 }, role: 'Horizon Blue' },
      { name: 'Boreal Pine', hex: '#006466', rgb: { r: 0, g: 100, b: 102 }, role: 'Emerald Filter' },
      { name: 'Aurora Plasma', hex: '#06D6A0', rgb: { r: 6, g: 214, b: 160 }, role: 'Ion Glow' },
      { name: 'Glacial Cyan', hex: '#48CAE4', rgb: { r: 72, g: 202, b: 228 }, role: 'Crown Light' }
    ]
  },
  {
    id: 'sol-california-sunset',
    title: 'Pacific Golden Hour',
    subtitle: 'Edition 04 • Horizon Dusk & Warmth',
    coverGradient: 'linear-gradient(145deg, #2B0938 0%, #7B1E58 35%, #D44D5C 65%, #F5B041 100%)',
    colorStrip: ['#2B0938', '#7B1E58', '#D44D5C', '#F57B51', '#F5B041'],
    swatches: [
      { name: 'Twilight Velvet', hex: '#2B0938', rgb: { r: 43, g: 9, b: 56 }, role: 'Sky Fall' },
      { name: 'Berry Twilight', hex: '#7B1E58', rgb: { r: 123, g: 30, b: 88 }, role: 'Atmosphere' },
      { name: 'Coral Flare', hex: '#D44D5C', rgb: { r: 212, g: 77, b: 92 }, role: 'Horizon Fire' },
      { name: 'Golden Apricot', hex: '#F57B51', rgb: { r: 245, g: 123, b: 81 }, role: 'Sun Flare' },
      { name: 'Pacific Glow', hex: '#F5B041', rgb: { r: 245, g: 176, b: 65 }, role: 'Warm Ember' }
    ]
  },
  {
    id: 'tokyo-neon-cyber',
    title: 'Shibuya Nightfall',
    subtitle: 'Edition 05 • Electric Cyberpunk Bloom',
    coverGradient: 'linear-gradient(145deg, #090A0F 0%, #200052 35%, #8B008B 70%, #00FFCC 100%)',
    colorStrip: ['#090A0F', '#200052', '#8B008B', '#FF0055', '#00FFCC'],
    swatches: [
      { name: 'Void Asphalt', hex: '#090A0F', rgb: { r: 9, g: 10, b: 15 }, role: 'City Shadow' },
      { name: 'Ultraviolet Alley', hex: '#200052', rgb: { r: 32, g: 0, b: 82 }, role: 'Dark Neon' },
      { name: 'Magenta Pulse', hex: '#8B008B', rgb: { r: 139, g: 0, b: 139 }, role: 'Bespoke Sign' },
      { name: 'Laser Crimson', hex: '#FF0055', rgb: { r: 255, g: 0, b: 85 }, role: 'Beacon Strike' },
      { name: 'Matrix Phosphor', hex: '#00FFCC', rgb: { r: 0, g: 255, b: 204 }, role: 'Cyber Terminal' }
    ]
  },
  {
    id: 'pantone-trend-peach-fuzz',
    title: 'Velvet Peach & Rose',
    subtitle: 'Edition 06 • Tactile Warmth Harmonizer',
    coverGradient: 'linear-gradient(145deg, #4A192C 0%, #8E3A59 40%, #E07A5F 75%, #FFBE98 100%)',
    colorStrip: ['#4A192C', '#8E3A59', '#E07A5F', '#F4A261', '#FFBE98'],
    swatches: [
      { name: 'Black Cherry Bark', hex: '#4A192C', rgb: { r: 74, g: 25, b: 44 }, role: 'Grounded Shade' },
      { name: 'Dusty Rose Bloom', hex: '#8E3A59', rgb: { r: 142, g: 58, b: 89 }, role: 'Tonal Body' },
      { name: 'Terracotta Terra', hex: '#E07A5F', rgb: { r: 224, g: 122, b: 95 }, role: 'Warm Clay' },
      { name: 'Amber Sunrise', hex: '#F4A261', rgb: { r: 244, g: 162, b: 97 }, role: 'Soft Contrast' },
      { name: 'Peach Fuzz (13-1023)', hex: '#FFBE98', rgb: { r: 255, g: 190, b: 152 }, role: 'Pantone Hero' }
    ]
  }
];
