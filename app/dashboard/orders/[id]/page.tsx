/**
 * app/dashboard/orders/[id]/page.tsx — Order Tracking Page
 * ─────────────────────────────────────────────────────────────────────────────
 * Features:
 *   - Google Maps UI placeholder with mock markers
 *   - Customer location marker + delivery partner marker
 *   - Animated movement (mock using interval)
 *   - Location permission flow (navigator.geolocation)
 *
 * // Replace with real-time Supabase location tracking later
 */

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, ShoppingBag, Calendar, Heart, Star, CreditCard, Bell,
  MapPin, Navigation, Truck, Package, Phone, Clock, ChevronLeft,
  AlertTriangle, CheckCircle, LocateFixed,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LiveTrackingMap } from "@/components/ui/LiveTrackingMap";
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

// ─── Mock coordinates ──────────────────────────────────────────────────────────
// Replace with real-time Supabase location tracking later

const CUSTOMER_LOCATION = { lat: 19.0760, lng: 72.8777 }; // Mumbai
const INITIAL_DELIVERY_LOCATION = { lat: 19.0620, lng: 72.8650 };

const DELIVERY_STATUSES = [
  { key: "confirmed", label: "Confirmed", icon: <CheckCircle className="w-4 h-4" /> },
  { key: "preparing", label: "Preparing", icon: <Package className="w-4 h-4" /> },
  { key: "picked_up", label: "Picked Up", icon: <Truck className="w-4 h-4" /> },
  { key: "on_the_way", label: "On the Way", icon: <Navigation className="w-4 h-4" /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle className="w-4 h-4" /> },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [currentStatus, setCurrentStatus] = useState("on_the_way");
  const [deliveryLat, setDeliveryLat] = useState(INITIAL_DELIVERY_LOCATION.lat);
  const [deliveryLng, setDeliveryLng] = useState(INITIAL_DELIVERY_LOCATION.lng);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [showLocationBanner, setShowLocationBanner] = useState(true);

  // ─── Animate delivery partner movement (mock) ──────────────────────────────
  // Replace with real-time Supabase location tracking later
  useEffect(() => {
    if (currentStatus !== "on_the_way") return;

    const interval = setInterval(() => {
      setDeliveryLat(prev => {
        const diff = CUSTOMER_LOCATION.lat - prev;
        return prev + diff * 0.08;
      });
      setDeliveryLng(prev => {
        const diff = CUSTOMER_LOCATION.lng - prev;
        return prev + diff * 0.08;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStatus]);

  // ─── Location permission flow ───────────────────────────────────────────────
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationPermission("denied");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationPermission("granted");
      },
      () => {
        setLocationPermission("denied");
      }
    );
  }, []);

  const statusIndex = DELIVERY_STATUSES.findIndex(s => s.key === currentStatus);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Order Tracking" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back + Order ID */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/orders"
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Order #{orderId}</h1>
            <p className="text-xs text-slate-500">Track your delivery in real-time</p>
          </div>
        </div>

        {/* Location Permission Banner */}
        {locationPermission === "prompt" && showLocationBanner && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3 flex-wrap">
            <LocateFixed className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">Allow location access for better tracking experience</p>
              <p className="text-xs text-blue-600 mt-0.5">Your location helps us show accurate delivery estimates.</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setShowLocationBanner(false)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
                Dismiss
              </button>
              <button onClick={requestLocation}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                Allow
              </button>
            </div>
          </motion.div>
        )}

        {locationPermission === "denied" && showLocationBanner && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Location access denied</p>
              <p className="text-xs text-amber-600 mt-0.5">Enable location in your browser settings for a better tracking experience.</p>
            </div>
            <button onClick={() => setShowLocationBanner(false)}
              className="text-xs text-amber-600 hover:text-amber-700 shrink-0">Dismiss</button>
          </motion.div>
        )}

        {/* Map Section */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-500" /> Live Tracking
            </h3>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">Live</span>
            </div>
          </div>
          <LiveTrackingMap
            mode="customer"
            customerLat={userLocation?.lat ?? CUSTOMER_LOCATION.lat}
            customerLng={userLocation?.lng ?? CUSTOMER_LOCATION.lng}
            deliveryLat={deliveryLat}
            deliveryLng={deliveryLng}
            className="h-[300px] sm:h-[400px]"
          />
        </motion.div>

        {/* Delivery Status Timeline */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Delivery Status</h3>
          <div className="flex items-center justify-between gap-1">
            {DELIVERY_STATUSES.map((status, i) => {
              const isActive = i <= statusIndex;
              const isCurrent = status.key === currentStatus;
              return (
                <div key={status.key} className="flex-1 flex flex-col items-center gap-2 relative">
                  {i > 0 && (
                    <div className={`absolute top-4 -left-1/2 w-full h-0.5 ${i <= statusIndex ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? "bg-emerald-500 text-white ring-4 ring-emerald-100 scale-110"
                      : isActive
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                  }`}>
                    {status.icon}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-medium text-center ${isCurrent ? "text-emerald-700" : isActive ? "text-slate-600" : "text-slate-400"}`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Delivery Partner Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-purple-500" /> Delivery Partner
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">K</div>
              <div className="flex-1">
                <p className="font-medium text-slate-900 text-sm">Kiran Reddy</p>
                <p className="text-xs text-slate-400">⭐ 4.8 · 340 deliveries</p>
              </div>
              <a href="tel:+919876500000" className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors">
                <Phone className="w-4 h-4 text-purple-600" />
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" /> Estimated Delivery
            </h3>
            <p className="text-2xl font-bold text-slate-900">25-35 min</p>
            <p className="text-xs text-slate-400 mt-1">
              {userLocation
                ? `Your location: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                : "Default location: Mumbai"}
            </p>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
