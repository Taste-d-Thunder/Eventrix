/**
 * app/vendor/dashboard/notifications/page.tsx
 */
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Package, BarChart3, Calendar, Star, TrendingUp, Bell, Settings, Info, ShoppingBag, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Bookings", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function VendorNotificationsPage() {
  // TODO: Backend Integration: Fetch vendor notifications from Supabase
  const [notifications, setNotifications] = useState([
    { id: "NOTIF-1", type: "order", title: "New Order #ORD-9915", message: "You have received a new flower order from Amit Kumar. Please confirm availability.", time: "10 mins ago", read: false },
    { id: "NOTIF-2", type: "info", title: "System Update", message: "We're updating our platform's review system on Friday. Stay tuned!", time: "2 hours ago", read: false },
    { id: "NOTIF-3", type: "success", title: "Payout Processed", message: "Your payout of ₹12,000 has been sent to your registered bank account.", time: "Yesterday", read: true },
  ]);

  const markAsRead = (id: string) => {
    // TODO: Backend Integration: Update notification read status via Supabase
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag className="w-5 h-5 text-blue-500" />;
      case "success": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "info": default: return <Info className="w-5 h-5 text-amber-500" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case "order": return "bg-blue-50 border-blue-100";
      case "success": return "bg-emerald-50 border-emerald-100";
      case "info": default: return "bg-amber-50 border-amber-100";
    }
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Notifications" requiredRole="vendor">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
            <p className="text-slate-500 text-sm mt-1">Updates on orders, reviews, and platform alerts.</p>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notif, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                key={notif.id} 
                className={`flex gap-4 p-5 rounded-2xl border ${notif.read ? 'bg-white border-slate-100' : 'bg-blue-50/30 border-blue-100 shadow-sm'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${getBg(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className={`font-semibold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{notif.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 leading-relaxed">{notif.message}</p>
                  
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {notifications.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">You're all caught up!</p>
              <p className="text-sm text-slate-400 mt-1">Check back later for new updates.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
