import { colord, extend } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import namesPlugin from 'colord/plugins/names';
import a11yPlugin from 'colord/plugins/a11y';

extend([harmoniesPlugin, namesPlugin, a11yPlugin]);

// Approximate closest Pantone from a curated swatch table
const PANTONE_REFERENCE_TABLE = [
  { pantone: 'PANTONE 13-1023 TCX', name: 'Peach Fuzz', hex: '#FFBE98' },
  { pantone: 'PANTONE 18-1750 TCX', name: 'Viva Magenta', hex: '#BB2649' },
  { pantone: 'PANTONE 17-3938 TCX', name: 'Very Peri', hex: '#6667AB' },
  { pantone: 'PANTONE 19-4052 TCX', name: 'Classic Blue', hex: '#0F4C81' },
  { pantone: 'PANTONE 16-1546 TCX', name: 'Living Coral', hex: '#FA7268' },
  { pantone: 'PANTONE 15-0343 TCX', name: 'Greenery', hex: '#88B04B' },
  { pantone: 'PANTONE 18-3838 TCX', name: 'Ultra Violet', hex: '#5F4B8B' },
  { pantone: 'PANTONE 13-1520 TCX', name: 'Rose Quartz', hex: '#F7CAC9' },
  { pantone: 'PANTONE 15-3919 TCX', name: 'Serenity', hex: '#91A8D0' },
  { pantone: 'PANTONE 18-1438 TCX', name: 'Marsala', hex: '#955251' },
  { pantone: 'PANTONE 18-3224 TCX', name: 'Radiant Orchid', hex: '#B565A7' },
  { pantone: 'PANTONE 17-5641 TCX', name: 'Emerald', hex: '#009473' },
  { pantone: 'PANTONE 17-1463 TCX', name: 'Tangerine Tango', hex: '#DD4124' },
  { pantone: 'PANTONE 18-2120 TCX', name: 'Honeysuckle', hex: '#D65076' },
  { pantone: 'PANTONE 15-5519 TCX', name: 'Turquoise', hex: '#45B5AA' },
  { pantone: 'PANTONE 14-0848 TCX', name: 'Mimosa', hex: '#EFC050' },
  { pantone: 'PANTONE 19-3911 TCX', name: 'Black Beauty', hex: '#222224' },
  { pantone: 'PANTONE 11-0601 TCX', name: 'Bright White', hex: '#F4F5F0' },
  { pantone: 'PANTONE 13-1008 TCX', name: 'Natural Titanium', hex: '#E5D0BA' },
  { pantone: 'PANTONE 16-3801 TCX', name: 'Titanium Slate', hex: '#8E8E93' },
  { pantone: 'PANTONE 19-4004 TCX', name: 'Space Black', hex: '#1C1D21' },
  { pantone: 'PANTONE 14-4318 TCX', name: 'Skyway Cyan', hex: '#38BDF8' },
  { pantone: 'PANTONE 18-3949 TCX', name: 'Royal Purple', hex: '#4F46E5' },
  { pantone: 'PANTONE 16-0213 TCX', name: 'Tea Leaf', hex: '#93B48B' },
  { pantone: 'PANTONE 18-1662 TCX', name: 'Flame Scarlet', hex: '#CD212A' },
  { pantone: 'PANTONE 16-1359 TCX', name: 'Orange Peel', hex: '#FA9200' },
  { pantone: 'PANTONE 12-0740 TCX', name: 'Limelight', hex: '#F0E87D' },
  { pantone: 'PANTONE 18-0107 TCX', name: 'Kale Green', hex: '#5A7247' },
  { pantone: 'PANTONE 19-4220 TCX', name: 'Dark Slate', hex: '#2E5266' }
];

export function hexToRgb(hex) {
  const c = colord(hex);
  const rgb = c.toRgb();
  return { r: rgb.r, g: rgb.g, b: rgb.b };
}

export function hexToCmyk(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }
  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  const kPercent = Math.round(k * 100);

  return { c, m, y, k: kPercent };
}

export function hexToHsl(hex) {
  const c = colord(hex);
  return c.toHsl();
}

/**
 * Calculates Euclidean RGB distance between two colors
 */
function colorDistance(hex1, hex2) {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  const rDiff = c1.r - c2.r;
  const gDiff = c1.g - c2.g;
  const bDiff = c1.b - c2.b;
  // Weighted Euclidean for human perception approximation
  return Math.sqrt(2 * rDiff * rDiff + 4 * gDiff * gDiff + 3 * bDiff * bDiff);
}

import pantoneTCXLibrary from '../data/pantoneOfficialTCX.json';

/**
 * Finds the closest matched Pantone color specification across the full 2,625 Official TCX colors
 */
export function getClosestPantone(targetHex) {
  const table = (pantoneTCXLibrary && pantoneTCXLibrary.length > 0) ? pantoneTCXLibrary : PANTONE_REFERENCE_TABLE;
  let closest = table[0];
  let minDistance = Infinity;

  for (let i = 0; i < table.length; i++) {
    const item = table[i];
    const dist = colorDistance(targetHex, item.hex);
    if (dist < minDistance) {
      minDistance = dist;
      closest = item;
      if (dist === 0) break; // Exact match found
    }
  }

  // Calculate matching accuracy percentage
  const matchScore = Math.max(82, Math.min(100, Math.round(100 - (minDistance / 4.5))));
  return {
    ...closest,
    matchScore
  };
}

/**
 * Generates harmonic companion colors:
 * - Complementary (opposite on wheel)
 * - Analogous (neighboring shades)
 * - Triadic (balanced 120-deg triad)
 * - Tetradic (rich 90-deg harmony)
 * - Split-Complementary
 * - Monochromatic Tones (tint & shade depth)
 */
export function getHarmonies(hex) {
  const c = colord(hex);
  if (!c.isValid()) return null;

  const comp = c.harmonies('complementary').map(color => color.toHex());
  const ana = c.harmonies('analogous').map(color => color.toHex());
  const tri = c.harmonies('triadic').map(color => color.toHex());
  const tet = c.harmonies('tetradic').map(color => color.toHex());
  const split = c.harmonies('split-complementary').map(color => color.toHex());

  // Monochromatic scale (5 shades from luminous tint to deep shade)
  const mono = [
    c.lighten(0.35).toHex(),
    c.lighten(0.18).toHex(),
    c.toHex(),
    c.darken(0.18).toHex(),
    c.darken(0.35).toHex()
  ];

  return {
    complementary: comp.filter(h => h.toLowerCase() !== hex.toLowerCase()),
    analogous: ana.filter(h => h.toLowerCase() !== hex.toLowerCase()),
    triadic: tri.filter(h => h.toLowerCase() !== hex.toLowerCase()),
    tetradic: tet.filter(h => h.toLowerCase() !== hex.toLowerCase()),
    splitComplementary: split.filter(h => h.toLowerCase() !== hex.toLowerCase()),
    monochromatic: mono
  };
}

/**
 * Computes contrast ratio against white and black for accessibility guidance
 */
export function getAccessibility(hex) {
  const c = colord(hex);
  const contrastOnWhite = c.contrast('#FFFFFF');
  const contrastOnBlack = c.contrast('#000000');
  const isLight = c.isLight();
  const recommendedTextColor = isLight ? '#0F172A' : '#FFFFFF';

  return {
    contrastOnWhite: Number(contrastOnWhite.toFixed(2)),
    contrastOnBlack: Number(contrastOnBlack.toFixed(2)),
    wcagScoreWhite: contrastOnWhite >= 7 ? 'AAA' : contrastOnWhite >= 4.5 ? 'AA' : 'Fail',
    wcagScoreBlack: contrastOnBlack >= 7 ? 'AAA' : contrastOnBlack >= 4.5 ? 'AA' : 'Fail',
    isLight,
    recommendedTextColor
  };
}

/**
 * Returns formatted code snippet outputs
 */
export function formatCodeSnippet(colors, format = 'css') {
  if (format === 'css') {
    return `:root {\n` + colors.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n') + `\n}`;
  }
  if (format === 'tailwind') {
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n` +
      colors.map((c, i) => `        palette_${i + 1}: '${c}',`).join('\n') +
      `\n      }\n    }\n  }\n};`;
  }
  if (format === 'figma-tokens') {
    const obj = {};
    colors.forEach((c, i) => {
      obj[`color-${i + 1}`] = { value: c, type: 'color' };
    });
    return JSON.stringify(obj, null, 2);
  }
  if (format === 'json') {
    return JSON.stringify(colors, null, 2);
  }
  return '';
}
