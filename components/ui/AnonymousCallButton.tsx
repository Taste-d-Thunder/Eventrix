/**
 * AnonymousCallButton.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Allows users to initiate calls with vendors without exposing either party's
 * real phone number. Calls are routed through a masking telephony middleware.
 *
 * Future telephony integrations planned:
 *   - Twilio Proxy    → https://www.twilio.com/proxy
 *   - Exotel          → https://exotel.com/products/voice/
 *   - Knowlarity       → https://www.knowlarity.com/click-to-call/
 *
 * Each provider supports "number masking": both parties dial an intermediate
 * virtual number that bridges the call without revealing real numbers.
 */

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneCall, PhoneOff, X, Shield, Clock, Wifi } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CallState = "idle" | "confirming" | "connecting" | "active" | "ended";

export interface AnonymousCallButtonProps {
  /** Vendor display name */
  vendorName: string;
  /** Masked vendor ID (e.g. "VND-4582") */
  vendorMaskedId: string;
  /** Vendor category label for UI context */
  vendorCategory?: string;
  /**
   * Placeholder callback triggered when the user confirms they want to call.
   * Replace with your actual telephony API initiation call.
   *
   * Future integration example (Exotel):
   *   const res = await fetch('/api/call/initiate', {
   *     method: 'POST',
   *     body: JSON.stringify({ vendorId: maskedId, userId: currentUser.maskedId }),
   *   });
   *   const { bridgeNumber, callSid } = await res.json();
   */
  onInitiateCall?: (vendorMaskedId: string) => Promise<{ bridgeNumber?: string } | void>;
  /** Optional: button size variant */
  size?: "sm" | "md" | "lg";
  /** Optional: render as icon-only button */
  iconOnly?: boolean;
}

// ─── Masked number display utility ───────────────────────────────────────────

/**
 * Returns a display-safe masked bridge number.
 * In production this comes from your telephony provider's API response.
 */
function getMaskedBridgeNumber(): string {
  // Simulated masked bridge number — real number from Twilio/Exotel in production
  return "+91 9000 XXXX XX";
}

// ─── Call Status Indicator ────────────────────────────────────────────────────

const CallStatusDot: React.FC<{ state: CallState }> = ({ state }) => {
  const map: Record<CallState, { color: string; label: string; pulse: boolean }> = {
    idle: { color: "bg-slate-300", label: "Ready", pulse: false },
    confirming: { color: "bg-amber-400", label: "Waiting for confirmation", pulse: false },
    connecting: { color: "bg-blue-400", label: "Connecting…", pulse: true },
    active: { color: "bg-emerald-400", label: "Call in progress", pulse: true },
    ended: { color: "bg-slate-300", label: "Call ended", pulse: false },
  };

  const { color, label, pulse } = map[state];

  return (
    <div className="flex items-center gap-2">
      <span className={`relative inline-flex w-2.5 h-2.5 rounded-full ${color}`}>
        {pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-75`} />
        )}
      </span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const AnonymousCallButton: React.FC<AnonymousCallButtonProps> = ({
  vendorName,
  vendorMaskedId,
  vendorCategory = "Vendor",
  onInitiateCall,
  size = "md",
  iconOnly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>("idle");
  const [bridgeNumber] = useState(getMaskedBridgeNumber);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Button size classes ──────────────────────────────────────────────────────
  const sizeClasses = {
    sm: "px-3 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const iconSizes = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" };

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const openModal = () => {
    setCallState("idle");
    setCallDuration(0);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsModalOpen(false);
    setCallState("idle");
    setCallDuration(0);
  }, []);

  const handleStartCall = useCallback(async () => {
    setCallState("connecting");

    try {
      /**
       * TODO: Replace with real telephony API call
       *
       * Twilio Proxy example:
       *   POST /api/call/initiate
       *   { vendorMaskedId, userId }
       *   → returns { bridgeNumber, callSid, proxySessionId }
       *
       * Exotel Click-to-Call example:
       *   POST https://api.exotel.com/v1/Accounts/{SID}/Calls/connect.json
       *   Form-data: From, To, CallerId, TimeLimit
       *
       * Knowlarity Click-to-Call:
       *   POST https://kpi.knowlarity.com/Basic/v1/account/call/makecall
       *   Headers: x-api-key, Authorization
       *   Body: { k_number, agent_number, customer_number }
       */
      await onInitiateCall?.(vendorMaskedId);

      // Simulate connection delay (remove in production)
      await new Promise((r) => setTimeout(r, 1800));
      setCallState("active");

      // Start call duration timer
      timerRef.current = setInterval(() => {
        setCallDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      console.error("Call initiation failed:", err);
      setCallState("idle");
    }
  }, [vendorMaskedId, onInitiateCall]);

  const handleEndCall = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCallState("ended");

    /**
     * TODO: Notify backend to terminate the telephony session
     *   await fetch('/api/call/end', { method: 'POST', body: JSON.stringify({ callSid }) });
     */

    setTimeout(closeModal, 2000);
  }, [closeModal]);

  // ── Duration formatter ────────────────────────────────────────────────────────
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={openModal}
        className={`
          inline-flex items-center justify-center font-medium rounded-xl
          bg-emerald-500 hover:bg-emerald-600 text-white
          shadow-md hover:shadow-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2
          ${sizeClasses[size]}
          ${iconOnly ? "!px-2.5" : ""}
        `}
        aria-label={`Call ${vendorName} anonymously`}
      >
        <Phone className={iconSizes[size]} />
        {!iconOnly && <span>Call Vendor</span>}
      </motion.button>

      {/* Call Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="call-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={callState === "idle" || callState === "ended" ? closeModal : undefined}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              key="call-modal"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.21, 1.11, 0.81, 0.99] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Anonymous call dialog"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

                {/* ── Header bar ── */}
                <div
                  className={`px-6 py-5 flex items-center justify-between transition-colors duration-500
                    ${callState === "active" ? "bg-emerald-500" : callState === "ended" ? "bg-slate-700" : "bg-gradient-to-r from-emerald-500 to-teal-500"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Animated call icon */}
                    <motion.div
                      animate={callState === "active" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                    >
                      {callState === "active" ? (
                        <PhoneCall className="w-5 h-5 text-white" />
                      ) : callState === "ended" ? (
                        <PhoneOff className="w-5 h-5 text-white" />
                      ) : (
                        <Phone className="w-5 h-5 text-white" />
                      )}
                    </motion.div>

                    <div>
                      <h3 className="font-semibold text-white text-sm">{vendorName}</h3>
                      <p className="text-white/70 text-xs">{vendorCategory}</p>
                    </div>
                  </div>

                  {(callState === "idle" || callState === "ended") && (
                    <button
                      onClick={closeModal}
                      className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-6 space-y-5">

                  {/* Security notice */}
                  <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl p-3.5">
                    <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Anonymous Connection</p>
                      <p className="text-xs text-emerald-600 mt-0.5 leading-relaxed">
                        Call will be connected through a secure anonymous number. Your real number will never be shared.
                      </p>
                    </div>
                  </div>

                  {/* Vendor ID */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Vendor ID</p>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                      <span className="font-mono text-slate-800 font-semibold tracking-wider text-sm">
                        {vendorMaskedId}
                      </span>
                      <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Masked</span>
                    </div>
                  </div>

                  {/* Bridge number */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">You Will Call</p>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-800 font-semibold tracking-wider text-sm">
                        {bridgeNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 px-1">
                      This is a secure bridge number. Standard call rates apply.
                    </p>
                  </div>

                  {/* Call status */}
                  {callState !== "idle" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                    >
                      <CallStatusDot state={callState} />
                      {callState === "active" && (
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-sm font-mono font-medium">{formatDuration(callDuration)}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Info row */}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>Powered by secure telephony · Numbers never exposed</span>
                  </div>
                </div>

                {/* ── Action buttons ── */}
                <div className="px-6 pb-6 flex gap-3">
                  {callState === "idle" && (
                    <>
                      <button
                        onClick={closeModal}
                        className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleStartCall}
                        className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        Start Call
                      </motion.button>
                    </>
                  )}

                  {callState === "connecting" && (
                    <div className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full"
                      />
                      Connecting…
                    </div>
                  )}

                  {callState === "active" && (
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleEndCall}
                      className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <PhoneOff className="w-4 h-4" />
                      End Call
                    </motion.button>
                  )}

                  {callState === "ended" && (
                    <div className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-medium text-sm text-center">
                      Call ended · Closing…
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnonymousCallButton;
