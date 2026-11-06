# Project Docs Generator

Pembuatan dokumentasi teknis proyek dari struktur file dan metadata yang diberikan pengguna. Tidak menyimpulkan fitur bisnis dari nama proyek.

## Fitur

- Import folder lokal atau daftar path relatif dan manifest package.json/composer.json.
- Filter file sensitif, vendor, node_modules, .git, dan keluaran build.
- Deteksi teknologi dan dependensi berdasarkan deklarasi metadata.
- Draft instalasi berdasarkan manifest, script, dan keberadaan lockfile; tidak mengeksekusi script.
- Editor Markdown, salin, dan export README.md dengan catatan bukti dan batas verifikasi.

## Teknologi

Next.js 16, React 19, TypeScript, Vitest. Build menghasilkan static export dalam folder out.

## Cara menjalankan

Memerlukan Node.js 22.12+.

```sh
npm ci
npm run dev
```

Buka alamat yang dicetak terminal. Jalankan `npm test` untuk pengujian dan `npm run build` untuk build produksi.
