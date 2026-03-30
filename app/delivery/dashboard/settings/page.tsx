/**
 * app/delivery/dashboard/settings/page.tsx — Delivery Partner Settings
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package, BarChart3, Bell, Settings,
  User, Phone, MapPin, Shield, ToggleLeft, ToggleRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "My Deliveries", href: "/delivery/dashboard", icon: <Package className="w-4 h-4" /> },
  { label: "Earnings", href: "/delivery/dashboard/earnings", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Notifications", href: "/delivery/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
  { label: "Settings", href: "/delivery/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="shrink-0">
      {enabled
        ? <ToggleRight className="w-8 h-8 text-purple-500" />
        : <ToggleLeft className="w-8 h-8 text-slate-300" />}
    </button>
  );
}

export default function DeliverySettingsPage() {
  const [settings, setSettings] = useState({
    availableForDelivery: true,
    pushNotifications: true,
    soundAlerts: true,
    autoAccept: false,
    shareLocation: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Settings" requiredRole="delivery_partner">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" /> Profile Information
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Full Name</label>
                <input type="text" defaultValue="Delivery Partner" disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 mb-1 block">Phone Number</label>
                <input type="text" defaultValue="+91 98765 00000" disabled
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Vehicle Type</label>
              <input type="text" defaultValue="Bike" disabled
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700" />
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-purple-500" /> Preferences
            </h3>
            {/* TODO: Backend Integration: Sync driver preferences directly with Supabase */}
          </div>
          <div className="divide-y divide-slate-50">
            {[
              { key: "availableForDelivery" as const, label: "Available for Deliveries", desc: "Toggle your availability to receive new orders", icon: <Package className="w-4 h-4 text-emerald-500" /> },
              { key: "pushNotifications" as const, label: "Push Notifications", desc: "Receive alerts for new orders and updates", icon: <Bell className="w-4 h-4 text-blue-500" /> },
              { key: "soundAlerts" as const, label: "Sound Alerts", desc: "Play sound for incoming delivery requests", icon: <Phone className="w-4 h-4 text-amber-500" /> },
              { key: "autoAccept" as const, label: "Auto-Accept Orders", desc: "Automatically accept incoming delivery requests", icon: <Shield className="w-4 h-4 text-purple-500" /> },
              { key: "shareLocation" as const, label: "Share Live Location", desc: "Share your real-time location with customers", icon: <MapPin className="w-4 h-4 text-red-500" /> },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center gap-4 px-6 py-4">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  {pref.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{pref.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{pref.desc}</p>
                </div>
                <ToggleSwitch enabled={settings[pref.key]} onToggle={() => toggle(pref.key)} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
