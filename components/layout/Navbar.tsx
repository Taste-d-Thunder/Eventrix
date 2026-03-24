/**
 * components/layout/Navbar.tsx — Fixed & Production-Ready
 * ─────────────────────────────────────────────────────────────────────────────
 * Fixes applied:
 *   1. Proper 3-zone flex layout: Logo | Center Nav | Right Actions
 *   2. All buttons use Next.js <Link> for routing
 *   3. No overlap on any screen size — gap-based spacing
 *   4. Mobile hamburger with animated drawer
 *   5. Auth-aware: shows user avatar + logout when logged in
 *   6. Smooth glass effect on scroll
 */

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { getCurrentUser, logoutUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";
import { cn } from "@/lib/utils";

// ─── Navigation structure ─────────────────────────────────────────────────────
// Ordering links are tagged so they can be hidden for admin/vendor/delivery roles

const CENTER_NAV = [
  { label: "Flowers", href: "/flowers", orderingOnly: true },
] as const;

const DROPDOWN_NAV = [
  { label: "Order Flowers", href: "/flowers", orderingOnly: true },
  { label: "Become a Flower Seller", href: "/vendor/register", orderingOnly: false },
] as const;

const MOBILE_ALL_NAV = [
  { label: "Flowers", href: "/flowers", orderingOnly: true },
  { label: "Become a Flower Seller", href: "/vendor/register", orderingOnly: false },
];

// Roles that should NOT see ordering links
const NON_ORDERING_ROLES = ["admin", "vendor", "delivery_partner"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150",
        "hover:text-amber-600 hover:bg-amber-50",
        active ? "text-amber-600 bg-amber-50" : "text-slate-600"
      )}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-indicator"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500"
        />
      )}
    </Link>
  );
}

function UserMenu({ user, onLogout }: { user: UserType; onLogout: () => void }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const dashboardRoute = {
    admin: "/admin/dashboard",
    vendor: "/vendor/dashboard",
    customer: "/dashboard",
    delivery_partner: "/delivery/dashboard",
  }[user.role];

  const roleLabel = {
    admin: "Administrator",
    vendor: "Vendor",
    customer: "Customer",
    delivery_partner: "Delivery Partner",
  }[user.role];

  const roleColor = {
    admin: "bg-red-100 text-red-700",
    vendor: "bg-blue-100 text-blue-700",
    customer: "bg-emerald-100 text-emerald-700",
    delivery_partner: "bg-purple-100 text-purple-700",
  }[user.role];

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-amber-300 hover:shadow-sm transition-all duration-200"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-2 ring-amber-200"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">
            {user.name.charAt(0)}
          </div>
        )}
        <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate hidden lg:block">
          {user.name.split(" ")[0]}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-20 overflow-hidden"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                <span
                  className={cn(
                    "inline-block mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full",
                    roleColor
                  )}
                >
                  {roleLabel}
                </span>
              </div>

              {/* Menu items */}
              <div className="py-1.5">
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push(dashboardRoute);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    router.push("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              {/* Logout */}
              <div className="border-t border-slate-100 py-1.5">
                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Read auth state
    setUser(getCurrentUser());

    // Scroll listener for glass effect
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]); // Re-check on navigation

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    router.push("/");
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm"
            : "bg-white/70 backdrop-blur-md"
        )}
      >
        {/*
         * ── Layout: 3-zone flex row ──────────────────────────────────────────
         * [Logo] ──── flex-1 ──── [Center Nav] ──── flex-1 ──── [Right Zone]
         * This ensures center nav is ALWAYS centered, right zone never overlaps.
         */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 lg:h-18 gap-4">

            {/* ── ZONE 1: Logo (fixed width) ── */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-amber-600 transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Event<span className="text-amber-500">Space</span>
              </span>
            </Link>

            {/* ── ZONE 2: Center Navigation (hidden on mobile) ── */}
            <nav className="hidden lg:flex items-center gap-1 mx-auto" aria-label="Main navigation">
              {CENTER_NAV
                .filter(link => !link.orderingOnly || !user || !NON_ORDERING_ROLES.includes(user.role))
                .map((link) => (
                  <NavLink
                    key={link.label}
                    href={link.href}
                    active={pathname === link.href}
                  >
                    {link.label}
                  </NavLink>
              ))}
            </nav>

            {/*
             * ── ZONE 3: Right Actions ────────────────────────────────────────
             * Uses ml-auto on mobile to push to right.
             * gap-2 between all items prevents overlap.
             * Each item is clearly grouped: nav links | CTA buttons.
             */}
            <div className="flex items-center gap-2 ml-auto">

              {/* Extra nav links (desktop only, md-lg screens) */}
              <div className="hidden md:flex lg:hidden items-center gap-1">
                {CENTER_NAV
                  .filter(link => !link.orderingOnly || !user || !NON_ORDERING_ROLES.includes(user.role))
                  .slice(0, 2).map((link) => (
                  <NavLink key={link.label} href={link.href} active={pathname === link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Explore / Packages / Become a Vendor — desktop */}
              <div className="hidden lg:flex items-center gap-1">
                {DROPDOWN_NAV
                  .filter(link => !link.orderingOnly || !user || !NON_ORDERING_ROLES.includes(user.role))
                  .map((link) => (
                  <NavLink key={link.label} href={link.href} active={pathname === link.href}>
                    {link.label}
                  </NavLink>
                ))}
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px h-5 bg-slate-200 mx-1" />

              {/* Auth zone — conditional on login state */}
              {user ? (
                /* Logged in: show user menu */
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                /* Logged out: Login + List Your Service */
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-all duration-150"
                    >
                      Login
                    </motion.button>
                  </Link>
                  <Link href="/vendor/register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm hover:shadow-md transition-all duration-150 whitespace-nowrap"
                    >
                      Become a Flower Seller
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 340 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold text-slate-900">Event<span className="text-amber-500">Space</span></span>
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* User info (if logged in) */}
              {user && (
                <div className="px-5 py-4 bg-amber-50 border-b border-amber-100">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
                {MOBILE_ALL_NAV
                  .filter(link => !link.orderingOnly || !user || !NON_ORDERING_ROLES.includes(user.role))
                  .map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all",
                        pathname === link.href
                          ? "bg-amber-50 text-amber-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-amber-600"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <Link
                    href={user.role === "admin" ? "/admin/dashboard" : user.role === "vendor" ? "/vendor/dashboard" : user.role === "delivery_partner" ? "/delivery/dashboard" : "/dashboard"}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </Link>
                )}
              </nav>

              {/* Bottom CTA */}
              <div className="px-4 py-5 border-t border-slate-100 space-y-2.5">
                {user ? (
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 font-medium text-sm transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:border-amber-300 font-medium text-sm transition-all">
                        Login
                      </button>
                    </Link>
                    <Link href="/vendor/register" onClick={() => setMobileOpen(false)}>
                      <button className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md transition-all">
                        Become a Flower Seller
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-18" />
    </>
  );
}

export default Navbar;
