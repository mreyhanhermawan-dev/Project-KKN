# Product Requirements Document (PRD)
**Proyek:** Website Kelurahan Palabuhanratu (Sistem Informasi Desa & Direktori UMKM)
**Tim:** KKN-T Inovasi IPB University 2026
**Versi:** 1.0

---

## 1. Executive Summary
Proyek ini membangun situs web resmi untuk Kelurahan Palabuhanratu (palabuhanratu.web.id) yang berfungsi ganda sebagai Sistem Informasi Desa (SID) dan Direktori UMKM terintegrasi. Platform ini menggunakan arsitektur modern berbasis Astro dan ekosistem serverless Cloudflare. Fokus utamanya adalah menyajikan profil kelurahan, layanan publik, potensi wisata, dan mempromosikan UMKM lokal ke audiens yang lebih luas. Fitur utama mencakup Panel Admin *zero-maintenance* yang memungkinkan staf kelurahan mengelola seluruh konten tanpa kemampuan coding.

## 2. Problem Statement & Background
**Latar Belakang:** Kelurahan Palabuhanratu adalah daerah dengan potensi UMKM dan wisata yang besar. Namun, saat ini belum memiliki identitas digital yang resmi dan terpusat.
**Masalah Utama:**
- Kelurahan tidak memiliki website resmi untuk memberikan informasi publik dan pelayanan administrasi dasar secara online.
- Pelaku UMKM kesulitan mendapatkan eksposur pasar secara luas di ranah digital.
- Perangkat kelurahan tidak memiliki latar belakang IT, sehingga membutuhkan platform yang sangat mudah dikelola mandiri tanpa bantuan *developer* setelah masa KKN berakhir.

## 3. Goals & Success Metrics
**Goals:**
1. Membangun kehadiran online resmi untuk Kelurahan Palabuhanratu.
2. Meningkatkan visibilitas dan kemudahan akses produk UMKM lokal.
3. Memberikan alat pengelolaan konten mandiri yang intuitif bagi perangkat kelurahan.
4. Menjaga biaya operasional serendah mungkin (memanfaatkan free tier).

**Success Metrics (KPIs):**
- **Situs Berjalan:** Situs *live* dan dapat diakses dengan latensi rendah (< 3 detik di mobile).
- **Adopsi UMKM:** Minimal 20 UMKM terdaftar di direktori saat *handover*.
- **Kemandirian Admin:** 100% perangkat kelurahan yang ditugaskan (admin) berhasil mendemonstrasikan penambahan/pengeditan konten secara mandiri tanpa intervensi teknis selama *handover test*.
- **Biaya Infrastruktur:** Biaya operasional stabil di bawah Rp300.000/tahun (hanya untuk nama domain).

## 4. Target Users & Personas

**Persona 1: Warga / Pengunjung Umum (Budi - Sang Pencari Informasi)**
- **Demografi:** 18-50 tahun, pengguna HP Android murah, koneksi internet seringkali lambat.
- **Tujuan:** Mencari info persyaratan layanan KTP, melihat pengumuman desa, atau mencari tempat wisata lokal.
- **Kebutuhan:** Antarmuka responsif, loading cepat, info langsung *to the point*.

**Persona 2: Konsumen UMKM / Wisatawan (Siti - Sang Pembeli)**
- **Demografi:** 20-40 tahun, terbiasa berbelanja online, domisili dari luar kelurahan.
- **Tujuan:** Mencari produk lokal Palabuhanratu, menghubungi penjual via WhatsApp.
- **Kebutuhan:** Navigasi katalog produk yang mudah, detail kontak yang jelas, panduan arah (Google Maps).

**Persona 3: Admin / Perangkat Kelurahan (Pak Agus - Sang Pengelola)**
- **Demografi:** 30-55 tahun, staf administrasi kelurahan, kemampuan IT dasar (bisa memakai MS Word & sosmed).
- **Tujuan:** Memperbarui berita, menambahkan data UMKM, membalas aspirasi warga.
- **Kebutuhan:** Panel admin yang sederhana, bahasa Indonesia yang mudah dipahami, tidak ada istilah coding.

## 5. Scope

### 5.1 In Scope
- Halaman publik informatif: Beranda, Profil (Sejarah, Visi Misi, Geografi, Demografi), Pemerintahan, Peta interaktif.
- Direktori dinamis publik: UMKM, Produk, Wisata, Layanan Publik, Berita.
- Formulir kontak dan aspirasi warga.
- Sistem Panel Admin dengan autentikasi (username + password) dan fitur pemulihan (reset password).
- Fitur *Content Management System* (CRUD) untuk semua data dinamis (Wisata, UMKM, Berita, Layanan, Perangkat Desa, Peta).
- Manajemen aset gambar/media terintegrasi (R2).
- Ekspor / Backup data database via Panel Admin.

### 5.2 Out of Scope
- Registrasi, login, atau manajemen *user profile* untuk warga publik.
- Sistem *e-commerce*, *add to cart*, *checkout*, atau *payment gateway* langsung di situs (pembayaran & transaksi dilakukan di luar situs via WhatsApp atau QRIS offline).
- Sistem pelacakan dokumen/surat pengantar *end-to-end* (situs hanya menyediakan info syarat dan link pengajuan ke WA kelurahan).
- Database *record* kependudukan individual (hanya menampilkan statistik agregat).
- Fitur komentar atau *rating/review* di halaman UMKM atau Berita.

## 6. Functional Requirements (FR)

### Modul: Publik
| ID | Deskripsi | Prioritas | Acceptance Criteria (Given/When/Then) |
|---|---|---|---|
| FR-PUB-01 | Lihat Beranda | P0 | **Given** pengunjung mengakses root url `/`, **When** halaman dimuat, **Then** hero banner, statistik, sorotan UMKM, berita terbaru, dan form aspirasi tampil. |
| FR-PUB-02 | Lihat Profil & Demografi | P0 | **Given** pengunjung di `/profil`, **When** melihat bagian demografi, **Then** chart umur, pendidikan, dan pencaharian tampil berdasarkan data agregat. |
| FR-PUB-03 | Direktori UMKM | P0 | **Given** pengunjung di `/umkm`, **When** memilih filter kategori, **Then** daftar UMKM difilter sesuai kategori yang dipilih. |
| FR-PUB-04 | Detail UMKM & Kontak | P0 | **Given** pengunjung di halaman detail UMKM, **When** mengklik tombol WhatsApp, **Then** pengunjung diarahkan ke aplikasi WhatsApp dengan nomor penjual. |
| FR-PUB-05 | Direktori Wisata | P0 | **Given** pengunjung di `/wisata`, **When** halaman dimuat, **Then** daftar destinasi wisata aktif ditampilkan. |
| FR-PUB-06 | Peta Interaktif | P0 | **Given** pengunjung di `/peta`, **When** melihat peta Leaflet, **Then** pin untuk UMKM, wisata, dan fasilitas umum muncul sesuai koordinat. |
| FR-PUB-07 | Katalog Layanan Publik | P1 | **Given** pengunjung di `/layanan`, **When** mengklik layanan, **Then** deskripsi, syarat, dan tombol "Ajukan via WA" muncul. |
| FR-PUB-08 | Daftar Berita | P0 | **Given** pengunjung di `/berita`, **When** mengklik judul berita, **Then** halaman detail artikel berita terbuka. |
| FR-PUB-09 | Form Aspirasi | P1 | **Given** pengunjung mengisi form aspirasi dengan valid, **When** form di-submit, **Then** sistem menyimpan aspirasi dan menampilkan pesan sukses. |
| FR-PUB-10 | Struktur Pemerintahan | P1 | **Given** pengunjung di `/pemerintahan`, **When** di-scroll, **Then** daftar perangkat kelurahan tampil terurut berdasarkan hierarki. |

### Modul: Admin (Autentikasi & Akun)
| ID | Deskripsi | Prioritas | Acceptance Criteria (Given/When/Then) |
|---|---|---|---|
| FR-ADM-01 | Setup Admin Pertama | P0 | **Given** tidak ada user di database, **When** mengakses `/admin/setup` dan mengisi form, **Then** akun admin pertama dibuat dan setup dikunci. |
| FR-ADM-02 | Lock Setup | P0 | **Given** sudah ada admin di database, **When** mengakses `/admin/setup`, **Then** diarahkan ke halaman login. |
| FR-ADM-03 | Login Admin | P0 | **Given** admin berada di `/admin/login`, **When** memasukkan username/password benar, **Then** sesi dibuat dan diarahkan ke `/admin/dasbor`. |
| FR-ADM-04 | Akses Rute Admin Terlindungi | P0 | **Given** pengguna belum login, **When** mengakses `/admin/dasbor`, **Then** ditolak dan diarahkan ke halaman login. |
| FR-ADM-05 | Lupa Password | P1 | **Given** admin mengisi email terdaftar di form lupa password, **When** di-submit, **Then** link/token reset password dikirimkan ke email. |

### Modul: Admin (CMS / CRUD)
| ID | Deskripsi | Prioritas | Acceptance Criteria (Given/When/Then) |
|---|---|---|---|
| FR-ADM-06 | Dasbor Statistik | P0 | **Given** admin login, **When** berada di dasbor, **Then** melihat jumlah total wisata, UMKM, berita, dan pesan aspirasi baru. |
| FR-ADM-07 | Kelola UMKM (Tambah) | P0 | **Given** admin di `/admin/umkm`, **When** menambah UMKM dengan detail valid, **Then** UMKM baru tersimpan dengan status *draft/published*. |
| FR-ADM-08 | Kelola Produk UMKM | P0 | **Given** admin mengedit suatu UMKM, **When** menambah produk beserta harga, **Then** produk tersimpan dan berelasi dengan UMKM tersebut. |
| FR-ADM-09 | Kelola Berita (Editor HTML) | P0 | **Given** admin di form buat berita, **When** menulis teks dengan formatting, **Then** konten HTML tersimpan ke database. |
| FR-ADM-10 | Publish/Unpublish | P0 | **Given** entitas wisata/UMKM/berita berstatus *draft*, **When** diubah menjadi *published*, **Then** konten muncul di halaman publik. |
| FR-ADM-11 | Edit Teks Halaman Statis | P0 | **Given** admin di `/admin/konten/profil-sejarah`, **When** mengedit teks dan menyimpan, **Then** riwayat sejarah di `/profil` publik ikut berubah. |
| FR-ADM-12 | Kelola Galeri (Media) | P0 | **Given** admin di modul media, **When** mengunggah gambar, **Then** gambar tersimpan ke R2 dan record tersimpan di tabel media. |
| FR-ADM-13 | Kelola Titik Peta | P1 | **Given** admin di `/admin/peta`, **When** menambahkan koordinat *lat/lng* dan menyimpannya, **Then** pin baru muncul di halaman peta publik. |
| FR-ADM-14 | Kelola Perangkat Desa | P1 | **Given** admin di `/admin/perangkat`, **When** menambah perangkat (nama, jabatan, level), **Then** data tersimpan sesuai urutan level. |
| FR-ADM-15 | Pengaturan Situs (Kontak) | P0 | **Given** admin di `/admin/pengaturan`, **When** merubah nomor telepon dan menyimpannya, **Then** nomor kontak di Footer publik terupdate. |
| FR-ADM-16 | Edit Statistik Penduduk | P1 | **Given** admin mengedit JSON statistik umur di `/admin/pengaturan`, **When** disimpan, **Then** chart di halaman profil publik langsung terupdate. |
| FR-ADM-17 | Baca Aspirasi Warga | P1 | **Given** ada aspirasi baru, **When** admin melihat `/admin/aspirasi` dan membukanya, **Then** status berubah dari *baru* ke *dibaca*. |

### Modul: API & Sistem
| ID | Deskripsi | Prioritas | Acceptance Criteria (Given/When/Then) |
|---|---|---|---|
| FR-API-01 | Proteksi CSRF | P0 | **Given** request POST/PUT tanpa token CSRF valid, **When** mencapai endpoint admin, **Then** API merespons error 403 Forbidden. |
| FR-API-02 | Backup D1 (Export) | P1 | **Given** admin terautentikasi, **When** menekan tombol export di panel, **Then** file backup database SQLite (D1) terunduh. |
| FR-API-03 | Rate Limiting Login | P0 | **Given** user mencoba login gagal > 5 kali beruntun, **When** mencoba ke-6 kali, **Then** request ditolak sementara (Too Many Requests). |

## 7. Non-Functional Requirements (NFR)

| ID | Kategori | Deskripsi | Target Metrik |
|---|---|---|---|
| NFR-01 | Performa (Mobile) | Waktu muat halaman pertama di jaringan 3G/4G lambat. | LCP (Largest Contentful Paint) < 3.0 detik. |
| NFR-02 | Keamanan | Enkripsi kredensial administrator. | Algoritma hashing PBKDF2 SHA-256 (100.000 iterasi). |
| NFR-03 | Keamanan | Mencegah eksploitasi form dan data mutasi. | 100% POST/PUT/DELETE API dilindungi validasi CSRF Token. |
| NFR-04 | SEO | Keterbacaan halaman oleh *crawler* mesin pencari. | 100% halaman publik dirender menggunakan *Server-Side Rendering* (SSR). |
| NFR-05 | SEO | Navigasi *crawler*. | Tersedianya file `/sitemap.xml` dinamis. |
| NFR-06 | Skalabilitas | Batasan operasi per bulan dalam infrastruktur Cloudflare (Free Tier). | Mendukung hingga 100.000 req/hari tanpa biaya tambahan. |
| NFR-07 | UX/UI | Responsivitas tampilan antarmuka (Mobile First). | Tampil proporsional di lebar layar 320px hingga 1920px (Tailwind breakpoints). |
| NFR-08 | Aksesibilitas | Kontras warna teks dan elemen *action* utama. | Memenuhi standar WCAG 2.1 AA Contrast Ratio minimal 4.5:1. |
| NFR-09 | Media | Ukuran maksimal file gambar yang ditampilkan publik. | Otomatis konversi/resize thumbnail sehingga < 300KB per gambar via pipeline R2. |
| NFR-10 | Privasi Data | Pencegahan paparan PII (*Personally Identifiable Information*). | 0 data penduduk individual tersimpan di DB (statistik harus selalu format agregat JSON). |

## 8. Data Model Summary
Skema basis data menggunakan SQLite (Cloudflare D1) dengan tabel-tabel terelasi berikut:

| Tabel | Fungsi Utama | Relasi Kunci |
|---|---|---|
| `admin_user` | Akun autentikasi pengguna panel kontrol. | - |
| `page_section` | Blok teks halaman statis fleksibel (CMS). | - |
| `wisata` | Identitas destinasi pariwisata lokal. | `id` direferensikan di `media_link` |
| `umkm` | Data detail toko/usaha warga. | `id` direferensikan di `produk` & `media_link` |
| `produk` | Etalase barang dagangan UMKM tertentu. | FK `umkm_id` → `umkm(id)` |
| `berita` | Publikasi artikel dan pengumuman. | FK `cover_media_id` → `media(id)` |
| `media` | Record objek file (gambar) fisik yang tersimpan di R2. | `id` direferensikan polimorfik |
| `media_link` | Tabel *junction* polimorfik menghubungkan galeri. | FK `media_id`, relasi ke wisata/umkm/berita via `owner_type` |
| `titik_peta` | Pin kordinat marker untuk map Leaflet. | Opsional referensi slug ke entitas |
| `perangkat_desa`| Struktur bagan perangkat kelurahan. | - |
| `pengaturan` | Key-Value *store* untuk kontak dan *chart* agregat. | - |
| `aspirasi` | *Inbox* umpan balik/surat masuk dari warga. | - |

## 9. User Flows

### Flow 1: Pengunjung melihat detail UMKM dan menghubungi via WhatsApp
1. Pengunjung masuk ke halaman `/umkm`.
2. Pengunjung mengklik *chip* kategori "Kuliner" di *filter bar*.
3. Daftar UMKM otomatis memfilter toko makanan. Pengunjung memilih "Warung Ikan Bakar Bu Sari".
4. Halaman detail `/umkm/warung-ikan-bakar-bu-sari` terbuka; menampilkan galeri foto, deskripsi, alamat, dan daftar produk (menu ikan).
5. Pengunjung tertarik dan mengklik tombol melayang "Hubungi via WhatsApp".
6. Browser meminta izin untuk membuka aplikasi WhatsApp dengan isi pesan otomatis *"Halo Warung Ikan Bakar Bu Sari, saya melihat profil Anda di Website Kelurahan..."* terisi.
7. Komunikasi diteruskan di luar sistem.

### Flow 2: Admin membuat berita baru dengan foto
1. Staf kelurahan login di `/admin/login` dan masuk ke dasbor.
2. Dari panel menu kiri, admin mengklik "Berita", lalu "Tambah Berita Baru".
3. Admin mengisi judul pengumuman, menulis isi konten menggunakan editor teks *Rich-Text* (HTML).
4. Di bagian *Cover Image*, admin mengklik "Upload". File gambar lokal dikompres dan dikirim ke R2 via endpoint API.
5. Tabel `media` di-*update*, dan ID-nya otomatis disisipkan ke form.
6. Admin menset status dari *Draft* ke *Published*, lalu klik "Simpan".
7. Sistem melakukan mutasi D1. Artikel langsung dapat dibaca oleh publik di `/berita`.

### Flow 3: Admin pertama kali melakukan setup dan login (Initial Launch)
1. Pasca-deploy, sistem mendeteksi `admin_user` kosong. Semua akses ke `/admin/login` ditolak.
2. Operator (Tim KKN) mengakses `/admin/setup`.
3. Operator memasukkan username (misal: "adminloji"), email, dan password kuat.
4. Saat di-submit, sistem melakukan *hash* PBKDF2 pada password dan menyimpannya di D1, lalu merender halaman sukses.
5. Seseorang yang usil mencoba masuk ke `/admin/setup` lagi akan di-redirect ke `/admin/login`.
6. Operator login di `/admin/login` menggunakan username tadi. Server memvalidasi hash, menerbitkan token *session* ke KV, dan menanam cookie httpOnly di browser. Admin berhasil mengakses `/admin/dasbor`.

## 10. Risks & Mitigation
| Risiko | Dampak | Strategi Mitigasi |
|---|---|---|
| **Limitasi Free Tier R2 Penuh** | Gambar tidak bisa di-upload, web error. | Menambahkan validasi API kompresi sisi server (upload maks <3MB, convert otomatis ke WebP/Jpg ~300KB). |
| **Admin Panel Tidak Digunakan** | Data usang pasca-KKN (Abandoned project). | Merancang panel seminimalis mungkin dalam Bahasa Indonesia. Melatih 2 orang staf khusus saat *Handover*. |
| **Kehilangan/Lupa Akses Akun Admin** | Staf desa terkunci keluar sistem. | Menyediakan fitur Lupa Password via Email, serta dokumentasi instruksi *hard-reset* DB D1 via *command-line* di buku panduan. |
| **Data Statistik Mengandung PII** | Pelanggaran privasi UU PDP. | Menghilangkan tabel kependudukan di DB. Input statistik menggunakan form manual/agregat langsung ke JSON `pengaturan`. |

## 11. Dependencies & Constraints
**Dependencies (Ketergantungan Eksternal):**
- **Cloudflare Services**: Memerlukan ekosistem Cloudflare (Workers, D1, R2, KV) agar SSR Astro dapat berjalan normal. Pemadaman Cloudflare akan memengaruhi operasional situs.
- **Leaflet Map Tiles**: Memerlukan akses ke *tile server* (contoh: OpenStreetMap) pihak ketiga untuk me-render peta.

**Constraints:**
- Situs harus berjalan *Zero Cost* di awal masa rilis, tidak diperkenankan menggunakan *backend as a service* berbayar (Supabase Pro, AWS RDS, dll).
- Resolusi desain diasumsikan difokuskan 70% untuk pengguna layar vertikal (mobile-device), mengingat audiens pedesaan jarang memakai *desktop*.

## 12. Release / Handover Plan
- **Fase 1: Pre-Release (UAT)**
  - Audit Keamanan (Auth, CSRF).
  - *Data Seeding* konten awal kelurahan (sejarah, visi-misi, UMKM pilot) yang nyata.
- **Fase 2: Deploy Produksi**
  - Pemindahan domain ke `palabuhanratu.web.id`.
  - Pembuatan dan integrasi resource resmi Cloudflare D1, R2, dan KV di akun milik Kelurahan (bukan mahasiswa).
- **Fase 3: Pelatihan & Serah Terima (Handover)**
  - *Workshop* pelatihan dengan Staf Kelurahan (roleplay login, tambah UMKM, tambah berita).
  - Penyerahan Dokumen SOP "Buku Panduan Admin Desa Digital".
  - Penyerahan Kredensial Induk (Akun Cloudflare, Email Admin) secara fisik dan *soft-file*.
