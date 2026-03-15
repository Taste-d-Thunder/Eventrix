/**
 * app/admin/dashboard/page.tsx — Admin Dashboard
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Store, Calendar, TrendingUp, CheckCircle, XCircle, Clock, AlertTriangle, Shield, Settings, Bell, BarChart3, FileText, Search, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Manage Vendors", href: "/admin/dashboard/vendors", icon: <Store className="w-4 h-4" />, badge: 4 },
  { label: "Approve Vendors", href: "/admin/dashboard/approvals", icon: <CheckCircle className="w-4 h-4" />, badge: 4 },
  { label: "Manage Listings", href: "/admin/dashboard/listings", icon: <FileText className="w-4 h-4" /> },
  { label: "Users", href: "/admin/dashboard/users", icon: <Users className="w-4 h-4" /> },
  { label: "Bookings", href: "/admin/dashboard/bookings", icon: <Calendar className="w-4 h-4" /> },
  { label: "Reports", href: "/admin/dashboard/reports", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/admin/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 7 },
  { label: "Platform Settings", href: "/admin/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

const PENDING_VENDORS = [
  { id: "pv1", name: "Ananya Events", category: "Decorator", city: "Delhi", email: "ananya@events.in", submittedAt: "2 hours ago", docs: true },
  { id: "pv2", name: "DJ Beats India", category: "DJ", city: "Mumbai", email: "dj@beats.in", submittedAt: "5 hours ago", docs: true },
  { id: "pv3", name: "Royal Catering Co.", category: "Caterer", city: "Hyderabad", email: "royal@catering.in", submittedAt: "1 day ago", docs: false },
  { id: "pv4", name: "Luxe Photography", category: "Photographer", city: "Bangalore", email: "luxe@photo.in", submittedAt: "2 days ago", docs: true },
];

const RECENT_ACTIVITY = [
  { id: "a1", action: "New vendor registered", subject: "Bloom Garden Events", time: "10 min ago", type: "vendor" },
  { id: "a2", action: "Booking confirmed", subject: "#BK-2041 · ₹1.2L", time: "25 min ago", type: "booking" },
  { id: "a3", action: "Vendor approved", subject: "Petal & Plume Design", time: "1 hr ago", type: "approval" },
  { id: "a4", action: "New user registered", subject: "Kavya Krishnan", time: "2 hrs ago", type: "user" },
  { id: "a5", action: "Dispute raised", subject: "#BK-2039", time: "3 hrs ago", type: "alert" },
];

const ACTIVITY_ICONS = {
  vendor: <Store className="w-3.5 h-3.5 text-blue-500" />,
  booking: <Calendar className="w-3.5 h-3.5 text-emerald-500" />,
  approval: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  user: <Users className="w-3.5 h-3.5 text-amber-500" />,
  alert: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
};

export default function AdminDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [vendorActions, setVendorActions] = useState<Record<string, "approved" | "rejected" | null>>({});

  useEffect(() => { setUser(getCurrentUser()); }, []);

  const handleVendorAction = (id: string, action: "approved" | "rejected") => {
    setVendorActions((prev) => ({ ...prev, [id]: action }));
  };

  if (!user) return null;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Admin Dashboard" requiredRole="admin">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Admin banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-52 h-52 bg-red-500/10 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-xs font-medium uppercase tracking-wider">Admin Access</span>
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-slate-400 text-sm mt-0.5">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl px-4 py-2 text-center">
                <p className="text-amber-400 text-xl font-bold">4</p>
                <p className="text-amber-200 text-xs">Pending Approvals</p>
              </div>
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl px-4 py-2 text-center">
                <p className="text-red-400 text-xl font-bold">1</p>
                <p className="text-red-200 text-xs">Open Disputes</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: "2,048", label: "Total Vendors", sub: "+24 this week", icon: <Store className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { value: "14,821", label: "Registered Users", sub: "+156 this week", icon: <Users className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { value: "3,204", label: "Total Bookings", sub: "₹8.4Cr revenue", icon: <Calendar className="w-5 h-5 text-amber-600" />, color: "bg-amber-100" },
            { value: "4.7★", label: "Platform Rating", sub: "Based on 12K reviews", icon: <TrendingUp className="w-5 h-5 text-red-500" />, color: "bg-red-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm font-medium text-slate-700">{s.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vendor Approvals */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">Pending Vendor Approvals</h3>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {PENDING_VENDORS.filter((v) => !vendorActions[v.id]).length}
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                <Filter className="w-3.5 h-3.5" />Filter
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {PENDING_VENDORS.map((vendor) => {
                const action = vendorActions[vendor.id];
                return (
                  <div key={vendor.id} className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                        {vendor.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-slate-900 text-sm">{vendor.name}</p>
                          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{vendor.category}</span>
                          <span className="text-xs text-slate-500">{vendor.city}</span>
                          {!vendor.docs && (
                            <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                              <AlertTriangle className="w-3 h-3" />Docs missing
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{vendor.email} · {vendor.submittedAt}</p>
                      </div>

                      {action ? (
                        <span className={`shrink-0 flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full ${
                          action === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"
                        }`}>
                          {action === "approved" ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {action.charAt(0).toUpperCase() + action.slice(1)}
                        </span>
                      ) : (
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleVendorAction(vendor.id, "approved")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" />Approve
                          </button>
                          <button onClick={() => handleVendorAction(vendor.id, "rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors">
                            <XCircle className="w-3.5 h-3.5" />Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {RECENT_ACTIVITY.map((a) => (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                    {ACTIVITY_ICONS[a.type as keyof typeof ACTIVITY_ICONS]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{a.action}</p>
                    <p className="text-xs font-medium text-slate-900 truncate">{a.subject}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
