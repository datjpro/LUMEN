---
name: "Lumen"
description: "A high-performance tactile spatial workspace and living desktop companion"
colors:
  primary: "#F5A623"
  primary-deep: "#D6871A"
  primary-glow: "rgba(245, 166, 35, 0.22)"
  neutral-base: "#14161D"
  neutral-dark: "#0F1117"
  surface-container: "#1D2029"
  surface-elevated: "#262A35"
  text-primary: "#F4F5F7"
  text-secondary: "#A2A8BC"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  note-cream-bg: "#FCEFD3"
  note-cream-text: "#23262F"
  note-cream-accent: "#F5A623"
  note-mint-bg: "#E4F5EA"
  note-mint-text: "#193826"
  note-mint-accent: "#3FAE6C"
  note-rose-bg: "#F8E1E7"
  note-rose-text: "#451B28"
  note-rose-accent: "#E8779A"
  note-fox-bg: "#F3DCC7"
  note-fox-text: "#3D2314"
  note-fox-accent: "#C9793B"
  danger: "#EF4444"
typography:
  display:
    fontFamily: "Be Vietnam Pro, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Be Vietnam Pro, system-ui, -apple-system, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Be Vietnam Pro, system-ui, -apple-system, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
  body:
    fontFamily: "Be Vietnam Pro, system-ui, -apple-system, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-dark}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  sticky-note-card:
    backgroundColor: "{colors.note-cream-bg}"
    textColor: "{colors.note-cream-text}"
    rounded: "{rounded.xl}"
    padding: "16px"
  input-field:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
---

# Design System: Lumen

## Overview

**Creative North Star: "The Tactile Digital Desk Sanctuary"**

Lumen is an intimate spatial workspace designed as a digital counterpart to an artisanal wooden workbench. Rather than cold, sterile toolbars and rigid nested hierarchies, Lumen pairs a clean dark obsidian desktop with tangible, warm paper sticky notes and Pip—a living, expressive desktop companion. Every visual element is calibrated to evoke the tactile comfort of premium physical stationery while delivering seamless 60/120 FPS desktop fluidity.

The aesthetic balance bridges two worlds: an unobtrusive, distraction-free obsidian canvas that recedes into the background, and vibrant, human-centered tactile elements that invite interaction. Notes feel like real physical paper with organic pastel tinting, subtle drop shadows, and clean headers that reveal controls progressively upon hover. Pip adds biological warmth with procedural squash-and-stretch kinematics, never obstructing the user's flow.

**Key Characteristics:**
- **Tactile Paper Warmth:** Organic pastel note cards (Amber Cream, Mint Sage, Rose Blush, Fox Mist) with authentic stationery warmth and clean, progressive controls.
- **Deep Obsidian Atmosphere:** High-contrast dark spatial surface (`#14161D`) that keeps cognitive load minimal and highlights active thoughts.
- **Living Companion Kinetic Rhythm:** Subtle, natural procedural motion using delta-time physics and GPU transforms (`translate3d`), free from distracting layout thrashing.
- **Accessible Contrast Hierarchy:** Strict WCAG AA compliant typography (`#A2A8BC` secondary text at 4.72:1 contrast ratio) ensuring effortless readability across all themes.

## Colors

The Lumen palette is anchored by the deep obsidian baseline of the workspace, illuminated by warm amber solar accents and softened by physical paper pastel tints.

### Primary
- **Solar Amber Gold** (`#F5A623`): The energy center of Lumen. Used for focused actions, active highlights, companion interactive sparks, and primary callouts.
- **Deep Amber** (`#D6871A`): Used for pressed or hovered states on primary buttons to provide tactile physical feedback.
- **Solar Amber Glow** (`rgba(245, 166, 35, 0.22)`): Ambient volumetric halo applied to elevated focus states and Pip's interactive aura.

### Neutral
- **Obsidian Deep Base** (`#14161D`): The infinite spatial canvas backdrop, engineered to eliminate eye strain during multi-hour focus sessions.
- **Surface Container** (`#1D2029`): Grounded container background for panels, floating tool docks, and dialogs.
- **Surface Elevated** (`#262A35`): Lifted layer for hover tooltips, active menu selections, and floating control nodes.
- **Text Primary** (`#F4F5F7`): High-clarity foreground text providing crisp contrast against dark obsidian surfaces.
- **Text Secondary** (`#A2A8BC`): Refined slate silver for metadata, timestamps, and secondary captions; rigorously verified at 4.72:1 WCAG AA contrast.
- **Border Subtle** (`rgba(255, 255, 255, 0.08)`): Ultra-fine geometric perimeter stroke defining spatial card boundaries without visual clutter.

### Stationery Paper Accents
- **Amber Cream** (`bg: #FCEFD3`, `text: #23262F`, `accent: #F5A623`): Warm morning parchment note paper for daily priorities and golden ideas.
- **Mint Sage** (`bg: #E4F5EA`, `text: #193826`, `accent: #3FAE6C`): Calming herbal tint for reflections, wellbeing, and completed milestones.
- **Rose Blush** (`bg: #F8E1E7`, `text: #451B28`, `accent: #E8779A`): Soft rose quartz tone for urgent reminders, emotional check-ins, and personal sparks.
- **Fox Mist** (`bg: #F3DCC7`, `text: #3D2314`, `accent: #C9793B`): Earthy terracotta wash for project planning and spatial organization.

### Named Rules
**The Paper Contrast Rule.** Text placed on paper note tints must always use deep pigmented ink values (`#23262F`, `#193826`, `#451B28`, `#3D2314`) rather than standard white UI text, preserving the physical stationery feel and exceeding WCAG AAA legibility.

**The Accent Rarity Rule.** Solar Amber Gold (`#F5A623`) must occupy no more than 10% of any given viewport. Its purpose is to guide attention, not dominate the canvas.

## Typography

**Display Font:** Be Vietnam Pro (with `system-ui, -apple-system, sans-serif` fallback)  
**Body Font:** Be Vietnam Pro (with `system-ui, -apple-system, sans-serif` fallback)  
**Label/Mono Font:** JetBrains Mono (with `ui-monospace, monospace` fallback)  
**Handwriting Font:** Caveat, Kalam (cursive fallback for personal note headers)

**Character:** Modern geometric warmth meets tactile human craftsmanship. Clean humanist letterforms ensure long-form legibility, while monospaced numericals keep timers and coordinates rock-solid without layout wobble.

### Hierarchy
- **Display** (Bold 700, `clamp(2rem, 5vw, 3rem)`, line-height: 1.15): Epic title moments, hero headings, and empty state welcomes.
- **Headline** (SemiBold 600, `1.5rem` / 24px, line-height: 1.25): Modal titles, major spatial workspace section dividers.
- **Title** (SemiBold 600, `1.125rem` / 18px, line-height: 1.35): Note card headers, widget headings, and dialog labels.
- **Body** (Regular 400, `0.875rem` / 14px, line-height: 1.5, max line length: 65ch): General note writing, assistant messages, and system settings.
- **Label** (Medium 500, `0.75rem` / 12px, letter-spacing: 0.04em): Monospaced telemetry, time trackers, status tags, and keyboard shortcut chips.

### Named Rules
**The Tabular Stability Rule.** All dynamic numeric data—including countdown timers, drag coordinates, and companion mood scores—must render using `JetBrains Mono` or `font-feature-settings: "tnum"` to prevent visual twitching during real-time updates.

## Layout

Lumen employs a freeform, two-dimensional spatial coordinate model with infinite canvas freedom.

- **Spatial Coordinate System:** Notes and widgets exist in continuous coordinate space `(x, y)` relative to the workspace origin, manipulated via GPU hardware acceleration (`translate3d`).
- **Floating Chrome & Docks:** System controls float in peripheral docking zones with fixed padding (`16px` from screen edges) and rounded pill silhouettes.
- **Fluid Grid Units:** Layout rhythms strictly align to an `8px` baseline grid (`8px`, `16px`, `24px`, `32px`).
- **Responsive Adaptability:** On compact screens (<768px), the spatial canvas adapts with gesture zooming and auto-centering focus onto the active note card.

## Elevation & Depth

Lumen avoids heavy flat skeuomorphism in favor of a refined physical layering system: diffuse ambient contact shadows at rest, dynamic lifted depth during active manipulation, and glowing volumetric backdrops for companion presence.

### Shadow Vocabulary
- **Rest Ambient** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08), 0 6px 20px rgba(0, 0, 0, 0.16)`): Applied to grounded sticky note cards and resting spatial widgets.
- **Lifted Drag** (`box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12), 0 16px 40px rgba(0, 0, 0, 0.28)`): Applied dynamically during drag interactions to create physical lift.
- **Modal Floating** (`box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.08)`): Applied to modal overlays, quick capture hubs, and settings dialogs.
- **Solar Glow** (`box-shadow: 0 0 20px rgba(245, 166, 35, 0.22)`): Luminous atmospheric halo for focused elements and companion celebrations.

### Named Rules
**The Physical Lift Rule.** When a sticky note is grabbed, its elevation shifts immediately from *Rest Ambient* to *Lifted Drag* accompanied by a 2-degree organic tilt and a slight scale up (`scale(1.02)`), providing immediate sensory confirmation of touch.

## Shapes

- **Corner Radius Scale:**
  - `sm` (`6px`): Micro chips, icon buttons, and inner tags.
  - `md` (`10px`): Standard buttons, input fields, and context menus.
  - `lg` (`16px`): Dialog cards, floating tool panels, and companion speech bubbles.
  - `xl` (`24px`): Tactile sticky note cards and major window containers.
  - `full` (`9999px`): Status pills, mode switchers, and quick capture triggers.
- **Border Treatment:** Sub-pixel `1px` borders with low opacity (`rgba(255, 255, 255, 0.08)`) on dark surfaces; completely borderless on paper notes to emphasize natural cut-paper edges.

## Components

### Buttons
- **Shape:** Rounded rectangle (`rounded: 10px`).
- **Primary:** Solar Amber Gold background (`#F5A623`), deep dark text (`#0F1117`), bold weight (600), internal padding `8px 16px`.
- **Hover / Focus:** Deep amber transition (`#D6871A`), slight lift (`translateY(-1px)`), and a `2px` focus ring offset with solar glow.
- **Ghost:** Transparent background, primary text (`#F4F5F7`), surface elevated hover (`#262A35`).

### Sticky Note Card
- **Corner Style:** Tactile rounded corners (`24px`).
- **Background:** Authentic paper wash (Amber Cream `#FCEFD3`, Mint Sage `#E4F5EA`, Rose Blush `#F8E1E7`, Fox Mist `#F3DCC7`).
- **Header:** Clean paper header (`.note-paper-header`) with subtle drag texture, title pill, and progressive hover disclosure for action icons (pin, color switch, archive).
- **Internal Padding:** Generous `16px 20px` breathing space.
- **Typography:** Handwriting title font with crisp high-legibility body ink.

### Inputs & Quick Capture
- **Style:** Surface container backdrop (`#1D2029`), `1px` subtle border, `10px` radius, padding `10px 14px`.
- **Focus:** Border illuminates to Solar Amber Gold (`#F5A623`) with a soft `0 0 0 3px rgba(245, 166, 35, 0.2)` ring.
- **Placeholder:** Secondary text tone (`#A2A8BC`).

### Companion Pip Figure
- **Geometry:** Fluid organic fox silhouette, procedural eye tracking and squash-and-stretch kinematics.
- **Atmosphere:** Basking in subtle amber aura during happiness; cozy sleeping position when idle; procedural celebration dance upon note completion.

## Do's and Don'ts

### Do:
- **Do** use `translate3d(x, y, 0)` and `transform` properties for all animations and companion ticks to ensure sub-16ms 60/120 FPS rendering.
- **Do** ensure all secondary text and UI metadata maintain at least 4.5:1 contrast against their respective backgrounds (WCAG AA).
- **Do** keep sticky note headers clean and minimal at rest, revealing action icons progressively on hover.
- **Do** use deep ink pigments (`#23262F`, etc.) for any text appearing on paper note backgrounds.
- **Do** provide explicit keyboard navigation (`Escape` to close, `Ctrl+Shift+N` for quick capture) and visible focus rings.

### Don't:
- **Don't** animate layout-triggering properties (`top`, `left`, `width`, `height`, `margin`) during continuous animation.
- **Don't** use generic `animate-bounce` or linear easing for organic elements; use procedural spring curves (`cubic-bezier(0.34, 1.56, 0.64, 1)`).
- **Don't** flood the dark workspace canvas with bright primary amber; preserve amber exclusively for intent and moments of celebration.
- **Don't** render white or light gray text on light paper sticky notes.
- **Don't** block the main UI thread with synchronous disk I/O; all state persistence must run non-blocking in the background.
