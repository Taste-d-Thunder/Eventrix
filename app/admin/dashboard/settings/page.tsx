/**
 * app/admin/dashboard/settings/page.tsx — Admin Platform Settings
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  Flower2, Shield, Globe, CreditCard, ToggleLeft, ToggleRight,
  Mail, Percent,
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

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="shrink-0">
      {enabled ? <ToggleRight className="w-8 h-8 text-red-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
    </button>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    autoApproveVendors: false,
    emailNotifications: true,
    maintenanceMode: false,
    allowRegistrations: true,
    liveTracking: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Platform Settings" requiredRole="admin">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>

        {/* General Settings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-red-500" /> General
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Platform Name</label>
                <input type="text" defaultValue="EventSpace" disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Support Email</label>
                <input type="email" defaultValue="support@eventspace.com" disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Commission Rate</label>
                <div className="relative">
                  <Percent className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="number" defaultValue="10" disabled
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Default City</label>
                <input type="text" defaultValue="Bhubaneswar" disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Toggles */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4 text-red-500" /> Preferences
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { key: "autoApproveVendors" as const, label: "Auto-Approve Vendors", desc: "Automatically approve new vendor registrations", icon: <Store className="w-4 h-4 text-blue-500" /> },
              { key: "emailNotifications" as const, label: "Email Notifications", desc: "Send email alerts for important platform events", icon: <Mail className="w-4 h-4 text-amber-500" /> },
              { key: "allowRegistrations" as const, label: "Allow New Registrations", desc: "Allow new users and vendors to register", icon: <Users className="w-4 h-4 text-emerald-500" /> },
              { key: "liveTracking" as const, label: "Live Delivery Tracking", desc: "Enable real-time location tracking for deliveries", icon: <Globe className="w-4 h-4 text-purple-500" /> },
              { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Put the platform in maintenance mode", icon: <Shield className="w-4 h-4 text-red-500" /> },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">{pref.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{pref.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                </div>
                <Toggle enabled={settings[pref.key]} onToggle={() => toggle(pref.key)} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
