# 💍 Wedding Planner Dashboard

Aplikasi pencatatan pengeluaran pernikahan — **input via WhatsApp, langsung tampil di dashboard**.

## ✨ Fitur

- 📱 **Input WhatsApp** — kirim pesan format `<nama> total <angka>`, otomatis tersimpan
- 📊 **Dashboard real-time** — grafik pie per kategori + tabel lengkap
- 🏷️ **Auto-detect kategori** — Catering, Attire, Venue, Decor, dll
- ✏️ **Edit & Hapus** — kelola data langsung dari dashboard
- ✅ **Balasan konfirmasi** — bot WA membalas setiap data tersimpan / gagal

## 🏗️ Arsitektur

```
📱 WhatsApp ──→ 🤖 Bot (Baileys) ──→ 💾 Postgres ──→ 💻 Dashboard (Next.js)
```

Dua service dari satu repo: **web** (Next.js dashboard) + **bot** (Baileys, 24/7), sharing satu database PostgreSQL.

## 🚀 Quick Start (Local)

### 1. Setup Database

**Jalur A — Railway Postgres (rekomendasi, tanpa install apa-apa):**
1. Buat project di [railway.app](https://railway.app)
2. Add service → PostgreSQL
3. Copy `DATABASE_URL` dari tab Variables
4. Paste ke `.env` (lihat `.env.example`)

**Jalur B — Docker (butuh Docker Desktop):**
1. `docker-compose up -d`
2. Set `.env`: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wedding?schema=public`

### 2. Install & Setup

```bash
# Copy env template
cp .env.example .env
# Edit .env — isi DATABASE_URL

# Install dependencies
npm install

# Push schema ke database (buat tabel)
npm run db:push
```

### 3. Jalankan

Buka **3 terminal**:

```bash
# Terminal 1 — Dashboard web
npm run dev:web
# → buka http://localhost:3000

# Terminal 2 — Bot WhatsApp
npm run dev:bot
# → scan QR code yang muncul di terminal
```

### 4. Tes Input WhatsApp

Kirim pesan ke nomor bot:
```
Alat solat total 203.000
Katering total 15.000.000
Gaun pengantin total 5.000.000
```

Bot akan membalas konfirmasi dan data langsung muncul di dashboard.

## 📝 Format Input WhatsApp

```
<nama item> total <angka>
```

| Contoh | Hasil |
|---|---|
| `Alat solat total 203.000` | ✅ Alat solat — Rp 203.000 (Attire) |
| `Katering total 15.000.000` | ✅ Katering — Rp 15.000.000 (Catering) |
| `Gedung total 25.000.000` | ✅ Gedung — Rp 25.000.000 (Venue) |
| `halo` | ❌ Format salah |

## 🚂 Deploy ke Railway

### Step 1: Buat Project & Database
1. Login ke [railway.app](https://railway.app), buat project baru
2. **Add Service → PostgreSQL** — tunggu sampai running
3. Klik service Postgres → tab **Variables** → copy value `DATABASE_URL`

### Step 2: Deploy Web (Dashboard)
1. **New Service → Deploy from GitHub repo** → pilih repo ini
2. Root Directory: `/` (default)
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start:web`
5. Tab **Variables** → tambah:
   - `DATABASE_URL` = paste dari Postgres service

### Step 3: Deploy Bot (WhatsApp)
1. **New Service → Deploy from GitHub repo** → pilih repo yang sama
2. Root Directory: `/` (default)
3. Build Command: `npm install`
4. Start Command: `npm run start:bot`
5. Tab **Variables** → tambah:
   - `DATABASE_URL` = paste dari Postgres service
   - `AUTH_FOLDER` = `/data/auth_info`
6. **Buat Volume** → mount ke path `/data` (supaya auth Baileys survive redeploy)

### Step 4: Bikin Tabel
1. Buka **shell** di salah satu service (atau Railway CLI)
2. Jalankan: `npx prisma db push`
3. Atau jalankan sekali di lokal dengan `DATABASE_URL` Railway

### Step 5: Pairing WhatsApp
1. Buka **Logs** di bot service
2. Scan QR code yang muncul di log
3. Setelah `✅ WhatsApp terhubung!` muncul, bot sudah aktif

### Step 6: Selesai!
- Buka URL web service → dashboard sudah online
- Kirim pesan ke WA bot → data muncul di dashboard

## 🔧 Konfigurasi Environment

| Variable | Default | Keterangan |
|---|---|---|
| `DATABASE_URL` | — | **Wajib.** Connection string PostgreSQL |
| `AUTH_FOLDER` | `./auth_info` | Folder auth Baileys. Railway: `/data/auth_info` |
| `ALLOWED_SENDERS` | (kosong = semua) | Nomor WA yang diizinkan, pisah koma: `62812xxx,62813xxx` |
| `OWNER_NAME` | (kosong) | Nama pemilik, untuk pesan sapaan bot |
| `LOG_LEVEL` | `info` | Level log bot: `debug`, `info`, `warn`, `error` |

## 🗂️ Kategori yang Terdeteksi Otomatis

| Kategori | Keyword Contoh |
|---|---|
| Catering | katering, catering, snack, nasi box, kue, tart, coffee, barista |
| Attire | gaun, jas, baju, dress, alat solat, makeup, rias, sepatu, kebaya, mua |
| Venue | gedung, venue, ballroom, hotel, resort, pantai, taman, masjid |
| Decor | dekorasi, dekor, bunga, backdrop, lighting, pelaminan, sound system |
| Photo & Video | foto, video, cinematic, drone, prewedding, live streaming |
| Invitation | undangan, amplop |
| Transport | mobil, bus, rental, driver |
| Entertainment | band, musik, dj, mc, tarian, doorprize |
| WO & Vendor | wedding organizer, planner, coordinator |
| Souvenir | souvenir, hamper, parcel |
| Lainnya | *fallback jika tidak ada match* |

## ⚠️ Risiko

- **Tanpa auth** — URL dashboard publik. OK untuk personal; bisa ditambah password gate nanti.
- **Baileys** — pakai akun pribadi WA. Ada risiko limit/banned kalau volume tinggi.
- **Tanpa filter** — siapa pun bisa input transaksi. Set `ALLOWED_SENDERS` di env untuk membatasi.

## 🛠️ Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Recharts](https://recharts.org/) — grafik
- [Prisma](https://www.prisma.io/) — ORM
- [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys) — WhatsApp Web API
- [Railway](https://railway.app/) — deployment
