import React, { useState } from "react";
import { Plus, MessageSquare, Trash2, X, Search, Clock, Sparkles } from "lucide-react";
import useChatStore from "../../stores/chatStore";

export default function Sidebar({ isOpen, onToggle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { chats, activeChatId, createChat, setActiveChat, deleteChat } = useChatStore();

  const filteredChats = searchQuery
    ? chats.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Minimal Productivity Sidebar */}
      <aside
        className={`
          fixed lg:relative z-50 h-full w-[260px]
          bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)]
          transition-all duration-200 ease-out shrink-0
          ${isOpen 
            ? "translate-x-0 opacity-100" 
            : "-translate-x-full opacity-0 lg:w-0 lg:overflow-hidden lg:border-0 pointer-events-none"
          }
        `}
      >
        <div className="flex flex-col h-full w-[260px]">
          {/* Top Branding & New Chat Action */}
          <div className="p-3.5 border-b border-[var(--border-subtle)] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#6366f1]/20 border border-[#6366f1]/40 flex items-center justify-center text-[#818cf8]">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-sm text-[var(--text-primary)] tracking-tight">AhadNova AI</span>
              </div>

              <button 
                onClick={onToggle} 
                className="btn-pill-base btn-pill-icon lg:hidden !w-7 !h-7"
                title="Close Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Primary Action Button: Start New Chat */}
            <button
              onClick={() => { createChat(); if (window.innerWidth < 1024) onToggle(); }}
              className="btn-pill-base btn-pill-primary w-full !h-9"
              title="Start New Chat Session"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Chat</span>
            </button>
          </div>

          {/* Search Filter */}
          <div className="px-3 py-2.5 border-b border-[var(--border-subtle)]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-[var(--bg-app)] border border-[var(--border-subtle)] rounded-full text-xs text-[var(--text-primary)] placeholder:text-[#71717a] focus:border-[#6366f1]/50 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Recent Conversations List */}
          <div className="px-3.5 pt-3 pb-1 flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#71717a] uppercase tracking-wider">
            <Clock className="w-3 h-3 text-[#6366f1]" />
            <span>Recent</span>
          </div>

          <div className="flex-1 overflow-y-auto px-2 pb-4">
            {filteredChats.length === 0 ? (
              <div className="text-center py-8 px-2">
                <p className="text-[var(--text-secondary)] font-medium text-xs">No conversations</p>
                <p className="text-[#71717a] text-[11px] mt-0.5">Click "Start New Chat" above</p>
              </div>
            ) : (
              <div className="space-y-0.5 mt-0.5">
                {filteredChats.map((chat) => {
                  const isActive = chat.id === activeChatId;
                  return (
                    <div
                      key={chat.id}
                      className={`
                        group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all text-xs
                        ${isActive
                          ? "bg-[#6366f1]/15 text-[var(--text-primary)] font-medium shadow-xs border border-[#6366f1]/30"
                          : "hover:bg-[var(--bg-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }
                      `}
                      onClick={() => { setActiveChat(chat.id); if (window.innerWidth < 1024) onToggle(); }}
                    >
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#818cf8]" : "text-[#71717a]"}`} />
                      
                      <div className="flex-1 min-w-0">
                        <p className="truncate leading-tight">
                          {chat.title || "New Conversation"}
                        </p>
                      </div>

                      <span className="text-[10px] text-[#71717a] font-mono shrink-0 group-hover:hidden">
                        {formatDate(chat.updatedAt || chat.createdAt)}
                      </span>

                      <button
                        onClick={(e) => { e.stopPropagation(); deleteChat(chat.id); }}
                        title="Delete conversation"
                        className="hidden group-hover:block p-1 rounded-lg hover:bg-[#ef4444]/20 text-[#71717a] hover:text-[#ef4444] transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
