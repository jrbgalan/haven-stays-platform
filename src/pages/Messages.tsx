import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageSquare, Search, Send, ArrowLeft, Calendar, Users } from "lucide-react";
import {
  getConversations,
  getBookings,
  getMessages,
  updateConversation,
  sendChatMessage,
} from "@/services";
import { useAuth } from "@/lib/AuthContext";
import type { Conversation, Message, Booking } from "@/types/entities";
import { useToast } from "@/components/ui/use-toast";
import SmartImage from "@/components/ui/SmartImage";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useSeo } from "@/lib/seo";

const QUICK_REPLIES = [
  "Is early check-in possible?",
  "Is parking available?",
  "Could you arrange an airport pickup?",
  "What's the best way to get there?",
];

function timeOf(d) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function Messages() {
  useSeo(
    "Host Messages & Communications",
    "Private, direct messaging with your luxury hosts, concierges, and guests."
  );
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [query, setQuery] = useState("");
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Start a conversation when arriving from a listing page (?listing=<id>)
  useEffect(() => {
    const listingId = searchParams.get("listing");
    if (!listingId || !user) return;
    (async () => {
      try {
        const d = await sendChatMessage(listingId, undefined, "Hi! I'm interested in this stay.");
        await loadAll();
        if (d?.conversationId) setActiveId(d.conversationId);
      } catch (e: any) {
        toast({ title: "Couldn't start conversation", description: e?.message, variant: "destructive" });
      } finally {
        searchParams.delete("listing");
        setSearchParams(searchParams, { replace: true });
      }
    })();
     
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [list, bs] = await Promise.all([
        getConversations().catch(() => []),
        getBookings().catch(() => []),
      ]);
      list.sort((a, b) => new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime());
      setConversations(list);
      const byListing: Record<string, Booking> = {};
      bs.forEach((b) => { if (!byListing[b.listingId]) byListing[b.listingId] = b; });
      setBookings(byListing);
      if (list.length && !activeId) setActiveId(list[0].id);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { loadAll(); }, []);

  const active = conversations.find((c) => c.id === activeId);

  const loadMessages = async (id: string) => {
    const msgs = await getMessages(id).catch(() => []);
    msgs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    setMessages(msgs);
    const conv = conversations.find((c) => c.id === id);
    if (conv && (conv.unreadByGuest || 0) > 0) {
      updateConversation(id, { unreadByGuest: 0 }).then(() => {
        setConversations((cs) => cs.map((c) => (c.id === id ? { ...c, unreadByGuest: 0 } : c)));
      }).catch(() => {});
    }
  };
  useEffect(() => { if (activeId) loadMessages(activeId); }, [activeId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const send = async (overrideText?: string) => {
    const content = (overrideText ?? text).trim();
    if (!content || sending || !active) return;
    setText("");
    setSending(true);
    setTyping(true);
    const temp: Message = { id: "tmp-" + Date.now(), text: content, senderId: user?.id || "guest", conversationId: active.id, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, temp]);
    try {
      const data = await sendChatMessage(active.listingId, active.id, content);
      setMessages((m) => [...m.filter((x) => x.id !== temp.id), data.userMessage, data.hostMessage].filter(Boolean));
      setConversations((cs) => cs.map((c) => (c.id === active.id ? { ...c, lastMessage: data.hostMessage?.text || c.lastMessage, lastMessageAt: new Date().toISOString(), unreadByGuest: 0 } : c)));
    } catch (e) {
      setMessages((m) => m.filter((x) => x.id !== temp.id));
      setText(content);
      toast({ title: "Couldn't send", description: e.message, variant: "destructive" });
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const filteredConvos = conversations.filter((c) =>
    !query ? true : (c.listingTitle || "").toLowerCase().includes(query.toLowerCase()) || (c.lastMessage || "").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="pt-20 pb-12">
      <div className="container-haven section-padding">
        <div className="section-header">
          <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">Messages</h1>
          <p className="mt-2.5 text-sm text-muted-foreground">Chat with your hosts and manage your conversations.</p>
        </div>

        <div className="mt-6 grid h-[calc(100vh-13rem)] grid-cols-1 gap-0 overflow-hidden rounded-3xl border border-border bg-card sm:h-[calc(100vh-15rem)] lg:grid-cols-[320px_1fr]">
          {/* Conversation list */}
          <div className={cn("flex flex-col border-r border-border", activeId && "hidden lg:flex")}>
            <div className="border-b border-border p-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations"
                  className="w-full rounded-full border border-border bg-background py-2 pl-8 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <div key={i} className="m-2 h-16 animate-pulse rounded-2xl bg-secondary" />)
              ) : filteredConvos.length === 0 ? (
                <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                  <MessageSquare size={28} className="text-muted-foreground" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">No conversations yet. Message a host from any listing page.</p>
                  <Link to="/explore" className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background">Browse stays</Link>
                </div>
              ) : (
                filteredConvos.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveId(c.id)}
                    className={cn("flex w-full items-center gap-3 border-b border-border/60 p-3 text-left transition-colors hover:bg-secondary", activeId === c.id && "bg-secondary")}
                  >
                    <SmartImage src={c.listingImage} alt="" className="h-12 w-12 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{c.listingTitle}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.lastMessage || "Start a conversation"}</p>
                    </div>
                    {(c.unreadByGuest || 0) > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-medium text-accent-foreground">{c.unreadByGuest}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat window */}
          <div className={cn("flex flex-col", !activeId && "hidden lg:flex")}>
            {active ? (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-border p-3">
                  <button onClick={() => setActiveId(null)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary lg:hidden" aria-label="Back">
                    <ArrowLeft size={17} />
                  </button>
                  <SmartImage src={active.listingImage} alt="" className="h-10 w-10 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{active.hostName}</p>
                    <p className="truncate text-xs text-muted-foreground">{active.listingTitle}</p>
                  </div>
                </div>

                {/* Booking context card */}
                {bookings[active.listingId] && (
                  <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-4 py-3">
                    <Calendar size={15} className="shrink-0 text-champagne" />
                    <div className="min-w-0 flex-1 text-xs">
                      <span className="font-medium">{formatDate(bookings[active.listingId].checkIn)} → {formatDate(bookings[active.listingId].checkOut)}</span>
                      <span className="text-muted-foreground"> · <Users size={11} className="inline" /> {bookings[active.listingId].guests} guests · {bookings[active.listingId].status}</span>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
                  {messages.map((m) => {
                    const mine = m.senderId === user.id;
                    return (
                      <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm", mine ? "rounded-br-sm bg-foreground text-background" : "rounded-bl-sm bg-secondary text-foreground/90")}>
                          <p className="leading-relaxed">{m.text}</p>
                          <p className={cn("mt-1 text-[10px]", mine ? "text-background/60" : "text-muted-foreground")}>{timeOf(m.createdAt || (m as any).created_date)}</p>
                        </div>
                      </div>
                    );
                  })}
                  {typing && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-secondary px-4 py-3">
                        {[0, 1, 2].map((d) => (
                          <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick replies */}
                <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-border px-3 py-2">
                  {QUICK_REPLIES.map((q) => (
                    <button key={q} onClick={() => send(q)} disabled={sending} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-secondary disabled:opacity-50">
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex items-end gap-2 border-t border-border p-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                    rows={1}
                    placeholder="Write a message…"
                    className="max-h-28 flex-1 resize-none rounded-2xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button onClick={() => send()} disabled={sending || !text.trim()} className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full transition-transform", sending || !text.trim() ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:scale-105 active:scale-95")} aria-label="Send">
                    <Send size={16} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <MessageSquare size={32} className="text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Select a conversation to start chatting.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}