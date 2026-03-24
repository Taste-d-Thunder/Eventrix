/**
 * lib/db.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Dual-mode data-access layer.
 *
 * Every function checks `isSupabaseConfigured()`:
 *   • true  → reads/writes Supabase tables
 *   • false → falls back to localStorage (current demo behaviour)
 *
 * This lets the app run immediately without Supabase and switch to a real
 * backend by simply setting env vars.
 */

import { supabase, isSupabaseConfigured } from "./supabase";
import type { User } from "@/types/auth";

// ─── Storage keys (localStorage fallback) ─────────────────────────────────────

const USERS_KEY = "eventspace_users";
const ORDERS_KEY = "eventspace_orders";
const DELIVERY_LOC_KEY = "eventspace_delivery_locations";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  vendorId: string;
  deliveryPartnerId?: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "pending" | "assigned" | "picked_up" | "on_the_way" | "delivered" | "cancelled";
  deliveryAddress: string;
  customerLat?: number;
  customerLng?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryLocation {
  deliveryPartnerId: string;
  orderId?: string;
  lat: number;
  lng: number;
  updatedAt: string;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUsers(): Promise<User[]> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.from("profiles").select("*");
    if (error) throw error;
    return (data ?? []).map(mapProfileToUser);
  }
  // localStorage fallback
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveUser(user: User): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from("profiles").upsert(mapUserToProfile(user));
    if (error) throw error;
    return;
  }
  const users = await getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function updateUserStatus(
  userId: string,
  status: "pending" | "approved" | "rejected"
): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", userId);
    if (error) throw error;
    return;
  }
  const users = await getUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.status = status;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(filters?: {
  deliveryPartnerId?: string;
  customerId?: string;
  vendorId?: string;
  status?: string;
}): Promise<Order[]> {
  if (isSupabaseConfigured() && supabase) {
    let query = supabase.from("orders").select("*");
    if (filters?.deliveryPartnerId) query = query.eq("delivery_partner_id", filters.deliveryPartnerId);
    if (filters?.customerId) query = query.eq("customer_id", filters.customerId);
    if (filters?.vendorId) query = query.eq("vendor_id", filters.vendorId);
    if (filters?.status) query = query.eq("status", filters.status);
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRowToOrder);
  }
  // localStorage fallback
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    let orders: Order[] = raw ? JSON.parse(raw) : [];
    if (filters?.deliveryPartnerId) orders = orders.filter((o) => o.deliveryPartnerId === filters.deliveryPartnerId);
    if (filters?.customerId) orders = orders.filter((o) => o.customerId === filters.customerId);
    if (filters?.vendorId) orders = orders.filter((o) => o.vendorId === filters.vendorId);
    if (filters?.status) orders = orders.filter((o) => o.status === filters.status);
    return orders;
  } catch {
    return [];
  }
}

export async function createOrder(order: Order): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from("orders").insert(mapOrderToRow(order));
    if (error) throw error;
    return;
  }
  const orders = await getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
  deliveryPartnerId?: string
): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const update: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (deliveryPartnerId) update.delivery_partner_id = deliveryPartnerId;
    const { error } = await supabase.from("orders").update(update).eq("id", orderId);
    if (error) throw error;
    return;
  }
  const raw = localStorage.getItem(ORDERS_KEY);
  const orders: Order[] = raw ? JSON.parse(raw) : [];
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    order.updatedAt = new Date().toISOString();
    if (deliveryPartnerId) order.deliveryPartnerId = deliveryPartnerId;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}

// ─── Delivery Locations ───────────────────────────────────────────────────────

export async function updateDeliveryLocation(loc: DeliveryLocation): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    const { error } = await supabase.from("delivery_locations").upsert({
      delivery_partner_id: loc.deliveryPartnerId,
      order_id: loc.orderId,
      lat: loc.lat,
      lng: loc.lng,
      updated_at: loc.updatedAt,
    });
    if (error) throw error;
    return;
  }
  // localStorage fallback
  const raw = localStorage.getItem(DELIVERY_LOC_KEY);
  const locs: DeliveryLocation[] = raw ? JSON.parse(raw) : [];
  const idx = locs.findIndex((l) => l.deliveryPartnerId === loc.deliveryPartnerId);
  if (idx >= 0) locs[idx] = loc;
  else locs.push(loc);
  localStorage.setItem(DELIVERY_LOC_KEY, JSON.stringify(locs));
}

export async function getDeliveryLocation(partnerId: string): Promise<DeliveryLocation | null> {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("delivery_locations")
      .select("*")
      .eq("delivery_partner_id", partnerId)
      .single();
    if (error || !data) return null;
    return {
      deliveryPartnerId: data.delivery_partner_id,
      orderId: data.order_id,
      lat: data.lat,
      lng: data.lng,
      updatedAt: data.updated_at,
    };
  }
  const raw = localStorage.getItem(DELIVERY_LOC_KEY);
  const locs: DeliveryLocation[] = raw ? JSON.parse(raw) : [];
  return locs.find((l) => l.deliveryPartnerId === partnerId) ?? null;
}

/**
 * Subscribe to real-time location updates for a delivery partner.
 * Returns an unsubscribe function.
 *
 * Supabase mode: uses Realtime channel subscription
 * localStorage mode: polls every 2 seconds
 */
export function subscribeDeliveryLocation(
  partnerId: string,
  callback: (loc: DeliveryLocation) => void
): () => void {
  if (isSupabaseConfigured() && supabase) {
    const channel = supabase
      .channel(`delivery-${partnerId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "delivery_locations",
          filter: `delivery_partner_id=eq.${partnerId}`,
        },
        (payload) => {
          const d = payload.new as Record<string, unknown>;
          callback({
            deliveryPartnerId: d.delivery_partner_id as string,
            orderId: d.order_id as string,
            lat: d.lat as number,
            lng: d.lng as number,
            updatedAt: d.updated_at as string,
          });
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }

  // localStorage polling fallback
  const interval = setInterval(async () => {
    const loc = await getDeliveryLocation(partnerId);
    if (loc) callback(loc);
  }, 2000);

  return () => clearInterval(interval);
}

// ─── Mappers (Supabase snake_case ↔ app camelCase) ────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapProfileToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatar: row.avatar,
    phone: row.phone,
    city: row.city,
    businessName: row.business_name,
    flowerTypes: row.flower_types,
    serviceCategory: row.service_category,
    status: row.status,
    isVerified: row.is_verified,
    createdAt: row.created_at,
  };
}

function mapUserToProfile(user: User): Record<string, unknown> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar ?? null,
    phone: user.phone ?? null,
    city: user.city ?? null,
    business_name: user.businessName ?? null,
    flower_types: user.flowerTypes ?? null,
    service_category: user.serviceCategory ?? null,
    status: user.status ?? "approved",
    is_verified: user.isVerified ?? false,
    created_at: user.createdAt,
  };
}

function mapRowToOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id,
    customerName: row.customer_name,
    vendorId: row.vendor_id,
    deliveryPartnerId: row.delivery_partner_id,
    items: row.items,
    total: row.total,
    status: row.status,
    deliveryAddress: row.delivery_address,
    customerLat: row.customer_lat,
    customerLng: row.customer_lng,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapOrderToRow(order: Order): Record<string, unknown> {
  return {
    id: order.id,
    customer_id: order.customerId,
    customer_name: order.customerName,
    vendor_id: order.vendorId,
    delivery_partner_id: order.deliveryPartnerId ?? null,
    items: order.items,
    total: order.total,
    status: order.status,
    delivery_address: order.deliveryAddress,
    customer_lat: order.customerLat ?? null,
    customer_lng: order.customerLng ?? null,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}
