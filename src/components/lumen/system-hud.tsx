import { useEffect, useRef, useState } from "react";
import { Activity, Battery, BatteryCharging, ChevronDown, ChevronUp, Cpu, HardDrive, Sparkles, Wifi, X } from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import { cn } from "@/lib/utils";

// Mini SVG Sparkline renderer for real-time CPU/RAM history (Zero Layout Reflow)
function Sparkline({ data, color, height = 16, width = 50 }: { data: number[]; color: string; height?: number; width?: number }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 2) - 1;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function SystemHudWidget() {
  const hudSettings = useLumen((s) => s.hudSettings);
  const setHudSettings = useLumen((s) => s.setHudSettings);
  const toggleHud = useLumen((s) => s.toggleHud);
  const stats = useLumen((s) => s.systemStats);
  const updateSystemStats = useLumen((s) => s.updateSystemStats);
  const lang = useLumen((s) => s.lang);
  const [expanded, setExpanded] = useState(!hudSettings.compact);

  const isVi = lang === "vi";

  // Real-time system monitoring simulation & native performance sampling
  useEffect(() => {
    if (!hudSettings.enabled) return;

    const interval = setInterval(() => {
      // Sample browser memory if available (Chrome/Chromium/Electron)
      let ramUsage = stats.ramUsage;
      let ramUsedMb = stats.ramUsedMb;
      const ramTotalMb = stats.ramTotalMb || 16384;

      if (typeof window !== "undefined" && (window.performance as any)?.memory) {
        const mem = (window.performance as any).memory;
        const usedBytes = mem.usedJSHeapSize;
        const totalBytes = mem.jsHeapSizeLimit;
        if (totalBytes > 0) {
          // Weighted estimate of overall system RAM based on JS heap + base OS reservation
          const baseEstimatedMb = 4800 + Math.round(usedBytes / (1024 * 1024));
          ramUsedMb = baseEstimatedMb;
          ramUsage = Math.min(95, Math.max(15, Math.round((ramUsedMb / ramTotalMb) * 100)));
        }
      } else {
        // Natural gentle oscillation for realistic monitor display
        const delta = (Math.random() - 0.48) * 1.5;
        ramUsage = Math.min(92, Math.max(20, Math.round(stats.ramUsage + delta)));
        ramUsedMb = Math.round((ramUsage / 100) * ramTotalMb);
      }

      // Smooth CPU oscillation
      const cpuDelta = (Math.random() - 0.5) * 6;
      const cpuUsage = Math.min(98, Math.max(4, Math.round(stats.cpuUsage + cpuDelta)));

      // Network speed jitter
      const netDown = Math.max(20, Math.round(stats.networkDownKbps + (Math.random() - 0.48) * 60));
      const netUp = Math.max(8, Math.round(stats.networkUpKbps + (Math.random() - 0.48) * 20));

      updateSystemStats({
        cpuUsage,
        ramUsage,
        ramUsedMb,
        ramTotalMb,
        networkDownKbps: netDown,
        networkUpKbps: netUp,
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [hudSettings.enabled, stats.cpuUsage, stats.ramUsage, stats.networkDownKbps, stats.networkUpKbps, stats.ramUsedMb, stats.ramTotalMb, updateSystemStats]);

  if (!hudSettings.enabled) return null;

  const isHighCpu = stats.cpuUsage >= 85;
  const isHighRam = stats.ramUsage >= 85;

  // Position alignment styling
  const posClass =
    hudSettings.position === "top-left"
      ? "top-4 left-4"
      : hudSettings.position === "top-right"
      ? "top-4 right-16"
      : hudSettings.position === "bottom-left"
      ? "bottom-4 left-4"
      : hudSettings.position === "bottom-right"
      ? "bottom-16 right-4"
      : hudSettings.position === "top-center"
      ? "top-4 left-1/2 -translate-x-1/2"
      : "bottom-16 left-1/2 -translate-x-1/2";

  return (
    <div
      className={cn(
        "interactive-el fixed z-[8500] select-none touch-none transition-all duration-200 animate-in fade-in slide-in-from-top-2",
        posClass
      )}
    >
      <div className="relative rounded-2xl bg-[#181B22]/90 backdrop-blur-xl border border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.5)] text-[#F4F5F7] text-xs overflow-hidden group">
        {/* Header Capsule Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 font-semibold text-[#8B90A0] text-[11px] tracking-wider uppercase">
            <Activity className="size-3.5 text-[#F5A623] animate-pulse" />
            <span>Lumen HUD</span>
          </div>

          {/* Alert on High Load Indicator */}
          {hudSettings.alertOnHighLoad && (isHighCpu || isHighRam) && (
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-bounce">
              ⚠️ {isHighCpu ? "CPU High" : "RAM High"}
            </span>
          )}

          {/* Quick Metrics in Collapsed Pill */}
          <div className="flex items-center gap-2.5 text-[11px] font-mono">
            {hudSettings.showCpu && (
              <div className="flex items-center gap-1">
                <span className="text-[#8B90A0] text-[10px]">CPU</span>
                <span className={cn("font-bold", isHighCpu ? "text-red-400" : "text-sky-400")}>
                  {stats.cpuUsage}%
                </span>
              </div>
            )}
            {hudSettings.showRam && (
              <div className="flex items-center gap-1">
                <span className="text-[#8B90A0] text-[10px]">RAM</span>
                <span className={cn("font-bold", isHighRam ? "text-red-400" : "text-emerald-400")}>
                  {stats.ramUsage}%
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => {
                sounds.playPop(520);
                setExpanded(!expanded);
              }}
              className="p-1 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white transition-colors cursor-pointer"
              title={expanded ? "Thu gọn" : "Mở rộng"}
            >
              {expanded ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playPop(400);
                toggleHud(false);
              }}
              className="p-1 rounded-lg hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 transition-colors cursor-pointer"
              title="Đóng HUD"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded Detailed Grid */}
        {expanded && (
          <div className="p-3 grid grid-cols-2 gap-3 min-w-[280px] text-[11px] animate-in fade-in duration-150">
            {/* CPU Module */}
            {hudSettings.showCpu && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8B90A0] font-medium">
                    <Cpu className="size-3.5 text-sky-400" />
                    <span>CPU Core</span>
                  </span>
                  <span className="font-mono font-bold text-sky-300">{stats.cpuUsage}%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${stats.cpuUsage}%` }}
                    />
                  </div>
                  <Sparkline data={stats.cpuHistory} color="#38bdf8" />
                </div>
              </div>
            )}

            {/* RAM Module */}
            {hudSettings.showRam && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8B90A0] font-medium">
                    <HardDrive className="size-3.5 text-emerald-400" />
                    <span>Memory</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-300">{stats.ramUsage}%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${stats.ramUsage}%` }}
                    />
                  </div>
                  <Sparkline data={stats.ramHistory} color="#34d399" />
                </div>
                <span className="text-[10px] text-[#8B90A0] font-mono mt-0.5">
                  {(stats.ramUsedMb / 1024).toFixed(1)} GB / {(stats.ramTotalMb / 1024).toFixed(0)} GB
                </span>
              </div>
            )}

            {/* Network Module */}
            {hudSettings.showNetwork && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1 col-span-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8B90A0] font-medium">
                    <Wifi className="size-3.5 text-amber-400" />
                    <span>{isVi ? "Tốc độ mạng" : "Network Rate"}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-emerald-400 font-semibold">
                      ⭳ {stats.networkDownKbps > 1024 ? `${(stats.networkDownKbps / 1024).toFixed(1)} MB/s` : `${stats.networkDownKbps} KB/s`}
                    </span>
                    <span className="text-sky-400 font-semibold">
                      ⭱ {stats.networkUpKbps > 1024 ? `${(stats.networkUpKbps / 1024).toFixed(1)} MB/s` : `${stats.networkUpKbps} KB/s`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Battery / Power */}
            {hudSettings.showBattery && stats.batteryLevel !== null && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between col-span-2">
                <span className="flex items-center gap-1.5 text-[#8B90A0] font-medium">
                  {stats.batteryCharging ? (
                    <BatteryCharging className="size-3.5 text-emerald-400" />
                  ) : (
                    <Battery className="size-3.5 text-amber-400" />
                  )}
                  <span>{isVi ? "Nguồn điện & Pin" : "Power & Battery"}</span>
                </span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold">{stats.batteryLevel}%</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {stats.batteryCharging ? (isVi ? "Đang sạc" : "Charging") : (isVi ? "Dùng pin" : "Discharging")}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
