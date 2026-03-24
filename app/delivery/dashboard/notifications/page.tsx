/**
 * app/delivery/dashboard/notifications/page.tsx — Delivery Notifications
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Package, BarChart3, Bell, Settings,
  Truck, MapPin, CheckCircle, AlertTriangle, X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "My Deliveries", href: "/delivery/dashboard", icon: <Package className="w-4 h-4" /> },
  { label: "Earnings", href: "/delivery/dashboard/earnings", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Notifications", href: "/delivery/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
  { label: "Settings", href: "/delivery/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "delivery" | "alert" | "system";
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "dn1", title: "New Delivery Assigned", message: "Order #FL-3005 from Petal & Plume Flowers — Pickup at Juhu.", type: "order", time: "5 min ago", read: false },
  { id: "dn2", title: "Customer Location Updated", message: "Ananya Gupta has updated her delivery address for #FL-3001.", type: "delivery", time: "15 min ago", read: false },
  { id: "dn3", title: "Delivery Completed", message: "Great job! Order #FL-2998 was delivered successfully. ⭐ 5-star rating!", type: "system", time: "2 hrs ago", read: false },
  { id: "dn4", title: "Customer Unavailable", message: "Vikram Patel did not respond for order #FL-3002. Auto-cancel timer started.", type: "alert", time: "1 hr ago", read: true },
  { id: "dn5", title: "Weekly Payout Processed", message: "₹3,910 has been transferred to your bank account.", type: "system", time: "Yesterday", read: true },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  order: <Package className="w-4 h-4 text-blue-500" />,
  delivery: <Truck className="w-4 h-4 text-purple-500" />,
  alert: <AlertTriangle className="w-4 h-4 text-red-500" />,
  system: <CheckCircle className="w-4 h-4 text-emerald-500" />,
};

const TYPE_BG: Record<string, string> = {
  order: "bg-blue-100",
  delivery: "bg-purple-100",
  alert: "bg-red-100",
  system: "bg-emerald-100",
};

export default function DeliveryNotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Notifications" requiredRole="delivery_partner">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">{unreadCount} new</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
              <CheckCircle className="w-3.5 h-3.5" /> Mark all read
            </button>
          )}
        </div>

        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm group ${notif.read ? "border-slate-100 opacity-70" : "border-purple-200 bg-purple-50/30"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_BG[notif.type]}`}>
                  {TYPE_ICONS[notif.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${notif.read ? "text-slate-600" : "text-slate-900"}`}>{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                    </div>
                    <button onClick={() => dismiss(notif.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-100 transition-all shrink-0">
                      <X className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5">{notif.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No notifications</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
