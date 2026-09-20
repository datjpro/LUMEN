# 🗺️ LUMEN DESKTOP ENGINEERING ROADMAP & DEVELOPMENT PHASES

> **Project:** Lumen — Pure Transparent Desktop Overlay, Spatial Sticky Notes & Virtual Companion  
> **Target Platforms:** Windows (x64/ARM64), macOS (Apple Silicon/Intel), Linux (X11/Wayland)  
> **Architectural Paradigm:** Zero-Frame Transparent Overlay • 100% Offline Local-First • Sub-35MB RAM • 60/120 FPS Motion Physics  

---

## 🏗️ Tổng Quan Kiến Trúc & Hệ Thống Các Phase Phát Triển Toàn Diện

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       LUMEN MASTER ROADMAP PHASES                                      │
├────────────────────┬────────────────────┬────────────────────┬────────────────────┬────────────────────┤
│ PHASE 1: FOUNDATION│ PHASE 2: COMPANION │ PHASE 3: TIMERS    │ PHASE 4: CALENDAR  │ PHASE 5: HUD & WIDGET
│ • Full-screen Ovrly│ • 120fps GPU Motion│ • Natural Syntax   │ • 24H Scope Dial   │ • Hardware HUD     │
│ • Click-Through IPC│ • 5 Pet Species    │ • Floating Cards   │ • Corner Dock Pill │ • Habit / Pomodoro │
│ • 3D Post-it Notes │ • Toys, Petting    │ • Alarm Synthesis  │ • RFC-5545 .ics    │ • Spotlight 2.0    │
│ • System Tray Hub  │ • Paper Fetching   │ • Game Timers      │ • 2-Way Note Link  │ • Audio Visualizer │
├────────────────────┼────────────────────┼────────────────────┼────────────────────┼────────────────────┤
│ PHASE 6: AI ENGINE │ PHASE 7: P2P SYNC  │ PHASE 8: SDK & MOD │ PHASE 9: PRO SUITE │ RELEASE & PACKAGING│
│ • Offline Local LLM│ • LAN Mesh Sync    │ • TypeScript SDK   │ • Multi-Workspaces │ • Tauri v2 MSVC    │
│ • Context Awareness│ • Paper Plane Toss │ • Obsidian / Notion│ • Biometric Lock   │ • NSIS Installer   │
│ • Voice Transcribe │ • Cross-Screen Pet │ • Pet Mod Studio   │ • Private E2EE     │ • Zero-Leak Cert   │
└────────────────────┴────────────────────┴────────────────────┴────────────────────┴────────────────────┘
```

---

## 📌 Mục Lục Danh Mục Chi Tiết Từng Phase

| Tài liệu Phase | Tên Phase & Nội dung trọng tâm | Phiên bản | Trạng thái |
|---|---|---|---|
| [Phase 1: Nền Tảng Lớp Phủ & Ghi Chú](./phase-1-mvp-foundation.md) | Kiến trúc Overlay trong suốt, Click-through IPC, Đinh ghim 3D, Checklists, Tùy biến font & màu | `v1.0.0` | **Hoàn thành 100%** |
| [Phase 2: Động Cơ Thú Cưng Ảo](./phase-2-companion-engine.md) | Thuật toán di chuyển lượng giác 120 FPS GPU, 5 loài pet (Cáo, Mèo, Shiba, Rồng, Robot), Vết chân mờ, Kéo thả | `v1.0.0` | **Hoàn thành 100%** |
| [Phase 3: Bấm Giờ Thông Minh & Âm Thanh](./phase-3-smart-timers-gamification.md) | Xử lý ngôn ngữ tự nhiên (COC, nấu ăn, Pomodoro), Thẻ đếm ngược nổi trên Desktop, Chuông báo động đa âm Web Audio | `v1.0.0` | **Hoàn thành 100%** |
| [Phase 4: Lịch Không Gian & Bộ Chọn Giờ 24H](./evaluation-report.md) | Lịch không gian tách rời, Ống kính Scope 24H, Widget góc màn hình, Đồng bộ iCalendar RFC-5545, Bản quyền Pro | `v1.1.0` | **Hoàn thành 100%** |
| [Phase 5: Hệ Sinh Thái Widget Không Gian & System HUD](./phase-5-widget-system-hud.md) | Giám sát CPU/RAM/GPU/Mạng siêu nhẹ, Pomodoro Matrix, Habit Tracker, Spotlight 2.0 tính toán & mở app tức thì | `v1.2.0` | **Sẵn sàng triển khai** |
| [Phase 6: Động Cơ Trợ Lý AI Offline & Co-Pilot](./phase-6-ai-companion-copilot.md) | Trợ lý Local-First LLM bảo mật 100%, Pip nhận thức ngữ cảnh công việc, Nhập giọng nói tức thì (Whisper Tiny) | `v1.3.0` | **Sẵn sàng triển khai** |
| [Phase 7: Đồng Bộ Không Dây P2P Mạng LAN & Đa Màn Hình](./phase-7-local-p2p-multiplayer.md) | Mạng P2P nội bộ không cần server (CRDT), Ném máy bay giấy sang máy khác, Thú cưng ghé thăm liên máy tính | `v1.4.0` | **Sẵn sàng triển khai** |
| [Phase 8: Bộ SDK Lập Trình Plugin & Mod Thú Cưng](./phase-8-plugin-sdk-pet-modding.md) | Plugin TypeScript SDK cách ly, Cổng đồng bộ 2 chiều Obsidian / Notion / GitHub, Pet Modding Studio (Tự vẽ pet) | `v2.0.0` | **Sẵn sàng triển khai** |
| [Phase 9: Không Gian Đa Luồng, Khóa Sinh Trắc Học & E2EE](./phase-9-multi-workspaces-e2ee.md) | Chuyển đổi không gian Work/Personal/Study, Khóa ghi chú bằng Windows Hello / TouchID, Sao lưu E2EE WebDAV/Drive | `v2.1.0` | **Sẵn sàng triển khai** |

---

## 💡 Nguyên Tắc Thiết Kế Bất Biến (Guiding Engineering Principles)
1. **Zero-Frame Background Daemon:** Trải nghiệm diễn ra tự nhiên trực tiếp trên Wallpaper máy tính.
2. **True Click-Through:** Con trỏ chuột trên vùng trống phải xuyên thẳng xuống hệ điều hành mà không làm cản trở công việc.
3. **Deterministic Teardown & 0 Memory Leaks:** Dọn dẹp đối xứng mọi Timer, AudioContext, và Event Listener trong chu kỳ sống.
4. **Local-First Privacy & Ultra-Low Resource:** Dữ liệu hoàn toàn thuộc quyền sở hữu của người dùng, RAM chạy nền duy trì dưới 35MB (Tauri v2).
