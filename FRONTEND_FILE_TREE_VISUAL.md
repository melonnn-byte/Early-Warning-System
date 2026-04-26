# 🗂️ Frontend File Structure - Visual Tree

```
frontend/
│
├── 📄 ROOT CONFIG FILES
│   ├── package.json                  → Dependencies, scripts, project metadata
│   ├── tsconfig.json                 → TypeScript compiler config
│   ├── next.config.ts                → Next.js configuration
│   ├── middleware.ts                 → Route protection & middleware logic
│   ├── postcss.config.mjs             → PostCSS & Tailwind config
│   ├── eslint.config.mjs             → Code quality & linting rules
│   ├── .env                          → Environment variables (local)
│   ├── .gitignore                    → Git ignore patterns
│   ├── README.md                     → Project documentation
│   └── next-env.d.ts                 → Auto-generated Next.js types
│
├── 📁 public/                        → STATIC ASSETS
│   ├── next.svg
│   ├── vercel.svg
│   ├── globe.svg
│   ├── window.svg
│   └── file.svg
│
└── 📁 src/
    │
    ├── 📁 app/                       → NEXT.JS PAGES & ROUTES
    │   │
    │   ├── 📄 layout.tsx             → Root layout for all pages
    │   ├── 📄 page.tsx               → Landing page (/)
    │   ├── 📄 not-found.tsx          → 404 error page
    │   ├── 📄 globals.css            → Global styles & Tailwind
    │   │
    │   ├── 📁 login/
    │   │   └── 📄 page.tsx           → Login page (/login)
    │   │
    │   ├── 📁 register/
    │   │   └── 📄 page.tsx           → Register page (/register)
    │   │
    │   ├── 📁 dashboard/
    │   │   └── 📄 page.tsx           → Public dashboard (/dashboard)
    │   │
    │   ├── 📁 map/
    │   │   └── 📄 page.tsx           → Public sensor map (/map)
    │   │
    │   ├── 📁 emergency/
    │   │   └── 📄 page.tsx           → Public emergency page (/emergency)
    │   │
    │   ├── 📁 education/
    │   │   └── 📄 page.tsx           → Public education page (/education)
    │   │
    │   ├── 📁 contact/
    │   │   └── 📄 page.tsx           → Contact page (/contact)
    │   │
    │   ├── 📁 user/                  → USER PROTECTED PAGES
    │   │   ├── 📁 dashboard/
    │   │   │   └── 📄 page.tsx       → User dashboard (/user/dashboard)
    │   │   │
    │   │   ├── 📁 map/
    │   │   │   └── 📄 page.tsx       → User map (/user/map)
    │   │   │
    │   │   ├── 📁 notifications/
    │   │   │   ├── 📄 page.tsx       → Notifications list (/user/notifications)
    │   │   │   └── 📁 [notificationId]/
    │   │   │       └── 📄 page.tsx   → Notification detail
    │   │   │
    │   │   ├── 📁 emergency/
    │   │   │   └── 📄 page.tsx       → User emergency center (/user/emergency)
    │   │   │
    │   │   ├── 📁 education/
    │   │   │   └── 📄 page.tsx       → User education (/user/education)
    │   │   │
    │   │   └── 📁 profile/
    │   │       └── 📄 page.tsx       → User profile edit (/user/profile)
    │   │
    │   └── 📁 admin/                 → ADMIN PROTECTED PAGES
    │       ├── 📄 layout.tsx         → Admin layout wrapper
    │       ├── 📄 loading.tsx        → Admin loading state
    │       │
    │       ├── 📁 dashboard/
    │       │   ├── 📄 page.tsx       → Admin dashboard (/admin/dashboard)
    │       │   └── 📄 loading.tsx    → Dashboard loading skeleton
    │       │
    │       ├── 📁 sensors/
    │       │   ├── 📄 page.tsx       → Sensor management (/admin/sensors)
    │       │   └── 📄 loading.tsx    → Sensors loading skeleton
    │       │
    │       ├── 📁 thresholds/
    │       │   ├── 📄 page.tsx       → Threshold config (/admin/thresholds)
    │       │   └── 📄 loading.tsx    → Thresholds loading skeleton
    │       │
    │       ├── 📁 alerts/
    │       │   ├── 📄 page.tsx       → Alert management (/admin/alerts)
    │       │   └── 📄 loading.tsx    → Alerts loading skeleton
    │       │
    │       ├── 📁 notifications/
    │       │   └── 📄 page.tsx       → Notification mgmt (/admin/notifications)
    │       │
    │       ├── 📁 users/
    │       │   ├── 📄 page.tsx       → User management (/admin/users)
    │       │   └── 📄 loading.tsx    → Users loading skeleton
    │       │
    │       └── 📁 reports/
    │           ├── 📄 page.tsx       → Reports & analytics (/admin/reports)
    │           └── 📄 loading.tsx    → Reports loading skeleton
    │
    ├── 📁 components/                → REUSABLE REACT COMPONENTS
    │   │
    │   ├── 📁 ui/                    → UI COMPONENTS (Basic building blocks)
    │   │   ├── 📄 Button.tsx         → Reusable button component
    │   │   ├── 📄 Card.tsx           → Reusable card container
    │   │   ├── 📄 Badge.tsx          → Status badge
    │   │   ├── 📄 Modal.tsx          → Modal dialog
    │   │   ├── 📄 Reveal.tsx         → Reveal animation
    │   │   ├── 📄 StatusIndicator.tsx → Status dot indicator
    │   │   └── 📄 AdminPageSkeleton.tsx → Loading skeleton
    │   │
    │   ├── 📁 layout/                → LAYOUT COMPONENTS
    │   │   ├── 📄 AppShell.tsx       → Main layout wrapper
    │   │   ├── 📄 Navbar.tsx         → Top navigation bar
    │   │   ├── 📄 Sidebar.tsx        → Admin sidebar navigation
    │   │   └── 📄 Footer.tsx         → Footer component
    │   │
    │   ├── 📁 dashboard/             → DASHBOARD COMPONENTS
    │   │   ├── 📄 UserRealtimeDashboard.tsx → Main dashboard
    │   │   ├── 📄 WaterLevelGauge.tsx → Water level gauge
    │   │   ├── 📄 RainfallCard.tsx   → Rainfall info card
    │   │   └── 📄 AlertBanner.tsx    → Alert banner
    │   │
    │   ├── 📁 charts/                → CHART COMPONENTS (Recharts)
    │   │   ├── 📄 WaterLevelChart.tsx → Water level history chart
    │   │   ├── 📄 RainfallChart.tsx  → Rainfall history chart
    │   │   └── 📄 FlowSpeedChart.tsx → Flow speed chart
    │   │
    │   ├── 📁 maps/                  → MAP COMPONENTS (Google Maps)
    │   │   ├── 📄 PublicGoogleSensorMap.tsx → Public map view
    │   │   ├── 📄 AdminGoogleSensorMap.tsx  → Admin map view
    │   │   └── 📄 SensorMap.tsx      → Base map component
    │   │
    │   ├── 📁 landing/               → LANDING PAGE COMPONENTS
    │   │   └── 📄 PublicRealtimeDashboardSection.tsx → Dashboard section
    │   │
    │   ├── 📄 AuthRedirectWrapper.tsx → Landing page redirect wrapper
    │   └── 📄 ProtectedRoute.tsx     → Route protection HOC
    │
    ├── 📁 hooks/                     → CUSTOM REACT HOOKS
    │   ├── 📄 useAuth.ts             → Authentication state management
    │   ├── 📄 useWaterLevel.ts       → Water level data fetching
    │   ├── 📄 useUserNotifications.ts → Notification management
    │   └── 📄 useWebSocket.ts        → WebSocket connection (future)
    │
    ├── 📁 lib/                       → UTILITY FUNCTIONS & LIBRARIES
    │   ├── 📄 api.ts                 → Axios HTTP client + interceptor
    │   ├── 📄 firebase.ts            → Firebase authentication setup
    │   ├── 📄 socket.ts              → WebSocket setup (future)
    │   └── 📄 utils.ts               → Helper functions
    │
    ├── 📁 types/                     → TYPESCRIPT TYPE DEFINITIONS
    │   ├── 📄 user.ts                → AppUser, UserRole types
    │   ├── 📄 sensor.ts              → Sensor type
    │   ├── 📄 water-level.ts         → WaterLevel & LiveWaterLevel types
    │   ├── 📄 alert.ts               → Alert types
    │   └── 📄 user-notification.ts   → UserNotification types
    │
    └── 📁 constants/                 → GLOBAL CONSTANTS & CONFIG
        └── 📄 index.ts               → API_URL, navLinks, mockData, etc

```

---

## 📊 File Organization by Purpose

### 🔐 AUTHENTICATION FILES
```
useAuth.ts                      → Auth state management
api.ts                          → Auto-inject JWT tokens
firebase.ts                     → Google OAuth setup
login/page.tsx                  → Login page
register/page.tsx               → Register page
ProtectedRoute.tsx              → Route protection
AuthRedirectWrapper.tsx         → Auto-redirect on login
middleware.ts                   → Server-side route protection
```

### 📊 DATA MANAGEMENT
```
useWaterLevel.ts                → Water level state
useUserNotifications.ts         → Notification state
useWebSocket.ts                 → Real-time data (future)
constants/index.ts              → Mock data
```

### 🎨 UI & LAYOUT
```
components/ui/*.tsx             → Button, Card, Badge, Modal, etc
components/layout/*.tsx         → AppShell, Navbar, Sidebar, Footer
components/dashboard/*.tsx      → Dashboard-specific components
components/charts/*.tsx         → Recharts visualizations
components/maps/*.tsx           → Google Maps integrations
```

### 📄 PAGES
```
app/page.tsx                    → Landing page
app/login/page.tsx              → Login
app/register/page.tsx           → Register
app/user/*.tsx                  → User protected pages
app/admin/*.tsx                 → Admin protected pages
app/dashboard/*.tsx             → Public pages
```

### ⚙️ UTILITIES & CONFIG
```
lib/api.ts                      → HTTP client
lib/firebase.ts                 → Firebase config
lib/utils.ts                    → Helper functions
types/*.ts                      → TypeScript types
constants/index.ts              → Global constants
```

---

## 🔄 File Dependencies Flow

```
ENTRY POINTS
↓
app/layout.tsx (RootLayout)
├─ AppShell.tsx
│  ├─ Navbar.tsx
│  ├─ Sidebar.tsx (for admin)
│  └─ Footer.tsx
│
├─ useAuth.ts (for auth state)
│  └─ api.ts (HTTP requests)
│     └─ constants/index.ts (API_URL)
│        └─ firebase.ts (OAuth)
│
├─ ProtectedRoute.tsx (for protected pages)
│  └─ useAuth.ts
│
└─ AuthRedirectWrapper.tsx (for landing page)
   └─ useAuth.ts

DASHBOARD PAGES
↓
useWaterLevel.ts (data)
├─ constants/index.ts (mockSensors)
├─ useUserNotifications.ts (triggers)
├─ components/dashboard/*.tsx (render)
├─ components/charts/*.tsx (visualize)
└─ lib/utils.ts (calculate status)

NOTIFICATION SYSTEM
↓
useUserNotifications.ts
├─ useWaterLevel.ts (detect changes)
├─ lib/utils.ts (calculate risk level)
└─ localStorage (persist)

MAP COMPONENTS
↓
components/maps/PublicGoogleSensorMap.tsx
├─ useWaterLevel.ts (data)
├─ constants/index.ts (mockSensors)
└─ types/sensor.ts (types)
```

---

## 📈 Statistics

| Metric | Count |
|--------|-------|
| **Total TypeScript Files** | ~28 |
| **Total TSX (React Components)** | ~36 |
| **Total Pages** | 24 |
| **Total Components** | 19 |
| **Custom Hooks** | 4 |
| **Type Definition Files** | 5 |
| **Configuration Files** | 7 |
| **Static Assets** | 5 |
| **Total Lines of Code** | ~8,000+ |

---

## 🎯 Quick File Lookup Guide

**"Where do I find...?"**

- **Authentication logic?** → `src/hooks/useAuth.ts`
- **API configuration?** → `src/lib/api.ts`
- **Water level data?** → `src/hooks/useWaterLevel.ts`
- **Notifications?** → `src/hooks/useUserNotifications.ts`
- **UI Components?** → `src/components/ui/`
- **Layout setup?** → `src/components/layout/`
- **Type definitions?** → `src/types/`
- **Global constants?** → `src/constants/index.ts`
- **Route protection?** → `src/components/ProtectedRoute.tsx`
- **Landing page?** → `src/app/page.tsx`
- **Admin dashboard?** → `src/app/admin/dashboard/page.tsx`
- **User dashboard?** → `src/app/user/dashboard/page.tsx`
- **Project config?** → Root directory (package.json, tsconfig.json, etc)

---

**Generated:** 26 April 2026  
**Version:** 1.0
