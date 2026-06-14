# Design Guide — Living Moments UG

Abgeleitet aus dem Logo, dem Mockup und Julias Markenpersönlichkeit.

---

## Markenpersönlichkeit

Living Moments verkörpert zwei Welten in einer Handschrift:
- **Immobilien**: ruhig, warm, vertrauensvoll, kompetent
- **Events**: edel, unvergesslich, besonders, noir

Verbindendes Element: Gold. Qualität. Haltung.

---

## Farbpalette

```css
:root {
  /* Marken-Gold */
  --color-gold:        #C9A96E;
  --color-gold-light:  #E8D5B0;
  --color-gold-dark:   #A8843E;

  /* Immobilien-Seite (Hell) */
  --color-cream:       #F0EDE8;
  --color-cream-dark:  #E5E0D8;

  /* Events-Seite (Dunkel) */
  --color-noir:        #1A1A1A;
  --color-noir-soft:   #252525;
  --color-noir-light:  #333333;

  /* Text */
  --color-text-dark:   #2C2C2C;
  --color-text-muted:  #7A7A7A;
  --color-white:       #FFFFFF;
}
```

### Verwendungsregeln
| Kontext | Background | Text | Akzent |
|---------|-----------|------|--------|
| Immobilien-Sektion | `--color-cream` | `--color-text-dark` | `--color-gold` |
| Events-Sektion | `--color-noir` | `--color-white` | `--color-gold` |
| Footer | `--color-noir` | `--color-white` | `--color-gold` |
| Navigation (gescrollt) | `--color-noir` | `--color-white` | `--color-gold` |
| Navigation (Hero) | transparent | je nach Seite | `--color-gold` |

---

## Logo-Verwendung

### Zwei offizielle Versionen
- **logo-dark.svg** (oder .png): Gold-Symbol + weißer Schriftzug → für dunklen Background (#1A1A1A, Footer, Events)
- **logo-light.svg** (oder .png): Gold-Symbol + schwarzer Schriftzug → für hellen Background (Cream, Weiß, Immobilien)

### Regeln
- Mindestabstand rund um das Logo: 20px (≈ 1,5× Symbolhöhe)
- Keine Farbänderung, keine Verzerrung, keine Schatten
- Mindestbreite: 120px
- **Kein E&V Logo auf der Website** (Compliance — E&V schriftlich anfragen falls gewünscht)

### Logo-Anatomie
```
[Gold-Symbol: Doppelbogen / Infinity-Variation]
LIVING MOMENTS
[Ultra-thin, All Caps, Wide Letter-Spacing]
```

---

## Typografie

### Schriftpaare
```html
<!-- Google Fonts Einbindung -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@100;200;300;400;500&display=swap" rel="stylesheet">
```

| Rolle | Familie | Weight | Verwendung |
|-------|---------|--------|------------|
| Display (Hero) | Cormorant Garamond | 300 / italic | Große Emotionsüberschriften |
| H1–H2 | Cormorant Garamond | 400 | Seitenüberschriften |
| H3–H4 | Inter | 300 | Abschnittsüberschriften |
| Body | Inter | 300–400 | Fließtext |
| Label / Nav | Inter | 200–300 | Navigation, Beschriftungen, Metainfo |
| Brand | Inter | 100–200 | Logo-Schrift-Emulation, Taglines |

### Größenskala (fluid)
```css
:root {
  --text-hero:   clamp(3rem, 6vw, 5.5rem);
  --text-h1:     clamp(2rem, 4vw, 3.5rem);
  --text-h2:     clamp(1.5rem, 3vw, 2.25rem);
  --text-h3:     clamp(1.1rem, 2vw, 1.5rem);
  --text-body:   1rem;          /* 16px */
  --text-small:  0.875rem;
  --text-label:  0.75rem;

  --leading-tight:  1.15;
  --leading-body:   1.7;
  --leading-loose:  2;

  --tracking-brand:  0.3em;     /* Logo-Style */
  --tracking-nav:    0.15em;
  --tracking-body:   0;
}
```

---

## Spacing & Layout

```css
:root {
  --space-xs:   0.5rem;    /*  8px */
  --space-sm:   1rem;      /* 16px */
  --space-md:   2rem;      /* 32px */
  --space-lg:   4rem;      /* 64px */
  --space-xl:   8rem;      /* 128px */
  --space-2xl:  12rem;

  --max-width:  1280px;
  --gutter:     clamp(1.5rem, 5vw, 4rem);
}
```

### Breakpoints
```css
/* Mobile-first */
/* sm */ @media (min-width: 640px)  { ... }
/* md */ @media (min-width: 768px)  { ... }
/* lg */ @media (min-width: 1024px) { ... }
/* xl */ @media (min-width: 1280px) { ... }
```

---

## Schlüsselkomponenten

### Split-Screen Hero
```
┌──────────────────┬──────────────────┐
│  CREAM / HELL    │   NOIR / DUNKEL  │
│                  │                  │
│  [Logo Light]    │   [Logo Dark]    │
│                  │       ←ggf. nur  │
│  Immobilien      │   Events         │
│  München.        │   die verbinden. │
│                  │                  │
│  [CTA Button]    │   [CTA Button]   │
└──────────────────┴──────────────────┘
                   ↑
            1px gold Trennlinie
```
- Desktop: 50/50, nebeneinander
- Mobile: vertikal gestapelt (Immobilien oben)
- Gold-Trennlinie zwischen den Hälften (Desktop only)

### Buttons
```css
.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  font-family: Inter, sans-serif;
  font-weight: 300;
  font-size: var(--text-label);
  letter-spacing: var(--tracking-nav);
  text-transform: uppercase;
  border: 1px solid var(--color-gold);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}
/* Hell-Kontext */
.btn-light { color: var(--color-text-dark); }
.btn-light:hover { background: var(--color-gold); color: var(--color-noir); }

/* Dunkel-Kontext */
.btn-dark { color: var(--color-white); }
.btn-dark:hover { background: var(--color-gold); color: var(--color-noir); }
```

### Navigation
```
[Logo]          [Immobilien]  [Events]  [Über mich]  [Kontakt]
```
- Transparent im Hero-Bereich
- Beim Scrollen: `background: #1A1A1A`, `border-bottom: 1px solid #C9A96E`
- Mobile: Hamburger → Fullscreen Overlay (Noir-Background)

### Cards (VERKAUFT, Testimonials)
```css
.card {
  border: 1px solid var(--color-gold-light);
  padding: var(--space-md);
  background: transparent;
}
/* Kein box-shadow — flach, edel */
```

### Trennlinien / Divider
```css
.divider {
  width: 40px;
  height: 1px;
  background: var(--color-gold);
  margin: var(--space-sm) 0;
}
```

---

## Bildsprache

### Immobilien-Sektion
- Stil: hell, natürliches Licht, Altbau-Ästhetik, Schwabing
- Motive: Wohnräume, Fassaden, Parkett-Detail, Stuckverzierung
- Farben: warm, cream-nah, kein übersättigtes Instagram-Filter
- Quelle: KI-generiert (Midjourney / DALL-E) oder lizenzfreie Stockfotos
- **KEINE E&V Exposé-Fotos (Compliance)**

### Events-Sektion
- Stil: Atmosphärisch, Menschen, Momente
- Motive: Tischdekorationen, Gäste im Gespräch, Details (Gläser, Licht)
- Julias eigene Fotos bevorzugen
- Bearbeitung: leicht wärmer, kontrastreich

### Portraits
- Sobald Headshot vorhanden: professionell, warm, nicht steif
- Hintergrund: Cream oder Noir (je nach Sektion)
- Platzhalter bis dahin: Geometrische Form in Gold

---

## Do's & Don'ts

| ✓ Do | ✗ Don't |
|------|---------|
| Gold als Akzent — dezent und präzise | Gold als Füllfarbe für ganze Flächen |
| Viel Weißraum / Luft | Vollgepackte Layouts |
| Cormorant für emotionale Headlines | Cormorant für Mengentext / klein |
| Inter Light für elegante Wirkung | Fett/Bold als Standard |
| Klare Trennung der zwei Welten | Farbmischung zwischen Cream und Noir |
| Eckige Buttons (0–2px Radius) | Runde Buttons (>8px Radius) |
| 1px Borders als Struktur | Dicke, klumpige Borders |
| Uppercase + Wide Tracking für Labels | Lowercase in der Navigation |

---

## Accessible Color Contrast
- `#2C2C2C` auf `#F0EDE8` → Kontrastverhältnis ~10:1 ✓ (WCAG AA)
- `#FFFFFF` auf `#1A1A1A` → Kontrastverhältnis ~17:1 ✓ (WCAG AAA)
- `#C9A96E` auf `#1A1A1A` → Kontrastverhältnis ~5.8:1 ✓ (WCAG AA für großen Text)
- `#C9A96E` auf `#F0EDE8` → Kontrastverhältnis ~2.4:1 ⚠️ — nur für dekorative Elemente, nicht für Fließtext

---

## Referenz-Inspiration
- tschmidt.properties — klares Layout, Qualitätspositionierung
- voelker.immo — elegantes Immobilien-Branding
