/**
 * components/ui/Captcha.tsx — Mock CAPTCHA Component
 * ─────────────────────────────────────────────────────────────────────────────
 * Simulates a CAPTCHA verification for the frontend.
 *
 * // Replace with Cloudflare Turnstile in production
 * // https://developers.cloudflare.com/turnstile/
 */

"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Shield, RefreshCw } from "lucide-react";

interface CaptchaProps {
  onVerified: (verified: boolean) => void;
  error?: boolean;
}

function generateChallenge(): { question: string; answer: number } {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b} = ?`, answer: a + b };
}

export function Captcha({ onVerified, error }: CaptchaProps) {
  const [checked, setChecked] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challenge, setChallenge] = useState(generateChallenge);
  const [input, setInput] = useState("");
  const [verified, setVerified] = useState(false);
  const [challengeError, setChallengeError] = useState(false);

  const handleCheck = () => {
    if (verified) return;
    setShowChallenge(true);
    setChallenge(generateChallenge());
    setInput("");
    setChallengeError(false);
  };

  const handleVerify = useCallback(() => {
    if (parseInt(input) === challenge.answer) {
      setVerified(true);
      setChecked(true);
      setShowChallenge(false);
      setChallengeError(false);
      onVerified(true);
    } else {
      setChallengeError(true);
      setChallenge(generateChallenge());
      setInput("");
    }
  }, [input, challenge.answer, onVerified]);

  const handleRefresh = () => {
    setChallenge(generateChallenge());
    setInput("");
    setChallengeError(false);
  };

  return (
    <div className="space-y-2">
      {/* Checkbox row */}
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer select-none ${
          verified
            ? "border-emerald-300 bg-emerald-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-slate-200 bg-slate-50 hover:border-slate-300"
        }`}
        onClick={handleCheck}
      >
        <div
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
            verified
              ? "border-emerald-500 bg-emerald-500"
              : "border-slate-300 bg-white"
          }`}
        >
          {verified && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <span className={`text-sm font-medium ${verified ? "text-emerald-700" : "text-slate-700"}`}>
          I am not a robot
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] text-slate-400 font-medium">CAPTCHA</span>
        </div>
      </div>

      {error && !verified && (
        <p className="text-xs text-red-500">Please complete the CAPTCHA verification</p>
      )}

      {/* Challenge popup */}
      <AnimatePresence>
        {showChallenge && !verified && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Solve to verify
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {challenge.question}
                </span>
                <input
                  type="number"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setChallengeError(false); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
                  placeholder="?"
                  className="w-16 px-3 py-2 text-sm text-center border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="New challenge"
              >
                <RefreshCw className="w-4 h-4 text-slate-400" />
              </button>
              <button
                type="button"
                onClick={handleVerify}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Verify
              </button>
            </div>
            {challengeError && (
              <p className="text-xs text-red-500 mt-1.5">Incorrect answer. Try again.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Captcha;
