/**
 * components/auth/RouteGuard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side route protection component.
 * Wrap protected layouts with this to enforce role-based access.
 *
 * Usage:
 *   <RouteGuard requiredRole="admin">
 *     <AdminDashboard />
 *   </RouteGuard>
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

interface RouteGuardProps {
  children: React.ReactNode;
  /** If provided, user must have this exact role */
  requiredRole?: UserRole;
  /** Fallback redirect (defaults to /login) */
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requiredRole,
  redirectTo = "/login",
}: RouteGuardProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  useEffect(() => {
    const user = getCurrentUser();

    if (!user) {
      setStatus("unauthorized");
      router.replace(`${redirectTo}?from=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      setStatus("unauthorized");
      // Redirect to the user's proper dashboard instead of login
      const roleMap: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        vendor: "/vendor/dashboard",
        customer: "/dashboard",
      };
      router.replace(roleMap[user.role]);
      return;
    }

    setStatus("authorized");
  }, [requiredRole, redirectTo, router]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Verifying access…</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return null; // Router is redirecting
  }

  return <>{children}</>;
}

export default RouteGuard;
