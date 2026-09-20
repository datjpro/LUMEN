import { useState } from "react";
import { Check, Code2, Copy, FileText, Pin, Sparkles, StickyNote, X } from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import { cn } from "@/lib/utils";

const SYNTAX_OPTIONS = [
  { id: "text", label: "Plain Text" },
  { id: "javascript", label: "JavaScript / TS" },
  { id: "python", label: "Python" },
  { id: "json", label: "JSON" },
  { id: "sql", label: "SQL" },
  { id: "markdown", label: "Markdown" },
] as const;

export function ScratchpadWidget() {
  const scratchpad = useLumen((s) => s.scratchpad);
  const setScratchpad = useLumen((s) => s.setScratchpad);
  const toggleScratchpad = useLumen((s) => s.toggleScratchpad);
  const addNote = useLumen((s) => s.addNote);
  const isWidgetActive = useLumen((s) => s.activeWidgets.scratchpad);
  const lang = useLumen((s) => s.lang);

  const [copied, setCopied] = useState(false);
  const isVi = lang === "vi";

  if (!isWidgetActive) return null;

  const handleCopy = () => {
    if (!scratchpad.content) return;
    navigator.clipboard.writeText(scratchpad.content);
    sounds.playPop(720);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStickToDesktop = () => {
    if (!scratchpad.content.trim()) return;
    sounds.playChime();
    addNote({
      title: `Scratchpad (${scratchpad.syntax.toUpperCase()})`,
      body: scratchpad.content,
      tint: "cream",
      x: 35,
      y: 35,
    });
  };

  return (
    <div className="interactive-el fixed bottom-20 left-4 z-[8400] select-none touch-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="w-88 rounded-3xl bg-[#181B22]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-4 text-[#F4F5F7] flex flex-col gap-3">
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="size-4 text-[#F5A623]" />
            <span className="font-bold text-xs tracking-wide uppercase text-white/90">
              {isVi ? "Sổ Tay Code & Nháp Nhanh" : "Quick Scratchpad"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold",
                copied ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-white/10 text-[#8B90A0]"
              )}
              title={isVi ? "Sao chép toàn bộ mã" : "Copy to Clipboard"}
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied && <span className="text-[10px]">{isVi ? "Đã sao chép!" : "Copied!"}</span>}
            </button>

            <button
              type="button"
              onClick={handleStickToDesktop}
              className="p-1.5 rounded-xl hover:bg-white/10 text-[#8B90A0] hover:text-[#F5A623] transition-colors cursor-pointer"
              title={isVi ? "Dán thành ghi chú trên màn hình" : "Stick note on Desktop"}
            >
              <StickyNote className="size-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playPop(400);
                toggleScratchpad(false);
              }}
              className="p-1.5 rounded-xl hover:bg-red-500/20 text-[#8B90A0] hover:text-red-400 transition-colors cursor-pointer"
              title={isVi ? "Đóng sổ nháp" : "Close Scratchpad"}
            >
              <X className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Syntax Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] no-scrollbar">
          {SYNTAX_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                sounds.playPop(520);
                setScratchpad({ syntax: opt.id as any });
              }}
              className={cn(
                "px-2 py-0.8 rounded-lg font-mono font-medium transition-colors shrink-0 cursor-pointer",
                scratchpad.syntax === opt.id
                  ? "bg-[#F5A623]/20 text-[#F5A623] border border-[#F5A623]/40 font-bold"
                  : "bg-white/5 hover:bg-white/10 text-[#8B90A0]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative rounded-2xl bg-black/50 border border-white/10 overflow-hidden p-2.5">
          <textarea
            value={scratchpad.content}
            onChange={(e) => setScratchpad({ content: e.target.value })}
            placeholder={isVi ? "Dán code, JSON hoặc ghi chú nhanh tại đây..." : "Paste code or quick scratchpad here..."}
            rows={7}
            className="w-full bg-transparent font-mono text-xs text-amber-200/90 placeholder:text-white/20 focus:outline-none resize-none leading-relaxed selection:bg-amber-500/30"
            spellCheck={false}
          />
          <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#8B90A0] font-mono">
            <span>{scratchpad.content.length} {isVi ? "ký tự" : "chars"}</span>
            <span>{scratchpad.content.split("\n").length} {isVi ? "dòng" : "lines"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
