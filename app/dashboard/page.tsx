/**
 * app/dashboard/page.tsx — Customer Dashboard
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Heart, Star, Clock, MapPin, ChevronRight, User, Bell, Bookmark, CreditCard, ShoppingBag } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: <User className="w-4 h-4" /> },
  { label: "My Bookings", href: "/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 2 },
  { label: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Favourites", href: "/dashboard/favourites", icon: <Heart className="w-4 h-4" />, badge: 5 },
  { label: "Reviews", href: "/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
];

const BOOKINGS = [
  { id: "b1", vendor: "The Grand Maison", category: "Venue", date: "Apr 20, 2024", status: "confirmed", amount: "₹1,50,000", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=100&q=75" },
  { id: "b2", vendor: "Arjun Kapoor Photography", category: "Photographer", date: "Apr 20, 2024", status: "pending", amount: "₹45,000", image: "https://images.unsplash.com/photo-1471347334704-25603ca4b082?w=100&q=75" },
  { id: "b3", vendor: "Saffron & Salt Catering", category: "Caterer", date: "Mar 15, 2024", status: "completed", amount: "₹80,000", image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=100&q=75" },
];

const FAVOURITES = [
  { id: "f1", name: "Petal & Plume Design", category: "Decorator", rating: 4.9, location: "Mumbai", image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=100&q=75" },
  { id: "f2", name: "DJ Prism", category: "DJ", rating: 4.9, location: "Mumbai", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=100&q=75" },
];

const STATUS_STYLES = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  completed: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-100 text-red-600",
};

function StatCard({ value, label, icon, color }: { value: string; label: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => { setUser(getCurrentUser()); }, []);

  if (!user) return null;

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Dashboard" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Welcome banner */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-emerald-100 text-sm mb-1">Welcome back 👋</p>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-emerald-100 text-sm mt-1">{user.email}</p>
          </div>
          <Link href="/vendors" className="absolute right-6 bottom-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Explore Vendors <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "3", label: "Total Bookings", icon: <Calendar className="w-5 h-5 text-blue-600" />, color: "bg-blue-100" },
            { value: "2", label: "Upcoming Events", icon: <Clock className="w-5 h-5 text-amber-600" />, color: "bg-amber-100" },
            { value: "5", label: "Saved Vendors", icon: <Heart className="w-5 h-5 text-red-500" />, color: "bg-red-100" },
            { value: "2", label: "Reviews Left", icon: <Star className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-100" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Bookings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Bookings</h3>
            <Link href="/dashboard/bookings" className="text-xs text-amber-600 hover:text-amber-700 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {BOOKINGS.map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <img src={b.image} alt={b.vendor} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{b.vendor}</p>
                  <p className="text-xs text-slate-500">{b.category} · {b.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status as keyof typeof STATUS_STYLES]}`}>
                    {b.status}
                  </span>
                  <p className="text-sm font-semibold text-slate-900 mt-1">{b.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Favourite vendors */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Saved Vendors</h3>
            <Link href="/dashboard/favourites" className="text-xs text-amber-600 hover:text-amber-700 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {FAVOURITES.map((f) => (
              <div key={f.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <img src={f.image} alt={f.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{f.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{f.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{f.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-slate-900">{f.rating}</span>
                </div>
                <Link href={`/vendors/${f.id}`} className="px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                  Book
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
