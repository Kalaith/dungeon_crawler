# Dungeon Crawler Style Guide (Etrian Odyssey Theme)

## 1. Color Palette

The visual identity is built on a "Tech-Fantasy" aesthetic, combining deep void-like backgrounds with crisp, magical interface elements.

### Primary Colors (UI & Backgrounds)

| Name          | Tailwind Class  | Hex       | Usage                                    |
| ------------- | --------------- | --------- | ---------------------------------------- |
| **Deep Void** | `bg-etrian-900` | `#080a10` | Main screen background, "behind" the UI. |
| **Midnight**  | `bg-etrian-800` | `#0f172a` | Panel backgrounds, modal backdrops.      |
| **Twilight**  | `bg-etrian-700` | `#1e293b` | Secondary panels, active list items.     |

### Accent Colors (Text & Borders)

| Name         | Tailwind Class  | Hex       | Usage                           |
| ------------ | --------------- | --------- | ------------------------------- |
| **Hologram** | `text-cyan-100` | `#cffafe` | Primary body text.              |
| **Cyan**     | `text-cyan-400` | `#22d3ee` | Borders, secondary text, icons. |
| **Neon**     | `text-cyan-500` | `#06b6d4` | Active states, strong borders.  |

### Functional Colors

| Name        | Tailwind Class    | Hex       | Usage                               |
| ----------- | ----------------- | --------- | ----------------------------------- |
| **Gold**    | `text-yellow-400` | `#facc15` | Headers, key items, currency.       |
| **Danger**  | `text-red-500`    | `#ef4444` | HP, critical warnings, enemy names. |
| **Success** | `text-green-500`  | `#22c55e` | TP, buffs, success messages.        |
| **Magic**   | `text-purple-400` | `#c084fc` | Arcane effects, special items.      |

---

## 2. Typography

### Headers

- **Font:** "Press Start 2P" (Pixel Art style)
- **Usage:** Screen titles, Section headers.
- **Style:** Uppercase, often Gold or Cyan.
- **Shadow:** `text-shadow: 2px 2px 0px #000`

### Body Text

- **Font:** "Inter" (Clean Sans-serif)
- **Usage:** Descriptions, logs, stats.
- **Style:** High readability, good contrast against dark backgrounds.

### Monospace

- **Font:** "VT323" or "Fira Code"
- **Usage:** Numbers, tables, code-like elements.

---

## 3. UI Components

### The "Game Frame"

All major UI panels should be enclosed in a double-border container.

- **Outer Border:** 1px Solid Cyan-500
- **Inner Border:** 1px Solid Cyan-900 (or transparent padding)
- **Background:** Midnight (`#0f172a`) with 95% opacity.
- **Corner Accents:** Optional decorative pixels in corners.

### Buttons

- **Default:** Transparent background, Cyan border, Cyan text.
- **Hover:** Cyan-900 background, Neon border, White text.
- **Active:** Cyan-700 background.
- **Disabled:** Gray border, Gray text, 50% opacity.

### Progress Bars (HP/TP)

- **Container:** Dark gray/black background, inset shadow.
- **Fill:** Gradient texture (Red for HP, Green for TP).
- **Text:** White/Light text overlaying the bar (e.g., "120/120").

---

## 4. Layout Patterns

### Split Screen

- **Viewport (Top/Left):** 60-70% of screen. Displays the 3D world or Town art.
- **Status Panel (Bottom/Right):** 30-40% of screen. Displays Party Status.
- **Message Log:** Overlay or dedicated strip at the bottom.

### Modal Windows

- Centered on screen.
- Dark backdrop blur (`backdrop-blur-sm`).
- Distinct "Game Frame" styling.
