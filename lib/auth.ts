/**
 * lib/auth.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Client-side auth helpers using localStorage for session persistence.
 *
 * In production, replace localStorage with:
 *   - Supabase Auth (recommended — see lib/supabase.ts)
 *   - HTTP-only cookies
 *   - NextAuth.js / Clerk
 *
 * All functions are synchronous for demo; add async/await when wiring to API.
 */

import type { User, UserRole, LoginCredentials, RegisterCredentials } from "@/types/auth";

const SESSION_KEY = "eventspace_session";
const USERS_KEY = "eventspace_users";

// ─── Seed demo users (remove in production) ───────────────────────────────────

const DEMO_USERS: User[] = [
  {
    id: "usr_admin_001",
    name: "Aditya Sharma",
    email: "admin@eventspace.in",
    role: "admin",
    avatar: "https://i.pravatar.cc/100?img=11",
    createdAt: new Date().toISOString(),
    isVerified: true,
    status: "approved",
  },
  {
    id: "usr_vendor_001",
    name: "Priya Mehta",
    email: "vendor@eventspace.in",
    role: "vendor",
    avatar: "https://i.pravatar.cc/100?img=5",
    createdAt: new Date().toISOString(),
    businessName: "Petal & Plume Flowers",
    serviceCategory: "Florist",
    flowerTypes: "Roses, Lilies, Orchids",
    city: "Mumbai",
    phone: "+91 98765 43210",
    isVerified: true,
    status: "approved",
  },
  {
    id: "usr_customer_001",
    name: "Rahul Verma",
    email: "user@eventspace.in",
    role: "customer",
    avatar: "https://i.pravatar.cc/100?img=3",
    createdAt: new Date().toISOString(),
    isVerified: true,
    status: "approved",
  },
  {
    id: "usr_delivery_001",
    name: "Kiran Reddy",
    email: "delivery@eventspace.in",
    role: "delivery_partner",
    avatar: "https://i.pravatar.cc/100?img=8",
    createdAt: new Date().toISOString(),
    isVerified: true,
    status: "approved",
    city: "Mumbai",
    phone: "+91 99887 76655",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return DEMO_USERS;
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const stored: User[] = raw ? JSON.parse(raw) : [];
    // Merge demo users (by email so we don't duplicate)
    const allEmails = new Set(stored.map((u) => u.email));
    const merged = [...stored];
    for (const demo of DEMO_USERS) {
      if (!allEmails.has(demo.email)) merged.push(demo);
    }
    return merged;
  } catch {
    return DEMO_USERS;
  }
}

function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

// ─── Core Auth Functions ──────────────────────────────────────────────────────

/**
 * loginUser
 * Validates credentials against stored users.
 * Returns the User on success, throws on failure.
 *
 * Demo passwords: "password123" works for all demo accounts.
 */
export function loginUser(credentials: LoginCredentials): User {
  const users = getStoredUsers();

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === credentials.email.toLowerCase() &&
      u.role === credentials.role
  );

  if (!user) {
    throw new Error("No account found with that email and role combination.");
  }

  // In production: verify bcrypt hash against DB
  // For demo, any non-empty password works for demo accounts
  if (!credentials.password || credentials.password.length < 6) {
    throw new Error("Invalid password. Must be at least 6 characters.");
  }

  // Store session
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  return user;
}

/**
 * registerUser
 * Creates a new user account and persists it.
 * Returns the new User on success, throws on failure.
 */
export function registerUser(credentials: RegisterCredentials): User {
  const users = getStoredUsers();

  // Check for duplicate email
  const exists = users.find(
    (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
  );
  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  // Validate password
  if (credentials.password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  // Create user object
  const newUser: User = {
    id: generateId(),
    name: credentials.name,
    email: credentials.email,
    role: credentials.role,
    createdAt: new Date().toISOString(),
    isVerified: false,
    // Vendors start as pending — admin must approve
    status: credentials.role === "vendor" ? "pending" : "approved",
    // Vendor fields
    ...(credentials.role === "vendor" && {
      businessName: credentials.businessName,
      serviceCategory: credentials.serviceCategory,
      flowerTypes: credentials.flowerTypes,
      city: credentials.city,
      phone: credentials.phone,
    }),
    // Delivery partner fields
    ...(credentials.role === "delivery_partner" && {
      city: credentials.city,
      phone: credentials.phone,
    }),
  };

  // Persist
  saveUsers([...users, newUser]);

  // Auto-login after registration
  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  }

  return newUser;
}

/**
 * logoutUser
 * Clears the session from localStorage.
 */
export function logoutUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * getCurrentUser
 * Returns the currently logged-in User, or null if no session.
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * isAuthenticated
 * Quick boolean check — avoids importing getCurrentUser everywhere.
 */
export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/**
 * hasRole
 * Checks if the current user has a specific role.
 */
export function hasRole(role: UserRole): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * updateCurrentUser
 * Patches the session user — use after profile edits.
 */
export function updateCurrentUser(patch: Partial<User>): User | null {
  const user = getCurrentUser();
  if (!user) return null;

  const updated: User = { ...user, ...patch };

  // Update session
  localStorage.setItem(SESSION_KEY, JSON.stringify(updated));

  // Update in users store
  const users = getStoredUsers();
  const updatedUsers = users.map((u) => (u.id === user.id ? updated : u));
  saveUsers(updatedUsers);

  return updated;
}

/**
 * getAllUsers
 * Returns all stored users — used by admin dashboard.
 */
export function getAllUsers(): User[] {
  return getStoredUsers();
}

/**
 * updateUserById
 * Updates a specific user by ID — used by admin for vendor approval.
 */
export function updateUserById(userId: string, patch: Partial<User>): void {
  const users = getStoredUsers();
  const updatedUsers = users.map((u) =>
    u.id === userId ? { ...u, ...patch } : u
  );
  saveUsers(updatedUsers);
}

/**
 * requireAuth
 * Returns the current user or null. Use in components to check login state.
 * For page-level protection, use <ProtectedRoute> or <RouteGuard>.
 */
export function requireAuth(): User | null {
  return getCurrentUser();
}

/**
 * requireRole
 * Returns true if the current user has the specified role.
 * For page-level protection, use <ProtectedRoute role="..."> or <RouteGuard requiredRole="...">.
 */
export function requireRole(role: UserRole): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === role;
}

/**
 * validatePasswordStrength
 * Checks if a password meets the strong password requirements.
 * Returns an error message or null if valid.
 */
export function validatePasswordStrength(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return null;
}
