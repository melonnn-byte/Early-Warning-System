# 📂 Frontend File Structure & Documentation

**Proyek:** Early Warning System (EWS) - Flood Guard  
**Frontend:** Next.js 14 + React + TypeScript  
**Tanggal:** 26 April 2026

---

## 🏗️ Struktur Folder Utama

```
frontend/
├── public/                    # Static assets (images, icons)
├── src/
│   ├── app/                  # Next.js App Router pages
│   ├── components/           # Reusable React components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions & libraries
│   ├── types/                # TypeScript interfaces & types
│   └── constants/            # Constants & configurations
├── middleware.ts             # Server-side route middleware
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies & scripts
├── postcss.config.mjs         # Tailwind CSS configuration
└── eslint.config.mjs         # ESLint rules
```

---

# 📋 Detail Setiap File

## 🔧 ROOT LEVEL FILES

### 1. `package.json`
**Lokasi:** `/frontend/package.json`  
**Fungsi:** Mendefinisikan dependencies, devDependencies, dan scripts project  
**Isi Utama:**
- React, Next.js, TypeScript
- Axios untuk HTTP requests
- Firebase untuk authentication
- Tailwind CSS untuk styling
- Scripts: `npm run dev`, `npm run build`, `npm run lint`

### 2. `tsconfig.json`
**Lokasi:** `/frontend/tsconfig.json`  
**Fungsi:** Konfigurasi TypeScript compiler  
**Isi Utama:**
- Target: ES2020
- Module resolution: bundler
- Path alias: `@/*` → `./src/*`
- Strict mode enabled

### 3. `next.config.ts`
**Lokasi:** `/frontend/next.config.ts`  
**Fungsi:** Konfigurasi Next.js  
**Isi Utama:**
- React strict mode enabled
- Image optimization config
- Remote pattern untuk external images

### 4. `middleware.ts`
**Lokasi:** `/frontend/middleware.ts`  
**Fungsi:** Server-side route protection & middleware  
**Apa yang dikerjakan:**
- Check authentication tokens
- Protect routes yang memerlukan login
- Redirect unauthenticated users ke `/login`
- Allow public routes

### 5. `postcss.config.mjs`
**Lokasi:** `/frontend/postcss.config.mjs`  
**Fungsi:** PostCSS configuration untuk Tailwind CSS  
**Isi:** Tailwind CSS plugin

### 6. `eslint.config.mjs`
**Lokasi:** `/frontend/eslint.config.mjs`  
**Fungsi:** ESLint configuration untuk code quality  
**Rule:** Next.js recommended rules + TypeScript support

### 7. `.env`
**Lokasi:** `/frontend/.env`  
**Fungsi:** Environment variables (local)  
**Contoh:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
```

### 8. `.gitignore`
**Lokasi:** `/frontend/.gitignore`  
**Fungsi:** Git ignore rules  
**Isi:** node_modules, .next, .env.local, etc

### 9. `README.md`
**Lokasi:** `/frontend/README.md`  
**Fungsi:** Project documentation

### 10. `next-env.d.ts`
**Lokasi:** `/frontend/next-env.d.ts`  
**Fungsi:** Auto-generated Next.js type definitions

---

## 📁 FOLDER: `src/app` (Next.js Pages)

Struktur page routes mengikuti folder structure.

### ROOT PAGES

#### `src/app/layout.tsx`
**Fungsi:** Root layout untuk semua pages  
**Exports:** RootLayout component
**Isi:**
- Metadata configuration
- HTML setup (lang, font)
- AppShell wrapper

#### `src/app/page.tsx`
**Fungsi:** Landing page (`/`)  
**Fitur:**
- Public landing page
- Status legend info
- Emergency contacts
- FAQ section
- AuthRedirectWrapper (auto-redirect jika sudah login)

#### `src/app/not-found.tsx`
**Fungsi:** Custom 404 page  
**Exports:** NotFound component

#### `src/app/globals.css`
**Fungsi:** Global CSS styles  
**Isi:** Tailwind directives, global styles

### PUBLIC PAGES (Accessible tanpa login)

#### `src/app/login/page.tsx`
**Path:** `/login`  
**Fungsi:** User login page  
**Fitur:**
- Email/password login
- Google OAuth login
- Quick test buttons (Admin/User)
- Redirect ke dashboard sesuai role

#### `src/app/register/page.tsx`
**Path:** `/register`  
**Fungsi:** User registration page  
**Fitur:**
- Form register dengan validasi
- Auto-login setelah register
- Auto-redirect ke dashboard

#### `src/app/dashboard/page.tsx`
**Path:** `/dashboard`  
**Fungsi:** Public real-time dashboard  
**Fitur:**
- Real-time water level monitoring
- Sensor status overview
- Accessible tanpa login

#### `src/app/map/page.tsx`
**Path:** `/map`  
**Fungsi:** Public sensor map  
**Fitur:**
- Google Maps visualization
- Sensor markers with color-coding
- Filter & search sensors

#### `src/app/emergency/page.tsx`
**Path:** `/emergency`  
**Fungsi:** Public emergency contacts page  
**Fitur:**
- Emergency contact list
- Call guidance
- Quick action buttons

#### `src/app/education/page.tsx`
**Path:** `/education`  
**Fungsi:** Public education & guidance page  
**Fitur:**
- Status level explanation
- 3-phase planning
- Emergency checklist
- Do & Don't evacuation guide
- FAQ

#### `src/app/contact/page.tsx`
**Path:** `/contact`  
**Fungsi:** Contact information page

---

### USER PAGES (Protected, requires login with role "operator")

#### `src/app/user/dashboard/page.tsx`
**Path:** `/user/dashboard`  
**Fungsi:** User real-time dashboard  
**Fitur:**
- Real-time water level monitoring
- Sensor status cards
- Charts (water level, rainfall, flow)
- Last update timestamp

#### `src/app/user/map/page.tsx`
**Path:** `/user/map`  
**Fungsi:** User sensor map view  
**Fitur:**
- Google Maps with sensor markers
- Status filter (All, Safe, Alert, Danger)
- Search & sort functionality
- Sensor detail panel

#### `src/app/user/notifications/page.tsx`
**Path:** `/user/notifications`  
**Fungsi:** User notifications list page  
**Fitur:**
- List all alert notifications
- Mark as read / unread
- Filter by status
- Notification count

#### `src/app/user/notifications/[notificationId]/page.tsx`
**Path:** `/user/notifications/:notificationId`  
**Fungsi:** Notification detail page  
**Fitur:**
- Show detailed notification info
- Link to related sensor
- Guidance link based on risk level

#### `src/app/user/emergency/page.tsx`
**Path:** `/user/emergency`  
**Fungsi:** User emergency center  
**Fitur:**
- Emergency contact list
- Call checklist
- Quick action navigation
- Emergency guidance

#### `src/app/user/education/page.tsx`
**Path:** `/user/education`  
**Fungsi:** User education page  
**Fitur:**
- Status level guide
- 3-phase planning for users
- Emergency kit checklist
- Evacuation do & don't
- FAQ

#### `src/app/user/profile/page.tsx`
**Path:** `/user/profile`  
**Fungsi:** User profile edit page  
**Fitur:**
- Edit nama, email, WhatsApp
- Form validation
- Success message

---

### ADMIN PAGES (Protected, requires login with role "admin")

#### `src/app/admin/layout.tsx`
**Fungsi:** Admin layout wrapper  
**Isi:**
- ProtectedRoute with role="admin"
- Sidebar navigation
- Admin header

#### `src/app/admin/dashboard/page.tsx`
**Path:** `/admin/dashboard`  
**Fungsi:** Admin main dashboard  
**Fitur:**
- System overview
- Sensor statistics
- Alert summary
- User activity

#### `src/app/admin/dashboard/loading.tsx`
**Fungsi:** Loading skeleton untuk admin dashboard

#### `src/app/admin/sensors/page.tsx`
**Path:** `/admin/sensors`  
**Fungsi:** Sensor management page  
**Fitur:**
- List all sensors
- Add/Edit/Delete sensor
- Sensor status & battery monitoring
- Connectivity check

#### `src/app/admin/sensors/loading.tsx`
**Fungsi:** Loading skeleton untuk sensors page

#### `src/app/admin/thresholds/page.tsx`
**Path:** `/admin/thresholds`  
**Fungsi:** Water level threshold configuration  
**Fitur:**
- Set normal/warning/danger thresholds
- View current threshold values
- Update thresholds

#### `src/app/admin/thresholds/loading.tsx`
**Fungsi:** Loading skeleton untuk thresholds page

#### `src/app/admin/alerts/page.tsx`
**Path:** `/admin/alerts`  
**Fungsi:** Alert management page  
**Fitur:**
- List active alerts
- Alert history
- Create/Edit/Delete alerts
- Send broadcast alerts

#### `src/app/admin/alerts/loading.tsx`
**Fungsi:** Loading skeleton untuk alerts page

#### `src/app/admin/notifications/page.tsx`
**Path:** `/admin/notifications`  
**Fungsi:** Notification management  
**Fitur:**
- Manage push notifications
- View notification history
- Test send notifications

#### `src/app/admin/users/page.tsx`
**Path:** `/admin/users`  
**Fungsi:** User management page  
**Fitur:**
- List all users
- User roles & permissions
- Activate/Deactivate users
- Add new admin users

#### `src/app/admin/users/loading.tsx`
**Fungsi:** Loading skeleton untuk users page

#### `src/app/admin/reports/page.tsx`
**Path:** `/admin/reports`  
**Fungsi:** Reports & analytics page  
**Fitur:**
- Water level trends
- Alert statistics
- User activity reports
- Export data

#### `src/app/admin/reports/loading.tsx`
**Fungsi:** Loading skeleton untuk reports page

---

## 📦 FOLDER: `src/components` (Reusable Components)

### UI COMPONENTS (`src/components/ui/`)

#### `Button.tsx`
**Fungsi:** Reusable button component  
**Props:** variant, size, disabled, onClick, children

#### `Card.tsx`
**Fungsi:** Reusable card container  
**Props:** className, children

#### `Badge.tsx`
**Fungsi:** Status badge component  
**Props:** variant (success, warning, danger), children

#### `Modal.tsx`
**Fungsi:** Modal dialog component  
**Props:** isOpen, onClose, title, children

#### `Reveal.tsx`
**Fungsi:** Reveal animation component  
**Props:** delayMs, children

#### `StatusIndicator.tsx`
**Fungsi:** Status indicator (dot) component  
**Props:** status (safe, alert, danger), size

#### `AdminPageSkeleton.tsx`
**Fungsi:** Loading skeleton untuk admin pages

---

### LAYOUT COMPONENTS (`src/components/layout/`)

#### `AppShell.tsx`
**Fungsi:** Main layout wrapper  
**Isi:**
- Navbar
- Main content
- Footer (conditional)
- Hide chrome untuk login/register/admin routes

#### `Navbar.tsx`
**Fungsi:** Top navigation bar  
**Fitur:**
- Logo
- Navigation links
- User menu / Login button
- Mobile responsive

#### `Sidebar.tsx`
**Fungsi:** Admin sidebar navigation  
**Fitur:**
- Menu items
- Active route highlighting
- Collapse/expand toggle

#### `Footer.tsx`
**Fungsi:** Footer component  
**Isi:**
- Contact info
- Quick links
- Copyright

---

### DASHBOARD COMPONENTS (`src/components/dashboard/`)

#### `UserRealtimeDashboard.tsx`
**Fungsi:** Main user dashboard component  
**Props:** roleLabel, headline, subtitle  
**Fitur:**
- Real-time water level display
- Sensor status cards
- Summary statistics

#### `WaterLevelGauge.tsx`
**Fungsi:** Water level gauge/meter visualization  
**Props:** level, status

#### `RainfallCard.tsx`
**Fungsi:** Rainfall information card  
**Props:** rainfall, unit

#### `AlertBanner.tsx`
**Fungsi:** Alert notification banner  
**Props:** alert, onClose

---

### CHART COMPONENTS (`src/components/charts/`)

#### `WaterLevelChart.tsx`
**Fungsi:** Water level history chart  
**Props:** data, timeRange  
**Library:** Recharts

#### `RainfallChart.tsx`
**Fungsi:** Rainfall history chart  
**Props:** data, timeRange

#### `FlowSpeedChart.tsx`
**Fungsi:** Flow speed history chart  
**Props:** data, timeRange

---

### MAP COMPONENTS (`src/components/maps/`)

#### `PublicGoogleSensorMap.tsx`
**Fungsi:** Public sensor map view  
**Fitur:**
- Google Maps integration
- Sensor markers
- Info windows
- Search & filter

#### `AdminGoogleSensorMap.tsx`
**Fungsi:** Admin sensor map view  
**Fitur:**
- Sensor management on map
- Add/Edit/Delete sensors
- Sensor properties

#### `SensorMap.tsx`
**Fungsi:** Base sensor map component (if shared)

---

### LANDING COMPONENTS (`src/components/landing/`)

#### `PublicRealtimeDashboardSection.tsx`
**Fungsi:** Dashboard section di landing page  
**Props:** data, title

---

### CORE COMPONENTS

#### `AuthRedirectWrapper.tsx`
**Lokasi:** `src/components/AuthRedirectWrapper.tsx`  
**Fungsi:** Wrapper untuk landing page  
**Fitur:**
- Auto-redirect jika user sudah login
- Determine role & redirect path

#### `ProtectedRoute.tsx`
**Lokasi:** `src/components/ProtectedRoute.tsx`  
**Fungsi:** Route protection component  
**Props:** children, requiredRole  
**Fitur:**
- Check authentication
- Check role authorization
- Auto-redirect jika unauthorized
- Show loading state

---

## 🎣 FOLDER: `src/hooks` (Custom React Hooks)

#### `useAuth.ts`
**Fungsi:** Authentication state management  
**Exports:**
- `useAuth()` hook
**Returns:**
```typescript
{
  user: AppUser | null
  loading: boolean
  isAuthenticated: boolean
  login(email, password)
  loginWithGoogle()
  logout()
  updateProfile(payload)
}
```
**Fitur:**
- JWT token management
- Firebase Google OAuth
- localStorage persistence
- Auto-login on page load

#### `useWaterLevel.ts`
**Fungsi:** Water level data management  
**Exports:**
- `useWaterLevel(options)` hook
**Returns:**
```typescript
{
  latest: LiveWaterLevel
  history: WaterLevelPoint[]
  sensorsSnapshot: Sensor[]
  liveBySensor: LiveWaterLevel[]
}
```
**Fitur:**
- Mock data simulation (7s interval)
- Auto-calculate status from level
- History tracking (7 days)

#### `useUserNotifications.ts`
**Fungsi:** User notification management  
**Exports:**
- `useUserNotifications(liveBySensor)` hook
**Returns:**
```typescript
{
  notifications: UserNotificationItem[]
  unreadCount: number
  markAsRead(id)
  markAllAsRead()
}
```
**Fitur:**
- Auto-generate notifications
- localStorage persistence
- Track sensor risk state
- Mark read/unread

#### `useWebSocket.ts`
**Fungsi:** WebSocket connection (not fully used)  
**Exports:**
- `useWebSocket()` hook
**Fitur:**
- Real-time data streaming (future)
- Connection management

---

## 📚 FOLDER: `src/lib` (Utilities & Libraries)

#### `api.ts`
**Fungsi:** Axios HTTP client configuration  
**Fitur:**
- Base URL configuration
- Request interceptor (auto-inject JWT token)
- Response interceptor (error handling)
- 401 Unauthorized handling
- 10 second timeout

#### `firebase.ts`
**Fungsi:** Firebase authentication setup  
**Exports:**
- `auth` - Firebase auth instance
- `googleProvider` - Google provider
- Firebase app initialization

#### `socket.ts`
**Fungsi:** WebSocket configuration (not fully used)

#### `utils.ts`
**Fungsi:** Utility functions  
**Functions:**
- `getStatusFromLevel(levelCm)` - Determine status from water level
- `getRiskLevelFromLevel(levelCm)` - Determine risk level (yellow/orange/red)
- `formatTimestamp(iso)` - Format ISO timestamp to readable
- `cn()` - Combine classnames (Tailwind utilities)

---

## 🏷️ FOLDER: `src/types` (TypeScript Type Definitions)

#### `user.ts`
**Exports:**
```typescript
type UserRole = "admin" | "operator"

interface AppUser {
  id: string
  name: string
  email: string
  whatsappNumber?: string
  role: UserRole
}
```

#### `sensor.ts`
**Exports:**
```typescript
type SensorConnectivity = "online" | "offline"

interface Sensor {
  id: string
  name: string
  riverName: string
  latitude: number
  longitude: number
  connectivity: SensorConnectivity
  batteryPercent: number
  lastLevelCm: number
  status: WaterStatus
  updatedAt: string
}
```

#### `water-level.ts`
**Exports:**
```typescript
type WaterStatus = "safe" | "alert" | "danger"

interface WaterLevelPoint {
  timestamp: string
  levelCm: number
  rainfallMm: number
  flowSpeedMs?: number
  sensorId: string
}

interface LiveWaterLevel {
  sensorId: string
  sensorName: string
  levelCm: number
  rainfallMm: number
  status: WaterStatus
  updatedAt: string
}

interface ThresholdConfig {
  safeMaxCm: number
  alertMaxCm: number
  dangerMinCm: number
}
```

#### `alert.ts`
**Exports:**
```typescript
interface AlertMessage {
  id: string
  title: string
  message: string
  status: "alert" | "warning" | "danger"
  channels: string[]
  sentAt: string
}
```

#### `user-notification.ts`
**Exports:**
```typescript
type UserRiskLevel = "normal" | "yellow" | "orange" | "red"

interface UserNotificationItem {
  id: string
  sensorId: string
  sensorName: string
  levelCm: number
  riskLevel: Exclude<UserRiskLevel, "normal">
  title: string
  message: string
  createdAt: string
  isRead: boolean
  guideHref: string
}
```

---

## ⚙️ FOLDER: `src/constants`

#### `constants/index.ts`
**Exports:**
```typescript
API_URL              // Backend API base URL
WS_URL               // WebSocket URL
statusColor          // Color mapping for status
publicNavLinks       // Navigation links
adminNavLinks        // Admin navigation links
emergencyContacts    // Emergency contact list
mockSensors          // Mock sensor data (3 sensors)
mockAlertHistory     // Mock alert history
```

---

## 📁 FOLDER: `public` (Static Assets)

#### Image files
- `next.svg` - Next.js logo
- `vercel.svg` - Vercel logo
- `globe.svg` - Globe icon
- `window.svg` - Window icon
- `file.svg` - File icon

---

## 🎯 File Purpose Summary Table

| Category | File | Purpose | Import |
|----------|------|---------|--------|
| **Config** | `package.json` | Dependencies | N/A |
| | `tsconfig.json` | TS config | N/A |
| | `next.config.ts` | Next.js config | N/A |
| | `middleware.ts` | Route protection | N/A |
| **Pages** | `app/page.tsx` | Landing page | `/` |
| | `app/login/page.tsx` | Login page | `/login` |
| | `app/register/page.tsx` | Register page | `/register` |
| | `app/dashboard/page.tsx` | Public dashboard | `/dashboard` |
| | `app/user/dashboard/page.tsx` | User dashboard | `/user/dashboard` |
| | `app/admin/dashboard/page.tsx` | Admin dashboard | `/admin/dashboard` |
| **Components** | `components/ui/*.tsx` | UI components | Reusable |
| | `components/layout/*.tsx` | Layout components | App structure |
| | `components/dashboard/*.tsx` | Dashboard components | Dashboard |
| | `components/charts/*.tsx` | Chart components | Visualization |
| | `components/maps/*.tsx` | Map components | Geospatial |
| **Hooks** | `hooks/useAuth.ts` | Auth state | Auth management |
| | `hooks/useWaterLevel.ts` | Water data | Data fetching |
| | `hooks/useUserNotifications.ts` | Notifications | Notification mgmt |
| **Utilities** | `lib/api.ts` | HTTP client | API calls |
| | `lib/firebase.ts` | Firebase setup | Authentication |
| | `lib/utils.ts` | Helpers | Utility functions |
| **Types** | `types/*.ts` | TypeScript types | Type definitions |
| **Constants** | `constants/index.ts` | App constants | Global values |

---

## 🔄 Data Flow Between Files

```
app/page.tsx (Landing)
  ├─ AuthRedirectWrapper
  │  └─ useAuth() → check user & redirect
  └─ PublicRealtimeDashboardSection
     └─ useWaterLevel() → fetch water data

app/login/page.tsx
  └─ useAuth().login() 
     └─ api.post("/auth/login")
        └─ lib/api.ts → Axios interceptor
           └─ localStorage (tokens)

app/user/dashboard/page.tsx
  ├─ ProtectedRoute (role=operator)
  └─ UserRealtimeDashboard
     ├─ useWaterLevel()
     ├─ WaterLevelChart, RainfallCard
     └─ SensorStatusCard

app/user/notifications/page.tsx
  ├─ ProtectedRoute
  └─ useUserNotifications()
     ├─ useWaterLevel() → detect changes
     ├─ localStorage → persist notifications
     └─ UI render notification list

app/admin/sensors/page.tsx
  ├─ ProtectedRoute (role=admin)
  └─ AdminSensorsPage
     ├─ useAuth()
     ├─ api.get("/sensors")
     └─ admin UI components
```

---

## 📊 Component Hierarchy

```
RootLayout (layout.tsx)
├─ AppShell (layout/AppShell.tsx)
│  ├─ Navbar (layout/Navbar.tsx)
│  ├─ Main Content
│  │  ├─ Public pages (no auth)
│  │  ├─ User pages (protected)
│  │  └─ Admin pages (protected + role check)
│  └─ Footer (layout/Footer.tsx)
│
└─ Special Routes
   ├─ /login (no layout)
   ├─ /register (no layout)
   └─ /admin/* (custom layout)
```

---

## 🚀 File Dependencies & Imports

```
api.ts (core)
  ↓ Used by
  ├─ useAuth.ts
  ├─ Pages (direct API calls)
  └─ Components

useAuth.ts
  ↓ Used by
  ├─ ProtectedRoute.tsx
  ├─ AuthRedirectWrapper.tsx
  ├─ Login/Register pages
  └─ Profile page

useWaterLevel.ts
  ↓ Used by
  ├─ Dashboard pages
  ├─ Chart components
  ├─ Map components
  └─ useUserNotifications.ts

useUserNotifications.ts
  ↓ Used by
  ├─ Notifications page
  ├─ Notification detail page
  └─ Alert banner

firebase.ts
  ↓ Used by
  ├─ useAuth.ts
  └─ Login page (Google OAuth)

utils.ts
  ↓ Used by
  ├─ Many components (cn classname)
  ├─ useWaterLevel.ts (status calculation)
  └─ useUserNotifications.ts (risk level)

types/*.ts
  ↓ Used by
  ├─ All components
  ├─ All hooks
  └─ useAuth, useWaterLevel, etc

constants/index.ts
  ↓ Used by
  ├─ api.ts (API_URL, WS_URL)
  ├─ Navbar (navLinks)
  ├─ Pages (navLinks, emergencyContacts)
  └─ useWaterLevel.ts (mockSensors)
```

---

## ✅ Complete File Count

| Category | Count |
|----------|-------|
| **Pages (.tsx)** | 24 |
| **Components (.tsx)** | 19 |
| **Hooks (.ts)** | 4 |
| **Library Files (.ts)** | 4 |
| **Type Files (.ts)** | 5 |
| **Constants** | 1 |
| **Config Files** | 7 |
| **Total** | ~64 files |

---

**Generated:** 26 April 2026  
**Version:** 1.0  
**Status:** ✅ Complete
