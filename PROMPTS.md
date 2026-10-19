# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01. Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase. Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat helper `buatKoneksiServer()` di `lib/supabase/server.js` dan diekspor via `lib/supabase/index.js` menggunakan `@supabase/supabase-js`.
- Halaman `app/page.jsx` diubah menjadi Server Component (`async`) untuk mengambil seluruh produk dari tabel `produk` di Supabase.
- Ditambahkan penanganan error yang jelas serta pesan `"Belum ada produk"` jika data kosong.
- Komponen `CatatanBelumAktif` dan referensi ke `data-contoh.js` dihapus.

**Perbaikan:**
Menambahkan `export const dynamic = "force-dynamic"` pada `app/page.jsx` agar katalog tidak di-cache secara statis dan selalu menampilkan data produk terbaru dari database.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02. Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- `app/produk/[id]/page.jsx` mengambil satu produk dari tabel `produk` di Supabase berdasarkan id URL menggunakan `buatKoneksiServer()`.
- Memanggil `notFound()` jika produk tidak ditemukan atau id tidak valid.
- Komponen `CatatanBelumAktif` dihapus dan komponen `TombolWhatsApp` dipertahankan dengan tampilan aslinya.

**Perbaikan:**
Menggunakan query `.maybeSingle()` dan blok `try-catch` agar id produk yang bukan angka atau tidak ada tidak memicu uncaught exception pada server, serta menambahkan `force-dynamic`.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)". Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- `components/TombolWhatsApp.jsx` diubah dari elemen `<button>` menjadi elemen `<a>` (tautan) dengan tautan menuju `https://wa.me/<nomor>?text=<pesan>`.
- Nomor tujuan diambil dari `toko.nomorWhatsApp` di `lib/toko.js`.
- Pesan otomatis memuat nama produk dan harga terformat Rupiah melalui `formatRupiah()`, di-encode dengan `encodeURIComponent`, serta dibuka di tab baru (`target="_blank" rel="noopener noreferrer"`).
- Tampilan dan gaya visual tombol dipertahankan.

**Perbaikan:**
Memastikan pesan teks ramah dan jelas: `Halo, saya ingin memesan <nama> seharga <harga>.`.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04. Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Dibuat fungsi `buatKoneksiAdmin()` di `lib/supabase/admin.js` menggunakan `createServerClient` dari `@supabase/ssr` dan cookie store Next.js (`next/headers`).
- Dibuat Server Action `masuk` dan `keluar` di `app/admin/actions.js`.
- Form di `app/admin/login/page.jsx` disambungkan ke action `masuk`, pesan error ditampilkan jika login gagal, dan `CatatanBelumAktif` dihapus.
- Tombol "Keluar" di `components/NavAdmin.jsx` dibungkus form submit ke action `keluar`.

**Perbaikan:**
Memastikan pemanggilan `redirect()` berada di luar blok `try-catch` agar tidak tertelan exception internal `NEXT_REDIRECT`, serta menerjemahkan pesan error bawaan Supabase ke bahasa Indonesia.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05. Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Dibuat Server Action `gantiPassword` di `app/admin/actions.js` dengan validasi server: mengecek sesi admin aktif (`getUser()`), panjang password minimal 8 karakter, dan kecocokan konfirmasi password.
- Memanggil `supabase.auth.updateUser({ password })`.
- Form di `app/admin/password/page.jsx` disambungkan dan menampilkan pesan sukses atau error melalui `searchParams`.
- `CatatanBelumAktif` dihapus dari halaman ganti password.

**Perbaikan:**
Menambahkan umpan balik visual yang jelas dengan warna teks utama untuk sukses dan warna bahaya untuk error sesuai `DESIGN.md`.

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06. Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Dibuat `proxy.js` di root proyek sebagai middleware Next.js 16 untuk memproteksi `/admin` dan subrutenya (`/admin/:path*`).
- Rute `/admin/login` dikecualikan agar form login dapat diakses.
- Jika pengguna belum terotentikasi, otomatis dialihkan ke `/admin/login`.
- Pengecekan sesi ganda ditambahkan pada Server Component `app/admin/page.jsx` dan Server Action pemodifikasi data (`gantiPassword`).
- `CatatanBelumAktif` dihapus dari `app/admin/page.jsx`.

**Perbaikan:**
Menambahkan pembersihan otomatis URL pada `proxy.js` dan ekspor kompatibilitas `export const middleware = proxy`.

## US-07 List Produk

**Prompt:** [SENDIRI]
Sambungkan halaman admin /admin agar menampilkan daftar produk langsung dari tabel "produk" di Supabase menggunakan koneksi admin terotentikasi, menggantikan data-contoh.

**Hasil:**
- `app/admin/page.jsx` mengambil data produk dari tabel `produk` di Supabase secara dinamis di sisi server.
- Referensi `produkContoh` dari `lib/data-contoh.js` dihapus.
- Menampilkan pesan jika tabel kosong atau gagal dimuat.

**Perbaikan:**
Mengatur `export const dynamic = "force-dynamic"` agar daftar produk di halaman admin langsung terbarui.

## Debugging dan fitur bonus

### Debugging: Error "Invalid path specified in request URL" di Vercel
- **Masalah:** Di localhost katalog normal, namun di Vercel muncul error *"Invalid path specified in request URL"*.
- **Penyebab:** Nilai environment variable `SUPABASE_URL` di dashboard Vercel disalin menyertakan akhiran `/rest/v1` atau tanda kutip ganda. PostgREST mengembalikan `PGRST125` karena rute menjadi dobel (`/rest/v1/rest/v1/produk`).
- **Solusi:** Memperbarui `lib/supabase/server.js`, `lib/supabase/admin.js`, dan `proxy.js` agar otomatis membersihkan `/rest/v1`, spasi, dan tanda kutip, serta mengoreksi nilai variabel di dashboard Vercel menjadi URL dasar proyek.
