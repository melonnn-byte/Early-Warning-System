# Backend EWS (NestJS + Prisma + Supabase PostgreSQL)

Backend untuk sistem Early Warning banjir, dibangun dengan:

- **NestJS 11** (REST API)
- **Prisma ORM**
- **Supabase PostgreSQL**

## 1) Prasyarat

- Node.js >= 18
- Akun Supabase + project database aktif

## 2) Instalasi

```bash
npm install
```

## 3) Konfigurasi Environment

File berikut sudah tersedia:

- `.env.example`
- `.env`

Lengkapi value berikut di `.env`:

- `DATABASE_URL` → koneksi pooler Supabase (runtime query)
- `DIRECT_URL` → koneksi direct host Supabase (untuk migrate)

## 4) Prisma Workflow

Generate client:

```bash
npm run prisma:generate
```

Buat dan jalankan migration (development):

```bash
npm run prisma:migrate:dev -- --name init
```

Deploy migration (production/staging):

```bash
npm run prisma:migrate:deploy
```

Buka Prisma Studio:

```bash
npm run prisma:studio
```

## 5) Menjalankan Aplikasi

Mode development:

```bash
npm run start:dev
```

Server default berjalan di:

- `http://localhost:3001`

## 6) Endpoint Validasi Koneksi Database

Untuk cek apakah Prisma berhasil konek ke Supabase PostgreSQL:

- `GET /health/db`

Response sukses:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## 7) Testing

```bash
npm run test
npm run test:e2e
```

## Catatan

Skema database berada di `prisma/schema.prisma` dan sudah meng-cover entitas utama EWS (users, sensors, water/rain logs, thresholds, alerts, emergency contacts).
