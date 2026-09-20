import { useEffect, useRef, useState } from "react";
import { Clock, Sparkles, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";

function parseTimerInput(raw: string): { title: string; durationMs: number } {
  let title = raw.trim();
  let hours = 0;
  let mins = 0;
  let secs = 0;

  const parts = raw.split(/[:\-–—]/);
  let timeStr = "";
  if (parts.length >= 2) {
    title = parts[0].trim();
    timeStr = parts.slice(1).join(" ").trim();
  } else {
    timeStr = raw;
  }

  const hMatch = timeStr.match(/(\d+)\s*(?:g|h|giờ|hour|hours)/i);
  if (hMatch) hours = parseInt(hMatch[1], 10);

  const mMatch = timeStr.match(/(\d+)\s*(?:p|m|phút|min|mins|minute|minutes)/i);
  if (mMatch) mins = parseInt(mMatch[1], 10);

  const sMatch = timeStr.match(/(\d+)\s*(?:s|giây|sec|secs|second|seconds)/i);
  if (sMatch) secs = parseInt(sMatch[1], 10);

  if (parts.length === 1 && (hMatch || mMatch || sMatch)) {
    title =
      raw
        .replace(/(\d+)\s*(?:g|h|giờ|hour|hours)/gi, "")
        .replace(/(\d+)\s*(?:p|m|phút|min|mins|minute|minutes)/gi, "")
        .replace(/(\d+)\s*(?:s|giây|sec|secs|second|seconds)/gi, "")
        .trim() || "Hẹn giờ";
  }

  let totalMs = (hours * 3600 + mins * 60 + secs) * 1000;
  if (totalMs <= 0) {
    const numOnly = parseInt(timeStr.trim(), 10);
    if (!isNaN(numOnly) && numOnly > 0) {
      totalMs = numOnly * 60 * 1000;
    } else {
      totalMs = 5 * 60 * 1000;
    }
  }

  return { title: title || "Hẹn giờ mới", durationMs: totalMs };
}

export function QuickTimer() {
  const open = useLumen((s) => s.quickTimerOpen);
  const setOpen = useLumen((s) => s.setQuickTimerOpen);
  const lang = useLumen((s) => s.lang);
  const isVi = lang === "vi";
  const [input, setInput] = useState(isVi ? "Tập trung làm việc : 25p" : "Focus work : 25m");
  const [pinToDesktop, setPinToDesktop] = useState(true);
  const addReminder = useLumen((s) => s.addReminder);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      sounds.playPop(580);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const parsed = parseTimerInput(input);
    addReminder(parsed.title, parsed.durationMs, pinToDesktop);
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 pointer-events-none">
      {/* Frosted Dialog */}
      <form
        onSubmit={handleSubmit}
        className="interactive-el pointer-events-auto relative z-10 w-full max-w-md rounded-2xl bg-[#1D2029]/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.8)] border border-white/10 text-[#F4F5F7] backdrop-blur-2xl animate-in zoom-in-95 fade-in duration-140 space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-white/6">
          <p className="font-semibold text-xs text-[#F5A623] flex items-center gap-1.5 uppercase tracking-wide">
            <Clock className="size-3.5" />
            <span>{isVi ? "Đặt giờ nhanh (Alt+T)" : "Quick Timer (Alt+T)"}</span>
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white cursor-pointer transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="space-y-2">
          <Input
            ref={inputRef}
            placeholder={isVi ? "Ví dụ: Tập trung làm việc : 25p hoặc Nấu ăn 15p..." : "Example: Focus work : 25m or Cooking 15m..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-[#14161D] border-white/10 text-xs text-[#F4F5F7] placeholder:text-[#8B90A0]/50 focus:border-[#F5A623]/50 focus:ring-1 focus:ring-[#F5A623]/50 h-8.5 rounded-xl"
          />

          {/* Quick Preset Chips */}
          <div className="flex flex-wrap gap-1">
            {[
              { label: isVi ? "🍅 Pomodoro: 25p" : "🍅 Pomodoro: 25m", val: isVi ? "Tập trung làm việc : 25p" : "Focus work : 25m" },
              { label: isVi ? "☕ Nghỉ: 5p" : "☕ Break: 5m", val: isVi ? "Nghỉ ngơi giải lao : 5p" : "Short break : 5m" },
              { label: isVi ? "🍲 Nấu ăn: 15p" : "🍲 Cooking: 15m", val: isVi ? "Nấu ăn : 15p" : "Cooking soup : 15m" },
              { label: isVi ? "⏳ 1 Giờ" : "⏳ 1 Hour", val: isVi ? "Hẹn giờ làm việc : 1g" : "Work session : 1h" },
              { label: isVi ? "⚡ 10 Phút" : "⚡ 10 Mins", val: isVi ? "Làm việc nhanh : 10p" : "Quick sprint : 10m" },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setInput(preset.val)}
                className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#14161D] hover:bg-[#F5A623]/20 hover:text-[#F5A623] text-[#8B90A0] border border-white/6 transition-colors duration-120 cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
          <span className="text-[11px] text-[#8B90A0]">{isVi ? "Ghim đồng hồ đếm ngược nổi trên màn hình" : "Pin floating timer on desktop"}</span>
          <Switch checked={pinToDesktop} onCheckedChange={setPinToDesktop} />
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="cursor-pointer text-[#8B90A0] hover:text-white hover:bg-white/10 text-xs rounded-xl"
            onClick={() => setOpen(false)}
          >
            {isVi ? "Hủy" : "Cancel"}
          </Button>
          <Button
            type="submit"
            size="sm"
            className="cursor-pointer bg-[#F5A623] hover:bg-[#D6871A] text-[#14161D] font-bold text-xs px-4 rounded-xl shadow-xs transition-colors"
          >
            {isVi ? "Bắt đầu đếm giờ" : "Start timer"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function triggerOpenQuickTimer() {
  window.dispatchEvent(new CustomEvent("open-quick-timer"));
}
