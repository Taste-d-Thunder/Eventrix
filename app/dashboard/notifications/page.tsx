/**
 * app/dashboard/notifications/page.tsx — Customer Notifications
 */

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar, ShoppingBag, Heart, Star, User, Bell, CreditCard,
  Package, CheckCircle, AlertTriangle, Truck, X,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: <User className="w-4 h-4" /> },
  { label: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "My Bookings", href: "/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 2 },
  { label: "Favourites", href: "/dashboard/favourites", icon: <Heart className="w-4 h-4" /> },
  { label: "Reviews", href: "/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
];

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "delivery" | "promo" | "system";
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "Order Confirmed", message: "Your order #FL-2041 has been confirmed by Petal & Plume Flowers.", type: "order", time: "10 min ago", read: false },
  { id: "n2", title: "Delivery Partner Assigned", message: "Kiran has been assigned to deliver your order #FL-2041.", type: "delivery", time: "25 min ago", read: false },
  { id: "n3", title: "Special Offer 🌸", message: "Get 20% off on all bouquets this weekend! Use code BLOOM20.", type: "promo", time: "2 hrs ago", read: false },
  { id: "n4", title: "Order Delivered", message: "Your order #FL-2038 has been delivered successfully.", type: "order", time: "Yesterday", read: true },
  { id: "n5", title: "Rate Your Experience", message: "How was your experience with Rose Garden Mumbai? Leave a review!", type: "system", time: "2 days ago", read: true },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  order: <Package className="w-4 h-4 text-blue-500" />,
  delivery: <Truck className="w-4 h-4 text-purple-500" />,
  promo: <Star className="w-4 h-4 text-amber-500" />,
  system: <AlertTriangle className="w-4 h-4 text-slate-400" />,
};

const TYPE_BG: Record<string, string> = {
  order: "bg-blue-100",
  delivery: "bg-purple-100",
  promo: "bg-amber-100",
  system: "bg-slate-100",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Notifications" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{unreadCount} new</span>
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
              className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm group ${notif.read ? "border-slate-100 opacity-70" : "border-amber-200 bg-amber-50/30"}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_BG[notif.type]}`}>
                  {TYPE_ICONS[notif.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm font-semibold ${notif.read ? "text-slate-600" : "text-slate-900"}`}>{notif.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
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
            <p className="text-sm text-slate-400 mt-1">You&apos;re all caught up!</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
