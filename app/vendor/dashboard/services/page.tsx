/**
 * app/vendor/dashboard/services/page.tsx — Vendor My Services
 * ─────────────────────────────────────────────────────────────────────────────
 * Features:
 *   - Add Service button with form modal
 *   - Service cards with image, name, price, edit/delete
 *   - Local state (useState) for service management
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, BarChart3, Calendar, Star, TrendingUp, Bell, Settings,
  PlusCircle, Edit3, Trash2, X, ImageIcon, IndianRupee,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const NAV_ITEMS = [
  { label: "Overview", href: "/vendor/dashboard", icon: <BarChart3 className="w-4 h-4" /> },
  { label: "My Flower Services", href: "/vendor/dashboard/services", icon: <Package className="w-4 h-4" /> },
  { label: "Flower Orders", href: "/vendor/dashboard/bookings", icon: <Calendar className="w-4 h-4" />, badge: 3 },
  { label: "Reviews", href: "/vendor/dashboard/reviews", icon: <Star className="w-4 h-4" /> },
  { label: "Earnings", href: "/vendor/dashboard/earnings", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "Notifications", href: "/vendor/dashboard/notifications", icon: <Bell className="w-4 h-4" />, badge: 2 },
  { label: "Profile & Settings", href: "/vendor/dashboard/settings", icon: <Settings className="w-4 h-4" /> },
];

interface FlowerService {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400&q=75",
  "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=400&q=75",
  "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&q=75",
  "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=75",
  "https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=400&q=75",
];

const INITIAL_SERVICES: FlowerService[] = [
  { id: "fs-1", name: "Red Rose Bouquet", price: 1200, description: "A beautiful bouquet of 12 premium red roses with baby breath filler.", image: MOCK_IMAGES[0] },
  { id: "fs-2", name: "Mixed Lily Arrangement", price: 1800, description: "Elegant arrangement of assorted lilies in a glass vase.", image: MOCK_IMAGES[1] },
  { id: "fs-3", name: "Sunflower Bunch", price: 900, description: "Bright and cheerful bunch of 6 sunflowers with green foliage.", image: MOCK_IMAGES[2] },
];

export default function VendorServicesPage() {
  const [services, setServices] = useState<FlowerService[]>(INITIAL_SERVICES);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  const resetForm = () => {
    setForm({ name: "", price: "", description: "" });
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (service: FlowerService) => {
    setForm({ name: service.name, price: String(service.price), description: service.description });
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;

    if (editingId) {
      setServices(prev => prev.map(s =>
        s.id === editingId
          ? { ...s, name: form.name, price: Number(form.price), description: form.description }
          : s
      ));
    } else {
      const newService: FlowerService = {
        id: `fs-${Date.now()}`,
        name: form.name,
        price: Number(form.price),
        description: form.description,
        image: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
      };
      setServices(prev => [...prev, newService]);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} title="My Flower Services" requiredRole="vendor">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Flower Services</h1>
            <p className="text-sm text-slate-500 mt-0.5">{services.length} service{services.length !== 1 ? "s" : ""} listed</p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
            <PlusCircle className="w-4 h-4" /> Add Service
          </button>
        </div>

        {/* Service Cards */}
        {services.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">No services yet</p>
            <p className="text-slate-400 text-sm mt-1">Click &quot;Add Service&quot; to create your first flower service.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-44 bg-gradient-to-br from-pink-50 to-rose-50 relative overflow-hidden">
                  <img src={service.image} alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                    <span className="text-sm font-bold text-slate-900">₹{service.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900">{service.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                    <button onClick={() => openEdit(service)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl transition-colors">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(service.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-xl transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                key="modal-bg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={() => { setShowModal(false); resetForm(); }}
              />
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {editingId ? "Edit Service" : "Add New Service"}
                    </h3>
                    <button onClick={() => { setShowModal(false); resetForm(); }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                      <X className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Flower Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Red Rose Bouquet"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Price (₹)</label>
                      <div className="relative">
                        <IndianRupee className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          required
                          min="1"
                          value={form.price}
                          onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="1200"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe this flower service..."
                        rows={3}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-1.5 block">Image</label>
                      <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl border border-dashed border-slate-300 bg-slate-50">
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                        <span className="text-xs text-slate-500">A random flower image will be assigned (mock)</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                        className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 transition-colors">
                        Cancel
                      </button>
                      <button type="submit"
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                        {editingId ? "Save Changes" : "Add Service"}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
