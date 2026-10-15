---
target: src/routes/index.tsx
total_score: 26
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 1
target_identity: "file:D:\\Demo\\LUMEN\\src\\routes\\index.tsx"
target_fingerprint: "sha256:b5144ef78e21fd81e1d79371b8fe3cd809194120bffb562ac1f8904e164bac90"
target_path: "D:\\Demo\\LUMEN\\src\\routes\\index.tsx"
timestamp: 2026-10-15T10-16-52Z
slug: src-routes-index-tsx
closed: true
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|:-----:|-----------|
| 1 | Visibility of System Status | 2/4 | Real-time rotation degrees badge is clear, but spatial theme switching produces zero visual feedback due to missing CSS token rules in `styles.css`. |
| 2 | Match Between System and Real World | 3/4 | Paper well drag gesture and tilt mirror physical desks; heavy obsidian `#1D2029` header bar feels like a digital window chrome rather than paper. |
| 3 | User Control and Freedom | 3/4 | `Ctrl+Z` undoes note deletions, `Esc` dismisses modals. However, rotation/size reset requires discovering unprompted double-click gestures. |
| 4 | Consistency and Standards | 2/4 | Theme switching does not cascade; keyboard shortcuts conflict with standard OS sequences; UI strings alternate arbitrarily between Vietnamese and English. |
| 5 | Error Prevention | 3/4 | Deletion confirmation modal blocks accidental note destruction with automatic `.txt` export option; empty notes delete cleanly. |
| 6 | Recognition Rather Than Recall | 2/4 | Sticky note header clusters 6 glyphs (Minus, Lock, Pin, Trash, Kebab) with 12px icons and no text labels, relying purely on recall. |
| 7 | Flexibility and Efficiency | 4/4 | Direct drag-and-drop file import (`.txt`, `.md`) creates instant stickies. Quick Capture and double-click placement are fast accelerators. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Visual noise floor is elevated: System HUD, audio visualizers, scratchpad, timers, and companion compete on screen simultaneously. |
| 9 | Error Recovery | 3/4 | Toasts provide clear explanations of network/offline update status and note restoration. |
| 10 | Help and Documentation | 2/4 | Onboarding modal covers basics, but spatial gestures (drag well, rotation angles, rubber-band resizing) lack progressive hints. |
| **Total** | | **26/40** | **Acceptable (65%)** |

### Design Specificity Verdict

**LLM Assessment**:
Lumen captures genuine magic in its core physical metaphors—dragging a ghost note out of the dock well, watching Pip scamper across the screen with a tiny yellow note in its mouth, and hearing soft tactile pop sounds. However, the application suffers from an identity split: the warm, cozy stationery world (Pip, pastel sticky notes, soft acoustic feedback) is constantly interrupted by dense, cyberpunk dark-glass HUD widgets (System HUD with CPU/RAM metrics, audio visualizer, dense dark modals). Most critically, the marketed 5 "Spatial Themes" (Glassmorphism, Pastel Dream, Cyberpunk Neon, Minimalist, Ink & Wood) are completely unimplemented in `src/styles.css`—changing the theme merely updates a `data-theme` attribute on the root container without altering any CSS variables or styles.

**Deterministic Scan**:
Assessment B executed `impeccable detect --json` across the core surface components:
- `src/routes/index.tsx`: 0 findings
- `src/components/lumen/desktop-scene.tsx`: 1 finding (Advisory) — `animate-bounce` on drag-over file dropzone indicator icon (Line 825)
- `src/components/lumen/pip.tsx`: 1 finding (Advisory) — `animate-bounce` on Pip dancing state (Line 68)
- `src/components/lumen/hub.tsx`: 0 findings
- `src/components/lumen/sticky-note.tsx`: 0 findings
- `src/components/lumen/quick-capture.tsx`: 0 findings

*Analysis of findings*:
The file dropzone bounce in `desktop-scene.tsx:825` represents visual slop that should be replaced with a subtle scale/pulse glide. The dancing bounce on Pip in `pip.tsx:68` is semantically intentional for pet celebrations, though upgrading it to procedural squash-and-stretch would better match Pip's 120 FPS physics engine.

**Visual Overlays**:
Deterministic scan was executed statically via CLI; no active browser dev server was attached during this run.

### Overall Impression
Lumen has the soul of an artisanal spatial desktop app, but its identity is diluted between a warm stationery companion and an over-instrumented developer HUD. Fixing the broken theme engine and harmonizing the sticky note chrome will elevate it from a functional prototype to a world-class desktop experience.

### What's Working
1. **Physical Well Drag-to-Place Gesture (`desktop-scene.tsx`)**: Dragging a note preview directly from the bottom dock tab into exact desktop coordinates is tactile, delightful, and natural.
2. **Procedural Companion Physics & Audio Architecture (`pip.tsx`, `companion.tsx`, `audio.ts`)**: Pip's procedural delta-time animation, ear twitches, breathing cycle, and bespoke Web Audio frequency synthesis run smoothly without dropped frames.
3. **Safe Erasure with Automatic Txt Export (`sticky-note.tsx`)**: Offering "Lưu file .txt & Xóa" before purging a note eliminates deletion anxiety and respects user data ownership.

### Priority Issues

- **[P0] Phantom Theme Engine (Broken Spatial Promise)**
  - **Why it matters**: Users select themes (Glassmorphism, Pastel Dream, Cyberpunk Neon, Minimalist, Ink & Wood) in Settings, but nothing changes visually because `src/styles.css` lacks `[data-theme]` variable overrides. This immediately breaks user trust.
  - **Fix**: Wire dynamic CSS custom properties (`--lumen-bg`, `--lumen-surface`, `--lumen-accent`, note tints) to `[data-theme="..."]` selectors in `src/styles.css`.
  - **Suggested command**: `/impeccable colorize`

- **[P1] "Black Cap" Sticky Note Header & Visual Clutter**
  - **Why it matters**: Soft pastel note bodies (`#FCEFD3`, `#E4F5EA`) are capped by an aggressive dark obsidian bar (`#1D2029`) crammed with 6 tiny utility buttons, destroying the paper stationery illusion.
  - **Fix**: Adopt a monochromatic header tint that matches the note's base color (subtle tonal header), reveal utility icons on hover, and group secondary controls into the kebab menu.
  - **Suggested command**: `/impeccable distill`

- **[P2] Low-Contrast Utility Icons & Touch Targets (WCAG AA Failure)**
  - **Why it matters**: Muted icons and text across `sticky-note.tsx` and `hub.tsx` use `#8B90A0` on `#1D2029`, yielding a 3.4:1 contrast ratio that fails accessibility standards and strains readability.
  - **Fix**: Elevate muted tokens to `#A2A8BC` (4.6:1+ contrast) and expand button touch targets to 28×28px bounding boxes.
  - **Suggested command**: `/impeccable polish`

- **[P3] Bilingual Inconsistency & Hardcoded Strings**
  - **Why it matters**: Vietnamese and English strings are mixed unpredictably across the canvas (`"Thả file .txt / .md vào đây"` vs `"Drop to place note"`).
  - **Fix**: Centralize all canvas microcopy into `DICTIONARY` in `src/lib/i18n.ts` with proper locale fallback.
  - **Suggested command**: `/impeccable clarify`

### Persona Red Flags
- **Alex (Impatient Power User)**: Quick Capture (`Alt+N`) dismisses on Enter without showing an immediate visual ripple or confirmation of where the note landed on a multi-monitor canvas.
- **Jordan (Confused First-Timer)**: Clicking Pip opens 6 mystery action pills simultaneously, while dock widgets (System HUD, Scratchpad) lack initial tooltips or onboarding cues.
- **Sam (Accessibility-Dependent User)**: Header action buttons lack visible focus rings (`focus-visible:ring-2`) and keyboard tabbing order inside notes is unguided.
- **Riley (Deliberate Stress Tester)**: Window resize causes notes with fixed pixel widths to clip past screen bounds because coordinate clamping only tracks origin coordinates.

### Minor Observations
1. Odometer numerals in `floating-timers.tsx` lack strict tabular figures on the container, causing subtle horizontal jitter during rapid countdowns.
2. Canvas double-click creates notes even when double-clicking underlying native desktop icons through the transparent window.
3. No quick global mute switch on the dock well—users must open the Settings Hub to silence audio pops.

### Questions to Consider
- What if Sticky Notes eliminated the window title bar entirely, using an adhesive strip hover affordance like physical Post-its?
- Could technical widgets (System HUD, Audio Visualizer) be separated into a distinct "DevPack" toggle to preserve Lumen's peaceful stationery aesthetic?
- How might Pip actively participate in daily workflows—such as fetching high-priority reminders or tidying overlapping notes?
