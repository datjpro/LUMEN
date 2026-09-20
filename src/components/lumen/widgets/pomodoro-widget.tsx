import { useEffect, useState } from "react";
import { Check, Coffee, Flame, Moon, Pause, Play, RotateCcw, SkipForward, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import { cn } from "@/lib/utils";

export function PomodoroWidget() {
  const pomodoroState = useLumen((s) => s.pomodoroState);
  const pomodoroSettings = useLumen((s) => s.pomodoroSettings);
  const startPomodoro = useLumen((s) => s.startPomodoro);
  const pausePomodoro = useLumen((s) => s.pausePomodoro);
  const resetPomodoro = useLumen((s) => s.resetPomodoro);
  const skipPomodoroMode = useLumen((s) => s.skipPomodoroMode);
  const tickPomodoro = useLumen((s) => s.tickPomodoro);
  const setPomodoroSettings = useLumen((s) => s.setPomodoroSettings);
  const toggleWidget = useLumen((s) => s.toggleWidget);
  const isWidgetActive = useLumen((s) => s.activeWidgets.pomodoro);
  const lang = useLumen((s) => s.lang);

  const isVi = lang === "vi";

  // Dedicated 1-second Pomodoro timer tick loop
  useEffect(() => {
    if (!pomodoroState.active || !isWidgetActive) return;

    const timer = setInterval(() => {
      tickPomodoro();
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroState.active, isWidgetActive, tickPomodoro]);

  if (!isWidgetActive) return null;

  const totalDurationSec =
    pomodoroState.mode === "work"
      ? pomodoroSettings.workMinutes * 60
      : pomodoroState.mode === "short_break"
      ? pomodoroSettings.shortBreakMinutes * 60
      : pomodoroSettings.longBreakMinutes * 60;

  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalDurationSec - pomodoroState.remainingSeconds) / totalDurationSec) * 100)
  );

  const mins = Math.floor(pomodoroState.remainingSeconds / 60);
  const secs = pomodoroState.remainingSeconds % 60;
  const timeFormatted = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const modeBadge =
    pomodoroState.mode === "work"
      ? { label: isVi ? "Tập trung sâu" : "Deep Focus", color: "text-red-400 bg-red-500/15 border-red-500/30", icon: "🍅" }
      : pomodoroState.mode === "short_break"
      ? { label: isVi ? "Nghỉ ngắn (5 phút)" : "Short Break", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", icon: "☕" }
      : { label: isVi ? "Nghỉ dài (15 phút)" : "Long Break", color: "text-sky-400 bg-sky-500/15 border-sky-500/30", icon: "🌴" };

  return (
    <div className="interactive-el fixed top-20 right-4 z-[8400] select-none touch-none animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="w-72 rounded-3xl bg-[#181B22]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-[#F4F5F7] flex flex-col gap-3.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{modeBadge.icon}</span>
            <span className="font-bold text-xs tracking-wide uppercase text-white/90">
              {isVi ? "Đồng Hồ Pomodoro" : "Pomodoro Matrix"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Ticking sound toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop(520);
                setPomodoroSettings({ tickingSound: !pomodoroSettings.tickingSound });
              }}
              className={cn(
                "p-1.5 rounded-xl transition-colors cursor-pointer text-xs",
                pomodoroSettings.tickingSound ? "bg-amber-500/20 text-amber-400" : "hover:bg-white/10 text-[#8B90A0]"
              )}
              title={pomodoroSettings.tickingSound ? (isVi ? "Tắt âm tích tắc" : "Mute ticking") : (isVi ? "Bật âm tích tắc gỗ" : "Enable ticking")}
            >
              {pomodoroSettings.tickingSound ? <Volume2 className="size-3.5" /> : <VolumeX className="size-3.5" />}
            </button>

            {/* Background Dim toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop(520);
                setPomodoroSettings({ dimBackground: !pomodoroSettings.dimBackground });
              }}
              className={cn(
                "p-1.5 rounded-xl transition-colors cursor-pointer text-xs",
                pomodoroSettings.dimBackground ? "bg-purple-500/20 text-purple-400" : "hover:bg-white/10 text-[#8B90A0]"
              )}
              title={pomodoroSettings.dimBackground ? (isVi ? "Tắt làm mờ màn hình" : "Disable focus dim") : (isVi ? "Bật làm mờ màn hình tập trung" : "Enable focus dim")}
            >
              <Moon className="size-3.5" />
            </button>

            {/* Close button */}
            <button
              type="button"
              onClick={() => {
                sounds.playPop(400);
                toggleWidget("pomodoro", false);
              }}
              className="p-1.5 rounded-xl hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 transition-colors cursor-pointer"
              title={isVi ? "Đóng Pomodoro" : "Close Pomodoro"}
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Circular Countdown & Status Badge */}
        <div className="flex flex-col items-center justify-center my-1 relative">
          <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-2", modeBadge.color)}>
            {modeBadge.label}
          </span>

          <div className="font-mono text-4xl font-extrabold tracking-tight text-white drop-shadow-md">
            {timeFormatted}
          </div>

          {/* Progress Bar with glowing tip */}
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-3 relative">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                pomodoroState.mode === "work"
                  ? "bg-gradient-to-r from-red-500 via-orange-500 to-amber-400"
                  : "bg-gradient-to-r from-emerald-500 to-teal-400"
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Cycle Indicators */}
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-[#8B90A0]">
            <span>{isVi ? "Chu kỳ:" : "Cycle:"}</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((idx) => {
                const isCompleted = idx < pomodoroState.cycleCount % 4;
                return (
                  <span
                    key={idx}
                    className={cn(
                      "size-2.5 rounded-full transition-colors",
                      isCompleted ? "bg-[#F5A623] shadow-xs" : "bg-white/15"
                    )}
                  />
                );
              })}
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400 ml-1">
              #{pomodoroState.cycleCount}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-3 gap-2 mt-1">
          {pomodoroState.active ? (
            <button
              type="button"
              onClick={pausePomodoro}
              className="h-10 col-span-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-xs"
            >
              <Pause className="size-4" />
              <span>{isVi ? "Tạm dừng" : "Pause"}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startPomodoro}
              className="h-10 col-span-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer text-xs"
            >
              <Play className="size-4 fill-white" />
              <span>{isVi ? "Bắt đầu tập trung" : "Start Focus"}</span>
            </button>
          )}

          <div className="flex gap-1">
            <button
              type="button"
              onClick={resetPomodoro}
              className="flex-1 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-[#8B90A0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isVi ? "Đặt lại thời gian" : "Reset Timer"}
            >
              <RotateCcw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={skipPomodoroMode}
              className="flex-1 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-[#8B90A0] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title={isVi ? "Chuyển giai đoạn tiếp theo" : "Skip to Next Mode"}
            >
              <SkipForward className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
