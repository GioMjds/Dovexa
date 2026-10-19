---
name: Dovexa
description: A private, fast, self-owned personal CRM for remembering people and never missing a follow-up.
colors:
  primary: '#4f46e5'
  primary-dark: '#818cf8'
  background: '#f8fafc'
  background-dark: '#0b1120'
  foreground: '#0f172a'
  foreground-dark: '#f1f5f9'
  card: '#ffffff'
  card-dark: '#111827'
  muted: '#f1f5f9'
  muted-dark: '#1f2937'
  muted-foreground: '#64748b'
  muted-foreground-dark: '#94a3b8'
  accent: '#eef2ff'
  accent-dark: '#1e1b4b'
  accent-foreground: '#3730a3'
  accent-foreground-dark: '#c7d2fe'
  border: '#e2e8f0'
  border-dark: '#1f2937'
  destructive: '#dc2626'
  destructive-dark: '#f87171'
  success: '#15803d'
  warning: '#b45309'
  info: '#0369a1'
typography:
  display:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: 'clamp(2rem, 4vw, 3rem)'
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: '-0.03em'
  headline:
    fontFamily: "Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1.5rem'
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: '-0.02em'
  title:
    fontFamily: "Google Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '1.125rem'
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: '-0.01em'
  body:
    fontFamily: "Google Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '0.9375rem'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 'normal'
  label:
    fontFamily: "Google Sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: '0.75rem'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '0.02em'
rounded:
  sm: '6px'
  md: '8px'
  lg: '10px'
  xl: '14px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
components:
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '#ffffff'
    rounded: '{rounded.md}'
    padding: '8px 16px'
  button-secondary:
    backgroundColor: '{colors.muted}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.md}'
    padding: '8px 16px'
  card:
    backgroundColor: '{colors.card}'
    textColor: '{colors.foreground}'
    rounded: '{rounded.lg}'
    padding: '16px'
---

# Design System: Dovexa

## 1. Overview

**Creative North Star: "The Focused Operator"**

Dovexa is a sharp, uncluttered command center built for decisive action and instant recall. Designed for solo professionals and founders managing personal and professional relationships, every element is tuned for speed, density, and clarity. The interface recedes quietly into the background until summoned, prioritizing rapid data entry and calm prioritization over decorative noise.

The visual system explicitly rejects the bloated visual idioms of enterprise sales platforms. There are no conversion funnels, pipeline Kanban boards, aggressive KPI metrics, or patronizing gamification. Instead, Dovexa channels the focused, utilitarian craft of Linear and Raycast: crisp 1px borders, subtle surface shifts, rapid keyboard navigation, and immediate responsiveness.

**Key Characteristics:**

- **Utilitarian density:** Balanced whitespace designed for efficient scanning without feeling claustrophobic.
- **Subtle tonal layering:** 1px borders and slight background shifts define structure; depth is functional, never decorative.
- **Keyboard-native immediacy:** Clear visual focus rings and prominent keybinding affordances across all primary actions.
- **Quiet restraint:** Color is reserved strictly for focal points, priority indicators, and interactive states.

## 2. Colors

The palette is anchored by deep slate neutrals with a precise, high-energy electric indigo accent reserved for primary actions.

### Primary

- **Electric Indigo** (`#4f46e5` / dark: `#818cf8`): The signature interactive hue. Applied strictly to primary action triggers, active tab indicators, and current focus boundaries. Never used as a large-area background fill.

### Secondary

- **Slate Accent** (`#eef2ff` / dark: `#1e1b4b`): Soft tinted wash used for highlighted selection rows, active badge backgrounds, and secondary focus states.
- **Deep Accent Foreground** (`#3730a3` / dark: `#c7d2fe`): Paired text color on slate accent surfaces.

### Neutral

- **Background Canvas** (`#f8fafc` / dark: `#0b1120`): Crisp, slightly cool base canvas.
- **Card Surface** (`#ffffff` / dark: `#111827`): Clean elevated container surface.
- **Subtle Fill / Muted** (`#f1f5f9` / dark: `#1f2937`): Secondary buttons, input backgrounds, and table header rows.
- **Primary Ink / Foreground** (`#0f172a` / dark: `#f1f5f9`): High-contrast typography meeting WCAG AA requirements across both modes.
- **Muted Ink / Secondary Text** (`#64748b` / dark: `#94a3b8`): Metadata, timestamps, and placeholder labels.
- **Structural Border** (`#e2e8f0` / dark: `#1f2937`): Crisp 1px boundary dividing panels, rows, and cards.

### Semantic

- **Destructive** (`#dc2626` / dark: `#f87171`): Hard delete warnings and irreversible actions.
- **Success** (`#15803d` / soft: `#dcfce7`): Confirmed syncs and logged interaction completions.
- **Warning** (`#b45309` / soft: `#fef3c7`): Overdue follow-up alerts and approaching cadences.
- **Info** (`#0369a1` / soft: `#e0f2fe`): System notifications and informative badges.

### Named Rules

**The Rarity Rule.** Primary accent color (`#4f46e5`) must occupy no more than 10% of any visible viewport. Its scarcity ensures instant visual prioritization.
**The No-Colored-Stripe Rule.** Never use thick 2px+ colored left borders on cards or list items for status. Convey state with subtle badges or semantic chips instead.

## 3. Typography

**Display Font:** Plus Jakarta Sans (fallback: -apple-system, BlinkMacSystemFont, sans-serif)
**Body Font:** Google Sans (fallback: -apple-system, BlinkMacSystemFont, sans-serif)
**Mono Font:** Geist Mono / monospace

**Character:** Plus Jakarta Sans provides crisp, contemporary geometric headings with tight display geometry, while Google Sans delivers clean, legible body text for fast reading and low fatigue.

### Hierarchy

- **Display** (Bold 700, `clamp(2rem, 4vw, 3rem)`, line-height 1.15, letter-spacing -0.03em): High-level section anchors and modal titles.
- **Headline** (Semi-bold 600, `1.5rem` [24px], line-height 1.3, letter-spacing -0.02em): Page headers, contact names, and organization banners.
- **Title** (Semi-bold 600, `1.125rem` [18px], line-height 1.4, letter-spacing -0.01em): Card titles, group dividers, and timeline dates.
- **Body** (Regular 400, `0.9375rem` [15px], line-height 1.5, normal spacing): Interaction logs, notes, and profile details. Max line length capped at 65–75ch.
- **Label** (Medium 500, `0.75rem` [12px], line-height 1, letter-spacing 0.02em): Metadata chips, status tags, table column headers, and keyboard shortcuts.

### Named Rules

**The Balance Rule.** Always apply `text-wrap: balance` to H1–H3 headers to ensure even optical weight across lines.
**The Floor Rule.** Display letter-spacing must never drop tighter than -0.04em; keep headlines sharp, not cramped.

## 4. Elevation

Surfaces are flat at rest. Depth is established through subtle background differentiation (`#ffffff` cards against `#f8fafc` canvas) and crisp 1px borders (`#e2e8f0`). Shadows are structural, not decorative: they appear only on floating overlays, dropdowns, and modal dialogs to establish z-index separation.

### Shadow Vocabulary

- **Overlay Dropdown** (`box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08)`): Popovers, select menus, and command palettes.
- **Modal Dialog** (`box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16)`): Centered modal dialogs requiring focus isolation.

### Named Rules

**The Flat-At-Rest Rule.** In-page cards and list containers must remain completely flat without ambient drop shadows. Elevation is reserved strictly for detached overlays.

## 5. Components

Components are restrained, responsive, and tactile. Micro-interactions are snappy with zero elastic bounce.

### Buttons

- **Shape:** Gently curved corners (`rounded-md`, 8px radius).
- **Primary:** Background `#4f46e5`, text `#ffffff`, padding `8px 16px`. On hover: `#4338ca`. On active: slight scale down (`scale-[0.99]`).
- **Secondary / Muted:** Background `#f1f5f9` (`#1f2937` in dark), text `#0f172a`, border 1px solid `#e2e8f0`. Hover: `#e2e8f0`.
- **Ghost:** Transparent background with subtle hover wash. Ideal for toolbar shortcuts and row actions.
- **Focus:** 2px high-contrast outline offset by 2px (`ring-2 ring-primary ring-offset-2`).

### Cards / Containers

- **Corner Style:** 10px radius (`rounded-lg`). Never exceed 12px.
- **Background:** Crisp solid white (`#ffffff` / dark `#111827`).
- **Border:** 1px solid `#e2e8f0` (`#1f2937` in dark).
- **Internal Padding:** 16px (`p-4`) standard; 20px (`p-5`) for overview summaries.

### Inputs / Fields

- **Style:** 1px solid border (`#e2e8f0`), background `#ffffff`, radius 8px (`rounded-md`), padding `8px 12px`.
- **Focus:** Sharp border shift to `#4f46e5` with subtle 2px ring outline.
- **Placeholder:** High-contrast neutral `#64748b` (never washed out).

### Chips / Tags

- **Style:** Compact pill or 6px rounded tag (`rounded-sm`), padding `2px 8px`, font size 12px (`text-xs`).
- **Coloring:** Subtle tinted background matching tag category with high-contrast text.

## 6. Do's and Don'ts

### Do:

- **Do** prioritize keyboard shortcuts with visible shortcut indicators (`⌘K`, `C`, `L`).
- **Do** use 1px solid borders (`#e2e8f0`) to structure cards and timeline records.
- **Do** maintain a strict 4.5:1 text contrast ratio on all body copy, inputs, and placeholders.
- **Do** cap body text line length at 65–75ch for effortless reading.
- **Do** provide instant visual feedback on interactive states via fast transitions (150ms ease-out).

### Don't:

- **Don't** add enterprise SaaS bloat: no deal stages, sales pipelines, conversion funnels, or aggressive quota badges (Salesforce, HubSpot anti-patterns).
- **Don't** use playground / toy aesthetics: no cartoon mascots, confetti bursts, hand-drawn doodles, or patronizing gamification.
- **Don't** fall into unstructured spreadsheet fatigue: do not render raw unstyled Airtable grids without clear relational hierarchy.
- **Don't** use thick side-stripe accent borders (`border-l-4`) on cards or alerts.
- **Don't** use text gradients or blurred glassmorphism on utilitarian dashboard surfaces.
- **Don't** use oversized border-radii (24px+) on content cards.
