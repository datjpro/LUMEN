# 📋 Lumen Release Notes & Changelog

> **Version Control & Release Tracker:** All notable changes, spatial features, performance optimizations, and bug fixes across Lumen releases.

---

## 🚀 [v1.2.0] — 2026-09-20 — Phase 5: Spatial Widget Ecosystem & System HUD Monitor

### ✨ What's New:
- **📊 System HUD Hardware Monitor Capsule:**
  - Real-time CPU%, RAM%, Network Speed (KB/s), and Battery status monitoring with 60 FPS GPU-composited SVG Sparklines.
  - Automatic High-Load alert badge when CPU or RAM exceeds 85%.
  - Configurable 6-position screen dock (`top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`).
- **🍅 Pomodoro Matrix Deep Focus Widget:**
  - Full Pomodoro cycles: 25m work, 5m short break, 15m long break with automated cycle counting.
  - Optional Focus Dimming overlay that softly dims canvas background notes during focus sessions.
  - Procedural soft woodblock ticking audio and completion chimes.
- **💧 Daily Habits & Water Intake Tracker:**
  - Interactive water glass intake tracker with droplet sound effects and daily goals.
  - Daily habit streak tracking (🔥 streak counters) with inline habit creation and check-in.
- **📝 Quick Scratchpad & Code Runner:**
  - Multi-syntax code editor (JavaScript, Python, JSON, SQL, Markdown, Plain Text).
  - 1-click clipboard copy and direct canvas sticker conversion ("Dán note ra desktop").
- **⚡ Spotlight 2.0 Live Calculator & Unit Converter:**
  - Live math evaluation (`(15 * 8) + 400`, `15% of 250`, `sqrt(144)`).
  - Benchmark currency converter (`100 usd in vnd`, `50 eur to vnd`).
  - Storage unit converter (`1024 mb in gb`) and length/temperature conversions.
  - Snippets Vault integration and quick action shortcuts (`> pomodoro`, `> hud`, `> arrange`, `> habit`).

---

## 🚀 [v1.1.1] — 2026-09-08 — Streamlined Today's Agenda, Collapsible Mini-Pill & Click-Through Fix

### 🛠️ Bug Fixes & UX Optimizations:
- **📅 Streamlined Today's Agenda Widget:**
  - Slimmed compact calendar width to `w-64 sm:w-68` with ultra-clean single-line items (checkbox + title + time range).
  - Purged redundant cards, descriptions, and visual clutter to keep desktop footprint minimal.
  - Added streamlined empty state with quick `+ Thêm` action.
- **💊 Collapsible Mini-Pill & Hide Action:**
  - Added `-` (Minus) button to collapse Today's Agenda into an ultra-minimal floating capsule pill (`[ 📅 Hôm nay • N ]`).
  - Added `👁️‍🗨️` (EyeOff) button and `Escape` key shortcut to hide the Agenda entirely.
  - Added dedicated System Tray menu item (`📅 Calendar & Agenda (Alt+C)`) in Tauri to easily reopen at any time.
- **🖱️ Native Desktop Transparent Click-Through Fix:**
  - Resolved transparent background hit-testing across Electron and Tauri shells.
  - Non-modal regions allow 100% click-through to underlying OS and desktop apps without interference.

---

## 🚀 [v1.1.0] — 2026-09-07 — In-App Update Engine & Spatial Calendar Evolution

### ✨ What's New:
- **🔄 Smart In-App Update Checker & Offline Guard:**
  - On-demand update verification without startup network polling.
  - Automatic offline detection via `navigator.onLine` with friendly warning notifications.
  - Rich Update Notification Modal displaying release highlights, badges, and version comparison.
  - Three distinct user actions: **"Cập nhật ngay (Update Now)"**, **"Bỏ qua bản này (Skip version)"**, and **"Nhắc tôi sau (Remind Later)"**.

- **📅 Standalone Spatial Calendar & Planner (`Alt+C`):**
  - Fully decoupled standalone calendar module with independent state management.
  - Expansive dual-pane view with month matrix and date-specific agenda breakdown.
  - Compact mini-capsule widget strictly scoped to **Today's Agenda** with 4-corner screen docking.
  - Two-way interactive linkage between sticky notes and calendar events.

- **🎯 24H Tactical Barrel-Wheel Scope Time Picker:**
  - Precision rotary time selector with mechanical audio clicks and haptic-style auditory feedback.
  - Infinite smooth wrapping for hours (`00-23`) and minutes (`00-59`).
  - Fluid containment sub-modal design preventing layout overflow.

- **🎁 3-Day Pro Trial Engine (Code: `LUMENTRIAL3DAY`):**
  - Revamped luxury Pro upgrade modal with live plan status cards.
  - Instant 3-day full Pro trial activation using pass code `LUMENTRIAL3DAY`.
  - Real-time countdown timer tracking remaining trial days and hours.

- **🛡️ Bug Fixes & UX Polish:**
  - Fixed modal containment scaling to prevent form overflow.
  - Form editing embedded in-place to prevent accidental data loss on outside clicks.
  - 100% purged seed/mock placeholder data from local storage.

---

## 🌟 [v1.0.1] — 2026-09-07 — Pro Upgrade & Stability Pass

### ✨ Highlights:
- **👑 Pro License System:** Support for lifetime Pro activation and temporary trial periods.
- **⚡ GPU Compositing Polish:** 60-120 FPS continuous rendering with optimized OS click-through IPC toggling.

---

## 🌟 [v1.0.0] — 2026-09-01 — Official Genesis Desktop Release

### ✨ Core Features:
- **🐾 Interactive Pip Companion:** 5 procedural pet species (Fox, Cat, Shiba Inu, Dragon, Cyber) with wardrobe studio, ball toy, and automated paper delivery.
- **📝 Spatial Sticky Notes Canvas:** 360° continuous rotation with magnetic bezel snapping, Microsoft Word font sizing, and opacity adjustment.
- **⏱️ Natural Language Smart Timers:** Parser for timer syntax (`"Pomodoro 25p"`, `"xây nhà trong COC 2h14p"`) with 4 procedural synthesized high-volume alarm melodies.
- **🔍 Spotlight Search (`Alt+F`):** Real-time fuzzy query across notes, checklists, and clusters.

