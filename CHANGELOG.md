# 📋 Lumen Release Notes & Changelog

> **Version Control & Release Tracker:** All notable changes, spatial features, performance optimizations, and bug fixes across Lumen releases.

## 🚀 [v1.2.6] — 2026-09-21 — Background Video Playback Fix & Update Checker UI Prominence

### 🛠️ Bug Fixes & Desktop Shell Audio Hardening:
- **🎬 Khắc Phục Hoàn Toàn Lỗi Tạm Dừng Video Nền (YouTube/Browser/Media Player):**
  - Vô hiệu hóa các cờ Chromium Media Session & Hardware Media Keys (`HardwareMediaKeyHandling`, `MediaSessionService`, `VolumeNotification`, `AudioDuckScreenReader`) trong WebView2 thông qua biến môi trường `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS` trong [`main.rs`](file:///D:/Demo/cliff-clover-moon-tundra/src-tauri/src/main.rs#L5) và [`lib.rs`](file:///D:/Demo/cliff-clover-moon-tundra/src-tauri/src/lib.rs#L245).
  - Khởi tạo Web Audio Synthesizer với `latencyHint: "interactive"` và thiết lập `navigator.mediaSession.playbackState = "none"` trong [`audio.ts`](file:///D:/Demo/cliff-clover-moon-tundra/src/lib/audio.ts#L23), ngăn triệt để Web Audio chiếm quyền điều khiển SMTC của hệ điều hành Windows.
  - Loại bỏ các lệnh gọi `focus_window` / `window.show()` lặp đi lặp lại trên mỗi sự kiện `pointerdown` trong [`desktop-scene.tsx`](file:///D:/Demo/cliff-clover-moon-tundra/src/components/lumen/desktop-scene.tsx) và [`sticky-note.tsx`](file:///D:/Demo/cliff-clover-moon-tundra/src/components/lumen/sticky-note.tsx), bảo đảm Windows DWM không gửi tín hiệu hủy tiêu điểm (deactivate/kill-focus) làm đứng hình video của các ứng dụng chạy ngầm.

### 🔄 Trải Nghiệm Kiểm Tra & Quản Lý Cập Nhật (Update Checker UI Prominence):
- **🌟 Đưa Thẻ Kiểm Tra Cập Nhật Lên Đầu Tab Hệ Thống (Tab 4 — System & About):**
  - Chuyển toàn bộ khối "Phiên bản ứng dụng & Cập nhật" từ cuối Tab 2 (Tùy chọn) lên vị trí đầu tiên, nổi bật nhất của Tab 4 (Hệ thống & Thông tin) trong [`hub.tsx`](file:///D:/Demo/cliff-clover-moon-tundra/src/components/lumen/hub.tsx).
- **📋 Bổ Sung Mục "Kiểm Tra Cập Nhật" Vào Menu Khay Hệ Thống (System Tray):**
  - Thêm `🔄 Check for Updates... (Kiểm tra cập nhật)` trực tiếp vào menu chuột phải của biểu tượng Lumen dưới thanh Taskbar (`src-tauri/src/lib.rs`), cho phép kiểm tra phiên bản mới nhanh chóng mà không cần mở cài đặt.
- **⚡ Phím Tắt Tiêu Đề & Tự Động Kiểm Tra Khởi Động:**
  - Bổ sung huy hiệu phiên bản `v1.2.6` có thể nhấp trực tiếp trên thanh tiêu đề của bảng Cài Đặt để kiểm tra cập nhật tức thì.
  - Tích hợp trình quét cập nhật âm thầm sau 4 giây khởi động app và gửi thông báo nếu có bản phát hành mới trên GitHub `datjpro/LUMEN`.

---

## 🚀 [v1.2.5] — 2026-09-21 — Tauri Desktop Standalone Offline Fix & Native Click-Through Safeguard

### 🛠️ Tauri Desktop & Native Engine Hardening:
- **📦 Hoàn Thiện Cơ Chế Standalone Offline Cho File `.exe` (Tauri v2):**
  - Khai báo rõ ràng `"url": "index.html"` trong cấu hình cửa sổ chính của [`tauri.conf.json`](file:///D:/Demo/cliff-clover-moon-tundra/src-tauri/tauri.conf.json#L17), loại bỏ phụ thuộc ngầm vào `http://localhost:8080`.
  - Đóng gói toàn bộ tài nguyên tĩnh (`frontendDist: ../.vercel/output/static`) trực tiếp vào binary `.exe`, cho phép khởi chạy ngay mà không cần bật trước dev server.
- **🛡️ Khắc Phục Triệt Để Lỗi Khóa Chuột Khởi Động (Click-Through Lockout Safeguard):**
  - Thêm cờ đồng bộ `has_received_rects` vào [`AppState`](file:///D:/Demo/cliff-clover-moon-tundra/src-tauri/src/lib.rs#L146) trong Rust.
  - Ngăn chặn native thread tự động kích hoạt `set_ignore_cursor_events(true)` trước khi giao diện webview nạp hoàn tất và gửi tọa độ tương tác đầu tiên, đảm bảo người dùng không bao giờ bị đơ hay mất tương tác chuột.
- **⚡ Đồng Bộ Kho Lưu Trữ GitHub:**
  - Cập nhật định tuyến `GITHUB_REPO` chính thức về `datjpro/LUMEN` trong module cập nhật tự động.

---

## 🚀 [v1.2.4] — 2026-09-20 — Comprehensive Vietnamese Localization & Natural Phrasing

### 🌐 Ngôn Ngữ & Bản Địa Hóa Chuẩn Mực (Comprehensive Vietnamese Localization):
- **🇻🇳 Việt Hóa 100% Toàn Diện Mọi Giao Diện & Tiện Ích:**
  - Chuyển ngữ 100% tất cả các chuỗi hiển thị, chú giải công cụ (`tooltip`), bảng thoại (`dialog`), bảng cài đặt (`hub`), huy hiệu (`badge`), và lời thoại thú cưng sang tiếng Việt tự nhiên, trong sáng.
  - Loại bỏ triệt để các từ tiếng Anh đặt trong dấu ngoặc đơn (`(Amber)`, `(Mint)`, `(Rose)`, `(Fox)`, `(Checklist)`, `(Chuẩn Word)`, `(Multi-Timer)`, `(Setup)`, `(Uninstall)`, `(Khuyên dùng)`...).
- **🛠️ Chuẩn Hóa Thuật Ngữ Kỹ Thuật & Giám Sát Phần Cứng:**
  - Giữ lại các thuật ngữ và đơn vị chuyên môn quốc tế không thể dịch thay thế (`CPU`, `RAM`, `FPS`, `Alt+N`, `Alt+T`, `MB/s`, `KB/s`, `JSON`, `SQL`, `WIN32`, `HEAP`).
  - Dịch tự nhiên các cảnh báo hệ thống: `"CPU Quá tải"`, `"RAM Quá tải"`, `"Vi xử lý CPU"`, `"Bộ nhớ RAM"`, `"Luồng"`, `"Đã kết nối Internet"`, `"Mất kết nối"`.
- **🦊 Đồng Bộ Tên Loài Thú Cưng & Bảng Màu Note:**
  - Danh sách loài thú cưng: *"Cáo Nhỏ"*, *"Mèo Mướp"*, *"Chó Shiba"*, *"Rồng Con"*, *"Robot Trợ Lý"*.
  - Danh sách màu sắc giấy note: *"Vàng hổ phách"*, *"Xanh bạc hà"*, *"Hồng phấn"*, *"Cam cáo lửa"*.

---

## 🚀 [v1.2.3] — 2026-09-20 — Hover-Reveal Paper Drag Dock & Note Creation Isolation

### 🛠️ Bug Fixes & UX Ergonomics:
- **🎯 Hover-Reveal Drag Dock (`📝 Kéo Note`):**
  - Tinh chỉnh dock kéo note chỉ xuất hiện mượt mà khi người dùng di chuột (`hover`) vào khu vực logo launcher.
  - Khi không trỏ chuột, giao diện giữ trạng thái tối giản, tinh gọn với duy nhất nút logo Lumen.
- **✨ Khắc Phục Lỗi Tạo Trùng 2 Note (Zero Double-Spawn):**
  - Tách biệt hoàn toàn thao tác click mở Quick Capture (`Alt+N`) trong Action Hub khỏi trình bắt sự kiện kéo thả con trỏ (`pointer capture`).
  - Đảm bảo khi nhấp vào nút "Ghi chú", hệ thống chỉ mở giao diện nhập liệu nhanh duy nhất và không bị tạo ngầm ghi chú thứ hai trên desktop.

---

## 🚀 [v1.2.2] — 2026-09-20 — PRO Trial Gating, SVIP Locked Tier & Drag-to-Place Note Restoration

### ✨ Enhancements & Tier System Evolution:
- **🔒 Strict SVIP Locked Tier Policy:**
  - Transitioned tier naming model into **FREE**, **PRO**, and **SVIP** (retiring legacy VIP terminology).
  - SVIP Master tier is strictly locked with disabled activation (`cursor-not-allowed`, `Lock` badge), preventing unreleased access.
  - Store validator strictly blocks any SVIP trial or manual key attempts with clear guidance that trials are exclusively for the PRO tier.
- **🎁 Exclusive 3-Day PRO Trial Gating:**
  - Free 3-day trial pass (`LUMENTRIAL3DAY` / `PROTRIAL`) is restricted specifically to unlock the **PRO** tier.
  - Clear countdown indicator and instant 1-click trial activation button in the license modal.
- **📝 Restored & Refined Drag-to-Place Spatial Note Gesture:**
  - Added a dedicated floating **Paper Drag Dock** (`📝 Kéo Note`) beside the main bottom launcher capsule.
  - Live ghost note preview follows cursor during drag gesture and places a new sticky note at exact drop coordinates $(x, y)$ on canvas release ($>25\text{px}$).
  - Fully supports both 1-click spawn and spatial drag-and-drop placement anywhere on screen.

---

## 🚀 [v1.2.1] — 2026-09-20 — System Telemetry Accuracy & UI Decluttering Optimization

### 🔧 Fixes & Telemetry Inaccuracy Resolutions:
- **🎯 Authentic Native Hardware Telemetry (Win32 & Tauri v2):**
  - Added native `get_system_metrics` command in Rust using `windows-sys` (`GlobalMemoryStatusEx`, `GetSystemTimes`, `GetSystemPowerStatus`).
  - Sub-millisecond physical RAM calculation (Exact Total MB, Available MB, OS Memory Load %).
  - Exact CPU% load calculated from system time delta (matching Windows Task Manager).
  - Accurate battery percentage & AC charging status directly from Windows kernel.
- **🌐 Honest Web/Browser Heap & FPS Sampling:**
  - Removed all fake jitter & random math spikes (`Math.random()`) that previously generated unrealistic CPU oscillation.
  - Accurately labeled and sampled JavaScript Heap Memory (`performance.memory`) when running in browser mode.
  - Integrated live 60/120 FPS UI frame budget tracking.
  - Connected live telemetry into Settings Hub ("Hệ thống") with clear `[Win32 Native]` vs `[Web Engine]` badges.

### 🎨 UI Optimization & Workspace Decluttering:
- **🌿 Clean-by-Default Spatial Desktop:**
  - HUD and secondary widgets default to hidden (`enabled: false`) upon startup, keeping the workspace pristine and zen.
- **⚡ Streamlined Floating Action Hub:**
  - Redesigned floating tray into an organized 2x2 primary action grid (`Alt+N`, `Alt+T`, `Alt+C`, `Alt+F`).
  - Added clean workspace control pills (`Alt+A`, `Alt+O`, `Alt+P`) and 1-click widget toggle strip.
  - Removed intrusive hover popups for an artisanal, lightweight desktop experience.

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

