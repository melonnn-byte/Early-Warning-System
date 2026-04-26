# 📦 Frontend User Features: Teknologi & Dependencies

## 🏗️ Frontend Architecture

```
frontend/src/
├── app/
│   ├── layout.tsx              # Root layout dengan AppShell
│   ├── page.tsx                # Landing page
│   ├── login/
│   ├── register/
│   ├── dashboard/              # Public dashboard
│   ├── map/                    # Public map
│   ├── emergency/              # Public emergency
│   ├── education/              # Public education
│   └── user/                   # User protected routes
│       ├── dashboard/          # Dashboard user
│       ├── map/                # Map user
│       ├── notifications/      # Notifications
│       ├── emergency/          # Emergency user
│       ├── education/          # Education user
│       └── profile/            # Profile user
│
├── components/
│   ├── dashboard/
│   │   ├── UserRealtimeDashboard.tsx
│   │   ├── PublicRealtimeDashboard.tsx
│   │   ├── ChartWaterLevel.tsx
│   │   └── SensorStatusCard.tsx
│   │
│   ├── maps/
│   │   ├── PublicGoogleSensorMap.tsx
│   │   ├── SensorMarker.tsx
│   │   └── SensorInfoWindow.tsx
│   │
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   │
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   │
│   └── landing/
│       ├── PublicRealtimeDashboardSection.tsx
│       └── ...
│
├── hooks/
│   ├── useAuth.ts              # Authentication management
│   ├── useWaterLevel.ts        # Water level simulation/fetching
│   ├── useUserNotifications.ts # Notification management
│   └── useWebSocket.ts         # WebSocket (not fully used)
│
├── lib/
│   ├── api.ts                  # Axios instance + interceptors
│   ├── firebase.ts             # Firebase configuration
│   ├── socket.ts               # WebSocket handler
│   ├── utils.ts                # Utility functions
│   └── constants/
│
├── types/
│   ├── user.ts                 # AppUser, UserRole
│   ├── sensor.ts               # Sensor interface
│   ├── water-level.ts          # WaterLevel interfaces
│   ├── alert.ts                # Alert interfaces
│   ├── user-notification.ts    # Notification interfaces
│   └── ...
│
└── constants/
    └── index.ts                # API_URL, emergencyContacts, mockSensors
```

---

## 🎯 Key Components & Their Dependencies

### Authentication Flow
```typescript
// src/hooks/useAuth.ts
┌─────────────────────────────────────┐
│ useAuth Hook                        │
├─────────────────────────────────────┤
│ Uses:                               │
│  • Firebase Auth (Google OAuth)     │
│  • API (axios instance)             │
│  • localStorage                     │
│                                     │
│ Provides:                           │
│  • user: AppUser | null             │
│  • login(email, password)           │
│  • loginWithGoogle()                │
│  • logout()                         │
│  • updateProfile()                  │
│  • isAuthenticated: boolean         │
└─────────────────────────────────────┘
```

**API Calls Made:**
```
POST /auth/login
POST /auth/google-login
POST /auth/logout
```

---

### Water Level Management
```typescript
// src/hooks/useWaterLevel.ts
┌─────────────────────────────────────┐
│ useWaterLevel Hook                  │
├─────────────────────────────────────┤
│ Uses:                               │
│  • mockSensors (constants)          │
│  • Math functions (sin/cos)         │
│  • React State (useState)           │
│  • React Effect (useEffect)         │
│                                     │
│ Provides:                           │
│  • latest: LiveWaterLevel           │
│  • history: WaterLevelPoint[]       │
│  • sensorsSnapshot: Sensor[]        │
│  • liveBySensor: LiveWaterLevel[]   │
│                                     │
│ Features:                           │
│  • Auto-simulate every 7s           │
│  • Wave pattern generation          │
│  • Status calculation               │
└─────────────────────────────────────┘
```

**Data Source:** Mock (no API calls yet)  
**Update Frequency:** 7000ms

---

### Notification System
```typescript
// src/hooks/useUserNotifications.ts
┌─────────────────────────────────────┐
│ useUserNotifications Hook           │
├─────────────────────────────────────┤
│ Uses:                               │
│  • useReducer (notification state)  │
│  • localStorage                     │
│  • useWaterLevel (level changes)    │
│                                     │
│ Provides:                           │
│  • notifications: UserNotificationItem[]
│  • unreadCount: number              │
│  • markAsRead(id)                   │
│  • markAllAsRead()                  │
│                                     │
│ Logic:                              │
│  1. Monitor level changes           │
│  2. Compare with previous state     │
│  3. Generate if status changed      │
│  4. Store in localStorage           │
│  5. Persist max 100 items           │
└─────────────────────────────────────┘
```

**Storage Key:** `ews_user_notifications`  
**Additional State:** `ews_user_sensor_risk_state` (tracks level per sensor)

---

## 🔐 Authentication & Token Management

### Token Storage Structure
```typescript
// localStorage keys
ews_access_token      // JWT access token (used for API calls)
ews_refresh_token     // Refresh token (for token renewal)
ews_user_data         // Stringified AppUser object
```

### Request Interceptor
```typescript
// src/lib/api.ts - Request Interceptor
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('ews_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

### Response Interceptor
```typescript
// src/lib/api.ts - Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Handle unauthorized (token expired)
      // Option: redirect to login or refresh token
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 Data Type Definitions

### User Types
```typescript
// src/types/user.ts
export type UserRole = "admin" | "operator";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  whatsappNumber?: string;
  role: UserRole;
}
```

### Water Level Types
```typescript
// src/types/water-level.ts
export type WaterStatus = "safe" | "alert" | "danger";

export interface WaterLevelPoint {
  timestamp: string;
  levelCm: number;
  rainfallMm: number;
  flowSpeedMs?: number;
  sensorId: string;
}

export interface LiveWaterLevel {
  sensorId: string;
  sensorName: string;
  levelCm: number;
  rainfallMm: number;
  status: WaterStatus;
  updatedAt: string;
}
```

### Sensor Types
```typescript
// src/types/sensor.ts
export type SensorConnectivity = "online" | "offline";

export interface Sensor {
  id: string;
  name: string;
  riverName: string;
  latitude: number;
  longitude: number;
  connectivity: SensorConnectivity;
  batteryPercent: number;
  lastLevelCm: number;
  status: WaterStatus;
  updatedAt: string;
}
```

### Notification Types
```typescript
// src/types/user-notification.ts
export type UserRiskLevel = "normal" | "yellow" | "orange" | "red";

export interface UserNotificationItem {
  id: string;
  sensorId: string;
  sensorName: string;
  levelCm: number;
  riskLevel: Exclude<UserRiskLevel, "normal">;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  guideHref: string;
}
```

---

## 🎨 UI Component Hierarchy

### UserRealtimeDashboard Component
```
UserRealtimeDashboard
├── Header Section
│   ├── Title & Subtitle
│   └── Role Label
│
├── Summary Cards
│   ├── Total Sensors
│   ├── Danger Count
│   ├── Alert Count
│   ├── Normal Count
│   └── Online Count
│
├── Main Sensor Display
│   ├── Selected Sensor Info
│   ├── Water Level Chart
│   ├── Rainfall Chart
│   ├── Flow Speed Chart
│   └── Last Update Time
│
└── Sensor List
    └── SensorStatusCard (multiple)
        ├── Name & River
        ├── Current Level
        ├── Status Badge
        ├── Battery %
        └── Connectivity Status
```

### PublicGoogleSensorMap Component
```
PublicGoogleSensorMap
├── Header
│   ├── Search Input
│   └── Filter Buttons (All/Safe/Alert/Danger)
│
├── Statistics Row
│   ├── Total Sensors
│   ├── Risk Count
│   ├── Danger/Alert/Normal Breakdown
│   └── Online Count
│
├── Map Container
│   ├── Google Maps
│   ├── Sensor Markers (color-coded)
│   └── Info Windows
│
└── Sensor List (Sidebar)
    └── Filterable Sensor List
        ├── Status Badge
        ├── Name
        ├── Level
        └── Battery %
```

---

## 🔄 Data Flow Diagram

### Dashboard Data Flow
```
UserRealtimeDashboard.tsx
    │
    ├─→ useWaterLevel()
    │   ├─→ mockSensors (from constants)
    │   ├─→ Auto-simulation (7s interval)
    │   └─→ State: {latest, history, sensorsSnapshot, liveBySensor}
    │
    └─→ Render Components
        ├─→ ChartWaterLevel (using history)
        ├─→ SensorStatusCard (using sensorsSnapshot)
        └─→ Summary Stats (using liveBySensor)
```

### Notification Generation Flow
```
UserNotificationsPage.tsx
    │
    ├─→ useWaterLevel()
    │   └─→ liveBySensor state (updates every 7s)
    │
    ├─→ useUserNotifications(liveBySensor)
    │   ├─→ Compare sensor level with previous state
    │   ├─→ If status changed: generate notification
    │   ├─→ Store in localStorage
    │   └─→ useReducer for notification list
    │
    └─→ Render Notifications
        ├─→ Unread badge
        ├─→ Notification list
        └─→ Mark read functionality
```

### Authentication Flow
```
/login page
    │
    ├─→ Form Submit
    │   └─→ useAuth().login(email, password)
    │
    ├─→ API Call
    │   └─→ POST /auth/login
    │
    ├─→ Backend Response
    │   └─→ {accessToken, refreshToken, user}
    │
    ├─→ Store in localStorage
    │   ├─→ ews_access_token
    │   ├─→ ews_refresh_token
    │   └─→ ews_user_data
    │
    └─→ Redirect to /user/dashboard
```

---

## 📱 Frontend Dependencies

### Production Dependencies
```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "next": "^14.x",
  "typescript": "^5.x",
  "axios": "^1.6.x",
  "firebase": "^9.x",
  "@react-google-maps/api": "^2.x",
  "tailwindcss": "^3.x"
}
```

### Development Dependencies
```json
{
  "@types/react": "^18.x",
  "@types/node": "^20.x",
  "eslint": "^8.x",
  "eslint-config-next": "^14.x"
}
```

---

## 🔧 Configuration Files

### TypeScript Config (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    },
    "skipLibCheck": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Next.js Config (next.config.ts)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "lh3.googleusercontent.com" }
    ]
  }
};

export default nextConfig;
```

### Tailwind Config (tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        slate: { /* slate colors */ },
        emerald: { /* emerald colors */ },
        amber: { /* amber colors */ },
        rose: { /* rose colors */ }
      }
    }
  },
  plugins: []
};

export default config;
```

---

## 🌐 External Services Integration

### Google Maps API
```typescript
// Used in: PublicGoogleSensorMap.tsx
// Provider: GoogleMap, Marker, InfoWindow components
// Configuration needed in:
//   1. Google Cloud Console (API key)
//   2. Environment variable: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
//   3. Restricted to application domain
```

### Firebase
```typescript
// Used for: Google OAuth authentication
// Configuration in: src/lib/firebase.ts
// Services used:
//   1. Firebase Auth (signInWithPopup)
//   2. Google Provider
// Environment variables:
//   NEXT_PUBLIC_FIREBASE_API_KEY
//   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
//   NEXT_PUBLIC_FIREBASE_PROJECT_ID
//   NEXT_PUBLIC_FIREBASE_APP_ID
```

---

## ⚡ Performance Considerations

### State Updates
- `useWaterLevel()` updates every 7 seconds
- `useUserNotifications()` updates based on level changes
- Both use `useMemo()` for computed values to prevent unnecessary re-renders

### Data Caching
- localStorage for user tokens & notifications
- In-memory state for sensor data (no persistent cache needed)
- Mock data generation is lightweight

### Future Optimizations
- Implement virtual scrolling for long notification lists
- Use React Query for backend API calls + caching
- Lazy load map component
- Split code with Next.js dynamic imports

---

**Generated:** 26 April 2026  
**Version:** 1.0
