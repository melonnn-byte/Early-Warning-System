# 📱 Analisis Fitur Frontend Early Warning System - User Role

**Tanggal Analisis:** 26 April 2026  
**Aplikasi:** Early Warning System (EWS) - Flood Guard  
**Role:** User (Pengguna Umum)  
**Status:** ✅ Aktif

---

## 📋 Daftar Isi
1. [Ringkasan Fitur](#ringkasan-fitur)
2. [Fitur Utama & Detail Teknis](#fitur-utama--detail-teknis)
3. [API Endpoints & Integrasi](#api-endpoints--integrasi)
4. [Data Flow & Teknologi](#data-flow--teknologi)
5. [Matrik Fitur-API-Endpoint](#matrik-fitur-api-endpoint)

---

## 🎯 Ringkasan Fitur

Frontend EWS untuk **User Role** memiliki **7 fitur utama** yang dirancang untuk memberikan peringatan dini tentang risiko banjir melalui monitoring real-time dan edukasi.

| # | Fitur | Path | Status |
|---|-------|------|--------|
| 1 | Dashboard Realtime | `/user/dashboard` | ✅ Active |
| 2 | Peta Sensor | `/user/map` | ✅ Active |
| 3 | Notifikasi Peringatan | `/user/notifications` | ✅ Active |
| 4 | Kontak Darurat | `/user/emergency` | ✅ Active |
| 5 | Edukasi & Panduan | `/user/education` | ✅ Active |
| 6 | Edit Profil | `/user/profile` | ✅ Active |
| 7 | Autentikasi | `/login`, `/register` | ✅ Active |

---

## 🔧 Fitur Utama & Detail Teknis

### 1. 📊 Dashboard Realtime User (`/user/dashboard`)

**Deskripsi:**  
Halaman utama yang menampilkan monitoring ketinggian air real-time dari semua sensor yang tersebar di lapangan.

**Lokasi File:**
- Component: `src/components/dashboard/UserRealtimeDashboard.tsx`
- Page: `src/app/user/dashboard/page.tsx`

**Data yang Ditampilkan:**
- Status real-time ketinggian air (dalam cm)
- Grafik trend ketinggian air (7 hari terakhir)
- Curah hujan terkini
- Kecepatan aliran air
- Status konektivitas sensor (Online/Offline)
- Persentase baterai sensor
- Timestamp update terakhir

**Status Levels & Threshold:**
| Level | Range (cm) | Warna | Aksi |
|-------|-----------|-------|------|
| Hijau (Normal) | < 150 | 🟢 Emerald | Aktivitas normal |
| Kuning (Waspada) | 150-199 | 🟡 Amber | Siapkan tas darurat |
| Oren (Siaga) | 200-219 | 🟠 Orange | Bersiap evakuasi |
| Merah (Bahaya) | ≥ 220 | 🔴 Rose | Evakuasi segera |

**Teknologi:**
```
- Hook: useWaterLevel() - Manage state water level dengan mock data
- Refresh interval: 7 detik
- Real-time simulation dengan random drift ±2-8 cm
```

---

### 2. 🗺️ Peta Sensor (`/user/map`)

**Deskripsi:**  
Visualisasi lokasi semua sensor pada peta geografis dengan filter berdasarkan status risiko.

**Lokasi File:**
- Page: `src/app/user/map/page.tsx`
- Component: `src/components/maps/PublicGoogleSensorMap.tsx`

**Fitur:**
- Peta interaktif dengan Google Maps API
- Penanda sensor dengan status color-coding
- Filter by status: All, Safe, Alert, Danger
- Search sensor by nama/ID/nama sungai
- Detail panel sensor (klik untuk lihat detail)
- Sorting by priority (danger > alert > safe)
- Statistik:
  - Total sensors online: {count}
  - Danger sensors: {count}
  - Alert sensors: {count}
  - Normal sensors: {count}

**Data dari Mock:**
```typescript
mockSensors = [
  {
    id: "SEN-01",
    name: "Sensor Hulu",
    riverName: "Batang Arau",
    latitude: -0.9478,
    longitude: 100.3615,
    connectivity: "online",
    batteryPercent: 87,
    lastLevelCm: 120,
    status: "safe"
  },
  // ... lebih 2 sensor lagi
]
```

---

### 3. 🔔 Notifikasi Peringatan (`/user/notifications`)

**Deskripsi:**  
Pusat notifikasi yang mengumpulkan semua peringatan banjir berdasarkan perubahan status sensor real-time.

**Lokasi File:**
- Page: `src/app/user/notifications/page.tsx`
- Hook: `src/hooks/useUserNotifications.ts`
- Type: `src/types/user-notification.ts`

**Fitur Notifikasi:**

**1. Automatic Notification Generation**
- Trigger saat status sensor berubah: Normal → Kuning → Oren → Merah
- Tidak ada notifikasi jika status tetap sama
- Storage: localStorage dengan key `ews_user_notifications`

**2. Notification Fields:**
```typescript
interface UserNotificationItem {
  id: string                    // Unique ID: NTF-{sensorId}-{timestamp}-{random}
  sensorId: string              // Reference ke sensor
  sensorName: string            // Nama sensor
  levelCm: number               // Ketinggian air saat notifikasi
  riskLevel: "yellow" | "orange" | "red"  // Tingkat risiko
  title: string                 // "Peringatan Kuning • Sensor Nama"
  message: string               // "Waspada dini. Mulai siapkan kebutuhan darurat..."
  createdAt: string             // ISO timestamp
  isRead: boolean               // Status baca
  guideHref: string             // Link ke panduan (/user/education#aksi-kuning)
}
```

**3. Risk Levels & Messages:**
| Level | Message Prefix | Guide Link |
|-------|----------------|-----------|
| Kuning | "Waspada dini. Mulai siapkan kebutuhan darurat." | `#aksi-kuning` |
| Oren | "Status siaga. Bersiap untuk evakuasi terarah." | `#aksi-oren` |
| Merah | "Status bahaya. Lakukan evakuasi segera." | `#aksi-merah` |

**4. Notification Actions:**
- Mark as read (individual)
- Mark all as read
- Unread counter display
- Click notification → view detail + mark as read
- Show dummy notifications on first load for demo

---

### 4. 🆘 Kontak Darurat (`/user/emergency`)

**Deskripsi:**  
Halaman emergency response center dengan kontak darurat prioritas dan panduan tindakan cepat.

**Lokasi File:**
- Page: `src/app/user/emergency/page.tsx`

**Emergency Contacts (dari constants):**
```typescript
emergencyContacts = [
  { name: "BPBD Kota", phone: "117" },
  { name: "Basarnas", phone: "115" },
  { name: "Ambulans", phone: "118" }
]
```

**Detail Kontak:**

| Kontak | Scope Layanan | Response Time | Use Case |
|--------|---------------|---------------|----------|
| **BPBD Kota** | Koordinasi kebencanaan & evakuasi wilayah | ±5-15 menit | Tinggi air naik cepat, butuh koordinasi |
| **Basarnas** | Pencarian & penyelamatan korban berbahaya | Prioritas tinggi | Korban terjebak/hanyut |
| **Ambulans** | Pertolongan medis darurat | Secepat mungkin | Kondisi medis kritis |

**Fitur:**
- One-click call dengan tel: protocol
- Call checklist: informasi yang harus disampaikan
- Quick action buttons (Dashboard, Map, Edukasi, Notifikasi)
- Badge prioritas untuk setiap layanan
- Styling berbeda per kontak (color-coded)

**Checklist Panggilan:**
1. Sebutkan lokasi detail (alamat, patokan terdekat, Google Maps)
2. Jelaskan kondisi: tinggi air, arus, akses jalan, cuaca
3. Informasikan jumlah warga terdampak & kelompok rentan
4. Sampaikan kebutuhan mendesak: evakuasi/medis/logistik

---

### 5. 📚 Edukasi & Panduan (`/user/education`)

**Deskripsi:**  
Komprehensif knowledge base dengan status levels, rencana 3 fase, checklist siaga, dan FAQ.

**Lokasi File:**
- Page: `src/app/user/education/page.tsx`

**Konten Section:**

**A. Level Status (4 Levels)**

| Level | Makna | Aksi Sekarang |
|-------|-------|--------------|
| 🟢 Hijau (Normal) | Aman, pemantauan tetap diperlukan | Cek dashboard 30 menit sekali, pastikan notifikasi aktif |
| 🟡 Kuning (Waspada) | Tinggi air mulai naik, waktu bersiap | Pantau tiap 10-15 menit, siapkan tas siaga, isi daya ponsel |
| 🟠 Oren (Siaga) | Risiko banjir tinggi, pra-evakuasi | Pindahkan barang penting, siapkan keluarga rentan, konfirmasi jalur |
| 🔴 Merah (Bahaya) | Kondisi kritis, evakuasi segera | Evakuasi ke lokasi aman, matikan listrik, ikuti instruksi BPBD |

**B. Rencana 3 Fase**

1. **Sebelum Banjir**
   - Simpan nomor darurat di kontak favorit
   - Diskusikan rute evakuasi keluarga
   - Simpan dokumen penting dalam map tahan air
   - Latih komunikasi singkat saat darurat

2. **Saat Peringatan Aktif**
   - Periksa status sensor terdekat di Dashboard
   - Prioritaskan evakuasi anggota keluarga rentan
   - Hindari sebarkan info tidak terverifikasi
   - Gunakan jalur evakuasi resmi

3. **Setelah Kondisi Mereda**
   - Masuk rumah hanya jika ada konfirmasi aman
   - Periksa instalasi listrik & air
   - Catat kebutuhan mendesak untuk bantuan
   - Evaluasi rencana keluarga

**C. Checklist Siaga**

- [ ] Dokumen penting (KTP, KK, surat berharga)
- [ ] Obat pribadi, P3K, dan masker
- [ ] Air minum, makanan siap saji, perlengkapan bayi
- [ ] Senter, powerbank, peluit, baterai cadangan
- [ ] Pakaian ganti dan perlengkapan kebersihan

**D. Do & Don't Evakuasi**
- ✅ Evakuasi ke lokasi aman resmi
- ✅ Bantu lansia/anak terlebih dahulu
- ✅ Tetap di jalur aman
- ❌ Jangan menerobos arus banjir
- ❌ Jangan dekati kabel listrik terbuka
- ❌ Jangan tunggu instruksi lagi saat status Merah

---

### 6. 👤 Edit Profil (`/user/profile`)

**Deskripsi:**  
Halaman untuk user mengupdate informasi profil personal.

**Lokasi File:**
- Page: `src/app/user/profile/page.tsx`

**Form Fields:**
```typescript
{
  name: string                  // Nama lengkap
  email: string                 // Email (unique)
  whatsappNumber?: string       // Nomor WhatsApp (format: 62812xxxxxxx)
}
```

**Features:**
- Form pre-fill dengan data current user
- Validation dasar (required fields)
- Submit dengan loading state
- Success message feedback
- Hook: `useAuth().updateProfile()`

**Implementation:**
- Local state update di localStorage
- API call ke backend (optional)
- Real-time form binding dengan input fields

---

### 7. 🔐 Autentikasi (`/login`, `/register`)

**Deskripsi:**  
Sistem login & registrasi untuk user authentication.

**Lokasi File:**
- Hook: `src/hooks/useAuth.ts`
- Components: `src/app/login/page.tsx`, `src/app/register/page.tsx`
- Lib: `src/lib/firebase.ts`

**Authentication Methods:**

**A. Email/Password Login**
```
POST /auth/login
{
  email: string
  password: string
}

Response:
{
  data: {
    accessToken: string
    refreshToken: string
    user: {
      id: string
      name: string
      email: string
      role: string
      whatsappNumber?: string
    }
  }
}
```

**B. Google OAuth Login**
```
POST /auth/google-login
{
  idToken: string  // Firebase ID token dari Google Sign-In
}

Response: (sama seperti email login)
```

**C. Token Management**
- Storage keys:
  - `ews_access_token` - JWT access token
  - `ews_refresh_token` - Refresh token
  - `ews_user_data` - User profile JSON
  
- Interceptor automatically attach Bearer token ke setiap request
- 401 Unauthorized handling: show console warning

**D. Logout**
```
POST /auth/logout

Action: Clear localStorage, redirect to login
```

---

## 🔗 API Endpoints & Integrasi

### Base Configuration
```typescript
// src/constants/index.ts
API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api"
WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:3001"
```

### API Interceptor Setup
```typescript
// src/lib/api.ts
- Automatically inject Bearer token di Authorization header
- Global error handling untuk 401
- Timeout: 10 detik
- Response format: { data: {...}, message: string }
```

### Endpoint Breakdown

#### 🔐 Authentication Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/auth/register` | Register user baru | ❌ No |
| POST | `/auth/login` | Login dengan email/password | ❌ No |
| POST | `/auth/google-login` | Login dengan Google OAuth | ❌ No |
| POST | `/auth/logout` | Logout (clear session) | ✅ Yes |
| POST | `/auth/refresh` | Refresh access token | ❌ No |

**Request/Response Examples:**

```bash
# Register
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure123"
}
→ 201 Created: { accessToken, refreshToken, user }

# Login
POST /auth/login
{
  "email": "john@example.com",
  "password": "secure123"
}
→ 200 OK: { accessToken, refreshToken, user }

# Google Login
POST /auth/google-login
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
→ 200 OK: { accessToken, refreshToken, user }

# Logout
POST /auth/logout
Authorization: Bearer {accessToken}
→ 200 OK: { message: "Logout berhasil..." }

# Refresh Token
POST /auth/refresh
{
  "refreshToken": "refresh_token_here"
}
→ 200 OK: { accessToken, refreshToken }
```

---

#### 📊 Water Level Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/water-levels/current` | Get current level semua sensor | ❌ No |
| GET | `/water-levels/history` | Get historical data dengan filter | ❌ No |
| GET | `/water-levels/:sensorId/latest` | Get latest level sensor spesifik | ❌ No |

**Request/Response Examples:**

```bash
# Get Current Water Levels
GET /water-levels/current
→ 200 OK:
[
  {
    sensorId: "SEN-01",
    sensorName: "Sensor Hulu",
    levelCm: 120,
    rainfallMm: 3.5,
    status: "safe",
    updatedAt: "2026-04-26T10:15:30Z",
    connectivity: "online",
    batteryPercent: 87
  },
  ...
]

# Get Water Level History
GET /water-levels/history?sensorId=SEN-01&startDate=2026-04-20&endDate=2026-04-26&interval=hourly
Query Params:
  - sensorId: string (optional)
  - startDate: ISO date (optional)
  - endDate: ISO date (optional)
  - interval: 'hourly' | 'daily' | 'weekly' (optional)

→ 200 OK:
{
  sensorId: "SEN-01",
  data: [
    {
      timestamp: "2026-04-26T09:00:00Z",
      levelCm: 118,
      rainfallMm: 2.1,
      flowSpeedMs: 0.65
    },
    ...
  ]
}

# Get Latest for Specific Sensor
GET /water-levels/SEN-01/latest
→ 200 OK:
{
  sensorId: "SEN-01",
  sensorName: "Sensor Hulu",
  levelCm: 120,
  rainfallMm: 3.5,
  status: "safe",
  updatedAt: "2026-04-26T10:15:30Z"
}
```

---

#### 📡 Sensor Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/sensors` | Get all sensors list | ❌ No |

**Request/Response Examples:**

```bash
# Get All Sensors
GET /sensors
→ 200 OK:
[
  {
    id: "SEN-01",
    name: "Sensor Hulu",
    riverName: "Batang Arau",
    sensorId: "SEN-01",
    type: "WATER_LEVEL",
    latitude: -0.9478,
    longitude: 100.3615,
    connectivity: "online",
    batteryLevel: 87,
    lastActiveAt: "2026-04-26T10:15:30Z",
    isActive: true
  },
  ...
]
```

---

#### 🚨 Alert Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/alerts/active` | Get active alerts saat ini | ❌ No |
| GET | `/alerts/history` | Get alert history dengan pagination | ❌ No |
| POST | `/alerts/subscribe` | Subscribe ke push notification | ❌ No |
| POST | `/alerts/broadcast` | Broadcast alert (Admin only) | ✅ Yes |

**Request/Response Examples:**

```bash
# Get Active Alerts
GET /alerts/active
→ 200 OK:
[
  {
    id: "ALT-001",
    title: "Waspada Kenaikan Air",
    message: "Ketinggian air di titik tengah naik ke status SIAGA.",
    severity: "WARNING",
    channels: ["push", "whatsapp"],
    targetArea: "zona_tengah",
    sentBy: "admin_id",
    sentAt: "2026-04-26T08:15:00Z"
  },
  ...
]

# Get Alert History
GET /alerts/history?page=1&limit=20
Query Params:
  - page: number (default: 1)
  - limit: number (default: 20)

→ 200 OK:
{
  data: [...],
  pagination: { page: 1, limit: 20, total: 45 }
}

# Subscribe to Push Notifications
POST /alerts/subscribe
{
  "token": "firebase_device_token",
  "targetArea": "zona_hulu"  // optional
}
→ 201 Created: { id, token, targetArea, subscribedAt }

# Broadcast Alert (Admin)
POST /alerts/broadcast
Authorization: Bearer {adminToken}
{
  "title": "Peringatan Bahaya",
  "message": "Tinggi air mencapai level bahaya",
  "severity": "DANGER",
  "channels": ["push", "whatsapp", "sms"],
  "targetArea": "zona_hilir"
}
→ 201 Created: { id, title, message, broadcastAt }
```

---

#### 🆘 Emergency Contacts Endpoints

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| GET | `/emergency-contacts` | Get semua emergency contacts | ❌ No |

**Request/Response Examples:**

```bash
# Get Emergency Contacts
GET /emergency-contacts
→ 200 OK:
[
  {
    id: "EMERG-001",
    name: "BPBD Kota",
    phone: "117",
    category: "BPBD",
    isActive: true
  },
  {
    id: "EMERG-002",
    name: "Basarnas",
    phone: "115",
    category: "SAR",
    isActive: true
  },
  {
    id: "EMERG-003",
    name: "Ambulans",
    phone: "118",
    category: "AMBULANCE",
    isActive: true
  }
]
```

---

## 📊 Data Flow & Teknologi

### Frontend Architecture

```
┌─────────────────────────────────────┐
│    User Interface Layer              │
│  (Next.js Pages & Components)        │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    Custom Hooks Layer                │
│  useAuth, useWaterLevel,             │
│  useUserNotifications, useWebSocket  │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│    API & State Management            │
│  (Axios Interceptor, localStorage)   │
└────────────────┬────────────────────┘
                 │
        ┌────────▼────────┐
        │   Backend API    │
        │  (NestJS)        │
        └─────────────────┘
```

### State Management Strategy

**1. Authentication State**
```typescript
// useAuth.ts
- User data stored in localStorage (ews_user_data)
- Access token in localStorage (ews_access_token)
- Refresh token in localStorage (ews_refresh_token)
- Initial load dari localStorage
- Auto-inject token via axios interceptor
```

**2. Water Level State**
```typescript
// useWaterLevel.ts
- In-memory state dengan mock data generation
- Auto-simulate setiap 7 detik
- History tracking last 7 days (HISTORY_LIMIT = 168 hours)
- Per-sensor latest & history tracking
```

**3. Notification State**
```typescript
// useUserNotifications.ts
- Notification list in memory (useReducer)
- Sensor risk state tracked in localStorage (SENSOR_RISK_STATE_KEY)
- Auto-generate notifikasi saat level berubah
- Max 100 notifikasi disimpan
```

### Real-Time Data Sources

**A. Mock Data Simulation (Current)**
```typescript
// useWaterLevel.ts
- mockSensors dari constants
- Auto-drift calculation: ±2-8 cm per update
- Wave patterns dengan sin/cos functions
- Refresh interval: 7000ms (7 detik)
```

**B. Future: WebSocket Integration**
```typescript
// useWebSocket.ts (exists tapi belum fully implemented)
- Connection ke WS_URL
- Real-time water level stream
- Alert notifications
- Sensor status updates
```

### Teknologi Stack Frontend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 14 | React framework with SSR |
| **Language** | TypeScript | Type-safe JavaScript |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **HTTP Client** | Axios | API requests with interceptors |
| **Auth** | Firebase + JWT | Authentication & Google OAuth |
| **Maps** | Google Maps API | Geospatial visualization |
| **State** | React Hooks | Local state management |
| **Storage** | localStorage | Client-side persistence |
| **UI Components** | Custom + shadcn | Reusable components |

### Teknologi Stack Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | NestJS | Node.js framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **Database** | PostgreSQL | Relational database |
| **ORM** | Prisma | Database abstraction |
| **Auth** | JWT + Firebase | Token-based authentication |
| **API** | REST + WebSocket | API protocols |
| **Notifications** | Firebase Cloud Messaging | Push notifications |

---

## 📐 Matrik Fitur-API-Endpoint

### Mapping Fitur ke Endpoint

```
┌─────────────────────────────────────────────────────────────────┐
│ FITUR 1: Dashboard Realtime                                     │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                      │
│  • GET /water-levels/current         [Required] - Get levels   │
│  • GET /sensors                      [Required] - Get sensors   │
│ Data Flow: useWaterLevel hook → render realtime dashboard      │
│ Update Frequency: 7 detik (auto-simulate)                      │
│ Storage: In-memory state                                        │
│ Firebase: Not required                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FITUR 2: Peta Sensor                                            │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                      │
│  • GET /sensors                      [Required] - Get all       │
│  • GET /water-levels/current         [Required] - Get levels   │
│ Components:                                                     │
│  • Google Maps API                   [Required] - Map render   │
│ Data Flow:                                                      │
│  1. Fetch sensors & levels                                    │
│  2. Plot markers on map                                       │
│  3. Color-code by status                                      │
│  4. Click marker → show details                               │
│ Storage: Component state + props                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FITUR 3: Notifikasi Peringatan                                  │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                      │
│  • GET /alerts/active                [Optional] - Get alerts   │
│  • GET /alerts/history               [Optional] - Get history  │
│ Data Source: useWaterLevel → useUserNotifications              │
│ Logic:                                                          │
│  1. Monitor water level changes                                │
│  2. Compare dengan previous risk state                         │
│  3. Generate notification jika berubah                         │
│  4. Store in localStorage                                      │
│ Storage: localStorage (ews_user_notifications)                │
│ Max items: 100 notifikasi                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FITUR 4: Kontak Darurat                                         │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                      │
│  • GET /emergency-contacts           [Recommended] - Get list  │
│ Data Source: constants (emergencyContacts hardcoded)          │
│ Features:                                                       │
│  • One-click call (tel: protocol)                              │
│  • Call checklist                                               │
│  • Quick navigation buttons                                     │
│ Storage: None (static data)                                    │
│ Firebase: Not required                                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FITUR 5: Edukasi & Panduan                                      │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints: None required                                        │
│ Data Source: Static content hardcoded di page                  │
│ Content Sections:                                               │
│  • 4 Level status dengan guidance                              │
│  • 3 Fase rencana (sebelum/saat/sesudah)                       │
│  • Checklist siaga                                             │
│  • Do & Don't evakuasi                                         │
│  • FAQ & metrics                                               │
│ Storage: None                                                   │
│ Update Pattern: Manual content update                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FITUR 6: Edit Profil                                            │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                      │
│  • Implicit: Profile update via custom logic              │
│ Data Source: useAuth hook + localStorage                      │
│ Features:                                                       │
│  • Edit name, email, WhatsApp number                           │
│  • Form validation                                              │
│  • Local state update                                           │
│ Storage: localStorage (ews_user_data)                         │
│ Note: Tidak ada API backend call untuk update profil           │
│       (hanya update local state)                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FITUR 7: Autentikasi                                            │
├─────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                      │
│  • POST /auth/register               [Required] - User signup  │
│  • POST /auth/login                  [Required] - User login   │
│  • POST /auth/google-login           [Required] - OAuth login  │
│  • POST /auth/logout                 [Required] - User logout  │
│  • POST /auth/refresh                [Optional] - Token refresh│
│ External Services:                                              │
│  • Firebase (Google OAuth provider)  [Required]               │
│ Features:                                                       │
│  • JWT token management                                        │
│  • Auto token injection (interceptor)                         │
│  • Local storage persistence                                   │
│  • Session recovery on page reload                             │
│ Storage:                                                        │
│  • ews_access_token (localStorage)                            │
│  • ews_refresh_token (localStorage)                           │
│  • ews_user_data (localStorage)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Implementasi Checklist

### Fitur yang Sudah Tersedia
- ✅ Dashboard Realtime (dengan mock data)
- ✅ Peta Sensor (dengan Google Maps)
- ✅ Notifikasi Peringatan (dengan localStorage)
- ✅ Kontak Darurat (hardcoded)
- ✅ Edukasi & Panduan (static content)
- ✅ Edit Profil (local update)
- ✅ Autentikasi (login/register/Google)

### Backend APIs Needed
- ✅ POST /auth/register
- ✅ POST /auth/login
- ✅ POST /auth/google-login
- ✅ POST /auth/logout
- ✅ POST /auth/refresh
- ✅ GET /sensors
- ✅ GET /water-levels/current
- ✅ GET /water-levels/history
- ✅ GET /water-levels/:sensorId/latest
- ✅ GET /alerts/active
- ✅ GET /alerts/history
- ✅ POST /alerts/subscribe
- ✅ GET /emergency-contacts

### Future Enhancements
- ⏳ WebSocket real-time streaming (useWebSocket.ts)
- ⏳ Push notifications dengan Firebase Cloud Messaging
- ⏳ Profile update ke backend API
- ⏳ User preferences (notification settings, language)
- ⏳ Offline mode dengan service workers
- ⏳ Historical data export (CSV/PDF)
- ⏳ Location-based alerts
- ⏳ Social sharing & emergency contact sharing

---

**Dokumen ini di-generate pada: 26 April 2026**  
**Last Updated:** 26 April 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
