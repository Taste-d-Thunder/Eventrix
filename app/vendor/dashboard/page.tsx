/**
 * app/vendor/dashboard/page.tsx — Vendor Dashboard
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, Star, TrendingUp, PlusCircle, Edit3, Eye, MoreVertical, CheckCircle, Clock, XCircle, Settings, Bell, BarChart3, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Bookings", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

const BOOKINGS = [
  { id: "bk1", customer: "Priya Sharma", event: "Wedding Reception", date: "Apr 20, 2024", status: "confirmed", amount: "₹1,50,000", guests: 450 },
  { id: "bk2", customer: "Rahul Verma", event: "Birthday Party", date: "Apr 25, 2024", status: "pending", amount: "₹35,000", guests: 80 },
  { id: "bk3", customer: "Anjali Gupta", event: "Corporate Event", date: "May 5, 2024", status: "confirmed", amount: "₹2,20,000", guests: 300 },
];

const SERVICES = [
  { id: "s1", name: "Silver Package", price: "₹1.5L/day", bookings: 12, active: true },
  { id: "s2", name: "Gold Package", price: "₹2.8L/day", bookings: 28, active: true },
  { id: "s3", name: "Platinum Package", price: "₹5L/day", bookings: 8, active: false },
];

const STATUS_ICON = {
  confirmed: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  cancelled: <XCircle className="w-3.5 h-3.5 text-red-500" />,
};

const STATUS_STYLE = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
};

export default function VendorDashboard() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => { setUser(getCurrentUser()); }, []);

  if (!user) return null;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Vendor Dashboard" requiredRole="vendor">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Welcome + status */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative z-10 flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-200 text-sm">Welcome back 👋</p>
              <h2 className="text-2xl font-bold mt-0.5">{user.businessName || user.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                {user.isVerified ? (
                  <span className="flex items-center gap-1.5 bg-emerald-500/20 text-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" /> Verified Vendor
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-200 text-xs font-medium px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" /> Pending Verification
                  </span>
                )}
                {user.serviceCategory && (
                  <span className="bg-white/15 text-blue-100 text-xs px-2.5 py-1 rounded-full">
                    {user.serviceCategory}
                  </span>
                )}
              </div>
            </div>
            <Link href="/vendor/dashboard/services/new"
              className="flex items-center gap-2 bg-white text-blue-600 font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
              <PlusCircle className="w-4 h-4" />
              Add Service
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "₹3.85L", label: "This Month", sub: "+12% vs last", icon: <TrendingUp className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { value: "3", label: "Active Bookings", sub: "2 confirmed", icon: <Calendar className="w-5 h-5 text-amber-600" />, color: "bg-amber-100" },
            { value: "4.8★", label: "Avg. Rating", sub: "48 reviews", icon: <Star className="w-5 h-5 text-yellow-500" />, color: "bg-yellow-100" },
            { value: "3", label: "Live Services", sub: "1 paused", icon: <Package className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-600 font-medium">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Bookings */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Upcoming Bookings</h3>
              <Link href="/vendor/dashboard/bookings" className="text-xs text-amber-600 hover:text-amber-700 font-medium">View all →</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {BOOKINGS.map((b) => (
                <div key={b.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm">{b.customer}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.event} · {b.guests} guests</p>
                      <p className="text-xs text-slate-400 mt-0.5">{b.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLE[b.status as keyof typeof STATUS_STYLE]}`}>
                        {STATUS_ICON[b.status as keyof typeof STATUS_ICON]}
                        {b.status}
                      </span>
                      <p className="text-sm font-bold text-slate-900 mt-1">{b.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">My Services</h3>
              <Link href="/vendor/dashboard/services/new" className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
                <PlusCircle className="w-3.5 h-3.5" />Add
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {SERVICES.map((s) => (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${s.active ? "bg-emerald-400" : "bg-slate-300"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.price} · {s.bookings} bookings</p>
                  </div>
                  <button className="p-1 rounded-lg hover:bg-slate-200 transition-colors">
                    <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
