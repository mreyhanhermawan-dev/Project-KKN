-- Migration 0007: Tambah kolom level ke perangkat_desa
-- level: 1=Kepala Kelurahan, 2=Sekretaris, 3=Staf/Pelaksana
ALTER TABLE perangkat_desa ADD COLUMN level INTEGER NOT NULL DEFAULT 3;

-- Update data yang sudah ada berdasarkan teks jabatan (supaya tidak perlu input ulang)
UPDATE perangkat_desa SET level = 1 WHERE lower(jabatan) LIKE '%kepala kelurahan%';
UPDATE perangkat_desa SET level = 2 WHERE lower(jabatan) LIKE '%sekretaris%';
