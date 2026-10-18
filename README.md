# 🎨 TuffGradients — AURA Studio
### Apple-Grade Pantone Color System & Tactile 3D Shade Deck

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![Pantone](https://img.shields.io/badge/Pantone-6%2C083%20Colors-E03C31?style=for-the-badge)](https://www.pantone.com/)

**TuffGradients (AURA Studio)** is a high-performance web experience that pairs an analog **Pantone Swatch Shade Book & Fan Deck** with the full digital database of **6,083 official global Pantone standards**, interactive color harmony generation, and multi-stop gradient maps.

---

## 🌟 Key Highlights

### 1. 🎴 Full-Screen 3D Interactive Shade Deck
- **Radial Ray Expansion:** Opens from a closed physical standing deck into a panoramic radial fan fanned out edge-to-edge.
- **Metallic Screw Rivet Pivot:** Realistic analog fastener anchoring all cards to a true mechanical pivot center.
- **Hardware-Accelerated Rotation:** Rotate the entire fan with mouse wheel scrolling or click-and-drag.
- **Tactile Color Chips:** Inspect any chip to reveal exact CMYK formulas, RGB channels, Hex codes, and physical ink stop specifications with 1-click clipboard copy.

### 2. 📚 6,083 Official Pantone Standards
The complete Pantone color universe organized across official volumes:
| System Book | Standard Focus | Colors Available | Specs Included |
| :--- | :--- | :--- | :--- |
| **Cotton TCX** | *Fashion, Home + Interiors* | **2,625 Colors** | Cotton Swatch Dyes, RGB, CMYK, Hex |
| **Formula Guide (PMS)** | *Solid Coated* | **1,148 Colors** | Spot Ink Formulas, Pigment Mixes, CMYK |
| **Textile Standards** | *Textile & Trend System* | **2,310 Colors** | Global Textile References & Trends |
| **Casey's Gradient Maps** | *Curated Photorealistic* | **268 Maps** | Multi-stop Photoshop `.grd` parsed gradients |
| **Total Global Database** | **Complete Master Library** | **6,083 Standards** | **Instant Live Search & Discovery** |

### 3. 🔍 Universal Color Finder Drawer (`⌘K` / `Ctrl+K`)
- Slide-out search drawer available everywhere in the app.
- Instant sub-millisecond search by color name (e.g. *Classic Blue*, *Peach Fuzz*), Pantone code (e.g. *19-4052 TCX*), or Hex code.
- Quick system filter pills to jump between Cotton TCX, Solid Coated, and Textile categories.

### 4. 🎨 Color Harmonies & Palettes
- Interactive palette generator supporting **Complementary**, **Analogous**, **Triadic**, **Tetradic**, and **Split-Complementary** color algorithms.
- Color Hunt-style palette browser with curated palettes and instant hex copy.
- Studio Canvas preview to test color combinations against typography, mock interfaces, and glassmorphic cards.

---

## 🛠 Tech Stack

- **Framework:** React 19 + Vite 8
- **Animation Engine:** GSAP (GreenSock) for 60fps radial fanning and rotational interpolation
- **Icons:** Lucide React
- **Styling:** Modern Vanilla CSS + Apple design tokens (glassmorphism, SF typography, neutral grays)
- **Data Engine:** Custom color conversion utilities (RGB ↔ Hex ↔ CMYK ↔ Closest Pantone standard)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer)
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Caxeyx/TuffGradients.git
   cd TuffGradients
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build production bundle:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```text
TuffGradients/
├── public/                 # Favicons and SVG assets
├── src/
│   ├── assets/             # Brand logos and images
│   ├── components/
│   │   ├── MinimalShadeDeck.jsx    # Whole-screen 3D fan shade deck
│   │   ├── ColorDrawer.jsx         # Slide-out 6,000+ Pantone search drawer
│   │   ├── Header.jsx              # Apple glass navigation bar
│   │   ├── PantoneTrends.jsx       # 6,083-color grid & trend inspector
│   │   ├── ColorHuntBrowser.jsx    # Curated palette browser
│   │   ├── HarmoniesView.jsx       # Algorithmic color harmony studio
│   │   ├── GradientsView.jsx       # Multi-stop gradient map showcase
│   │   └── StudioPreview.jsx       # UI canvas testing environment
│   ├── data/
│   │   ├── pantoneFullMaster.json  # 6,083 official Pantone color records
│   │   ├── pantoneDeckDataGenerated.json # Harmonic strips organized by book
│   │   └── colorCatalog.js         # Curated trends and palettes
│   ├── utils/
│   │   ├── colorEngine.js          # Color space math (Hex, RGB, CMYK, Pantone match)
│   │   └── grdParser.js            # Photoshop gradient file parser
│   ├── App.jsx                     # Top-level state and routing
│   └── main.jsx                    # Vite app entry
├── package.json
└── vite.config.js
```

---

## 📄 License

MIT License © 2026 [Casey (Caxeyx)](https://github.com/Caxeyx). All Pantone color names and codes are trademarks of Pantone LLC and used for educational/reference purposes.
