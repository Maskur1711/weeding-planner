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

## 🚀 Deploy ke Production (Gratis)

Direkomendasikan menggunakan kombinasi **Aiven** (Database), **Vercel** (Web), dan **Fly.io** (Bot) untuk deployment gratis 24/7.

### Step 1: Database (Aiven)
1. Buat free PostgreSQL database di [Aiven](https://aiven.io/).
2. Copy `Service URI` dari dashboard Aiven.
3. Jalankan `npx prisma db push` di lokal Anda menggunakan URL tersebut untuk membuat tabel.

### Step 2: Web Dashboard (Vercel)
1. Login ke [Vercel](https://vercel.com/) dan import repository GitHub ini.
2. Di bagian pengaturan sebelum deploy, tambahkan **Environment Variable** `DATABASE_URL` dengan isi URL Aiven Anda.
3. Deploy! Dashboard akan langsung online.

### Step 3: Bot WhatsApp (Fly.io)
Proyek ini sudah dilengkapi `Dockerfile` untuk mempermudah deploy bot.
1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/) di komputer Anda.
2. Jalankan `fly auth login`, lalu `fly launch` (kosongkan nama, pilih region `sin` (Singapore), pilih **No** untuk database & Redis, pilih **No** untuk deploy sekarang).
3. Buat volume untuk menyimpan sesi QR:
   `fly volumes create auth_data --region sin --size 1`
4. Buka file `fly.toml` yang baru saja terbuat, tambahkan di baris paling bawah:
   ```toml
   [mounts]
     source = "auth_data"
     destination = "/app/auth_info"

   [env]
     AUTH_FOLDER = "/app/auth_info"
   ```
5. Set `DATABASE_URL` rahasia di server Fly.io:
   `fly secrets set DATABASE_URL="URL_AIVEN_ANDA"`
6. Deploy bot: `fly deploy`
7. Buka `fly logs` dan scan QR Code yang muncul menggunakan HP Anda. Selesai!

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
- **Deployment**: [Aiven](https://aiven.io/) (DB), [Vercel](https://vercel.com/) (Web), [Fly.io](https://fly.io/) (Bot)
