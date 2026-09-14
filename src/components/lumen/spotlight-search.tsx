import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  CheckSquare,
  CornerDownLeft,
  Folder,
  Lock,
  Pin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { sounds } from "@/lib/audio";
import { useLumen } from "@/lib/store";
import type { CalendarEvent, Note } from "@/lib/types";
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
  const permanentDeleteNote = useLumen((s) => s.permanentDeleteNote);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [purgingNoteId, setPurgingNoteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      setQuery("");
      setSelectedIndex(0);
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

  const filteredNotes = notes.filter((n) => {
    if (!trimmed) return true;
    const inBody = n.body.toLowerCase().includes(trimmed);
    const inTitle = n.title?.toLowerCase().includes(trimmed) ?? false;
    const inCluster = n.cluster?.toLowerCase().includes(trimmed) ?? false;
    const inTodos = n.checkItems?.some((item) => item.text.toLowerCase().includes(trimmed)) ?? false;
    return inBody || inTitle || inCluster || inTodos;
  });

  const filteredTrash = trimmed
    ? (trashNotes || []).filter((n) => {
        const inBody = n.body.toLowerCase().includes(trimmed);
        const inTitle = n.title?.toLowerCase().includes(trimmed) ?? false;
        const inCluster = n.cluster?.toLowerCase().includes(trimmed) ?? false;
        return inBody || inTitle || inCluster;
      })
    : [];

  const filteredCalendarEvents = trimmed
    ? calendarEvents.filter((ev) => {
        const inTitle = ev.title.toLowerCase().includes(trimmed);
        const inDesc = ev.description?.toLowerCase().includes(trimmed) ?? false;
        const inDate = ev.startDate.includes(trimmed);
        return inTitle || inDesc || inDate;
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

  const handleCreateFromQuery = () => {
    if (!trimmed) return;
    const newId = addNote({ body: query.trim() });
    setSearchOpen(false);
    setHighlightNoteId(newId);
    setTimeout(() => setHighlightNoteId(null), 3000);
  };

  const totalResults = filteredCalendarEvents.length + filteredNotes.length + filteredTrash.length;

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
      if (filteredCalendarEvents.length > 0 && selectedIndex < filteredCalendarEvents.length) {
        handleSelectEvent(filteredCalendarEvents[selectedIndex]);
      } else {
        const noteIdx = selectedIndex - filteredCalendarEvents.length;
        if (filteredNotes.length > 0 && noteIdx >= 0 && noteIdx < filteredNotes.length) {
          handleSelectNote(filteredNotes[noteIdx]);
        } else if (filteredTrash.length > 0 && noteIdx >= filteredNotes.length) {
          handleSelectNote(filteredTrash[noteIdx - filteredNotes.length], true);
        } else if (trimmed) {
          handleCreateFromQuery();
        }
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[280] flex items-start justify-center pt-[15vh] px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-150 select-none"
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#181A22]/98 border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-[#F4F5F7] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 backdrop-blur-2xl"
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
            placeholder="Tìm kiếm nội dung ghi chú, checklist, cụm nhóm... (Alt+F)"
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

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 note-scrollbar">
          {totalResults === 0 && (
            <div className="py-8 px-4 text-center text-[#8B90A0] flex flex-col items-center gap-2">
              <Sparkles className="size-8 text-[#F5A623]/40" />
              <p className="text-xs">Không tìm thấy ghi chú hoặc lịch trình nào khớp với &quot;{query}&quot;</p>
              {trimmed && (
                <button
                  type="button"
                  onClick={handleCreateFromQuery}
                  className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5A623] hover:bg-[#D6871A] text-[#14161D] font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Tạo ghi chú mới: &quot;{query.slice(0, 25)}&quot;</span>
                </button>
              )}
            </div>
          )}

          {/* Calendar Events Match Group */}
          {filteredCalendarEvents.map((ev, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={ev.id}
                onClick={() => handleSelectEvent(ev)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{ animationDelay: `${Math.min(idx, 15) * 25}ms` }}
                className={cn(
                  "flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-140 ease-[var(--ease-snap)] animate-in fade-in slide-in-from-bottom-1 fill-mode-both",
                  isSelected
                    ? "bg-[#262A35] border-[#F5A623]/50 shadow-md text-white translate-x-1"
                    : "bg-white/[0.02] border-transparent hover:bg-white/[0.05] text-[#F4F5F7]",
                )}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="p-1.5 rounded-lg bg-[#F5A623]/20 text-[#F5A623] shrink-0 mt-0.5">
                    <Calendar className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold leading-snug line-clamp-1">
                      {ev.title}
                    </p>
                    {ev.description && (
                      <p className="text-[11px] text-[#8B90A0] line-clamp-1 mt-0.5">{ev.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-mono text-[#F5A623] bg-[#F5A623]/10 px-1.5 py-0.5 rounded border border-[#F5A623]/20">
                        📅 {ev.startDate} {ev.startTime ? `@ ${ev.startTime}` : ""}
                      </span>
                      <span className="text-[10px] text-[#8B90A0] uppercase font-semibold">
                        Lịch trình
                      </span>
                    </div>
                  </div>
                </div>
                <kbd className="text-[10px] font-mono text-[#8B90A0] bg-white/5 px-1.5 py-0.5 rounded">
                  ↵ Mở Lịch
                </kbd>
              </div>
            );
          })}

          {filteredNotes.map((n, idx) => {
            const itemIdx = idx + filteredCalendarEvents.length;
            const isSelected = selectedIndex === itemIdx;
            const completedTodos = n.checkItems?.filter((t) => t.done).length || 0;
            const totalTodos = n.checkItems?.length || 0;

            return (
              <div
                key={n.id}
                onClick={() => handleSelectNote(n)}
                onMouseEnter={() => setSelectedIndex(itemIdx)}
                style={{ animationDelay: `${Math.min(itemIdx, 15) * 25}ms` }}
                className={cn(
                  "flex items-start justify-between gap-3 p-3 rounded-xl cursor-pointer border transition-all duration-140 ease-[var(--ease-snap)] animate-in fade-in slide-in-from-bottom-1 fill-mode-both",
                  isSelected
                    ? "bg-[#262A35] border-[#F5A623]/50 shadow-md text-white translate-x-1"
                    : "bg-white/[0.02] border-transparent hover:bg-white/[0.05] text-[#F4F5F7]",
                )}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div
                    className={cn(
                      "size-3 rounded-full mt-1 shrink-0 shadow-xs border border-white/20",
                      `bg-note-${n.tint}`,
                    )}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium leading-snug line-clamp-2">
                      {n.body.trim() || "(Ghi chú không lời)"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
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
                      {n.locked && (
                        <span className="flex items-center gap-1 text-[10px] text-[#8B90A0] bg-white/5 px-1.5 py-0.5 rounded">
                          <Lock className="size-2.5" />
                          <span>Khóa</span>
                        </span>
                      )}
                      <span className="text-[10px] text-[#8B90A0]/60">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 text-[#8B90A0]">
                  <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                    <CornerDownLeft className="size-2.5 mr-0.5" /> Nhảy tới
                  </kbd>
                </div>
              </div>
            );
          })}

          {/* Trash Results Section */}
          {filteredTrash.length > 0 && (
            <div className="pt-2 mt-2 border-t border-white/10">
              <span className="text-[10px] font-bold text-[#EF4444] uppercase tracking-wider px-2 block mb-1">
                Trong thùng rác (Nhấn để khôi phục)
              </span>
              {filteredTrash.map((n, idx) => {
                const globalIdx = filteredNotes.length + idx;
                const isSelected = selectedIndex === globalIdx;

                const isPurging = purgingNoteId === n.id;

                return (
                  <div
                    key={`trash-${n.id}`}
                    onClick={() => handleSelectNote(n, true)}
                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                    style={{ animationDelay: `${Math.min(idx, 10) * 25}ms` }}
                    className={cn(
                      "flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer border transition-all duration-140 ease-[var(--ease-snap)] animate-in fade-in slide-in-from-bottom-1 fill-mode-both",
                      isSelected
                        ? "bg-red-500/20 border-red-500/50 text-white translate-x-1"
                        : "bg-white/[0.01] border-transparent hover:bg-red-500/10 text-[#8B90A0]",
                      isPurging && "item-purge-shatter pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-xs line-through opacity-70 truncate">{n.body}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPop(520);
                          restoreNote(n.id);
                        }}
                        className="text-[10px] font-bold text-[#3FAE6C] hover:text-[#3FAE6C]/80 bg-[#3FAE6C]/10 hover:bg-[#3FAE6C]/20 px-2 py-0.5 rounded border border-[#3FAE6C]/20 transition-colors"
                      >
                        Khôi phục
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playPop(300);
                          setPurgingNoteId(n.id);
                          setTimeout(() => {
                            permanentDeleteNote(n.id);
                            setPurgingNoteId(null);
                          }, 260);
                        }}
                        title="Xóa vĩnh viễn"
                        className="p-1 rounded hover:bg-red-500/25 text-[#8B90A0] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-[#8B90A0]">
          <div className="flex items-center gap-3">
            <span>
              <strong className="text-white font-mono">↑↓</strong> Di chuyển
            </span>
            <span>
              <strong className="text-white font-mono">Enter</strong> Mở / Nhảy tới
            </span>
            <span>
              <strong className="text-white font-mono">Ctrl+Z</strong> Hoàn tác xóa
            </span>
          </div>
          <span>{filteredNotes.length} kết quả</span>
        </div>
      </div>
    </div>
  );
}
