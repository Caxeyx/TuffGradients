// High-resolution Curated Catalog inspired by Color Hunt with Pantone & Apple aesthetics

export const PALETTE_TAGS = [
  'All', 'Trending', 'Popular', 'Pastel', 'Vintage', 'Retro', 'Neon', 'Gold', 
  'Light', 'Dark', 'Warm', 'Cold', 'Summer', 'Fall', 'Nature', 'Earth', 
  'Night', 'Space', 'Gradient', 'Sunset', 'Minimal', 'Cyberpunk', 'Coffee', 'Luxury'
];

export const PANTONE_TRENDS = [
  { hex: '#FFBE98', name: 'Peach Fuzz', pantone: 'PANTONE 13-1023 TCX', cmyk: '0, 31, 38, 0', rgb: '255, 190, 152', category: 'Warm Pastel', tags: ['Gentle', 'Modern', 'Cozy', 'Pastel'] },
  { hex: '#BB2649', name: 'Viva Magenta', pantone: 'PANTONE 18-1750 TCX', cmyk: '0, 80, 59, 27', rgb: '187, 38, 73', category: 'Bold Expressive', tags: ['Vigorous', 'Electric', 'Luxury', 'Trending'] },
  { hex: '#6667AB', name: 'Very Peri', pantone: 'PANTONE 17-3938 TCX', cmyk: '40, 40, 0, 33', rgb: '102, 103, 171', category: 'Digital Violet', tags: ['Futuristic', 'Calm', 'Creative', 'Cold'] },
  { hex: '#0F4C81', name: 'Classic Blue', pantone: 'PANTONE 19-4052 TCX', cmyk: '88, 41, 0, 49', rgb: '15, 76, 129', category: 'Timeless', tags: ['Trust', 'Deep', 'Cold', 'Popular'] },
  { hex: '#93B48B', name: 'Sage Leaf', pantone: 'PANTONE 16-0213 TCX', cmyk: '18, 0, 23, 29', rgb: '147, 180, 139', category: 'Biophilic', tags: ['Organic', 'Eco', 'Nature', 'Earth'] },
  { hex: '#1C1D21', name: 'Space Black', pantone: 'PANTONE 19-4004 TCX', cmyk: '15, 12, 0, 87', rgb: '28, 29, 33', category: 'Obsidian', tags: ['Pro', 'Hardware', 'Dark', 'Space'] },
  { hex: '#E5D0BA', name: 'Natural Titanium', pantone: 'PANTONE 13-1008 TCX', cmyk: '0, 9, 19, 10', rgb: '229, 208, 186', category: 'Industrial Luxe', tags: ['Metallic', 'Gold', 'Luxury', 'Minimal'] },
  { hex: '#E06553', name: 'Living Coral', pantone: 'PANTONE 16-1546 TCX', cmyk: '0, 55, 63, 12', rgb: '224, 101, 83', category: 'Vibrant Warmth', tags: ['Warm', 'Summer', 'Sunset', 'Trending'] },
  { hex: '#2E5266', name: 'Nordic Slate', pantone: 'PANTONE 19-4220 TCX', cmyk: '55, 20, 0, 60', rgb: '46, 82, 102', category: 'Deep Marine', tags: ['Cold', 'Night', 'Minimal'] },
  { hex: '#F0E6D2', name: 'Alabaster Linen', pantone: 'PANTONE 11-0604 TCX', cmyk: '0, 4, 12, 6', rgb: '240, 230, 210', category: 'Neutral Surface', tags: ['Light', 'Pastel', 'Minimal'] },
  { hex: '#878681', name: 'Raw Concrete', pantone: 'PANTONE 17-0000 TCX', cmyk: '0, 1, 4, 47', rgb: '135, 134, 129', category: 'Brutalist', tags: ['Retro', 'Minimal', 'Cold'] },
  { hex: '#5B4B8A', name: 'Iris Dusk', pantone: 'PANTONE 18-3838 TCX', cmyk: '34, 46, 0, 46', rgb: '91, 75, 138', category: 'Nocturne', tags: ['Night', 'Space', 'Cold'] },
  { hex: '#E8A598', name: 'Blush Velvet', pantone: 'PANTONE 14-1511 TCX', cmyk: '0, 29, 34, 9', rgb: '232, 165, 152', category: 'Sensory', tags: ['Pastel', 'Light', 'Warm'] },
  { hex: '#0B3C49', name: 'Abyssal Teal', pantone: 'PANTONE 19-4526 TCX', cmyk: '85, 17, 0, 71', rgb: '11, 60, 73', category: 'Oceanic', tags: ['Dark', 'Cold', 'Night'] },
  { hex: '#F4A261', name: 'Desert Ochre', pantone: 'PANTONE 15-1145 TCX', cmyk: '0, 33, 60, 4', rgb: '244, 162, 97', category: 'Solar', tags: ['Warm', 'Earth', 'Gold', 'Sunset'] }
];

// 4-Color Hierarchical Palettes (Color Hunt style, elevated with Pantone codes & proportions)
export const HUNT_PALETTES = [
  {
    id: 'ch-vision-m4',
    title: 'Vision Pro Nebula',
    likes: 2420,
    created: '2 days ago',
    tags: ['Trending', 'Dark', 'Space', 'Cyberpunk', 'Popular'],
    colors: [
      { hex: '#0D0E15', name: 'Deep Space Abyss', pantone: 'PANTONE 19-4010 TCX' },
      { hex: '#1E2235', name: 'Midnight Specular', pantone: 'PANTONE 19-3921 TCX' },
      { hex: '#4F46E5', name: 'Quantum Indigo', pantone: 'PANTONE 18-3949 TCX' },
      { hex: '#38BDF8', name: 'Liquid Retina Sky', pantone: 'PANTONE 14-4318 TCX' }
    ]
  },
  {
    id: 'ch-peach-matcha',
    title: 'Peach Blossom & Kyoto Matcha',
    likes: 1890,
    created: '4 days ago',
    tags: ['Pastel', 'Light', 'Nature', 'Summer', 'Trending'],
    colors: [
      { hex: '#FFF5EB', name: 'Matcha Milk Frost', pantone: 'PANTONE 11-0602 TCX' },
      { hex: '#FFBE98', name: 'Peach Fuzz TCX', pantone: 'PANTONE 13-1023 TCX' },
      { hex: '#B8D8BA', name: 'Morning Mist Sage', pantone: 'PANTONE 14-6316 TCX' },
      { hex: '#4D6A56', name: 'Bamboo Moss', pantone: 'PANTONE 18-0119 TCX' }
    ]
  },
  {
    id: 'ch-tokyo-rain',
    title: 'Roppongi Rain Cyberpunk',
    likes: 3120,
    created: '1 week ago',
    tags: ['Cyberpunk', 'Neon', 'Night', 'Popular'],
    colors: [
      { hex: '#0A0A10', name: 'Rain Asphalt', pantone: 'PANTONE 19-4203 TCX' },
      { hex: '#2A1B4E', name: 'Umbra Neon Dark', pantone: 'PANTONE 19-3638 TCX' },
      { hex: '#FF2A85', name: 'Akira Magenta', pantone: 'PANTONE 18-1945 TCX' },
      { hex: '#00F0FF', name: 'Cyber Cyan 100', pantone: 'PANTONE 13-0319 TCX' }
    ]
  },
  {
    id: 'ch-amangiri-dune',
    title: 'Amangiri Canyon Sunset',
    likes: 1450,
    created: '3 days ago',
    tags: ['Warm', 'Sunset', 'Earth', 'Gold', 'Luxury'],
    colors: [
      { hex: '#FDF8F5', name: 'Sunlit Adobe Chalk', pantone: 'PANTONE 11-0105 TCX' },
      { hex: '#E2B89D', name: 'Warm Canyon Dust', pantone: 'PANTONE 14-1220 TCX' },
      { hex: '#B86F52', name: 'Terracotta Kiln', pantone: 'PANTONE 18-1442 TCX' },
      { hex: '#582C1E', name: 'Roasted Cacao Soil', pantone: 'PANTONE 19-1220 TCX' }
    ]
  },
  {
    id: 'ch-nordic-scandi',
    title: 'Copenhagen Solarium Ash',
    likes: 1680,
    created: '5 days ago',
    tags: ['Minimal', 'Light', 'Cold', 'Retro'],
    colors: [
      { hex: '#F7F4EF', name: 'Travertine Wash', pantone: 'PANTONE 11-0604 TCX' },
      { hex: '#DDD2C4', name: 'Oatmeal Wool Weave', pantone: 'PANTONE 13-1006 TCX' },
      { hex: '#87979B', name: 'Nordic Sea Fog', pantone: 'PANTONE 16-4408 TCX' },
      { hex: '#2B3238', name: 'Smoked Ash Beam', pantone: 'PANTONE 19-4104 TCX' }
    ]
  },
  {
    id: 'ch-titanium-apple',
    title: 'Cupertino Studio Titanium',
    likes: 3820,
    created: '1 day ago',
    tags: ['Minimal', 'Dark', 'Luxury', 'Trending', 'Popular'],
    colors: [
      { hex: '#121214', name: 'Obsidian Matte Core', pantone: 'PANTONE 19-4004 TCX' },
      { hex: '#2C2C2E', name: 'Space Gray Pro', pantone: 'PANTONE 19-4006 TCX' },
      { hex: '#8E8E93', name: 'Milled Titanium', pantone: 'PANTONE 16-3801 TCX' },
      { hex: '#F2F2F7', name: 'Specular White', pantone: 'PANTONE 11-0601 TCX' }
    ]
  },
  {
    id: 'ch-espresso-luxe',
    title: 'Specialty Espresso Bar',
    likes: 1240,
    created: '6 days ago',
    tags: ['Coffee', 'Warm', 'Earth', 'Vintage'],
    colors: [
      { hex: '#F9F5F0', name: 'Oat Foam Cream', pantone: 'PANTONE 11-0603 TCX' },
      { hex: '#D8B18A', name: 'Caramel Toffee', pantone: 'PANTONE 14-1120 TCX' },
      { hex: '#784B32', name: 'Arabica Roast', pantone: 'PANTONE 18-1244 TCX' },
      { hex: '#231610', name: 'Dark Roast Espresso', pantone: 'PANTONE 19-1111 TCX' }
    ]
  },
  {
    id: 'ch-vintage-retro70s',
    title: 'Palm Springs Mid-Century',
    likes: 2190,
    created: '1 week ago',
    tags: ['Vintage', 'Retro', 'Warm', 'Summer'],
    colors: [
      { hex: '#F4E8C1', name: 'Desert Parchment', pantone: 'PANTONE 12-0715 TCX' },
      { hex: '#E07A5F', name: 'Warm Terracotta Brick', pantone: 'PANTONE 16-1448 TCX' },
      { hex: '#3D5A80', name: 'Pacific Mid-Century', pantone: 'PANTONE 18-4028 TCX' },
      { hex: '#293241', name: 'Deep Midnight Shadow', pantone: 'PANTONE 19-4024 TCX' }
    ]
  },
  {
    id: 'ch-coastal-mediterranean',
    title: 'Santorini Bougainvillea',
    likes: 1970,
    created: '3 days ago',
    tags: ['Summer', 'Nature', 'Light', 'Popular'],
    colors: [
      { hex: '#F0F9FF', name: 'Cycladic Chalk White', pantone: 'PANTONE 11-4800 TCX' },
      { hex: '#BAE6FD', name: 'Aegean Shallow Reef', pantone: 'PANTONE 13-4411 TCX' },
      { hex: '#0284C7', name: 'Church Dome Cobalt', pantone: 'PANTONE 18-4244 TCX' },
      { hex: '#E11D48', name: 'Vibrant Magenta Flora', pantone: 'PANTONE 18-1856 TCX' }
    ]
  },
  {
    id: 'ch-aurora-glow',
    title: 'Lapland Geomagnetic',
    likes: 2750,
    created: '4 days ago',
    tags: ['Gradient', 'Cold', 'Night', 'Space', 'Trending'],
    colors: [
      { hex: '#050811', name: 'Polar Midnight Sky', pantone: 'PANTONE 19-4015 TCX' },
      { hex: '#0A3A40', name: 'Sub-Zero Marine', pantone: 'PANTONE 19-4524 TCX' },
      { hex: '#10B981', name: 'Emerald Ion Curtains', pantone: 'PANTONE 16-5942 TCX' },
      { hex: '#A78BFA', name: 'Ionosphere Lavender', pantone: 'PANTONE 15-3817 TCX' }
    ]
  },
  {
    id: 'ch-gold-luxe',
    title: 'Monaco Private Reserve',
    likes: 1610,
    created: '5 days ago',
    tags: ['Gold', 'Luxury', 'Dark', 'Popular'],
    colors: [
      { hex: '#0E0E10', name: 'Obsidian Velvet', pantone: 'PANTONE 19-4004 TCX' },
      { hex: '#27251F', name: 'Smoked Amber Bronze', pantone: 'PANTONE 19-0812 TCX' },
      { hex: '#C5A059', name: 'Imperial 18k Gold', pantone: 'PANTONE 15-0955 TCX' },
      { hex: '#F3E5C8', name: 'Silk Champagne Glow', pantone: 'PANTONE 12-0710 TCX' }
    ]
  },
  {
    id: 'ch-electric-acid',
    title: 'Hyperpop Acid Rave',
    likes: 2040,
    created: '2 days ago',
    tags: ['Neon', 'Cyberpunk', 'Summer', 'Trending'],
    colors: [
      { hex: '#000000', name: 'Void Black', pantone: 'PANTONE 19-4004 TCX' },
      { hex: '#CCFF00', name: 'Radioactive Lime', pantone: 'PANTONE 13-0550 TCX' },
      { hex: '#7928CA', name: 'Deep Electric Violet', pantone: 'PANTONE 18-3838 TCX' },
      { hex: '#FF0080', name: 'Laser Shock Fuchsia', pantone: 'PANTONE 17-2036 TCX' }
    ]
  }
];

export const CURATED_PALETTES = HUNT_PALETTES;

// Casey's Signature Choice: Personally curated artistic gradients
export const CASEYS_CHOICE_GRADIENTS = [
  {
    id: 'casey-cosmic-chroma',
    title: "Casey's Cosmic Chroma",
    badge: "Casey's Choice",
    subtitle: "High-voltage ultraviolet bleeding into liquid laser magenta and electric cyan",
    curatorNote: "Engineered for striking hero backgrounds and premium hardware product reveals.",
    type: 'linear',
    angle: 135,
    category: 'casey',
    pantonePair: ['PANTONE 18-3838 TCX', 'PANTONE 18-1945 TCX', 'PANTONE 13-0319 TCX'],
    stops: [
      { color: '#1B003A', position: 0, pantone: 'PANTONE 19-3638 TCX' },
      { color: '#7928CA', position: 38, pantone: 'PANTONE 18-3838 TCX' },
      { color: '#FF0080', position: 72, pantone: 'PANTONE 17-2036 TCX' },
      { color: '#00F0FF', position: 100, pantone: 'PANTONE 13-0319 TCX' }
    ]
  },
  {
    id: 'casey-solaris-gold',
    title: "Casey's Solaris Mirage",
    badge: "Casey's Choice",
    subtitle: "Liquid honey ochre and 18k polished champagne gold melting into deep terracotta",
    curatorNote: "Warm, tactile, and sensual. Perfect for luxury packaging, editorial covers, and warm UI accents.",
    type: 'linear',
    angle: 125,
    category: 'casey',
    pantonePair: ['PANTONE 14-1120 TCX', 'PANTONE 15-0955 TCX', 'PANTONE 18-1442 TCX'],
    stops: [
      { color: '#FFF2DE', position: 0, pantone: 'PANTONE 11-0604 TCX' },
      { color: '#E8B273', position: 40, pantone: 'PANTONE 14-1120 TCX' },
      { color: '#D95C3C', position: 78, pantone: 'PANTONE 16-1448 TCX' },
      { color: '#4A1D11', position: 100, pantone: 'PANTONE 19-1220 TCX' }
    ]
  },
  {
    id: 'casey-cyber-emerald',
    title: "Casey's Bioluminescent Forest",
    badge: "Casey's Choice",
    subtitle: "Damp obsidian earth illuminated by radioactive phosphor green and deep cyan tides",
    curatorNote: "Dark-mode optimization with high-visibility accents that pass AAA accessibility on cards.",
    type: 'linear',
    angle: 140,
    category: 'casey',
    pantonePair: ['PANTONE 19-5408 TCX', 'PANTONE 17-5641 TCX', 'PANTONE 13-0550 TCX'],
    stops: [
      { color: '#030E0B', position: 0, pantone: 'PANTONE 19-5408 TCX' },
      { color: '#0B4232', position: 42, pantone: 'PANTONE 19-5511 TCX' },
      { color: '#00FF9D', position: 78, pantone: 'PANTONE 13-0319 TCX' },
      { color: '#CCFF00', position: 100, pantone: 'PANTONE 13-0550 TCX' }
    ]
  },
  {
    id: 'casey-apple-silk',
    title: "Casey's Liquid Titanium Silk",
    badge: "Casey's Choice",
    subtitle: "Milled aerospace titanium with pearlescent specular sheen and soft violet undertones",
    curatorNote: "Apple keynote aesthetic. Gives web containers and headers a physical hardware-like finish.",
    type: 'linear',
    angle: 155,
    category: 'casey',
    pantonePair: ['PANTONE 11-0601 TCX', 'PANTONE 13-1008 TCX', 'PANTONE 16-3801 TCX'],
    stops: [
      { color: '#FFFFFF', position: 0, pantone: 'PANTONE 11-0601 TCX' },
      { color: '#E3E0DB', position: 35, pantone: 'PANTONE 11-0604 TCX' },
      { color: '#B5AFA6', position: 70, pantone: 'PANTONE 13-1008 TCX' },
      { color: '#686561', position: 100, pantone: 'PANTONE 16-3801 TCX' }
    ]
  },
  {
    id: 'casey-malibu-midnight',
    title: "Casey's Malibu Twilight",
    badge: "Casey's Choice",
    subtitle: "Late summer dusk horizon over Pacific waves transitioning from peach haze to abyssal sapphire",
    curatorNote: "Gentle optical decay curve designed to evoke peace and creative focus.",
    type: 'linear',
    angle: 160,
    category: 'casey',
    pantonePair: ['PANTONE 13-1023 TCX', 'PANTONE 16-3115 TCX', 'PANTONE 19-4052 TCX'],
    stops: [
      { color: '#FFB899', position: 0, pantone: 'PANTONE 13-1023 TCX' },
      { color: '#C86DD7', position: 42, pantone: 'PANTONE 16-3115 TCX' },
      { color: '#3023AE', position: 75, pantone: 'PANTONE 18-3838 TCX' },
      { color: '#090A1A', position: 100, pantone: 'PANTONE 19-4010 TCX' }
    ]
  }
];

export const PREMIUM_GRADIENTS = [
  ...CASEYS_CHOICE_GRADIENTS,
  {
    id: 'grad-aurora-borealis',
    title: 'Nordic Aurora',
    subtitle: 'Inspired by polar geomagnetic light curtains reflecting on glacial ice',
    type: 'linear',
    angle: 135,
    category: 'aurora',
    pantonePair: ['PANTONE 16-4535 TCX (Blue Curacao)', 'PANTONE 15-5519 TCX (Turquoise)', 'PANTONE 18-3838 TCX (Ultra Violet)'],
    stops: [
      { color: '#00F5D4', position: 0, pantone: 'PANTONE 13-0319 TCX' },
      { color: '#7B2CBF', position: 52, pantone: 'PANTONE 18-3838 TCX' },
      { color: '#0B090A', position: 100, pantone: 'PANTONE 19-4203 TCX' }
    ]
  },
  {
    id: 'grad-sunset-malibu',
    title: 'Pacific Golden Hour',
    subtitle: 'The warm transition of California horizon haze merging into violet marine layer',
    type: 'linear',
    angle: 120,
    category: 'sunset',
    pantonePair: ['PANTONE 13-1023 TCX (Peach Fuzz)', 'PANTONE 16-1546 TCX (Living Coral)', 'PANTONE 19-3518 TCX (Grape)'],
    stops: [
      { color: '#FFA07A', position: 0, pantone: 'PANTONE 13-1023 TCX' },
      { color: '#E056FD', position: 48, pantone: 'PANTONE 16-3115 TCX' },
      { color: '#4834D4', position: 100, pantone: 'PANTONE 19-3950 TCX' }
    ]
  },
  {
    id: 'grad-apple-glow',
    title: 'Apple Intelligence Siri Glow',
    subtitle: 'Fluid luminescence from Apple WWDC keynote fluid mesh and dynamic islands',
    type: 'linear',
    angle: 145,
    category: 'apple-mesh',
    pantonePair: ['PANTONE 17-1755 TCX', 'PANTONE 14-4318 TCX', 'PANTONE 18-3949 TCX'],
    stops: [
      { color: '#FF3B30', position: 0, pantone: 'PANTONE 17-1755 TCX' },
      { color: '#AF52DE', position: 35, pantone: 'PANTONE 17-3628 TCX' },
      { color: '#0071E3', position: 70, pantone: 'PANTONE 18-4051 TCX' },
      { color: '#34C759', position: 100, pantone: 'PANTONE 15-6340 TCX' }
    ]
  },
  {
    id: 'grad-natural-titanium',
    title: 'Milled Titanium Sheen',
    subtitle: 'Subtle metallic refraction crafted with micro-contrast values for sleek hardware UIs',
    type: 'linear',
    angle: 160,
    category: 'titanium',
    pantonePair: ['PANTONE 13-1008 TCX (Natural Titanium)', 'PANTONE 17-0000 TCX (Neutral Gray)'],
    stops: [
      { color: '#EBE5DF', position: 0, pantone: 'PANTONE 11-0604 TCX' },
      { color: '#C8BFB5', position: 50, pantone: 'PANTONE 13-1008 TCX' },
      { color: '#978F85', position: 100, pantone: 'PANTONE 16-1407 TCX' }
    ]
  },
  {
    id: 'grad-deep-zenith',
    title: 'Zenith Twilight',
    subtitle: 'Deep atmospheric indigo descending into radiant starlight sapphire',
    type: 'linear',
    angle: 180,
    category: 'zenith',
    pantonePair: ['PANTONE 19-4052 TCX (Classic Blue)', 'PANTONE 19-3921 TCX (Black Iris)'],
    stops: [
      { color: '#090D16', position: 0, pantone: 'PANTONE 19-4010 TCX' },
      { color: '#162A45', position: 55, pantone: 'PANTONE 19-4033 TCX' },
      { color: '#2B6CB0', position: 100, pantone: 'PANTONE 18-4244 TCX' }
    ]
  },
  {
    id: 'grad-emerald-prism',
    title: 'Bioluminescent Abyss',
    subtitle: 'Deep sea phosphorescent cyan piercing through obsidian depths',
    type: 'linear',
    angle: 135,
    category: 'cosmic',
    pantonePair: ['PANTONE 14-4522 TCX (Pool Blue)', 'PANTONE 19-5411 TCX (Dark Forest)'],
    stops: [
      { color: '#031B15', position: 0, pantone: 'PANTONE 19-5408 TCX' },
      { color: '#0A4A3A', position: 45, pantone: 'PANTONE 19-5511 TCX' },
      { color: '#00F5A0', position: 100, pantone: 'PANTONE 13-0319 TCX' }
    ]
  }
];
