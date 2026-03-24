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
  { label: "My Orders", href: "/dashboard/orders", icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "My Bookings", href: "/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 2 },
  { label: "Favourites", href: "/dashboard/favourites", icon: <Heart className="w-4 h-4" /> },
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
  estimatedDeliveryTime?: string;
  deliveryStatus?: string;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  preparing: "bg-blue-100 text-blue-700",
  on_the_way: "bg-indigo-100 text-indigo-700",
  at_location: "bg-pink-100 text-pink-700",
  delivered: "bg-emerald-500 text-white",
  cancelled: "bg-red-100 text-red-600",
};

function OrderCard({ order, onCancel }: { order: Order; onCancel: (id: string) => void }) {
  const [currentStatus, setCurrentStatus] = useState(order.deliveryStatus || "confirmed");
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    if (order.status === "cancelled") {
        setCurrentStatus("cancelled");
        return;
    }
    // Simulate status progression for demonstration
    const timer = setTimeout(() => {
      if (currentStatus === "confirmed") setCurrentStatus("preparing");
      else if (currentStatus === "preparing") setCurrentStatus("on_the_way");
      else if (currentStatus === "on_the_way") setCurrentStatus("at_location");
    }, 10000); // Progress every 10 seconds for demo

    return () => clearTimeout(timer);
  }, [currentStatus, order.status]);

  useEffect(() => {
    if (currentStatus === "at_location" && order.status !== "cancelled") {
      setTimerActive(true);
    } else {
      setTimerActive(false);
    }
  }, [currentStatus, order.status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      onCancel(order.id);
      setTimerActive(false);
      setCurrentStatus("cancelled");
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, order.id, onCancel]);

  const progressWidth = {
    confirmed: "25%",
    preparing: "50%",
    on_the_way: "75%",
    at_location: "95%",
    delivered: "100%",
    cancelled: "0%",
  }[currentStatus] || "0%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
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
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[currentStatus] || STATUS_STYLES.confirmed}`}>
            {currentStatus.replace(/_/g, " ")}
          </span>
          <span className="font-bold text-slate-900">₹{order.total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Tracking Section */}
      {order.type === "flowers" && currentStatus !== "cancelled" && currentStatus !== "delivered" && (
        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tracking Live</p>
            <p className="text-xs text-pink-600 font-medium">Est. Delivery: {order.estimatedDeliveryTime || "30-45 mins"}</p>
          </div>
          
          {/* Simulated Map */}
          <div className="relative h-32 w-full bg-slate-200 rounded-xl overflow-hidden mb-4 border border-slate-100">
            {/* Map Background (Grid/Pattern) */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {/* Route path */}
            <svg className="absolute inset-0 w-full h-full">
                <motion.path 
                    d="M 20 100 Q 150 20 280 100" 
                    fill="none" 
                    stroke="#e2e8f0" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                />
                <motion.path 
                    d="M 20 100 Q 150 20 280 100" 
                    fill="none" 
                    stroke="#ec4899" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: parseFloat(progressWidth) / 100 }}
                />
            </svg>

            {/* Delivery Partner Marker */}
            <motion.div 
                className="absolute w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10 border-2 border-pink-500"
                style={{ left: progressWidth, top: '45%', transform: 'translate(-50%, -50%)' }}
                animate={{ 
                    left: progressWidth,
                    scale: [1, 1.1, 1],
                }}
                transition={{ 
                    left: { duration: 1 },
                    scale: { repeat: Infinity, duration: 2 }
                }}
            >
                <div className="w-4 h-4 bg-pink-500 rounded-full" />
            </motion.div>

            {/* Destination Marker */}
            <div className="absolute right-4 top-[45%] -translate-y-1/2">
                <div className="w-3 h-3 bg-slate-400 rounded-full" />
                <div className="absolute -top-6 -right-2 bg-white px-2 py-0.5 rounded text-[8px] font-bold shadow-sm border border-slate-100 whitespace-nowrap">
                    YOUR HOME
                </div>
            </div>
          </div>
          
          {/* Progress bar (simplified since we have map now) */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <p className="text-sm font-medium text-slate-700">
                    {currentStatus === "at_location" 
                        ? "Partner reached location" 
                        : currentStatus === "on_the_way" 
                        ? "Partner is on the way"
                        : "Preparing your order"}
                </p>
            </div>
            {currentStatus === "at_location" && (
                <div className="bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg">
                    <p className="text-[10px] font-bold text-red-600 uppercase">Auto-cancel in</p>
                    <p className="text-sm font-mono font-bold text-red-700">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </p>
                </div>
            )}
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {order.items.map((item) => (
            <span key={item.id} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {item.name} × {item.qty}
            </span>
          ))}
        </div>
        <div className="flex justify-between items-end mt-3">
            <div>
                {order.deliveryDate && (
                    <p className="text-xs text-slate-400">
                        Delivery Date: {order.deliveryDate}
                    </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1">
                    Address: {order.deliveryAddress}
                </p>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("es_orders");
    if (raw) {
      setOrders(JSON.parse(raw).reverse());
    }
  }, []);

  const handleCancelOrder = (id: string) => {
    setOrders((prev) => {
      const updated = prev.map((o) => 
        o.id === id ? { ...o, status: "cancelled", deliveryStatus: "cancelled" } : o
      );
      // Sync back to localStorage
      localStorage.setItem("es_orders", JSON.stringify([...updated].reverse()));
      return updated;
    });
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Orders" requiredRole="customer">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
            <p className="text-xs text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-full">
                {orders.length} Order{orders.length !== 1 ? 's' : ''}
            </p>
        </div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">No orders yet</p>
            <p className="text-slate-400 text-sm mt-1">Your flower orders will appear here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={handleCancelOrder} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
