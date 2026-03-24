/**
 * app/admin/dashboard/bookings/page.tsx — Admin Flower Orders
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  Flower2, Package, Clock, CheckCircle, Truck,
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

const MOCK_ORDERS = [
  { id: "FL-2041", customer: "Priya Sharma", vendor: "Petal & Plume Flowers", amount: "₹1,200", status: "confirmed", date: "Mar 22, 2024" },
  { id: "FL-2040", customer: "Rahul Verma", vendor: "Rose Garden Mumbai", amount: "₹3,500", status: "on_the_way", date: "Mar 22, 2024" },
  { id: "FL-2039", customer: "Ananya Gupta", vendor: "Bloom Garden Florist", amount: "₹2,400", status: "delivered", date: "Mar 21, 2024" },
  { id: "FL-2038", customer: "Vikram Patel", vendor: "Sunny Blooms", amount: "₹800", status: "preparing", date: "Mar 21, 2024" },
  { id: "FL-2037", customer: "Meera Joshi", vendor: "Petal & Plume Flowers", amount: "₹5,600", status: "delivered", date: "Mar 20, 2024" },
];

const STATUS_STYLES: Record<string, { bg: string; icon: React.ReactNode }> = {
  confirmed: { bg: "bg-emerald-100 text-emerald-700", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  preparing: { bg: "bg-blue-100 text-blue-700", icon: <Package className="w-3.5 h-3.5" /> },
  on_the_way: { bg: "bg-purple-100 text-purple-700", icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { bg: "bg-slate-100 text-slate-600", icon: <CheckCircle className="w-3.5 h-3.5" /> },
};

export default function AdminBookingsPage() {
  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Flower Orders" requiredRole="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Flower Orders</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Orders", value: "156", icon: <Package className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { label: "Active", value: "12", icon: <Clock className="w-5 h-5 text-amber-600" />, color: "bg-amber-100" },
            { label: "Delivered", value: "138", icon: <CheckCircle className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { label: "Revenue", value: "₹4.2L", icon: <TrendingUp className="w-5 h-5 text-purple-600" />, color: "bg-purple-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Orders Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Orders</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {MOCK_ORDERS.map((order) => {
              const st = STATUS_STYLES[order.status] || STATUS_STYLES.confirmed;
              return (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors flex-wrap">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                    <Flower2 className="w-4 h-4 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">#{order.id}</p>
                    <p className="text-xs text-slate-400">{order.customer} → {order.vendor}</p>
                  </div>
                  <span className="text-xs text-slate-500">{order.date}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${st.bg}`}>
                    {st.icon}{order.status.replace(/_/g, " ")}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">{order.amount}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
