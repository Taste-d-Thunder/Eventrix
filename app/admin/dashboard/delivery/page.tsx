/**
 * app/admin/dashboard/delivery/page.tsx — Admin Delivery Partners
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  Flower2, Truck, MapPin, Star, Phone,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getAllUsers } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";

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

const MOCK_PARTNERS = [
  { id: "dp1", name: "Kiran Reddy", phone: "+91 98765 11111", city: "Mumbai", rating: 4.8, deliveries: 340, status: "active" },
  { id: "dp2", name: "Ravi Kumar", phone: "+91 98765 22222", city: "Mumbai", rating: 4.6, deliveries: 210, status: "active" },
  { id: "dp3", name: "Suresh Patil", phone: "+91 98765 33333", city: "Bhubaneswar", rating: 4.9, deliveries: 520, status: "active" },
  { id: "dp4", name: "Amit Sharma", phone: "+91 98765 44444", city: "Mumbai", rating: 4.3, deliveries: 85, status: "inactive" },
];

export default function AdminDeliveryPage() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  useEffect(() => { setAllUsers(getAllUsers()); }, []);

  const deliveryPartners = allUsers.filter(u => u.role === "delivery_partner");
  const displayPartners = deliveryPartners.length > 0 ? deliveryPartners : null;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Delivery Partners" requiredRole="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Delivery Partners</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Partners", value: String(displayPartners?.length ?? MOCK_PARTNERS.length), icon: <Truck className="w-5 h-5 text-purple-600" />, color: "bg-purple-100" },
            { label: "Active Now", value: String(MOCK_PARTNERS.filter(p => p.status === "active").length), icon: <MapPin className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { label: "Avg Rating", value: "4.65★", icon: <Star className="w-5 h-5 text-amber-500" />, color: "bg-amber-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Partner List */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">All Partners</h3>
          </div>
          <div className="divide-y divide-slate-50">
            {MOCK_PARTNERS.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-700 font-bold shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.city} · {p.deliveries} deliveries</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center gap-1 text-xs font-medium">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{p.rating}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${p.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {p.status}
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
