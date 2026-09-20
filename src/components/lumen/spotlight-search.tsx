import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Calculator,
  Calendar,
  Check,
  CheckSquare,
  Clock,
  Code2,
  Copy,
  CornerDownLeft,
  Droplets,
  Folder,
  LayoutGrid,
  Lock,
  Music2,
  Pin,
  Plus,
  Search,
  Settings,
  Sparkles,
  Terminal,
  Trash2,
  X,
} from "lucide-react";
import { sounds } from "@/lib/audio";
import { evaluateExpression, type CalculationResult } from "@/lib/calculator-utils";
import { useLumen } from "@/lib/store";
import type { CalendarEvent, Note, SnippetItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SpotlightSearch() {
  const searchOpen = useLumen((s) => s.searchOpen);
  const setSearchOpen = useLumen((s) => s.setSearchOpen);
  const notes = useLumen((s) => s.notes);
  const trashNotes = useLumen((s) => s.trashNotes);
  const calendarEvents = useLumen((s) => s.calendarEvents);
  const setCalendarOpen = useLumen((s) => s.setCalendarOpen);
  const setHubOpen = useLumen((s) => s.setHubOpen);
  const setSelectedCalendarDate = useLumen((s) => s.setSelectedCalendarDate);
  const bringNote = useLumen((s) => s.bringNote);
  const updateNote = useLumen((s) => s.updateNote);
  const setHighlightNoteId = useLumen((s) => s.setHighlightNoteId);
  const setSelectedCluster = useLumen((s) => s.setSelectedCluster);
  const addNote = useLumen((s) => s.addNote);
  const restoreNote = useLumen((s) => s.restoreNote);
  const tidyNotes = useLumen((s) => s.tidyNotes);
  const toggleWidget = useLumen((s) => s.toggleWidget);
  const toggleHud = useLumen((s) => s.toggleHud);
  const toggleScratchpad = useLumen((s) => s.toggleScratchpad);
  const snippets = useLumen((s) => s.snippets);
  const lang = useLumen((s) => s.lang);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isVi = lang === "vi";

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setSelectedIndex(0);
      setCopiedText(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Global Keyboard Shortcut: Alt+F to toggle search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "f" || e.key === "F" || e.code === "KeyF")) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "F" || e.code === "KeyF")) {
        const activeTag = (document.activeElement?.tagName || "").toLowerCase();
        if (activeTag !== "input" && activeTag !== "textarea") {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  if (!searchOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // 1. Math / Unit / Currency calculation
  const calcResult: CalculationResult | null = evaluateExpression(query);

  // 2. Filter Notes
  const filteredNotes = notes.filter((n) => {
    if (!trimmed) return true;
    const inBody = n.body.toLowerCase().includes(trimmed);
    const inTitle = n.title?.toLowerCase().includes(trimmed) ?? false;
    const inCluster = n.cluster?.toLowerCase().includes(trimmed) ?? false;
    const inTodos = n.checkItems?.some((item) => item.text.toLowerCase().includes(trimmed)) ?? false;
    return inBody || inTitle || inCluster || inTodos;
  });

  // 3. Filter Calendar Events
  const filteredCalendarEvents = trimmed
    ? calendarEvents.filter((ev) => {
        const inTitle = ev.title.toLowerCase().includes(trimmed);
        const inDesc = ev.description?.toLowerCase().includes(trimmed) ?? false;
        const inDate = ev.startDate.includes(trimmed);
        return inTitle || inDesc || inDate;
      })
    : [];

  // 4. Filter Snippets Vault
  const filteredSnippets = trimmed
    ? (snippets || []).filter(
        (s) =>
          s.title.toLowerCase().includes(trimmed) ||
          s.prefix.toLowerCase().includes(trimmed) ||
          s.content.toLowerCase().includes(trimmed)
      )
    : [];

  // 5. Quick Actions
  const quickActions = [
    {
      id: "action-pomodoro",
      title: isVi ? "🍅 Bật / Tắt Pomodoro Matrix" : "🍅 Toggle Pomodoro Matrix",
      keywords: ["pomodoro", "focus", "tap trung", "hen gio"],
      run: () => {
        toggleWidget("pomodoro");
        setSearchOpen(false);
      },
    },
    {
      id: "action-hud",
      title: isVi ? "📊 Bật / Tắt Giám Sát Phần Cứng (Lumen HUD)" : "📊 Toggle System HUD Monitor",
      keywords: ["hud", "cpu", "ram", "system", "giam sat", "phan cung"],
      run: () => {
        toggleHud();
        setSearchOpen(false);
      },
    },
    {
      id: "action-habit",
      title: isVi ? "💧 Bật / Tắt Thói Quen & Uống Nước" : "💧 Toggle Habit & Water Tracker",
      keywords: ["water", "habit", "uong nuoc", "thoi quen"],
      run: () => {
        toggleWidget("habit");
        setSearchOpen(false);
      },
    },
    {
      id: "action-scratchpad",
      title: isVi ? "📝 Bật / Tắt Sổ Tay Code & Nháp Nhanh" : "📝 Toggle Quick Scratchpad",
      keywords: ["scratchpad", "code", "nhap", "so tay"],
      run: () => {
        toggleScratchpad();
        setSearchOpen(false);
      },
    },
    {
      id: "action-visualizer",
      title: isVi ? "🎵 Bật / Tắt Audio Visualizer Bar" : "🎵 Toggle Audio Visualizer Bar",
      keywords: ["visualizer", "audio", "nhac", "music", "song am"],
      run: () => {
        toggleWidget("visualizer");
        setSearchOpen(false);
      },
    },
    {
      id: "action-arrange",
      title: isVi ? "🪟 Sắp xếp ghi chú gọn gàng (Alt+A)" : "🪟 Arrange Notes (Alt+A)",
      keywords: ["arrange", "sap xep", "tidy", "gon"],
      run: () => {
        tidyNotes();
        setSearchOpen(false);
      },
    },
    {
      id: "action-calendar",
      title: isVi ? "📅 Mở Lịch Không Gian & Kế Hoạch (Alt+C)" : "📅 Open Spatial Calendar (Alt+C)",
      keywords: ["calendar", "lich", "ke hoach", "agenda"],
      run: () => {
        setSearchOpen(false);
        setCalendarOpen(true);
      },
    },
    {
      id: "action-settings",
      title: isVi ? "⚙️ Cài Đặt Hệ Thống & Giao Diện (Alt+S)" : "⚙️ Settings & Preferences (Alt+S)",
      keywords: ["settings", "cai dat", "hub", "theme"],
      run: () => {
        setSearchOpen(false);
        setHubOpen(true);
      },
    },
  ].filter((act) => {
    if (!trimmed) return true;
    if (trimmed.startsWith(">") || trimmed.startsWith("/")) {
      const actQuery = trimmed.slice(1).trim();
      return !actQuery || act.keywords.some((k) => k.includes(actQuery)) || act.title.toLowerCase().includes(actQuery);
    }
    return act.keywords.some((k) => k.includes(trimmed)) || act.title.toLowerCase().includes(trimmed);
  });

  // 6. Filter Trash
  const filteredTrash = trimmed
    ? (trashNotes || []).filter((n) => {
        const inBody = n.body.toLowerCase().includes(trimmed);
        const inTitle = n.title?.toLowerCase().includes(trimmed) ?? false;
        const inCluster = n.cluster?.toLowerCase().includes(trimmed) ?? false;
        return inBody || inTitle || inCluster;
      })
    : [];

  const handleSelectEvent = (event: CalendarEvent) => {
    sounds.playChime();
    setSelectedCalendarDate(event.startDate);
    setSearchOpen(false);
    setCalendarOpen(true);
  };

  const handleSelectNote = (targetNote: Note, isTrash = false) => {
    sounds.playChime();
    setSearchOpen(false);

    if (isTrash) {
      restoreNote(targetNote.id);
      setHighlightNoteId(targetNote.id);
      setTimeout(() => setHighlightNoteId(null), 3000);
      return;
    }

    if (targetNote.cluster) {
      setSelectedCluster(targetNote.cluster);
    }
    if (targetNote.collapsed) {
      updateNote(targetNote.id, { collapsed: false });
    }
    bringNote(targetNote.id);
    setHighlightNoteId(targetNote.id);
    setTimeout(() => setHighlightNoteId(null), 3200);
  };

  const handleCopySnippet = (snip: SnippetItem) => {
    navigator.clipboard.writeText(snip.content);
    sounds.playPop(720);
    setCopiedText(snip.id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCreateFromQuery = () => {
    if (!trimmed) return;
    const newId = addNote({ body: query.trim() });
    setSearchOpen(false);
    setHighlightNoteId(newId);
    setTimeout(() => setHighlightNoteId(null), 3000);
  };

  const handleCopyCalc = () => {
    if (!calcResult) return;
    navigator.clipboard.writeText(calcResult.result);
    sounds.playPop(720);
    setCopiedText("calc");
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleStickCalc = () => {
    if (!calcResult) return;
    sounds.playChime();
    addNote({
      title: calcResult.expression,
      body: `Kết quả: ${calcResult.result}\n${calcResult.detail || ""}`,
      tint: "cream",
    });
    setSearchOpen(false);
  };

  const totalResults =
    (calcResult ? 1 : 0) +
    filteredCalendarEvents.length +
    filteredNotes.length +
    filteredSnippets.length +
    quickActions.length +
    filteredTrash.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSearchOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalResults));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev <= 0 ? Math.max(0, totalResults - 1) : prev - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (calcResult && selectedIndex === 0) {
        handleCopyCalc();
        return;
      }
      if (filteredCalendarEvents.length > 0) {
        handleSelectEvent(filteredCalendarEvents[0]);
      } else if (filteredNotes.length > 0) {
        handleSelectNote(filteredNotes[0]);
      } else if (quickActions.length > 0) {
        quickActions[0].run();
      } else if (trimmed) {
        handleCreateFromQuery();
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[8600] flex items-start justify-center pt-[12vh] px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-[#181A22]/98 border border-white/15 shadow-[0_25px_70px_rgba(0,0,0,0.85)] text-[#F4F5F7] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
          <Search className="size-5 text-[#F5A623] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isVi
                ? "Tìm ghi chú, tính toán (15% of 250), đổi tiền (100 usd to vnd), lệnh (>)..."
                : "Search notes, calculate (15% of 250), convert (100 usd in vnd), actions (>)..."
            }
            className="flex-1 bg-transparent text-sm text-[#F4F5F7] placeholder:text-[#8B90A0]/60 outline-none caret-[#F5A623]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-lg hover:bg-white/10 text-[#8B90A0] hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-[#8B90A0] bg-white/5 border border-white/10 rounded-md">
            ESC đóng
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[62vh] overflow-y-auto p-2.5 space-y-2 note-scrollbar">
          {/* 1. Calculator / Converter Live Result Card */}
          {calcResult && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                  <Calculator className="size-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-mono text-amber-300/80 line-clamp-1">
                    {calcResult.expression} =
                  </span>
                  <span className="text-lg font-mono font-extrabold text-white tracking-tight">
                    {calcResult.result}
                  </span>
                  {calcResult.detail && (
                    <span className="text-[10px] text-[#8B90A0] mt-0.5">{calcResult.detail}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyCalc}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copiedText === "calc" ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                  <span>{copiedText === "calc" ? "Đã chép" : "Copy"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleStickCalc}
                  className="px-2.5 py-1.5 rounded-xl bg-[#F5A623] hover:bg-amber-400 text-stone-900 text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <Plus className="size-3.5" />
                  <span>Dán note</span>
                </button>
              </div>
            </div>
          )}

          {/* Empty fallback */}
          {totalResults === 0 && !calcResult && (
            <div className="py-8 px-4 text-center text-[#8B90A0] flex flex-col items-center gap-2">
              <Sparkles className="size-8 text-[#F5A623]/40" />
              <p className="text-xs">Không tìm thấy ghi chú hoặc lệnh nào khớp với &quot;{query}&quot;</p>
              {trimmed && (
                <button
                  type="button"
                  onClick={handleCreateFromQuery}
                  className="mt-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5A623] hover:bg-[#D6871A] text-[#14161D] font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Tạo ghi chú mới: &quot;{query.slice(0, 30)}&quot;</span>
                </button>
              )}
            </div>
          )}

          {/* 2. Snippets Vault Matches */}
          {filteredSnippets.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#F5A623] uppercase tracking-wider px-2 block">
                Kho Mẫu Văn Bản (Snippets Vault)
              </span>
              {filteredSnippets.map((snip) => (
                <div
                  key={snip.id}
                  onClick={() => handleCopySnippet(snip)}
                  className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="px-1.5 py-0.5 rounded-md bg-[#F5A623]/15 text-[#F5A623] font-mono text-[10px] font-bold border border-[#F5A623]/30 shrink-0">
                      {snip.prefix}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate">{snip.title}</span>
                      <span className="text-[11px] text-[#8B90A0] line-clamp-1 font-mono">{snip.content}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopySnippet(snip);
                    }}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-xs text-[#8B90A0] hover:text-white flex items-center gap-1 transition-colors shrink-0"
                  >
                    {copiedText === snip.id ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    <span className="text-[10px] font-medium">{copiedText === snip.id ? "Đã copy!" : "Copy"}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 3. Calendar Events Matches */}
          {filteredCalendarEvents.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#F5A623] uppercase tracking-wider px-2 block">
                Sự Kiện Lịch Trình (Calendar Events)
              </span>
              {filteredCalendarEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => handleSelectEvent(ev)}
                  className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] hover:bg-[#262A35] border border-white/5 hover:border-[#F5A623]/40 cursor-pointer transition-all"
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className="p-1.5 rounded-xl bg-[#F5A623]/20 text-[#F5A623] shrink-0 mt-0.5">
                      <Calendar className="size-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold leading-snug line-clamp-1">{ev.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-mono text-[#F5A623] bg-[#F5A623]/10 px-1.5 py-0.5 rounded border border-[#F5A623]/20">
                          📅 {ev.startDate} {ev.startTime ? `@ ${ev.startTime}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                  <kbd className="text-[10px] font-mono text-[#8B90A0] bg-white/5 px-2 py-0.5 rounded">
                    ↵ Mở Lịch
                  </kbd>
                </div>
              ))}
            </div>
          )}

          {/* 4. Notes Matches */}
          {filteredNotes.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8B90A0] uppercase tracking-wider px-2 block">
                Ghi Chú Trên Màn Hình ({filteredNotes.length})
              </span>
              {filteredNotes.map((n) => {
                const completedTodos = n.checkItems?.filter((t) => t.done).length || 0;
                const totalTodos = n.checkItems?.length || 0;

                return (
                  <div
                    key={n.id}
                    onClick={() => handleSelectNote(n)}
                    className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-white/[0.03] hover:bg-[#262A35] border border-white/5 hover:border-[#F5A623]/40 cursor-pointer transition-all"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={cn(
                          "size-3 rounded-full mt-1 shrink-0 shadow-xs border border-white/20",
                          `bg-note-${n.tint}`
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium leading-snug line-clamp-2">
                          {n.body.trim() || "(Ghi chú không lời)"}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {n.cluster && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-[#F5A623] bg-[#F5A623]/10 px-1.5 py-0.5 rounded border border-[#F5A623]/20">
                              <Folder className="size-2.5" />
                              <span>{n.cluster}</span>
                            </span>
                          )}
                          {totalTodos > 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-[#3FAE6C] bg-[#3FAE6C]/10 px-1.5 py-0.5 rounded border border-[#3FAE6C]/20">
                              <CheckSquare className="size-2.5" />
                              <span>
                                {completedTodos}/{totalTodos} việc
                              </span>
                            </span>
                          )}
                          {n.pinned && (
                            <span className="flex items-center gap-1 text-[10px] text-[#F5A623] bg-white/5 px-1.5 py-0.5 rounded">
                              <Pin className="size-2.5" />
                              <span>Ghim</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#8B90A0]">
                      <CornerDownLeft className="size-2.5 mr-0.5" /> Nhảy tới
                    </kbd>
                  </div>
                );
              })}
            </div>
          )}

          {/* 5. Quick Actions Section */}
          {quickActions.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#8B90A0] uppercase tracking-wider px-2 block">
                Lệnh Nhanh & Tiện Ích (Quick Actions)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickActions.map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={act.run}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.03] hover:bg-[#262A35] border border-white/5 hover:border-white/15 text-left text-xs text-[#F4F5F7] font-medium transition-colors cursor-pointer"
                  >
                    <span className="truncate">{act.title}</span>
                    <CornerDownLeft className="size-3 text-[#8B90A0] shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. Trash Section */}
          {filteredTrash.length > 0 && (
            <div className="pt-2 border-t border-white/10 space-y-1">
              <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider px-2 block">
                Trong thùng rác (Nhấn để khôi phục)
              </span>
              {filteredTrash.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelectNote(n, true)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 cursor-pointer transition-colors text-xs"
                >
                  <span className="truncate line-clamp-1">{n.body}</span>
                  <span className="text-[10px] text-red-400 font-bold shrink-0">Khôi phục ↺</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
