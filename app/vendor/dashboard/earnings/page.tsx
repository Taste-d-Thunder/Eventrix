/**
 * app/vendor/dashboard/earnings/page.tsx
 */
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Package, BarChart3, Calendar, Star, TrendingUp, Bell, Settings, Download, ArrowUpRight } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Bookings", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function VendorEarningsPage() {
  // TODO: Backend Integration: Fetch vendor earnings summary and payout history from Supabase
  const [earnings] = useState({
    total: 85400,
    pending: 12500,
    available: 72900,
  });

  const [transactions] = useState([
    { id: "TX1209", date: "2023-11-20", amount: 12000, status: "completed", orderId: "ORD-9912" },
    { id: "TX1210", date: "2023-11-21", amount: 4500, status: "pending", orderId: "ORD-9915" },
    { id: "TX1211", date: "2023-11-22", amount: 8000, status: "pending", orderId: "ORD-9918" },
  ]);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Earnings" requiredRole="vendor">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Earnings & Payouts</h1>
            <p className="text-slate-500 text-sm mt-1">Track your revenue and manage withdrawals.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
            <Download className="w-4 h-4" /> Download Report
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-1">Total Earnings (YTD)</p>
            <p className="text-3xl font-bold text-slate-900">₹{earnings.total.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-sm font-medium text-amber-600 mb-1">Pending Clearance</p>
              <p className="text-3xl font-bold text-amber-700">₹{earnings.pending.toLocaleString("en-IN")}</p>
            </div>
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-50 rounded-tl-full -mr-4 -mb-4 z-0" />
          </div>
          <div className="bg-emerald-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-100 mb-1">Available for Payout</p>
              <p className="text-3xl font-bold text-white">₹{earnings.available.toLocaleString("en-IN")}</p>
            </div>
            <div className="mt-4 flex justify-end">
              {/* TODO: Backend Integration: Initiate withdrawal request to payment gateway/Supabase */}
              <button className="px-4 py-2 bg-white text-emerald-700 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-sm">
                Request Payout
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Transaction ID</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Order Ref</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-600 text-xs">{tx.id}</td>
                    <td className="px-6 py-4 text-slate-600">{tx.date}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                        {tx.orderId} <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        tx.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
