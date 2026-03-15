// ─── types/auth.ts ─────────────────────────────────────────────────────────────
// Central type definitions for the auth system

export type UserRole = "admin" | "vendor" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  // Vendor-specific fields
  businessName?: string;
  serviceCategory?: string;
  city?: string;
  phone?: string;
  isVerified?: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  // Vendor-specific
  businessName?: string;
  serviceCategory?: string;
  city?: string;
  phone?: string;
}

/** Where each role lands after login */
export const ROLE_REDIRECT: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  vendor: "/vendor/dashboard",
  customer: "/dashboard",
};

/** Route prefixes that require each role */
export const PROTECTED_ROUTES: Record<string, UserRole> = {
  "/admin": "admin",
  "/vendor/dashboard": "vendor",
  "/dashboard": "customer",
};
