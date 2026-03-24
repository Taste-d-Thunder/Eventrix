-- ─────────────────────────────────────────────────────────────────────────────
-- EventSpace / Flower Marketplace — Supabase Schema
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this in the Supabase SQL editor to set up your tables.
-- This file is a reference — it is NOT auto-executed by the app.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Profiles (extends Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin','vendor','customer','delivery_partner')),
  avatar text,
  phone text,
  city text,
  business_name text,
  flower_types text,
  service_category text,
  status text default 'approved' check (status in ('pending','approved','rejected')),
  is_verified boolean default false,
  created_at timestamptz default now()
);

-- 2. Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id),
  vendor_id uuid references public.profiles(id),
  delivery_partner_id uuid references public.profiles(id),
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text default 'pending'
    check (status in ('pending','assigned','picked_up','on_the_way','delivered','cancelled')),
  delivery_address text,
  customer_name text,
  customer_lat numeric,
  customer_lng numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Delivery live locations (Realtime-enabled)
create table if not exists public.delivery_locations (
  delivery_partner_id uuid references public.profiles(id) primary key,
  order_id uuid references public.orders(id),
  lat numeric not null,
  lng numeric not null,
  updated_at timestamptz default now()
);

-- Enable Realtime on delivery_locations for live tracking
alter publication supabase_realtime add table delivery_locations;

-- 4. RLS policies (basic — tighten for production)
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.delivery_locations enable row level security;

-- Allow authenticated reads on profiles
create policy "Profiles readable by authenticated" on public.profiles
  for select using (true);

-- Allow users to update their own profile
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Allow reading orders you're involved in
create policy "Read own orders" on public.orders
  for select using (
    customer_id = auth.uid()
    or vendor_id = auth.uid()
    or delivery_partner_id = auth.uid()
  );

-- Allow delivery_locations reads for related orders
create policy "Read delivery locations" on public.delivery_locations
  for select using (true);

-- Allow delivery partners to upsert their location
create policy "Delivery partners can upsert location" on public.delivery_locations
  for all using (delivery_partner_id = auth.uid());
