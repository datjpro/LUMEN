import { useEffect, useRef, useState } from "react";
import { Music2, Sliders, Volume2, X } from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import { cn } from "@/lib/utils";

export function AudioVisualizerWidget() {
  const visualizerSettings = useLumen((s) => s.visualizerSettings);
  const setVisualizerSettings = useLumen((s) => s.setVisualizerSettings);
  const toggleWidget = useLumen((s) => s.toggleWidget);
  const isWidgetActive = useLumen((s) => s.activeWidgets.visualizer);
  const lang = useLumen((s) => s.lang);

  const [bars, setBars] = useState<number[]>(() => Array.from({ length: 16 }, () => 20));
  const isVi = lang === "vi";

  // GPU composited 60 FPS audio visualizer simulation
  useEffect(() => {
    if (!isWidgetActive) return;

    let raf = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      if (time - lastTime > 40) {
        lastTime = time;
        setBars((prev) =>
          prev.map((val, i) => {
            const harmonic = Math.sin(time * 0.005 + i * 0.4) * 0.5 + 0.5;
            const jitter = (Math.random() - 0.5) * 25;
            const target = harmonic * 75 + 15 + jitter;
            return Math.max(10, Math.min(95, val * 0.6 + target * 0.4));
          })
        );
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isWidgetActive]);

  if (!isWidgetActive) return null;

  return (
    <div className="interactive-el fixed bottom-4 left-1/2 -translate-x-1/2 z-[8400] select-none touch-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="rounded-3xl bg-[#181B22]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] px-4 py-2.5 text-[#F4F5F7] flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-bold text-xs text-amber-400">
          <Music2 className="size-4 animate-bounce" />
          <span className="uppercase tracking-wide text-[11px] font-mono">Audio Sync</span>
        </div>

        {/* 16 Audio Bars */}
        <div className="flex items-end gap-1 h-7 px-2">
          {bars.map((heightPercent, idx) => (
            <div
              key={idx}
              className="w-1.5 rounded-full bg-gradient-to-t from-[#F5A623] via-amber-400 to-sky-400 transition-all duration-75"
              style={{
                height: `${heightPercent}%`,
                opacity: 0.4 + (heightPercent / 100) * 0.6,
              }}
            />
          ))}
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={() => {
            sounds.playPop(400);
            toggleWidget("visualizer", false);
          }}
          className="p-1.5 rounded-xl hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 transition-colors cursor-pointer"
          title="Đóng Visualizer"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
