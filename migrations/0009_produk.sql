-- ── Story 4.2: Katalog Produk UMKM (One-to-Many Relationship) ──
CREATE TABLE IF NOT EXISTS produk (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  umkm_id INTEGER NOT NULL REFERENCES umkm(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  harga INTEGER DEFAULT 0,
  deskripsi_html TEXT DEFAULT '',
  status TEXT DEFAULT 'published',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Seed Produk untuk UMKM Kerajinan Bambu Loji
INSERT OR IGNORE INTO produk (slug, umkm_id, nama, harga, deskripsi_html, status) VALUES
  ('lampion-bambu-minimalis', (SELECT id FROM umkm WHERE slug = 'kerajinan-bambu-loji'), 'Lampion Bambu Minimalis', 120000, '<p>Lampion berbahan bambu pilihan dengan finishing halus. Cocok untuk penerangan hias di dalam maupun luar ruangan.</p>', 'published'),
  ('anyaman-bambu-hias', (SELECT id FROM umkm WHERE slug = 'kerajinan-bambu-loji'), 'Anyaman Bambu Hias', 75000, '<p>Kerajinan tangan anyaman bambu artistik buatan pengrajin lokal Desa Loji. Sangat elegan untuk dekorasi dinding.</p>', 'published'),
  ('tempat-tisu-bambu', (SELECT id FROM umkm WHERE slug = 'kerajinan-bambu-loji'), 'Tempat Tisu Bambu Modern', 35000, '<p>Kotak tempat tisu berbahan anyaman bambu ramah lingkungan dengan desain etnik modern.</p>', 'published');

-- Seed Produk untuk UMKM Warung Ikan Bakar Bu Sari
INSERT OR IGNORE INTO produk (slug, umkm_id, nama, harga, deskripsi_html, status) VALUES
  ('ikan-gurame-bakar-madu', (SELECT id FROM umkm WHERE slug = 'warung-ikan-bakar-bu-sari'), 'Ikan Gurame Bakar Madu', 65000, '<p>Ikan gurame segar dibakar dengan racikan bumbu kecap madu khas Sunda. Disajikan lengkap dengan sambal dan lalapan.</p>', 'published'),
  ('ikan-kue-bakar-bumbu-kuning', (SELECT id FROM umkm WHERE slug = 'warung-ikan-bakar-bu-sari'), 'Ikan Kue Bakar Bumbu Kuning', 55000, '<p>Hasil tangkapan nelayan pesisir Loji dibakar bumbu rempah kuning gurih dan kaya cita rasa.</p>', 'published'),
  ('cumi-goreng-tepung-crispy', (SELECT id FROM umkm WHERE slug = 'warung-ikan-bakar-bu-sari'), 'Cumi Goreng Tepung Crispy', 40000, '<p>Cumi olahan segar dipadukan tepung renyah khas Warung Bu Sari. Favorit keluarga.</p>', 'published');

-- Seed Produk untuk UMKM Kebun Sayur Pak Budi
INSERT OR IGNORE INTO produk (slug, umkm_id, nama, harga, deskripsi_html, status) VALUES
  ('paket-sayur-organik-segar', (SELECT id FROM umkm WHERE slug = 'kebun-sayur-pak-budi'), 'Paket Sayur Organik Segar', 25000, '<p>Paket komplit 5 jenis sayuran organik panen harian langsung dari Kebun Pak Budi.</p>', 'published'),
  ('bayam-organik-500g', (SELECT id FROM umkm WHERE slug = 'kebun-sayur-pak-budi'), 'Bayam Organik 500g', 10000, '<p>Bayam hijau segar tanpa pestisida kimia. Sehat dan kaya akan zat besi.</p>', 'published'),
  ('tomat-ceri-segar-250g', (SELECT id FROM umkm WHERE slug = 'kebun-sayur-pak-budi'), 'Tomat Ceri Segar 250g', 15000, '<p>Tomat ceri manis renyah kaya vitamin C, cocok untuk salad atau dikonsumsi langsung.</p>', 'published');
