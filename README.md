# Somewhere Under The Same Sky

Website ucapan ulang tahun interaktif berbasis HTML, CSS, dan JavaScript (tanpa build step).  
Berisi perjalanan singkat beberapa *scene*: sambutan, ucapan, galeri kenangan, surat, hadiah, dan penutup, dilengkapi musik latar serta animasi.

## Fitur

- Scene: **Welcome**, **Birthday**, **Memories**, **Letter**, **Gifts**, **Ending**
- Navigasi antar scene (tombol Next/Kembali, indikator dots, hash route)
- Galeri kenangan (polaroid), amplop & surat, kado interaktif, halaman penutup
- Musik latar via YouTube IFrame Player (panel pemutar/vinyl)
- Animasi & efek visual (awan, partikel, shooting stars, dll.)
- Responsif, termasuk penyesuaian untuk layar kecil/HP

## Struktur folder

```text
.
├─ index.html
├─ vercel.json
├─ assets/
│  ├─ icons/            # favicon
│  └─ images/
│     ├─ memories/      # foto kenangan
│     └─ ui/            # aset UI (buket, foto, dll.)
├─ css/
│  ├─ style.css         # gaya utama
│  ├─ effects.css       # animasi/efek
│  └─ responsive.css    # aturan responsif
└─ js/
   ├─ config.js         # semua konten personal (teks, foto, musik)
   ├─ main.js
   ├─ navigation.js
   ├─ animation.js
   └─ music.js
```

## Menjalankan secara lokal

Proyek ini statis, tetapi sebaiknya dijalankan lewat server lokal (bukan membuka `index.html` langsung via `file://`).

```bash
# dari folder proyek
python -m http.server 8000
```

Lalu buka <http://localhost:8000> di browser.  
Alternatif: ekstensi **Live Server** di VS Code.

## Kustomisasi konten

Ubah konten di **`js/config.js`** (tidak perlu mengubah HTML untuk mengganti teks/foto utama):

- `recipientName`, `senderName` — nama penerima & pengirim
- `welcome`, `birthday`, `letter`, `ending`, `endingSignature` — teks tiap bagian
- `memories` — daftar foto & caption (letakkan file di `assets/images/memories/`, lalu sesuaikan `src`/`alt`)
- `gifts`, `secretGift`, `endingPhoto` — konten hadiah & foto penutup
- `music.videoId`, `music.title`, `music.fallbackUrl` — lagu latar (YouTube)

## Deploy

Bisa di-deploy sebagai situs statis ke GitHub Pages, Vercel, Netlify, atau hosting statis lain.

- **Vercel**: import repository sebagai static project (sudah ada `vercel.json` untuk cache header aset).
- **GitHub Pages**: aktifkan Pages dari branch/folder root yang berisi `index.html`.

## Catatan

- Pemutar musik menggunakan YouTube IFrame API dan memerlukan koneksi internet; browser dapat membatasi autoplay sehingga musik diputar setelah interaksi pengguna.
- Rapikan/ganti konten personal dan foto di `js/config.js` serta folder `assets/` sebelum dipublikasikan.

## Lisensi

Belum ditentukan. Tambahkan lisensi sesuai kebutuhan sebelum distribusi ulang.
