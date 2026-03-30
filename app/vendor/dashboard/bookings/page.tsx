/**
 * app/vendor/dashboard/bookings/page.tsx
 */
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Package, BarChart3, Calendar, Star, TrendingUp, Bell, Settings, Filter, Search, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Bookings", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function VendorBookingsPage() {
  // TODO: Backend Integration: Fetch vendor bookings from Supabase
  const [orders, setOrders] = useState([
    { id: "ORD-9912", customer: "Priya Sharma", date: "2023-11-25", items: "Red Rose Bouquet (x2)", status: "confirmed", amount: 2400 },
    { id: "ORD-9915", customer: "Amit Kumar", date: "2023-11-26", items: "Mixed Lily Arrangement", status: "pending", amount: 1800 },
    { id: "ORD-9918", customer: "Neha Gupta", date: "2023-11-28", items: "Sunflower Bunch (x3)", status: "pending", amount: 2700 },
  ]);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Bookings" requiredRole="vendor">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Flower Orders</h1>
            <p className="text-slate-500 text-sm mt-1">Manage your upcoming deliveries and fulfillments.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search orders..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shadow-sm transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Fulfillment Date</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }}
                    key={order.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-slate-600 text-xs">{order.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{order.customer}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" /> {order.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{order.items}</td>
                    <td className="px-6 py-4">
                      {/* TODO: Backend Integration: Update order status via Supabase */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        order.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">₹{order.amount.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-xs font-medium">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
