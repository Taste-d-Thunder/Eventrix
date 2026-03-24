/**
 * app/dashboard/favourites/page.tsx — Customer Favourites
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar, ShoppingBag, Heart, Star, User, Bell, CreditCard,
  MapPin, ExternalLink,
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

const MOCK_FAVOURITES = [
  { id: "f1", name: "Petal & Plume Flowers", category: "Bouquet Specialist", rating: 4.9, reviews: 128, location: "Juhu, Mumbai", image: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=200&q=75" },
  { id: "f2", name: "Rose Garden Mumbai", category: "Wedding Flowers", rating: 4.8, reviews: 95, location: "Bandra, Mumbai", image: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=200&q=75" },
  { id: "f3", name: "Bloom Garden Florist", category: "Event Decoration", rating: 4.7, reviews: 62, location: "Andheri, Mumbai", image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=75" },
  { id: "f4", name: "Sunny Blooms", category: "Daily Fresh Flowers", rating: 4.9, reviews: 210, location: "Powai, Mumbai", image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=200&q=75" },
];

export default function FavouritesPage() {
  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Favourites" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-slate-900">My Favourites</h1>
          <p className="text-sm text-slate-500">{MOCK_FAVOURITES.length} saved vendors</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_FAVOURITES.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="h-32 bg-gradient-to-br from-pink-50 to-rose-50 relative overflow-hidden">
                <img src={vendor.image} alt={vendor.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" />
                <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{vendor.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-amber-700">{vendor.rating}</span>
                    <span className="text-[10px] text-amber-500">({vendor.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MapPin className="w-3 h-3" />{vendor.location}
                  </span>
                  <Link href="/vendors" className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium">
                    View <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
