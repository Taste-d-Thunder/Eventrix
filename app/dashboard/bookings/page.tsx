/**
 * app/dashboard/bookings/page.tsx — Customer Bookings
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar, ShoppingBag, Heart, Star, User, Bell, CreditCard,
  MapPin, Clock, CheckCircle, XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: <User className="w-4 h-4" /> },
  { label: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "My Bookings", href: "/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 2 },
  { label: "Favourites", href: "/dashboard/favourites", icon: <Heart className="w-4 h-4" /> },
  { label: "Reviews", href: "/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
];

const MOCK_BOOKINGS = [
  { id: "BK-001", vendor: "Petal & Plume Flowers", category: "Bouquet Arrangement", date: "Apr 20, 2024", time: "10:00 AM", status: "confirmed", amount: "₹2,500", location: "Juhu, Mumbai" },
  { id: "BK-002", vendor: "Rose Garden Mumbai", category: "Wedding Decoration", date: "May 5, 2024", time: "9:00 AM", status: "pending", amount: "₹15,000", location: "Bandra, Mumbai" },
  { id: "BK-003", vendor: "Bloom Garden Florist", category: "Birthday Arrangement", date: "Mar 15, 2024", time: "2:00 PM", status: "completed", amount: "₹1,800", location: "Andheri, Mumbai" },
  { id: "BK-004", vendor: "Sunny Blooms", category: "Anniversary Bouquet", date: "Mar 10, 2024", time: "11:00 AM", status: "cancelled", amount: "₹3,200", location: "Powai, Mumbai" },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-100 text-red-600",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  confirmed: <CheckCircle className="w-3.5 h-3.5" />,
  pending: <Clock className="w-3.5 h-3.5" />,
  completed: <CheckCircle className="w-3.5 h-3.5" />,
  cancelled: <XCircle className="w-3.5 h-3.5" />,
};

export default function BookingsPage() {
  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Bookings" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <Link href="/vendors"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
            <Calendar className="w-4 h-4" /> Book a Vendor
          </Link>
        </div>

        <div className="space-y-3">
          {MOCK_BOOKINGS.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{booking.vendor}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{booking.category}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.date} · {booking.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{booking.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[booking.status]}`}>
                    {STATUS_ICONS[booking.status]}
                    {booking.status}
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1.5">{booking.amount}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
