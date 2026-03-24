/**
 * components/auth/ProtectedRoute.tsx — Alias for RouteGuard
 * ─────────────────────────────────────────────────────────────────────────────
 * Wrapper component for role-based route protection.
 *
 * Usage:
 *   <ProtectedRoute role="admin">
 *     <AdminPage />
 *   </ProtectedRoute>
 *
 * If role mismatch: shows "Access Denied" and redirects.
 * If not logged in: redirects to /login.
 */

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, Loader2, LogIn } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { ROLE_REDIRECT } from "@/types/auth";
import type { UserRole } from "@/types/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authorized" | "denied" | "unauthenticated">("checking");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      setStatus("unauthenticated");
      return;
    }

    if (role && user.role !== role) {
      setStatus("denied");
      setTimeout(() => {
        router.replace(ROLE_REDIRECT[user.role]);
      }, 2000);
      return;
    }

    setStatus("authorized");
  }, [role, router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
            <Loader2 className="w-7 h-7 text-white animate-spin" />
          </div>
          <span className="text-sm text-slate-500">Verifying access…</span>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-7 h-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Login Required</h2>
          <p className="text-sm text-slate-500 mb-4">Please sign in to access this page.</p>
          <button onClick={() => router.push(`/login?from=${encodeURIComponent(window.location.pathname)}`)}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm rounded-xl transition-colors">
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 max-w-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-500 mb-4">
            You don&apos;t have permission to view this page. Redirecting to your dashboard…
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-3 h-3 animate-spin" /> Redirecting…
          </div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
