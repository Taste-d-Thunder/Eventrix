# EventSpace — Complete Folder Structure

## Drop-in Updates
Copy each folder/file into your existing Next.js project root.
Existing landing page sections (HeroSection, etc.) are NOT modified.

```
eventspace/
│
├── middleware.ts                    ← NEW: Edge middleware for route protection
│
├── types/
│   └── auth.ts                      ← NEW: User, UserRole, LoginCredentials types
│
├── lib/
│   ├── auth.ts                      ← NEW: loginUser, logoutUser, getCurrentUser, registerUser
│   └── utils.ts                     ← NEW: cn(), formatPrice(), generateId()
│
├── hooks/
│   └── useAuth.ts                   ← NEW: React hook for reactive auth state
│
├── components/
│   ├── layout/
│   │   └── Navbar.tsx               ← REPLACED: 3-zone layout, routing, auth-aware
│   ├── auth/
│   │   └── RouteGuard.tsx           ← NEW: Client-side route protection wrapper
│   ├── dashboard/
│   │   └── DashboardLayout.tsx      ← NEW: Reusable sidebar+topbar for all dashboards
│   └── ui/
│       └── FormInput.tsx            ← NEW: Reusable FormInput + RoleSelector
│
└── app/
    ├── login/
    │   └── page.tsx                  ← NEW: Login with role selector + demo creds
    ├── register/
    │   └── page.tsx                  ← NEW: Customer/Vendor registration
    ├── dashboard/
    │   └── page.tsx                  ← NEW: Customer dashboard
    ├── admin/
    │   └── dashboard/
    │       └── page.tsx              ← NEW: Admin dashboard (vendor approvals, stats)
    └── vendor/
        ├── register/
        │   └── page.tsx              ← NEW: Dedicated vendor registration
        └── dashboard/
            └── page.tsx              ← NEW: Vendor dashboard (bookings, services)
```

## Demo Accounts

| Role     | Email                   | Password     | Redirect              |
|----------|-------------------------|--------------|-----------------------|
| Customer | user@eventspace.in      | password123  | /dashboard            |
| Vendor   | vendor@eventspace.in    | password123  | /vendor/dashboard     |
| Admin    | admin@eventspace.in     | password123  | /admin/dashboard      |

## Route Map

| Route               | Access         | Component              |
|---------------------|----------------|------------------------|
| /                   | Public         | Landing page           |
| /vendors            | Public         | Vendor listing         |
| /packages           | Public         | Packages page          |
| /login              | Public         | Login page             |
| /register           | Public         | Customer registration  |
| /vendor/register    | Public         | Vendor registration    |
| /dashboard          | customer only  | Customer dashboard     |
| /vendor/dashboard   | vendor only    | Vendor dashboard       |
| /admin/dashboard    | admin only     | Admin dashboard        |

## Key Technical Notes

### Auth Flow
1. User fills login form → loginUser() validates against localStorage store
2. Session stored in localStorage + cookie (for middleware)
3. Middleware reads cookie to protect server-rendered routes
4. RouteGuard provides client-side fallback protection
5. useAuth() hook provides reactive user state to all components

### Adding Real Backend
Replace these functions in lib/auth.ts:
- loginUser() → POST /api/auth/login (returns JWT)
- registerUser() → POST /api/auth/register
- getCurrentUser() → read JWT from HttpOnly cookie
- logoutUser() → POST /api/auth/logout (clear cookie)

Then remove localStorage logic and use cookies exclusively.
