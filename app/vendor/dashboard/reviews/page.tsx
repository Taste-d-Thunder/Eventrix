/**
 * app/vendor/dashboard/reviews/page.tsx
 */
"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Package, BarChart3, Calendar, Star, TrendingUp, Bell, Settings, MessageSquareReply } from "lucide-react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Bookings", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

export default function VendorReviewsPage() {
  // TODO: Backend Integration: Fetch vendor reviews from Supabase
  const [reviews] = useState([
    { id: "REV-1", customer: "Priya Sharma", rating: 5, date: "2 days ago", comment: "The red roses were absolutely stunning! Fresh and delivered on time.", reply: null },
    { id: "REV-2", customer: "Amit Kumar", rating: 4, date: "1 week ago", comment: "Great bouquet, but the delivery partner was a bit late. Overall happy with the flowers.", reply: "Thank you for the feedback Amit! We'll work on our delivery timings." },
    { id: "REV-3", customer: "Neha Gupta", rating: 5, date: "1 month ago", comment: "Beautiful orchids, my mother loved them for her birthday.", reply: null },
  ]);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Reviews" requiredRole="vendor">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Reviews</h1>
          <p className="text-slate-500 text-sm mt-1">See what customers are saying about your flower arrangements.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900">4.7</span>
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Star className="w-8 h-8" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Reviews</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900">3</span>
              </div>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
              <MessageSquareReply className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {reviews.map((review, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              key={review.id} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{review.customer}</h3>
                    <p className="text-xs text-slate-400">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">{review.comment}</p>
              
              {review.reply ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Reply</p>
                  <p className="text-sm text-slate-700">{review.reply}</p>
                </div>
              ) : (
                <div className="mt-2 text-right">
                  {/* TODO: Backend Integration: Post reply to review via Supabase */}
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex justify-end items-center gap-1.5 ml-auto">
                    <MessageSquareReply className="w-4 h-4" /> Reply to Review
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
