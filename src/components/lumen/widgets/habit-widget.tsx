import { useState } from "react";
import { Check, Droplets, Flame, Plus, RotateCcw, Sparkles, Trash2, Trophy, X } from "lucide-react";
import { sounds } from "@/lib/audio";
import { formatDateKey } from "@/lib/calendar-utils";
import { useLumen } from "@/lib/store";
import { cn } from "@/lib/utils";

export function HabitTrackerWidget() {
  const waterTracker = useLumen((s) => s.waterTracker);
  const addWater = useLumen((s) => s.addWater);
  const resetWaterToday = useLumen((s) => s.resetWaterToday);
  const habits = useLumen((s) => s.habits);
  const addHabit = useLumen((s) => s.addHabit);
  const checkHabit = useLumen((s) => s.checkHabit);
  const deleteHabit = useLumen((s) => s.deleteHabit);
  const toggleWidget = useLumen((s) => s.toggleWidget);
  const isWidgetActive = useLumen((s) => s.activeWidgets.habit);
  const lang = useLumen((s) => s.lang);

  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("3");
  const [newUnit, setNewUnit] = useState("lần");
  const [isAdding, setIsAdding] = useState(false);

  const isVi = lang === "vi";
  const today = formatDateKey(new Date());

  if (!isWidgetActive) return null;

  const waterPercent = Math.min(100, Math.round((waterTracker.currentMl / waterTracker.targetMl) * 100));

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      targetPerDay: Math.max(1, parseInt(newTarget, 10) || 1),
      unit: newUnit.trim() || "lần",
      icon: "🎯",
    });
    setNewTitle("");
    setIsAdding(false);
  };

  return (
    <div className="interactive-el fixed top-24 left-4 z-[8400] select-none touch-none animate-in fade-in slide-in-from-top-3 duration-200">
      <div className="w-80 rounded-3xl bg-[#181B22]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-[#F4F5F7] flex flex-col gap-3.5">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">💧</span>
            <span className="font-bold text-xs tracking-wide uppercase text-white/90">
              {isVi ? "Thói Quen & Uống Nước" : "Habits & Water Tracker"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playPop(400);
              toggleWidget("habit", false);
            }}
            className="p-1.5 rounded-xl hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 transition-colors cursor-pointer"
            title={isVi ? "Đóng tiện ích" : "Close Widget"}
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* 1. Daily Water Intake Section */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-cyan-500/10 border border-sky-400/20 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-sky-300">
              <Droplets className="size-4 text-sky-400" />
              <span>{isVi ? "Uống nước hôm nay" : "Daily Water Intake"}</span>
            </div>
            <span className="font-mono text-[11px] font-bold text-sky-200">
              {waterTracker.currentMl} / {waterTracker.targetMl} ml
            </span>
          </div>

          {/* Water Fill Bar */}
          <div className="w-full h-3 bg-sky-950/60 rounded-full overflow-hidden border border-sky-400/20 relative">
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 rounded-full transition-all duration-300 relative"
              style={{ width: `${waterPercent}%` }}
            >
              {waterPercent > 20 && (
                <span className="absolute right-1 top-0 bottom-0 flex items-center text-[9px] font-bold text-sky-950">
                  {waterPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Quick Intake Actions */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <button
              type="button"
              onClick={() => addWater(250)}
              className="flex-1 h-8 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>+250 ml</span>
              <span className="text-[10px]">🥤</span>
            </button>
            <button
              type="button"
              onClick={() => addWater(500)}
              className="flex-1 h-8 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <span>+500 ml</span>
              <span className="text-[10px]">🍶</span>
            </button>
            <button
              type="button"
              onClick={resetWaterToday}
              className="size-8 rounded-xl bg-white/5 hover:bg-white/10 text-[#8B90A0] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title={isVi ? "Đặt lại về 0 ml" : "Reset Water"}
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Habit Tracker Streak List */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-[#8B90A0] uppercase tracking-wider">
              {isVi ? "Thói quen hàng ngày" : "Daily Habits"}
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs text-[#F5A623] hover:text-amber-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>{isVi ? "Thêm thói quen" : "Add Habit"}</span>
            </button>
          </div>

          {/* Add Habit Inline Form */}
          {isAdding && (
            <form onSubmit={handleAddHabit} className="p-2.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder={isVi ? "Tên thói quen (VD: Đọc sách 15 phút)..." : "Habit name..."}
                className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#F5A623]"
                autoFocus
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="w-16 px-2 py-1 rounded-xl bg-black/40 border border-white/10 text-xs text-white text-center focus:outline-none"
                  placeholder={isVi ? "Mục tiêu" : "Target"}
                />
                <input
                  type="text"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="flex-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none"
                  placeholder={isVi ? "Đơn vị (VD: lần, trang, phút)" : "Unit (e.g. times, pages)"}
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xl bg-[#F5A623] text-stone-900 font-bold text-xs cursor-pointer hover:bg-amber-400"
                >
                  {isVi ? "Lưu" : "Save"}
                </button>
              </div>
            </form>
          )}

          {/* Habits Items */}
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {habits.map((habit) => {
              const isDoneToday = habit.completedDates.includes(today);
              const progress = Math.min(100, Math.round((habit.currentCount / habit.targetPerDay) * 100));

              return (
                <div
                  key={habit.id}
                  className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 flex items-center justify-between gap-2.5 transition-colors group"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-sm shrink-0">{habit.icon}</span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs font-medium truncate", isDoneToday ? "line-through text-[#8B90A0]" : "text-[#F4F5F7]")}>
                          {habit.title}
                        </span>
                        {habit.streak > 0 && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 shrink-0">
                            <Flame className="size-3 fill-amber-400" />
                            <span>{habit.streak}{isVi ? " ngày" : "d"}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8B90A0] font-mono">
                        {habit.currentCount}/{habit.targetPerDay} {habit.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => checkHabit(habit.id)}
                      className={cn(
                        "size-7 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                        isDoneToday
                          ? "bg-emerald-500 text-stone-900 font-bold"
                          : "bg-white/10 hover:bg-[#F5A623] hover:text-stone-900 text-white"
                      )}
                      title={isVi ? "Đánh dấu hoàn thành" : "Check in"}
                    >
                      <Check className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteHabit(habit.id)}
                      className="size-7 rounded-xl hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title={isVi ? "Xóa thói quen" : "Delete habit"}
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
