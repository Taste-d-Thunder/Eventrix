/**
 * app/admin/dashboard/reports/page.tsx — Admin Reports
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  Flower2, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Manage Flower Vendors", href: "/admin/dashboard/vendors", icon: <Store className="w-4 h-4" />, badge: 4 },
  { label: "Delivery Partners", href: "/admin/dashboard/delivery", icon: <Flower2 className="w-4 h-4" /> },
  { label: "Users", href: "/admin/dashboard/users", icon: <Users className="w-4 h-4" /> },
  { label: "Flower Orders", href: "/admin/dashboard/bookings", icon: <Calendar className="w-4 h-4" /> },
  { label: "Reports", href: "/admin/dashboard/reports", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/admin/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 7 },
  { label: "Platform Settings", href: "/admin/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

const MONTHLY_DATA = [
  { month: "Oct", orders: 85, revenue: 180000 },
  { month: "Nov", orders: 102, revenue: 245000 },
  { month: "Dec", orders: 156, revenue: 380000 },
  { month: "Jan", orders: 120, revenue: 290000 },
  { month: "Feb", orders: 140, revenue: 340000 },
  { month: "Mar", orders: 168, revenue: 420000 },
];

export default function AdminReportsPage() {
  const maxRevenue = Math.max(...MONTHLY_DATA.map(m => m.revenue));

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Reports" requiredRole="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: "₹18.5L", change: "+18%", up: true, icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { label: "Total Orders", value: "771", change: "+22%", up: true, icon: <Calendar className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { label: "Avg Order Value", value: "₹2,400", change: "+5%", up: true, icon: <BarChart3 className="w-5 h-5 text-purple-600" />, color: "bg-purple-100" },
            { label: "Cancellation Rate", value: "3.2%", change: "-1.5%", up: false, icon: <ArrowDownRight className="w-5 h-5 text-red-500" />, color: "bg-red-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <p className="text-sm text-slate-500">{s.label}</p>
                <span className={`flex items-center text-[10px] font-bold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                  {s.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-slate-900">Monthly Revenue</h3>
            {/* TODO: Backend Integration: Add date range picker to filter Supabase revenue data */}
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {/* TODO: Backend Integration: Replace MONTHLY_DATA with aggregated revenue metrics from Supabase */}
            {MONTHLY_DATA.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500 font-medium">₹{(m.revenue / 1000).toFixed(0)}K</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-red-500 to-amber-400 rounded-t-lg"
                />
                <span className="text-xs text-slate-500 font-medium mt-1">{m.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Vendors */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Top Performing Vendors</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { name: "Petal & Plume Flowers", orders: 45, revenue: "₹1.8L" },
              { name: "Rose Garden Mumbai", orders: 38, revenue: "₹1.5L" },
              { name: "Bloom Garden Florist", orders: 32, revenue: "₹1.2L" },
              { name: "Sunny Blooms", orders: 28, revenue: "₹95K" },
            ].map((v, i) => (
              <div key={v.name} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{v.name}</p>
                  <p className="text-xs text-slate-400">{v.orders} orders</p>
                </div>
                <span className="font-bold text-slate-900 text-sm">{v.revenue}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
