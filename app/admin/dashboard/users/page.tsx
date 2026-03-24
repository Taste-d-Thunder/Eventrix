/**
 * app/admin/dashboard/users/page.tsx — Admin Users
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  Flower2, Search, Shield,
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

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  vendor: "bg-blue-100 text-blue-700",
  customer: "bg-emerald-100 text-emerald-700",
  delivery_partner: "bg-purple-100 text-purple-700",
};

export default function AdminUsersPage() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => { setAllUsers(getAllUsers()); }, []);

  const filtered = allUsers.filter(u => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Users" requiredRole="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">All Users</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Users", value: String(allUsers.length), icon: <Users className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { label: "Customers", value: String(allUsers.filter(u => u.role === "customer").length), icon: <Users className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
            { label: "Vendors", value: String(allUsers.filter(u => u.role === "vendor").length), icon: <Store className="w-5 h-5 text-amber-600" />, color: "bg-amber-100" },
            { label: "Admins", value: String(allUsers.filter(u => u.role === "admin").length), icon: <Shield className="w-5 h-5 text-red-500" />, color: "bg-red-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {["all", "customer", "vendor", "delivery_partner", "admin"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${roleFilter === r ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>
                {r === "delivery_partner" ? "delivery" : r}
              </button>
            ))}
          </div>
        </div>

        {/* User List */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No users found</p>
              </div>
            ) : (
              filtered.map((user) => (
                <div key={user.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email} {user.city ? `· ${user.city}` : ""}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${ROLE_BADGE[user.role] || "bg-slate-100 text-slate-600"}`}>
                    {user.role === "delivery_partner" ? "delivery" : user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
