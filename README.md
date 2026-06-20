# XylonWebz — Paket Web (GitHub → Vercel)

Ini cuma bagian **web login**-nya doang. Bot Telegram-nya jalan terpisah di panel lo (lihat paket `xylonwebz-bot`). Keduanya nyambung lewat database Upstash Redis yang sama.

## Isi paket

```
xylonwebz-vercel/
├── api/
│   └── login.js        ← endpoint buat ngecek username/password
├── lib/
│   └── keystore.js      ← koneksi ke Redis
├── index.html            ← tampilan login
├── package.json
└── .env.example
```

## 1. Push ke GitHub

```bash
cd xylonwebz-vercel
git init
git add .
git commit -m "init xylonwebz web"
git remote add origin https://github.com/USERNAME-LO/xylonwebz.git
git branch -M main
git push -u origin main
```

## 2. Import ke Vercel

1. Buka vercel.com/new → Import repo `xylonwebz` dari GitHub
2. Framework Preset: **Other**
3. Jangan deploy dulu — isi Environment Variables dulu (step 3)

## 3. Set Environment Variables

Di **Project Settings → Environment Variables**, isi:

| Key | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | sama persis kayak punya bot |
| `UPSTASH_REDIS_REST_TOKEN` | sama persis kayak punya bot |

Ambil nilainya dari dashboard upstash.com (database yang sama yang dipakai bot lo).

Kalau env var ditambahin setelah deploy pertama, klik **Redeploy** di tab Deployments.

## 4. Ganti link "Get Akses"

Buka `index.html`, cari:

```html
<a href="https://t.me/XylonWebzBot" ...>
```

Ganti `XylonWebzBot` ke username bot lo sendiri.

## 5. Deploy & tes

Setelah deploy sukses, buka `https://nama-project-lo.vercel.app`.

Pastiin bot di panel lo udah jalan dan udah pernah bikin key (`/ckey devzz,auiop,30d`), terus coba login pakai `devzz` / `auiop` di web ini.

## Catatan

- Domain `*.vercel.app` udah publik & bisa diakses siapa aja. Mau pakai domain sendiri? Tambahin di **Project Settings → Domains**.
- Jangan upload `.env` asli ke GitHub — `.env.example` cuma template kosong, aman buat di-push.
