import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Calendar, Clock, Crown, Eye, EyeOff, Folder, LayoutGrid, Plus, Search, Settings, Sparkles, X } from "lucide-react";
import { sounds } from "@/lib/audio";
import {
  closeOrQuitDesktopApp,
  focusDesktopWindow,
  isDesktopApp,
  listenToDesktopEvent,
  sendDesktopNotification,
  setIgnoreMouseEvents,
  updateInteractiveHitRects,
} from "@/lib/desktop-bridge";
import { useLumen } from "@/lib/store";
import { AlarmRingingModal } from "./alarm-ringing-modal";
import { AppStartupLoading } from "./app-loading";
import { BallToy, triggerThrowBall } from "./ball-toy";
import { Companion } from "./companion";
import { FloatingTimers } from "./floating-timers";
import { Hub } from "./hub";
import { MissedRemindersModal } from "./missed-reminders-modal";
import { Onboarding } from "./onboarding";
import { ProUpgradeModal } from "./pro-upgrade-modal";
import { QuickCapture } from "./quick-capture";
import { QuickTimer, triggerOpenQuickTimer } from "./quick-timer";
import { SpotlightSearch } from "./spotlight-search";
import { StickyNote } from "./sticky-note";
import { SetupWizardModal } from "./installer-wizard";
import { StandaloneCalendar } from "./standalone-calendar";
import { SystemHudWidget } from "./system-hud";
import { ToastStack } from "./toasts";
import { AudioVisualizerWidget } from "./widgets/audio-visualizer";
import { HabitTrackerWidget } from "./widgets/habit-widget";
import { PomodoroWidget } from "./widgets/pomodoro-widget";
import { ScratchpadWidget } from "./widgets/scratchpad-widget";
import { cn } from "@/lib/utils";

// Clean, Streamlined Floating Action Hub with Spatial Drag-to-Place Note Well
function FloatingTrayMenu() {
  const [open, setOpen] = useState(false);
  const [isHoveringDock, setIsHoveringDock] = useState(false);
  const [isDraggingPaper, setIsDraggingPaper] = useState(false);
  const [dragCursorPos, setDragCursorPos] = useState({ x: 0, y: 0 });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const lang = useLumen((s) => s.lang);
  const layout = useLumen((s) => s.layout);
  const setLayout = useLumen((s) => s.setLayout);
  const addNote = useLumen((s) => s.addNote);
  const setCaptureOpen = useLumen((s) => s.setCaptureOpen);
  const setQuickTimerOpen = useLumen((s) => s.setQuickTimerOpen);
  const setCalendarOpen = useLumen((s) => s.setCalendarOpen);
  const setHubOpen = useLumen((s) => s.setHubOpen);
  const setSearchOpen = useLumen((s) => s.setSearchOpen);
  const tidyNotes = useLumen((s) => s.tidyNotes);
  const pipEnabled = useLumen((s) => s.pip.enabled);
  const setPipEnabled = useLumen((s) => s.setPipEnabled);
  const requestNoteFromPip = useLumen((s) => s.requestNoteFromPip);
  const pro = useLumen((s) => s.pro);
  const setProModalOpen = useLumen((s) => s.setProModalOpen);
  const toggleWidget = useLumen((s) => s.toggleWidget);
  const toggleHud = useLumen((s) => s.toggleHud);
  const toggleScratchpad = useLumen((s) => s.toggleScratchpad);
  const activeWidgets = useLumen((s) => s.activeWidgets);
  const hudSettings = useLumen((s) => s.hudSettings);
  const pushToast = useLumen((s) => s.pushToast);

  const isVi = lang === "vi";

  // Drag-and-drop paper note mechanics
  const handlePaperPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    isDraggingRef.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragCursorPos({ x: e.clientX, y: e.clientY });
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePaperPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    if (Math.hypot(dx, dy) > 8) {
      setIsDraggingPaper(true);
      setDragCursorPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handlePaperPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    const distMoved = Math.hypot(dx, dy);

    if (distMoved > 25) {
      // Dropped onto canvas -> spawn note directly at cursor coordinates!
      const screenW = window.innerWidth || 1920;
      const screenH = window.innerHeight || 1080;
      const dropX = Math.max(4, Math.min(82, ((e.clientX - 120) / screenW) * 100));
      const dropY = Math.max(4, Math.min(76, ((e.clientY - 40) / screenH) * 100));

      sounds.playPop(640);
      addNote({
        x: dropX,
        y: dropY,
        body: "",
        tint: "cream",
      });
      pushToast(isVi ? "Đã dán ghi chú mới" : "Note created on canvas", "");
    } else {
      // Quick tap on paper dock
      sounds.playPop(620);
      if (pipEnabled) {
        requestNoteFromPip();
      } else {
        addNote({
          x: Math.max(10, Math.min(80, 50 + (Math.random() - 0.5) * 30)),
          y: Math.max(10, Math.min(75, 40 + (Math.random() - 0.5) * 25)),
          body: "",
          tint: "cream",
        });
      }
    }

    setIsDraggingPaper(false);
  };

  return (
    <div className="interactive-el fixed right-6 bottom-5 z-[85] flex flex-col items-end gap-2 select-none">
      {/* 1. Dragged Ghost Note Preview */}
      {isDraggingPaper && (
        <div
          className="pointer-events-none fixed z-[99999] w-64 rounded-2xl bg-[#fef08a] p-4 text-stone-800 shadow-[0_24px_60px_rgba(0,0,0,0.5)] border border-amber-300 ring-2 ring-[#F5A623] rotate-[-2deg] opacity-90 backdrop-blur-sm animate-in zoom-in-95 duration-100"
          style={{
            left: `${dragCursorPos.x - 120}px`,
            top: `${dragCursorPos.y - 40}px`,
          }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-amber-400/40 text-amber-900/70 text-[11px] font-semibold">
            <span>📝 {isVi ? "Thả để dán ghi chú" : "Drop to place note"}</span>
            <span className="text-[10px] uppercase font-mono">Lumen</span>
          </div>
          <p className="mt-2 text-xs text-amber-900/60 italic">
            {isVi ? "Kéo đến vị trí bạn muốn đặt ghi chú..." : "Drag to your desired note position..."}
          </p>
        </div>
      )}

      {/* 2. Streamlined Glassmorphism Quick Action Hub */}
      {open ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 w-72 rounded-2xl bg-[#181B22]/95 text-[#F4F5F7] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.65)] border border-white/10 backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-1 pb-2 border-b border-white/5 mb-2.5">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Lumen" className="size-4.5 rounded-md" />
              <span className="text-xs font-bold tracking-tight text-white">Lumen Desk</span>
            </div>
            <span className="text-[10px] text-[#8B90A0] font-mono uppercase bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              {isVi ? "Bàn Làm Việc" : "Workspace"}
            </span>
          </div>

          {/* 1. Core Actions (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-1.5 mb-2.5">
            {/* New Note (Single click opens QuickCapture cleanly without duplicate note creation) */}
            <button
              type="button"
              onClick={() => {
                setCaptureOpen(true);
                setOpen(false);
              }}
              className="flex flex-col items-start gap-1 p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#F5A623]/15 border border-white/5 hover:border-[#F5A623]/30 transition-all text-left cursor-pointer group"
              title={isVi ? "Tạo ghi chú nhanh (Alt+N)" : "Quick Note (Alt+N)"}
            >
              <div className="flex items-center justify-between w-full">
                <Plus className="size-4 text-[#F5A623] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-[#8B90A0] font-mono">Alt+N</span>
              </div>
              <span className="text-xs font-medium text-white group-hover:text-[#F5A623] transition-colors">
                {isVi ? "Ghi chú" : "New Note"}
              </span>
            </button>

            {/* Quick Timer */}
            <button
              type="button"
              onClick={() => {
                setQuickTimerOpen(true);
                setOpen(false);
              }}
              className="flex flex-col items-start gap-1 p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#F5A623]/15 border border-white/5 hover:border-[#F5A623]/30 transition-all text-left cursor-pointer group"
              title={isVi ? "Đặt hẹn giờ đếm ngược (Alt+T)" : "Quick Timer (Alt+T)"}
            >
              <div className="flex items-center justify-between w-full">
                <Clock className="size-4 text-[#F5A623] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-[#8B90A0] font-mono">Alt+T</span>
              </div>
              <span className="text-xs font-medium text-white group-hover:text-[#F5A623] transition-colors">
                {isVi ? "Đặt giờ" : "Timer"}
              </span>
            </button>

            {/* Calendar */}
            <button
              type="button"
              onClick={() => {
                setCalendarOpen(true);
                setOpen(false);
              }}
              className="flex flex-col items-start gap-1 p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#F5A623]/15 border border-white/5 hover:border-[#F5A623]/30 transition-all text-left cursor-pointer group"
              title={isVi ? "Mở lịch trình & kế hoạch (Alt+C)" : "Calendar & Schedule (Alt+C)"}
            >
              <div className="flex items-center justify-between w-full">
                <Calendar className="size-4 text-[#F5A623] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-[#8B90A0] font-mono">Alt+C</span>
              </div>
              <span className="text-xs font-medium text-white group-hover:text-[#F5A623] transition-colors">
                {isVi ? "Lịch trình" : "Calendar"}
              </span>
            </button>

            {/* Spotlight */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setOpen(false);
              }}
              className="flex flex-col items-start gap-1 p-2.5 rounded-xl bg-white/[0.04] hover:bg-[#F5A623]/15 border border-white/5 hover:border-[#F5A623]/30 transition-all text-left cursor-pointer group"
              title={isVi ? "Tìm kiếm & Tính toán nhanh (Alt+F)" : "Spotlight Search (Alt+F)"}
            >
              <div className="flex items-center justify-between w-full">
                <Search className="size-4 text-[#F5A623] group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-[#8B90A0] font-mono">Alt+F</span>
              </div>
              <span className="text-xs font-medium text-white group-hover:text-[#F5A623] transition-colors">
                {isVi ? "Tìm kiếm" : "Spotlight"}
              </span>
            </button>
          </div>

          {/* 2. Workspace Layout Quick Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/5 mb-2.5 text-[11px]">
            <button
              type="button"
              onClick={() => tidyNotes()}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white transition-colors cursor-pointer"
              title={isVi ? "Sắp xếp gọn gàng ghi chú (Alt+A)" : "Arrange Notes (Alt+A)"}
            >
              <LayoutGrid className="size-3.5 text-[#F5A623]" />
              <span>{isVi ? "Sắp xếp" : "Arrange"}</span>
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              type="button"
              onClick={() => setLayout(layout === "tray" ? "stickies" : "tray")}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white transition-colors cursor-pointer"
              title={isVi ? "Ẩn hoặc Hiện tất cả ghi chú (Alt+O)" : "Toggle Notes (Alt+O)"}
            >
              {layout === "tray" ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              <span>{layout === "tray" ? (isVi ? "Hiện Note" : "Show") : (isVi ? "Ẩn Note" : "Hide")}</span>
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              type="button"
              onClick={() => setPipEnabled(!pipEnabled)}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white transition-colors cursor-pointer"
              title={isVi ? "Bật hoặc Tắt Thú cưng Pip (Alt+P)" : "Toggle Pet (Alt+P)"}
            >
              <Sparkles className={cn("size-3.5", pipEnabled ? "text-[#F5A623]" : "text-[#8B90A0]")} />
              <span>{isVi ? "Thú cưng" : "Pet"}</span>
            </button>
          </div>

          {/* 3. Optional Widgets Toggle Strip */}
          <div className="mb-2.5">
            <div className="text-[10px] font-semibold text-[#8B90A0] uppercase tracking-wider px-1 mb-1.5">
              {isVi ? "Tiện ích mở rộng" : "Widgets"}
            </div>
            <div className="grid grid-cols-4 gap-1">
              {/* HUD */}
              <button
                type="button"
                onClick={() => toggleHud()}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer",
                  hudSettings.enabled
                    ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                    : "bg-white/[0.02] border-white/5 text-[#8B90A0] hover:bg-white/5"
                )}
                title={isVi ? "Giám sát hiệu năng hệ thống" : "System HUD Monitor"}
              >
                <span>📊</span>
                <span>{isVi ? "Hệ thống" : "HUD"}</span>
              </button>

              {/* Pomodoro */}
              <button
                type="button"
                onClick={() => toggleWidget("pomodoro")}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer",
                  activeWidgets.pomodoro
                    ? "bg-red-500/20 border-red-500/40 text-red-300"
                    : "bg-white/[0.02] border-white/5 text-[#8B90A0] hover:bg-white/5"
                )}
                title={isVi ? "Đồng hồ tập trung sâu Pomodoro" : "Pomodoro Focus"}
              >
                <span>🍅</span>
                <span>{isVi ? "Tập trung" : "Focus"}</span>
              </button>

              {/* Habits */}
              <button
                type="button"
                onClick={() => toggleWidget("habit")}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer",
                  activeWidgets.habit
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-white/[0.02] border-white/5 text-[#8B90A0] hover:bg-white/5"
                )}
                title={isVi ? "Theo dõi uống nước & thói quen" : "Water & Habits Tracker"}
              >
                <span>💧</span>
                <span>{isVi ? "Thói quen" : "Habits"}</span>
              </button>

              {/* Scratchpad */}
              <button
                type="button"
                onClick={() => toggleScratchpad()}
                className={cn(
                  "flex flex-col items-center gap-1 py-1.5 rounded-lg border text-[10px] font-medium transition-all cursor-pointer",
                  activeWidgets.scratchpad
                    ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                    : "bg-white/[0.02] border-white/5 text-[#8B90A0] hover:bg-white/5"
                )}
                title={isVi ? "Sổ tay nháp mã nguồn nhanh" : "Quick Code Scratchpad"}
              >
                <span>📝</span>
                <span>{isVi ? "Sổ nháp" : "Scratch"}</span>
              </button>
            </div>
          </div>

          {/* 4. Footer Actions (Settings, Pro, Quit) */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setHubOpen(true);
                setOpen(false);
              }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white transition-colors cursor-pointer text-[11px]"
            >
              <Settings className="size-3.5" />
              <span>{isVi ? "Cài đặt" : "Settings"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setProModalOpen(true);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer",
                pro.isPro
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-white/5 hover:bg-amber-500/15 text-[#8B90A0] hover:text-amber-300"
              )}
            >
              <Crown className="size-3 text-amber-400" />
              <span>{pro.isPro ? "PRO" : "Gói PRO"}</span>
            </button>

            <button
              type="button"
              onClick={() => void closeOrQuitDesktopApp()}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 transition-colors cursor-pointer text-[11px]"
              title={isVi ? "Thoát ứng dụng" : "Quit"}
            >
              <X className="size-3.5" />
              <span>{isVi ? "Thoát" : "Quit"}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* 3. Bottom Dock Launcher with Spatial Paper Drag Well Tab (Reveals on Hover) */}
      <div
        onPointerEnter={() => setIsHoveringDock(true)}
        onPointerLeave={() => setIsHoveringDock(false)}
        className="flex items-center gap-2"
      >
        {/* Paper Drag Tab (Only reveals when hovering over logo dock) */}
        {!open && (
          <div
            onPointerDown={handlePaperPointerDown}
            onPointerMove={handlePaperPointerMove}
            onPointerUp={handlePaperPointerUp}
            onPointerCancel={handlePaperPointerUp}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-2xl bg-[#181B22]/95 hover:bg-[#262A35] text-[#F4F5F7] border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.5)] cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-2xl touch-none group select-none",
              isHoveringDock || isDraggingPaper
                ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                : "opacity-0 translate-x-4 scale-90 pointer-events-none w-0 px-0 overflow-hidden border-transparent"
            )}
            title={isVi ? "Kéo ra màn hình để dán ghi chú mới • Hoặc nhấp để lấy nhanh" : "Drag to place note anywhere • Or click for quick note"}
          >
            <div className="relative size-5 flex items-center justify-center shrink-0">
              <span className="absolute inset-0 rotate-[-8deg] rounded-sm bg-[#bae6fd] opacity-70" />
              <span className="absolute inset-0 rotate-[4deg] rounded-sm bg-[#bbf7d0] opacity-80" />
              <span className="relative size-4 rounded-sm bg-[#fef08a] border border-amber-300 shadow-sm flex items-center justify-center text-[9px]">
                📝
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#F5A623] tracking-tight whitespace-nowrap">
              {isVi ? "Kéo Note" : "Drag Note"}
            </span>
          </div>
        )}

        {/* Brand Logo Trigger Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex size-11 items-center justify-center rounded-2xl bg-[#181B22]/95 hover:bg-[#262A35] text-white shadow-[0_12px_32px_rgba(0,0,0,0.55)] border border-white/10 backdrop-blur-2xl hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer overflow-hidden p-2 group"
          title="Lumen Desk (Nhấp để mở menu điều khiển)"
          aria-label="Lumen Menu"
        >
          <img
            src="/logo.png"
            alt="Lumen Logo"
            className="size-full object-contain rounded-xl drop-shadow-md group-hover:scale-110 transition-transform duration-150 select-none pointer-events-none"
          />
        </button>
      </div>
    </div>
  );
}

export function DesktopScene() {
  const theme = useLumen((s) => s.theme);
  const layout = useLumen((s) => s.layout);
  const setLayout = useLumen((s) => s.setLayout);
  const notes = useLumen((s) => s.notes);
  const addNote = useLumen((s) => s.addNote);
  const tidyNotes = useLumen((s) => s.tidyNotes);
  const setPipEnabled = useLumen((s) => s.setPipEnabled);
  const markHydrated = useLumen((s) => s.markHydrated);
  const appLoaded = useLumen((s) => s.appLoaded);
  const captureOpen = useLumen((s) => s.captureOpen);
  const setCaptureOpen = useLumen((s) => s.setCaptureOpen);
  const quickTimerOpen = useLumen((s) => s.quickTimerOpen);
  const setQuickTimerOpen = useLumen((s) => s.setQuickTimerOpen);
  const calendarOpen = useLumen((s) => s.calendarOpen);
  const setCalendarOpen = useLumen((s) => s.setCalendarOpen);
  const calendarCompact = useLumen((s) => s.calendarCompact);
  const hubOpen = useLumen((s) => s.hubOpen);
  const setHubOpen = useLumen((s) => s.setHubOpen);
  const searchOpen = useLumen((s) => s.searchOpen);
  const setSearchOpen = useLumen((s) => s.setSearchOpen);
  const undoDeleteNote = useLumen((s) => s.undoDeleteNote);
  const fireReminder = useLumen((s) => s.fireReminder);
  const isPomodoroActive = useLumen((s) => s.pomodoroState.active);
  const isPomodoroDim = useLumen((s) => s.pomodoroSettings.dimBackground);

  useEffect(() => {
    void Promise.resolve(useLumen.persist.rehydrate()).then(() => {
      // Cleanse any legacy seed calendar events cached in user's localStorage
      const events = useLumen.getState().calendarEvents;
      if (Array.isArray(events) && events.length > 0) {
        const cleaned = events.filter(
          (e) =>
            !e.id?.startsWith("seed-") &&
            !e.title?.toLowerCase().includes("sáng tạo cùng pip") &&
            !e.title?.toLowerCase().includes("tập trung sáng tạo")
        );
        if (cleaned.length !== events.length) {
          useLumen.setState({ calendarEvents: cleaned });
        }
      }
      sounds.setEnabled(useLumen.getState().pip.soundEnabled ?? true);
      markHydrated();
    });
  }, [markHydrated]);

  const isAnyModalOpen =
    captureOpen || quickTimerOpen || (calendarOpen && !calendarCompact) || hubOpen || searchOpen;

  // Dynamic Click-Through: mousemove-based setIgnoreMouseEvents toggling + Tauri hit-rects sync
  //
  // Strategy:
  //   • setIgnoreMouseEvents(true) → transparent areas pass clicks to OS apps below
  //     (e.g., browser, media player). Electron & Tauri background watcher routes clicks to OS.
  //   • setIgnoreMouseEvents(false) → entered an interactive element; full pointer interaction.
  //
  // This is the canonical Desktop overlay pattern. CSS `pointer-events: none` on the root
  // div with `pointer-events: auto` on interactive elements handles React hit-testing,
  // while this IPC toggle makes transparent areas truly click-through at the OS level.
  useEffect(() => {
    if (!isDesktopApp()) return;

    // Only send IPC when the interactive state actually changes (no spamming on every pixel)
    let lastIsInteractive: boolean | null = null;
    const INTERACTIVE_SELECTOR =
      "article, .interactive-el, button, input, textarea, " +
      "section[role='dialog'], [role='dialog'], [role='region'], aside, form, select, [data-interactive], a";

    const throttledHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = Boolean(target.closest(INTERACTIVE_SELECTOR));
      if (isInteractive !== lastIsInteractive) {
        lastIsInteractive = isInteractive;
        // false → interactive element → receive clicks normally
        // true  → transparent area → let OS apps below receive clicks
        setIgnoreMouseEvents(!isInteractive);
      }
    };

    window.addEventListener("mousemove", throttledHandler, { passive: true });

    // When mouse leaves the window entirely, restore click-through so OS stays responsive
    const handleMouseLeave = () => {
      lastIsInteractive = null;
      setIgnoreMouseEvents(true);
    };
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    // Sync interactive bounding boxes to native Tauri click-through engine
    const syncRects = () => {
      if (isAnyModalOpen) {
        void updateInteractiveHitRects([], true);
        return;
      }

      const elements = document.querySelectorAll(INTERACTIVE_SELECTOR);
      const dpr = window.devicePixelRatio || 1;
      const rects: Array<{ x: number; y: number; width: number; height: number }> = [];

      elements.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          // Add 6px padding buffer around elements for seamless cursor entry
          rects.push({
            x: Math.max(0, (r.left - 6) * dpr),
            y: Math.max(0, (r.top - 6) * dpr),
            width: (r.width + 12) * dpr,
            height: (r.height + 12) * dpr,
          });
        }
      });

      void updateInteractiveHitRects(rects, false);
    };

    syncRects();
    const interval = setInterval(syncRects, 200);

    return () => {
      window.removeEventListener("mousemove", throttledHandler);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      clearInterval(interval);
      // Restore to fully interactive mode on cleanup (component unmount)
      setIgnoreMouseEvents(false);
    };
  }, [isAnyModalOpen, notes, layout, appLoaded, calendarOpen, calendarCompact]);

  // Global & In-App Keyboard Shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const targetTag = (document.activeElement?.tagName || "").toLowerCase();
      const isTyping = targetTag === "input" || targetTag === "textarea";

      // Undo Delete Note: Ctrl+Z / Cmd+Z (when not typing in textarea)
      if ((e.ctrlKey || e.metaKey) && key === "z" && !e.shiftKey && !isTyping) {
        e.preventDefault();
        undoDeleteNote();
        return;
      }

      // Spotlight Search: Alt+F, Ctrl+F (when not typing)
      if (e.altKey && key === "f") {
        e.preventDefault();
        setSearchOpen(!useLumen.getState().searchOpen);
        return;
      }

      // Quick Note: Alt+N, Alt+Q (Zero collision with Chrome/Edge Incognito)
      if ((e.altKey && key === "n") || (e.altKey && key === "q")) {
        e.preventDefault();
        setCaptureOpen(!useLumen.getState().captureOpen);
      }
      // Quick Timer: Alt+T (Zero collision with Browser Reopen Tab)
      if (e.altKey && key === "t") {
        e.preventDefault();
        setQuickTimerOpen(!useLumen.getState().quickTimerOpen);
      }
      // Calendar Hub: Alt+C
      if (e.altKey && key === "c") {
        e.preventDefault();
        setCalendarOpen(!useLumen.getState().calendarOpen);
      }
      // Settings Hub: Alt+S, Alt+H
      if ((e.altKey && key === "s") || (e.altKey && key === "h")) {
        e.preventDefault();
        setHubOpen(!useLumen.getState().hubOpen);
      }
      // Arrange Notes: Alt+A
      if (e.altKey && key === "a") {
        e.preventDefault();
        tidyNotes();
      }
      // Toggle Show/Hide All: Alt+O
      if (e.altKey && key === "o") {
        e.preventDefault();
        setLayout(useLumen.getState().layout === "tray" ? "stickies" : "tray");
      }
      // Throw Ball or Toggle Pet: Alt+P
      if (e.altKey && key === "p") {
        e.preventDefault();
        if (useLumen.getState().pip.enabled) {
          triggerThrowBall();
        } else {
          setPipEnabled(true);
        }
      }
      if (e.key === "Escape") {
        setCaptureOpen(false);
        setQuickTimerOpen(false);
        setCalendarOpen(false);
        setHubOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);

    const unlisteners: (() => void)[] = [];

    if (isDesktopApp()) {
      unlisteners.push(
        listenToDesktopEvent("open-quick-capture", () => {
          setCaptureOpen(true);
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("open-quick-timer", () => {
          setQuickTimerOpen(true);
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("open-calendar", () => {
          setCalendarOpen(true);
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("add-new-note", () => {
          addNote({ body: "", tint: "cream" });
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("arrange-notes", () => {
          tidyNotes();
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("toggle-show-hide-all", () => {
          setLayout(useLumen.getState().layout === "tray" ? "stickies" : "tray");
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("toggle-pet", () => {
          setPipEnabled(!useLumen.getState().pip.enabled);
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("open-pet-settings", () => {
          setHubOpen(true);
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("open-app-settings", () => {
          setHubOpen(true);
        }),
      );
      unlisteners.push(
        listenToDesktopEvent("open-check-updates", () => {
          setHubOpen(true, "about");
        }),
      );
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      for (const unlisten of unlisteners) {
        try {
          unlisten();
        } catch (err) {
          console.debug("[DesktopScene] unlisten error:", err);
        }
      }
    };
  }, [setCaptureOpen, setQuickTimerOpen, setCalendarOpen, setHubOpen, addNote, tidyNotes, setLayout, setPipEnabled]);

  // Startup silent update check (non-blocking, checks GitHub release 4 seconds after mount)
  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const { checkForAppUpdates, CURRENT_APP_VERSION } = await import("@/lib/updater");
        const res = await checkForAppUpdates(CURRENT_APP_VERSION, 5000);
        if (res.hasUpdate && res.updateInfo) {
          const isVi = useLumen.getState().lang === "vi";
          useLumen.getState().pushToast(
            isVi ? "Đã có bản cập nhật mới!" : "Update Available!",
            isVi
              ? `Lumen v${res.updateInfo.version} đã sẵn sàng. Mở Cài Đặt (Alt+S) để xem chi tiết.`
              : `Lumen v${res.updateInfo.version} is available. Open Settings (Alt+S) to check.`,
          );
        }
      } catch {}
    }, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  // Reminder scheduler
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      for (const r of useLumen.getState().reminders) {
        if (!r.done && r.fireAt <= now) {
          fireReminder(r.id);
          void sendDesktopNotification("Lumen Reminder", r.title);
        }
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [fireReminder]);

  // Double click anywhere on desktop creates a new sticky note
  const onDoubleClickBackground = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("article, .interactive-el, section[role='dialog'], form, .group")) return;
    const parent = document.body.getBoundingClientRect();
    const x = Math.max(4, Math.min(84, (e.clientX / parent.width) * 100));
    const y = Math.max(6, Math.min(82, (e.clientY / parent.height) * 100));
    addNote({ x, y, body: "", tint: "cream" });
  };

  const pushToast = useLumen((s) => s.pushToast);

  const [isDragOverFile, setIsDragOverFile] = useState(false);

  // Drag and drop text files (.txt, .md, .csv, .log) directly to spawn sticky notes
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragOverFile(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || "";
        const title = file.name.replace(/\.[^/.]+$/, "");
        const parent = document.body.getBoundingClientRect();
        const dropX = Math.max(6, Math.min(75, ((e.clientX + index * 25) / parent.width) * 100));
        const dropY = Math.max(8, Math.min(70, ((e.clientY + index * 25) / parent.height) * 100));

        addNote({
          title,
          body: text,
          x: dropX,
          y: dropY,
          tint: index % 2 === 0 ? "cream" : "sage",
        });

        sounds.playPop(700);
        pushToast("Đã tạo ghi chú từ file", `📄 ${file.name}`);
      };
      reader.readAsText(file);
    });
  };

  const visibleNotes = layout === "tray" ? [] : notes;

  return (
    <div
      data-theme={theme}
      data-transparent="true"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="fixed inset-0 h-screen w-screen bg-transparent text-fg select-none overflow-hidden pointer-events-none"
    >

      {/* Drag-and-drop file drop target indicator */}
      {isDragOverFile && (
        <div className="fixed inset-4 z-[95] rounded-3xl border-2 border-dashed border-[#F5A623] bg-[#1D2029]/85 backdrop-blur-md flex flex-col items-center justify-center text-[#F4F5F7] animate-in fade-in zoom-in-95 pointer-events-none shadow-2xl">
          <div className="size-16 rounded-2xl bg-[#F5A623]/20 flex items-center justify-center text-[#F5A623] mb-3 animate-bounce">
            <Folder className="size-8" />
          </div>
          <p className="font-bold text-base text-[#F5A623]">
            Thả file .txt / .md vào đây để tạo ghi chú dán tức thì
          </p>
          <p className="text-xs text-[#8B90A0] mt-1">
            Hỗ trợ tự động đọc văn bản từ các tệp .txt, .md, .csv, .log
          </p>
        </div>
      )}

      {/* Pomodoro Focus Dim Overlay */}
      {appLoaded && isPomodoroActive && isPomodoroDim && (
        <div className="fixed inset-0 z-[7500] bg-black/40 backdrop-blur-[1px] pointer-events-none transition-opacity duration-500 animate-in fade-in" />
      )}

      {appLoaded &&
        visibleNotes.map((n) => (
          <StickyNote key={n.id} note={n} />
        ))}
      {appLoaded && <FloatingTimers />}
      {appLoaded && <BallToy />}
      {appLoaded && <Companion />}
      {appLoaded && <SystemHudWidget />}
      {appLoaded && <PomodoroWidget />}
      {appLoaded && <HabitTrackerWidget />}
      {appLoaded && <ScratchpadWidget />}
      {appLoaded && <AudioVisualizerWidget />}
      <ToastStack />
      <AlarmRingingModal />
      <MissedRemindersModal />
      <QuickCapture />
      <QuickTimer />
      <SpotlightSearch />
      <StandaloneCalendar />
      <Hub />
      <ProUpgradeModal />
      <SetupWizardModal />
      {appLoaded && <Onboarding />}
      {appLoaded && <FloatingTrayMenu />}
      <AppStartupLoading />
    </div>
  );
}
