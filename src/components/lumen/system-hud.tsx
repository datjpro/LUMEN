import { useEffect, useState } from "react";
import {
  Activity,
  Battery,
  BatteryCharging,
  ChevronDown,
  ChevronUp,
  Cpu,
  Gauge,
  HardDrive,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import { sampleSystemMetrics } from "@/lib/system-monitor";
import { cn } from "@/lib/utils";

// Mini SVG Sparkline renderer for real-time history (Zero Layout Reflow)
function Sparkline({
  data,
  color,
  height = 16,
  width = 50,
}: {
  data: number[];
  color: string;
  height?: number;
  width?: number;
}) {
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
  const toggleHud = useLumen((s) => s.toggleHud);
  const stats = useLumen((s) => s.systemStats);
  const updateSystemStats = useLumen((s) => s.updateSystemStats);
  const lang = useLumen((s) => s.lang);
  const [expanded, setExpanded] = useState(!hudSettings.compact);

  const isVi = lang === "vi";

  // Real-time system monitoring sampling (Native Win32 IPC + Browser Heap/FPS)
  useEffect(() => {
    if (!hudSettings.enabled) return;

    let isMounted = true;
    const sample = async () => {
      try {
        const patch = await sampleSystemMetrics(stats);
        if (isMounted) {
          updateSystemStats(patch);
        }
      } catch (err) {
        console.debug("[SystemHUD] Sample error:", err);
      }
    };

    // Initial sample
    void sample();
    const interval = setInterval(sample, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [hudSettings.enabled, updateSystemStats]);

  if (!hudSettings.enabled) return null;

  const isHighCpu = stats.cpuUsage >= 90;
  const isHighRam = stats.ramUsage >= 90;

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
      <div className="relative rounded-2xl bg-[#181B22]/95 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.55)] text-[#F4F5F7] text-xs overflow-hidden group">
        {/* Header Capsule Bar */}
        <div className="flex items-center gap-3 px-3 py-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 font-semibold text-[#8B90A0] text-[11px] tracking-wider uppercase">
            <Activity className="size-3.5 text-[#F5A623] animate-pulse" />
            <span>HUD</span>
            <span
              className={cn(
                "px-1.5 py-0.2 rounded text-[9px] font-mono font-bold tracking-tight",
                stats.isNative
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-sky-500/20 text-sky-400 border border-sky-500/30"
              )}
            >
              {stats.isNative ? "WIN32" : "HEAP"}
            </span>
          </div>

          {/* Alert on High Load Indicator */}
          {hudSettings.alertOnHighLoad && (isHighCpu || isHighRam) && (
            <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-bounce">
              ⚠️ {isHighCpu ? (isVi ? "CPU Quá tải" : "CPU High") : (isVi ? "RAM Quá tải" : "RAM High")}
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
                <span className="text-[#8B90A0] text-[10px]">
                  {stats.memoryMode === "heap" ? "HEAP" : "RAM"}
                </span>
                <span className={cn("font-bold", isHighRam ? "text-red-400" : "text-emerald-400")}>
                  {stats.ramUsage}%
                </span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-amber-400/90 font-mono">
              <Gauge className="size-3 text-amber-400" />
              <span>{stats.fps || 60} FPS</span>
            </div>
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
              title={expanded ? (isVi ? "Thu gọn" : "Collapse") : (isVi ? "Mở rộng" : "Expand")}
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
              title={isVi ? "Đóng Giám Sát" : "Close HUD"}
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
                    <span>{stats.isNative ? (isVi ? "Vi xử lý CPU" : "CPU Host") : (isVi ? "Tải khung hình" : "Frame Load")}</span>
                  </span>
                  <span className="font-mono font-bold text-sky-300">{stats.cpuUsage}%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, stats.cpuUsage))}%` }}
                    />
                  </div>
                  <Sparkline data={stats.cpuHistory} color="#38bdf8" />
                </div>
                <span className="text-[10px] text-[#8B90A0] font-mono mt-0.5">
                  {stats.cpuCores || 4} {isVi ? "Luồng" : "Threads"} • {stats.fps || 60} FPS
                </span>
              </div>
            )}

            {/* RAM Module */}
            {hudSettings.showRam && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8B90A0] font-medium">
                    <HardDrive className="size-3.5 text-emerald-400" />
                    <span>{stats.memoryMode === "heap" ? (isVi ? "Bộ nhớ Heap" : "JS Heap") : (isVi ? "Bộ nhớ RAM" : "System RAM")}</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-300">{stats.ramUsage}%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, stats.ramUsage))}%` }}
                    />
                  </div>
                  <Sparkline data={stats.ramHistory} color="#34d399" />
                </div>
                <span className="text-[10px] text-[#8B90A0] font-mono mt-0.5">
                  {stats.memoryMode === "heap"
                    ? `${stats.ramUsedMb} MB / ${(stats.ramTotalMb / 1024).toFixed(1)} GB ${isVi ? "Bộ nhớ" : "Heap"}`
                    : `${(stats.ramUsedMb / 1024).toFixed(1)} GB / ${(stats.ramTotalMb / 1024).toFixed(0)} GB`}
                </span>
              </div>
            )}

            {/* Network Module */}
            {hudSettings.showNetwork && (
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1 col-span-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[#8B90A0] font-medium">
                    {stats.networkOnline ? (
                      <Wifi className="size-3.5 text-emerald-400" />
                    ) : (
                      <WifiOff className="size-3.5 text-red-400" />
                    )}
                    <span>{isVi ? "Trạng thái mạng" : "Network Status"}</span>
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span
                      className={cn(
                        "font-semibold",
                        stats.networkOnline ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {stats.networkOnline
                        ? isVi
                          ? "Đã kết nối Internet"
                          : "Online"
                        : isVi
                        ? "Mất kết nối"
                        : "Offline"}
                    </span>
                    {stats.networkDownKbps > 0 && (
                      <span className="text-sky-400 font-semibold">
                        ⭳ {stats.networkDownKbps > 1024 ? `${(stats.networkDownKbps / 1024).toFixed(1)} MB/s` : `${stats.networkDownKbps} KB/s`}
                      </span>
                    )}
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
                    {stats.batteryCharging
                      ? isVi
                        ? "Đang sạc"
                        : "Charging"
                      : isVi
                      ? "Dùng pin"
                      : "Battery"}
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
