/**
 * app/dashboard/reviews/page.tsx — Customer Reviews
 */

"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar, ShoppingBag, Heart, Star, User, Bell, CreditCard,
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

const MOCK_REVIEWS = [
  { id: "r1", vendor: "Petal & Plume Flowers", rating: 5, comment: "Beautiful arrangement! The roses were fresh and the bouquet was exactly as pictured. Delivery was on time.", date: "Mar 20, 2024" },
  { id: "r2", vendor: "Rose Garden Mumbai", rating: 4, comment: "Good quality flowers. The wedding decoration was stunning, just wished they had more variety in tulips.", date: "Mar 15, 2024" },
  { id: "r3", vendor: "Bloom Garden Florist", rating: 5, comment: "Excellent service! They went above and beyond to customize the arrangement for our anniversary.", date: "Feb 28, 2024" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Reviews" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-bold text-slate-900">My Reviews</h1>
          <p className="text-sm text-slate-500">{MOCK_REVIEWS.length} reviews written</p>
        </div>

        <div className="space-y-3">
          {MOCK_REVIEWS.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shrink-0">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{review.vendor}</p>
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{review.comment}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
