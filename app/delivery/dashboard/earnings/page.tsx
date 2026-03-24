/**
 * app/delivery/dashboard/earnings/page.tsx — Delivery Earnings
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Package, BarChart3, Bell, Settings, Star,
  TrendingUp, IndianRupee, Calendar, Wallet,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "My Deliveries", href: "/delivery/dashboard", icon: <Package className="w-4 h-4" /> },
  { label: "Earnings", href: "/delivery/dashboard/earnings", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Notifications", href: "/delivery/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
  { label: "Settings", href: "/delivery/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

const MOCK_DAILY = [
  { day: "Mon", amount: 450 },
  { day: "Tue", amount: 620 },
  { day: "Wed", amount: 380 },
  { day: "Thu", amount: 710 },
  { day: "Fri", amount: 540 },
  { day: "Sat", amount: 890 },
  { day: "Sun", amount: 320 },
];

const RECENT_PAYOUTS = [
  { id: "p1", desc: "Weekly Payout — Mar 18-24", amount: 3910, date: "Mar 25, 2024", status: "paid" },
  { id: "p2", desc: "Weekly Payout — Mar 11-17", amount: 4250, date: "Mar 18, 2024", status: "paid" },
  { id: "p3", desc: "Weekly Payout — Mar 4-10", amount: 3680, date: "Mar 11, 2024", status: "paid" },
];

export default function DeliveryEarningsPage() {
  const maxAmount = Math.max(...MOCK_DAILY.map(d => d.amount));
  const weekTotal = MOCK_DAILY.reduce((s, d) => s + d.amount, 0);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Earnings" requiredRole="delivery_partner">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Earnings</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Today", value: "₹710", icon: <IndianRupee className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { label: "This Week", value: `₹${weekTotal.toLocaleString("en-IN")}`, icon: <Calendar className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { label: "This Month", value: "₹16,840", icon: <TrendingUp className="w-5 h-5 text-purple-600" />, color: "bg-purple-100" },
            { label: "Total Balance", value: "₹4,250", icon: <Wallet className="w-5 h-5 text-amber-600" />, color: "bg-amber-100" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">This Week</h3>
          <div className="flex items-end justify-between gap-2 h-40">
            {MOCK_DAILY.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-slate-500 font-medium">₹{d.amount}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.amount / maxAmount) * 100}%` }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-full max-w-[36px] bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg"
                />
                <span className="text-xs text-slate-500 font-medium mt-1">{d.day}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Payout History */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Payout History</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_PAYOUTS.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{p.desc}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">₹{p.amount.toLocaleString("en-IN")}</p>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Paid</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
