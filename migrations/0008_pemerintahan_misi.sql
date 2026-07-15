-- Migration 0008: Tambah section pemerintahan-misi ke page_section
-- Konten misi yang sebelumnya hardcode di pemerintahan.astro dipindahkan ke DB
-- supaya bisa diedit dari admin panel (Konten Halaman).
INSERT OR IGNORE INTO page_section (slug, title, content_html) VALUES (
  'pemerintahan-misi',
  'Misi Kelurahan',
  '<ol>
<li>Meningkatkan pelayanan publik yang transparan dan akuntabel.</li>
<li>Mengembangkan potensi pariwisata dan UMKM lokal.</li>
<li>Menjaga kelestarian lingkungan pesisir dan sumber daya alam.</li>
<li>Memperkuat partisipasi dan gotong royong masyarakat.</li>
</ol>'
);
