# Mafia Chronicles - Character Card System

## Overview
Dark-themed character card gallery system with animated borders for a mafia game.

## Features

### 1. **Animated Card Borders** (4 types)
- **Gold Glow** - Pulsing gold shimmer effect with outer glow
- **Blood Border** - Dark red gradient with blood drip effect
- **Diamond Cut** - Rotating conic gradient (premium feel)
- **Particle Border** - Floating ember particles with scan line

### 2. **Character Gallery**
- Grid display of collected character cards
- 3:4 aspect ratio (width:height)
- Rarity badges: Legendary (gold), Epic (purple), Rare (blue), Common (gray)
- "NEW" badge animation for newly acquired characters
- Hover effects with scale and lift

### 3. **Popup Notifications**
- Appears when first meeting a new character
- Shows card preview with animated border
- "Collect" and "View Gallery" buttons
- Smooth scale animation on open/close

### 4. **Menu Icons** (Top Navigation)
- History (clock icon)
- Save (floppy disk icon)
- **Character Gallery** (grid icon) - NEW with notification dot
- Settings (gear icon)
- Hamburger Menu (3 lines icon)

## File Structure
```
public/
├── assets/
│   └── cards/          # Place character .webp images here
│       ├── xyera.webp      # 3:4 aspect ratio recommended
│       ├── elenna.webp
│       ├── keyna.webp
│       ├── rachel.webp
│       ├── henry.webp
│       └── azaroth.webp
└── gallery.html        # Gallery page demo
```

## Character Card Specifications
- **Aspect Ratio**: 3:4 (width:height)
- **Recommended Size**: 300x400px (display), original can be higher
- **Format**: .webp (with .jpg/.png fallback)
- **Naming Convention**: lowercase with underscores (e.g., `xyera.webp`)

## Adding New Characters

### 1. Add Image
Place the character image in `public/assets/cards/[name].webp`

### 2. Update Characters Array
In `gallery.html`, add to the `characters` array:
```javascript
{
    id: "char_id",           // unique identifier
    name: "Character Name", // display name
    role: "Role Title",     // character role
    rarity: "legendary",    // rarity: legendary, epic, rare, common
    border: "gold-glow",    // border type: gold-glow, blood, diamond, particle
    image: "assets/cards/char_id.webp",
    isNew: true              // shows "NEW" badge
}
```

## JavaScript API

### Trigger Popup for Character
```javascript
showNewCharacterPopup('xyera');
```

### Mark Character as Viewed (remove NEW badge)
```javascript
characters.find(c => c.id === 'xyera').isNew = false;
renderGallery();
```

### Add New Character to Collection
```javascript
characters.push({
    id: "new_char",
    name: "New Character",
    role: "Role",
    rarity: "epic",
    border: "diamond",
    image: "assets/cards/new_char.webp",
    isNew: true
});
renderGallery();
```

## Theme Colors
| Variable | Hex | Usage |
|----------|-----|-------|
| `--bg-dark` | #0a0a0a | Background |
| `--accent-gold` | #c9a227 | Gold accents |
| `--accent-red` | #8b0000 | Blood/danger accents |
| `--text-primary` | #f0e6d3 | Main text |
| `--text-secondary` | #8a8a8a | Secondary text |

## Demo
Open `public/gallery.html` in a browser to see the gallery in action. A popup for Xyera will appear automatically after 1.5 seconds.
