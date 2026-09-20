export interface ReleaseHighlight {
  icon: string;
  badge: "feat" | "fix" | "perf" | "pro" | "ui";
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
}

export interface VersionRelease {
  version: string;
  releaseName: string;
  releaseDate: string;
  isLatest?: boolean;
  highlights: ReleaseHighlight[];
}

export const APP_RELEASES: VersionRelease[] = [
  {
    version: "1.2.2",
    releaseName: "Lumen v1.2.2 — PRO Trial Gating, SVIP Tier Lock & Drag-to-Place Note",
    releaseDate: "2026-09-20",
    isLatest: true,
    highlights: [
      {
        icon: "🔒",
        badge: "pro",
        titleVi: "Chuẩn Hóa Phân Hạng: FREE / PRO / SVIP (Khóa Chặt Bản SVIP)",
        titleEn: "Tier Modernization: FREE / PRO / SVIP (SVIP Strictly Locked)",
        descriptionVi:
          "Chuyển đổi hệ thống phân tầng sang chuẩn FREE, PRO, SVIP. Khóa hoàn toàn gói SVIP Master không cho phép sử dụng hay kích hoạt thử. Dùng thử 3 ngày chỉ áp dụng độc quyền cho gói PRO.",
        descriptionEn:
          "Modernized tier structure into FREE, PRO, and SVIP. SVIP is strictly locked and cannot be trialed. 3-day free trial is exclusively restricted to the PRO tier.",
      },
      {
        icon: "📝",
        badge: "ui",
        titleVi: "Khôi Phục & Nâng Cấp Kéo Thả Ghi Chú Ra Màn Hình",
        titleEn: "Restored & Upgraded Drag-to-Place Spatial Note",
        descriptionVi:
          "Tích hợp dock kéo giấy trực tiếp từ thanh launcher. Xem trước bóng ghi chú thời gian thực theo con trỏ chuột và đặt note chuẩn xác tại bất kỳ tọa độ nào trên không gian desktop.",
        descriptionEn:
          "Added dedicated paper drag dock beside launcher with live ghost preview and precise coordinate placement anywhere on the desktop spatial canvas.",
      },
    ],
  },
  {
    version: "1.2.1",
    releaseName: "Lumen v1.2.1 — System Telemetry Accuracy & UI Decluttering Optimization",
    releaseDate: "2026-09-20",
    isLatest: false,
    highlights: [
      {
        icon: "🎯",
        badge: "fix",
        titleVi: "Đo Đạc Phần Cứng Chính Xác 100% (Win32 Native & V8 Heap)",
        titleEn: "Authentic Hardware Telemetry (Win32 & Heap)",
        descriptionVi:
          "Tích hợp lệnh Win32 trực tiếp từ nhân Windows: GlobalMemoryStatusEx cho RAM, GetSystemTimes cho CPU và GetSystemPowerStatus cho pin. Loại bỏ hoàn toàn số liệu giả lập và cảnh báo sai.",
        descriptionEn:
          "Integrated direct Windows Win32 kernel telemetry for exact RAM, CPU% and battery. Completely eliminated jitter and false high-load alarms.",
      },
      {
        icon: "⚡",
        badge: "ui",
        titleVi: "Tối Ưu Giao Diện & Khay Điều Khiển Tinh Gọn",
        titleEn: "Streamlined Action Hub & Clean Desktop",
        descriptionVi:
          "Giao diện khởi động mặc định siêu sạch (Clean-by-default). Tái cấu trúc menu điều khiển nổi dạng lưới 2x2 thông minh (Ghi chú, Đặt giờ, Lịch trình, Tìm kiếm) và thanh toggle tiện ích 1-chạm.",
        descriptionEn:
          "Clean-by-default spatial workspace with redesigned 2x2 Action Hub (Note, Timer, Calendar, Spotlight) and 1-click widget toggles.",
      },
    ],
  },
  {
    version: "1.2.0",
    releaseName: "Lumen v1.2.0 — Spatial Widget Ecosystem & System HUD Monitor",
    releaseDate: "2026-09-20",
    isLatest: false,
    highlights: [
      {
        icon: "📊",
        badge: "feat",
        titleVi: "Giám Sát Phần Cứng Siêu Nhẹ (System HUD Hardware Monitor)",
        titleEn: "System HUD Hardware Monitor Capsule",
        descriptionVi:
          "Theo dõi CPU, RAM, tốc độ mạng KB/s, tình trạng Pin với biểu đồ sóng Sparkline mini thời gian thực, tự động cảnh báo khi hệ thống quá tải >85%.",
        descriptionEn:
          "Real-time CPU, RAM, Network KB/s, and Battery monitoring capsule with GPU sparklines and high load warning (>85%).",
      },
      {
        icon: "🍅",
        badge: "feat",
        titleVi: "Bộ Đếm Tập Trung Sâu Pomodoro Matrix",
        titleEn: "Pomodoro Matrix Deep Focus Engine",
        descriptionVi:
          "Chu kỳ làm việc 25p / nghỉ ngắn 5p / nghỉ dài 15p với tính năng tự động làm mờ các ghi chú không liên quan khi vào chu kỳ tập trung.",
        descriptionEn:
          "Pomodoro 25m work / 5m short break / 15m long break cycles with automatic focus background dimming over desktop notes.",
      },
      {
        icon: "💧",
        badge: "feat",
        titleVi: "Theo Dõi Uống Nước & Thói Quen Hàng Ngày (Habit Tracker)",
        titleEn: "Daily Habits & Water Intake Tracker",
        descriptionVi:
          "Viên nang theo dõi nước uống hàng ngày với hiệu ứng giọt nước sống động, tính điểm chuỗi ngày hoàn thành (Streak) và điểm danh thói quen.",
        descriptionEn:
          "Interactive water glass tracker with droplet audio feedback, daily habit check-in, and streak flame counters.",
      },
      {
        icon: "📝",
        badge: "feat",
        titleVi: "Sổ Tay Code & Nháp Nhanh (Quick Scratchpad)",
        titleEn: "Quick Scratchpad & Code Runner",
        descriptionVi:
          "Bảng ghi chép mã nguồn nhanh hỗ trợ chọn cú pháp (JS, Python, JSON, SQL, Markdown), sao chép 1 chạm và dán trực tiếp thành Sticky Note.",
        descriptionEn:
          "Instant code snippet editor with syntax selector (JS, Python, JSON, SQL, Markdown), 1-click clipboard copy, and desktop note sticker.",
      },
      {
        icon: "⚡",
        badge: "feat",
        titleVi: "Spotlight 2.0: Máy Tính Trực Tiếp, Đổi Tiền & Lệnh Nhanh",
        titleEn: "Spotlight 2.0 Live Calculator, Currency Converter & Actions",
        descriptionVi:
          "Tính toán biểu thức toán tức thì (15% of 250), đổi ngoại tệ (100 usd in vnd), đổi đơn vị bộ nhớ, nhiệt độ và thực thi lệnh nhanh (>).",
        descriptionEn:
          "Instant inline math evaluation, currency conversion, storage unit scaling, and quick command execution (>).",
      },
    ],
  },
  {
    version: "1.1.0",
    releaseName: "Lumen v1.1.0 — In-App Update Engine & Spatial Calendar Evolution",
    releaseDate: "2026-09-07",
    isLatest: false,
    highlights: [
      {
        icon: "🔄",
        badge: "feat",
        titleVi: "Kiểm Tra Cập Nhật Thông Minh & Guard Ngoại Tuyến",
        titleEn: "Smart In-App Update Checker & Offline Guard",
        descriptionVi:
          "Hỗ trợ kiểm tra bản cập nhật mới theo yêu cầu với thông báo mất kết nối mạng, giao diện xem trước tính năng mới và tùy chọn Cập nhật / Bỏ qua phiên bản.",
        descriptionEn:
          "On-demand update verification with offline network connectivity guard, rich release highlights modal, and Update / Skip / Remind options.",
      },
      {
        icon: "📅",
        badge: "feat",
        titleVi: "Module Lịch Trình Độc Lập (Spatial Calendar Standalone)",
        titleEn: "Standalone Spatial Calendar & Agenda Widget",
        descriptionVi:
          "Tách hoàn toàn Lịch trình thành module độc lập (Alt+C) với giao diện mở rộng 2 cột, lọc đúng sự kiện hôm nay ở chế độ thu gọn và dock 4 góc màn hình.",
        descriptionEn:
          "Dedicated standalone calendar module (Alt+C) with expansive dual-pane view, strict Today's Agenda filtering in compact capsule, and 4-corner dock.",
      },
      {
        icon: "🎯",
        badge: "ui",
        titleVi: "Bộ Chọn Giờ Ống Ngắm 24H (Barrel-Wheel Scope Picker)",
        titleEn: "Tactical 24H Scope Rotary Time Picker",
        descriptionVi:
          "Bộ chọn giờ xoay 24H phong cách Tactical Scope với âm thanh click cơ học, cuộn vô tận 00-23 và 00-59 cực kỳ mượt mà.",
        descriptionEn:
          "Tactical 24H scope rotary barrel wheel with mechanical audio clicks and seamless infinite scrolling (00-23h, 00-59m).",
      },
      {
        icon: "🎁",
        badge: "pro",
        titleVi: "Mã Dùng Thử Lumen Pro 3 Ngày (LUMENTRIAL3DAY)",
        titleEn: "3-Day Pro Trial Engine (Code: LUMENTRIAL3DAY)",
        descriptionVi:
          "Giao diện nâng cấp Pro sang trọng kèm hệ thống kích hoạt dùng thử 3 ngày miễn phí với mã LUMENTRIAL3DAY và bộ đếm ngược thời gian hết hạn.",
        descriptionEn:
          "Revamped luxury Pro upgrade modal with instant 3-day full Pro trial pass using code LUMENTRIAL3DAY and live countdown timer.",
      },
      {
        icon: "🛡️",
        badge: "fix",
        titleVi: "Form Thêm Việc Nhúng Chống Tràn & Dọn Dữ Liệu Mẫu",
        titleEn: "In-Place Fluid Event Form & Clean Seed Data",
        descriptionVi:
          "Khắc phục hoàn toàn lỗi tràn layout form thêm việc, chống mất dữ liệu khi click ra ngoài và thanh lọc 100% dữ liệu mẫu gây hiểu lầm.",
        descriptionEn:
          "Fixed modal overflow scaling, prevented accidental form closing on outside click, and purged all legacy seed mock events.",
      },
    ],
  },
  {
    version: "1.0.1",
    releaseName: "Lumen v1.0.1 — Pro Upgrade & Stability Pass",
    releaseDate: "2026-09-07",
    highlights: [
      {
        icon: "👑",
        badge: "pro",
        titleVi: "Hệ thống Bản quyền Pro & Kích hoạt Mã",
        titleEn: "Pro License Management System",
        descriptionVi: "Hỗ trợ kích hoạt License Key bản quyền vĩnh viễn và gói dùng thử có thời hạn.",
        descriptionEn: "Support for lifetime Pro license key activation and temporary trial periods.",
      },
      {
        icon: "⚡",
        badge: "perf",
        titleVi: "Tối ưu hóa GPU Compositing & Bộ đệm Render",
        titleEn: "GPU Compositing & Frame Budget Polish",
        descriptionVi: "Duy trì ổn định 60-120 FPS với cơ chế click-through OS cải tiến không chiếm dụng CPU.",
        descriptionEn: "Maintained solid 60-120 FPS rendering with optimized OS click-through IPC toggling.",
      },
    ],
  },
  {
    version: "1.0.0",
    releaseName: "Lumen v1.0.0 — Official Genesis Desktop Release",
    releaseDate: "2026-09-01",
    highlights: [
      {
        icon: "🐾",
        badge: "feat",
        titleVi: "Thú ảo Pip tương tác & Tủ đồ 5 loài",
        titleEn: "Interactive Pip Companion & 5 Pet Species",
        descriptionVi: "5 loài thú ảo với tương tác ném bóng, xoa đầu, cho ăn bánh, nhảy múa và lấy giấy.",
        descriptionEn: "5 procedural pet species with ball throwing, petting, feeding, and paper delivery.",
      },
      {
        icon: "📝",
        badge: "feat",
        titleVi: "Ghi chú dán không gian xoay 360°",
        titleEn: "Spatial Sticky Notes with 360° Rotation",
        descriptionVi: "Ghi chú dán tự do với xoay 360°, hít mép màn hình và tùy chỉnh phông chữ, độ mờ.",
        descriptionEn: "Spatial notes with continuous 360° rotation, bezel snapping, and custom Word fonts.",
      },
      {
        icon: "⏱️",
        badge: "feat",
        titleVi: "Hẹn giờ thông minh ngôn ngữ tự nhiên",
        titleEn: "Smart Timers & Procedural Alarm Synthesizer",
        descriptionVi: "Phân tích cú pháp hẹn giờ tự nhiên ('Pomodoro 25p') và 4 chuông báo âm lượng lớn.",
        descriptionEn: "Natural language timer parser and 4 procedural web audio synthesized alarm tones.",
      },
    ],
  },
];