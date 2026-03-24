/**
 * components/ui/ErrorBanner.tsx — Reusable Error/Warning Banner
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows dismissible error banners for:
 *   - unauthorized access
 *   - rate limit exceeded
 *   - login failed
 *   - generic errors
 */

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ShieldAlert, Clock, X, AlertTriangle } from "lucide-react";

type BannerType = "error" | "warning" | "rateLimit" | "unauthorized";

interface ErrorBannerProps {
  message: string;
  type?: BannerType;
  visible: boolean;
  onDismiss?: () => void;
}

const STYLES: Record<BannerType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
    icon: <AlertCircle className="w-4 h-4 text-red-500" />,
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  },
  rateLimit: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    icon: <Clock className="w-4 h-4 text-orange-500" />,
  },
  unauthorized: {
    bg: "bg-red-50",
    border: "border-red-300",
    text: "text-red-800",
    icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
  },
};

export function ErrorBanner({ message, type = "error", visible, onDismiss }: ErrorBannerProps) {
  const s = STYLES[type];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginBottom: 0 }}
          animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
          exit={{ opacity: 0, height: 0, marginBottom: 0 }}
          className={`flex items-center gap-2.5 p-3 rounded-xl border ${s.bg} ${s.border} overflow-hidden`}
        >
          <div className="shrink-0">{s.icon}</div>
          <p className={`text-sm font-medium flex-1 ${s.text}`}>{message}</p>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-white/50 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorBanner;
