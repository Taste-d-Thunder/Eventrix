/**
 * AnonymousChatModal.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides a masked chat channel between users and vendors.
 * Real phone numbers / emails are never exposed in this interface.
 *
 * Architecture note:
 *   - Messages will later be stored in a database (e.g. Firestore / Postgres)
 *   - user_id and vendor_id are used to route messages through a relay server
 *   - Each conversation is keyed by a composite ID: `${user_id}::${vendor_id}`
 *   - A WebSocket / Server-Sent Events channel will replace the mock state here
 */

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Shield, Lock, ChevronDown, Phone } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  senderId: "user" | "vendor";
  text: string;
  timestamp: Date;
  status: "sent" | "delivered" | "read";
}

export interface AnonymousChatModalProps {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Called when the user closes the modal */
  onClose: () => void;
  /** Vendor display name shown in the header */
  vendorName: string;
  /** Masked vendor ID shown to the user (e.g. "VND-4582") */
  vendorMaskedId: string;
  /** Category of the vendor for context */
  vendorCategory?: string;
  /**
   * Placeholder callback — replace with your actual send API.
   * Receives the message text; returns a Promise that resolves when the
   * message has been acknowledged by the relay server.
   *
   * Future integration:
   *   await fetch('/api/chat/send', { method:'POST', body: JSON.stringify({ vendorId, text }) })
   */
  onSendMessage?: (text: string) => Promise<void>;
}

// ─── Seed messages (replace with real data fetch) ─────────────────────────────

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "m0",
    senderId: "vendor",
    text: "Hello! Thanks for reaching out. How can I help you with your event?",
    timestamp: new Date(Date.now() - 5 * 60_000),
    status: "read",
  },
];

// ─── Helper: generate masked conversation ID ──────────────────────────────────

function generateSessionId(): string {
  return `SESS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface BubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<BubbleProps> = ({ message }) => {
  const isUser = message.senderId === "user";
  const timeStr = message.timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.21, 1.11, 0.81, 0.99] }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {/* Vendor avatar dot */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-700 mr-2 mt-auto mb-1 shrink-0">
          V
        </div>
      )}

      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`
            px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
            ${isUser
              ? "bg-amber-500 text-white rounded-br-md"
              : "bg-white border border-slate-100 text-slate-800 rounded-bl-md"
            }
          `}
        >
          {message.text}
        </div>

        {/* Timestamp + status */}
        <div className={`flex items-center gap-1.5 px-1 ${isUser ? "flex-row-reverse" : ""}`}>
          <span className="text-[10px] text-slate-400">{timeStr}</span>
          {isUser && (
            <span className="text-[10px] text-slate-400">
              {message.status === "read" ? "✓✓" : message.status === "delivered" ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>

      {/* User avatar dot */}
      {isUser && (
        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white ml-2 mt-auto mb-1 shrink-0">
          U
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AnonymousChatModal: React.FC<AnonymousChatModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  vendorMaskedId,
  vendorCategory = "Vendor",
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isSending) return;

    // Optimistic UI update
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user",
      text,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setIsSending(true);

    try {
      /**
       * TODO: Replace with real API call
       * Messages will later be stored in database
       * user_id and vendor_id used to route messages through relay server
       *
       * Example future integration:
       *   await fetch('/api/chat/send', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json' },
       *     body: JSON.stringify({
       *       sessionId,
       *       vendorMaskedId,
       *       text,
       *       timestamp: newMsg.timestamp.toISOString(),
       *     }),
       *   });
       */
      await onSendMessage?.(text);

      // Simulate vendor response for demo purposes
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `auto-${Date.now()}`,
          senderId: "vendor",
          text: "Thanks for your message! I'll get back to you shortly with all the details.",
          timestamp: new Date(),
          status: "delivered",
        };
        setMessages((prev) => [...prev, autoReply]);
      }, 1400);

      // Update sent → delivered status
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: "delivered" } : m))
      );
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  }, [inputText, isSending, sessionId, vendorMaskedId, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="chat-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal panel */}
          <motion.div
            key="chat-modal"
            initial={{ opacity: 0, scale: 0.93, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.35, ease: [0.21, 1.11, 0.81, 0.99] }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Chat with ${vendorName}`}
          >
            <div className="bg-white w-full sm:w-[440px] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] sm:max-h-[600px]">

              {/* ── Header ── */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-center gap-3">
                {/* Vendor avatar */}
                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-base shrink-0">
                  {vendorName.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm truncate">{vendorName}</h3>
                    {/* Online indicator */}
                    <span className="w-2 h-2 rounded-full bg-emerald-300 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/70 text-xs font-mono">{vendorMaskedId}</span>
                    <span className="text-white/50 text-xs">·</span>
                    <span className="text-white/70 text-xs">{vendorCategory}</span>
                  </div>
                </div>

                {/* Privacy badge */}
                <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1 shrink-0">
                  <Shield className="w-3 h-3 text-white/80" />
                  <span className="text-white/80 text-[10px] font-medium">Anonymous</span>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors shrink-0"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* ── Security notice ── */}
              <div className="flex items-center gap-2 bg-emerald-50 border-b border-emerald-100 px-4 py-2.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700">
                  Your identity is protected. Session ID:{" "}
                  <span className="font-mono font-semibold">{sessionId}</span>
                </p>
              </div>

              {/* ── Message list ── */}
              <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 min-h-0">
                {/* Date separator */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Today</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}

                {/* Typing indicator */}
                {isSending && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700 shrink-0">
                      V
                    </div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-slate-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* ── Input bar ── */}
              <div className="bg-white border-t border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    maxLength={500}
                    disabled={isSending}
                    className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none min-w-0"
                  />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSend}
                    disabled={!inputText.trim() || isSending}
                    className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </motion.button>
                </div>

                <p className="text-center text-[10px] text-slate-400 mt-2">
                  Messages are relayed anonymously · No personal info is shared
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AnonymousChatModal;
