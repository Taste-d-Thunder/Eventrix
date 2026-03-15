/**
 * app/dashboard/orders/page.tsx — My Orders (Customer)
 */

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Calendar, Heart, Star, User, Bell, CreditCard, Flower2, Package } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: <User className="w-4 h-4" /> },
  { label: "My Bookings", href: "/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 2 },
  { label: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Favourites", href: "/dashboard/favourites", icon: <Heart className="w-4 h-4" />, badge: 5 },
  { label: "Reviews", href: "/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Payments", href: "/dashboard/payments", icon: <CreditCard className="w-4 h-4" /> },
  { label: "Notifications", href: "/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 3 },
];

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  type: string;
  items: OrderItem[];
  total: number;
  deliveryAddress: string;
  deliveryDate: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  delivered: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("es_orders");
    if (raw) {
      setOrders(JSON.parse(raw).reverse());
    }
  }, []);

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Orders" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">No orders yet</p>
            <p className="text-slate-400 text-sm mt-1">Your flower and service orders will appear here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      order.type === "flowers" ? "bg-pink-100" : "bg-blue-100"
                    }`}>
                      {order.type === "flowers"
                        ? <Flower2 className="w-4 h-4 text-pink-600" />
                        : <Package className="w-4 h-4 text-blue-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">
                        {order.type === "flowers" ? "Flower Order" : "Service Booking"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.id} · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                      {order.status}
                    </span>
                    <span className="font-bold text-slate-900">₹{order.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Order items */}
                <div className="px-6 py-3">
                  <div className="flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-full">
                        {item.name} × {item.qty}
                      </span>
                    ))}
                  </div>
                  {order.deliveryDate && (
                    <p className="text-xs text-slate-400 mt-2">
                      Delivery: {order.deliveryDate}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
