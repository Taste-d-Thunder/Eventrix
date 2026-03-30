# Backend Integration Points

This document provides a comprehensive index of all the locations in the frontend codebase that currently use mock data (via `localStorage` or hardcoded states) and require backend integration (e.g., Supabase) for full production readiness.

## 1. Authentication & Users
- **`lib/auth.ts`**
  - **Action Needed:** Replace `localStorage`-based user sessions, `login`, `register`, `logout` with Supabase Auth (`@supabase/auth-helpers-nextjs`).
  - **Status:** Simulated latency implemented. Needs actual API calls.

## 2. Store & Data Layer
- **`lib/vendorStore.ts`**
  - **Action Needed:** Replace `localStorage` operations for `getVendorPackages`, `saveVendorPackage`, `deleteVendorPackage`, `getVendorGallery`, `addGalleryPhotos`, `deleteGalleryPhoto` with Supabase REST API or RPC calls.
  - **Status:** Functions defined; currently stubbed with `localStorage` and `// TODO:` comments pointing to Supabase tables (`vendor_packages`, `vendor_gallery`).

## 3. Vendor Dashboard
- **`app/vendor/dashboard/services/page.tsx`**
  - **Integration:** Fetch/mutate `vendorStore` data to `vendor_packages` table. Handle image uploads via Supabase Storage instead of base64 strings.
- **`app/vendor/dashboard/settings/page.tsx`**
  - **Integration:** Fetch/mutate `vendorStore` photo gallery to `vendor_gallery` table. Sync business details and payout settings (bank info/UPI) to `vendor_profiles` and securely store.
- **`app/vendor/dashboard/earnings/page.tsx`**
  - **Integration:** Fetch vendor earnings summary and payout history logs from a `transactions` or `payouts` table.
- **`app/vendor/dashboard/bookings/page.tsx`**
  - **Integration:** Fetch assigned `orders` from the `orders` table. Update order fulfillment status (e.g., preparing, ready).
- **`app/vendor/dashboard/reviews/page.tsx`**
  - **Integration:** Fetch customer `reviews` tied to the `vendor_id`. Enable replying to reviews.
- **`app/vendor/dashboard/notifications/page.tsx`**
  - **Integration:** Fetch `notifications` scoped to the `vendor_id`. Allow marking them as read.

## 4. Admin Dashboard
- **`app/admin/dashboard/bookings/page.tsx`**
  - **Integration:** Fetch all global `orders` for administrative oversight. Add filtering/export capabilities.
- **`app/admin/dashboard/delivery/page.tsx`**
  - **Integration:** Map `users` table filtered by `role = 'delivery_partner'`. View live assignments.
- **`app/admin/dashboard/reports/page.tsx`**
  - **Integration:** Fetch aggregated revenue, order count metrics, and top-performing vendors globally.
- **`app/admin/dashboard/notifications/page.tsx`**
  - **Integration:** Fetch system-level alerts and notifications (e.g., new vendor registrations awaiting approval).
- **`app/admin/dashboard/settings/page.tsx`**
  - **Integration:** Sync platform preference toggles (auto-approve, maintenance mode, etc.) with a `platform_settings` config table.

## 5. Customer Dashboard
- **`app/dashboard/favourites/page.tsx`**
  - **Integration:** Fetch `saved_vendors` table joined with vendor profiles for user's favorites.
- **`app/dashboard/orders/page.tsx`**
  - **Integration:** Replace `localStorage.es_orders` with queries to the `orders` table scoped to `customer_id`. Handle order cancellation logic server-side.
- **`app/dashboard/payments/page.tsx`**
  - **Integration:** Fetch payment history and refunds from `transactions` table.
- **`app/dashboard/reviews/page.tsx`**
  - **Integration:** Fetch reviews created by the `customer_id`.
- **`app/dashboard/notifications/page.tsx`**
  - **Integration:** Fetch order updates, promos, and system alerts addressed to `customer_id`.

## 6. Delivery Dashboard
- **`app/delivery/dashboard/earnings/page.tsx`**
  - **Integration:** Fetch `payouts` and `delivery_earnings` for the specific `delivery_partner_id`.
- **`app/delivery/dashboard/notifications/page.tsx`**
  - **Integration:** Fetch real-time dispatch alerts and assignment updates via Supabase Realtime for `delivery_partner_id`.
- **`app/delivery/dashboard/settings/page.tsx`**
  - **Integration:** Sync driver preferences (availability toggle, auto-accept) to `delivery_profiles`.

## 7. Public/Shopping Pages
- **`app/vendors/[id]/page.tsx`** (Dynamic Vendor Page)
  - **Integration:** Fetch detailed vendor profile, packages (`vendor_packages`), and photos (`vendor_gallery`) by `vendor_id` parameter. Currently using `vendorStore`.
- **`app/checkout/page.tsx`**
  - **Integration:** Replace `localStorage` order creation with a robust Supabase edge function or API route that initiates payment gateway, inserts into `orders`, and dispatches initial notifications.

---
*Note: All relevant files in the `app/` and `lib/` directories contain `// TODO: Backend Integration:` inline comments next to the mock data arrays and states.*
