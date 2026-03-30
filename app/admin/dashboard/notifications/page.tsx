/**
 * app/admin/dashboard/notifications/page.tsx — Admin Notifications
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Store, Users, Calendar, TrendingUp, Bell, Settings, BarChart3,
  Flower2, AlertTriangle, CheckCircle, Package, X,
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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "vendor" | "order" | "alert" | "system";
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "an1", title: "New Vendor Registration", message: "Bloom Garden Florist has registered and is awaiting approval.", type: "vendor", time: "10 min ago", read: false },
  { id: "an2", title: "Dispute Raised", message: "Order #FL-2039 has a dispute. Customer claims wrong flowers delivered.", type: "alert", time: "30 min ago", read: false },
  { id: "an3", title: "High Volume Alert", message: "Order volume is 40% above average today. Consider adding more delivery partners.", type: "system", time: "1 hr ago", read: false },
  { id: "an4", title: "Vendor Approved", message: "Petal & Plume Flowers has been approved and is now live.", type: "vendor", time: "2 hrs ago", read: true },
  { id: "an5", title: "Order Completed", message: "Order #FL-2037 delivered successfully. 5-star rating received.", type: "order", time: "3 hrs ago", read: true },
  { id: "an6", title: "Delivery Partner Joined", message: "Kiran Reddy has joined as a delivery partner.", type: "system", time: "Yesterday", read: true },
  { id: "an7", title: "Weekly Report Ready", message: "Your weekly analytics report for Mar 11-17 is ready to view.", type: "system", time: "2 days ago", read: true },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  vendor: <Store className="w-4 h-4 text-blue-500" />,
  order: <Package className="w-4 h-4 text-emerald-500" />,
  alert: <AlertTriangle className="w-4 h-4 text-red-500" />,
  system: <Bell className="w-4 h-4 text-amber-500" />,
};

const TYPE_BG: Record<string, string> = {
  vendor: "bg-blue-100",
  order: "bg-emerald-100",
  alert: "bg-red-100",
  system: "bg-amber-100",
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Notifications" requiredRole="admin">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">{unreadCount} new</span>
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
          {/* TODO: Backend Integration: Fetch system notifications specific to Admin role from Supabase */}
          {notifications.map((notif, i) => (
            <motion.div key={notif.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm group ${notif.read ? "border-slate-100 opacity-70" : "border-red-200 bg-red-50/30"}`}>
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
