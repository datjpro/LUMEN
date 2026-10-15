# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Knowledge workers, creative professionals, developers, students, and digital stationery lovers who spend long hours at desktop computers and want a calm, aesthetic desktop sanctuary to capture thoughts and maintain focus without heavy SaaS clutter.

## Product Purpose
Lumen provides an artisanal spatial desktop companion and digital stationery workspace. It replaces clinical, browser-bound note tools with an organic, transparent desk environment where thoughts float freely as physical-feeling paper notes alongside Pip, a delightful procedural desk companion.

## Positioning
An artisanal, local-first spatial desk sanctuary combining procedural companion physics with authentic physical stationery aesthetics (subtle washi paper, 360° tilt, magnetic snap, tactile audio) that runs at 60/120 FPS under a <30MB RAM footprint without stealing focus or occluding background desktop video.

## Operating Context
- Operating Environments: Cross-platform transparent desktop overlay and windowed environment (Windows 11/10, macOS, Linux) delivered via dual-desktop runtimes (Tauri v2 + Rust and Electron).
- Local-First Architecture: 100% user data ownership stored locally in client-side persistence (Zustand persist / IndexedDB / SQLite); completely offline-functional with zero tracking or mandatory cloud accounts.
- Daily Rituals: Continuous background desktop presence, rapid thought capture via collision-free hotkeys (`Alt+N`), gentle Pomodoro focus sessions with dimming overlays, and natural language timer management.

## Capabilities and Constraints
- Capabilities:
  - Procedural Desk Pet (Pip): Skeletal SVG animations, 5 species (Fox, Cat, Shiba, Dragon, Cyber), wardrobe gear, ball-chasing, petting squash dynamics, and automated note-fetching choreography.
  - Spatial Sticky Notes: 360° free continuous rotation with magnetic 0° snap, drag-to-place ghost dock, capsule minimize mode, position locking, and automatic `.txt` export on deletion.
  - Spatial Theme Engine: 5 distinct desktop atmospheres (`ink`, `glass`, `pastel`, `cyberpunk`, `minimalist`) driven by dynamic CSS custom properties.
  - Standalone 24H Rotary Calendar: Dual-pane matrix view, tactical barrel-wheel time picker with mechanical sound synthesis, RFC-5545 iCalendar import/export, and 2-way note conversion.
  - Deep Focus & Utilities: Pomodoro timer with background dimming, habit & water tracker, multi-syntax scratchpad, spotlight search with math/currency conversion, and natural language timers.
  - System Telemetry: Lightweight GPU-composited 60 FPS hardware monitor (CPU, RAM, battery) with high-load threshold badges.
- Technical Constraints:
  - Sub-16ms render budget: Only compositor-friendly properties (`transform`, `opacity`, `translate3d`) animated during runtime loops.
  - Zero memory leaks: Strict teardown of all event listeners, intervals, and audio contexts (`ctx.suspend()` after 100ms idle).
  - Background Video Safety: Sub-pixel window borders (`x: 1, y: 1, w: -2, h: -4`) and disabled Chromium window occlusion to ensure YouTube/Netflix video players never stutter in background.

## Brand Commitments
- Name: Lumen.
- Companion Mascot: Pip (the adventurous little fox wearing a golden backpack).
- Core Brand Accent: Lumen Amber (`#F5A623`), Warm Dark Surface (`#1D2029`, `#14161D`), and authentic pastel paper tints (Amber Cream, Mint Sage, Rose Blush, Fox Mist).
- Voice & Tone: Warm, respectful, understated, calm, and artisanal. Never patronizing, aggressive, or corporate-jargon heavy.
- Language: Bilingual first-class citizenship (Vietnamese and English).

## Evidence on Hand
- Codebase with 251/251 passing automated tests across 15 suites ([scripts/test-suite.mjs](file:///D:/Demo/LUMEN/scripts/test-suite.mjs)).
- Fully tokenized theme engine in [src/styles.css](file:///D:/Demo/LUMEN/src/styles.css) and clean paper note header in [src/components/lumen/sticky-note.tsx](file:///D:/Demo/LUMEN/src/components/lumen/sticky-note.tsx).
- Complete documentation in [README.md](file:///D:/Demo/LUMEN/README.md) and engineering directives in [AGENTS.md](file:///D:/Demo/LUMEN/AGENTS.md).

## Product Principles
1. **Calm Over Clutter:** The desktop is a personal sanctuary; features must whisper until called upon, and resting surfaces must minimize visual noise.
2. **Tactile Digital Craftsmanship:** Interactions should carry the physical warmth of real stationery—gentle paper tilt, acoustic pop feedback, and magnetic snapping.
3. **Local-First Data Ownership:** User data belongs entirely to the user, stored on their machine, instantly loadable, and exportable with zero lock-in.
4. **Sub-16ms Performance Integrity:** High aesthetic ambition must never cost battery or cause frame drops; memory stays under 30MB idle and rendering stays locked at 60/120 FPS.

## Accessibility & Inclusion
- Contrast standard: WCAG AA compliant (minimum 4.5:1 on text and interactive controls; pastel notes deliver 11:1+ contrast).
- Keyboard accessibility: Visible focus rings (`focus-visible:ring-2 focus-visible:ring-[#F5A623]`) on all controls; full keyboard dismiss via `Escape`.
- Motion reduction: Full `@media (prefers-reduced-motion: reduce)` support instantly disables non-essential animations.
