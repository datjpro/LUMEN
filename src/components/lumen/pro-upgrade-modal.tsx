import { useState, useEffect } from "react";
import {
  Check,
  Crown,
  KeyRound,
  Sparkles,
  X,
  Zap,
  Shield,
  Palette,
  Layers,
  BellRing,
  Clock,
  Gift,
  Flame,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const PRO_FEATURES = [
  {
    id: "unlimited_notes",
    icon: Layers,
    titleVi: "Ghi chú không giới hạn",
    titleEn: "Unlimited Sticky Notes",
    descVi: "Tạo hàng trăm ghi chú dán & phân cụm dự án tự do trên màn hình (Bản Free tối đa 5 note).",
    descEn: "Create hundreds of spatial notes & project clusters freely (Free limit: 5 notes).",
    tagVi: "PRO",
    tagEn: "PRO",
  },
  {
    id: "multi_timers",
    icon: BellRing,
    titleVi: "Hẹn giờ đa luồng (Multi-Timer)",
    titleEn: "Multi-Timer System",
    descVi: "Chạy cùng lúc nhiều đồng hồ đếm ngược (nâng cấp nhà game COC, Pomodoro, nấu ăn).",
    descEn: "Run multiple concurrent countdowns (COC builder tracking, Pomodoro, cooking).",
    tagVi: "PRO",
    tagEn: "PRO",
  },
  {
    id: "pro_themes",
    icon: Palette,
    titleVi: "Toàn bộ chủ đề PRO cao cấp",
    titleEn: "All Premium PRO Themes",
    descVi: "Chủ đề Kính mờ Mạ vàng (Glassmorphism Gold), Cyberpunk Neon, và Giấy cổ điển Ink.",
    descEn: "Glassmorphism Gold, Cyberpunk Neon, and Classic Ink themes.",
    tagVi: "PRO",
    tagEn: "PRO",
  },
  {
    id: "exclusive_skins",
    icon: Crown,
    titleVi: "Tủ đồ & Skin Cáo PRO độc quyền",
    titleEn: "Exclusive Companion PRO Skins",
    descVi: "Trang phục Cáo Tuyết (Snow Fox), Obsidian Void, Mũ pháp sư và Phụ kiện cánh.",
    descEn: "Snow Fox, Obsidian Void skins, Wizard Hats, and Wings accessories.",
    tagVi: "PRO",
    tagEn: "PRO",
  },
  {
    id: "ai_cluster",
    icon: Sparkles,
    titleVi: "Tự động gom nhóm thông minh",
    titleEn: "Smart AI Auto-Clustering",
    descVi: "Tự động gom nhóm các ghi chú theo dự án, màu sắc và mức độ ưu tiên chỉ với 1 click.",
    descEn: "Automatically organize and cluster notes by project, color, and priority.",
    tagVi: "PRO",
    tagEn: "PRO",
  },
  {
    id: "pin_lock",
    icon: Shield,
    titleVi: "Khóa bảo mật ghi chú riêng tư",
    titleEn: "Privacy Security PIN Lock",
    descVi: "Đặt mã PIN bảo vệ các ghi chú chứa thông tin nhạy cảm, mật khẩu hoặc ý tưởng bí mật.",
    descEn: "Set PIN code to protect private notes, passwords, and confidential ideas.",
    tagVi: "PRO",
    tagEn: "PRO",
  },
];

export function ProUpgradeModal() {
  const open = useLumen((s) => s.proModalOpen);
  const feature = useLumen((s) => s.proModalFeature);
  const setOpen = useLumen((s) => s.setProModalOpen);
  const pro = useLumen((s) => s.pro);
  const activatePro = useLumen((s) => s.activatePro);
  const deactivatePro = useLumen((s) => s.deactivatePro);
  const lang = useLumen((s) => s.lang);
  const pushToast = useLumen((s) => s.pushToast);

  const [licenseKeyInput, setLicenseKeyInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [now, setNow] = useState(Date.now());
  const isVi = lang === "vi";

  // Update timer ticks every minute for live trial countdown
  useEffect(() => {
    if (!open) return;
    const timer = setInterval(() => setNow(Date.now()), 10000);
    return () => clearInterval(timer);
  }, [open]);

  // Handle escape key to cleanly close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        sounds.playPop(400);
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (!open) return null;

  // Calculate remaining trial time
  const isTrial = pro.isPro && pro.plan === "trial";
  let trialRemainingText = "";

  if (isTrial && pro.expiresAt) {
    const diffMs = pro.expiresAt - now;
    if (diffMs <= 0) {
      trialRemainingText = isVi ? "Đã hết hạn" : "Expired";
    } else {
      const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const mins = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));

      if (days > 0) {
        trialRemainingText = isVi ? `${days} ngày ${hours} giờ` : `${days}d ${hours}h`;
      } else if (hours > 0) {
        trialRemainingText = isVi ? `${hours} giờ ${mins} phút` : `${hours}h ${mins}m`;
      } else {
        trialRemainingText = isVi ? `${mins} phút` : `${mins} mins`;
      }
    }
  }

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    const key = licenseKeyInput.trim();
    if (!key) {
      setErrorMsg(isVi ? "Vui lòng nhập mã kích hoạt" : "Please enter a license key");
      return;
    }

    const result = activatePro(key);
    if (result.success) {
      setErrorMsg("");
      pushToast(
        key.toUpperCase().includes("TRIAL")
          ? isVi
            ? "🎁 Kích hoạt Dùng Thử PRO 3 Ngày thành công!"
            : "🎁 3-Day PRO Trial Activated!"
          : isVi
          ? "🎉 Chúc mừng bạn đã nâng cấp Lumen PRO!"
          : "🎉 Welcome to Lumen PRO!",
        result.message,
      );
      setOpen(false);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleApplyTrial3Day = () => {
    setLicenseKeyInput("LUMENTRIAL3DAY");
    const result = activatePro("LUMENTRIAL3DAY");
    if (result.success) {
      setErrorMsg("");
      pushToast(
        isVi ? "🎁 Đã kích hoạt Gói Dùng Thử PRO 3 Ngày!" : "🎁 3-Day PRO Trial Activated!",
        isVi ? "Bạn có 72 giờ trải nghiệm đầy đủ toàn bộ tính năng PRO." : "You have 72 hours of full PRO access.",
      );
      setOpen(false);
    }
  };

  const handleLifetimeDemoActivate = () => {
    setLicenseKeyInput("LUMEN-PRO-LIFETIME-2026");
    const result = activatePro("LUMEN-PRO-LIFETIME-2026");
    if (result.success) {
      setErrorMsg("");
      pushToast(
        isVi ? "👑 Đã kích hoạt Bản Quyền PRO Trọn Đời!" : "👑 Lifetime PRO Activated!",
        isVi ? "Mở khóa vĩnh viễn không giới hạn." : "Unlimited permanent access.",
      );
      setOpen(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-150"
      onClick={() => {
        sounds.playPop(400);
        setOpen(false);
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="interactive-el relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-amber-500/30 bg-[#161822]/98 text-[#F4F5F7] shadow-[0_30px_90px_rgba(0,0,0,0.95)] overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Golden Radial Backlight Accent */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-96 h-56 rounded-full bg-gradient-to-b from-amber-500/25 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#14161F]/80 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-[#14161D] flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Crown className="size-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight text-white">Lumen Tiers & Bản Quyền</h2>
                {pro.isPro ? (
                  isTrial ? (
                    <span className="flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                      <Gift className="size-3" />
                      {isVi ? "Dùng thử PRO 3 ngày" : "3-Day PRO Trial"}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      <CheckCircle2 className="size-3" />
                      {isVi ? "PRO Trọn Đời" : "Lifetime PRO"}
                    </span>
                  )
                ) : (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    PRO & SVIP
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8B90A0] truncate">
                {isVi
                  ? "Chỉ hỗ trợ dùng thử gói PRO • Gói SVIP hiện đang khóa chưa mở sử dụng"
                  : "PRO 3-Day Trial Available • SVIP Tier is currently locked"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playPop(400);
              setOpen(false);
            }}
            className="size-8 rounded-xl hover:bg-white/10 flex items-center justify-center text-[#8B90A0] hover:text-white transition-colors cursor-pointer shrink-0"
            title="Đóng (Escape)"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-4 min-h-0 text-xs">
          {/* Active Status Highlight Banner (If Pro is Active) */}
          {pro.isPro && (
            <div
              className={cn(
                "p-4 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in",
                isTrial
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={cn(
                    "size-10 rounded-xl flex items-center justify-center shrink-0",
                    isTrial ? "bg-amber-500/20 text-amber-400" : "bg-emerald-500/20 text-emerald-400",
                  )}
                >
                  {isTrial ? <Clock className="size-5" /> : <CheckCircle2 className="size-5" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">
                    {isTrial
                      ? isVi
                        ? "Gói Dùng Thử PRO 3 Ngày đang hoạt động"
                        : "3-Day PRO Trial Active"
                      : isVi
                      ? "Bản Quyền PRO Trọn Đời đang hoạt động"
                      : "Lifetime PRO License Active"}
                  </h4>
                  <p className="text-[11px] opacity-80 truncate">
                    {isTrial
                      ? isVi
                        ? `Mã: ${pro.licenseKey} • Thời gian còn lại: ${trialRemainingText}`
                        : `Key: ${pro.licenseKey} • Remaining: ${trialRemainingText}`
                      : isVi
                      ? `Mã kích hoạt: ${pro.licenseKey || "LIFETIME-PRO"} • Hạn sử dụng: Vĩnh viễn`
                      : `Key: ${pro.licenseKey || "LIFETIME-PRO"} • Access: Permanent`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isTrial && (
                  <Button
                    size="sm"
                    onClick={handleLifetimeDemoActivate}
                    className="h-7 text-[11px] font-bold bg-[#F5A623] hover:bg-[#D6871A] text-[#14161D] rounded-xl cursor-pointer shadow-xs"
                  >
                    <Crown className="size-3 mr-1" />
                    <span>{isVi ? "Kích hoạt PRO Vĩnh Viễn" : "Activate PRO"}</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    deactivatePro();
                    pushToast(isVi ? "Đã chuyển về gói Miễn Phí" : "Switched to Free tier", "");
                  }}
                  className="h-7 text-[10px] text-[#8B90A0] hover:text-red-400 rounded-xl cursor-pointer"
                >
                  {isVi ? "Hủy bản quyền" : "Deactivate"}
                </Button>
              </div>
            </div>
          )}

          {/* 3-Tier Access Cards (FREE vs PRO TRIAL vs SVIP LOCKED) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Free Tier */}
            <div
              className={cn(
                "p-3.5 rounded-2xl border flex flex-col justify-between bg-[#14161D]/60 transition-all",
                !pro.isPro ? "border-white/20 bg-white/5 ring-1 ring-white/10" : "border-white/5 opacity-70",
              )}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#8B90A0] uppercase tracking-wider">
                    {isVi ? "Gói Miễn Phí" : "FREE Tier"}
                  </span>
                  {!pro.isPro && (
                    <span className="text-[9px] font-bold text-white bg-white/10 px-1.5 py-0.2 rounded-md">
                      {isVi ? "Hiện tại" : "Current"}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xl font-extrabold text-white">0đ</span>
                  <span className="text-[10px] text-[#8B90A0] ml-1">/ {isVi ? "mãi mãi" : "forever"}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#8B90A0] pt-1 border-t border-white/6">
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-400 shrink-0" />
                    <span>{isVi ? "Tối đa 5 ghi chú dán" : "Up to 5 sticky notes"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-400 shrink-0" />
                    <span>{isVi ? "1 Hẹn giờ đơn lẻ" : "1 Single countdown timer"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-400 shrink-0" />
                    <span>{isVi ? "Chủ đề & Skin cơ bản" : "Standard themes & skins"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* 2. PRO Tier (WITH 3-DAY TRIAL PASS) */}
            <div
              className={cn(
                "relative p-3.5 rounded-2xl border flex flex-col justify-between bg-gradient-to-b from-amber-500/15 via-[#181A24] to-[#14161D] transition-all",
                pro.isPro && (isTrial || pro.plan === "lifetime")
                  ? "border-[#F5A623] ring-1 ring-[#F5A623]/60 shadow-md shadow-amber-500/10"
                  : "border-amber-500/40 hover:border-[#F5A623]",
              )}
            >
              <div className="absolute -top-2.5 right-3 px-2 py-0.2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[#14161D] text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-0.5">
                <Flame className="size-2.5" />
                <span>HOT PRO TRIAL</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Gift className="size-3" />
                    <span>{isVi ? "Gói PRO (Dùng Thử)" : "PRO Tier"}</span>
                  </span>
                  {isTrial && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-500/20 px-1.5 py-0.2 rounded-md">
                      {isVi ? "Đang bật" : "Active"}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xl font-extrabold text-[#F5A623]">0đ</span>
                  <span className="text-[10px] text-amber-200/80 ml-1">/ 72 {isVi ? "giờ thử PRO" : "hours trial"}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-stone-300 pt-1 border-t border-white/6">
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3 text-amber-400 shrink-0" />
                    <span className="font-semibold text-white">{isVi ? "Không giới hạn ghi chú & hẹn giờ" : "Unlimited notes & timers"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3 text-amber-400 shrink-0" />
                    <span>{isVi ? "Themes & Tủ đồ Cáo PRO" : "PRO themes & wardrobe"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="size-3 text-amber-400 shrink-0" />
                    <span>
                      {isVi ? "Mã: " : "Code: "}
                      <code className="bg-amber-400/20 text-amber-300 px-1 rounded font-mono font-bold">
                        LUMENTRIAL3DAY
                      </code>
                    </span>
                  </li>
                </ul>
              </div>

              {!isTrial && !pro.isPro && (
                <Button
                  size="sm"
                  onClick={handleApplyTrial3Day}
                  className="mt-3 w-full h-7 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-[#14161D] rounded-xl cursor-pointer shadow-xs"
                >
                  <Gift className="size-3 mr-1" />
                  <span>{isVi ? "Thử ngay PRO 3 ngày (0đ)" : "Claim 3-Day PRO Trial"}</span>
                </Button>
              )}
            </div>

            {/* 3. SVIP Tier (LOCKED / KHÓA KHÔNG CHO PHÉP SỬ DỤNG) */}
            <div className="relative overflow-hidden p-3.5 rounded-2xl border border-red-500/30 bg-gradient-to-b from-[#201518] to-[#14161D] flex flex-col justify-between opacity-80 group">
              {/* Locked Watermark & Banner */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[9px] font-bold uppercase tracking-wider">
                <Lock className="size-2.5" />
                <span>{isVi ? "ĐÃ KHÓA" : "LOCKED"}</span>
              </div>

              <div className="relative space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                    <Crown className="size-3 text-red-400" />
                    <span>Gói SVIP</span>
                  </span>
                </div>
                <div>
                  <span className="text-xl font-extrabold text-[#8B90A0] line-through">SVIP</span>
                  <span className="text-[10px] text-red-400 font-semibold ml-1.5">({isVi ? "Chưa mở" : "Locked"})</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-[#8B90A0] pt-1 border-t border-white/6">
                  <li className="flex items-center gap-1.5">
                    <Lock className="size-3 text-red-400/70 shrink-0" />
                    <span>{isVi ? "Đồng bộ đám mây P2P (Khóa)" : "P2P Cloud Sync (Locked)"}</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Lock className="size-3 text-red-400/70 shrink-0" />
                    <span>{isVi ? "Trợ lý AI Neural Companion (Khóa)" : "Neural AI Companion (Locked)"}</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-[10px] text-red-400 font-medium">
                    <span>{isVi ? "⚠️ Bản SVIP bị khóa, không cho dùng thử" : "⚠️ SVIP is locked, no trial allowed"}</span>
                  </li>
                </ul>
              </div>

              <Button
                disabled
                size="sm"
                className="mt-3 w-full h-7 text-[11px] font-semibold bg-white/5 text-[#8B90A0] border border-white/10 rounded-xl cursor-not-allowed"
              >
                <Lock className="size-3 mr-1 text-red-400" />
                <span>{isVi ? "Bị Khóa (Chưa Mở)" : "Locked Tier"}</span>
              </Button>
            </div>
          </div>

          {/* Feature Showcase Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#F4F5F7] flex items-center justify-between">
              <span>{isVi ? "Đặc quyền mở khóa trên Lumen PRO" : "Lumen PRO Unlocked Features"}</span>
              <span className="text-[10px] text-[#8B90A0] font-normal">
                {isVi ? "6 tính năng chuyên nghiệp" : "6 exclusive perks"}
              </span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[190px] overflow-y-auto custom-scrollbar pr-1">
              {PRO_FEATURES.map((item) => {
                const Icon = item.icon;
                const isTarget = feature === item.id;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-2.5 p-2.5 rounded-2xl border transition-all duration-120",
                      isTarget
                        ? "border-[#F5A623] bg-[#F5A623]/10 ring-1 ring-[#F5A623]/40"
                        : "border-white/6 bg-[#14161D]/50 hover:border-white/12",
                    )}
                  >
                    <div className="size-7 rounded-xl bg-[#F5A623]/15 text-[#F5A623] flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-1">
                        <h5 className="font-semibold text-xs text-[#F4F5F7] truncate">
                          {isVi ? item.titleVi : item.titleEn}
                        </h5>
                        <span className="text-[8px] font-mono px-1 py-0.1 rounded bg-white/5 text-[#8B90A0] shrink-0">
                          {isVi ? item.tagVi : item.tagEn}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8B90A0] leading-snug line-clamp-2">
                        {isVi ? item.descVi : item.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* License Activation Form & One-Click Shortcuts */}
          {!pro.isPro && (
            <div className="p-3.5 rounded-2xl bg-[#14161D]/80 border border-white/8 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-[#F4F5F7] flex items-center gap-1.5">
                  <KeyRound className="size-3.5 text-[#F5A623]" />
                  <span>{isVi ? "Kích hoạt bằng mã bản quyền PRO" : "Activate with PRO License Key"}</span>
                </label>
                <span className="text-[10px] text-[#8B90A0]">
                  {isVi ? "Dùng thử PRO: " : "PRO Trial code: "}
                  <button
                    type="button"
                    onClick={() => setLicenseKeyInput("LUMENTRIAL3DAY")}
                    className="font-mono text-[#F5A623] hover:underline font-bold cursor-pointer"
                  >
                    LUMENTRIAL3DAY
                  </button>
                </span>
              </div>

              <form onSubmit={handleActivate} className="flex gap-2">
                <div className="relative flex-1">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[#8B90A0]" />
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => {
                      setLicenseKeyInput(e.target.value.toUpperCase());
                      setErrorMsg("");
                    }}
                    placeholder={
                      isVi
                        ? "Nhập LUMENTRIAL3DAY hoặc mã PRO..."
                        : "Enter LUMENTRIAL3DAY or PRO license key..."
                    }
                    className="w-full bg-[#181A24] border border-white/10 rounded-xl pl-8 pr-3 h-8 text-xs font-mono text-[#F4F5F7] placeholder:text-[#8B90A0]/50 outline-none focus:border-[#F5A623]"
                  />
                </div>

                <Button
                  type="submit"
                  className="h-8 text-xs font-bold bg-[#F5A623] hover:bg-[#D6871A] text-[#14161D] rounded-xl px-4 cursor-pointer shadow-xs gap-1 shrink-0"
                >
                  <Zap className="size-3.5" />
                  <span>{isVi ? "Kích hoạt" : "Activate"}</span>
                </Button>
              </form>

              {errorMsg && (
                <p className="text-[11px] text-red-400 font-medium animate-in fade-in">{errorMsg}</p>
              )}

              {/* Quick One-Click Shortcuts Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-[#8B90A0]">
                <span>{isVi ? "Lối tắt nhanh:" : "Quick Actions:"}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApplyTrial3Day}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 hover:underline font-semibold cursor-pointer"
                  >
                    <Gift className="size-3" />
                    <span>{isVi ? "Dùng thử PRO 3 ngày (LUMENTRIAL3DAY)" : "3-Day PRO Trial"}</span>
                  </button>
                  <span className="text-white/20">•</span>
                  <button
                    type="button"
                    onClick={handleLifetimeDemoActivate}
                    className="flex items-center gap-1 text-[#8B90A0] hover:text-white hover:underline cursor-pointer"
                  >
                    <Sparkles className="size-3 text-[#F5A623]" />
                    <span>{isVi ? "Mở khóa PRO Trọn Đời" : "Lifetime PRO"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-white/8 bg-[#14161F]/90 shrink-0">
          <div className="flex items-center gap-2 text-[10px] text-[#8B90A0]">
            <Shield className="size-3.5 text-emerald-400" />
            <span>
              {isVi
                ? "Dữ liệu lưu cục bộ 100% riêng tư (Local-First), không gửi lên server."
                : "100% Local-First Private Storage on your device."}
            </span>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              sounds.playPop(400);
              setOpen(false);
            }}
            className="h-8 text-xs text-[#8B90A0] hover:text-white px-4 rounded-xl cursor-pointer"
          >
            {isVi ? "Đóng" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}
