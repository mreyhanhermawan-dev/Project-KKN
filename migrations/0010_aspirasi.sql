-- Tabel aspirasi masyarakat dari halaman /layanan
CREATE TABLE IF NOT EXISTS aspirasi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama TEXT NOT NULL,
  kontak TEXT,
  isi TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'baru', -- baru | dibaca
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_aspirasi_status_created
ON aspirasi(status, created_at DESC);
