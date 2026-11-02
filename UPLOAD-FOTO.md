# Menambahkan foto

Unggah foto lewat GitHub ke branch `main`, lalu tunggu proses penerbitan di tab Actions selesai. Daftar foto di web dibuat otomatis saat penerbitan. Tidak perlu mengubah kode atau daftar foto.

| Folder | Tampil di |
| --- | --- |
| `image/Archives/MyWork` | Galeri Proyek Roblox |
| `image/Archives/FristCollab` | Galeri Kolaborasi pertama. Pertahankan ejaan folder ini. |
| `image/Archives/Build` | Galeri Builds & detail. Foto baru juga ikut cuplikan beranda. |
| `image/Archives/UiUx` | Galeri Antarmuka permainan |
| `image/Archives/LuaUCode` | Galeri NPC Manager |
| `image/Archives/Gallery` | Galeri Catatan visual |
| `image/youtuber` | Momen kreator. Nama file menjadi nama kreator untuk foto baru. |
| `image/Showcase` | Pilihan khusus untuk cuplikan beranda. Jika ada foto di sini, cuplikan hanya memakai folder ini. |

Format yang didukung: PNG, JPG, JPEG, WebP, AVIF, dan GIF. Subfolder di dalam kategori ikut dibaca. Foto lama tetap sesuai urutan semula, foto baru ditambahkan menurut nama file. Untuk Showcase, nama seperti `01-hutan.webp` dan `02-warung.webp` mengatur urutannya.

Menghapus foto dari folder juga menghapusnya dari galeri setelah penerbitan berikutnya. Jika suatu kategori kosong, kategori itu disembunyikan. Menaruh foto hanya di komputer belum mengubah web, unggah atau push ke GitHub dahulu.

Folder `image/games`, `image/studios`, dan `image/icons` tidak otomatis menjadi galeri. Foto proyek rilis tetap terhubung ke data game masing-masing, dan foto studio tetap ke profil studionya.

Untuk pratinjau lokal, jalankan `node scripts/sync-gallery.mjs` sebelum membuka web. Label dan deskripsi koleksi disimpan di `portfolio-content.js`; `portfolio-data.js` dibuat otomatis.

Foto proyek yang sedang digarap disimpan di `image/ongoing/`. Judul, deskripsi, dan daftar fotonya diatur dalam `ongoing-projects.js`, terpisah dari galeri arsip dan statistik game rilis. Menambahkan foto ke folder ini saja belum mengubah daftar progres. Statistik proyek yang belum dipublikasikan ditampilkan sebagai `?` dan tidak ikut jumlah proyek rilis atau total kunjungan.
