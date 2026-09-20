export type ThemeId = "minimalist" | "glass" | "cyberpunk" | "pastel" | "ink";
export type LayoutMode = "stickies" | "sidebar" | "tray" | "corner";
export type NoteTint = "cream" | "mist" | "sage" | "blush" | "neon" | "dark" | "glass";
export type PipMood = "idle" | "wander" | "fetch" | "deliver" | "nudge" | "sleep" | "dance" | "eating" | "focus" | "sitting" | "chasing_ball";
export type PetType = "fox" | "cat" | "shiba" | "dragon" | "cyber";
export type PetSkin = "classic" | "matcha" | "amber" | "cyber" | "obsidian";
export type PetHat = "none" | "explorer_hat" | "sunglasses" | "wizard_hat" | "party_hat" | "sleep_cap";
export type PetBodyItem = "backpack" | "cape" | "wings" | "scarf" | "none";
export type Language = "en" | "vi";
export type AlarmSoundTone = "bell_arpeggio" | "digital_alarm" | "gentle_chime" | "vintage_clock";

export type AlarmSettings = {
  volume: number; // 0 - 100
  tone: AlarmSoundTone;
  loopIntervalSec: number;
  muted?: boolean; // Tắt/bật âm thanh chuông báo thức
};

export type CheckItem = {
  id: string;
  text: string;
  done: boolean;
};

export type Note = {
  id: string;
  title?: string;
  body: string;
  x: number; // percentage of screen (0 - 100)
  y: number; // percentage of screen (0 - 100)
  width?: number; // optional width in px
  height?: number; // optional height in px
  rot: number;
  tint: NoteTint;
  opacity?: number; // 0.3 to 1.0
  fontFamily?: "sans" | "handwriting" | "mono";
  fontSize?: number | "sm" | "base" | "lg";
  checkItems?: CheckItem[];
  z: number;
  createdAt: number;
  pinned?: boolean;
  locked?: boolean; // Khóa cố định vị trí ghi chú chống kéo nhầm
  collapsed?: boolean;
  cluster?: string; // Tên cụm / nhóm ghi chú (VD: "Công việc", "Dự án Alpha", "Game")
  deletedAt?: number; // Thời gian chuyển vào thùng rác
  dueDate?: string; // Hạn chót dạng YYYY-MM-DD
  dueTime?: string; // Giờ hạn chót dạng HH:mm
};

export type CalendarEventCategory = "work" | "personal" | "meeting" | "reminder" | "focus";
export type RecurrenceRule = "none" | "daily" | "weekly" | "monthly" | "weekdays";
export type CalendarViewMode = "month" | "agenda" | "day";
export type CalendarDockPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left";

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  startTime?: string; // HH:mm (24h)
  endDate?: string; // YYYY-MM-DD
  endTime?: string; // HH:mm (24h)
  allDay?: boolean;
  category: CalendarEventCategory;
  color?: string; // Custom color or theme color key
  reminderMinutesBefore?: number; // 0, 5, 15, 30, 60...
  alarmEnabled?: boolean; // Tự động phát chuông báo thức khi đến giờ
  linkedNoteId?: string; // Liên kết 2 chiều với Sticky Note
  recurrence?: RecurrenceRule;
  completed?: boolean;
  createdAt: number;
  updatedAt?: number;
};

export type CalendarFilter = {
  category?: CalendarEventCategory | "all";
  searchQuery?: string;
  showCompleted?: boolean;
};

export type Reminder = {
  id: string;
  title: string;
  durationMs?: number;
  fireAt: number;
  done: boolean;
  pinToScreen?: boolean;
};

export type ToastItem = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
};

export type PawPrint = {
  id: string;
  x: number;
  y: number;
  rot: number;
  opacity: number;
  createdAt: number;
};

export type BallToy = {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  bounces: number;
};

export type PipState = {
  enabled: boolean;
  petType: PetType;
  mood: PipMood;
  skin: PetSkin;
  hat: PetHat;
  bodyItem: PetBodyItem;
  happiness: number; // 0 - 100
  energy: number; // 0 - 100
  treatsEaten: number;
  soundEnabled: boolean;
  x: number;
  y: number;
  facing: 1 | -1;
  carrying: boolean;
  moving: boolean;
  speech: string | null;
  targetNoteId?: string | null;
};

export type ProFeatureId =
  | "unlimited_notes"
  | "multi_timers"
  | "pro_themes"
  | "exclusive_skins"
  | "ai_cluster"
  | "pin_lock";

export type LicenseTier = "free" | "pro" | "svip";

export type ProLicense = {
  isPro: boolean;
  tier?: LicenseTier;
  licenseKey?: string;
  activatedAt?: number;
  plan?: "lifetime" | "annual" | "monthly" | "trial" | "free" | "pro" | "svip";
  expiresAt?: number;
};

export type AppUpdateInfo = {
  version: string;
  name?: string;
  body?: string;
  htmlUrl?: string;
  publishedAt?: string;
  downloadUrl?: string;
};

// ==========================================
// Phase 5: Spatial Widget & System HUD Types
// ==========================================

export type SystemHudDockPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

export type SystemHudSettings = {
  enabled: boolean;
  position: SystemHudDockPosition;
  showCpu: boolean;
  showRam: boolean;
  showNetwork: boolean;
  showBattery: boolean;
  compact: boolean;
  alertOnHighLoad: boolean; // Alert when CPU/RAM > 85%
};

export type SystemStats = {
  isNative: boolean; // true if running on native Tauri OS bridge, false if browser web sampling
  memoryMode: "system" | "heap"; // 'system' for real physical OS RAM, 'heap' for browser JS memory
  cpuUsage: number; // 0 - 100
  cpuCores: number;
  fps: number; // UI Frame Rendering budget (e.g. 60 FPS)
  ramUsage: number; // 0 - 100
  ramUsedMb: number;
  ramTotalMb: number;
  networkDownKbps: number;
  networkUpKbps: number;
  networkOnline: boolean;
  batteryLevel: number | null; // 0 - 100
  batteryCharging: boolean | null;
  cpuHistory: number[]; // Array of last 10 points
  ramHistory: number[];
};

export type PomodoroMode = "work" | "short_break" | "long_break";

export type PomodoroSettings = {
  workMinutes: number; // default 25
  shortBreakMinutes: number; // default 5
  longBreakMinutes: number; // default 15
  longBreakInterval: number; // default 4
  dimBackground: boolean; // Dim canvas notes when focusing
  tickingSound: boolean;
};

export type PomodoroState = {
  enabled: boolean;
  active: boolean;
  mode: PomodoroMode;
  remainingSeconds: number;
  cycleCount: number;
  totalFocusMinutes: number;
  lastTickAt?: number;
};

export type HabitItem = {
  id: string;
  title: string;
  targetPerDay: number;
  currentCount: number;
  unit: string;
  icon: string;
  completedDates: string[]; // YYYY-MM-DD
  streak: number;
};

export type WaterTrackerState = {
  enabled: boolean;
  targetMl: number; // default 2000
  currentMl: number;
  glassSizeMl: number; // default 250
  todayDate: string;
};

export type ScratchpadState = {
  enabled: boolean;
  content: string;
  syntax: "text" | "javascript" | "python" | "json" | "markdown" | "sql";
  pinned: boolean;
  dockPosition?: "left" | "right" | "floating";
};

export type AudioVisualizerSettings = {
  enabled: boolean;
  sensitivity: number; // 1 - 5
  style: "bars" | "wave" | "dots";
};

export type ActiveWidgetId = "hud" | "pomodoro" | "habit" | "scratchpad" | "visualizer";

export type SnippetItem = {
  id: string;
  title: string;
  prefix: string;
  content: string;
  category?: string;
};


