/**
 * components/dashboard/DashboardLayout.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Reusable sidebar + topbar layout for all dashboard types.
 * Each dashboard just passes its own nav items and content.
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, LogOut, Bell, ChevronRight,
  Sparkles, User, Settings,
} from "lucide-react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { User as UserType, UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
  requiredRole: UserRole;
}

// ─── Role badge colors ────────────────────────────────────────────────────────

const ROLE_STYLES: Record<UserRole, { badge: string; bg: string; accent: string }> = {
  admin: { badge: "bg-red-100 text-red-700", bg: "from-red-500 to-red-600", accent: "#ef4444" },
  vendor: { badge: "bg-blue-100 text-blue-700", bg: "from-blue-500 to-blue-600", accent: "#3b82f6" },
  customer: { badge: "bg-emerald-100 text-emerald-700", bg: "from-emerald-500 to-emerald-600", accent: "#10b981" },
  delivery_partner: { badge: "bg-purple-100 text-purple-700", bg: "from-purple-500 to-purple-600", accent: "#8b5cf6" },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DashboardLayout({ children, navItems, title, requiredRole }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      router.replace("/login");
      return;
    }
    if (current.role !== requiredRole) {
      const routes: Record<UserRole, string> = {
        admin: "/admin/dashboard",
        vendor: "/vendor/dashboard",
        customer: "/dashboard",
        delivery_partner: "/delivery/dashboard",
      };
      router.replace(routes[current.role]);
      return;
    }
    setUser(current);
    setLoading(false);
  }, [requiredRole, router]);

  const handleLogout = () => {
    logoutUser();
    document.cookie = "es_session=; path=/; max-age=0";
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-3 border-amber-200 border-t-amber-500 rounded-full"
          />
          <p className="text-sm text-slate-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const roleStyle = ROLE_STYLES[user.role];
  const roleLabel = { admin: "Administrator", vendor: "Vendor", customer: "Customer", delivery_partner: "Delivery Partner" }[user.role];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("flex flex-col h-full", mobile ? "bg-white" : "bg-slate-900")}>
      {/* Logo */}
      <div className={cn("px-5 py-5 border-b", mobile ? "border-slate-100" : "border-slate-700/50")}>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className={cn("text-base font-bold", mobile ? "text-slate-900" : "text-white")}>
            Event<span className="text-amber-400">Space</span>
          </span>
        </Link>
      </div>

      {/* User info */}
      <div className={cn("px-4 py-4 border-b", mobile ? "border-slate-100" : "border-slate-700/50")}>
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-amber-400/30" />
          ) : (
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br", roleStyle.bg)}>
              {user.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className={cn("font-semibold text-sm truncate", mobile ? "text-slate-900" : "text-white")}>{user.name}</p>
            <span className={cn("text-xs font-medium px-1.5 py-0.5 rounded-full", roleStyle.badge)}>{roleLabel}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group",
                active
                  ? mobile
                    ? "bg-amber-50 text-amber-700"
                    : "bg-amber-500/15 text-amber-400"
                  : mobile
                  ? "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
              )}
            >
              <span className={cn("shrink-0", active ? "" : "opacity-70 group-hover:opacity-100")}>
                {item.icon}
              </span>
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {active && (
                <motion.div
                  layoutId={`nav-active-${mobile ? "mob" : "desk"}`}
                  className={cn("absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full", mobile ? "bg-amber-500" : "bg-amber-400")}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className={cn("px-3 py-4 border-t space-y-0.5", mobile ? "border-slate-100" : "border-slate-700/50")}>
        <Link
          href="/profile"
          onClick={() => mobile && setSidebarOpen(false)}
          className={cn("flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
            mobile ? "text-slate-600 hover:bg-slate-50 hover:text-amber-600" : "text-slate-400 hover:bg-slate-700/50 hover:text-white"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 xl:w-64 shrink-0 flex-col border-r border-slate-700/20 shadow-xl">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
              className="fixed top-0 left-0 h-full w-72 z-50 lg:hidden shadow-2xl"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-slate-100 flex items-center gap-4 px-4 sm:px-6 shrink-0 shadow-sm">
          <button
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-semibold text-slate-900 text-base truncate">{title}</h1>
            <div className="hidden sm:flex items-center gap-1 text-slate-400 text-xs">
              <ChevronRight className="w-3 h-3" />
              <span className="truncate">
                {navItems.find(n => pathname === n.href || pathname.startsWith(n.href + "/"))?.label ?? "Overview"}
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </button>
            {/* Profile */}
            <Link href="/profile" className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br", roleStyle.bg)}>
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-slate-700 max-w-[100px] truncate">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
