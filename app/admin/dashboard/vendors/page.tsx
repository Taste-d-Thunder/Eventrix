/**
 * app/admin/dashboard/vendors/page.tsx — Admin Manage Vendors
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  CheckCircle, XCircle, Clock, Filter, Search, Flower2,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getAllUsers, updateUserById } from "@/lib/auth";
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

export default function AdminVendorsPage() {
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [search, setSearch] = useState("");

  useEffect(() => { setAllUsers(getAllUsers()); }, []);

  const vendors = allUsers.filter(u => u.role === "vendor");
  const filtered = vendors.filter(v => {
    const matchesFilter = filter === "all" || (v.status || "pending") === filter;
    const matchesSearch = !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      (v.businessName && v.businessName.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleAction = (id: string, action: "approved" | "rejected") => {
    updateUserById(id, { status: action });
    setAllUsers(getAllUsers());
  };

  const pendingCount = vendors.filter(v => !v.status || v.status === "pending").length;
  const approvedCount = vendors.filter(v => v.status === "approved").length;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Manage Vendors" requiredRole="admin">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Manage Flower Vendors</h1>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium text-amber-700">{pendingCount} pending</span>
            <span className="text-xs bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium text-emerald-700">{approvedCount} approved</span>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search vendors..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-300" />
          </div>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {(["all", "pending", "approved", "rejected"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${filter === f ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Vendor List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No vendors found</p>
            </div>
          ) : (
            filtered.map((vendor, i) => {
              const status = vendor.status || "pending";
              return (
                <motion.div key={vendor.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                      {(vendor.businessName || vendor.name).charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-slate-900 text-sm">{vendor.businessName || vendor.name}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                          status === "approved" ? "bg-emerald-100 text-emerald-700" : status === "rejected" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
                        }`}>{status}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{vendor.email} {vendor.phone ? `· ${vendor.phone}` : ""} {vendor.city ? `· ${vendor.city}` : ""}</p>
                    </div>
                    {status === "pending" && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleAction(vendor.id, "approved")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg transition-colors">
                          <CheckCircle className="w-3.5 h-3.5" />Approve
                        </button>
                        <button onClick={() => handleAction(vendor.id, "rejected")}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-colors">
                          <XCircle className="w-3.5 h-3.5" />Reject
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
