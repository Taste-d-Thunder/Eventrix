/**
 * app/delivery/dashboard/page.tsx — Delivery Partner Dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Features:
 *   - View assigned orders
 *   - Accept / Reject delivery
 *   - Update status: picked_up → on_the_way → delivered
 *   - View customer location on map
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package, MapPin, Clock, CheckCircle, XCircle,
  Truck, Navigation, Phone, User, BarChart3,
  Bell, Settings, Star,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LiveTrackingMap } from "@/components/ui/LiveTrackingMap";
import { getCurrentUser } from "@/lib/auth";
import type { User as UserType } from "@/types/auth";

// ─── Nav Items ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "My Deliveries", href: "/delivery/dashboard", icon: <Package className="w-4 h-4" /> },
  { label: "Earnings", href: "/delivery/dashboard/earnings", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "Notifications", href: "/delivery/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
  { label: "Settings", href: "/delivery/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

// ─── Mock Data ────────────────────────────────────────────────────────────────

type DeliveryStatus = "pending" | "assigned" | "picked_up" | "on_the_way" | "delivered" | "rejected";

interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  items: string;
  total: number;
  status: DeliveryStatus;
  shopName: string;
  customerLat: number;
  customerLng: number;
  createdAt: string;
}

const MOCK_ORDERS: DeliveryOrder[] = [
  {
    id: "FL-3001",
    customerName: "Ananya Gupta",
    customerPhone: "+91 98765 11111",
    address: "B-204, Sea View Apartments, Juhu, Mumbai",
    items: "Red Rose Bouquet × 2, Mixed Lilies × 1",
    total: 2400,
    status: "assigned",
    shopName: "Petal & Plume Flowers",
    customerLat: 19.0988,
    customerLng: 72.8267,
    createdAt: "10 min ago",
  },
  {
    id: "FL-3002",
    customerName: "Vikram Patel",
    customerPhone: "+91 98765 22222",
    address: "301, Sunrise Tower, Bandra West, Mumbai",
    items: "Luxury Orchid Arrangement × 1",
    total: 3500,
    status: "assigned",
    shopName: "Bloom Garden Florist",
    customerLat: 19.0596,
    customerLng: 72.8295,
    createdAt: "25 min ago",
  },
  {
    id: "FL-3003",
    customerName: "Priya Sharma",
    customerPhone: "+91 98765 33333",
    address: "A-12, Palm Heights, Andheri East, Mumbai",
    items: "Birthday Flower Box × 1, Sunflower Bunch × 1",
    total: 1800,
    status: "picked_up",
    shopName: "Sunny Blooms",
    customerLat: 19.1136,
    customerLng: 72.8697,
    createdAt: "45 min ago",
  },
  {
    id: "FL-2998",
    customerName: "Rahul Verma",
    customerPhone: "+91 98765 44444",
    address: "502, Elite Residency, Powai, Mumbai",
    items: "Anniversary Rose Set × 1",
    total: 4200,
    status: "delivered",
    shopName: "Rose Garden Mumbai",
    customerLat: 19.1176,
    customerLng: 72.9060,
    createdAt: "2 hrs ago",
  },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-slate-600", bg: "bg-slate-100", icon: <Clock className="w-3.5 h-3.5" /> },
  assigned: { label: "Assigned", color: "text-amber-700", bg: "bg-amber-100", icon: <Package className="w-3.5 h-3.5" /> },
  picked_up: { label: "Picked Up", color: "text-blue-700", bg: "bg-blue-100", icon: <Truck className="w-3.5 h-3.5" /> },
  on_the_way: { label: "On the Way", color: "text-purple-700", bg: "bg-purple-100", icon: <Navigation className="w-3.5 h-3.5" /> },
  delivered: { label: "Delivered", color: "text-emerald-700", bg: "bg-emerald-100", icon: <CheckCircle className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", color: "text-red-600", bg: "bg-red-100", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const NEXT_STATUS: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  assigned: "picked_up",
  picked_up: "on_the_way",
  on_the_way: "delivered",
};

const NEXT_LABEL: Partial<Record<DeliveryStatus, string>> = {
  assigned: "Mark as Picked Up",
  picked_up: "Mark On the Way",
  on_the_way: "Mark Delivered",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DeliveryDashboard() {
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<DeliveryOrder[]>(MOCK_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(MOCK_ORDERS[0]?.id ?? null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleAccept = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "picked_up" as DeliveryStatus } : o));
  };

  const handleReject = (id: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "rejected" as DeliveryStatus } : o));
  };

  const handleStatusUpdate = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const next = NEXT_STATUS[o.status];
        return next ? { ...o, status: next } : o;
      })
    );
  };

  if (!user) return null;

  const active = orders.find((o) => o.id === selectedOrder);
  const activeOrders = orders.filter((o) => !["delivered", "rejected"].includes(o.status));
  const completedOrders = orders.filter((o) => ["delivered", "rejected"].includes(o.status));

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="Delivery Dashboard" requiredRole="delivery_partner">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Stats banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/4 translate-x-1/4" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4 text-purple-200" />
                <span className="text-purple-200 text-xs font-medium uppercase tracking-wider">Delivery Partner</span>
              </div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-purple-200 text-sm mt-0.5">Today&apos;s deliveries overview</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-2 text-center">
                <p className="text-white text-xl font-bold">{activeOrders.length}</p>
                <p className="text-purple-200 text-xs">Active</p>
              </div>
              <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-2 text-center">
                <p className="text-white text-xl font-bold">{completedOrders.filter(o => o.status === "delivered").length}</p>
                <p className="text-purple-200 text-xs">Delivered</p>
              </div>
              <div className="bg-white/15 border border-white/20 rounded-xl px-4 py-2 text-center">
                <p className="text-white text-xl font-bold flex items-center gap-1">4.8 <Star className="w-3 h-3 fill-amber-400 text-amber-400" /></p>
                <p className="text-purple-200 text-xs">Rating</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Order list — left side */}
          <div className="lg:col-span-3 space-y-4">

            {/* Active Deliveries */}
            {activeOrders.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  Active Deliveries
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">{activeOrders.length}</span>
                </h3>
                <div className="space-y-3">
                  {activeOrders.map((order, i) => {
                    const statusConf = STATUS_CONFIG[order.status];
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setSelectedOrder(order.id)}
                        className={`bg-white rounded-2xl border p-4 sm:p-5 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedOrder === order.id ? "border-purple-300 shadow-md ring-1 ring-purple-100" : "border-slate-100"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900 text-sm">#{order.id}</p>
                              <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConf.bg} ${statusConf.color}`}>
                                {statusConf.icon}
                                {statusConf.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{order.shopName} · {order.createdAt}</p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm shrink-0">₹{order.total.toLocaleString()}</p>
                        </div>

                        {/* Customer info */}
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-slate-700">{order.customerName}</span>
                            <a href={`tel:${order.customerPhone}`} className="ml-auto flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700">
                              <Phone className="w-3 h-3" />Call
                            </a>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-slate-600 text-xs">{order.address}</span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <Package className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="text-slate-600 text-xs">{order.items}</span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap">
                          {order.status === "assigned" && (
                            <>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAccept(order.id); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-xl border border-emerald-200 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />Accept
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleReject(order.id); }}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-xl border border-red-200 transition-colors"
                              >
                                <XCircle className="w-3.5 h-3.5" />Reject
                              </button>
                            </>
                          )}
                          {NEXT_STATUS[order.status] && order.status !== "assigned" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleStatusUpdate(order.id); }}
                              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium rounded-xl border border-purple-200 transition-colors"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              {NEXT_LABEL[order.status]}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Completed Deliveries */}
            {completedOrders.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Completed
                </h3>
                <div className="space-y-2">
                  {completedOrders.map((order) => {
                    const statusConf = STATUS_CONFIG[order.status];
                    return (
                      <div key={order.id} className="bg-white rounded-xl border border-slate-100 p-4 opacity-70">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-700 text-sm">#{order.id}</p>
                            <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${statusConf.bg} ${statusConf.color}`}>
                              {statusConf.icon}{statusConf.label}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{order.customerName} · ₹{order.total.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Map — right side */}
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-500" />
                Customer Location
              </h3>
              <LiveTrackingMap
                mode="delivery"
                customerLat={active?.customerLat}
                customerLng={active?.customerLng}
                className="h-[300px] md:h-[450px] border border-slate-200"
              />
              {active && (
                <div className="mt-3 bg-white rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500 mb-1">Delivering to</p>
                  <p className="text-sm font-medium text-slate-900">{active.customerName}</p>
                  <p className="text-xs text-slate-500 mt-1">{active.address}</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
