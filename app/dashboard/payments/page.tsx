/**
 * app/dashboard/payments/page.tsx — Customer Payments
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar, ShoppingBag, Heart, Star, User, Bell, CreditCard,
  ArrowDownLeft, ArrowUpRight, CheckCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: <User className="w-4 h-4" /> },
  { label: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "My Bookings", href: "/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 2 },
  { label: "Favourites", href: "/dashboard/favourites", icon: <Heart className="w-4 h-4" /> },
  { label: "Reviews", href: "/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
];

const MOCK_TRANSACTIONS = [
  { id: "txn-001", description: "Flower Order #FL-2041", vendor: "Petal & Plume Flowers", amount: -1200, date: "Mar 22, 2024", status: "completed", type: "payment" },
  { id: "txn-002", description: "Refund — Order #FL-2038", vendor: "Sunny Blooms", amount: 800, date: "Mar 18, 2024", status: "completed", type: "refund" },
  { id: "txn-003", description: "Flower Order #FL-2035", vendor: "Rose Garden Mumbai", amount: -3500, date: "Mar 15, 2024", status: "completed", type: "payment" },
  { id: "txn-004", description: "Wedding Decoration Booking", vendor: "Bloom Garden Florist", amount: -15000, date: "Mar 10, 2024", status: "completed", type: "payment" },
  { id: "txn-005", description: "Flower Order #FL-2030", vendor: "Petal & Plume Flowers", amount: -2400, date: "Mar 5, 2024", status: "completed", type: "payment" },
];

export default function PaymentsPage() {
  const totalSpent = MOCK_TRANSACTIONS.filter(t => t.type === "payment").reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalRefunds = MOCK_TRANSACTIONS.filter(t => t.type === "refund").reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Payments" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Payments</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Spent", value: `₹${totalSpent.toLocaleString("en-IN")}`, icon: <ArrowUpRight className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { label: "Refunds", value: `₹${totalRefunds.toLocaleString("en-IN")}`, icon: <ArrowDownLeft className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { label: "Transactions", value: String(MOCK_TRANSACTIONS.length), icon: <CreditCard className="w-5 h-5 text-purple-600" />, color: "bg-purple-100" },
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

        {/* Transaction List */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Transaction History</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {MOCK_TRANSACTIONS.map((txn) => (
              <div key={txn.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${txn.type === "refund" ? "bg-emerald-100" : "bg-slate-100"}`}>
                  {txn.type === "refund"
                    ? <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    : <ArrowUpRight className="w-4 h-4 text-slate-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{txn.description}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{txn.vendor} · {txn.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`font-bold text-sm ${txn.amount > 0 ? "text-emerald-600" : "text-slate-900"}`}>
                    {txn.amount > 0 ? "+" : ""}₹{Math.abs(txn.amount).toLocaleString("en-IN")}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400 justify-end mt-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />{txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
