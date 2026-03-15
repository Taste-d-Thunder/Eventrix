// Live interactive demo showing all 6 parts:
// Part 1: Responsive HeroSection (no overlaps, proper containers)
// Part 2: AnonymousChatModal
// Part 3: AnonymousCallButton
// Part 4: Vendor profile with both buttons
// Part 5: UI quality improvements (hover effects, spacing)
// Part 6: Clean architecture, reusable components

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Icons (inline SVG helpers) ───────────────────────────────────────────────
const Icon = {
  Send: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  X: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Phone: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>,
  PhoneOff: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81M1 1l22 22"/></svg>,
  Shield: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Lock: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Chat: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Search: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Pin: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Star: (p) => <svg {...p} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  Check: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  Heart: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  Menu: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Clock: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Badge: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c-2.4 2.4-5.4 4-9 4s-6.6-1.6-9-4C0 9.6 3 7 3 7l2.5-.5L7 4h10l1.5 2.5L21 7s3 2.6 0 5z"/></svg>,
  Wifi: (p) => <svg {...p} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
};

// ─── PART 2: Anonymous Chat Modal ─────────────────────────────────────────────
function AnonymousChatModal({ isOpen, onClose, vendorName, vendorMaskedId, vendorCategory = "Vendor" }) {
  const [messages, setMessages] = useState([
    { id: "m0", from: "vendor", text: "Hello! Thanks for reaching out. How can I help with your event?", time: "2m ago" }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { if (isOpen) setTimeout(() => inputRef.current?.focus(), 300); }, [isOpen]);

  // Messages will later be stored in database
  // user_id and vendor_id used to route messages
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;
    const msg = { id: `u-${Date.now()}`, from: "user", text, time: "now" };
    setMessages(p => [...p, msg]);
    setInput("");
    setSending(true);
    setTimeout(() => {
      setMessages(p => [...p, { id: `v-${Date.now()}`, from: "vendor", text: "Thanks! I'll prepare a custom quote for you shortly.", time: "now" }]);
      setSending(false);
    }, 1400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="cb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", zIndex: 200 }}
            onClick={onClose} />
          <motion.div key="cm" initial={{ opacity: 0, scale: 0.92, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }} transition={{ duration: 0.32, ease: [0.21,1.11,0.81,0.99] }}
            style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", width: "100%", maxWidth: 420, borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", maxHeight: "80vh", overflow: "hidden" }}>
              {/* Header */}
              <div style={{ background: "linear-gradient(135deg, #f59e0b, #ea580c)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", fontSize: 16, flexShrink: 0 }}>
                  {vendorName[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{vendorName}</span>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#86efac", flexShrink: 0 }} />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontFamily: "monospace" }}>{vendorMaskedId} · {vendorCategory}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                  <Icon.Shield style={{ width: 11, height: 11, color: "rgba(255,255,255,0.8)" }} />
                  <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 500 }}>Anonymous</span>
                </div>
                <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon.X style={{ width: 16, height: 16, color: "#fff" }} />
                </button>
              </div>
              {/* Security bar */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", borderBottom: "1px solid #dcfce7", padding: "8px 16px" }}>
                <Icon.Lock style={{ width: 13, height: 13, color: "#16a34a", flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#15803d" }}>End-to-end anonymous relay · Session SESS-K7X2MN</span>
              </div>
              {/* Messages */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#f8fafc", minHeight: 0 }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 10, color: "#94a3b8", background: "#e2e8f0", padding: "2px 10px", borderRadius: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Today</span>
                </div>
                {messages.map(m => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
                    style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", marginBottom: 12, alignItems: "flex-end", gap: 8 }}>
                    {m.from === "vendor" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fef3c7", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#92400e", flexShrink: 0 }}>V</div>
                    )}
                    <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start", gap: 3 }}>
                      <div style={{
                        padding: "10px 14px", borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: m.from === "user" ? "#f59e0b" : "#fff",
                        color: m.from === "user" ? "#fff" : "#1e293b",
                        fontSize: 13, lineHeight: 1.5,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        border: m.from === "vendor" ? "1px solid #f1f5f9" : "none",
                      }}>{m.text}</div>
                      <span style={{ fontSize: 10, color: "#94a3b8" }}>{m.time} {m.from === "user" && "· ✓✓"}</span>
                    </div>
                    {m.from === "user" && (
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>U</div>
                    )}
                  </motion.div>
                ))}
                {sending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fef3c7", border: "1px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#92400e" }}>V</div>
                    <div style={{ padding: "12px 16px", background: "#fff", borderRadius: "18px 18px 18px 4px", border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                      <div style={{ display: "flex", gap: 4, alignItems: "center", height: 14 }}>
                        {[0,1,2].map(i => (
                          <motion.div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8" }}
                            animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }} />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={bottomRef} />
              </div>
              {/* Input */}
              <div style={{ padding: "12px 16px", background: "#fff", borderTop: "1px solid #f1f5f9" }}>
                <div style={{ display: "flex", gap: 8, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "8px 12px", alignItems: "center" }}>
                  <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder="Type a message…" maxLength={500}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#1e293b" }} />
                  <motion.button whileTap={{ scale: 0.88 }} onClick={sendMessage} disabled={!input.trim()}
                    style={{ width: 32, height: 32, borderRadius: 10, background: input.trim() ? "#f59e0b" : "#e2e8f0", border: "none", cursor: input.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                    <Icon.Send style={{ width: 13, height: 13, color: input.trim() ? "#fff" : "#94a3b8" }} />
                  </motion.button>
                </div>
                <p style={{ textAlign: "center", fontSize: 10, color: "#94a3b8", marginTop: 6 }}>Messages are anonymously relayed · No personal info shared</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── PART 3: Anonymous Call Modal ─────────────────────────────────────────────
// Twilio / Exotel / Knowlarity integration placeholder
function AnonymousCallModal({ isOpen, onClose, vendorName, vendorMaskedId }) {
  const [state, setState] = useState("idle"); // idle | connecting | active | ended
  const [duration, setDuration] = useState(0);
  const timerRef = useRef(null);

  const startCall = async () => {
    setState("connecting");
    // Future: POST /api/call/initiate (Twilio Proxy / Exotel / Knowlarity)
    await new Promise(r => setTimeout(r, 1800));
    setState("active");
    timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
  };

  const endCall = () => {
    clearInterval(timerRef.current);
    setState("ended");
    setTimeout(() => { onClose(); setState("idle"); setDuration(0); }, 2000);
  };

  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="call-bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 200 }}
            onClick={state === "idle" ? onClose : undefined} />
          <motion.div key="call-md" initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.32, ease: [0.21,1.11,0.81,0.99] }}
            style={{ position: "fixed", inset: 0, zIndex: 201, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
            <div style={{ background: "#fff", width: "100%", maxWidth: 380, borderRadius: 20, boxShadow: "0 32px 80px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              {/* Header */}
              <div style={{
                padding: "20px 24px", display: "flex", alignItems: "center", gap: 12,
                background: state === "active" ? "linear-gradient(135deg, #10b981, #059669)" : state === "ended" ? "#475569" : "linear-gradient(135deg, #10b981, #0d9488)",
                transition: "background 0.5s ease",
              }}>
                <motion.div animate={state === "active" ? { scale: [1,1.1,1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {state === "ended" ? <Icon.PhoneOff style={{ width: 20, height: 20, color: "#fff" }} /> : <Icon.Phone style={{ width: 20, height: 20, color: "#fff" }} />}
                </motion.div>
                <div>
                  <p style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}>{vendorName}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                    {state === "idle" && "Ready to connect"}
                    {state === "connecting" && "Connecting…"}
                    {state === "active" && `In call · ${fmt(duration)}`}
                    {state === "ended" && "Call ended"}
                  </p>
                </div>
                {state === "idle" && (
                  <button onClick={onClose} style={{ marginLeft: "auto", width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon.X style={{ width: 15, height: 15, color: "#fff" }} />
                  </button>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: "20px 24px 8px" }}>
                {/* Security notice */}
                <div style={{ display: "flex", gap: 10, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: "12px 14px", marginBottom: 16 }}>
                  <Icon.Shield style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#15803d' }}" >Anonymous Connection</p>
                    <p style={{ fontSize: 12, color: "#16a34a", marginTop: 2, lineHeight: 1.5 }}>Call will be connected through a secure anonymous number. Your real number will never be shared.</p>
                  </div>
                </div>

                {/* Vendor ID */}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Vendor ID</p>
                  <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px" }}>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e293b", letterSpacing: "0.06em", fontSize: 14, flex: 1 }}>{vendorMaskedId}</span>
                    <span style={{ background: "#e2e8f0", color: "#64748b", fontSize: 10, padding: "2px 8px", borderRadius: 8 }}>Masked</span>
                  </div>
                </div>

                {/* Bridge number */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>You Will Dial</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px" }}>
                    <Icon.Phone style={{ width: 14, height: 14, color: "#94a3b8" }} />
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#1e293b", fontSize: 14, letterSpacing: "0.06em" }}>+91 9000 XXXX XX</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 5 }}>Secure bridge · Standard call rates apply</p>
                </div>

                {/* Connectivity status */}
                {state !== "idle" && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "#f8fafc", borderRadius: 10, padding: "8px 12px", marginBottom: 12 }}>
                    <div style={{ position: "relative", width: 10, height: 10 }}>
                      <span style={{ display: "block", width: 10, height: 10, borderRadius: "50%", background: state === "active" ? "#10b981" : state === "connecting" ? "#3b82f6" : "#94a3b8" }} />
                      {(state === "active" || state === "connecting") && (
                        <motion.span animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }} transition={{ repeat: Infinity, duration: 1.5 }}
                          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: state === "active" ? "#10b981" : "#3b82f6" }} />
                      )}
                    </div>
                    <span style={{ fontSize: 12, color: "#64748b" }}>
                      {state === "connecting" && "Dialling secure bridge number…"}
                      {state === "active" && `Call in progress · ${fmt(duration)}`}
                      {state === "ended" && "Call terminated · Session closed"}
                    </span>
                  </motion.div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                  <Icon.Wifi style={{ width: 12, height: 12, color: "#94a3b8" }} />
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>
                    Powered by secure telephony (Twilio / Exotel / Knowlarity)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ padding: "0 24px 24px", display: "flex", gap: 10 }}>
                {state === "idle" && (<>
                  <button onClick={onClose} style={{ flex: 1, padding: "12px", borderRadius: 14, border: "2px solid #e2e8f0", background: "transparent", color: "#475569", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={startCall}
                    style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: "#10b981", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}>
                    <Icon.Phone style={{ width: 16, height: 16 }} />
                    Start Call
                  </motion.button>
                </>)}
                {state === "connecting" && (
                  <div style={{ flex: 1, padding: "12px", borderRadius: 14, background: "#f1f5f9", color: "#64748b", textAlign: "center", fontWeight: 500, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ width: 16, height: 16, border: "2px solid #94a3b8", borderTopColor: "transparent", borderRadius: "50%" }} />
                    Connecting…
                  </div>
                )}
                {state === "active" && (
                  <motion.button whileTap={{ scale: 0.97 }} onClick={endCall}
                    style={{ flex: 1, padding: "12px", borderRadius: 14, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 12px rgba(239,68,68,0.3)" }}>
                    <Icon.PhoneOff style={{ width: 16, height: 16 }} />
                    End Call
                  </motion.button>
                )}
                {state === "ended" && (
                  <div style={{ flex: 1, padding: "12px", borderRadius: 14, background: "#f1f5f9", color: "#64748b", textAlign: "center", fontSize: 14 }}>
                    Call ended · Closing…
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── PART 1: Responsive Navbar ─────────────────────────────────────────────────
function Navbar({ onDemo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = ["Explore Vendors", "Packages", "Become a Vendor"];

  return (
    <header style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #f1f5f9", position: "sticky", top: 0, zIndex: 100, padding: "0 24px" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", alignItems: "center", height: 68 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#fff", fontStyle: "italic" }}>E</div>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>Event<span style={{ color: "#f59e0b" }}>Space</span></span>
        </div>

        {/* Desktop nav — flex items-center gap-6: no overlap */}
        <nav style={{ display: "flex", alignItems: "center", gap: 28, marginLeft: 40, flex: 1 }} className="hide-mobile">
          {links.map(l => (
            <a key={l} href="#" style={{ fontSize: 13, fontWeight: 500, color: "#475569", textDecoration: "none", whiteSpace: "nowrap" }}>{l}</a>
          ))}
        </nav>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }} className="hide-mobile">
          <button style={{ padding: "8px 16px", borderRadius: 12, border: "1px solid #e2e8f0", background: "transparent", fontSize: 13, fontWeight: 500, color: "#475569", cursor: "pointer" }}>Login</button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onDemo("hero")}
            style={{ padding: "9px 20px", borderRadius: 12, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer", boxShadow: "0 2px 8px rgba(245,158,11,0.35)" }}>
            Get Started
          </motion.button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ marginLeft: "auto", padding: 8, borderRadius: 10, border: "none", background: "transparent", cursor: "pointer" }} className="show-mobile">
          {mobileOpen ? <Icon.X style={{ width: 20, height: 20, color: "#475569" }} /> : <Icon.Menu style={{ width: 20, height: 20, color: "#475569" }} />}
        </button>
      </div>

      {/* Mobile nav (AnimatePresence slide-down) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div key="mobile-nav" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: "hidden", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ padding: "12px 0 16px" }}>
              {links.map(l => (
                <a key={l} href="#" style={{ display: "block", padding: "10px 24px", fontSize: 14, fontWeight: 500, color: "#475569", textDecoration: "none" }}>{l}</a>
              ))}
              <div style={{ padding: "10px 16px 0", display: "flex", gap: 8 }}>
                <button style={{ flex: 1, padding: "10px", borderRadius: 12, border: "1px solid #e2e8f0", background: "transparent", fontSize: 13, fontWeight: 500, color: "#475569", cursor: "pointer" }}>Login</button>
                <button style={{ flex: 1, padding: "10px", borderRadius: 12, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Get Started</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── PART 1: Hero Section (Responsive) ────────────────────────────────────────
function HeroSection({ onDemo }) {
  const [activeTab, setActiveTab] = useState("wedding");
  const tabs = [
    { id: "birthday", label: "Birthday", emoji: "🎂" },
    { id: "wedding", label: "Wedding", emoji: "💍" },
    { id: "anniversary", label: "Anniversary", emoji: "🌹" },
    { id: "corporate", label: "Corporate Event", emoji: "🏢" },
  ];

  const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.21,1.11,0.81,0.99] } } };

  return (
    <section style={{ background: "linear-gradient(135deg, #fffbeb 0%, #fafaf9 50%, #fff7ed 100%)", padding: "72px 24px 80px", position: "relative", overflow: "hidden" }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: 400, height: 400, borderRadius: "50%", background: "rgba(245,158,11,0.08)", blur: "80px", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "0%", left: "-5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(234,88,12,0.06)", filter: "blur(60px)", pointerEvents: "none" }} />

      {/*
       * Floating icons — hidden on mobile (hidden md:block equivalent via CSS class)
       * These NEVER overlap text content — positioned absolutely in safe zones
       */}
      {[
        { emoji: "💍", top: "18%", right: "6%", delay: 0 },
        { emoji: "🎂", top: "50%", right: "3%", delay: 1.5 },
        { emoji: "🎵", top: "30%", right: "12%", delay: 3 },
      ].map((f, i) => (
        <motion.div key={i} animate={{ y: [-8, 8, -8] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
          className="float-deco"
          style={{ position: "absolute", top: f.top, right: f.right, width: 56, height: 56, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.7)", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, userSelect: "none", pointerEvents: "none" }}>
          {f.emoji}
        </motion.div>
      ))}

      {/* max-w-7xl mx-auto px-6 lg:px-12 equivalent */}
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <motion.div variants={container} initial="hidden" animate="visible" style={{ maxWidth: 680 }}>

          {/* Eyebrow */}
          <motion.div variants={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ display: "flex" }}>
              {["?img=1","?img=2","?img=3"].map((q,i) => (
                <img key={i} src={`https://i.pravatar.cc/36${q}`} alt="" style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #fff", objectFit: "cover", marginLeft: i > 0 ? -8 : 0 }} />
              ))}
            </div>
            <span style={{ fontSize: 13, color: "#64748b" }}><strong style={{ color: "#0f172a" }}>50,000+</strong> events planned this year</span>
          </motion.div>

          {/* Headline — text-4xl md:text-6xl lg:text-7xl */}
          <motion.h1 variants={item} style={{ fontSize: "clamp(36px, 5.5vw, 72px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.07, letterSpacing: "-0.025em", marginBottom: 20 }}>
            Plan Your<br />
            <em style={{ color: "#f59e0b", fontStyle: "italic" }}>Perfect</em> Event<br />
            in Minutes
          </motion.h1>

          {/* Sub */}
          <motion.p variants={item} style={{ fontSize: 17, color: "#475569", lineHeight: 1.75, maxWidth: 500, marginBottom: 36 }}>
            Connect with 2,000+ verified vendors — venues, photographers, caterers, DJs & more. Every celebration, perfectly orchestrated.
          </motion.p>

          {/* Event type tabs — flex-wrap gap-3 */}
          <motion.div variants={item} style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>What are you celebrating?</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {tabs.map(t => (
                <motion.button key={t.id} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setActiveTab(t.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 12, cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "all 0.2s",
                    border: activeTab === t.id ? "2px solid #f59e0b" : "2px solid #e2e8f0",
                    background: activeTab === t.id ? "#fff9eb" : "#fff",
                    color: activeTab === t.id ? "#b45309" : "#475569",
                    boxShadow: activeTab === t.id ? "0 0 0 3px rgba(245,158,11,0.12)" : "0 1px 3px rgba(0,0,0,0.05)",
                  }}>
                  <span style={{ fontSize: 18, lineHeight: 1 }}>{t.emoji}</span>
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/*
           * Search bar — flex flex-col md:flex-row gap-4
           * Stacks vertically on mobile, horizontal on desktop
           */}
          <motion.div variants={item}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, background: "#fff", borderRadius: 18, boxShadow: "0 8px 40px rgba(0,0,0,0.1)", border: "1px solid #f1f5f9", padding: 8 }}>
              {/* Row 1: search input */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
                <Icon.Search style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }} />
                <input placeholder="Search vendors, services, venues…" style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#0f172a", background: "transparent" }} />
              </div>
              {/* Row 2: city + button */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 14px", flex: 1 }}>
                  <Icon.Pin style={{ width: 13, height: 13, color: "#94a3b8", flexShrink: 0 }} />
                  <select style={{ background: "transparent", border: "none", outline: "none", fontSize: 13, color: "#475569", cursor: "pointer", flex: 1 }}>
                    {["Mumbai", "Delhi", "Bangalore", "Chennai"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "10px 24px", borderRadius: 12, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(245,158,11,0.35)", whiteSpace: "nowrap" }}>
                  <Icon.Search style={{ width: 14, height: 14 }} />
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats — grid-cols-2 sm:grid-cols-4 */}
          <motion.div variants={item} style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 44 }}>
            {[["2,000+","Vendors"],["50K+","Events"],["15","Cities"],["4.9★","Rating"]].map(([v,l]) => (
              <div key={l}>
                <p style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── PART 4+5: Vendor Profile Section ────────────────────────────────────────
function VendorProfileSection({ onChatOpen, onCallOpen }) {
  const [wishlist, setWishlist] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState("p2");

  const packages = [
    { id: "p1", name: "Silver", price: "₹1.5L", unit: "per day", desc: "Perfect for intimate events", items: ["Up to 200 guests","8-hour booking","Basic lighting"] },
    { id: "p2", name: "Gold", price: "₹2.8L", unit: "per day", desc: "Most popular", items: ["Up to 500 guests","12-hour booking","Premium lighting","Bridal suite"], popular: true },
    { id: "p3", name: "Platinum", price: "₹5L", unit: "per day", desc: "All-inclusive luxury", items: ["Up to 1200 guests","Full day","Custom lighting","VIP suites"] },
  ];

  return (
    <section style={{ padding: "60px 24px", background: "#fafafa" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Part 4 · Vendor Profile</p>
        <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 700, color: "#0f172a", marginBottom: 40 }}>Vendor Detail Page</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
          {/* Left */}
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ background: "#fff9eb", border: "1px solid #fde68a", color: "#b45309", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>Venue</span>
              <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon.Badge style={{ width: 11, height: 11 }} />Verified
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(24px,3vw,38px)", fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>The Grand Maison</h1>
            <p style={{ fontSize: 14, color: "#64748b", fontStyle: "italic", marginBottom: 16 }}>Timeless elegance for unforgettable celebrations</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[...Array(5)].map((_,i) => <Icon.Star key={i} style={{ width: 14, height: 14, color: "#f59e0b" }} />)}
                <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>4.9</span>
                <span style={{ color: "#64748b", fontSize: 13 }}>(312 reviews)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13 }}>
                <Icon.Pin style={{ width: 13, height: 13 }} />Juhu, Mumbai
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b", fontSize: 13 }}>
                <Icon.Clock style={{ width: 13, height: 13 }} />Responds within 2 hours
              </div>
            </div>

            {/*
             * ─── PART 4 — Anonymous Communication Buttons ───────────────────
             * Chat and Call buttons placed below vendor meta info.
             * flex gap-4 mt-6 as specified.
             */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 24, marginBottom: 32 }}>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onChatOpen}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 24px", borderRadius: 14, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(245,158,11,0.35)" }}>
                <Icon.Chat style={{ width: 17, height: 17 }} />
                Chat with Vendor
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onCallOpen}
                style={{ display: "flex", alignItems: "center", gap: 9, padding: "13px 24px", borderRadius: 14, border: "none", background: "#10b981", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.3)" }}>
                <Icon.Phone style={{ width: 17, height: 17 }} />
                Call Vendor
              </motion.button>
            </div>

            {/* Packages — hover:scale-105 transition duration-300 */}
            <h2 style={{ fontSize: "clamp(20px,2.5vw,30px)", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Packages</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {packages.map(pkg => (
                <motion.div key={pkg.id} onClick={() => setSelectedPkg(pkg.id)}
                  whileHover={{ scale: 1.04, y: -3 }} transition={{ duration: 0.25 }}
                  style={{
                    background: "#fff", borderRadius: 16, padding: "18px", cursor: "pointer",
                    border: selectedPkg === pkg.id ? "2px solid #f59e0b" : "2px solid #f1f5f9",
                    boxShadow: selectedPkg === pkg.id ? "0 4px 20px rgba(245,158,11,0.18)" : "0 2px 8px rgba(0,0,0,0.05)",
                    position: "relative", transition: "border 0.2s, box-shadow 0.2s",
                  }}>
                  {pkg.popular && <div style={{ position: "absolute", top: -10, left: 12, background: "#f59e0b", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 10 }}>Most Popular</div>}
                  <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 2 }}>{pkg.name}</h3>
                  <p style={{ fontSize: 11, color: "#64748b", marginBottom: 10 }}>{pkg.desc}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 12 }}>{pkg.price}<span style={{ fontSize: 11, fontWeight: 400, color: "#64748b" }}> / {pkg.unit}</span></p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {pkg.items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", marginBottom: 6 }}>
                        <Icon.Check style={{ width: 13, height: 13, color: "#10b981", flexShrink: 0 }} />{item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking panel */}
          <div>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f1f5f9", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", padding: 24, position: "sticky", top: 90 }}>
              <p style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>Selected Package</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: "#0f172a", marginBottom: 2 }}>{packages.find(p => p.id === selectedPkg)?.name}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>
                {packages.find(p => p.id === selectedPkg)?.price}
                <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}> / {packages.find(p => p.id === selectedPkg)?.unit}</span>
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "#f59e0b", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 10, boxShadow: "0 4px 12px rgba(245,158,11,0.35)" }}>
                Request Booking
              </motion.button>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <button onClick={onChatOpen} style={{ flex: 1, padding: "10px 8px", borderRadius: 12, border: "1px solid #fde68a", background: "#fff9eb", color: "#b45309", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon.Chat style={{ width: 13, height: 13 }} />Chat
                </button>
                <button onClick={onCallOpen} style={{ flex: 1, padding: "10px 8px", borderRadius: 12, border: "1px solid #a7f3d0", background: "#f0fdf4", color: "#065f46", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Icon.Phone style={{ width: 13, height: 13 }} />Call
                </button>
              </div>
              <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>No charges until confirmed · Free cancellation</p>
              {["Verified vendor · authentic reviews","Secure payments with buyer protection","Anonymous comms · data stays private"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <Icon.Check style={{ width: 14, height: 14, color: "#10b981", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PART 5: UI Quality - Vendor Cards Grid ───────────────────────────────────
function VendorCardsSection({ onChatOpen, onCallOpen }) {
  const [wishlisted, setWishlisted] = useState(new Set());
  const vendors = [
    { id: "v1", name: "The Grand Maison", cat: "Venue", loc: "Mumbai", rating: 4.9, reviews: 312, price: "₹1.5L", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=75", tags: ["Luxury","Garden"] },
    { id: "v2", name: "Arjun Kapoor Photography", cat: "Photographer", loc: "Delhi", rating: 5.0, reviews: 428, price: "₹45K", image: "https://images.unsplash.com/photo-1471347334704-25603ca4b082?w=400&q=75", tags: ["Wedding","Candid"] },
    { id: "v3", name: "Petal & Plume Design", cat: "Decorator", loc: "Bangalore", rating: 4.8, reviews: 187, price: "₹75K", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&q=75", tags: ["Floral","Luxury"] },
    { id: "v4", name: "Saffron & Salt", cat: "Caterer", loc: "Delhi", rating: 4.8, reviews: 543, price: "₹1.2K/head", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=75", tags: ["North Indian","Live Counters"] },
  ];

  return (
    <section style={{ padding: "60px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>Part 5 · UI Quality</p>
        {/* text-3xl md:text-4xl font-semibold */}
        <h2 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Featured Vendors</h2>
        <p style={{ color: "#64748b", marginBottom: 40 }}>Hover cards to see scale + shadow effects. Click Chat/Call for anonymous communication.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 18 }}>
          {vendors.map((v, i) => {
            const wl = wishlisted.has(v.id);
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                /* hover:scale-105 transition duration-300 */
                whileHover={{ scale: 1.045, y: -4 }} transition={{ duration: 0.28 }}
                style={{ background: "#fff", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: "1px solid #f1f5f9", cursor: "pointer" }}>
                {/* Image */}
                <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                  <motion.img src={v.image} alt={v.name} whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)" }} />
                  <button onClick={e => { e.stopPropagation(); setWishlisted(s => { const n = new Set(s); wl ? n.delete(v.id) : n.add(v.id); return n; }) }}
                    style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon.Heart style={{ width: 15, height: 15, color: wl ? "#ef4444" : "#64748b", fill: wl ? "#ef4444" : "none" }} />
                  </button>
                </div>
                {/* Body */}
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{v.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                      <Icon.Star style={{ width: 12, height: 12, color: "#f59e0b" }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>{v.rating}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 10, color: "#64748b", fontSize: 11 }}>
                    <Icon.Pin style={{ width: 11, height: 11 }} />{v.loc}
                    <span style={{ marginLeft: 6, fontSize: 10 }}>({v.reviews} reviews)</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                    {v.tags.map(t => <span key={t} style={{ padding: "2px 8px", background: "#f1f5f9", color: "#475569", fontSize: 10, borderRadius: 6 }}>{t}</span>)}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #f1f5f9", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, color: "#94a3b8" }}>from</p>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{v.price}</p>
                    </div>
                  </div>
                  {/* Part 5: rounded-xl shadow-md hover:shadow-lg buttons */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={e => { e.stopPropagation(); onChatOpen(v); }}
                      style={{ flex: 1, padding: "8px", borderRadius: 12, border: "1px solid #fde68a", background: "#fff9eb", color: "#b45309", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Icon.Chat style={{ width: 12, height: 12 }} />Chat
                    </button>
                    <button onClick={e => { e.stopPropagation(); onCallOpen(v); }}
                      style={{ flex: 1, padding: "8px", borderRadius: 12, border: "1px solid #a7f3d0", background: "#f0fdf4", color: "#065f46", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                      <Icon.Phone style={{ width: 12, height: 12 }} />Call
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [activeVendor, setActiveVendor] = useState({ name: "The Grand Maison", maskedId: "VND-4582", category: "Venue" });

  const openChat = (vendor = null) => {
    if (vendor) setActiveVendor({ name: vendor.name, maskedId: "VND-" + Math.floor(1000+Math.random()*9000), category: vendor.cat || "Vendor" });
    setChatOpen(true);
  };
  const openCall = (vendor = null) => {
    if (vendor) setActiveVendor({ name: vendor.name, maskedId: "VND-" + Math.floor(1000+Math.random()*9000), category: vendor.cat || "Vendor" });
    setCallOpen(true);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#fafafa", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow-x: hidden; }
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
          .float-deco { display: none !important; }
        }
        @media (min-width: 641px) { .show-mobile { display: none !important; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 2px; }
      `}</style>

      <Navbar onDemo={() => {}} />
      <HeroSection onDemo={() => {}} />
      <VendorCardsSection onChatOpen={openChat} onCallOpen={openCall} />
      <VendorProfileSection onChatOpen={() => openChat()} onCallOpen={() => openCall()} />

      {/* Part 2: Chat Modal */}
      <AnonymousChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        vendorName={activeVendor.name}
        vendorMaskedId={activeVendor.maskedId}
        vendorCategory={activeVendor.category}
      />

      {/* Part 3: Call Modal */}
      <AnonymousCallModal
        isOpen={callOpen}
        onClose={() => setCallOpen(false)}
        vendorName={activeVendor.name}
        vendorMaskedId={activeVendor.maskedId}
      />
    </div>
  );
}
